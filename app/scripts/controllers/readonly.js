'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:ReadonlyCtrl
 * @description
 * # ReadonlyCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('ReadOnlyCtrl', function(
    $scope,
    $controller,
    $rootScope,
    $stateParams) {
    $controller('TransformationCtrl', {
      $scope: $scope
    });

    $rootScope.hideToolbar = window !== window.top && !$stateParams.showToolbar;
    $scope.$on('$destroy', function() {
      delete $rootScope.hideToolbar;
    });

  });
