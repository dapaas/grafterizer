'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:constantURINode
 * @description
 * # constantURINode
 */
angular.module('grafterizerApp')
    .directive('constantUriNode', function ($mdDialog, transformationDataModel, RecursionHelper) {
    return {
        templateUrl: 'views/constanturinode.html',
        restrict: 'E',
        scope: {
            node: '='  
        },
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                scope.editNode = function () {
                    scope.originalNode = {};
                    angular.copy(scope.node, scope.originalNode);
                    $mdDialog.show({
                        templateUrl: 'views/mappingNodeDefinitionDialog.html',
                        scope: scope.$new(false, scope)
                    }).then(function(graphNode) {
                        angular.copy(graphNode, scope.node);
                    }, function() {
                        angular.copy(scope.originalNode, scope.node);
                    });
                }
                scope.clickRemoveNode = function (node) {
                    $mdDialog.show(
                        $mdDialog.confirm()
                        .title('Are you sure you want to remove this element?')
                        .content('Please confirm that you want to remove the element.')
                        .ariaLabel('Please confirm that you want to remove the element.')
                        .ok('Yes')
                        .cancel('Cancel')).then(function() {
                        console.log("removing child....");
                        console.log(scope);
                        node.parent.removeChild(node);
                    });
                };
                scope.clickAddNodeAfter = function () {
                    $mdDialog.show({
                        templateUrl: 'views/mappingNodeDefinitionDialog.html',
                        scope: scope.$new(false, scope)
                    }).then( function(graphNode) {
                        if(graphNode){
                            scope.$parent.node.addNodeAfter(scope.node, graphNode);
                        }
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
        //        link: function postLink(scope, element, attrs) {
        //
        //        }
    }
});
