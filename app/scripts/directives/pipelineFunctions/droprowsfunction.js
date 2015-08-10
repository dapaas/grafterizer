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
            numberOfRows: 1,
            take: true,
            docstring: null
          };
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.DropRowsFunction(parseInt(
            scope.function.numberOfRows),scope.function.take, scope.function.docstring);
        };
        scope.doGrep = function() {
        scope.$parent.selectedFunctionName = 'grep';
        }
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
