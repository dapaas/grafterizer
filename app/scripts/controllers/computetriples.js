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
    $http) {

    $scope.download = function() {
      $mdDialog.hide();
      window.open($scope.downloadLink, '_blank');
    };

    $scope.save = function() {

      // console.log($scope.dataset);
      $http.get($scope.downloadLink).success(function(data) {

        var file = new Blob([data], {
          type: 'application/n-triples'
        });
        var metadata = {
          '@context': ontotextAPI.getContextDeclaration(),
          '@type': 'dcat:Distribution',
          'dct:title': 'computed',
          'dct:description': 'Computed transformation',
          'dcat:fileName': 'computed.nt',
          'dcat:mediaType': 'application/n-triples'
        };

        ontotextAPI.uploadDistribution(
          $scope.dataset['foaf:primaryTopic'],
          file,
          metadata).success(function(data) {
//          console.log(data);

          // TODO TODO TODO TODO
          window.alert(data['@id']);
        });

        $mdDialog.hide();
      });
      
      return;

    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
