'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:ApikeyCtrl
 * @description
 * # ApikeyCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('ApikeyCtrl', function($scope, apiKeyService, $state, $mdToast) {
    $scope.key = apiKeyService.getKey();
    $scope.secret = apiKeyService.getSecret();

    $scope.apply = function() {
      apiKeyService.setKeyPass($scope.key + ':' + $scope.secret);
      apiKeyService.save();
      $mdToast.show(
        $mdToast.simple()
        .content("API key registered")
        .position('bottom left')
        .hideDelay(3000)
      );
      $state.go('transformations')
    };
  });
