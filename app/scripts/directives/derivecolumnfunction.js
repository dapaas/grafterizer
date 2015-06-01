'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:deriveColumnFunction
 * @description
 * # deriveColumnFunction
 */
angular.module('grafterizerApp')
    .directive('deriveColumnFunction', function (transformationDataModel) {
    return {
        templateUrl: 'views/deriveColumnFunction.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            scope.$parent.generateCurrFunction = function(){
                return new transformationDataModel.DeriveColumnFunction("todo", "todo", "todo")
            };
        }
    };
});
