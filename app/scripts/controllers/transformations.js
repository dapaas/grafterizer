'use strict';

angular.module('grafterizerApp')
  .controller('TransformationsCtrl', function($scope, $state, backendService) {

    var showTransformations = function(data) {
      $scope.transformations = data['dcat:record'];//.reverse();
    };

    $scope.searchinput = $state.params.search;
    $scope.showPublic = $state.params.showPublic ? $state.params.showPublic !== 'false' : false;

    $scope.transformations = [];
    backendService.transformations($scope.searchinput, $scope.showPublic)
      .success(showTransformations);

    $scope.submit = function() {
      $state.go('.', {
        search: $scope.searchinput,
        showPublic: $scope.showPublic
      });
    };

    $scope.selectTransformation = function(transformation) {
      $state.go($scope.showPublic ? 'transformations.readonly' : 'transformations.transformation', {
        id: transformation.id,
        publisher: transformation['foaf:publisher'],
        showToolbar: true,
        showPublic: undefined
      });
    };

  });
