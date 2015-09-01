'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.pipe
 * @description
 * # pipe
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
.provider('PipeService', function() {

  var endpoint = '';
  this.setEndpoint = function(newEndpoint) {
    endpoint = newEndpoint;
  };

  var apiAuthorization = '';

  this.$get = function($http, $log, $mdToast) {

    var api = {};
    api.setAuthorization = function(keypass) {
      apiAuthorization = 'Basic ' + window.btoa(keypass);
    };

    var transformEdnResponse = function(data, headers) {
      try {
        var contentType = headers('Content-Type');
        if (contentType && contentType.indexOf('application/json') === 0) {
          return {
            raw: data,
            jsedn: null,
            json: JSON.parse(data)
          };
        }

        return {
          raw: data,
          edn: jsedn.toJS(jsedn.parse(data))
        };
      } catch (e) {
        $log.debug(data);
        $log.error(e);
        Raven.captureException(e);
        return {
          raw: data,
          jsedn: null
        };
      }
    };

    var errorHandler = function(data, status, headers, config) {
      var message;
      if (data && data.error) {
        message = 'API error: ' + data.error;
      } else if (status) {
        message = 'Error ' + status + ' while contacting the API';
      } else {
        message = 'An error occured when contacting the API';
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
          file: 'pipe',
          method: 'errorHandler'
        }
      });
    };

    api.computeTuplesHref = function(distributionUri, transformationUri, type) {
      return endpoint + '/download?authorization=' +
        window.encodeURIComponent(apiAuthorization) +
        '&transformationUri=' +
        window.encodeURIComponent(transformationUri) +
        '&distributionUri=' + window.encodeURIComponent(distributionUri) +
        '&type=' + (type ? window.encodeURIComponent(type) : 'pipe');
    };

    api.preview = function(distributionUri, clojure, page, pageSize) {
      return $http({
        url: endpoint + '/preview',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiAuthorization
        },
        data: {
          distributionUri: distributionUri,
          clojure: clojure,
          page: page || 0,
          pageSize: pageSize || 100
        },
        transformResponse: [transformEdnResponse]
      });
    };

    api.original = function(distributionUri, page, pageSize) {
      return $http({
        url: endpoint + '/original',
        method: 'GET',
        params: {
          distributionUri: distributionUri,
          page: page || 0,
          pageSize: pageSize || 100
        },
        headers: {
          Authorization: apiAuthorization
        },
        transformResponse: [transformEdnResponse]
      }).error(errorHandler);
    };

    api.download = function(distributionUri, transformationUri, type) {
      return $http({
        url: endpoint + '/download',
        method: 'GET',
        params: {
          authorization: apiAuthorization,
          distributionUri: distributionUri,
          transformationUri: transformationUri,
          type: type || 'pipe',
          raw: true
        },
        transformResponse: [transformEdnResponse]
      });
    };

    api.save = function(datasetId, distributionUri, transformationUri, type) {
      return $http({
        url: endpoint + '/save',
        method: 'GET',
        params: {
          datasetId: datasetId,
          authorization: apiAuthorization,
          distributionUri: distributionUri,
          transformationUri: transformationUri,
          type: type || 'pipe'
        }
      });
    };

    api.fillRDFrepo = function(distributionUri, repositoryUri) {
      return $http({
        url: endpoint + '/fillRDFrepo',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiAuthorization
        },
        data: {
          distributionUri: distributionUri,
          repositoryUri: repositoryUri
        }
      });
    };

    return api;
  };
});
