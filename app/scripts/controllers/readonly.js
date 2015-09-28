'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:ReadonlyCtrl
 * @description
 * # ReadonlyCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('ReadOnlyCtrl', function ($scope, $controller, $rootScope) {
    $controller('TransformationCtrl', {$scope: $scope});
    
    $rootScope.hideToolbar = true;
    $scope.$on('$destroy', function() {
      delete $rootScope.hideToolbar;
    });

  });
