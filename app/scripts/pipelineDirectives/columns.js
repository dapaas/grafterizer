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
        if (!scope.cfunction) {
          scope.cfunction = new transformationDataModel.ColumnsFunction(
            [], null, 0, true, null);
          scope.cfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.ColumnsFunction(scope.cfunction.columnsArray,
            scope.cfunction.useLazy,
            scope.cfunction.numberOfColumns,
            scope.cfunction.take,
            scope.cfunction.docstring);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  