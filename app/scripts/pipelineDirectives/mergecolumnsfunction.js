'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:mergeColumnsFunction
 * @description
 * # mergeColumnsFunction
 */
angular.module('grafterizerApp')
  .directive('mergeColumnsFunction', function(transformationDataModel) {
    return {
     // require:"previewTable",
      templateUrl: 'views/pipelineFunctions/mergeColumnsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.MergeColumnsFunction([],null,null,null);
          scope.function.docstring = null;
        }

  scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined') ? [] : scope.$parent.$root.colnames();
var colCtr = 0;
scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug

          return new transformationDataModel.MergeColumnsFunction(
            scope.function.colsToMerge,
            scope.function.separator,
            scope.function.newColName,
            scope.function.docstring);
        };

      }
    };
  });
  
