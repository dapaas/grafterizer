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
            if(scope.graph.graphRoots.length==0){
                var property1 = new transformationDataModel.Property("rdf", "a");
                var property2 = new transformationDataModel.Property("foaf", "name");
//                var property3 = new transformationDataModel.Property("foaf", "age");
                var property4 = new transformationDataModel.Property("foaf", "gender");
                
                var subNode1 = new transformationDataModel.ConstantURI("foaf", "Person");
                var subNode2 = new transformationDataModel.ColumnLiteral("name");
//                var subNode3 = new transformationDataModel.ColumnLiteral("age");
                var subNode4 = new transformationDataModel.ColumnLiteral("gender");
                
                property1.addChild(subNode1);
                property2.addChild(subNode2);
//                property3.addChild(subNode3);
                property4.addChild(subNode4);
                
                scope.graph.addNodeAfter(null, new transformationDataModel.ColumnURI("", "person-uri", [property1, property2,  property4]));
            }
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
