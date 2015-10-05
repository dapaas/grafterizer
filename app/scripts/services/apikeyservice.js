'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.apiKeyService
 * @description
 * # apiKeyService
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('apiKeyService', function(PipeService, ontotextAPI) {
    var key = '';
    var secret = '';
    var keypass = '';

    this.getKey = function() {
      return key;
    };

    this.getSecret = function() {
      return secret;
    };

    this.getKeyPass = function() {
      return keypass;
    };

    this.setKeyPass = function(newKeypass) {
      if (!newKeypass || !newKeypass.length) {
        return;
      }
      
      keypass = newKeypass;
      var split = keypass.split(':');
      key = split[0];
      secret = split[1];

      ontotextAPI.setAuthorization(keypass);
      PipeService.setAuthorization(keypass);
    };

    var localStorageKey = 'ontotextAuth';
    var localStorage = window.localStorage;

    if (localStorage.hasOwnProperty(localStorageKey)) {
      this.setKeyPass(localStorage.getItem(localStorageKey));
    }

    this.save = function() {
      localStorage.setItem(localStorageKey, keypass);
    };

    this.hasKeyPass = function() {
      return keypass.length > 0;
    };
  });
