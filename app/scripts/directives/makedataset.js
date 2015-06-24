'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:makeDataset
 * @description
 * # makeDataset
 */
angular.module('grafterizerApp')
    .directive('makeDataset', function (transformationDataModel) {
    return {
        templateUrl: 'views/makedatasetfunction.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            if (!scope.function) {
                scope.function = new transformationDataModel.MakeDatasetFunction([]);
            }
            scope.$parent.generateCurrFunction = function(){
                console.log("HERE WE ARE");
                return new transformationDataModel.MakeDatasetFunction(scope.function.columnsArray);
            };  
        }
    };
});
