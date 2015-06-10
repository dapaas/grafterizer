'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PreviewpipelinedialogCtrl
 * @description
 * # PreviewpipelinedialogCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('PreviewpipelinedialogCtrl', function ($scope) {
    $scope.$parent.transformation.prefixers[0].name = "changedName";
    $scope.$parent.transformation.prefixers[$scope.$parent.transformation.prefixers.length-1].uri = "changeduri";
});
