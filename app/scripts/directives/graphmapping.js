'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:graphMapping
 * @description
 * # graphMapping
 */
angular.module('grafterizerApp')
    .directive('graphMapping', function ($mdDialog, transformationDataModel, RecursionHelper) {
    return {
        templateUrl: 'views/graphmapping.html',
        restrict: 'E',
        scope: {
            graph: '='
        },
         compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
            if(scope.graph.graphRoots.length==0)
                scope.graph.addNodeAfter(null, new transformationDataModel.ConstantURI("asd", "ConstantURI", []));
//            scope.graph.graphRoots.push(new transformationDataModel.ColumnURI("asd", "ColumnURI", []));
//            scope.graph.graphRoots.push(new transformationDataModel.ConstantLiteral("ConstantLiteral", []));
//            scope.graph.graphRoots.push(new transformationDataModel.ColumnLiteral("ColumnLiteral", []));
            
            scope.clickAddNodeAfter = function (node) {
                var newScope = scope.$new(false, scope);
                newScope.isCreate = true;
                $mdDialog.show({
                    controller: 'MappingnodedefinitiondialogCtrl',
                    templateUrl: 'views/mappingnodedefinitiondialog.html',
                    scope: newScope
                }).then( function(graphNode) {
                    if(graphNode){
                        scope.graph.addNodeAfter(scope.node, graphNode);
                        console.log("graphNode", graphNode);
                    }
                }, function () {
                    newScope.$destroy();
                });
            }
        })}
    };
});
