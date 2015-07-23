'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:FiletestCtrl
 * @description
 * # FiletestCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('FiletestCtrl', function($scope, leObject) {
    $scope.fileName = {
      value: ''
    };
    $scope.fileName.value = leObject.object.filename;
  });
