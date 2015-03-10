'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:GridCtrl
 * @description
 * # GridCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('GridCtrl', function ($scope, fileUpload) {

  	var data = fileUpload.getResults();

  	$scope.gridOptions = {
  		//data: $rootScope.data ? $rootScope.data.data: null
  		data: data ? data.data: null
  	};
  });
