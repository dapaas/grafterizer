'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:GridCtrl
 * @description
 * # GridCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('GridCtrl', function ($scope, fileUpload, $interval) {

  	var data = fileUpload.getResults();

  	$scope.gridOptions = {
  		//data: $rootScope.data ? $rootScope.data.data: null
  		data: data ? data.data: null,
  		columnDefs: data ? 
  			_.map(data.meta.fields, function(f){return {name: f,width:Math.min(80+f.length*8, 250)};}) :
  			[{name:"empty document", width:'100%'}]
  	};

  	$scope.document = {
  		title: fileUpload.getTitle()
  	}

  });
