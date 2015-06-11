'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:recursionDirective
 * @description
 * # recursionDirective
 */
angular.module('grafterizerApp')
  .directive('recursionDirective', function (RecursionHelper) {
    return {
      template: '<div layout="row"><div flex="5">test</div><div style="padding-top:8px" flex> <recursion-directive number-left="numberLeft-1" ng-if="numberLeft>0"></recursion-directive></div>',
      restrict: 'E',
      scope: {
      	numberLeft: '='
      },
      compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
		      	scope.showNext = Math.random()<0.1;
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
        }
    };
  });
