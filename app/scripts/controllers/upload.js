'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('UploadCtrl', function ($scope, fileUpload, $mdToast) {
  	$scope.$watch('file', function() {
  		if ($scope.file) {
	  		fileUpload.upload($scope.file);
  			$mdToast.show(
		      $mdToast.simple()
		        .content('lapin')
		        .position('right top')
		        .hideDelay(3000)
		    );
  		}
  	});
  });
