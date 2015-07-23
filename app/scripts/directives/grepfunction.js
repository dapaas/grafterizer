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
      templateUrl: 'views/grepFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          var filtfunc = scope.$parent.transformation.customFunctionDeclarations[0];  
          scope.function = new transformationDataModel.GrepFunction(
            [],[filtfunc],null,null,null,null);
          scope.function.docstring = null;
        }

        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
          var functArray = [];
          if (scope.function.functionsToFilterWith)for (var i=0;i<scope.function.functionsToFilterWith.length;++i)
          {
              var newfiltfunc = scope.function.functionsToFilterWith[i];
              if (newfiltfunc) functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(newfiltfunc.toString()));
                      }
          return new transformationDataModel.GrepFunction(
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
            scope.function.functionsToFilterWith.splice(index,1);
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
