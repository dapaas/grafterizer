'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:meltFunction
 * @description
 * # meltFunction
 */
angular.module('grafterizerApp')
  .directive('meltFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/meltFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.mfunction) {
          scope.mfunction = new transformationDataModel.MeltFunction(
            [], null);
          scope.mfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MeltFunction(scope.mfunction.columnsArray, scope.mfunction.docstring);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
