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
        var deriveFunct = new transformationDataModel.FunctionWithArgs(null,[]);
          scope.function = new transformationDataModel.DeriveColumnFunction(
            '', [], [deriveFunct],  null);
          scope.function.docstring = null;
        }
       /* else
        {
            for (var i=0; i< scope.function.functionsToDeriveWith.length; ++i) {
                var currFunc = scope.function.functionsToDeriveWith[i].funct;
                if (!currFunc.hasOwnProperty('name')) scope.function.FunctionsToDeriveWith[i].funct = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(currFunc);
            
            }}
       */ if (!(scope.function instanceof transformationDataModel.DeriveColumnFunction)) {
          var newFunction = new transformationDataModel.DeriveColumnFunction('',[], [null], null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }
  scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined') ? [] : scope.$parent.$root.colnames();
var colCtr = 0;

scope.getCustomFunctionsAndPrefixers = function() {

var customFunctionsAndPrefixers = [];
for (var i = 0; i < scope.$parent.transformation.customFunctionDeclarations.length; ++i) {
    customFunctionsAndPrefixers.push({
        name: scope.$parent.transformation.customFunctionDeclarations[i].name,
        clojureCode: scope.$parent.transformation.customFunctionDeclarations[i].clojureCode,
        group: scope.$parent.transformation.customFunctionDeclarations[i].group,
        id: i}
        );
}
for (var i = 0; i < scope.$parent.transformation.prefixers.length; ++i) {
    customFunctionsAndPrefixers.push({
        name: scope.$parent.transformation.prefixers[i].name,
        group: 'PREFIXERS',
        id: customFunctionsAndPrefixers.length}
        );
}
return customFunctionsAndPrefixers;
}

scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
         /* var functArray = [];
          var newderfunc;
          for (var i = 0; i < scope.function.functionsToDeriveWith.length; ++i) {
            newderfunc = scope.function.functionsToDeriveWith[i].funct;

            if (!(newderfunc instanceof transformationDataModel.CustomFunctionDeclaration || newderfunc instanceof transformationDataModel
              .Prefixer))
              functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newderfunc.toString()));
            else functArray.push(newderfunc);
          }
*/
          return new transformationDataModel.DeriveColumnFunction(
            scope.function.newColName,
            scope.function.colsToDeriveFrom,
            scope.function.functionsToDeriveWith,
            scope.function.docstring);
        };

        scope.reduceFunctionParams = function(params) {
            for (var i=1; i<scope.function.colsToDeriveFrom.length; ++i)
                params.splice(0,1);
            return params;
        }
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
  
