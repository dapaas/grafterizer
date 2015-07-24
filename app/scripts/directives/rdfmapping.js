'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:rdfMapping
 * @description
 * # rdfMapping
 */
angular.module('grafterizerApp')
  .directive('rdfMapping', function(
    $mdDialog,
    transformationDataModel,
    RecursionHelper) {
    return {
      templateUrl: 'views/rdfmapping.html',
      restrict: 'E',
      compile: function(element) {
        return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
          scope.clickAddAfter = function(graph) {
            if (!graph) {
              var newGraph = new transformationDataModel.Graph('http://www.example.no/#/', []);
              scope.$parent.transformation.addGraphAfter(null, newGraph);
            }
          };
        });
    }
    };
  });
