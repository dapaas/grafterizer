'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:mapc
 * @description
 * # mapc
 */
angular.module('grafterizerApp')
  .directive('mapcFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/mapcFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.mfunction) {
          var keyfuncpair = new transformationDataModel.KeyFunctionPair(
            'colName', scope.$parent.transformation.customFunctionDeclarations[0]);

          scope.mfunction = new transformationDataModel.MapcFunction([keyfuncpair], null);
          scope.mfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MapcFunction(scope.mfunction.keyFunctionPairs, scope.mfunction.docstring);
        };

        scope.addKeyFunctionPair = function() {
          var newKeyFunctionPair = new transformationDataModel.KeyFunctionPair(
            '', /* scope.$parent.transformation.customFunctionDeclarations[0].name*/ 'string-literal');
          this.mfunction.keyFunctionPairs.push(newKeyFunctionPair);
        };

        scope.removeKeyFunctionPair = function(kfPair) {
          scope.mfunction.removeKeyFunctionPair(kfPair);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  