'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:groupRows
 * @description
 * # groupRows
 */
angular.module('grafterizerApp')
  .directive('groupRows', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/groupRowsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.GroupRowsFunction([],[null,null], null);
          scope.function.docstring = null;
        }
        if (!(scope.function instanceof transformationDataModel.GroupRowsFunction)) {
          var newFunction = new transformationDataModel.GroupRowsFunction([],[null,null],null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }
      
        scope.getSetLength = function(num) {
          var b = [];
          for (var i = 0; i <num; i += 2) b.push(i);
          return b;
        };
scope.aggrFunctions = ['MIN','MAX','SUM','COUNT','AVG'];
// fn to create new colname items if not in preview mode
  scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined') ? [] : scope.$parent.$root.colnames();
var colCtr = 0;
scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.GroupRowsFunction(scope.function.colnames, scope.function.colnamesFunctionsSet, scope.function.docstring);
        };
        scope.addAggregation = function() {
            scope.function.colnamesFunctionsSet.push(null,null);

      };
        scope.removeAggregation = function(index) {
            this.function.colnamesFunctionsSet.splice(index,2);
        };
      }
    };
  });
  
