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
            '', scope.$parent.transformation.findPrefixerOrCustomFunctionByName('string-literal'),[]);
          scope.function = new transformationDataModel.MapcFunction([keyfuncpair], null);
          scope.function.docstring = null;
        }
            else
            {
            for (var i=0; i< scope.function.keyFunctionPairs.length; ++i) {
                var currFunc = scope.function.keyFunctionPairs[i].func;
                if (!currFunc.hasOwnProperty('name')) scope.function.keyFunctionPairs[i].func = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(currFunc);
            
            }}
        // TODO fix this when Javascript adds better support for OOP: this is a "hack" to ensure that the object received is of the proper type; Needs to be done due to the way Javascript objects/classes work
        if (!(scope.function instanceof transformationDataModel.MapcFunction)) {
          var newFunction = new transformationDataModel.MapcFunction([], '');
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }

        scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined')? [] : scope.$parent.$root.colnames();
var colCtr = 0;
scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
        scope.$parent.generateCurrFunction = function() {
         /*   for (var i=0; i< scope.function.keyFunctionPairs.length; ++i) {
                var currFunc = scope.function.keyFunctionPairs[i].func;
                if (!currFunc.hasOwnProperty('name')) scope.function.keyFunctionPairs[i].func = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(currFunc);
            
            }
          */return new transformationDataModel.MapcFunction(scope.function.keyFunctionPairs, scope.function.docstring);
        };

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

        scope.addKeyFunctionPair = function() {
          //var newKeyFunctionPair = new transformationDataModel.KeyFunctionPair(
           // '', scope.$parent.transformation.findPrefixerOrCustomFunctionByName('string-literal'),[]);
            var newKeyFunctionPair = new transformationDataModel.KeyFunctionPair('',{name:'string-literal',
           group:'CONVERT_DATATYPE',
           id:0},[]);
            this.function.keyFunctionPairs.push(newKeyFunctionPair);
        };

        scope.removeKeyFunctionPair = function(kfPair) {
          scope.function.removeKeyFunctionPair(kfPair);
        };
      }
    };
  });
  
