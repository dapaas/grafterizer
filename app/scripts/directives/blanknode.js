'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:blankNode
 * @description
 * # blankNode
 */
angular.module('grafterizerApp')
  .directive('blankNode', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the blankNode directive');
      }
    };
  });
