'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:ComputetriplesCtrl
 * @description
 * # ComputetriplesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('ComputetriplesCtrl', function($scope, $mdDialog, ontotextAPI,
    $http, $rootScope, datagraftPostMessage) {

    $scope.download = function() {
      $mdDialog.hide();
      window.open($scope.downloadLink, '_blank');
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
        }).error(function() {
          $mdDialog.hide();
          $mdDialog.show(
            $mdDialog.alert({
              title: 'An error occured',
              content: 'The transformation cannot be applied to the dataset.',
              ok: 'Ok :('
            })
          );
        });
      });

    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
