'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:rdfMapping
 * @description
 * # rdfMapping
 */
angular.module('grafterizerApp')
  .directive('rdfMapping', function () {
    return {
      templateUrl: 'views/rdfmapping.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
