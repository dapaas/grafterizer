'use strict';

angular.module('grafterizerApp')
  .controller('TransformationsCtrl', function($scope, ontotextAPI, $state) {

    $scope.selectTransformation = function(transformation) {
      $state.go('transformations.transformation', {
        id: transformation['foaf:primaryTopic']
      });
    };

    var showTransformations = function(data) {
      $scope.transformations = data['dcat:record'].reverse();
    };

    $scope.load = function() {
      $scope.transformations = [];
      if ($scope.searchinput) {
        ontotextAPI.searchTransformations($scope.searchinput, $scope.showPublic ? 'y' : 'n')
         .success(showTransformations);
      } else if ($scope.showPublic) {
        ontotextAPI.publicTransformations().success(showTransformations);
      } else {
        ontotextAPI.transformations().success(showTransformations);
      }
    };

    $scope.$watch('showPublic', $scope.load);
  });
