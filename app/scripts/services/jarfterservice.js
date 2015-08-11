'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.jarfterService
 * @description
 * # jarfterService
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('jarfterService', function ($http) {
      this.jarCreatorStandAlone = function(clojure) {
	  httpPost = $http.post("http://192.168.11.43:8080/jarfter/webresources/jarCreatorStandAlone", clojure);
	  return httpPost;
      }
  });
