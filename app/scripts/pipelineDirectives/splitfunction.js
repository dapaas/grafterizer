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
      templateUrl: 'views/pipelineFunctions/splitFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.sfunction) {

          scope.sfunction = new transformationDataModel.SplitFunction('', '', '', null);
          scope.sfunction.newColName = null;
          scope.sfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.SplitFunction(
            scope.sfunction.colName, scope.sfunction.newColName, scope.sfunction.separator, scope.sfunction.docstring
          );
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
