'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:CustomfunctionsdialogcontrollerCtrl
 * @description
 * # CustomfunctionsdialogcontrollerCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('CustomfunctionsdialogcontrollerCtrl', function ($scope, transformationDataModel) {
    $scope.$parent.transformation.prefixers.push(new transformationDataModel.Prefixer("test", "www.text.text/text"));
  });
