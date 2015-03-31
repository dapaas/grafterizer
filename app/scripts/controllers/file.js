'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:FileCtrl
 * @description
 * # FileCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('FileCtrl', function ($scope, $rootScope, $stateParams, File) {
  	var id = $scope.id = $stateParams.id;

  	File.findById({
  		id: id
  	}, function(value){
  		$rootScope.title = value.name;
  		// todo merge
  		$scope.document = {
  			title: value.name
  		};
  		var data = value.content;
	  	$scope.gridOptions = {
	  		//data: $rootScope.data ? $rootScope.data.data: null
	  		data: data ? data.data: null,
	  		columnDefs: data ? 
	  			_.map(data.meta.fields, function(f){return {name: f,width:Math.min(80+f.length*8, 250)};}) :
	  			[{name:"empty document", width:'100%'}]
	  	};
  	}, function(error){
  		// TODO
  	});

  	$rootScope.title = 'Loading file';
  	$rootScope.sectionTitle = 'Files';
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
