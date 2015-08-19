'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:makeDataset
 * @description
 * # makeDataset
 */
angular.module('grafterizerApp')
  .directive('makeDataset', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/makeDatasetFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.MakeDatasetFunction(
            [], null, 0, null, null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MakeDatasetFunction(scope.function
            .columnsArray,
            scope.function.useLazy,
            scope.function.numberOfColumns,
            scope.function.moveFirstRowToHeader,
            scope.function.docstring);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  