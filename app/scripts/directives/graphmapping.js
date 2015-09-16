'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:graphMapping
 * @description
 * # graphMapping
 */
angular.module('grafterizerApp')
  .directive('graphMapping', function(
             $mdDialog,
              transformationDataModel,
              RecursionHelper) {
  return {
    templateUrl: 'views/graphmapping.html',
    restrict: 'E',
    scope: {
      graph: '='
    },
    compile: function(element) {
      return RecursionHelper.compile(element, function(scope, iElement,
                                                        iAttrs, controller, transcludeFn) {

        scope.clickAddNodeAfter = function(node) {
          var newScope = scope.$new(false, scope);
          newScope.isCreate = true;
          newScope.parentNode = scope.graph;
          $mdDialog.show({
            controller: 'MappingnodedefinitiondialogCtrl',
            templateUrl: 'views/mappingnodedefinitiondialog.html',
            scope: newScope
          }).then(
            function(graphNode) {
              if (graphNode) {
                scope.graph.addNodeAfter(scope.node, graphNode);
              }
            },

            function() {
              newScope.$destroy();
            });
        };
      });
    }
  };
});
