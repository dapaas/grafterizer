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
    ontotextAPI,
    PipeService,
    datagraftPostMessage) {

    $scope.downloadLink = PipeService.computeTuplesHref(
      $scope.distribution, $scope.transformation, $scope.type);

    $scope.ugly = function() {
      // TODO fixme
      window.setTimeout(function() {
        $mdDialog.hide();
      }, 1);
    };
  
    var showError = function() {
      $mdDialog.hide();
      $mdDialog.show(
        $mdDialog.alert({
          title: 'An error occured',
          content: 'The datapage cannot be created.',
          ok: 'Ok'
        })
      );
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

                      // We try 3 times lol
                      PipeService.fillRDFrepo(distributionId, accessUrl)
                        .success(successFilling)
                        .error(function() {
                          PipeService.fillRDFrepo(distributionId, accessUrl)
                            .success(successFilling)
                            .error(function() {
                              PipeService.fillRDFrepo(distributionId, accessUrl)
                                .success(successFilling)
                                .error(showError);
                            });
                        });
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
