'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:clojurePipeline
 * @description
 * # clojurePipeline
 */
angular.module('grafterizerApp')
  .directive('clojurePipeline', function(generateClojure, $rootScope) {
  return {
    template: '<div ui-codemirror="editorOptions" ng-model="clojure"></div>',
    restrict: 'E',
    scope: {
      transformation: '='
    },
    link: {
      pre: function(scope) {
        scope.editorOptions = {
          lineWrapping: true,
          mode: 'clojure'

          // lineNumbers: true,
          // readOnly: true
        };
      },

      post: function(scope, element, attrs) {
        var generatedClojure = null, partialTransformation = {};

        $rootScope.$watch('transformation', function() {

          if (!scope.transformation) {
            
            return;
          }

          scope.clojure = generatedClojure = generateClojure.fromTransformation(
            scope.transformation);
          scope.isOverrided = false;
          if($rootScope.currentlyPreviewedFunction){
            if($rootScope.currentlyPreviewedFunction.isPreviewed){
              partialTransformation = scope.transformation.getPartialTransformation($rootScope.currentlyPreviewedFunction);
              $rootScope.previewedClojure = generateClojure.fromTransformation(partialTransformation);
            }
          }

        }, true);

        var warningMsg = '; WARNING: Clojure editing is an experimental feature\n' +
            '; The changes will be lost if you edit the transformation';

        var throttledPreviewRequest = _.throttle(function() {
          scope.$parent.$parent.$broadcast('preview-request');
        }, 1000);

        scope.$watch('clojure', function() {
          if (generatedClojure !== scope.clojure) {
            scope.isOverrided = true;
            if (scope.clojure.indexOf(warningMsg) === -1) {
              scope.clojure = warningMsg + '\n\n' + scope.clojure;
            }

            generateClojure.overrideClojure(scope.clojure,
                                            generatedClojure);
            throttledPreviewRequest();
          }
        });

        // TODO workaround random bug
        scope.$watch('$parent.selectedTabIndex', function() {
          if (scope.$parent.selectedTabIndex) {
            window.setTimeout(function() {
              try {
                element.children().children()[0].CodeMirror.refresh();
              } catch (e) {
                console.error(e);
              }
            }, 1);
          }
        });

        window.setTimeout(function() {
          try {
            element.children().children()[0].CodeMirror.refresh();
          } catch (e) {}
        }, 1);
      }
    }
  };
});
