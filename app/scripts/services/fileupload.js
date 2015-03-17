'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.fileUpload
 * @description
 * # fileUpload
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('fileUpload', function (fileParsing, $location, $rootScope, $mdToast) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var fileResults = null,
      title = null;

  	this.upload = function(file) {
  		console.log('file upload', file);
      if (!file.length) {
        $mdToast.show(
          $mdToast.simple()
            .content('File upload error')
            .position('right top')
            .hideDelay(3000)
        );
        return;
      }
      file = file[0];
      title = file.name;
  		fileParsing.parse(file, function(results) {
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

    this.getTitle = function() {
      return title && title.replace ? _.startCase(title.replace(/\.[^/.]+$/, "")) : "";
    };
  });
