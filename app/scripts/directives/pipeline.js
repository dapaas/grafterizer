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

      scope.clickAddAfter = function(funct) {
        var newScope = scope.$new(false, scope);
        newScope.transformation = scope.transformation;
        $mdDialog.show({
          templateUrl: 'views/pipelineFunctionDialog.html',
          scope: newScope,
          clickOutsideToClose: true
        }).then(function(pipeFunct) {
          if (pipeFunct) {
            scope.pipeline.addAfter(funct, pipeFunct);
            angular.forEach(scope.pipeline.functions, function(f) {
              f.fabIsOpen = false;
              f.leaveFabOpen = false;
            });
            pipeFunct.fabIsOpen = true;
            pipeFunct.leaveFabOpen = true;
            if (!$rootScope.previewmode) {
              return;
            }
            if (!$rootScope.currentlyPreviewedFunction) {
              // initialise previewed funct if null
              $rootScope.currentlyPreviewedFunction = {};
            }
            //$rootScope.currentlyPreviewedFunction.fabIsOpen = false;
            $rootScope.currentlyPreviewedFunction.isPreviewed = false;
            $rootScope.currentlyPreviewedFunction = pipeFunct;
            pipeFunct.isPreviewed = true;

            $rootScope.previewedClojure = generateClojure.fromTransformation(scope.transformation.getPartialTransformation(pipeFunct));
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
          if (funct.isPreviewed) {
            $rootScope.currentlyPreviewedFunction = {};
            $rootScope.previewedClojure = generateClojure.fromTransformation(scope.transformation);
          }
          $rootScope.previewedClojure = generateClojure.fromTransformation(scope.transformation.getPartialTransformation(funct));
          scope.pipeline.remove(funct);
        });
      };
      
      scope.previewUntilStep = function(funct) {
        
        angular.forEach(scope.pipeline.functions, function(f) {
          f.fabIsOpen = false;
          f.leaveFabOpen = false;
        });
        if (!$rootScope.currentlyPreviewedFunction) {
          // initialise previewed funct
          $rootScope.currentlyPreviewedFunction = {};
        }
        if (!funct.isPreviewed) {
          // toggle the currently previewed function
          $rootScope.currentlyPreviewedFunction.isPreviewed = false;
          $rootScope.currentlyPreviewedFunction = funct;
          funct.isPreviewed = true;
          var partialTransformation = scope.transformation.getPartialTransformation(funct);
          
          // TODO maybe it is better not to use a "global" variable
          $rootScope.previewedClojure = generateClojure.fromTransformation(partialTransformation);
        }
      };

      scope.closePreviewOfFunction = function() {
        
        angular.forEach(scope.pipeline.functions, function(f) {
          f.leaveFabOpen = false;
        });
        $rootScope.currentlyPreviewedFunction.isPreviewed = false;
        $rootScope.currentlyPreviewedFunction = {};

        // TODO maybe it is better not to use a "global" variable
        $rootScope.previewedClojure = generateClojure.fromTransformation(scope.transformation);
      };

      scope.previousFunct = null;

      scope.toggleFabStates = function(funct) {
        if (scope.previousFunct) {
          scope.previousFunct.fabIsOpen = false;
        }

        scope.previousFunct = funct;

        window.setTimeout(function() {
          scope.$evalAsync('previousFunct.fabIsOpen = true') ;
         }, 0);
      };
    }

  };
});
