'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:graphMapping
 * @description
 * # graphMapping
 */
angular.module('grafterizerApp')
    .directive('graphMapping', function ($mdDialog, transformationDataModel) {
    return {
        templateUrl: 'views/graphmapping.html',
        restrict: 'E',
        scope: {
            graph: '='
        },
        link: function postLink(scope, element, attrs) {
            
            // TODO hack for when we remove children nodes - refactor
            scope.node = scope.graph;
            scope.graph.addNodeAfter(null, new transformationDataModel.ConstantURI("asd", "ConstantURI", []));
//            scope.graph.graphRoots.push(new transformationDataModel.ColumnURI("asd", "ColumnURI", []));
//            scope.graph.graphRoots.push(new transformationDataModel.ConstantLiteral("ConstantLiteral", []));
//            scope.graph.graphRoots.push(new transformationDataModel.ColumnLiteral("ColumnLiteral", []));
            
            scope.clickAddNodeAfter = function (node) {
                var newScope = scope.$new(false, scope);
                newScope.isCreate = true;
                $mdDialog.show({
                    templateUrl: 'views/mappingnodedefinitiondialog.html',
                    scope: newScope
                }).then( function(graphNode) {
                    if(graphNode){
                        scope.$parent.node.addNodeAfter(scope.node, graphNode);
                    }
                }, function () {
                    newScope.$destroy();
                });
            }
        }
    };
});
