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
    $http,
    $rootScope,
    leObject,
    transformationDataModel,
    RecursionHelper) {

    var connection = leObject.serveraddress;

    //load server vocabulary

    var localVocabulary = $rootScope.transformation.rdfVocabs;
    $http.get(
      connection + 'getAll'
    ).success(
      function(response) {
        for (var i = response.result.length - 1; i >= 0; i--) {
          var vocabItemTemplate = {
            name: response.result[i].name,
            namespace: response.result[i].namespace,
            fromServer: true,
            properties: [],
            classes: []
          };
          localVocabulary.push(vocabItemTemplate);
        }
      }).error(function(data, status, headers, config) {
        console.log('error /api/vocabulary/getAll');
      });

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
