'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:previewTable
 * @description
 * # previewTable
 */
angular.module('grafterizerApp')
  .directive('previewTable', function () {
    return {
      template: '<div ui-grid="gridOptions" class="sin-grid md-whiteframe-z1" ui-grid-auto-resize></div>',
      restrict: 'E',
      scope: {
        data: '=ngModel'
      },
      link: function postLink(scope, element, attrs) {
        scope.gridOptions = {
            data: null,
            columnDefs: [],
            headerRowHeight: 82,
            rowHeight: 38,
            showHeader: !attrs.hasOwnProperty("hideHeaders")
        };

        scope.$watch('data', function(){
            var data = scope.data;
            if (!data) {
                scope.gridOptions.data = null;
                return;
            }

            var widths = {}, rawWidths = {};

            _.each(data[":column-names"], function(f) {
                // the header size is 3 times more important
                widths[f] = f.length*3;
            });

            var rows = data[":rows"];
            var largest = 0;
   
            { 
                var i, key, irow, w;
                var maxIter = Math.min(10, rows.length);
                for (i = 0; i < maxIter; ++i) {
                    for (key in rows[i]) {
                        irow = rows[i][key];
                            w = widths[key];

                        widths[key] += (""+irow).length;
                    }
                }

                var total = 0;
                for (key in widths) {
                    widths[key] /= (maxIter+3);
                    rawWidths[key] = widths[key];
                    total += widths[key];
                }

                for (key in widths) {
                    widths[key] = w = widths[key]/total;
                    if (w > largest) {
                        largest = w;
                    }
                }
            }

            scope.gridOptions.columnDefs = 
                _.map(data[":column-names"], function(f) {
                    return {
                        name: f,
                        width: widths[f]===largest ? '*' : Math.floor(widths[f]*100)+'%',
                        minWidth: Math.min(80+rawWidths[f]*8, 250)
                    };
                });

            scope.gridOptions.data = rows;
        });
      }
    };
  });
