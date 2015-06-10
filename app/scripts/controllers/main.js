'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('MainCtrl', function (transformationDataModel, $scope, $mdDialog) {
    /************************ Temporary testing data BEGIN **************************/
    var prefixer = new transformationDataModel.Prefixer("examplePrefixer", "http://www.asdf.org/#/");
    var customFunctionDeclaration = new transformationDataModel.CustomFunctionDeclaration("exampleCustomFunct", "(defn example asdf)");
    $scope.transformation = new transformationDataModel.Transformation([customFunctionDeclaration], [prefixer], [], []);

    /************************ Temporary testing data END **************************/
    $scope.editPrefixers = function () {
        $scope.originalPrefixers = [];
        angular.copy($scope.transformation.prefixers, $scope.originalPrefixers);
        $mdDialog.show({
            templateUrl: 'views/editprefixes.html',
            controller: 'EditprefixersCtrl',
            scope: $scope.$new(false, $scope)
        }).then(function() {
        }, function() {
            angular.copy($scope.originalPrefixers, $scope.transformation.prefixers);
        });
    };
    $scope.createCustomFunction = function () {
        $mdDialog.show({
            templateUrl: 'views/createcustomfunction.html',
            controller: 'CustomfunctionsdialogcontrollerCtrl',
            scope: $scope.$new(false, $scope)
        }).then(function() {
        }, function() {
        }); 
    };
    $scope.previewPipeline = function () {
        $mdDialog.show({
            templateUrl: 'views/previewpipeline.html',
            controller: 'PreviewpipelinedialogCtrl',
            scope: $scope.$new(false, $scope)
        }).then(function() {
        }, function() {
        }); 
    };
    $scope.modifyMapping = function () {};
    
});
