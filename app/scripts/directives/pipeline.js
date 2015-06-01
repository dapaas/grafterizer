'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:pipeline
 * @description
 * # pipeline
 */
angular.module('grafterizerApp')
    .directive('pipeline', function (transformationDataModel, $mdDialog) {
    return {
        templateUrl: 'views/pipeline.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            scope.pipeline = new transformationDataModel.Pipeline([]);
            scope.clickAddAfter = function (funct) {
                $mdDialog.show({
                    templateUrl: 'views/pipelineFunctionDialog.html'
                }).then( function(pipeFunct) {
                    if(pipeFunct){
                        scope.pipeline.addAfter(funct, pipeFunct);
                        console.log(scope.pipeline);
                    }
                });
            };
            scope.clickRemove = function (funct) {
                $mdDialog.show(
                    $mdDialog.confirm()
                    .title('Are you sure you want to remove this element?')
                    .content('Please confirm that you want to remove the element.')
                    .ariaLabel('Please confirm that you want to remove the element.')
                    .ok('Yes')
                    .cancel('Cancel')).then(function() {
                        scope.pipeline.remove(funct);
                });
            };
        }

    };
});
