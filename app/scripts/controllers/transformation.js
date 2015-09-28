'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:TransformationCtrl
 * @description
 * # TransformationCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('TransformationCtrl', function(
    $scope,
    $stateParams,
    ontotextAPI,
    uploadFile,
    $rootScope,
    $state,
    $mdToast,
    $mdDialog,
    transformationDataModel,
    generateClojure) {

    var id = $scope.id = $stateParams.id;
    $scope.document = {
      title: 'transformation loading',
      keywords: []
    };

    $scope.loading = true;
    $rootScope.readonlymode = true;

    // setTimeout(function() {
    ontotextAPI.transformation(id).success(function(data) {
      $scope.loading = false;
      $rootScope.readonlymode = $state.is('readonly');
      $scope.document = data;
      $scope.document.title = data['dct:title'];
      $scope.document.description = data['dct:description'];
      $scope.document.keywords = data['dcat:keyword'];

      if (!$scope.document.keywords ||
        typeof $scope.document.keywords.length === 'undefined') {
        $scope.document.keywords = [];
      } else {
        $scope.document.keywords.sort();
      }
    }).error(function() {
      $rootScope.readonlymode = $state.is('readonly');
      $state.go('transformations');
    });
  // }, 40)

    // ontotextAPI.getClojure(id).success(function(data){
    //     $scope.clojure = data;
    // });

    var loadEmptyTransformation = function() {
      var pipeline = new transformationDataModel.Pipeline([]);
      $scope.transformation = new transformationDataModel.Transformation([], [], [
        pipeline], []);
      $rootScope.transformation = $scope.transformation;
      $scope.pipeline = pipeline;
    };

    ontotextAPI.getJson(id).success(function(data) {
      var transformation;
      if (data.__type === 'Transformation') {
        transformation = transformationDataModel.Transformation.revive(
          data);
      } else {
        $mdToast.show(
          $mdToast.simple()
          .content('Transformation unfound in the save file')
          .position('bottom left')
          .hideDelay(6000)
        );
        return loadEmptyTransformation();
      }

      $scope.transformation = transformation;
      $rootScope.transformation = $scope.transformation;
      if (transformation.pipelines && transformation.pipelines.length) {
        $scope.pipeline = transformation.pipelines[0];
      } else {
        $scope.pipeline = new transformationDataModel.Pipeline([]);
        transformation.pipelines = [$scope.pipeline];
      }
    }).error(loadEmptyTransformation);

    $scope.$watch('fileUpload', function() {
      if ($scope.fileUpload) {
        if ($rootScope.readonlymode) {
          $mdToast.show(
            $mdToast.simple()
            .content($scope.loading ?
              'Please wait the transformation loading before uploading files' :
              'File upload is disabled in readonly mode')
            .position('bottom left')
            .hideDelay(6000)
          );
          delete $scope.fileUpload;
          return;
        }

        var file = $scope.fileUpload;

        uploadFile.upload(file, function(data) {
          $state.go('transformations.transformation.preview', {
            id: $stateParams.id,
            distribution: data['@id']
          });
        });
        
      }
    });

    $scope.$watch('rejectedFileUpload', function() {
      if ($scope.rejectedFileUpload && $scope.rejectedFileUpload.length) {
        delete $scope.rejectedFileUpload;
        $mdToast.show(
          $mdToast.simple()
          .content('The file is not valid. It should be a CSV file smaller than 10Mio')
          .position('bottom left')
          .hideDelay(6000)
        );
      }
    });

    $rootScope.actions = {
      save: function(noPreviewRequest) {
        var update = angular.copy($scope.document);
        update['dct:title'] = update.title;
        update['dct:description'] = update.description;
        update['dct:modified'] = moment().format('YYYY-MM-DD');
        update['dcat:public'] = $scope.document['dct:public'] ? 'true' :
          'false';

        var transformationType = 'pipe';
        var transformationCommand = 'my-pipe';

        if ($scope.transformation.graphs &&
          $scope.transformation.graphs.length !== 0) {
          transformationType = 'graft';
          transformationCommand = 'my-graft';
        }

        update['dcat:transformationType'] = transformationType;
        update['dcat:transformationCommand'] = transformationCommand;

        delete update.title;
        delete update.description;
        delete update['dct:clojureDataID'];
        delete update['dct:jsonDataID'];
        delete update['dct:publisher'];

        var clojure = generateClojure.fromTransformation($scope.transformation);

        ontotextAPI.updateTransformation(update, clojure, $scope.transformation)
          .success(function() {
            if (!noPreviewRequest) {
              $scope.$broadcast('preview-request');
            }
          });
      },

      delete: function(ev) {
        var confirm = $mdDialog.confirm()
          .title('Do you really want to delete this transformation?')
          .content('It\'s a nice transformation')
          .ariaLabel('Deletion confirmation')
          .ok('Please do it!')
          .cancel('I changed my mind, I like it')
          .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
          ontotextAPI.deleteTransformation(id).success(function() {
            $state.go('transformations');
            $mdToast.show(
              $mdToast.simple()
              .content('Transformation "' + $scope.document.title +
                '" deleted')
              .position('bottom left')
              .hideDelay(6000)
            );
          });
        });
      },

      fork: function(ev) {
        var clojure = generateClojure.fromTransformation($scope.transformation);

        var transformationType = 'pipe';
        var transformationCommand = 'my-pipe';

        if ($scope.transformation.graphs &&
          $scope.transformation.graphs.length !== 0) {
          transformationType = 'graft';
          transformationCommand = 'my-graft';
        }

        ontotextAPI.newTransformation({
            '@context': ontotextAPI.getContextDeclaration(),
            '@type': 'dcat:Transformation',
            'dct:title': $scope.document.title + '-fork',
            'dct:description': $scope.document.description,
            'dcat:public': $scope.document['dct:public'] ? 'true' : 'false',
            'dct:modified': moment().format('YYYY-MM-DD'),
            'dcat:keyword': $scope.document.keywords,
            'dcat:transformationType': transformationType,
            'dcat:transformationCommand': transformationCommand
          }, clojure, $scope.transformation)
          .success(function(data) {
            $mdToast.show(
              $mdToast.simple()
              .content('Transformation forked')
              .position('bottom left')
              .hideDelay(6000)
            );
            $state.go('transformations.transformation', {
              id: data['@id']
            });
          });
      }
    };

    $scope.editPrefixers = function() {
      $scope.originalPrefixers = [];
      angular.copy($scope.transformation.prefixers, $scope.originalPrefixers);
      $mdDialog.show({
        templateUrl: 'views/editprefixes.html',
        controller: 'EditprefixersCtrl',
        scope: $scope.$new(false, $scope),
        clickOutsideToClose: true
      }).then(
      function() {},

      function() {
        angular.copy($scope.originalPrefixers, $scope.transformation.prefixers);
      });
    };

    $scope.defineCustomFunctions = function() {
      $scope.originalCustomFunctionDeclarations = [];
      angular.copy($scope.transformation.customFunctionDeclarations, $scope
        .originalCustomFunctionDeclarations);
      $mdDialog.show({
        templateUrl: 'views/createcustomfunction.html',
        controller: 'CustomfunctionsdialogcontrollerCtrl',
        scope: $scope.$new(false, $scope),
        clickOutsideToClose: true
      }).then(
        function() {},

        function() {
          angular.copy($scope.originalCustomFunctionDeclarations, $scope.transformation
            .customFunctionDeclarations);
        });
    };

    $scope.loadDistribution = function() {
      $mdDialog.show({
        templateUrl: 'views/loaddistribution.html',
        controller: 'LoadDistributionCtrl',
        scope: $scope.$new(false),
        clickOutsideToClose: true
      }).then(function(distribution) {
        $state.go('transformations.transformation.preview', {
          id: $stateParams.id,
          distribution: distribution
        });
      });
    };

    // Save the selected md-tab panel in session because we can
    $scope.transformationSelectedTabIndex =
      window.sessionStorage && window.sessionStorage.transformationSelectedTabIndex ?
        (parseInt(window.sessionStorage.transformationSelectedTabIndex) || 0) : 0;
    $scope.$watch('transformationSelectedTabIndex', function(newValue) {
        window.sessionStorage.transformationSelectedTabIndex = newValue;
    });
  });
