'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:clojurePipeline
 * @description
 * # clojurePipeline
 */
angular.module('grafterizerApp')
  .directive('clojurePipeline', function (generateClojure) {
    return {
      template: '<div ui-codemirror="editorOptions" ng-model="clojure"></div>',
      restrict: 'E',
      scope: {
        transformation: '=',
      },
      link: {
      	pre: function(scope) {
		    scope.editorOptions = {
		        lineWrapping : true, 
		        lineNumbers: true,
		        mode: 'clojure',
		        readOnly: true
		    };
      	},
      	post: function(scope, element, attrs) {
      		scope.$watch('transformation', function(){
      			if (!scope.transformation) return;
      			console.log(scope.transformation)
      			scope.clojure = generateClojure.fromTransformation(scope.transformation);
      		}, true);
      	}
      }
    };
  });
