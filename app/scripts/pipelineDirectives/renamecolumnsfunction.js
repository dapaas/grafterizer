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
        if (!scope.rfunction) {
          var renfunc = scope.$parent.transformation.findPrefixerOrCustomFunctionByName('keyword');
          scope.rfunction = new transformationDataModel.RenameColumnsFunction([renfunc], [null, null], null);
          scope.rfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          var functArray = [];
          var newrenfunc;

          if (!scope.rfunction.mappings[0]) {
            for (var i = 0; i < scope.rfunction.functionsToRenameWith.length; ++i) {
              newrenfunc = scope.rfunction.functionsToRenameWith[i];
              if (!(newrenfunc instanceof transformationDataModel.CustomFunctionDeclaration || newrenfunc instanceof transformationDataModel
                .Prefixer))
                functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newrenfunc.toString()));
              else functArray.push(newrenfunc);
            }
          }

          return new transformationDataModel.RenameColumnsFunction(
            functArray, scope.rfunction.mappings, scope.rfunction.docstring);

        };

        scope.addRenameFunction = function() {
          var renfunc = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(
            scope.$parent.transformation.customFunctionDeclarations[0].name);
          this.rfunction.functionsToRenameWith.push(renfunc);
        };

        scope.removeRenameFunction = function(index) {
          scope.rfunction.removeRenameFunction(index);
        };

        scope.addRenameMapping = function() {
          this.rfunction.mappings.push(null);
          this.rfunction.mappings.push(null);
        };

        scope.removeMappingPair = function(index) {
          this.rfunction.mappings.splice(index, 2);
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
