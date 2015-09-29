'use strict';

angular.module('grafterizerApp')
  .controller('TransformationsCtrl', function($scope, ontotextAPI, $state) {

    ontotextAPI.publicTransformations().success(function(data) {
      $scope.transformations = data['dcat:record'].reverse();
    });

    $scope.selectTransformation = function(transformation) {
      $state.go('transformations.transformation', {
        id: transformation['foaf:primaryTopic']
      });
    };
  });
