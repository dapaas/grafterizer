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
            selectedFunctionName: '='
        },
        link: function postLink(scope, element, attrs) {
            //        element.text('this is the functionsDialog directive');
            scope.generateCurrFunction = function(){
                console.error("todo");
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
