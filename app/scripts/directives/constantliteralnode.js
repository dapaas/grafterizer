'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:constantLiteralNode
 * @description
 * # constantLiteralNode
 */
angular.module('grafterizerApp')
  .directive('constantLiteralNode', function(
             $mdDialog,
              transformationDataModel,
              RecursionHelper) {
  return {
    templateUrl: 'views/constantliteralnode.html',
    restrict: 'E',
    scope: {
      node: '=',
      parent: '='
    },
    compile: function(element) {
      return RecursionHelper.compile(element, function(scope, iElement,
                                                        iAttrs, controller, transcludeFn) {

        scope.editNode = function() {
          scope.originalNode = {};
          scope.nodeCurrentState = {};
          angular.copy(scope.node, scope.originalNode);
          angular.copy(scope.node, scope.nodeCurrentState);
          var newScope = scope.$new(false, scope);
          newScope.nodeCurrentState = scope.nodeCurrentState;
          newScope.parentNode = scope.parent;
          newScope.isCreate = false;
          $mdDialog.show({
            templateUrl: 'views/mappingnodedefinitiondialog.html',
            controller: 'MappingnodedefinitiondialogCtrl',
            scope: newScope
          }).then(
            function(graphNode) {
              scope.parent.replaceChild(scope.node, graphNode);
            },
            function() {
              newScope.$destroy();
            });
        };

      });
    }
  };
});
