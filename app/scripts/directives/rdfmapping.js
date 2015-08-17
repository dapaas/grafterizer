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
        Raven.captureMessage('error /api/vocabulary/getAll', {tags: {
          file: 'rdfmapping',
          method: 'controller'
        }});
      });

    return {
      templateUrl: 'views/rdfmapping.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.editRDFPrefixes = function() {
          $mdDialog.show({
            templateUrl: 'views/MappingPrefixManage.html',
            controller: 'MappingPrefixManageCtrl',
            scope: $rootScope.$new(false)
          });
        };

        scope.$watch('$parent.transformation.graphs.length', function() {
          scope.mappingEnabled = scope.$parent.transformation.graphs.length > 0;
        });

        scope.switchMapping = function() {
          var transformation = scope.$parent.transformation;

          if (scope.mappingEnabled) {

            var newGraph = new transformationDataModel.Graph('http://www.example.no/#/', []);
            transformation.addGraphAfter(null, newGraph);

          } else if (transformation.graphs.length > 0) {

            var isEmpty = !_.detect(transformation.graphs, function(graph) {
              return graph.graphRoots && graph.graphRoots.length > 0;
            });

            if (isEmpty) {
              transformation.graphs = [];
            } else {
              $mdDialog.show(
                $mdDialog.confirm()
                .title(
                  'Do you want to disable the RDF mapping?')
                .content(
                  'The current RDF mapping is not empty and it will be removed.'
                )
                .ariaLabel(
                  'The current RDF mapping is not empty and it will be removed.'
                )
                .ok('Yes')
                .cancel('Cancel')).then(
                function() {
                  transformation.graphs = [];
                },

                function() {
                  scope.mappingEnabled = true;
                });
            }
          }

        };
      }
    };
  });
