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

    $scope.download = function() {
      $mdDialog.hide();
      window.open($scope.downloadLink, '_blank');
    };

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

      ontotextAPI.newDataset({
        '@context': ontotextAPI.getContextDeclaration(),
        'dct:title': $scope.dataset.title,
        'dct:description': $scope.dataset.description,
        'dcat:public': 'false'
      })
      .success(function(datasetData) {
        $http.get($scope.downloadLink).success(function(data) {

          var file = new Blob([data], {
            type: 'application/n-triples'
          });
          var metadata = {
            '@context': ontotextAPI.getContextDeclaration(),
            '@type': 'dcat:Distribution',
            'dct:title': type + ' computed transformation',
            'dct:description': '[' + type + '] dataset transformed with Grafterizer',
            'dcat:fileName': 'computed.' + (type === 'pipe' ? 'csv' : 'nt'),
            'dcat:mediaType': (type === 'pipe' ? 'text/csv' : 'application/n-triples')
          };

          ontotextAPI.uploadDistribution(
            datasetData['@id'],
            file,
            metadata).success(function(distributionData) {

              var location = '/pages/publish/details.jsp?id=' +
                    window.encodeURIComponent(datasetData['@id']);
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
            });

          $mdDialog.hide();
        });
      });

    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
