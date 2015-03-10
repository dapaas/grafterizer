'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.fileParsing
 * @description
 * # fileParsing
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('fileParsing', function () {
  	this.parse = function(file, callback) {
  		// TODO only CSV parsing right now
  		Papa.parse(file, {complete: callback, header:true});
  	};
  });
