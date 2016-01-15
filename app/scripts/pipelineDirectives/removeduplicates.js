'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:removeDuplicates
 * @description
 * # removeDuplicatese
 */
angular.module('grafterizerApp')
  .directive('removeDuplicates', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/removeDuplicates.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.RemoveDuplicatesFunction(
            'full', [], null, null);
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
          return new transformationDataModel.RemoveDuplicatesFunction(scope.function
            .mode,
            scope.function.colNames,
            scope.function.separator,
            scope.function.docstring);
        };
      }
    };
  });
  
