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

  	$scope.$watch('file', function() {
  		if ($scope.file && $scope.file[0]) {
  			var file = $scope.file[0];
  			console.log(file);

  			var metadata = {
	            '@context': ontotextAPI.getContextDeclaration(),
	            '@type': 'dcat:Distribution',
	            'dct:title': "undefined title",
	            'dct:description': "undefined description",
	            'dcat:fileName': file.name,
	            'dcat:mediaType': file.type
	            // 'dct:public': $scope.document['dct:public'],
	            // 'dct:modified': moment().format("YYYY-MM-DD")
	        };
	  		ontotextAPI.uploadDistribution(id,
	  			file, metadata).success(function(){
	  			$state.transitionTo($state.current, $stateParams, {
				    reload: true,
				    inherit: false,
				    notify: true
				});
	  		});

	  		// $state.go
  		}
  	});
  });
