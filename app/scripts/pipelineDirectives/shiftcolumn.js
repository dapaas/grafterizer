'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:shiftColumnFunction
 * @description
 * # shiftColumnFunction
 */
angular.module('grafterizerApp')
  .directive('shiftColumnFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/shiftColumnFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.ShiftColumnFunction(null,0,'eods',null);
          scope.function.docstring = null;
        }
        
        // TODO fix this when Javascript adds better support for OOP: this is a "hack" to ensure that the object received is of the proper type; Needs to be done due to the way Javascript objects/classes work
        if (!(scope.function instanceof transformationDataModel.ShiftColumnFunction)) {
          var newFunction = new transformationDataModel.ShiftColumnFunction(null,0,'eods',null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }

var colCtr = 0;
scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.ShiftColumnFunction(scope.function.colFrom, scope.function.indexTo, scope.function.shiftcolmode, scope.function.docstring);
        };


      }
    };
  });
  
