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
      'Your modifications will be lost if you edit the transformation.</div>' +
      '<div></div>',
      restrict: 'E',
      scope: {
        transformation: '='
      },
      link: function postLink(scope, element, attrs) {
        var generatedClojure = '';
        var codeMirror = null;

        var throttledPreviewRequest = _.debounce(function() {
          scope.$parent.$parent.$broadcast('preview-request');
        }, 1000, {leading: false});

        scope.isOverrided = generateClojure.hasOveriddedClojure();

        var changeEventListener = function() {
          var value = codeMirror.getValue();
          if (value && generatedClojure !== value) {
            scope.isOverrided = true;

            generateClojure.overrideClojure(value, generatedClojure);
            throttledPreviewRequest();
          }
        };

        var editorArea = angular.element(element.children()[1]);

        $rootScope.$watch('readonlymode', function() {
          codeMirror = new window.CodeMirror(function(cm_el) {
            editorArea.empty();
            editorArea.append(cm_el);
          }, {
            lineWrapping: true,
            mode: 'clojure',
            dragDrop: false,
            readOnly: $rootScope.readonlymode,
            value: generatedClojure
          });

          codeMirror.on('changes', changeEventListener);
        });

        scope.$watch('transformation', function() {
          if (!scope.transformation) {
            return;
          }

          generatedClojure = generateClojure.fromTransformation(scope.transformation);
          scope.isOverrided = generateClojure.hasOveriddedClojure();

          if (codeMirror) {
            codeMirror.setValue(generatedClojure);
          }
        }, true);
      }
    };
  });
