'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.jarfterService
 * @description
 * # jarfterService
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
.provider('jarfterService', function($sceDelegateProvider) {
  var endpoint = '';

  this.setEndpoint = function(newEndpoint) {
    var sceList = $sceDelegateProvider.resourceUrlWhitelist();
    sceList.push(newEndpoint + '/**');
    $sceDelegateProvider.resourceUrlWhitelist(sceList);
    endpoint = newEndpoint;
  };

  this.$get = function($http) {
    var api = {};

    api.getJarCreatorStandAloneEndpoint = function(clojure) {
      return endpoint + '/jarfter/webresources/jarCreatorStandAlone';
    };

    return api;
  };
});
