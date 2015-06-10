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
    $mdDialog) {

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

    $rootScope.actions = {
      save: function(){
        var update = angular.copy($scope.document);
        update['dct:title'] = update.title;
        update['dct:description'] = update.description;
        update['dct:modified'] = moment().format("YYYY-MM-DD");
        delete update.title;
        delete update.description;
        delete update['dct:publisher'];
        console.log(update);
        console.log(JSON.stringify(update));

        ontotextAPI.updateTransformation(update)
          .success(function(data){
            console.log(data);
            console.log("oh yeah");
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
        var transformationJSON = JSON.stringify($scope.transformation);
        ontotextAPI.newTransformation({
            '@context': ontotextAPI.getContextDeclaration(),
            '@type': 'dcat:Transformation',
            'dct:title': $scope.document.title+"-fork",
            'dct:description': $scope.document.description,
            'dct:public': $scope.document['dct:public'],
            'dct:modified': moment().format("YYYY-MM-DD")
          }, "this is clojure", transformationJSON)
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
