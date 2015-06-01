'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.ontotextAPI
 * @description
 * # ontotextAPI
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('ontotextAPI', function ($http) {

  	var endpoint = 'http://54.76.140.62:8080/catalog';

  	var jsonLdConfig = {
  		headers: {
			'Accept': 'application/ld+json'
  		}
  	};

  	this.catalog = function() {
  		return $http.get(endpoint+"/datasets/catalog", jsonLdConfig);
  	}	;

  	this.dataset = function(id) {

  		return $http.get(endpoint+"/datasets", {
  			headers: {
  				'Accept': 'application/ld+json',
  				id: id
  			},
  			withCredentials: true
  		});

  		return $http.get(endpoint+"/datasets", {
  			headers: {
  				'Accept': 'application/ld+json'
  			},
  			params: {
  				id: id
  			}
  		});
  	};
  });
