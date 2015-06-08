'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:dropRowsFunction
 * @description
 * # dropRowsFunction
 */
angular.module('grafterizerApp')
  .directive('dropRowsFunction', function (transformationDataModel) {
    return {
      templateUrl: 'views/dropRowsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          if (!scope.function) {
              scope.function = {
                numberOfRows: 1
              };
          }
        scope.$parent.generateCurrFunction = function(){
            return new transformationDataModel.DropRowsFunction(parseInt(scope.function.numberOfRows));
        };
      }
    };
  });
