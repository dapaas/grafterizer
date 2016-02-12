'use strict';

angular.module('grafterizerApp')
  .controller('TransformationsCtrl', function($scope, ontotextAPI, dataGraftApi, $state) {

    var showTransformations = function(data) {
      $scope.transformations = data['dcat:record'].reverse();
    };

    $scope.searchinput = $state.params.search;
    $scope.showShared = $state.params.showShared ? $state.params.showShared !== 'false' : false;

    $scope.transformations = [];
    if ($scope.searchinput) {
      ontotextAPI.searchTransformations($scope.searchinput, $scope.showShared ? 'y' : 'n')
       .success(showTransformations);
    } else if ($scope.showShared) {
      ontotextAPI.publicTransformations().success(showTransformations);
    } else {
      ontotextAPI.transformations().success(showTransformations);
    }

    $scope.submit = function() {
      $state.go('.', {
        search: $scope.searchinput,
        showShared: $scope.showShared
      });
    };

    $scope.selectTransformation = function(transformation) {
      $state.go($scope.showShared ? 'transformations.readonly' : 'transformations.transformation', {
        id: transformation['foaf:primaryTopic'],
        showToolbar: true
      });
    };

  });
