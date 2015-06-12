'use strict';

/**
* @ngdoc directive
* @name grafterizerApp.directive:previewRaw
* @description
* # previewRaw
*/
angular.module('grafterizerApp')
.directive('previewRaw', function () {
    return {
        template: '<div ui-codemirror="editorOptions" ng-model="data"></div>',
        restrict: 'E',
        link: {
            pre: function(scope) {
                scope.editorOptions = {
                    lineWrapping : true, 
                    // lineNumbers: true,
                    mode: 'clojure',
                    readOnly: true
                };
            },
            post: function(scope, element, attrs) {
                scope.data = "coucou";
            }
        }
    }
});
