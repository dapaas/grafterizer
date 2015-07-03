'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:previewRaw
 * @description
 * # previewRaw
 */
angular.module('grafterizerApp')
  .directive('previewRaw', function(PipeService) {
    return {
      template: '<div ui-codemirror="editorOptions" ng-model="data"></div>',
      restrict: 'E',
      scope: {
        data: '=ngModel'
      },
      link: {
        pre: function(scope) {
          scope.editorOptions = {
            lineWrapping: true,

            // lineNumbers: true,
            mode: 'clojure',
            readOnly: true
          };
        },

        post: function(scope, element, attrs) {
          // scope.$watch('distribution', function(){
          //     console.log(scope);
          //     if (scope.distribution) {
          //         PipeService.preview(scope.distribution).success(function(data) {
          //           scope.data = data.raw;
          //         });
          //     }
          // });
        }
      }
    };
  });
