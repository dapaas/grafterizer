'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:ReadonlyCtrl
 * @description
 * # ReadonlyCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('ReadOnlyCtrl', function($scope, $controller, $rootScope) {
    $controller('TransformationCtrl', {
      $scope: $scope
    });

    $rootScope.hideToolbar = window !== window.top;
    $scope.$on('$destroy', function() {
      delete $rootScope.hideToolbar;
    });

  });
