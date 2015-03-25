'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.fileUpload
 * @description
 * # fileUpload
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('fileUpload', function (fileParsing, $location, $rootScope, $mdToast, $upload, cfpLoadingBar, File) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var fileResults = null, title = null;

  	this.upload = function(file, successCallback, errorCallback) {
      var now = new Date();
      title = _.startCase(file.name.replace(/\.[^/.]+$/, ""));

  		fileParsing.parse(file, function(results) {
  			console.log('parsing results', results);
  			fileResults = results;

        File.create({
          name: title,
          date: now,
          content: results
        }).$promise.then(successCallback);

  			//$rootScope.data = results;
  			//$location.path('/file/');
  			//$rootScope.$apply();
  		});
  	};

  	this.getResults = function() {
  		return fileResults;
  	};

    this.getTitle = function() {
      return title;
    };
  });
