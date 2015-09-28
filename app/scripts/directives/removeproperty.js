'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:removeProperty
 * @description
 * # removeProperty
 */
angular.module('grafterizerApp')
  .directive('removeProperty', function($mdDialog) {
    return {
      templateUrl: 'views/removeproperty.html',
      restrict: 'E',
      scope: {
        property: '=',
        parent: '='
      },
      link: function postLink(scope, element, attrs) {

        scope.removeProperty = function(property) {
          $mdDialog.show(
            $mdDialog.confirm()
            .title('Are you sure you want to remove this element?')
            .content('Please confirm that you want to remove the element.')
            .ariaLabel('Please confirm that you want to remove the element.')
            .ok('Yes')
            .cancel('Cancel')).then(function() {
            scope.parent.removeChild(property);
          });

        };
      }
    };
  });
