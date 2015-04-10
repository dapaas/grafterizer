'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('UploadCtrl', function ($scope, fileUpload, $mdToast, File, $state) {
  	$scope.$watch('file', function() {
  		if ($scope.file && $scope.file[0]) {
  			var now = new Date();
  			var errorcallback = function(err){
	  			$mdToast.show(
			      $mdToast.simple()
			        .content(err ? 'Error: '+err :
			        	'An unknown file upload error occured')
			        .position('right top')
			        .hideDelay(6000)
			    );
  			};
	  		fileUpload.upload($scope.file[0], function(data){
	  			if (!data) {
	  				errorcallback();
	  				return;
	  			}

	  			$state.go('files.file', {
	  				id: data.id
	  			});
	  			/*File.create({
	  				name: "je suis un canard",//data.name,
	  				link: "canard",//data.hash+'.'+data.extension,
	  				date: now,
	  				content: [["name", "speed"], ["roger", 12], ["alain", 28.1]]
	  			}).$promise.then(
		  			function(data){
		  				console.log(data);
		  			},
		  			function(err){
		  				console.log(err)
		  				errorcallback()
		  			}
	  			);*/
	  		}, errorcallback);
  		}
  	});
  });
