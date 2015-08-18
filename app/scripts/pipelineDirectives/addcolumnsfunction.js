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
        if (!scope.afunction) {
          var newCol = new transformationDataModel.NewColumnSpec('colName', '', null, null);
          scope.afunction = new transformationDataModel.AddColumnsFunction([newCol], null);
          scope.afunction.docstring = '';
        }

        scope.newColumnValues = ['Dataset filename', 'Current date', 'Row number', 'custom expression'];
        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.AddColumnsFunction(
            scope.afunction.columnsArray, scope.afunction.docstring);
        };

        scope.addColumn = function() {
          var newCol = new transformationDataModel.NewColumnSpec('colName', '', null, null);
          scope.afunction.columnsArray.push(newCol);
        };

        scope.removeColumn = function(index) {
          scope.afunction.columnsArray.splice(index, 1);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  