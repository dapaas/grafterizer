'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.fileUpload
 * @description
 * # fileUpload
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('fileUpload', function (fileParsing, $location, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var fileResults = null;

  	this.upload = function(file) {
  		console.log('file upload', file);
  		fileParsing.parse(file[0], function(results) {
  			console.log('parsing results', results);
  			fileResults = results;
  			//$rootScope.data = results;
  			$location.path('/grid');
  			$rootScope.$apply();
  		});
  	};

  	this.getResults = function() {
  		return fileResults;
  	};
  });
