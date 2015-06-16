'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PropertydialogCtrl
 * @description
 * # PropertydialogCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('PropertydialogCtrl', function ($scope, $mdDialog, transformationDataModel) {
    console.log("scope current property", $scope.property);
    if(!$scope.property)
        $scope.property = new transformationDataModel.Property("", "", []);
    
    $scope.addProperty = function () {
        $mdDialog.hide($scope.property);
    };
    $scope.closeDialog = function () {
    };
    
});
