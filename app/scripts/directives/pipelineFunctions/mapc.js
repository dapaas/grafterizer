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
        if (!scope.function) {
          var keyfuncpair = new transformationDataModel.KeyFunctionPair(
            'colName', scope.$parent.transformation.customFunctionDeclarations[0]);

          scope.function = new transformationDataModel.MapcFunction([keyfuncpair],null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MapcFunction(scope.function.keyFunctionPairs,scope.function.docstring);
        };

        scope.addKeyFunctionPair = function() {
          var newKeyFunctionPair = new transformationDataModel.KeyFunctionPair(
            '', scope.$parent.transformation.customFunctionDeclarations[0].name);
          this.function.keyFunctionPairs.push(newKeyFunctionPair);
        };

        scope.removeKeyFunctionPair = function(kfPair) {
          scope.function.removeKeyFunctionPair(kfPair);
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
