'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:FilesCtrl
 * @description
 * # FilesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('FilesCtrl', function ($scope, File) {
  	File.find({
  		"filter[fields][content]": false
  	}, function(list){
  		console.log(list);
  		$scope.files = list;
  	}, function(error){
  		console.log("pas glop")
  	});
  	$scope.canard = function(){
  		console.log("canard")
  	};
  });
