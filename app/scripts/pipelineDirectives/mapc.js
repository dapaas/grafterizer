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
            '', scope.$parent.transformation.customFunctionDeclarations[0]);

          scope.function = new transformationDataModel.MapcFunction([keyfuncpair], null);
          scope.function.docstring = null;
        }
        
        // TODO fix this when Javascript adds better support for OOP: this is a "hack" to ensure that the object received is of the proper type; Needs to be done due to the way Javascript objects/classes work
        if (!(scope.function instanceof transformationDataModel.MapcFunction)) {
          var newFunction = new transformationDataModel.MapcFunction([], '');
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.MapcFunction(scope.function.keyFunctionPairs, scope.function.docstring);
        };

        scope.addKeyFunctionPair = function() {
          var newKeyFunctionPair = new transformationDataModel.KeyFunctionPair(
            '', /* scope.$parent.transformation.customFunctionDeclarations[0].name*/ 'string-literal');
          this.function.keyFunctionPairs.push(newKeyFunctionPair);
        };

        scope.removeKeyFunctionPair = function(kfPair) {
          scope.function.removeKeyFunctionPair(kfPair);
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  