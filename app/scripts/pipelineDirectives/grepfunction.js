'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:grepFunction
 * @description
 * # grepFunction
 */
angular.module('grafterizerApp')
  .directive('grepFunction', function(transformationDataModel, $mdDialog) {
    return {
      templateUrl: 'views/pipelineFunctions/grepFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          var filtfunc = scope.$parent.transformation.customFunctionDeclarations[0];
          scope.function = new transformationDataModel.GrepFunction(true,
           'text', [], [filtfunc], null, null, null, null);
          scope.function.docstring = null;
        }

        scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined')? [] : scope.$parent.$root.colnames();
var colCtr = 0;
scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
          var functArray = [];
          var newfiltfunc;
          if (scope.function.functionsToFilterWith) {
            for (var i = 0; i < scope.function.functionsToFilterWith.length; ++i) {
              newfiltfunc = scope.function.functionsToFilterWith[i];

              if (!(newfiltfunc instanceof transformationDataModel.CustomFunctionDeclaration || newfiltfunc instanceof transformationDataModel
                .Prefixer))
                functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newfiltfunc.toString()));
              else functArray.push(newfiltfunc);
            }
          }

          return new transformationDataModel.GrepFunction(
            scope.function.take,
            scope.function.grepmode,
            scope.function.colsToFilter,
            functArray,
            scope.function.filterText,
            scope.function.filterRegex,
            scope.function.ignoreCase,
            scope.function.docstring);
        };

        scope.addFilterFunction = function() {
          var filtfunc = scope.$parent.transformation.customFunctionDeclarations[0];
          this.function.functionsToFilterWith.push(filtfunc);
        };
        
        scope.removeFilterFunction = function(index) {
          scope.function.functionsToFilterWith.splice(index, 1);
        };
        
        scope.showRegexTutorial = function() {
          $mdDialog.show({
            templateUrl: 'views/regextutorial.html',
            clickOutsideToClose: true
          });
        };
        
        scope.showRegex = false;
        scope.switchRegex = function() {
          scope.showRegex = !scope.showRegex;
        };
        
      }
    };
  });
  
