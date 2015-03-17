'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.datapagesResource
 * @description
 * # datapagesResource
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('datapagesResource', function () {
  	var localStorageKey = 'resourcesStorage';
  	var localStorage = window.localStorage || window.sessionStorage || {};

  	/* Schema of the localStorage datastore
  		{[id:string] : {
  			id: string;
			name: string;
			datetime: number;
			metadata: string;	
  		}}
  	*/
  	var data = null;

  	this.query = function() {
  		if (data === null) {
  			data = JSON.parse(localStorage.getItem(localStorageKey))
  		}
  		return data;
  	};

  	this._commit = function() {
  		localStorage.setItem(localStorageKey, JSON.stringify(this.query()));
  	};

  	this.save = function(datapage) {
  		data[datapage.id] = databage;
  		this._commit();
  	};
  });
