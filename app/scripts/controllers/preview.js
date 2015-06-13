'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PreviewCtrl
 * @description
 * # PreviewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('PreviewCtrl', function ($scope, ontotextAPI, PipeService, $timeout, $stateParams) {
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


    $scope.selectedDistribution = $stateParams.distribution;

    var previewTransformation = function (redirect){
        PipeService.preview($scope.selectedDistribution, $scope.$parent.id)
            .success(function(data) {
                $scope.data = data;
                if (redirect) {
                    $timeout(function () {
                        $scope.selectedTabIndex = 2;
                    });
                }
            }).error(function(data) {
                $scope.data = data;
                $timeout(function () {
                    $scope.selectedTabIndex = 3;
                });
            });
    };

    $scope.$on('preview-request', function(){
        if ($scope.selectedDistribution) {
            previewTransformation(false);
        }
    });
    $scope.$watch('selectedDistribution', function(){
        if ($scope.selectedDistribution) {
            delete $scope.originalData; 
            previewTransformation(true);
        }
    });

    $scope.loadOriginalData = function(){
        if ($scope.selectedDistribution) {
            PipeService.original($scope.selectedDistribution)
                .success(function(data) {
                    $scope.originalData = data;
                });
        }
    };
  });
