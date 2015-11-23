'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addRowFunction
 * @description
 * # addRowFunction
 */
angular.module('grafterizerApp')
  .directive('addRowFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/addRowFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs, $rootScope) {
        if (!scope.function) {
          var values = [];
          if (typeof scope.$parent.$root.colnames !== 'undefined') { //if in preview mode -- add as many fields for columns as needed 
          var temp = scope.$parent.$root.colnames();
            for (var i=0;i<temp.length;++i)
                values.push(null);
          }
          else values.push(null);
          scope.function = new transformationDataModel.AddRowFunction(0,values);
          scope.function.docstring = null;
        }
        
        // TODO fix this when Javascript adds better support for OOP: this is a "hack" to ensure that the object received is of the proper type; Needs to be done due to the way Javascript objects/classes work
        if (!(scope.function instanceof transformationDataModel.AddRowFunction)) {
          var newFunction = new transformationDataModel.AddRowFunction(0,[null]);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.AddRowFunction(scope.function.position, scope.function.values, scope.function.docstring);
        };

        scope.addField = function() {
          scope.function.values.push("");
        };

        scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined')? [] : scope.$parent.$root.colnames();

        scope.removeField = function(index) {
          scope.function.values.splice(index,1);
        };
      }
    };
  });
  
