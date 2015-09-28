'use strict';

/**
* @ngdoc service
* @name grafterizerApp.ontotextAPI
* @description
* # ontotextAPI
* Service in the grafterizerApp.
*/
angular.module('grafterizerApp')
.provider('ontotextAPI', function() {

  var endpoint = '';
  this.setEndpoint = function(newEndpoint) {
    endpoint = newEndpoint;
  };

  var apiAuthorization = '';

  var jsonLdConfig = {
    headers: {
      Accept: 'application/ld+json',
      Authorization: apiAuthorization
    }
  };

  this.$get = function($http, $mdToast, Upload, $log, $state) {
    var api = {};
    api.setAuthorization = function(keypass) {
      apiAuthorization = 'Basic ' + window.btoa(keypass);
      jsonLdConfig.headers.Authorization = apiAuthorization;
    };

    var errorHandler = function(data, status, headers, config) {
      var message;
      if (data && data.error) {
        message = 'API error: ' + data.error;
      } else if (status) {
        if (status === 401) {
          message = 'Unauthorized access to the API';
          $state.go('apikey');
        } else {
          message = 'Error ' + status + ' while contacting server';
        }
      } else {
        message = 'An error occured when contacting server';
      }

      $mdToast.show(
          $mdToast.simple()
          .content(message)
          .position('bottom left')
          .hideDelay(3000)
      );

      Raven.captureMessage(message, {
        extra: {
          status: status,
          data: (data ? data.error : null)
        },
        tags: {
          file: 'ontotextapi',
          method: 'errorHandler'
        }
      });
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

    api.datasets = function() {
      return $http.get(endpoint + '/catalog/datasets/catalog', jsonLdConfig).error(errorHandler);
    };

    api.dataset = function(id) {
      return $http.get(endpoint + '/catalog/datasets', _.merge({
        headers: {
          'dataset-id': id,
          Authorization: apiAuthorization
        }
      }, jsonLdConfig)).error(errorHandler);
    };

    api.searchDataset = function(search) {
      return $http.get(endpoint + '/catalog/datasets/search', _.merge({
        params: {
          q: search
        }
      }, jsonLdConfig)).error(errorHandler);
    };

    var saveDataset = function(meta, method) {
      var data = JSON.stringify(meta);

      var headers = {
        'Content-Type': 'application/ld+json',
        Authorization: apiAuthorization
      };

      return $http({
        url: endpoint + '/catalog/datasets',
        method: method,
        data: data,
        headers: headers
      }).error(errorHandler);
    };

    api.newDataset = function(meta) {
      return saveDataset(meta, 'POST');
    };

    api.updateDataset = function(meta) {
      if (!meta['@id']) {
        throw 'A dataset id is required';
      }

      return saveDataset(meta, 'PUT');
    };

    api.transformations = function() {
      return $http.get(endpoint + '/catalog/transformations/catalog', jsonLdConfig).error(errorHandler);
    };

    api.transformation = function(id) {
      return $http.get(endpoint + '/catalog/transformations', _.merge({
        headers: {
          'transformation-id': id,
          Authorization: apiAuthorization
        }
      }, jsonLdConfig)).error(errorHandler);
    };

    api.getContextDeclaration = function() {
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

    api.newTransformation = function(meta, clojure, json) {
      return createOrUpdateTransformation(true, meta, clojure, json);
    };

    api.updateTransformation = function(meta, clojure, json) {
      return createOrUpdateTransformation(false, meta, clojure, json);
    };

    api.deleteTransformation = function(id) {
      return $http.delete(endpoint + '/catalog/transformations', _.merge({
        headers: {
          'transformation-id': id,
          Authorization: apiAuthorization
        }
      }, jsonLdConfig)).error(errorHandler);
    };

    api.getClojure = function(id) {
      return $http.get(endpoint + '/catalog/transformations/code/clojure', {
        headers: {
          'transformation-id': id,
          Authorization: apiAuthorization
        }
      }).error(errorHandler);
    };

    api.getJson = function(id) {
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

    api.distribution = function(id) {
      return $http.get(endpoint + '/catalog/distributions', _.merge({
        headers: {
          'distrib-id': id,
          Authorization: apiAuthorization
        }
      }, jsonLdConfig)).error(errorHandler);
    };

    api.uploadDistribution = function(datasetId, file, metadata) {
      var meta = new Blob([JSON.stringify(metadata)],
                          {type: 'application/ld+json'});

      return Upload.upload({
        url: endpoint + '/catalog/distributions',
        method: 'POST',
        file: {file: file, meta:meta},
        headers: {
          'dataset-id': datasetId,
          Authorization: apiAuthorization
        }
      }).error(errorHandler);
    };

    api.updateDistribution = function(metadata) {
      var meta = new Blob([JSON.stringify(metadata)],
                          {type: 'application/ld+json'});

      return Upload.upload({
        url: endpoint + '/catalog/distributions',
        method: 'PUT',
        file: {meta: meta},
        headers: {
          Authorization: apiAuthorization
        }
      }).error(errorHandler);
    };

    /*api.distributionFile = function(distributionID) {
      return $http.get(endpoint + '/catalog/distributions/file', {
        headers: {
          'distrib-id': distributionID,
          Authorization: apiAuthorization
        }
      }).error(errorHandler);
    };*/

    api.createRepository = function(distributionID) {
      return $http({
        url: endpoint + '/catalog/distributions/repository',
        method: 'PUT',
        headers: {
          Accept: 'application/ld+json',
          'distrib-id': distributionID,
          Authorization: apiAuthorization
        }
      }).error(errorHandler);
    };

    return api;
  };
});
