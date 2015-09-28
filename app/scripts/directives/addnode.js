'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addNode
 * @description
 * # addNode
 */
angular.module('grafterizerApp')
  .directive('addNode', function ($mdDialog) {
    return {
      templateUrl: 'views/addnode.html',
      restrict: 'E',
      scope: {
        node: '=',
        parent: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.addNodeAfter = function() {
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
      }
    };
  });
