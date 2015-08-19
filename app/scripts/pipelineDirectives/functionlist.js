'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:functionList
 * @description
 * # functionList
 */
angular.module('grafterizerApp')
  .directive('functionList', function() {
    return {
      templateUrl: 'views/pipelineFunctions/functionlist.html',
      restrict: 'E',
      scope: true,
      controller: ['$scope',
        function($scope) {
          var groups = [];
          var i;

          for (i = 0; i < $scope.$parent.transformation.customFunctionDeclarations.length; ++i) {
            if (groups.indexOf($scope.$parent.transformation.customFunctionDeclarations[i].group) === -1) {
              groups.push($scope.$parent.transformation.customFunctionDeclarations[i].group);
            }
          }

          $scope.functionGroups = groups.sort();
          $scope.groupsVisible = [];

          for (i = 0; i < $scope.functionGroups.length; i++) {
            $scope.groupsVisible.push(false);
          }

          $scope.switchGroupVisible = function(index) {
            $scope.groupsVisible[index] = !$scope.groupsVisible[index];
          };
        }

      ],
      link: function(scope, elem, attrs) {}
    };
  });
