'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:TransformationCtrl
 * @description
 * # TransformationCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('TransformationCtrl', function (
    $scope,
    $stateParams,
    ontotextAPI,
    $rootScope,
    $state,
    $mdToast,
    $mdDialog,
    transformationDataModel,
    generateClojure,
    persistentTabs) {

    var id = $scope.id = $stateParams.id;
    $scope.document = {
        title: 'loading'
    };

    ontotextAPI.transformation(id).success(function(data){
        $scope.document = data;
        $scope.document.title = data['dct:title'];
        $scope.document.description = data['dct:description'];
    }).error(function(){
        $state.go('transformations');
    });

    // ontotextAPI.getClojure(id).success(function(data){
    //     $scope.clojure = data;
    // });

    var loadEmptyTransformation = function(){
        var pipeline = new transformationDataModel.Pipeline([]);
        $scope.transformation = new transformationDataModel.Transformation([], [], [pipeline], []);
        $scope.pipeline = pipeline;
    };

    ontotextAPI.getJson(id).success(function(data){
        var transformation;
        if (data['__type'] === 'Transformation') {
            transformation = transformationDataModel.Transformation.revive(data);
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
        if (transformation.pipelines && transformation.pipelines.length) {
            $scope.pipeline = transformation.pipelines[0]; 
        } else {
            $scope.pipeline = new transformationDataModel.Pipeline([]);
            transformation.pipelines = [$scope.pipeline];
        }
    }).error(loadEmptyTransformation);

    $scope.$watch('fileUpload', function() {
      if ($scope.fileUpload && $scope.fileUpload[0]) {
        var file = $scope.fileUpload[0];

        var metadata = {
              '@context': ontotextAPI.getContextDeclaration(),
              '@type': 'dcat:Distribution',
              'dct:title': "preview",
              'dct:description': "Distribution uploaded in preview mode",
              'dcat:fileName': file.name,
              'dcat:mediaType': file.type
          };
        ontotextAPI.uploadDistribution(
          "http://dapaas.eu/users/1505271111/dataset/all_data_korea-1",
          file, metadata).success(function(data){
            $state.go("transformations.transformation.preview", {
              id: $stateParams.id,
              distribution: data['@id']
            });
        });

        // $state.go
      }
    });

    $rootScope.actions = {
      save: function(){
        var update = angular.copy($scope.document);
        update['dct:title'] = update.title;
        update['dct:description'] = update.description;
        update['dct:modified'] = moment().format("YYYY-MM-DD");
        update['dcat:public'] = $scope.document['dct:public'] ? 'true' : 'false';
        delete update.title;
        delete update.description;
        delete update['dct:clojureDataID'];
        delete update['dct:jsonDataID'];
        delete update['dct:publisher'];

        var clojure = generateClojure.fromTransformation($scope.transformation);

        ontotextAPI.updateTransformation(update, clojure, $scope.transformation)
          .success(function(){
            $scope.$broadcast('preview-request');
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
          ontotextAPI.deleteTransformation(id).success(function(){
            $state.go('transformations');
            $mdToast.show(
              $mdToast.simple()
                .content('Transformation "'+$scope.document.title+'" deleted')
                .position('bottom left')
                .hideDelay(6000)
            );
          });
        });
      },
      fork: function(ev) {
        var clojure = generateClojure.fromTransformation($scope.transformation);

        ontotextAPI.newTransformation({
            '@context': ontotextAPI.getContextDeclaration(),
            '@type': 'dcat:Transformation',
            'dct:title': $scope.document.title+"-fork",
            'dct:description': $scope.document.description,
            'dcat:public': $scope.document['dct:public'] ? 'true' : 'false',
            'dct:modified': moment().format("YYYY-MM-DD"),
            'dcat:transformationType': 'pipe',
            'dcat:transformationCommand': 'my-pipe'
          }, clojure, $scope.transformation)
          .success(function(data){
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

    $scope.editPrefixers = function () {
        $scope.originalPrefixers = [];
        angular.copy($scope.transformation.prefixers, $scope.originalPrefixers);
        $mdDialog.show({
            templateUrl: 'views/editprefixes.html',
            controller: 'EditprefixersCtrl',
            scope: $scope.$new(false, $scope)
        }).then(function() {
        }, function() {
            angular.copy($scope.originalPrefixers, $scope.transformation.prefixers);
        });
    };

    $scope.defineCustomFunctions = function () {
        $scope.originalCustomFunctionDeclarations = [];
        angular.copy($scope.transformation.customFunctionDeclarations, $scope.originalCustomFunctionDeclarations);
        $mdDialog.show({
            templateUrl: 'views/createcustomfunction.html',
            controller: 'CustomfunctionsdialogcontrollerCtrl',
            scope: $scope.$new(false, $scope)
        }).then(function() {
        }, function() {
            angular.copy($scope.originalCustomFunctionDeclarations, $scope.transformation.customFunctionDeclarations);
        }); 
    };

    // TODO the scope is not updated correctly :/ (pipeline is empty)
    // We should try again later, might be a bug with md-tabs 
    //persistentTabs.bind($scope, "selectedTabIndex", "transformation");
});
