'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:blankNode
 * @description
 * # blankNode
 */

angular.module('grafterizerApp')
  .directive('blankNode', function(
             $mdDialog,
              transformationDataModel,
              RecursionHelper) {
  return {
    templateUrl: 'views/blanknode.html',
    restrict: 'E',
    scope: {
      parent: '=',
      node:'='
    },
    compile: function(element) {
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

        scope.addSubProperty = function(property) {
          scope.originalProperties = [];
          angular.copy(scope.node.subElements, scope.originalProperties);
          scope.isCreateNew = true;

          $mdDialog.show({
            templateUrl: 'views/propertydialog.html',
            controller: 'PropertydialogCtrl',
            scope: scope.$new(false, scope),
            clickOutsideToClose: true
          }).then(
            function(propertyNode) {
              if (propertyNode) {
                scope.node.addNodeAfter(property, propertyNode);
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
