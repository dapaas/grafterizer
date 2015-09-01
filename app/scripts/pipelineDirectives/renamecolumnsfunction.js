'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:renameColumnsFunction
 * @description
 * # renameColumnsFunction
 */
angular.module('grafterizerApp')
  .directive('renameColumnsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/renameColumnsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          var renfunc = scope.$parent.transformation.findPrefixerOrCustomFunctionByName('keyword');
          scope.function = new transformationDataModel.RenameColumnsFunction([renfunc], [null, null], null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          var functArray = [];
          var newrenfunc;

          if (!scope.function.mappings[0]) {
            for (var i = 0; i < scope.function.functionsToRenameWith.length; ++i) {
              newrenfunc = scope.function.functionsToRenameWith[i];
              if (!(newrenfunc instanceof transformationDataModel.CustomFunctionDeclaration || newrenfunc instanceof transformationDataModel
                .Prefixer))
                functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newrenfunc.toString()));
              else functArray.push(newrenfunc);
            }
          }

          return new transformationDataModel.RenameColumnsFunction(
            functArray, scope.function.mappings, scope.function.docstring);

        };

        scope.addRenameFunction = function() {
          var renfunc = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(
            scope.$parent.transformation.customFunctionDeclarations[0].name);
          this.function.functionsToRenameWith.push(renfunc);
        };

        scope.removeRenameFunction = function(index) {
          scope.function.removeRenameFunction(index);
        };

        scope.addRenameMapping = function() {
          this.function.mappings.push(null);
          this.function.mappings.push(null);
        };

        scope.removeMappingPair = function(index) {
          this.function.mappings.splice(index, 2);
        };

        scope.getMapLength = function(num) {
          var b = [];
          for (var i = 0; i <= num / 2; i += 2) b.push(i);
          return b;
        };

        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
      }
    };
  });
