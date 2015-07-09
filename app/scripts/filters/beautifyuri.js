'use strict';

/**
 * @ngdoc filter
 * @name grafterizerApp.filter:beautifyUri
 * @function
 * @description
 * # beautifyUri
 * Try to make something from an ugly Uri
 */
angular.module('grafterizerApp')
  .filter('beautifyUri', function() {
    var m = /\/([^\/]*)$/;
    var r = /[ \+.\-_:]/g;

    return function(input) {
      var p = input.match(m);
      if (!p) return input;

      var b = p[1].replace(r, ' ').replace(' csv ', ' ');
      return b.charAt(0).toUpperCase() + b.slice(1);
    };
  });
