'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.leObject
 * @description
 * # leObject
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('leObject', function() {
    this.object = {};
    this.serveraddress = window.location.origin === 'http://localhost:9000' ?
      'https://grafterizer.datagraft.net/ManageVocabulary/api/vocabulary/'
      : '/ManageVocabulary/api/vocabulary/';
      
    this.storage = window.localStorage;

  });
