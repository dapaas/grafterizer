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
        if (!scope.mfunction) {
          scope.mfunction = new transformationDataModel.MakeDatasetFunction(
            [], null, 0, null, null);
          scope.mfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MakeDatasetFunction(scope.mfunction
            .columnsArray,
            scope.mfunction.useLazy,
            scope.mfunction.numberOfColumns,
            scope.mfunction.moveFirstRowToHeader,
            scope.mfunction.docstring);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  