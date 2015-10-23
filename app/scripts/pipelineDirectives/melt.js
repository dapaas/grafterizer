'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:meltFunction
 * @description
 * # meltFunction
 */
angular.module('grafterizerApp')
  .directive('meltFunction', function(transformationDataModel,$rootScope) {
    return {
      templateUrl: 'views/pipelineFunctions/meltFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.MeltFunction(
            [], null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MeltFunction(scope.function.columnsArray, scope.function.docstring);
        };
      }
    };
  });
