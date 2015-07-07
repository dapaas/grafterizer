'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:DistributionCtrl
 * @description
 * # DistributionCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('DistributionCtrl', function(
    $scope,
    $stateParams,
    ontotextAPI,
    $state
  ) {
    var id = $scope.id = $stateParams.id;

    $scope.document = {
      title: 'loading'
    };

    ontotextAPI.distribution(id).success(function(data) {
      $scope.document = data;
      $scope.document.title = data['dct:title'];
      $scope.json = JSON.stringify(data, null, '  ');
    }).error(function() {
      $state.go('datasets');
    });
  });
