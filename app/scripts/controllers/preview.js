'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PreviewCtrl
 * @description
 * # PreviewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('PreviewCtrl', function (
    $scope,
    ontotextAPI,
    PipeService,
    $timeout,
    $stateParams,
    generateClojure,
    $mdToast) {
    
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
        var clojure = generateClojure.fromTransformation($scope.$parent.transformation);
        PipeService.preview($scope.selectedDistribution, clojure)
            .success(function(data) {
                delete $scope.graftwerkException;
                $scope.data = data;
                if (redirect) {
                    $timeout(function () {
                        $scope.selectedTabIndex = 2;
                    });
                }
            }).error(function(data) {
                if (data) {
                    $scope.graftwerkException = data.raw;
                    // $scope.data = data;
                    $timeout(function () {
                        $scope.selectedTabIndex = 2;
                    });
                } else {
                    $mdToast.show(
                      $mdToast.simple()
                        .content('Unable to load the transformation')
                        .position('bottom left')
                        .hideDelay(6000)
                      );
                }
            });
    };

    var throttlePreview = _.throttle(function(){
        if ($scope.selectedDistribution) {
            previewTransformation(false);
        }
    }, 1000);

    $scope.$watch('transformation', function(){
      if ($scope.transformation){
        throttlePreview();
      }
    }, true);

    $scope.$on('preview-request', throttlePreview);

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
