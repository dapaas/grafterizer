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
      templateUrl: 'views/deriveColumnFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          var derfunc = scope.$parent.transformation.customFunctionDeclarations[0];  
          scope.function = new transformationDataModel.DeriveColumnFunction(
            '', [], [derfunc]);
        }

        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
          var functArray = [];
          for (var i=0;i<scope.function.functionsToDeriveWith.length;++i)
          {
              var newderfunc = scope.function.functionsToDeriveWith[i];
              functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newderfunc.toString()));
                      }
          return new transformationDataModel.DeriveColumnFunction(
            scope.function.newColName,
            scope.function.colsToDeriveFrom,
            functArray);
        };
        scope.addDeriveFunction = function() {
            var derfunc = scope.$parent.transformation.customFunctionDeclarations[0];
            this.function.functionsToDeriveWith.push(derfunc);
        };
        scope.removeDeriveFunction = function(index) {
            scope.function.functionsToDeriveWith.splice(index,1);
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
