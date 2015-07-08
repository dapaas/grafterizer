'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:takeRowsFunction
 * @description
 * # takeRowsFunction
 */
angular.module('grafterizerApp')
  .directive('takeRowsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/takeRowsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = {
            numberOfRows: 1
          };
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.TakeRowsFunction(parseInt(
            scope.function.numberOfRows));
        };
      }
    };
  });
