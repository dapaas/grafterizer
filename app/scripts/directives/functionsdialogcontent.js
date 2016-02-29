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
          {
            displayName: 'Reshape Dataset',
            name: 'melt',
            selected: false,
            type: 'none'
          },
          {
            displayName: 'Sort Dataset',
            name: 'sort-dataset',
            selected: false,
            type: 'none'
          },
          {
            displayName: 'Remove Duplicates',
            name: 'remove-duplicates',
            selected: false,
            type: 'none'
          },
          {
            displayName: 'Group and Aggregate',
            name: 'group-rows',
            selected: false,
            type: 'none'
          },
          {
            displayName: 'Fill Cells',
            name: 'fill-cells',
            selected: false,
            type: 'none'
          },
          {
            displayName: 'Add Columns',
            name: 'add-columns',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Take/Drop Columns',
            name: 'columns',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Derive Column',
            name: 'derive-column',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Merge Columns',
            name: 'merge-columns',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Map Columns',
            name: 'mapc',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Rename Columns',
            name: 'rename-columns',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Shift Column',
            name: 'shift-column',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Split Column',
            name: 'split',
            selected: false,
            type: 'column'
          },
          {
            displayName: 'Add Row',
            name: 'add-row',
            selected: false,
            type: 'rows'
          },
          {
            displayName: 'Shift Row',
            name: 'shift-row',
            selected: false,
            type: 'rows'
          },
          {
            displayName: 'Take/Drop Rows',
            name: 'drop-rows',
            selected: false,
            type: 'rows'
          },
          {
            displayName: 'Filter Rows',
            name: 'grep',
            selected: false,
            type: 'rows'
          }
        ];

        scope.showcolumn = false;
        scope.showColumn = function() {
          scope.showcolumn = !scope.showcolumn;
        };

        scope.showrows = false;
        scope.showRows = function() {
          scope.showrows = !scope.showrows;
        };

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
