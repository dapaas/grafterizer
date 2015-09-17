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

    var endpointRest = '';
    var endpointCache = '';

    this.setEndpoints = function(newEndpointRest, newEndpointCache) {
      endpointRest = newEndpointRest;
      endpointCache = newEndpointCache;
    };

    var apiAuthorization = '';

    this.$get = function($http, $log, $mdToast, $q, cfpLoadingBar, $mdDialog) {

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
          message = 'Error ' + status + ' while contacting server';
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
            file: 'pipe',
            method: 'errorHandler'
          }
        });
      };

      api.computeTuplesHref = function(distributionUri, transformationUri, type) {
        return endpointRest + '/download?authorization=' +
          window.encodeURIComponent(apiAuthorization) +
          '&transformationUri=' +
          window.encodeURIComponent(transformationUri) +
          '&distributionUri=' + window.encodeURIComponent(distributionUri) +
          '&type=' + (type ? window.encodeURIComponent(type) : 'pipe');
      };

      var loadDataAsync = function(deferred, hash, nbIterations, justTheStatusPlease) {
        if (nbIterations === 0) {
          cfpLoadingBar.start();
          cfpLoadingBar.set(0.33);
        }

        var url = endpointCache + '/graftermemcache/' + hash;

        var reqUrl = url;
        if (justTheStatusPlease) {
          reqUrl += '?status=1';
        }

        $http({
          url: reqUrl,
          method: 'GET',
          transformResponse: [transformEdnResponse],
          ignoreLoadingBar: true
        }).error(errorHandler).error(function(data) {
          deferred.reject(data);
          cfpLoadingBar.complete();
        }).success(function(data, status) {
          if (status === 200) {

            if (justTheStatusPlease) {
              data.url = url;
            }

            deferred.resolve(data);
            cfpLoadingBar.complete();
          } else {
            cfpLoadingBar.inc();
            window.setTimeout(loadDataAsync.bind(undefined, deferred, hash, ++nbIterations, justTheStatusPlease), 100);
          }
        });
      };

      api.computeTuplesHrefAsync = function(distributionUri, transformationUri, type) {
        var deferredFinal = $q.defer();
        var deferredMiddle = $q.defer();

        $http({
          url: api.computeTuplesHref(distributionUri, transformationUri, type) + '&useCache=1',
          method: 'GET'
        }).error(errorHandler).error(function() {
          deferredFinal.reject();
          deferredMiddle.reject();
        }).success(function(data) {
          deferredMiddle.resolve();
          loadDataAsync(deferredFinal, data.hash, 0, true);
        });

        return {
          final: deferredFinal.promise,
          middle: deferredMiddle.promise
        };
      };

      var lastPreviewDuration = Number.MAX_VALUE;

      api.preview = function(distributionUri, clojure, page, pageSize) {
        var deferred = $q.defer();

        var startTime = +new Date();
        $http({
          url: endpointRest + '/preview',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: apiAuthorization
          },
          data: {
            distributionUri: distributionUri,
            clojure: clojure,
            page: page || 0,
            pageSize: pageSize || 100,
            useCache: 1
          }
        }).error(errorHandler).error(function() {
          deferred.reject();
        }).success(function(data) {
          if (data.duration && data.duration > 0) {
            lastPreviewDuration = data.duration;
          } else {
            deferred.promise.then(function() {
              lastPreviewDuration = (+new Date()) - startTime;
            });
          }

          loadDataAsync(deferred, data.hash, 0);
        });

        return deferred.promise;
      };

      api.getLastPreviewDuration = function() {
        return lastPreviewDuration;
      };

      api.original = function(distributionUri, page, pageSize) {
        var deferred = $q.defer();

        $http({
          url: endpointRest + '/original',
          method: 'GET',
          params: {
            distributionUri: distributionUri,
            page: page || 0,
            pageSize: pageSize || 100,
            useCache: 1
          },
          headers: {
            Authorization: apiAuthorization
          }
        }).error(errorHandler).error(function() {
          deferred.reject();
        }).success(function(data) {
          loadDataAsync(deferred, data.hash, 0);
        });

        return deferred.promise;
      };

      api.download = function(distributionUri, transformationUri, type) {
        return $http({
          url: endpointRest + '/download',
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
          url: endpointRest + '/save',
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
          url: endpointRest + '/fillRDFrepo',
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
