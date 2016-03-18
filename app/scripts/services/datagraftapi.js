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
    
    // Using the reserved keyword making the server find the correct username automagically
    this.username = "myassets";
    
    
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
    
    // ---------- TRANSFORMATIONS ----------------
    
    this.getTransformation = function(id) {
        return dgApi.userTransformationsIdGet(this.username, id);   // /{user}/transformation/{id}
    }
    
    
    this.transformationCreateMetadata = function(id, metadata) { 
        return dgApi.userTransformationsIdMetadataPost(this.username, id, metadata);
    }
    
    this.transformationGetMetadata = function(id) {
        return dgApi.userTransformationsIdMetadataGet(this.username, id);
    }
    
    
    this.transformationGetMetadataByKey = function(id, key) {
        return dgApi.userTransformationsIdMetadataKeyGet(this.username, id, key);
    }
    
    this.transformationUpdateMetadataByKey = function(id, key, newValue) {
        dgApi.defaultHeaders['Content-Type'] = 'text/plain';
        var request = dgApi.userTransformationsIdMetadataKeyPut(this.username, id, key, newValue);
        delete dgApi.defaultHeaders['Content-Type'];
        
        return request;
    }
    
    this.transformationCreateMetadataByKey = function(id, key, value) {
        dgApi.defaultHeaders['Content-Type'] = 'text/plain';
        var request = dgApi.userTransformationsIdMetadataKeyPost(this.username, id, key, value);
        delete dgApi.defaultHeaders['Content-Type'];
        
        return request;
    }
    
    this.transformationDeleteMetadataByKey = function(id, key) {
        return dgApi.userTransformationsIdMetadataKeyDelete(this.username, id, key);
    }
    
    // ----- TRANSFORMATION CONFIGURATION ----------------
    
    this.transformationGetConfiguration = function(id) {
        return dgApi.userTransformationsIdConfigurationGet(this.username, id);
    }
    
    this.transformationCreateConfiguration = function(id, config) { 
        return dgApi.userTransformationsIdConfigurationPost(this.username, id, config);
    }
    
    this.transformationGetConfigurationByKey = function(id, key) {
        return dgApi.userTransformationsIdConfigurationKeyGet(this.username, id, key);
    }
    
    this.transformationUpdateConfigurationByKey = function(id, key, newValue) {
        dgApi.defaultHeaders['Content-Type'] = 'text/plain';
        var request = dgApi.userTransformationsIdConfigurationKeyPut(this.username, id, key, newValue);
        delete dgApi.defaultHeaders['Content-Type'];
        
        return request;
    }
    
    this.transformationCreateConfigurationByKey = function(id, key, value) {
        dgApi.defaultHeaders['Content-Type'] = 'text/plain';
        var request = dgApi.userTransformationsIdConfigurationKeyPost(this.username, id, key, value);
        delete dgApi.defaultHeaders['Content-Type'];
        
        return request;
    }
    
    this.transformationDeleteConfigurationByKey = function(id, key) {
        return dgApi.userTransformationsIdConfigurationKeyDelete(this.username, id, key);
    }
    
    
    // ----- UTILITY FUNCTIONS CONFIGURATION ------------
    
    this.utilityFunctionGetConfiguration = function(id) {
        return dgApi.userUtilityFunctionsIdConfigurationGet(this.username, id);
    }
    
    this.utilityFunctionCreateConfiguration = function(id, config) { 
        return dgApi.userUtilityFunctionsIdConfigurationPost(this.username, id, config);
    }
    
    this.utilityFunctionGetConfigurationByKey = function(id, key) {
        return dgApi.userUtilityFunctionsIdConfigurationKeyGet(this.username, id, key);
    }
    
    this.utilityFunctionUpdateConfigurationByKey = function(id, key, newValue) {
        dgApi.defaultHeaders['Content-Type'] = 'text/plain';
        var request = dgApi.userUtilityFunctionsIdConfigurationKeyPut(this.username, id, key, newValue);
        delete dgApi.defaultHeaders['Content-Type'];
        
        return request;
    }
    
    this.utilityFunctionCreateConfigurationByKey = function(id, key, value) {
        dgApi.defaultHeaders['Content-Type'] = 'text/plain';
        var request = dgApi.userUtilityFunctionsIdConfigurationKeyPost(this.username, id, key, value);
        delete dgApi.defaultHeaders['Content-Type'];
        
        return request;
    }
    
    this.utilityFunctionDeleteConfigurationByKey = function(id, key) {
        return dgApi.userUtilityFunctionsIdConfigurationKeyDelete(this.username, id, key);
    }
    
    
    
    
    // ----- UTILITY FUNCTIONS ---------------
    
    this.utilityFunctionsList = function() {
        return dgApi.userUtilityFunctionsGet(this.username);
    }
    
    this.utilityFunctionCreate = function(utilityFunction) {
        return dgApi.userUtilityFunctionsPost(this.username, utilityFunction)
    }
    
    this.utilityFunctionGet = function(id) {
        return dgApi.userUtilityFunctionsIdGet(this.username, id);
    }
    
    this.utilityFunctionDelete = function(id) {
        return dgApi.userUtilityFunctionsIdDelete(this.username, id);
    }
    
    this.utilityFunctionPatch = function(id, patchedUtilityFunction) {
        return dgApi.userUtilityFunctionsIdPatch(this.username, id, patchedUtilityFunction);
    }
    
    
  });
