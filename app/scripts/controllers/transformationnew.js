'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:TransformationnewCtrl
 * @description
 * # TransformationnewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('TransformationNewCtrl', function (
  	$scope,
    $stateParams,
    Transformation,
    $rootScope,
    $state,
    $mdToast,
    $mdDialog) {

  	$scope.document = {
  		title: "New transformation",
  		description: "",
  	};

  	$scope.clojure = "";

    $rootScope.actions = {
    	save: function(){
	        Transformation.create({
	        	uri: "about:blank",
	        	name: $scope.document.title,
	        	metadata: $scope.document.description,
	        	clojure: $scope.clojure
	        }, function(data) {
	        	$state.go('transformations.transformation', {
	        		id: data.id
	        	});
	        }, function(err) {
	  			$mdToast.show(
			      $mdToast.simple()
			        .content('An error occured: '+err.statusText)
			        .position('right top')
			        .hideDelay(6000)
		        );
	        });
    	}
    };
  });
