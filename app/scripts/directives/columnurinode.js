'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:columnURINode
 * @description
 * # columnURINode
 */
angular.module('grafterizerApp')
  .directive('columnUriNode', function(
             $mdDialog,
              transformationDataModel,
              RecursionHelper) {
  return {
    templateUrl: 'views/columnurinode.html',
    restrict: 'E',
    scope: {
      node: '=',
      parent: '='
    },
    compile: function(element) {
      // TODO may be different at the end but probably need to unify with the constant uri node directive
      return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
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

        scope.clickAddChildProperty = function() {
          scope.originalProperties = [];
          angular.copy(scope.node.subElements, scope.originalProperties);
          var newScope = scope.$new(false, scope);
          newScope.isCreateNew = true;

          $mdDialog.show({
            templateUrl: 'views/propertydialog.html',
            controller: 'PropertydialogCtrl',
            scope: newScope
          }).then(
            function(propertyNode) {
              if (propertyNode) {
                scope.node.addNodeAfter(null, propertyNode);
              }
            },

            function() {
              angular.copy(scope.originalProperties, scope.node.subElements);
            });
        };
      });
    }
  };
});
