'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addColumnFunction
 * @description
 * # addColumnFunction
 */
angular.module('grafterizerApp')
  .directive('addColumnFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/addColumnFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.MakeDatasetFunction("","","");
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.AddColumnFunction(
            scope.function.newColName,scope.function.colValue, scope.function.colExpr);
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
