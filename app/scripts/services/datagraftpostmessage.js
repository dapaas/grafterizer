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

  var receiveMessage = function(event) {
    var data = event.data;
    if (!data || !data.channel || data.channel !== channel) return;

    try {
      switch (data.message) {
        case 'state.go':
          $state.go(data.state, data.toParams);
          break;
        case 'set-authorization':
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
});
