'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.pipe
 * @description
 * # pipe
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('PipeService', function ($http, $log, $mdToast) {
  	var urlBase = "http://localhost:3000";

    var transformEdnResponse = function(data, headers) {
      try {
        return {
          raw: data,
          edn: jsedn.toJS(jsedn.parse(data))
        };
      } catch(e) {
        $log.debug(data);
        $log.error(e);
        return {
          raw: data,
          jsedn: null
        };
      }
    };

    var errorHandler = function(data, status, headers, config){
      var message;
      if (data && data.error) {
        message = "API error: "+data.error;
      } else if (status) {
        message = "Error "+status+" while contacting the API";
      } else {
        message = "An error occured when contacting the API";
      }

      $mdToast.show(
        $mdToast.simple()
        .content(message)
        .position('bottom left')
        .hideDelay(3000)
      );
    };
    this.preview = function(distributionUri, transformationUri) {
        return $http({
            // url: urlBase+"/poney",
            url: urlBase+"/lapin",
            method: 'GET',
            params: {
                distributionUri: distributionUri,
                transformationUri: transformationUri
            },
            transformResponse: [transformEdnResponse]
        }).error(errorHandler);;
    };

    this.original = function(distributionUri) {
        return $http({
            url: urlBase+"/vache",
            method: 'GET',
            params: {
                distributionUri: distributionUri
            },
            transformResponse: [transformEdnResponse]
        }).error(errorHandler);;
    };

  	this.pipe = function(transformationId, fileId) {
  		var path = urlBase+"/pipe/"+transformationId+"/"+fileId+".json";

  		return $http.get(path).error(errorHandler);;
  	};
  });
