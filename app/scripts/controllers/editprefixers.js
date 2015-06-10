'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:EditprefixersCtrl
 * @description
 * # EditprefixersCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('EditprefixersCtrl', function ($scope, $mdDialog, transformationDataModel, $mdToast) {
    console.log($scope);
    //    $scope.gridPrefixers
    $scope.gridOpts = {
        onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
        },
        exporterMenuCsv: true,
        exporterMenuPdf: false,
        enableGridMenu: true,
        columnDefs: [
            { name: 'prefixName' },
            { name: 'uri' }
        ],
        data: []
    };
    for(var i=0; i<$scope.$parent.transformation.prefixers.length; ++i){
        var prefixer = $scope.$parent.transformation.prefixers[i];
        console.log($scope.$parent.transformation.prefixers);
        $scope.gridOpts.data.push({"prefixName": prefixer.name, "uri": prefixer.uri});

    }
    $scope.applyPrefixersChanges = function () {
        $mdDialog.hide();
    }
    $scope.cancelPrefixersChanges = function () {
        $mdDialog.cancel();
    }
    $scope.removeSelectedPrefixers = function () {
        $mdToast.show();
        var selectedRows = $scope.gridApi.selection.getSelectedRows(), i;

        for(i =0; i<selectedRows.length; ++i){
            if(!$scope.transformation.removePrefixer(selectedRows[i].prefixName)){
                
            }
        }
    }
    $scope.addPrefixer = function () {
        if(!$scope.prefixName){
            console.error("No name provided for prefixer");
            return;
        }
        if(!$scope.prefixUri){
            console.error("No prefix URI provided for prefixer");
            return;
        }
        $scope.transformation.prefixers.push(new transformationDataModel.Prefixer($scope.prefixName, $scope.prefixUri));
        $scope.gridOpts.data.push({"prefixName": $scope.prefixName, "uri": $scope.prefixUri});
    };
});
