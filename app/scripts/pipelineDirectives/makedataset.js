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

        scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined') ? [] : scope.$parent.$root.colnames();
        var colCtr = 0;
        scope.addColumn = function(query) {
          return {
            id: colCtr++,
            value: query
          };
        };

        if (scope.function.useLazy) {
          scope.makedatasetmode = 'fetch';
        } else if (scope.function.moveFirstRowToHeader) {
          scope.makedatasetmode = 'header';
        } else {
          scope.makedatasetmode = 'specify';
        }

        scope.$watch('makedatasetmode', function(value) {
          switch (value) {
            case 'specify':
              scope.function.useLazy = false;
              scope.function.moveFirstRowToHeader = false;
              break;
            case 'header':
              scope.function.moveFirstRowToHeader = true;
              scope.function.useLazy = false;
              break;
            case 'fetch':
              scope.function.moveFirstRowToHeader = false;
              scope.function.useLazy = true;
          }
        });
      }
    };
  });
  
