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
      window.setTimeout(function() {
        $mdDialog.hide();
      }, 1);
      // TODO fixme
      
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
          var datasetId = datasetData['@id'];

          PipeService.save(datasetId, $scope.distribution,
            $scope.transformation, type).success(
            function(distributionData) {

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

    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
