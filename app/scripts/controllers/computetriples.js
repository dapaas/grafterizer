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

  //    $scope.downloadLink = PipeService.computeTuplesHref(
  //      $scope.distribution, $scope.transformation, $scope.type);

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


  $scope.cancel = function() {
    $mdDialog.cancel();
  };
});
