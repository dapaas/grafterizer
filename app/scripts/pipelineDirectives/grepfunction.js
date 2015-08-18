'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:grepFunction
 * @description
 * # grepFunction
 */
angular.module('grafterizerApp')
  .directive('grepFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/grepFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.gfunction) {
          var filtfunc = scope.$parent.transformation.customFunctionDeclarations[0];
          scope.gfunction = new transformationDataModel.GrepFunction(
            [], [filtfunc], null, null, null, null);
          scope.gfunction.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
          var functArray = [];
          var newfiltfunc;
          if (scope.gfunction.functionsToFilterWith) {
            for (var i = 0; i < scope.gfunction.functionsToFilterWith.length; ++i) {
              newfiltfunc = scope.gfunction.functionsToFilterWith[i];

              if (!(newfiltfunc instanceof transformationDataModel.CustomFunctionDeclaration || newfiltfunc instanceof transformationDataModel
                .Prefixer))
                functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newfiltfunc.toString()));
              else functArray.push(newfiltfunc);
            }
          }

          return new transformationDataModel.GrepFunction(
            scope.gfunction.colsToFilter,
            functArray,
            scope.gfunction.filterText,
            scope.gfunction.filterRegex,
            scope.gfunction.ignoreCase,
            scope.gfunction.docstring);
        };

        scope.addFilterFunction = function() {
          var filtfunc = scope.$parent.transformation.customFunctionDeclarations[0];
          this.gfunction.functionsToFilterWith.push(filtfunc);
        };
        
        scope.removeFilterFunction = function(index) {
          scope.gfunction.functionsToFilterWith.splice(index, 1);
        };
        
        scope.showRegexTutorial = function() {
          scope.$parent.$mdDialog.show({
            templateUrl: 'views/regextutorial.html'
          });
        };
        
        scope.showRegex = false;
        scope.showUsage = false;
        scope.switchShowUsage = function() {
          scope.showUsage = !scope.showUsage;
        };
        
        scope.switchRegex = function() {
          scope.showRegex = !scope.showRegex;
        };
        
      }
    };
  });
  