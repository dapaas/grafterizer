'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:pipelineFunction
 * @description
 * # pipelineFunction
 */
angular.module('grafterizerApp')
  .directive('pipelineFunction', function($mdDialog, generateClojure, PipeService, $rootScope) {
  return {
    templateUrl: 'views/pipelinefunction.html',
    restrict: 'E',
    scope: {
      function: '=',
      transformation: '='
    },
    link: function postLink(scope, element, attrs) {
      scope.previewUntilStep = function () {
        
        if(!$rootScope.currentlyPreviewedFunction){
          // initialise previewed funct
          $rootScope.currentlyPreviewedFunction = {};
        }
        if(!scope.function.isPreviewed) {
          // toggle the currently previewed function
          $rootScope.currentlyPreviewedFunction.isPreviewed = false;
          $rootScope.currentlyPreviewedFunction = scope.function;
          scope.function.isPreviewed = true;
          var partialTransformation = scope.transformation.getPartialTransformation(scope.function);
          
          // TODO maybe it is better not to use a "global" variable
          $rootScope.previewedClojure = generateClojure.fromTransformation(partialTransformation);
        }
      };
      scope.closePreviewOfFunction = function () {
        
        $rootScope.currentlyPreviewedFunction.isPreviewed = false;
        $rootScope.currentlyPreviewedFunction = {};

        // TODO maybe it is better not to use a "global" variable
        $rootScope.previewedClojure = generateClojure.fromTransformation(scope.transformation);
      };

      scope.showChar = 50;
    }
  };
});
