'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:splitFunction
 * @description
 * # splitgFunction
 */
angular.module('grafterizerApp')
  .directive('splitFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/splitFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {

          scope.function = new transformationDataModel.SplitFunction('', '', '', null);
          scope.function.newColName = null;
          scope.function.docstring = null;
        }

        scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined')? [] : scope.$parent.$root.colnames();
var colCtr = 0;
scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.SplitFunction(
            scope.function.colName, scope.function.separator, scope.function.docstring
          );
        };

      }
    };
  });
