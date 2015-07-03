'use strict';

/**
 * @ngdoc filter
 * @name grafterizerApp.filter:startFrom
 * @function
 * @description
 * # startFrom
 * Filter in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .filter('startFrom', function() {
    return function(input, start) {
      start = +start; //parse to int
      if (input === undefined) {
        return;
      }

      return input.slice(start);
    };
  });
