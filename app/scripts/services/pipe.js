'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.pipe
 * @description
 * # pipe
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('PipeService', function ($http) {
  	var urlBase = "http://localhost:3000";

  	this.pipe = function(transformationId, fileId) {
  		var path = urlBase+"/pipe/"+transformationId+"/"+fileId+".json";

  		return $http.get(path);
  	};
  });
