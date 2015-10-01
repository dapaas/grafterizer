'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:clojurePipeline
 * @description
 * # clojurePipeline
 */
angular.module('grafterizerApp')
  .directive('clojurePipeline', function($compile, generateClojure, $rootScope) {
  return {
    template: '<div class="warningMsg" ng-show="isOverrided"><i class="fa fa-exclamation-triangle"></i> ' +
    'Clojure editing is an experimental feature. ' +
    'Any modifications are <b>only shown in the "Previewed data"</b> view and will not be reflected on the specified pipeline.</div>' +
    '<div></div>',
    restrict: 'E',
    scope: {
      transformation: '='
    },
    link: function postLink(scope, element, attrs) {
      var currentClojure = '';
      var codeMirror = null;

      var throttledPreviewRequest = _.debounce(function() {
        scope.$parent.$parent.$broadcast('preview-request');
      }, 1000, {leading: false});

      var changeEventListener = function() {

        var value = codeMirror.getValue();

        if (value && currentClojure !== value) {
          // manual override (experimental)
          scope.isOverrided = true;
          $rootScope.previewedClojure = value;
          currentClojure = value;
          throttledPreviewRequest();
        } 
      };

      var editorArea = angular.element(element.children()[1]);

      $rootScope.$watch('readonlymode', function() {
        codeMirror = new window.CodeMirror(function(dom) {
          editorArea.empty();
          editorArea.append(dom);
        }, {
          lineWrapping: true,
          mode: 'clojure',
          dragDrop: false,
          readOnly: $rootScope.readonlymode,
          value: currentClojure
        });

        codeMirror.on('changes', changeEventListener);
      });

      scope.$watch('transformation', function() {
        if (!scope.transformation) {
          return;
        }


        if($rootScope.currentlyPreviewedFunction){
          var partialTransformation = $rootScope.transformation.getPartialTransformation($rootScope.currentlyPreviewedFunction);
          $rootScope.previewedClojure = generateClojure.fromTransformation(partialTransformation);
        } else {
          var tmpClojure = generateClojure.fromTransformation(scope.transformation);
          currentClojure = tmpClojure;
          $rootScope.previewedClojure = currentClojure;
        }

        if (codeMirror) {
          codeMirror.setValue(currentClojure);
        }

      }, true);
    }
  };
});
