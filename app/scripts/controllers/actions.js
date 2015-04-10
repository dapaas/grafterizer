'use strict';

angular.module('grafterizerApp')
  .controller('ActionsCtrl', function ($scope, $rootScope) {
  	$rootScope.$watch('actions', function(){
  		for (var key in $rootScope.actions) {
  			$scope[key] = $rootScope.actions[key];
  		}
  	});

  	$scope.$on('$destroy', function(){
  		delete $rootScope.actions;
  	});
  });
