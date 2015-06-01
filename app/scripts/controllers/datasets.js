'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:DatasetsCtrl
 * @description
 * # DatasetsCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('DatasetsCtrl', function ($scope, ontotextAPI, grafterSerialiser) {
  	ontotextAPI.catalog().success(function(data){
  		$scope.records = data['dcat:record'];
  	});

  	// $scope.something = new grafterSerialiser.MyClass();
  	// $scope.other = new grafterSerialiser.SecondClass();
  });
