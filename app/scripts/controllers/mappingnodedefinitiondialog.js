'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:MappingnodedefinitiondialogCtrl
 * @description
 * # MappingnodedefinitiondialogCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('MappingnodedefinitiondialogCtrl', function ($scope, $mdDialog, transformationDataModel) {
    $scope.dialogState = {};
    $scope.dialogState.selectedTab = 0;
    if(!$scope.newNode){
        // we create a new node
        $scope.newNode = {};
    } else {
        // put dialog in the proper state
        switch ($scope.newNode.__type) {
            case 'ConstantURI':
            case 'ColumnURI':
                $scope.dialogState.selectedTab = 0;
                $scope.dialogState.mappingType = $scope.newNode.__type == 'ConstantURI' ? 'free-defined' : 'dataset-col';

                break;
            case 'ColumnLiteral':
            case 'ConstantLiteral':
                $scope.dialogState.selectedTab = 1;
                break;
            case 'BlankNode':
                $scope.dialogState.selectedTab = 2;
                break;
        }
    }
    $scope.changeType = function () {
        
        console.log("call");
        switch ($scope.dialogState.selectedTab){
            case 0:
                if($scope.dialogState.mappingType == 'dataset-col') {
                    console.log("test");
                    $scope.newNode = new transformationDataModel.ColumnURI($scope.newNode.prefix ? $scope.newNode.prefix : '', '', []);
                    console.log("$scope.newNode = new transformationDataModel.ColumnURI('', []);", $scope.newNode);
                } else {
                    $scope.newNode = new transformationDataModel.ConstantURI($scope.newNode.prefix ? $scope.newNode.prefix : '', '', []);
                    console.log("$scope.newNode = new transformationDataModel.ConstantURI('', []);", $scope.newNode);
                }
                break;
            case 1:
                if($scope.dialogState.mappingType == 'dataset-col') {
                    $scope.newNode = new transformationDataModel.ColumnLiteral('', []);
                    console.log("$scope.newNode = new transformationDataModel.ColumnLiteral('', []);", $scope.newNode);

                } else {
                    $scope.newNode = new transformationDataModel.ConstantLiteral('', []);
                    console.log("$scope.newNode = new transformationDataModel.ConstantLiteral('', []);", $scope.newNode);
                }
                break;
            case 2:
                $scope.newNode = new transformationDataModel.BlankNode();
                // TODO not yet implemented
                break;
        }
    }

    $scope.closeDialog = function () {
        $mdDialog.cancel();
    }
    $scope.addNode = function () {
        console.log($scope.newNode);
        $mdDialog.hide($scope.newNode);
    }
});
