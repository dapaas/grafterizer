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
              angular.copy(scope.node, scope.originalNode);
              var newScope = scope.$new(false, scope);
              newScope.newNode = scope.node;
              newScope.isCreate = false;
              $mdDialog.show({
                templateUrl: 'views/mappingnodedefinitiondialog.html',
                controller: 'MappingnodedefinitiondialogCtrl',
                scope: newScope
              }).then(
              function(graphNode) {
                angular.copy(graphNode, scope.node);
              },

              function() {
                angular.copy(scope.originalNode, scope.node);
                newScope.$destroy();
              });
            };

            scope.clickAddPropertyAfter = function(property) {
              scope.originalProperties = [];
              angular.copy(scope.node.subElements, scope.originalProperties);
              if (!property) {
                scope.isCreateNew = true;
              } else {
                scope.isCreateNew = false;
              }

              $mdDialog.show({
                templateUrl: 'views/propertydialog.html',
                controller: 'PropertydialogCtrl',
                scope: scope.$new(false, scope)
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
