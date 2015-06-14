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
            property: '='
        },
        templateUrl: 'views/propertynode.html',
        restrict: 'E',
        compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                scope.node = scope.property;
                scope.editProperty = function () {
                    scope.originalProperties = [];
                    angular.copy(scope.$parent.node.subElements, scope.originalProperties);
                    $mdDialog.show({
                        templateUrl: 'views/propertydialog.html',
                        controller: 'PropertydialogCtrl',
                        scope: scope.$new(false, scope)
                    }).then( function(propertyNode) {
                    }, function () {
                        angular.copy(scope.originalProperties, scope.$parent.node.subElements);
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
                        scope.$parent.node.addNodeAfter(property, propertyNode);
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
                        scope.$parent.node.removeChild(property);
                    });

                }
                scope.clickAddNodeAfter = function (node) {
                    $mdDialog.show({
                        templateUrl: 'views/mappingNodeDefinitionDialog.html',
                        scope: scope.$new(false, scope)
                    }).then( function(graphNode) {
                        if(graphNode){
//                            scope.property.addNodeAfter(scope.node, graphNode);
                        }
                    });
                }
                //		      	scope.showNext = Math.random()<0.1;
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
        }
        //        link: function postLink(scope, element, attrs) {
        //
        //        }
    };
});
