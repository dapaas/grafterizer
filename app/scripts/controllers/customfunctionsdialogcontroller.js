'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:CustomfunctionsdialogcontrollerCtrl
 * @description
 * # CustomfunctionsdialogcontrollerCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('CustomfunctionsdialogcontrollerCtrl', function ($scope, transformationDataModel, $mdToast, $mdDialog) {
    console.log($scope);
    $scope.codemirrorOpts = {
        lineWrapping : true, 
        lineNumbers: true,
        mode: 'clojure'
    };
    $scope.emptyCustomFunction = new transformationDataModel.CustomFunctionDeclaration("", "(defn YOUR_FUNCTION_NAME YOUR_FUNCTION_CODE)");
    $scope.saveCustomFunct = function () {
        var customFunctionData = $scope.parseCustomFunctionCode($scope.selectedCustomFunction.clojureCode);
        var result = $scope.$parent.transformation.addCustomFunctionDeclaration(customFunctionData.name, customFunctionData.code);
        if(!result){
            $mdToast.show(
                $mdToast.simple()
                .content("Couldn't add custom function. A function with the same name already exists.")
                .position('bottom left')
                .hideDelay(3000)
            );
        }
    };
    $scope.parseCustomFunctionCode = function (customCode){
        var functionName;
        var tmp = customCode.split("defn");
        var tmp1 = customCode.split("def");
        if(tmp.length == 1 && tmp1.length == 1){
            $mdToast.show(
                $mdToast.simple()
                .content("Error parsing custom function: Neither 'defn' nor 'def' keyword found")
                .position('bottom left')
                .hideDelay(3000)
            );
            return {};
        }

        tmp.length > 1 ? tmp=tmp : tmp=tmp1;

        tmp = tmp[1].trim();
        tmp = tmp.split(/\s+/);
        if(tmp.length == 1){
            $mdToast.show(
                $mdToast.simple()
                .content("Error parsing custom function: wrong function definition")
                .position('bottom left')
                .hideDelay(3000)
            );
            return {};
        }

        functionName = tmp[0];

        return {name: functionName, code: customCode};
    };
    $scope.applyCustomFunctionChanges = function () {
        $mdDialog.hide();
    }
    $scope.cancelCustomFunctionChanges = function () {
        $mdDialog.cancel();
    }
});
