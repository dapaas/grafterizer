'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.ontotextAPI
 * @description
 * # ontotextAPI
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
    .service('ontotextAPI', function($http, $mdToast, Upload, $log) {

      var endpoint = 'http://ec2-54-76-140-62.eu-west-1.compute.amazonaws.com:8080';
      var apiAuthorization = 'Basic ' + window.btoa('s4key:s4pass');

      var jsonLdConfig = {
        headers: {
          Accept: 'application/ld+json',
          Authorization: apiAuthorization
        }
      };

      this.setAuthorization = function(keypass) {
        apiAuthorization = 'Basic ' + window.btoa(keypass);
        console.log(apiAuthorization);
        jsonLdConfig.headers.Authorization = apiAuthorization;
      };

      var errorHandler = function(data, status, headers, config) {
        var message;
        if (data && data.error) {
          message = 'API error: ' + data.error;
        } else if (status) {
          message = 'Error ' + status + ' while contacting ontotext\'s API';
        } else {
          message = 'An error occured when contacting ontotextAPI';
        }

        $mdToast.show(
            $mdToast.simple()
            .content(message)
            .position('bottom left')
            .hideDelay(3000)
        );
      };

      var transformRequest = function(data, headersGetter) {
        var formData = new FormData();
        angular.forEach(data, function(value, key) {
          formData.append(key, value);
        });

        var headers = headersGetter();
        delete headers['Content-Type'];

        return formData;
      };

      this.datasets = function() {
        return $http.get(endpoint + '/catalog/datasets/catalog', jsonLdConfig).error(errorHandler);
      };

      this.dataset = function(id) {
        return $http.get(endpoint + '/catalog/datasets', angular.merge({
          headers: {
            'dataset-id': id,
            Authorization: apiAuthorization
          }
        }, jsonLdConfig)).error(errorHandler);
      };

      this.transformations = function() {
        return $http.get(endpoint + '/catalog/transformations/catalog', jsonLdConfig).error(errorHandler);
      };

      this.transformation = function(id) {
        return $http.get(endpoint + '/catalog/transformations', angular.merge({
          headers: {
            'transformation-id': id,
            Authorization: apiAuthorization
          }
        }, jsonLdConfig)).error(errorHandler);
      };

      this.getContextDeclaration = function() {
        return {
          dcat:'http://www.w3.org/ns/dcat#',
          foaf:'http://xmlns.com/foaf/0.1/',
          dct:'http://purl.org/dc/terms/',
          xsd:'http://www.w3.org/2001/XMLSchema#',
          'dct:issued':{'@type':'xsd:date'},
          'dct:modified':{'@type':'xsd:date'},
          'foaf:primaryTopic':{'@type':'@id'},
          'dcat:distribution':{'@type':'@id'}
        };
      };

      var createOrUpdateTransformation = function(isNew, meta, clojure, json) {
        var method = isNew ? 'POST' : 'PUT';
        var data = {
          meta: new Blob([JSON.stringify(meta)],
                         {type: 'application/ld+json'})
        };

        if (clojure) {
          data['tr-clojure'] = new Blob([clojure],
                                        {type: 'application/clojure'});
        }

        if (json) {
          data['tr-json'] = new Blob([JSON.stringify(json)],
                                     {type: 'application/json'});
        }

        var headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: apiAuthorization
        };

        // Authorization: 'Basic ' + window.btoa('s4hbq7d9f8ep:cvtsj1jcaap4ggs')

        return $http({
          url: endpoint + '/catalog/transformations',
          method: method,
          data: data,
          headers: headers,
          transformRequest: transformRequest
        }).error(errorHandler);
      };

      this.newTransformation = function(meta, clojure, json) {
        return createOrUpdateTransformation(true, meta, clojure, json);
      };

      this.updateTransformation = function(meta, clojure, json) {
        return createOrUpdateTransformation(false, meta, clojure, json);
      };

      this.deleteTransformation = function(id) {
        return $http.delete(endpoint + '/catalog/transformations', angular.merge({
          headers: {
            'transformation-id': id,
            Authorization: apiAuthorization
          }
        }, jsonLdConfig)).error(errorHandler);
      };

      this.getClojure = function(id) {
        return $http.get(endpoint + '/catalog/transformations/code/clojure', {
          headers: {
            'transformation-id': id,
            Authorization: apiAuthorization
          }
        }).error(errorHandler);
      };

      this.getJson = function(id) {
        return $http.get(endpoint + '/catalog/transformations/code/json', {
          headers: {
            'transformation-id': id,
            Authorization: apiAuthorization
          },

          // TODO angular fails when the JSON document is invalid...
          // lets use an amazing try catch
          transformResponse: [function(data, headers) {
            try {
              return JSON.parse(data);
            } catch (e) {
              $log.debug(data);
              $log.error(e);
              return false;
            }
          }]
        }).error(errorHandler);
      };

      this.distribution = function(id) {
        return $http.get(endpoint + '/catalog/distributions', angular.merge({
          headers: {
            'distrib-id': id,
            Authorization: apiAuthorization
          }
        }, jsonLdConfig)).error(errorHandler);
      };

      this.uploadDistribution = function(datasetId, file, metadata) {
        var meta = new Blob([JSON.stringify(metadata)],
                            {type: 'application/ld+json'});

        return Upload.upload({
          url: endpoint + '/catalog/distributions',
          method: 'POST',
          file: [file, meta],
          fileFormDataName: ['file', 'meta'],
          headers: {
            'dataset-id': datasetId,
            Authorization: apiAuthorization
          }
        }).error(errorHandler);
      };

      this.distributionFile = function(distributionID) {
        return $http.get(endpoint + '/catalog/distributions/file', {
          headers: {
            'distrib-id': distributionID,
            Authorization: apiAuthorization
          }
        }).error(errorHandler);
      };
    });
