'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:customCode
 * @description
 * # customCode
 */
angular.module('grafterizerApp')
    .directive('customCode', function (transformationDataModel) {
    return {
        templateUrl: 'views/customCode.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            scope.codemirrorOpts = {
                lineWrapping : true, 
                lineNumbers: true,
                mode: 'clojure'
            };
            scope.$parent.generateCurrFunction = function(){
                return new transformationDataModel.CustomCode(scope.function.displayName, scope.function.clojureCode);
            };
        }
    };
});
