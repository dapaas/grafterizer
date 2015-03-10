'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:GridCtrl
 * @description
 * # GridCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('GridCtrl', function ($scope) {
  	 $scope.myData = [
		{
		"firstName": "Cox",
		"lastName": "Carney",
		"company": "Enormo",
		"employed": true
		},
		{
		"firstName": "Lorraine",
		"lastName": "Wise",
		"company": "Comveyer",
		"employed": false
		},
		{
		"firstName": "Nancy",
		"lastName": "Waters",
		"company": "Fuelton",
		"employed": false
		}
	];
  });
