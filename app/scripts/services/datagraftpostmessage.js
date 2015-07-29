'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.datagraftPostMessage
 * @description
 * # datagraftPostMessage
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
.service('datagraftPostMessage', function($state, apiKeyService) {

  var channel = 'datagraft-post-message';
  var connected = false;

  var receiveMessage = function(event) {
    var data = event.data;
    if (!data || !data.channel || data.channel !== channel) return;

    try {
      switch (data.message) {
        case 'state.go':
          $state.go(data.state, data.toParams);
          break;
        case 'set-authorization':
          connected = true;
          apiKeyService.setKeyPass(data.keypass);
          break;
      };
    } catch (e) {
      console.log(e);
    }
  };

  this.setup = function() {
    window.addEventListener('message', receiveMessage, false);
    window.parent.postMessage({
      channel: channel,
      message: 'ready'
    }, '*');
  };

  this.isConnected = function() {
    return connected;
  };

  this.setLocation = function(location) {
    window.parent.postMessage({
      channel: channel,
      message: 'set-location',
      location: location
    }, '*');
  };
});
