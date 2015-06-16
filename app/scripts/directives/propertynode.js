'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:propertyNode
 * @description
 * # propertyNode
 */
angular.module('grafterizerApp')
    .directive('propertyNode', function (transformationDataModel, $mdDialog, RecursionHelper) {
    return {
        scope: {
            property: '=',
            parent: '='
        },
        templateUrl: 'views/propertynode.html',
        restrict: 'E',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                scope.editProperty = function () {
                    scope.originalProperties = [];
                    angular.copy(scope.parent.subElements, scope.originalProperties);
                    $mdDialog.show({
                        templateUrl: 'views/propertydialog.html',
                        controller: 'PropertydialogCtrl',
                        scope: scope.$new(false, scope)
                    }).then( function(propertyNode) {
                    }, function () {
                        angular.copy(scope.originalProperties, scope.parent.subElements);
                    });
                };
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
                };
            });
        }
    };
});
