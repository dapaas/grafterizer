'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:shiftRowFunction
 * @description
 * # shiftRowFunction
 */
angular.module('grafterizerApp')
  .directive('shiftRowFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/shiftRowFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.ShiftRowFunction(0, 0, 'eods', null);
          scope.function.docstring = null;
        }
        
        // TODO fix this when Javascript adds better support for OOP: this is a "hack" to ensure that the object received is of the proper type; Needs to be done due to the way Javascript objects/classes work
        if (!(scope.function instanceof transformationDataModel.ShiftRowFunction)) {
          var newFunction = new transformationDataModel.ShiftRowFunction(0, null, 'eods', null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.ShiftRowFunction(scope.function.indexFrom, scope.function.indexTo, scope.function.shiftrowmode, scope.function.docstring);
        };

      }
    };
  });
  
