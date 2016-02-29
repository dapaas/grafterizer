'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:fillCells
 * @description
 * # fillCells
 */
angular.module('grafterizerApp')
  .directive('fillCells', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/fillCellsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.FillCellsFunction(null,null,null,null,null,null,null,null);
          scope.function.docstring = null;
        }
        if (!(scope.function instanceof transformationDataModel.FillCellsFunction)) {
          var newFunction = new transformationDataModel.FillCellsFunction(null,null,null,null,null,null,null,null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }
      
// fn to create new colname items if not in preview mode
        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.FillCellsFunction(scope.function.value, scope.function.valueX, scope.function.valueY, scope.function.b_row, scope.function.b_col, scope.function.e_row, scope.function.e_col, scope.function.docstring);
        };
        
        
      }
    };
  });
  
