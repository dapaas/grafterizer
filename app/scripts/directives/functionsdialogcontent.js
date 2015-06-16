'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:functionsDialog
 * @description
 * # functionsDialog
 */
angular.module('grafterizerApp')
    .directive('functionsDialogContent', function ($mdDialog) {
    return {
        templateUrl: 'views/functionDialogContent.html',
        restrict: 'E',
        scope: {
            function: '=',
            selectedFunctionName: '=',
            transformation: '='
        },
        link: function postLink(scope, element, attrs) {
            scope.generateCurrFunction = function(){
                console.error("generic generateCurrFunction");
            };
            scope.add = function(){
                $mdDialog.hide(scope.generateCurrFunction());
            };
            scope.closeDialog = function () {
                $mdDialog.cancel();
            };
        }
    };
});
