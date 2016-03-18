'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.backendService
 * @description
 * # backendService
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
.provider('backendService', function() {

  var endpoint = '';
  this.setEndpoint = function(newEndpoint) {
    endpoint = newEndpoint;
  };

  this.$get = function($http, $mdToast, Upload, $log, $state, $q) {
    var api = {};

    var errorHandler = function(data, status, headers, config) {
      var message;
      if (data && data.error) {
        message = 'API error: ' + data.error;
      } else if (status) {
        if (status === 401) {
          window.location = endpoint + '/oauth/begin';
          // message = 'Unauthorized access to the API';
          // $state.go('apikey');
        } else {
          message = 'Error ' + status + ' while contacting server';
          // window.location = endpoint + '/oauth/begin';
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

    var computeTransformationUrl = function(publisher, id) {
      return endpoint + '/' + encodeURIComponent(publisher) + '/transformations/' + encodeURIComponent(id);
    };

    api.transformations = function() {
      return $http.get(endpoint + '/myassets/transformations').error(errorHandler);
    };

    api.publicTransformations = function() {
      errorHandler({error: 'Not implemented'});
      return {success: function() {}};
    };

    api.searchTransformations = function() {
      errorHandler({error: 'Not implemented'});
      return {success: function() {}};
    };

    api.transformation = function(publisher, id) {
      return $http.get(computeTransformationUrl(publisher, id)).error(errorHandler);
    };

    var createOrUpdateTransformation = function(updateInfos, base, metadata, configuration) {
      var method = updateInfos ? 'put' : 'post';
      var url = updateInfos ? computeTransformationUrl(updateInfos.publisher, updateInfos.id) : (endpoint + '/myassets/transformations');

      var d = $q.defer();
      $http[method](url, {
        name: base.name,
        public: base.public
      }).success(function(data) {
        var publisher = data['foaf:publisher'];
        var id = data.id;
        $q.all([
          $http.post(computeTransformationUrl(publisher, id) + '/metadata', metadata),
          $http.post(computeTransformationUrl(publisher, id) + '/configuration', configuration)
        ]).then(function() {
          d.resolve({id: id, publisher: publisher});
        }, function(data, status, headers, config) {
          errorHandler(data, status, headers, config);
          d.reject();
        });
      }).error(errorHandler).error(function() {
        d.reject();
      });
      return d.promise;
    };

    api.newTransformation = function(base, metadata, configuration) {
      return createOrUpdateTransformation(false, base, metadata, configuration);
    };

    api.updateTransformation = function(publisher, id, base, metadata, configuration) {
      return createOrUpdateTransformation({
        publisher: publisher,
        id: id
      }, base, metadata, configuration);
    };

    api.deleteTransformation = function(publisher, id) {
      return $http.delete(computeTransformationUrl(publisher, id)).error(errorHandler);
    };

    api.getTransformationJson = function(publisher, id) {
      return $http.get(computeTransformationUrl(publisher, id) + '/configuration/extra').error(errorHandler);
    };

    api.dataDistributions = function() {
      return $http.get(endpoint + '/myassets/data_distributions').error(errorHandler);
    };

    api.uploadDistribution = function(file, metadata) {
      return Upload.upload({
        url: endpoint + '/myassets/data_distributions',
        method: 'POST',
        data: {
          'data_distribution[name]': metadata.title,
          'data_distribution[description]': metadata.description,
          'data_distribution[file]': file
        }
      }).error(errorHandler);
    };

    return api;
  };
});
