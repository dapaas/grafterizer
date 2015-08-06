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
        transformation: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.generateCurrFunction = function() {
          console.error('generic generateCurrFunction');
        };
        
        scope.availableFunctions = [
            //---------------------------------
            {
                displayName: 'Make Dataset',
                name: 'make-dataset',
                selected: false,
                type: 'none'
            },
            
            {
                displayName: 'Custom function',
                name: 'utility',
                selected: false,
                type: 'none'
            },
            //---------------------------------
            {
                displayName: 'Columns',
                name: 'columns',
                selected: false,
                type: 'narrow'
            },
            {
                displayName: 'Rows',
                name: 'drop-rows',
                selected: false,
                type: 'narrow'
            },
            //--------------------------------
            
            {
                displayName: 'Add Columns',
                name: 'add-columns',
                selected: false,
                type: 'expand'
            },
            {
                displayName: 'Derive Column',
                name: 'derive-column',
                selected: false,
                type: 'expand'
            },
            {
                displayName: 'Split Column',
                name: 'split',
                selected: false,
                type: 'expand'
            },

            //--------------------------------
            
            {
                displayName: 'Map Columns',
                name: 'mapc',
                selected: false,
                type: 'modify'
            },
            {
                displayName: 'Rename Columns',
                name: 'rename-columns',
                selected: false,
                type: 'modify'
            },
            {
                displayName: 'Reshape Dataset',
                name: 'melt',
                selected: false,
                type: 'modify'
            },

                ];
            

        scope.shownarrow = false;
        scope.showNarrow = function() {
            scope.shownarrow = !scope.shownarrow;
        };
        scope.showexpand = false;
        scope.showExpand = function() {
            scope.showexpand = !scope.showexpand;
        };

        scope.showmodify = false;
        scope.showModify = function() {
            scope.showmodify = !scope.showmodify;
        };
        /*
        scope.narrowFunctions = [
                        
          {
            name: 'Columns',
            selected: false
          },
                    
          {
            name: 'drop-rows',
            selected: false
          },
        ];
        
        scope.expandFunctions = [
        
          {
            name: 'add-columns',
            selected: false
          },
        ];

        scope.modifyFunctions = [

          {
            name: 'apply-columns',
            selected: false
          },
          ]*/
       /* scope.availableFunctions = [
          {
            name: 'add-columns',
            displayName: 'Add columns',
            selected: false
          },
          {
            name: 'apply-columns',
            displayName: 'Apply columns',
            selected: false
          },
          {
            name: 'columns',
            displayName: 'Columns',
            selected: false
          },
          {
            name: 'derive-column',
            displayName: 'Derive column',
            selected: false
          },
          {
            name: 'drop-rows',
            displayName: 'Drop rows',
            selected: false
          },
          {
            name: 'grep',
            displayName: 'Filter dataset',
            selected: false
          },
          {
            name: 'make-dataset',
            displayName: 'Make dataset',
            selected: false
          },
          {
            name: 'mapc',
            displayName: 'Map columns',
            selected: false
          },
          {
            name: 'melt',
            displayName: 'Reshape dataset',
            selected: false
          },
          {
            name: 'remove-columns',
            displayName: 'Remove columns',
            selected: false
          },
          {
            name: 'rename-columns',
            displayName: 'Rename columns',
            selected: false
          },
          {
            name: 'split',
            displayName: 'Split column',
            selected: false
          },
          {
            name: 'take-rows',
            displayName: 'Take rows',
            selected: false
          },
          {
            name: 'utility',
            displayName: 'Utility function',
            selected: false
          },*/
      /*    {   //To define custom code --> create utility function with ds as parameter and use option above
            name: 'custom-code',
            displayName: 'Custom code',
            selected: false
          }*/
       // ];
        scope.selectedFunctionName = null;
        scope.changeSelected = function(f) {
          var i;
          for (i = 0; i < scope.availableFunctions.length; ++i) {
            if (scope.availableFunctions[i].name === f) {
              scope.availableFunctions[i].selected = true;

            } else {
              scope.availableFunctions[i].selected = false;
            }
          }

          scope.selectedFunctionName = f;
        };

        scope.add = function() {
          $mdDialog.hide(scope.generateCurrFunction());
        };

        scope.closeDialog = function() {
          $mdDialog.cancel();
        };

        if (scope.function) {
          scope.changeSelected(scope.function.name);
        }
      }
    };
  });
