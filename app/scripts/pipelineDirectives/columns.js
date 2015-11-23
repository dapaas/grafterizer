'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:columnsFunction
 * @description
 * # columnsFunction
 */
angular.module('grafterizerApp')
  .directive('columnsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/columnsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.ColumnsFunction(
            [], 0, 0, true, null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
 
return new transformationDataModel.ColumnsFunction(scope.function.columnsArray,
            scope.function.indexFrom,
            scope.function.indexTo,
            scope.function.take,
            scope.function.docstring);
        };
      }
    };
  });
  
