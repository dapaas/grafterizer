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
    Transformation,
    $rootScope,
    $state,
    $mdToast,
    $mdDialog) {

  	var id = $scope.id = $stateParams.id;

  	Transformation.findById({
  		id: id
  	}, function(value){
  		// todo merge
  		$scope.document = {
  			title: value.name,
        	description: value.metadata
  		};
  	}, function(error){
      $mdToast.show(
        $mdToast.simple()
          .content('Error: '+error.statusText)
          .position('right top')
          .hideDelay(6000)
      );
  	});

    $rootScope.actions = {
      save: function(){
        Transformation.prototype$updateAttributes({
          id: id
        }, {
          name: $scope.document.title,
          metadata: $scope.document.description
          //clojure
        });
      },
      delete: function(ev) {
        var confirm = $mdDialog.confirm()
          .title('Do you really want to delete this transformation?')
          .content('It\'s a nice transformation')
          .ariaLabel('Deletion confirmation')
          .ok('Please do it!')
          .cancel('Finally no, I like it')
          .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
          Transformation.deleteById({id: id}).$promise.then(function(){
            $state.go('transformations');
            $mdToast.show(
              $mdToast.simple()
                .content('Transformation "'+$scope.document.title+'" deleted')
                .position('right top')
                .hideDelay(6000)
            );
          });
        });
      }
    };
  });
