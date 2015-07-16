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
      templateUrl: 'views/renameColumnsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
          scope.function = new transformationDataModel.RenameColumnsFunction(null);
        }

        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
       
        /*    var functArray = [];
        for (var i=0;i<scope.function.functionsToRenameWith.length;++i)
            functArray.push(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(
              scope.function.functionsToRenameWith[i]));
          return new transformationDataModel.RenameColumnsFunction(
            [functArray]);*/
return new transformationDataModel.RenameColumnsFunction(scope.$parent.transformation.findPrefixerOrCustomFunctionByName(scope.function.functionToRenameWith));
        };
        scope.showUsage=false;
        scope.switchShowUsage=function() {
        scope.showUsage=!scope.showUsage;
        }
      }
    };
  });
