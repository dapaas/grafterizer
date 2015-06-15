'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:mapc
 * @description
 * # mapc
 */
angular.module('grafterizerApp')
  .directive('mapc', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the mapc directive');
      }
    };
  });
