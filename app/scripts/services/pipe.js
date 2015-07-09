'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.pipe
 * @description
 * # pipe
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('PipeService', function($http, $log, $mdToast) {
    var urlBase = /*window.location.origin === 'http://localhost:9000' ?*/
      'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8080';
      // : '/backend';
      // urlBase = 'http://localhost:8080';
    var apiAuthorization = 'Basic ' + window.btoa('s4key:s4pass');
    this.setAuthorization = function(keypass) {
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
    };

    this.computeTuplesHref = function(distributionUri, transformationUri) {
      return urlBase + '/download?transformation=' +
        window.encodeURIComponent(transformationUri) +
        '&distribution=' + window.encodeURIComponent(distributionUri);
    };

    this.preview = function(distributionUri, clojure) {
      return $http({
        url: urlBase + '/preview',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiAuthorization
        },
        data: {
          distributionUri: distributionUri,
          clojure: clojure
        },
        transformResponse: [transformEdnResponse]
      });
    };

    this.original = function(distributionUri) {
      return $http({
        url: urlBase + '/original',
        method: 'GET',
        params: {
          distributionUri: distributionUri
        },
        headers: {
          Authorization: apiAuthorization
        },
        transformResponse: [transformEdnResponse]
      }).error(errorHandler);
    };
  });
