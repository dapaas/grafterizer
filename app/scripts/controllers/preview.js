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
  
  // TODO fixme - slightly dusty hack - replace with something more "elegant"
  $scope.hideDisabledDownload = false;
  var hideDownloadButton = function(hideDisabledDownload) {
    $scope.hideDisabledDownload = hideDisabledDownload;
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

  hideDownloadButton(false);

  var paginationSize = 100;

  $scope.livePreview = !(window.sessionStorage && window.sessionStorage.livePreview === 'false');
  $scope.selectedTabIndex = 0;

  // TODO IT DOES WORK
  $scope.$parent.showPreview = true;
  $scope.$on('$destroy', function() {

    if ($scope.hideDisabledDownload) {
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

  var savedGeneratedClojure;
  var currentPreviewPage = 0;
  var previewTransformation = function(redirect) {
    var clojure = generateClojure.fromTransformation($scope.$parent.transformation);
    savedGeneratedClojure = clojure;
    currentPreviewPage = 0;

    if (!clojure) return;

    PipeService.preview($scope.selectedDistribution, clojure, 0, paginationSize)
      .then(function(data) {
      delete $scope.graftwerkException;
      $scope.data = data;
      if (redirect) {
        $timeout(function() {
          $scope.selectedTabIndex = 0;
        });
      }

      showDownloadButton();
    },

    function(data) {
      if (data) {
        if (data.edn && data.edn[':message']) {
          $scope.graftwerkException = data.edn[':message'];
        } else if (data.json && data.json.error) {
          $scope.graftwerkException = data.json.error;
        } else {
          $scope.graftwerkException = data.raw;
        }

        if ($scope.graftwerkException.match(/(out of memory|timed out)/i)) {
          $mdDialog.show(
            $mdDialog.alert()
              .title($scope.graftwerkException)
              .content('The provided input file could not be transformed with the specified transformation due to an exceeded processing quota. We are aware of the limitation and will be extending the quotas in the near future.')
              .ok('Ok')
          );
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

      hideDownloadButton(false);
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

  $scope.$watch('livePreview', function(newValue, oldValue) {
    if (newValue === true && oldValue === false) {
      previewTransformation(false);
    }
  });

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
    if ($scope.originalData) return;

    if ($scope.selectedDistribution) {
      PipeService.original($scope.selectedDistribution, 0, paginationSize)
        .then(function(data) {
        $scope.originalData = data;
      });
    }
  };

  $scope.loadMorePreview = function(callback) {
    if (!savedGeneratedClojure) return;
    PipeService.preview($scope.selectedDistribution,
                        savedGeneratedClojure,
                        ++currentPreviewPage, paginationSize)
      .then(function(data) {
      if ($scope.data && $scope.data.edn && data && data.edn) {
        callback(undefined, data.edn);
      } else {
        callback(true);
      }
    },

    function() {
      callback(true);
    });
  };

  $scope.loadMoreOriginal = function(callback) {
    if ($scope.selectedDistribution) {
      PipeService.original($scope.selectedDistribution, ++currentOriginalPage, paginationSize)
        .then(function(data) {
        if (data && data.edn) {
          callback(undefined, data.edn);
        } else {
          callback(true);
        }
      },

      function() {
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
          scope: scopeDialog,
          clickOutsideToClose: true
        });
      }
    });
    $rootScope.$emit('removeAction', 'disabledDownload');
  };

});
