'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:removeNode
 * @description
 * # removeNode
 */
angular.module('grafterizerApp')
  .directive('removeNode', function ($mdDialog) {
    return {
      templateUrl: 'views/removenode.html',
      restrict: 'E',
      scope: {
        node: '=',
        parent: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.removeNode = function(node) {
          $mdDialog.show(
            $mdDialog.confirm()
            .title(
              'Are you sure you want to remove this element?')
            .content(
              'Please confirm that you want to remove the element.'
            )
            .ariaLabel(
              'Please confirm that you want to remove the element.'
            )
            .ok('Yes')
            .cancel('Cancel')).then(function() {
            scope.parent.removeChild(node);
          });
        };
      }
    };
  });
