'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:DatapagesCtrl
 * @description
 * # DatapagesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('DatapagesCtrl', function ($scope, Datapages, $rootScope) {
  	$rootScope.title = 'Data pages';
  	$rootScope.sectionTitle = null;
  	
  	Datapages.find({}, function(list){
  		console.log(list);
  		$scope.datapages = list;
  	}, function(error){
  		console.log("pas glop")
  	});
  });
