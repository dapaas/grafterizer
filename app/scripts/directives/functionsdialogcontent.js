'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:functionsDialog
 * @description
 * # functionsDialog
 */
angular.module('grafterizerApp')
  .directive('functionsDialogContent', function($mdDialog) {
    return {
      templateUrl: 'views/functionDialogContentnew.html',
      restrict: 'E',
      scope: {
        function: '=',
        selectedFunctionName: '=',
        transformation: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.generateCurrFunction = function() {
          console.error('generic generateCurrFunction');
        };

        scope.availableFunctions = [
        {name: "columns", selected: false},    
        {name: "derive-column", selected: false},
       /* {name: "drop-rows", selected: false},    
        {name: "make-dataset", selected: false},    
        {name: "mapc", selected: false},    
        {name: "take-column", selected: false},    
        {name: "custom-code", selected: false}    */
        ];

        scope.changeSelected = function(f) {
            console.log(f);
        var i;
        for (i=0;i<scope.availableFunctions.length; ++i) {
            if (scope.availableFunctions[i].name === f) {scope.availableFunctions[i].selected=true;
            
            }
            else {scope.availableFunctions[i].selected=false;}
            console.log(scope.availableFunctions[i].selected);
        }
        }
        scope.add = function() {
          $mdDialog.hide(scope.generateCurrFunction());
        };
        scope.closeDialog = function() {
          $mdDialog.cancel();
        };
      }
    };
  });
