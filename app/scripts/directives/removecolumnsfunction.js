'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:removeColumnsFunction
 * @description
 * # removeColumnsFunction
 */
angular.module('grafterizerApp')
  .directive('removeColumnsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/removecolumnsfunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.RemoveColumnsFunction(
            [], null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.RemoveColumnsFunction(scope.function.columnsArray,
                  scope.function.docstring);
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
