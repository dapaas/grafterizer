'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.uploadFile
 * @description
 * # uploadFile
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('uploadFile', function(backendService) {
    this.upload = function(file, finalCallback) {
      backendService.uploadDistribution(file, {
        title: 'Preview: ' + file.name,
        description: 'File uploaded from Grafterizer in preview mode'
      }).success(finalCallback);
    };
  });
