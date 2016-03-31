'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:meltFunction
 * @description
 * # meltFunction
 */
angular.module('grafterizerApp')
  .directive('meltFunction', function(transformationDataModel, $rootScope) {
    return {
      templateUrl: 'views/pipelineFunctions/meltFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.MeltFunction(
            [], null, null, null, null, null);
          scope.function.docstring = null;
        }
        scope.aggrFunctions = ['MIN','MAX','SUM','COUNT','COUNT-DISTINCT','AVG','MERGE'];
        scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined') ? [] : scope.$parent.$root.colnames();
        var colCtr = 0;
        scope.addColumn = function(query) {
          return {
            id: colCtr++,
            value: query
          };
        };
                  
        if (scope.function.columnsArray.length > 0) {
          scope.reshapedatasetmode = 'melt';
        } else if (scope.function.variable !== null) {
          scope.reshapedatasetmode = 'cast';
        }
        scope.$watch('reshapedatasetmode', function(value) {
          switch (value) {
            case 'melt':
              scope.function.variable = null;
              scope.function.value = null;
              scope.function.aggrFunction = null;
              break;
            case 'cast':
              scope.function.columnsArray = [];
              break;
          }
        });
          
     
          scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MeltFunction(scope.function.columnsArray, scope.function.variable, scope.function.value, scope.function.aggrFunction, scope.function.separator, scope.function.docstring);
        };
      }
    };
  });
