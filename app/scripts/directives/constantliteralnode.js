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
              scope.node = transformationDataModel.getGraphElement(graphNode);
            },

            function() {
              angular.copy(scope.originalNode, scope.node);
              newScope.$destroy();
            });
        };

      });
    }
  };
});
