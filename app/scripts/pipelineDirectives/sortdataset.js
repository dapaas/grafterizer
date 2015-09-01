'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:sortDataset
 * @description
 * # sortDataset
 */
angular.module('grafterizerApp')
  .directive('sortDataset', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/sortDatasetFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.SortDatasetFunction(null, null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.SortDatasetFunction(scope.function.colName,scope.function.docstring);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  
