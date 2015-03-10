'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('UploadCtrl', function ($scope, fileUpload) {
  	$scope.$watch('file', function() {
  		if ($scope.file) {
	  		fileUpload.upload($scope.file);
  		}
  	});
  });
