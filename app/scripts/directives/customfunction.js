'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:customFunction
 * @description
 * # customFunction
 */
angular.module('grafterizerApp')
  .directive('customFunction', function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the customFunction directive');
      }
    };
  });
