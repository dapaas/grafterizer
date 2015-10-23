'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:pipelineFunction
 * @description
 * # pipelineFunction
 */
angular.module('grafterizerApp')
  .directive('pipelineFunction', function($mdDialog, generateClojure, PipeService, $rootScope, $state) {
  return {
    templateUrl: 'views/pipelinefunction.html',
    restrict: 'E',
    scope: {
      function: '=',
      transformation: '='
    },
    link: function postLink(scope, element, attrs) {
  
      scope.clickEditFunction = function() {
        var funct = scope.function;
        scope.originalFunction = {};
        scope.functionCurrentState = {};
        scope.selectedFunctionName = funct.name;
        angular.copy(funct, scope.originalFunction);
        angular.copy(funct, scope.functionCurrentState);
        var newScope = scope.$new(false, scope);
        newScope.transformation = scope.transformation;
        newScope.function = scope.functionCurrentState;
        // trigger a preview!
        $mdDialog.show({
          templateUrl: 'views/editPipelineFunctionDialog.html',
          scope: newScope
        }).then(
          function(pipeFunct) {
            angular.copy(pipeFunct, funct);
            if (!$rootScope.currentlyPreviewedFunction) {
              // initialise previewed funct if null
              $rootScope.currentlyPreviewedFunction = {};
            }
            $rootScope.currentlyPreviewedFunction.isPreviewed = false;
            if ($state.is('transformations.transformation.preview')) {
              $rootScope.currentlyPreviewedFunction = funct;
              funct.isPreviewed = true;
              var partialTransformation = scope.transformation.getPartialTransformation(funct);
              $rootScope.previewedClojure = generateClojure.fromTransformation(partialTransformation);
            }
          },

          function() {
            angular.copy(scope.originalFunction, funct);
          });
      };
      scope.showChar = 50;
    }
  };
});
