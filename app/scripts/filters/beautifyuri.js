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
    var r = /[ \+.\-:]/g;

    return function(input) {
      var p = input.match(m);
      if (!p) return input;

      return p[1].replace(r, ' ').replace(' csv ', ' ');
    };
  });
