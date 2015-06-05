'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:DatasetCtrl
 * @description
 * # DatasetCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('DatasetCtrl', function (
  	$scope,
    $stateParams,
    ontotextAPI
  	) {

  	var id = $scope.id = $stateParams.id;


  	ontotextAPI.dataset(id).success(function(data){
  		$scope.document = {
  			title: data['dct:title'],
  			raw: JSON.stringify(data)
  		};
  	});
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
