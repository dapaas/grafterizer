'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.persistentTabs
 * @description
 * # persistentTabs
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('persistentTabs', function () {
    var prefixKey = 'persistenttabs-';

    if (!window.sessionStorage) {
        window.sessionStorage = {};
    }

    this.bind = function(scope, key, name) {
        var index = prefixKey+name;
        scope[key] = window.sessionStorage[index];
        scope.$watch(key, function(){
            window.sessionStorage[index] = scope[key];
        });
    };
  });
