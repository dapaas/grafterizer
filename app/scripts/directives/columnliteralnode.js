'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:columnLiteralNode
 * @description
 * # columnLiteralNode
 */
angular.module('grafterizerApp')
  .directive('columnLiteralNode', function(
             $mdDialog,
              transformationDataModel,
              RecursionHelper) {
  return {
    templateUrl: 'views/columnliteralnode.html',
    restrict: 'E',
    scope: {
      node: '=',
      parent: '='
    },
    compile: function(element) {
      // TODO may be different at the end but probably need to unify with the constant uri node directive and create a directive for edit/add/remove-s
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
            scope: newScope,
            clickOutsideToClose: true
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
