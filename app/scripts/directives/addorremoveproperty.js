'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addOrRemoveProperty
 * @description
 * # addOrRemoveProperty
 */
angular.module('grafterizerApp')
    .directive('addOrRemoveProperty', function ($mdDialog, transformationDataModel, RecursionHelper) {
    return {
        templateUrl: 'views/addorremoveproperty.html',
        restrict: 'E',
        scope: {
            property: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                scope.node = scope.property;
                scope.editProperty = function () {
                    scope.originalProperties = [];
                    angular.copy(scope.node.parent.subElements, scope.originalProperties);
                    $mdDialog.show({
                        templateUrl: 'views/propertydialog.html',
                        controller: 'PropertydialogCtrl',
                        scope: scope.$new(false, scope)
                    }).then( function(propertyNode) {
                    }, function () {
                        angular.copy(scope.originalProperties, scope.node.parent.subElements);
                    });
                };
                scope.clickAddPropertyAfter = function (property) {
                    var newScope = scope.$new(false, scope);
                    newScope.property = null;
                    $mdDialog.show({
                        templateUrl: 'views/propertydialog.html',
                        controller: 'PropertydialogCtrl',
                        scope: newScope
                    }).then( function(propertyNode) {
                        scope.node.parent.addNodeAfter(property, propertyNode);
                    });
                };
                scope.clickRemoveProperty = function (property) {
                    $mdDialog.show(
                        $mdDialog.confirm()
                        .title('Are you sure you want to remove this element?')
                        .content('Please confirm that you want to remove the element.')
                        .ariaLabel('Please confirm that you want to remove the element.')
                        .ok('Yes')
                        .cancel('Cancel')).then(function() {
                        scope.node.parent.removeChild(property);
                    });

                }
                scope.clickAddNodeAfter = function (node) {
                    var newScope = scope.$new(false, scope);
                    newScope.isCreate = true;
                    $mdDialog.show({
                        templateUrl: 'views/mappingNodeDefinitionDialog.html',
                        controller: 'MappingnodedefinitiondialogCtrl',
                        scope: newScope
                    }).then( function(graphNode) {
                        if(graphNode){
                            scope.property.addNodeAfter(null, graphNode);
                        }
                    });
                }
            });
        }
    };
});
