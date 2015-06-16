'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addOrRemoveNode
 * @description
 * # addOrRemoveNode
 */
angular.module('grafterizerApp')
    .directive('addOrRemoveNode', function ($mdDialog, transformationDataModel, RecursionHelper) {
    return {
        templateUrl: 'views/addorremovenode.html',
        restrict: 'E',
        scope: {
            property: '=',
            parent: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){

                scope.editNode = function () {
                    scope.originalNode = {};
                    angular.copy(scope.node, scope.originalNode);
                    var newScope = scope.$new(false, scope);
                    newScope.newNode = scope.node;
                    newScope.isCreate = false;
                    $mdDialog.show({
                        templateUrl: 'views/mappingNodeDefinitionDialog.html',
                        controller: 'MappingnodedefinitiondialogCtrl',
                        scope: newScope
                    }).then(function(graphNode) {
                        angular.copy(graphNode, scope.node);
                    }, function() {
                        angular.copy(scope.originalNode, scope.node);
                        newScope.$destroy();
                    });
                };
                scope.clickRemoveNode = function (node) {
                    $mdDialog.show(
                        $mdDialog.confirm()
                        .title('Are you sure you want to remove this element?')
                        .content('Please confirm that you want to remove the element.')
                        .ariaLabel('Please confirm that you want to remove the element.')
                        .ok('Yes')
                        .cancel('Cancel')).then(function() {
                        scope.parent.removeChild(node);
                    });
                };
                scope.clickAddNodeAfter = function () {
                    var newScope = scope.$new(false, scope);
                    newScope.isCreate = true;
                    $mdDialog.show({
                        templateUrl: 'views/mappingNodeDefinitionDialog.html',
                        controller: 'MappingnodedefinitiondialogCtrl',
                        scope: newScope
                    }).then( function(graphNode) {
                        if(graphNode){
                            scope.parent.addNodeAfter(scope.node, graphNode);
                        }
                    }, function () {

                        newScope.$destroy();
                    });
                };
                scope.clickAddPropertyAfter = function (property) {
                    scope.originalProperties = [];
                    angular.copy(scope.node.subElements, scope.originalProperties);
                    if(!property){
                        scope.isCreateNew = true;
                    } else {
                        scope.isCreateNew = false;
                    }
                    $mdDialog.show({
                        templateUrl: 'views/propertydialog.html',
                        controller: 'PropertydialogCtrl',
                        scope: scope.$new(false, scope)
                    }).then( function(propertyNode) {
                        if(propertyNode){
                            scope.node.addNodeAfter(property, propertyNode);
                        }
                    }, function () {
                        angular.copy(scope.originalProperties, scope.node.subElements);
                    });
                };
            })
        }
    };
});
