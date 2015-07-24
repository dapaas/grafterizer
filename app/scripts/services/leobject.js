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
    this.serveraddress = 'http://localhost:8080/ManageVocabulary/api/vocabulary/';
    //this.serveraddress = 'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/';
    this.storage = window.localStorage;


  });
