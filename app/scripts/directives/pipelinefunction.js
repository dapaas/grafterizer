'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:pipelineFunction
 * @description
 * # pipelineFunction
 */
angular.module('grafterizerApp')
  .directive('pipelineFunction', function($mdDialog) {
    return {
      templateUrl: 'views/pipelinefunction.html',
      restrict: 'E',
      scope: {
        function: '=',
        transformation: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.editFunction = function() {
          scope.originalFunction = {};
          scope.selectedFunctionName = scope.function.name;
          angular.copy(scope.function, scope.originalFunction);
          var newScope = scope.$new(false, scope);
          newScope.transformation = scope.transformation;
          $mdDialog.show({
            templateUrl: 'views/editPipelineFunctionDialog.html',
            scope: newScope,
            clickOutsideToClose: true
          }).then(
          function(pipeFunct) {
            angular.copy(pipeFunct, scope.function);
          },

          function() {
            angular.copy(scope.originalFunction, scope.function);
          });
        };
      
        scope.showChar = 50;
      }
    };
  });
