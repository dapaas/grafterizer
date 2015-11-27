'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:sortDataset
 * @description
 * # sortDataset
 */
angular.module('grafterizerApp')
  .directive('sortDataset', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/sortDatasetFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        if (!scope.function) {
            var colnameSorttype = new transformationDataModel.ColnameSorttype(null,null,false);
          scope.function = new transformationDataModel.SortDatasetFunction([colnameSorttype],null);
          scope.function.docstring = null;
        }
        if (!(scope.function instanceof transformationDataModel.SortDatasetFunction)) {
          var newFunction = new transformationDataModel.SortDatasetFunction([],null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }
      
  scope.colnames = (typeof scope.$parent.$root.colnames === 'undefined') ? [] : scope.$parent.$root.colnames();
var colCtr = 0;
scope.addColumn = function(query) {
    return { 
        id: colCtr++,
        value: query
    };
};
scope.sortTypes = ['Alphabetical','Numerical','By length','Date'];
        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.SortDatasetFunction(scope.function.colnamesSorttypesMap,scope.function.docstring);
        };
        scope.addColnameSorttype = function() {
            
            var colnameSorttype = new transformationDataModel.ColnameSorttype(null,null,false);
            this.function.colnamesSorttypesMap.push(colnameSorttype);

      };
        scope.removeColnameSorttype = function(nametype) {
            scope.function.removeColnameSorttype(nametype);
        };
      }
    };
  });
  
