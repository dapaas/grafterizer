'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:splitFunction
 * @description
 * # splitgFunction
 */
angular.module('grafterizerApp')
  .directive('splitFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/splitFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {

          scope.function = new transformationDataModel.SplitFunction("","","",null);
          scope.function.newColName = null;
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.SplitFunction(
            scope.function.colName, scope.function.newColName, scope.function.separator, scope.function.docstring);
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
