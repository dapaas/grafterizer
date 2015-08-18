'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:deriveColumnFunction
 * @description
 * # deriveColumnFunction
 */
angular.module('grafterizerApp')
  .directive('deriveColumnFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/deriveColumnFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.dfunction) {
          scope.dfunction = new transformationDataModel.DeriveColumnFunction(
            '', [], [null], [null], null);
          scope.dfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
          var functArray = [];
          var newderfunc;
          for (var i = 0; i < scope.dfunction.functionsToDeriveWith.length; ++i) {
            newderfunc = scope.dfunction.functionsToDeriveWith[i];

            if (!(newderfunc instanceof transformationDataModel.CustomFunctionDeclaration || newderfunc instanceof transformationDataModel
              .Prefixer))
              functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newderfunc.toString()));
            else functArray.push(newderfunc);
          }

          return new transformationDataModel.DeriveColumnFunction(
            scope.dfunction.newColName,
            scope.dfunction.colsToDeriveFrom,
            functArray,
            scope.dfunction.paramsToFunctions,
            scope.dfunction.docstring);
        };

        scope.addDeriveFunction = function() {
          var derfunc = scope.$parent.transformation.customFunctionDeclarations[0];
          this.dfunction.functionsToDeriveWith.push(derfunc);
          this.dfunction.paramsToFunctions.push(null);
        };
        
        scope.removeDeriveFunction = function(index) {
          scope.dfunction.functionsToDeriveWith.splice(index, 1);
          scope.dfunction.paramsToFunctions.splice(index, 1);
        };
        
        scope.addParamToFunction = function(index) {
          scope.dfunction.paramsToFunctions[index] = ' ';
        };
        
        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
  