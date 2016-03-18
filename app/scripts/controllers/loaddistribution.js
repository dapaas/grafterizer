'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:LoaddistributionCtrl
 * @description
 * # LoaddistributionCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('LoadDistributionCtrl', function($scope, $mdDialog, backendService, $stateParams) {

    backendService.dataDistributions().success(function(data) {
      $scope.dataDistributions = data['dcat:record'];
    });

    $scope.load = function(distribution) {
      $mdDialog.hide(distribution);
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
