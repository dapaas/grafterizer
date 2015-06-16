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
    $rootScope,
    $stateParams,
    generateClojure,
    $mdToast) {
    
    // TODO IT DOES WORK
    $scope.$parent.showPreview = true;
    $scope.$on('$destroy', function(){
        hideDownloadButton();
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
                showDownloadButton();
            }).error(function(data) {
                if (data) {
                    if (data.edn && data.edn[":message"]) {
                        $scope.graftwerkException = data.edn[":message"];
                    } else {
                        $scope.graftwerkException = data.raw;
                    }
                    // $scope.data = data;
                    $timeout(function () {
                        $scope.selectedTabIndex = 2;
                    });
                } else {
                    delete $scope.graftwerkException;
                    $mdToast.show(
                      $mdToast.simple()
                        .content('Unable to load the transformation')
                        .position('bottom left')
                        .hideDelay(6000)
                      );
                }
                hideDownloadButton();
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
        fileSaved = false; 
      }
    }, true);

    var fileSaved = false;
    $scope.$on('preview-request', function(){
        throttlePreview();
        fileSaved = true;
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

    var showDownloadButton = function(){
        if (!fileSaved) {
            return;
        }
        var link = PipeService.computeTuplesHref(
            $scope.selectedDistribution, $scope.$parent.id);

        $rootScope.$emit('addAction', {
            name: 'download',
            callback: function(){
                window.open(link,'_blank');
            }
        });
    };

    var hideDownloadButton = function(){
        $rootScope.$emit('removeAction', 'download');
    };
  });
