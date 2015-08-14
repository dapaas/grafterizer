'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PreviewCtrl
 * @description
 * # PreviewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('PreviewCtrl', function(
    $scope,
    ontotextAPI,
    PipeService,
    $timeout,
    $rootScope,
    $stateParams,
    generateClojure,
    $mdToast,
    $mdDialog) {

    $scope.livePreview = true;
    $scope.selectedTabIndex = 0;
    
    // TODO IT DOES WORK
    $scope.$parent.showPreview = true;
    $scope.$on('$destroy', function() {
      hideDownloadButton(true);
      $scope.$parent.showPreview = false;
    });

    try {
      $scope.selectedDistribution = $stateParams.distribution ?
        window.atob($stateParams.distribution) : undefined;

    } catch (e) {
      $scope.distribution = null;
    }

    var previewTransformation = function(redirect) {
      var clojure = generateClojure.fromTransformation($scope.$parent.transformation);
      if (!clojure) return;
      PipeService.preview($scope.selectedDistribution, clojure)
            .success(function(data) {
              delete $scope.graftwerkException;
              $scope.data = data;
              if (redirect) {
                $timeout(function() {
                  $scope.selectedTabIndex = 0;
                });
              }

              showDownloadButton();
            }).error(function(data) {
              if (data) {
                if (data.edn && data.edn[':message']) {
                  $scope.graftwerkException = data.edn[':message'];
                } else if (data.json && data.json.error) {
                  $scope.graftwerkException = data.json.error;
                } else {
                  $scope.graftwerkException = data.raw;
                }

                // Delete the outdated data
                $scope.data = null;

                $timeout(function() {
                  $scope.selectedTabIndex = 0;
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

    var throttlePreview = _.throttle(function() {
      if ($scope.selectedDistribution) {
        previewTransformation(false);
      }
    }, 1000);

    $scope.$watch('transformation', function() {
      if ($scope.livePreview && $scope.transformation) {
        throttlePreview();
        fileSaved = false;
      }
    }, true);

    var fileSaved = false;
    $scope.$on('preview-request', function() {
      throttlePreview();
      fileSaved = true;
    });

    $scope.$watch('selectedDistribution', function() {
      if ($scope.selectedDistribution) {
        delete $scope.originalData;
        delete $scope.data;
        previewTransformation(true);
      }
    });

    $scope.loadOriginalData = function() {
      if ($scope.selectedDistribution) {
        PipeService.original($scope.selectedDistribution)
                .success(function(data) {
                  $scope.originalData = data;
                });
      }
    };

    var showDownloadButton = function() {
      var distribution = $scope.selectedDistribution;
      var transformation = $scope.$parent.id;

      $rootScope.$emit('addAction', {
        name: 'download',
        callback: function() {
          if ($rootScope.actions && $rootScope.actions.save) {
            // Save but without a preview
            $rootScope.actions.save(true);
          }

          var type = 'pipe';
          if ($rootScope.transformation.graphs &&
            $rootScope.transformation.graphs.length !== 0) {
            type = 'graft';
          }

          var downloadLink = PipeService.computeTuplesHref(
            distribution, transformation, type);

          var scopeDialog = $scope.$new(false);
          scopeDialog.downloadLink = downloadLink;
          scopeDialog.distribution = distribution;
          scopeDialog.transformation = transformation;

          // TODO
          // scopeDialog.dataset = selectedDataset;

          $mdDialog.show({
            templateUrl: 'views/computetriples.html',
            controller: 'ComputetriplesCtrl',
            scope: scopeDialog
          });
        }
      });
      $rootScope.$emit('removeAction', 'disabledDownload');
    };

    var hideDownloadButton = function(hideDisabledDownload) {
      $rootScope.$emit('removeAction', 'download');
      if (hideDisabledDownload) {
        $rootScope.$emit('removeAction', 'disabledDownload');
      } else {
        $rootScope.$emit('addAction', {
          name: 'disabledDownload',
          callback: true
        });
      }
    };

    hideDownloadButton();

  });
