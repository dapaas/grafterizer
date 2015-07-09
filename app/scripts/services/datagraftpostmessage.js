'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.datagraftPostMessage
 * @description
 * # datagraftPostMessage
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
.service('datagraftPostMessage', function($state, ontotextAPI, PipeService) {

  var channel = 'datagraft-post-message';

  var receiveMessage = function(event) {
    var data = event.data;
    if (!data || !data.channel || data.channel !== channel) return;

    try {
      console.log(data.message);
      switch (data.message) {
        case 'state.go':
          $state.go(data.state, data.toParams);
          break;
        case 'set-authorization':
          ontotextAPI.setAuthorization(data.keypass);
          PipeService.setAuthorization(data.keypass);
          break;
      };
    } catch (e) {
      console.log(e);
    }
  };

  this.setup = function() {
             console.log("setup")
    window.addEventListener('message', receiveMessage, false);
    window.parent.postMessage({
      channel: channel,
      message: 'ready'
    }, '*');
  };
});
