'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:dropRowsFunction
 * @description
 * # dropRowsFunction
 */
angular.module('grafterizerApp')
  .directive('dropRowsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/dropRowsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = {
            indexFrom: 0,
            indexTo: 1,
            take: false,
            docstring: null
          };
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.DropRowsFunction(
            parseInt(scope.function.indexFrom), parseInt(scope.function.indexTo), scope.function.take, scope.function.docstring);
        };

        scope.doGrep = function() {
          scope.$parent.selectefunctionName = 'grep';
        };

      }
    };
  });
