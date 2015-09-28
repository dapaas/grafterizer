'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:pipeline
 * @description
 * # pipeline
 */
angular.module('grafterizerApp')
  .directive('pipeline', function(
             transformationDataModel, $mdDialog, $rootScope, generateClojure) {
  return {
    templateUrl: 'views/pipeline.html',
    restrict: 'E',
    scope: {
      pipeline: '=',
      transformation: '='
    },
    link: function postLink(scope, element, attrs) {
      // if (!scope.pipeline) {
      //scope.pipeline = new transformationDataModel.Pipeline([]);
      // }

      scope.dragControlListeners = {
        accept: function() {
          return true;
        },

        itemMoved: function(event) {},

        orderChanged: function(event) {}
      };
      scope.clickAddAfter = function(funct) {
        var newScope = scope.$new(false, scope);
        newScope.transformation = scope.transformation;
        $mdDialog.show({
          templateUrl: 'views/pipelineFunctionDialog.html',
          scope: newScope
        }).then(function(pipeFunct) {
          if (pipeFunct) {
            scope.pipeline.addAfter(funct, pipeFunct);
            if(!$rootScope.currentlyPreviewedFunction){
              // initialise previewed funct if null
              $rootScope.currentlyPreviewedFunction = {};
            }
            $rootScope.currentlyPreviewedFunction.isPreviewed = false;
            $rootScope.currentlyPreviewedFunction = pipeFunct;
            pipeFunct.isPreviewed = true;
            $rootScope.previewedClojure = scope.transformation.getPartialTransformation(pipeFunct);
          }
        });
      };
      scope.clickRemove = function(funct) {
        $mdDialog.show(
          $mdDialog.confirm()
          .title('Are you sure you want to remove this element?')
          .content('Please confirm that you want to remove the element.')
          .ariaLabel('Please confirm that you want to remove the element.')
          .ok('Yes')
          .cancel('Cancel'))
          .then(function() {
          if(funct.isPreviewed){
            $rootScope.currentlyPreviewedFunction = {};
            $rootScope.previewedClojure = generateClojure.fromTransformation(scope.transformation);
          }
          $rootScope.previewedClojure = scope.transformation.getPartialTransformation(funct);
          scope.pipeline.remove(funct);
        });
      };
      scope.clickEditFunction = function(funct) {
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
            if(!$rootScope.currentlyPreviewedFunction){
              // initialise previewed funct if null
              $rootScope.currentlyPreviewedFunction = {};
            }
            $rootScope.currentlyPreviewedFunction.isPreviewed = false;
            $rootScope.currentlyPreviewedFunction = funct;
            funct.isPreviewed = true;
            var partialTransformation = scope.transformation.getPartialTransformation(funct);
            $rootScope.previewedClojure = generateClojure.fromTransformation(partialTransformation);
          },

          function() {
            angular.copy(scope.originalFunction, funct);
          });
      };
    }

  };
});
