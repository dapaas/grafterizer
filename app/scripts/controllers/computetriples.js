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
    $http,
    ontotextAPI,
    datagraftPostMessage,
    jarfterService) {

    $scope.downloadLink = PipeService.computeTuplesHref(
      $scope.distribution, $scope.transformation, $scope.type);

    $scope.ugly = function() {
      // TODO fixme
      window.setTimeout(function() {
        $mdDialog.hide();
      }, 1);
    };
    $scope.isRDF = $rootScope.transformation.graphs.length ? $rootScope.transformation.graphs.length  : 0;
    $scope.downloadJarEndpoint = jarfterService.getJarCreatorStandAloneEndpoint();
    $scope.transformEndpoint = jarfterService.getTransformStandAloneEndpoint();
    
    $scope.generateJarfterClojure = function() {
      $scope.jarfterClojure = jarfterService.generateClojure($rootScope.transformation);
    };

    ontotextAPI.distributionFile($scope.$parent.selectedDistribution)
      .success(function(data) {
        $scope.fullData = data;
      });

    $scope.onSubmitExecute = function() {
      $scope.generateJarfterClojure();
      $mdDialog.hide();
    };

    $scope.onSubmitDownloadJar = function() {
      $scope.generateJarfterClojure();
      $mdDialog.hide();
    };

    $scope.makeNewDataset = function() {
      var type = 'pipe';
      if ($rootScope.transformation.graphs &&
        $rootScope.transformation.graphs.length !== 0) {
        type = 'graft';
      }

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
            $scope.transformation, type).success(
            function(distributionData) {

              var distributionId = distributionData['@id'];

              $scope.processingStatus = 'Fetching information';
              ontotextAPI.distribution(distributionId)
              .success(function(metadataDistribution) {

                $scope.processingStatus = 'Creating the RDF repository';
                ontotextAPI.createRepository(distributionId)
                .success(function(repositoryData) {
                  var accessUrl = repositoryData['access-url'];

                  metadataDistribution['dcat:accessURL'] = accessUrl;

                  $scope.processingStatus = 'Connecting the repository to the distribution';
                  ontotextAPI.updateDistribution(metadataDistribution)
                    .success(function(data) {

                      $scope.processingStatus = 'Filling the repository';

                      var successFilling = function(data) {
                        $mdDialog.hide();

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

                      var nbTryToFillRDFrepo = 0;
                      var tryToFillRDFrepo = function() {
                        ++nbTryToFillRDFrepo;

                        window.setTimeout(function() {
                          PipeService.fillRDFrepo(distributionId, accessUrl)
                            .success(successFilling)
                            .error(nbTryToFillRDFrepo < 6 ? tryToFillRDFrepo : showError);
                        }, 2000);
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
