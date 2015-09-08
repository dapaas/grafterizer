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

    var paginationSize = 100;

    $scope.livePreview = !(window.sessionStorage && window.sessionStorage.livePreview === 'false');
    $scope.selectedTabIndex = 0;
    
    // TODO IT DOES WORK
    $scope.$parent.showPreview = true;
    $scope.$on('$destroy', function() {
      if (hideDisabledDownload) {
        hideDownloadButton(true);
      }

      $scope.$parent.showPreview = false;
    });

    try {
      $scope.selectedDistribution = $stateParams.distribution ?
        window.atob($stateParams.distribution) : undefined;

    } catch (e) {
      $scope.distribution = null;
    }

    if (!$scope.selectedDistribution) {
      $scope.go('^');
    }

    var savedGeneratedClojure;
    var currentPreviewPage = 0;
    var previewTransformation = function(redirect) {
      var clojure = generateClojure.fromTransformation($scope.$parent.transformation);
      savedGeneratedClojure = clojure;
      currentPreviewPage = 0;

      if (!clojure) return;

      PipeService.preview($scope.selectedDistribution, clojure, 0, paginationSize)
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

    if (window.sessionStorage) {
      $scope.$watch('livePreview', function() {
        window.sessionStorage.livePreview = $scope.livePreview ? 'true' : 'false';
      });
    }

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

    var currentOriginalPage = 0;
    $scope.loadOriginalData = function() {
      // TODO CHECK distribution change
      if ($scope.originalData) return;

      if ($scope.selectedDistribution) {
        PipeService.original($scope.selectedDistribution, 0, paginationSize)
                .success(function(data) {
                  $scope.originalData = data;
                });
      }
    };

    $scope.loadMorePreview = function(callback) {
      if (!savedGeneratedClojure) return;
      PipeService.preview($scope.selectedDistribution,
        savedGeneratedClojure,
        ++currentPreviewPage, paginationSize)
        .success(function(data) {
          if ($scope.data && $scope.data.edn && data && data.edn) {
            callback(undefined, data.edn);
          } else {
            callback(true);
          }
        }).error(function() {
          callback(true);
        });
    };

    $scope.loadMoreOriginal = function(callback) {
      if ($scope.selectedDistribution) {
        PipeService.original($scope.selectedDistribution, ++currentOriginalPage, paginationSize)
          .success(function(data) {
            if (data && data.edn) {
              callback(undefined, data.edn);
            } else {
              callback(true);
            }
          }).error(function() {
            callback(true);
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

          var scopeDialog = $scope.$new(false);
          scopeDialog.distribution = distribution;
          scopeDialog.transformation = transformation;
          scopeDialog.type = type;

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

  });
