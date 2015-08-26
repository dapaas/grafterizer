'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:LoaddistributionCtrl
 * @description
 * # LoaddistributionCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('LoadDistributionCtrl', function($scope, $mdDialog, ontotextAPI, $stateParams) {

    ontotextAPI.datasets().success(function(data) {
      $scope.datasets = data['dcat:record'].reverse();

      var previewedDatasetIndex = _.findIndex($scope.datasets, function(dataset) {
        if (dataset['dct:title'] && dataset['dct:title'].match(/previewed datasets/i)) {
          return true;
        }
      });

      // If we have a previewed dataset and it's not the first in the list
      if (previewedDatasetIndex > 0) {
        var previewedDataset = $scope.datasets.splice(previewedDatasetIndex, 1)[0];
        $scope.datasets.unshift(previewedDataset);
      }
    });

    var selectedDataset;

    $scope.accordionExpandCallback = function(index) {
      selectedDataset = $scope.datasets[index/*-1*/];
      if (!selectedDataset) {
        return;
      }

      if (!selectedDataset.distributions) {
        selectedDataset.distributionsLoading = true;
      }

      ontotextAPI.dataset(selectedDataset['foaf:primaryTopic'])
        .success(function(data) {
          selectedDataset.distributionsLoading = false;
          selectedDataset.distributions = data['dcat:distribution'];

        }).error(function() {
          selectedDataset.distributionsLoading = false;
        });
    };

    $scope.selectedDistribution = $stateParams.distribution;

    $scope.load = function(distribution) {
      $mdDialog.hide(distribution);
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
