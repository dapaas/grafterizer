'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addOrRemoveNode
 * @description
 * # addOrRemoveNode
 */
angular.module('grafterizerApp')
  .directive('addOrRemoveNode', function(
             $mdDialog,
              transformationDataModel,
              RecursionHelper) {

  return {
    templateUrl: 'views/addorremovenode.html',
    restrict: 'E',
    scope: {
      node: '=',
      parent: '='
    },
    compile: function(element) {
      return RecursionHelper.compile(element, function(scope, iElement,
                                                        iAttrs, controller, transcludeFn) {
        scope.clickRemoveNode = function(node) {
          $mdDialog.show(
            $mdDialog.confirm()
            .title(
              'Are you sure you want to remove this element?')
            .content(
              'Please confirm that you want to remove the element.'
            )
            .ariaLabel(
              'Please confirm that you want to remove the element.'
            )
            .ok('Yes')
            .cancel('Cancel')).then(function() {
            scope.parent.removeChild(node);
          });
        };

        scope.clickAddNodeAfter = function() {
          var newScope = scope.$new(false, scope);
          newScope.isCreate = true;
          newScope.parentNode = scope.parent;
          $mdDialog.show({
            templateUrl: 'views/mappingnodedefinitiondialog.html',
            controller: 'MappingnodedefinitiondialogCtrl',
            scope: newScope,
            clickOutsideToClose: true
          }).then(function(graphNode) {
            if (graphNode) {
              scope.parent.addNodeAfter(scope.node, graphNode);
            }
          }, function() {

            newScope.$destroy();
          });
        };
      });
    }
  };
});
