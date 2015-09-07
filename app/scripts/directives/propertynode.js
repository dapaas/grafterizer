'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:propertyNode
 * @description
 * # propertyNode
 */
angular.module('grafterizerApp')
  .directive('propertyNode', function(
    transformationDataModel,
    $mdDialog,
    RecursionHelper,
    leObject,
    $http,
    $mdToast) {
    return {
      scope: {
        property: '=',
        parent: '='
      },
      templateUrl: 'views/propertynode.html',
      restrict: 'E',
      compile: function(element) {
        return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
          scope.editProperty = function() {
            scope.originalProperties = [];
            angular.copy(scope.parent.subElements, scope.originalProperties);
            $mdDialog.show({
              templateUrl: 'views/propertydialog.html',
              controller: 'PropertydialogCtrl',
              scope: scope.$new(false, scope)
            }).then(
            function(propertyNode) {},

            function() {
              angular.copy(scope.originalProperties, scope.parent.subElements);
            });
          };

          var tripleStr = '';

          function convertTriple(element){
            if(element === null){
              return '';
            }

            if(element.__type == 'ConstantURI'){
              return ' ' + element.prefix + ':' + element.constant;
            }

            if(element.__type == 'ColumnURI'){
              return ' ' + element.prefix + ':' + element.column;
            }

            if(element.__type == 'Property'){
              return ' ' + element.prefix + ':' + element.propertyName;
            }

            if(element.__type == 'ConstantLiteral'){
              return ' ' + '"' + element.constant + '"';
            }

            if(element.__type == 'ColumnLiteral'){
              return ' ' + '"' + element.literalValue + '"';
            }
          }

          // recursive function to get triples from map and save it in tripleArray
          function getTriple(element){
            var subject = element;
            var subjectStr = convertTriple(subject);

            for(var i = 0; i < subject.subElements.length; i++){
              var predicate = subject.subElements[i];
              var predicateStr = convertTriple(predicate);
              for(var j = 0; j < predicate.subElements.length; j++){
                var object = predicate.subElements[j];
                var objectStr = convertTriple(predicate.subElements[j]);
                var triple = subjectStr + ' ' + predicateStr + ' ' + objectStr + '.';
                tripleStr += triple;
                getTriple(object);
              }
            }
          }

          scope.clickAddNodeAfter = function(node) {
            var newScope = scope.$new(false, scope);
            newScope.isCreate = true;
            $mdDialog.show({
              templateUrl: 'views/mappingnodedefinitiondialog.html',
              controller: 'MappingnodedefinitiondialogCtrl',
              scope: newScope
            }).then(function(graphNode) {
              if (graphNode) {
                scope.property.addNodeAfter(null, graphNode);

                if(scope.$root.transformation.graphs.length > 0 && leObject.validationOn == true){
                  var element = scope.$root.transformation.graphs[0].graphRoots[0];
                  if(typeof element !== 'undefined') {
                    getTriple(element);
                    $http.post(
                      leObject.serveraddress + 'validate',
                      {
                        data: tripleStr
                      }
                    ).success(function (response) {
                        if (response.errorlevel == "Correct") {
                          //$scope.showNoError = true;
                        }
                        else {
                          if(response.errorArray.length > 0){
                            $mdToast.show(
                              $mdToast.simple()
                                .content(response.errorArray[0].value)
                                .position('bottom left')
                                .hideDelay(3000)
                            );
                          }

                          //$scope.showNoError = false;
                        }
                      }
                    ).error(function (data, status, headers, config) {

                      })

                  }
                }
              }
            });
          };
        });
      }
    };
  });

