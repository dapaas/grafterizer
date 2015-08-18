'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:utilityFunction
 * @description
 * # utilityFunction
 */
angular.module('grafterizerApp')
  .directive('utilityFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/utilityFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.ufunction) {
          scope.ufunction = new transformationDataModel.UtilityFunction(null, null);
          scope.ufunction.docstring = null;
        }
        
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
          var   func = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(scope.ufunction.functionName);
          return new transformationDataModel.UtilityFunction(
            func,
            scope.ufunction.docstring);
        };
      }
    };
  });
