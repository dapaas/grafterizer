'use strict';

angular.module('grafterizerApp')
  .controller('ActionsCtrl', function ($scope, $rootScope, $state) {
  	$rootScope.$watch('actions', function(){
  		for (var key in $rootScope.actions) {
  			$scope[key] = $rootScope.actions[key];
  		}
  	});

  	$scope.$on('$destroy', function(){
  		delete $rootScope.actions;
  	});

    // I know it's not beautiful to mix everything but it's the weekend
    var computeTransformationSwitch = function(event, toState){
      $scope.transformationState = $state.includes('transformations.transformation');
      $scope.previewTransformation = $state.is('transformations.transformation.preview');
    };

    $rootScope.$on('$stateChangeSuccess', computeTransformationSwitch);
    computeTransformationSwitch();
    
    $scope.$watch('previewTransformation', function(){
      if ($scope.previewTransformation) {
        $state.go('transformations.transformation.preview');
      } else {
        $state.go('transformations.transformation');
      }
    });
  });
