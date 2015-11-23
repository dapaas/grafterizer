'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addColumnsFunction
 * @description
 * # addColumnsFunction
 */
angular.module('grafterizerApp')
  .directive('addColumnsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/addColumnsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          var newCol = new transformationDataModel.NewColumnSpec('colName', '', null, null);
          scope.function = new transformationDataModel.AddColumnsFunction([newCol], null);
          scope.function.docstring = '';
        }
        if (!(scope.function instanceof transformationDataModel.AddColumnsFunction)) {
          var newFunction = new transformationDataModel.AddColumnsFunction([],[null,null],null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }

        scope.newColumnValues = ['Dataset filename', 'Current date', 'Row number', 'custom expression'];
        scope.$parent.generateCurrFunction = function() {
            console.log(scope.function.columnsArray);
          return new transformationDataModel.AddColumnsFunction(
            scope.function.columnsArray, scope.function.docstring);
        };

        scope.addColumn = function() {
          var newCol = new transformationDataModel.NewColumnSpec('colName', '', null, null);
          scope.function.columnsArray.push(newCol);
        };

        scope.removeColumn = function(index) {
          scope.function.columnsArray.splice(index, 1);
        };
      }
    };
  });
  
