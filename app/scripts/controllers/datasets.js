'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:DatasetsCtrl
 * @description
 * # DatasetsCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('DatasetsCtrl', function ($scope, ontotextAPI, $state) {
  	ontotextAPI.datasets().success(function(data){
  		$scope.records = data['dcat:record'].reverse();
  	});

  	$scope.selectDataset = function(dataset) {
  		$state.go('datasets.dataset', {
  			id: dataset['foaf:primaryTopic']
  		});
  	};
  });
