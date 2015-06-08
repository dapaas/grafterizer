'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.ontotextAPI
 * @description
 * # ontotextAPI
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('ontotextAPI', function ($http, $mdToast) {

  	var endpoint = 'http://ec2-54-76-140-62.eu-west-1.compute.amazonaws.com:8080/catalog';

  	var jsonLdConfig = {
  		headers: {
			'Accept': 'application/ld+json'
  		}
  	};

  	var errorHandler = function(data, status, headers, config){
		$mdToast.show(
			$mdToast.simple()
			.content('An error occured when contacting ontotextAPI')
			.position('bottom left')
			.hideDelay(3000)
		);
  	};

  	this.datasets = function() {
  		return $http.get(endpoint+"/datasets/catalog", jsonLdConfig).error(errorHandler);
  	};

  	this.dataset = function(id) {
  		return $http.get(endpoint+"/datasets", angular.merge({
  			headers: {
  				'dataset-id': id
  			}
  		}, jsonLdConfig)).error(errorHandler);
  	};

  	this.transformations = function() {
  		return $http.get(endpoint+"/transformations/catalog", jsonLdConfig).error(errorHandler);
  	};

  	this.transformation = function(id) {
  		return $http.get(endpoint+"/transformations", angular.merge({
  			headers: {
  				'transformation-id': id
  			}
  		}, jsonLdConfig)).error(errorHandler);
  	};

  	this.getContextDeclaration = function(){
  		return {
          "dcat":"http://www.w3.org/ns/dcat#",
          "foaf":"http://xmlns.com/foaf/0.1/",
          "dct":"http://purl.org/dc/terms/",
          "xsd":"http://www.w3.org/2001/XMLSchema#",
          "dct:issued":{"@type":"xsd:date"},
          "dct:modified":{"@type":"xsd:date"},
          "foaf:primaryTopic":{"@type":"@id"},
          "dcat:distribution":{"@type":"@id"}
        };
  	}

  	var createOrUpdateTransformation = function(id, meta, clojure, json){
  		var method = id ? 'PUT' : 'POST';
  		var data = {
			'meta': new Blob([JSON.stringify(meta)],
				{type: "application/ld+json"})
  		};

  		if (clojure) {
  			data['tr-clojure'] = new Blob([clojure],
  				{type: "application/clojure"});
  		}

  		if (json) {
  			data['tr-json'] = new Blob([JSON.stringify(json)],
  				{type: "application/json"});
  		}

  		var headers = {
			'Content-Type': 'multipart/form-data'
  		};

  		if (id) {
  			headers['transformation-id'] = id;
  		}

  		return $http({
  			url: endpoint+"/transformations", 
  			method: method,
  			data: data,
  			headers: headers,
  			transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                	console.log(key, value);
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
  		}).error(errorHandler);
  	};

  	this.newTransformation = function(meta, clojure, json) {
  		console.log(meta);
  		return createOrUpdateTransformation(null, meta, clojure, json);
  	};

  	this.updateTransformation = function(id, meta, clojure, json) {
  		return createOrUpdateTransformation(id, meta, clojure, json);
  	};

  	this.deleteTransformation = function(id) {
  		return $http.delete(endpoint+"/transformations", angular.merge({
  			headers: {
  				'transformation-id': id
  			}
  		}, jsonLdConfig)).error(errorHandler);
  	};

  	this.getClojure = function(id) {
  		return $http.get(endpoint+"/transformations/code/clojure", {
  			headers: {
  				'transformation-id': id
  			}
  		}).error(errorHandler);
  	};
  });
