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
     // require:"previewTable",
      templateUrl: 'views/pipelineFunctions/deriveColumnFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
            console.log(scope.$parent.transformation.customFunctionDeclarations);

          scope.function = new transformationDataModel.DeriveColumnFunction(
            '', [], [null], [null], null);
          scope.function.docstring = null;
        }

        scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined') ? [] : scope.$parent.$root.colnames();
        var colCtr = 0;
        scope.addColumn = function(query) {
          return {
              id: colCtr++,
              value: query
          };
        };
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
          var functArray = [];
          var newderfunc;
          for (var i = 0; i < scope.function.functionsToDeriveWith.length; ++i) {
            newderfunc = scope.function.functionsToDeriveWith[i];

            if (!(newderfunc instanceof transformationDataModel.CustomFunctionDeclaration || newderfunc instanceof transformationDataModel
              .Prefixer))
              functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newderfunc.toString()));
            else functArray.push(newderfunc);
          }

          return new transformationDataModel.DeriveColumnFunction(
            scope.function.newColName,
            scope.function.colsToDeriveFrom,
            functArray,
            scope.function.paramsToFunctions,
            scope.function.docstring);
        };

        scope.addDeriveFunction = function() {
          var derfunc = scope.$parent.transformation.customFunctionDeclarations[0];
          this.function.functionsToDeriveWith.push(derfunc);
          this.function.paramsToFunctions.push(null);
        };
        
        scope.removeDeriveFunction = function(index) {
          scope.function.functionsToDeriveWith.splice(index, 1);
          scope.function.paramsToFunctions.splice(index, 1);
        };
        
        scope.addParamToFunction = function(index) {
          scope.function.paramsToFunctions[index] = ' ';
        };

      }
    };
  });
  
