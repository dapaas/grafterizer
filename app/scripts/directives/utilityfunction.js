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
      templateUrl: 'views/utilityFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
      //    var derfunc = scope.$parent.transformation.customFunctionDeclarations[0];  
          scope.function = new transformationDataModel.UtilityFunction(null,null);
          scope.function.docstring = null;
        }
        
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
            var   func = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(scope.function.functionName);
          return new transformationDataModel.UtilityFunction(
            func, 
            scope.function.docstring);
        };
      }
    };
  });
