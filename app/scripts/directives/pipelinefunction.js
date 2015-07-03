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
      template: '<div flex layout="row" layout-align="center"><md-button class="pipeline-button md-raised" ng-click="editFunction()">{{function.displayName}}</md-button></div>',
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
            controller: 'PipelinefunctiondialogCtrl',
            templateUrl: 'views/editPipelineFunctionDialog.html',
            scope: newScope
          }).then(
          function(pipeFunct) {
            angular.copy(pipeFunct, scope.function);
          },

          function() {
            angular.copy(scope.originalFunction, scope.function);
          });
        };

        //element.text('this is the pipelineFunction directive');
      }
    };
  });
