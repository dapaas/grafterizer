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
          scope.function = new transformationDataModel.DeriveColumnFunction(
            '', [], null);
        }

        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug

          return new transformationDataModel.DeriveColumnFunction(
            scope.function.newColName,
            scope.function.colsToDeriveFrom,
            scope.$parent.transformation.findPrefixerOrCustomFunctionByName(
              scope.function.functionToDeriveWith));
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
