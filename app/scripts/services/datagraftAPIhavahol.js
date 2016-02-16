'use strict';

angular.module('grafterizerApp')
.provider('datagraftAPI', [$scope, $http, $httpParamSerializer, function() {
    
    var dgApi = new API.Client.DefaultApi($http=$http,  $httpParamSerializer=$httpParamSerializer);
    
    //Need to set correct headers for accepting headers only.
    // Otherwise the response will be given as a html
    dgApi.defaultHeaders = angular.extend(dgApi.defaultHeaders, {'Accept': 'application/json'});
    dgApi.defaultHeaders= angular.extend(dgApi.defaultHeaders, {'X-user-token': "s4n7s3ehlrbi:8l29krbjh0jnp2h"})
    
    
    getTransformations = function() {
        dgApi.userTransformationsGet("havahol")
             .success( function (data) {
                   console.log(data);
             });
    }
    
    
}]);