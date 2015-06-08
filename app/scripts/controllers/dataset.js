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
    ontotextAPI,
    $state
  	) {

  	var id = $scope.id = $stateParams.id;

    $scope.document = {
      title: 'loading'
    };

  	ontotextAPI.dataset(id).success(function(data){
  		$scope.document = data;
  		$scope.document.title = data['dct:title'];
  		// $scope.json = JSON.stringify(data, null, '  ');
  	}).error(function(){
  		$state.go('^');
  	});

  	$scope.selectDistribution = function(distribution) {
  		$state.go('distribution', {id: distribution});
  	};
  });
