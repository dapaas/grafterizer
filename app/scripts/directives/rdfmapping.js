'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:rdfMapping
 * @description
 * # rdfMapping
 */
angular.module('grafterizerApp')
    .directive('rdfMapping', function ($mdDialog, transformationDataModel) {
    return {
        templateUrl: 'views/rdfmapping.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            // create and delete new graphs  
            scope.clickAddAfter = function (graph) {
                if(graph){
                } else {
                    var newGraph = new transformationDataModel.Graph("http://www.example.no/#/", []);
                    scope.$parent.transformation.addGraphAfter(null, newGraph);
                }
            };

        }
    };
});
