'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.ontotextAPI
 * @description
 * # ontotextAPI
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('ontotextAPI', function ($http, $mdToast, Upload) {

  	var endpoint = 'http://ec2-54-76-140-62.eu-west-1.compute.amazonaws.com:8080/catalog';

  	var jsonLdConfig = {
  		headers: {
			'Accept': 'application/ld+json'
  		}
  	};

  	var errorHandler = function(data, status, headers, config){
      var message;
      if (data && data.error) {
        message = "API error: "+data.error;
      } else if (status) {
        message = "Error "+status+" while contacting ontotext's API";
      } else {
        message = "An error occured when contacting ontotextAPI";
      }

  		$mdToast.show(
  			$mdToast.simple()
  			.content(message)
  			.position('bottom left')
  			.hideDelay(3000)
  		);
  	};

    var transformRequest = function (data, headersGetter) {
      var formData = new FormData();
      angular.forEach(data, function (value, key) {
        formData.append(key, value);
        console.log(value,key);
      });

      var headers = headersGetter();
      delete headers['Content-Type'];

      console.log(formData);
      return formData;
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
  	};

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
			 'Content-Type': 'multipart/form-data',
       'transformation-type': 'pipe',
       'command': 'my-pipe'
  		};

  		return $http({
  			url: endpoint+"/transformations", 
  			method: method,
  			data: data,
  			headers: headers,
  			transformRequest: transformRequest
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

    this.distribution = function(id) {
      return $http.get(endpoint+"/distributions", angular.merge({
        headers: {
          'distrib-id': id
        }
      }, jsonLdConfig)).error(errorHandler);
    };

    this.uploadDistribution = function(distributionID, file, metadata) {
      var meta = new Blob([JSON.stringify(metadata)],
        {type: "application/ld+json"});

      return Upload.upload({
        url: endpoint+"/distributions",
        method: 'POST',
        file: [file, meta],
        fileFormDataName: ['file', 'meta'],
        headers: {
          'dataset-id': distributionID
        }
      }).error(errorHandler);
    };

    this.distributionFile = function(distributionID) {
      return $http.get(endpoint+"/distributions/file", {
        headers: {
          'distrib-id': distributionID
        }
      }).error(errorHandler);
    };

    this.graftwerk = function(distributionID) {

      var data = {
        'transformation-code': new Blob(["(defpipe my-pipe [data-file] (-> (read-dataset data-file :format :csv)))"],
        {type: "application/clojure"}),
        'input-file': new Blob(["name,sex,age\nalice,f,34\nbob,m,63"], {type: "text/csv"})
      };

      var headers = {
        'Content-Type': 'multipart/form-data',
        'command': 'my-pipe',
        'transformation-type': 'pipe'
        //'input-distribution': distributionID
      };

      return $http({
        url: endpoint+"/grafter/transformation/preview", 
        method: "POST",
        data: data,
        headers: headers,
        transformRequest: transformRequest
      }).error(errorHandler);
    };
  });
