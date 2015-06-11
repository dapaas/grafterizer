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
    generateClojure) {

    var id = $scope.id = $stateParams.id;
    $scope.document = {
        title: 'loading'
    };

    ontotextAPI.transformation(id).success(function(data){
        $scope.document = data;
        $scope.document.title = data['dct:title'];
        $scope.document.description = data['dct:description'];
    }).error(function(){
        $state.go('^');
    });

    ontotextAPI.getClojure(id).success(function(data){
        console.log(data);
        $scope.clojure = data;
    });

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
            var prefixer = new transformationDataModel.Prefixer("examplePrefixer", "http://www.asdf.org/#/");
            var customFunctionDeclaration = new transformationDataModel.CustomFunctionDeclaration("exampleCustomFunct", "(defn example asdf)");
            var pipeline = new transformationDataModel.Pipeline([]);
            transformation = new transformationDataModel.Transformation([customFunctionDeclaration], [prefixer], [pipeline], []);
        }

        console.log(transformation);
        $scope.transformation = transformation; 
        if (transformation.pipelines && transformation.pipelines.length) {
            $scope.pipeline = transformation.pipelines[0]; 
        } else {
            $scope.pipeline = new transformationDataModel.Pipeline([]);
            transformation.pipelines = [$scope.pipeline];
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

        ontotextAPI.updateTransformation(update, clojure, $scope.transformation);
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
});
