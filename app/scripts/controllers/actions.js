'use strict';

angular.module('grafterizerApp')
  .controller('ActionsCtrl', function ($scope, $rootScope, $state) {

  	$rootScope.$watch('actions', function(){
      for (var key in $rootScope.actions) {
        $scope[key] = $rootScope.actions[key];
      }
    });

    $rootScope.$on('addAction', function(ev, data){
      $scope[data.name] = data.callback;
    });
    $rootScope.$on('removeAction', function(ev, data){
      delete $scope[data];
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

    if (!$state.is('transformations.new')) {
      $scope.$watch('previewTransformation', function(){
        if ($scope.previewTransformation) {
          $state.go('transformations.transformation.preview');
        } else {
          $state.go('transformations.transformation');
        }
      });
    }
  });
