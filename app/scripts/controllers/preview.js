'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PreviewCtrl
 * @description
 * # PreviewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('PreviewCtrl', function ($scope, ontotextAPI) {
    // TODO IT DOES WORK
    $scope.$parent.showPreview = true;
    $scope.$on('$destroy', function(){
        $scope.$parent.showPreview = false;
    });

    ontotextAPI.datasets().success(function(data){
        $scope.datasets = data['dcat:record'].reverse();
    });

    $scope.accordionExpandCallback = function(index) {
        var selectedDataset = $scope.datasets[index/*-1*/];
        if (!selectedDataset) {
            return;
        }
        if (!selectedDataset.distributions) {
            selectedDataset.distributionsLoading = true;
        }
        ontotextAPI.dataset(selectedDataset['foaf:primaryTopic'])
        .success(function(data){
            selectedDataset.distributionsLoading = false;
            selectedDataset.distributions = data['dcat:distribution'];
        }).error(function(){
            selectedDataset.distributionsLoading = false;
        });
    };
  });
