'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.dataGraftApi
 * @description
 * # dataGraftApi
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('dataGraftApi', function ($http, $httpParamSerializer) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    var dgApi = new API.Client.DefaultApi($http=$http,  $httpParamSerializer=$httpParamSerializer);
    
    this.username = "havahol";
    this.apiKey = "s4n7s3ehlrbi:8l29krbjh0jnp2h";
    
    //Need to set correct headers for accepting headers only.
    // Otherwise the response will be given as a html
    dgApi.defaultHeaders = angular.extend(dgApi.defaultHeaders, {'Accept': 'application/json'});
    dgApi.defaultHeaders= angular.extend(dgApi.defaultHeaders, {'X-user-token': this.apiKey})
    

    
    this.test = function() {
        dgApi.userTransformationsGet(this.username)
             .success( function (data) {
                   console.log(data);
             });
    }
    
    this.getTransformation = function(id) {
        return dgApi.userTransformationsIdGet(this.username, id);   // /{user}/transformation/{id}
    }
    
    
    this.transformationCreateMetadata = function(id, metadata) { 
        return dgApi.userTransformationsIdMetadataPost(this.username, id, metadata);
    }
    
    this.utilityFunctionsList = function(showPublic) {
        if (showPublic) {
            return dgApi.userUtilityFunctionsGet(this.username);
        } else {
            // Insert dgApi.userUtilityFunctionsPublicGet when this exists.
        }
    }
    
    this.utilityFunctionGet = function(id) {
        return dgApi.userUtilityFunctionsIdGet(this.username, id);
    }
    
    this.utilityFunctionDelete = function(id) {
        return dgApi.userUtilityFunctionsIdDelete(this.username, id);
    }
    
  });
