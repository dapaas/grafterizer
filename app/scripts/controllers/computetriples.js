'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:ComputetriplesCtrl
 * @description
 * # ComputetriplesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('ComputetriplesCtrl', function(
    $scope,
    $rootScope,
    $mdDialog,
    $stateParams,
    ontotextAPI,
    PipeService,
    datagraftPostMessage,
    jarfterService,
    $sanitize) {

    try {
      $scope.distribution = $stateParams.distribution ?
        window.atob($stateParams.distribution) : undefined;
    } catch (e) {
      $scope.distribution = null;
    }

    $scope.transformation = $stateParams.id;
    console.log($scope.transformation);

    $scope.type = 'pipe';
    if ($rootScope.transformation.graphs &&
      $rootScope.transformation.graphs.length !== 0) {
      $scope.type = 'graft';
    }

    $scope.downloadLink = PipeService.computeTuplesHref(
      $scope.distribution, $scope.transformation, $scope.type);

    $scope.lastPreviewDuration = PipeService.getLastPreviewDuration();
    $scope.verySlowMode = $scope.lastPreviewDuration > 25000;
    // $scope.verySlowMode = $scope.lastPreviewDuration > 25;

    $scope.ugly = function() {
      // TODO fixme
      window.setTimeout(function() {
        $mdDialog.hide();
      }, 1);
    };

    $scope.isRDF = $rootScope.transformation.graphs.length ? $rootScope.transformation.graphs.length : 0;
    $scope.downloadJarEndpoint = jarfterService.getJarCreatorStandAloneEndpoint();
    $scope.transformEndpoint = jarfterService.getTransformStandAloneEndpoint();

    $scope.onSubmitDownloadJar = function() {
      $scope.jarfterClojure = jarfterService.generateClojure($rootScope.transformation);
      $mdDialog.hide();
    };

    $scope.startDownloadProcessing = function() {
      if ($scope.downloadLinkSlowMode) {
        $scope.ugly();
        return;
      }

      $scope.downloadProcessing = true;
      $scope.downloadProcessingStatus = 'Preheating';

      var promises = PipeService.computeTuplesHrefAsync(
        $scope.distribution, $scope.transformation, $scope.type);

      var intervalEstimatedStuff = 0;

      promises.middle.then(function() {
        $scope.downloadProcessingStatus = 'Computing stuff';

        var startTime = +new Date();
        intervalEstimatedStuff = window.setInterval(function() {
          var duration = (+new Date()) - startTime;

          var durationLeft = $scope.lastPreviewDuration + 5000 - duration;
          $scope.downloadProcessingStatus = 'Estimated end of the processing: ' +
            moment.duration(durationLeft).humanize(true);
        }, 1000);
      });

      promises.final.then(function(data) {
          window.clearInterval(intervalEstimatedStuff);

          $scope.downloadLinkSlowMode = data.url;
          $scope.downloadProcessing = false;
          $scope.downloadProcessingStatus = null;
          $scope.slowModeThanks = true;
        },

        function() {
          window.clearInterval(intervalEstimatedStuff);
          $scope.downloadProcessingStatus = 'Unable to compute the data. Please try again';
        });
    };

    var showError = function(data) {
      $mdDialog.hide();

      var contentError = '';

      if (data && data.error) {
        contentError = '<br><pre><code>' + $sanitize(data.error) + '</code></pre>';
      }

      window.setTimeout(function() {
        $mdDialog.show(
          $mdDialog.alert({
            title: 'An error occured',
            content: 'The datapage cannot be created.' +
              '<br>Last processing status: "' + $scope.processingStatus + '"' +
              contentError,
            ok: 'Ok'
          })
        );
      }, 500);
    };

    $scope.makeNewDataset = function() {

      $scope.processing = true;
      $scope.processingStatus = 'Making the dataset';

      var today = new Date();
      today = today.toISOString().substring(0, 10);

      var metadataDataset = {
        '@context': ontotextAPI.getContextDeclaration(),
        'dct:title': $scope.dataset.title,
        'dct:description': $scope.dataset.description,
        'dcat:public': 'false',
        'dct:modified': today,
        'dct:issued': today
      };

      ontotextAPI.newDataset(metadataDataset)
        .success(function(datasetData) {
          var datasetId = datasetData['@id'];

          $scope.processingStatus = 'Transforming the data';
          PipeService.save(datasetId, $scope.distribution,
            $scope.transformation, $scope.type).success(
            function(distributionData) {

              var distributionId = distributionData['@id'];

              $scope.processingStatus = 'Fetching information';
              ontotextAPI.distribution(distributionId)
                .success(function(metadataDistribution) {

                  var finalizeDatapage = function() {

                    var location = '/pages/publish/details.jsp?id=' +
                      window.encodeURIComponent(datasetId);

                    if (datagraftPostMessage.isConnected()) {
                      datagraftPostMessage.setLocation(location);
                    } else {
                      if (location.protocol === 'https:') {
                        location = 'https://datagraft.net' + location;
                      } else {
                        location = 'http://datagraft.net' + location;
                      }

                      window.location = location;
                    }
                  };

                  if ($scope.type === 'pipe') {
                    finalizeDatapage();
                    return;
                  }

                  $scope.processingStatus = 'Creating the RDF repository';
                  ontotextAPI.createRepository(distributionId)
                    .success(function(repositoryData) {
                      var accessUrl = repositoryData['access-url'];

                      metadataDistribution['dcat:accessURL'] = accessUrl;

                      $scope.processingStatus = 'Connecting the repository to the distribution';
                      ontotextAPI.updateDistribution(metadataDistribution)
                        .success(function() {

                          $scope.processingStatus = 'Filling the repository';

                          var nbTryToFillRDFrepo = 0;
                          var waitingDelay = 1000;
                          var maxTentatives = 20;

                          var tryToFillRDFrepo = function() {
                            ++nbTryToFillRDFrepo;
                            if (tryToFillRDFrepo > 3) {
                              $scope.processingStatus = 'The repository is not ready yet. It might take few minutes.';
                            }
                            waitingDelay = Math.min(waitingDelay + waitingDelay, 32000);

                            window.setTimeout(function() {
                              PipeService.fillRDFrepo(distributionId, accessUrl)
                                .success(finalizeDatapage)
                                .error(nbTryToFillRDFrepo < maxTentatives ? tryToFillRDFrepo :
                                  showError);
                            }, waitingDelay);
                          };

                          tryToFillRDFrepo();

                        }).error(showError);
                    }).error(showError);
                }).error(showError);
            }).error(showError);
        }).error(showError);
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
