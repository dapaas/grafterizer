'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:UtilityfunctionsCtrl
 * @description
 * # UtilityfunctionsCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('UtilityFunctionsCtrl', function (
    $scope,
    $mdDialog,
    dataGraftApi) {
    
    // Some auto generated boiler code:
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    
    $scope.consoleTest = function() {
        console.log("This is the consoleTest functions");
    }
    $scope.log = function(a) {
        console.log(a);
    }
    
    $scope.utilityFunctionsObj = [];
    $scope.utilityFunctions = "";
    $scope.showPublicUtilityFunctions = true;
    
    $scope.listUtilityFunctions = function() {
        $scope.utilityFunctions = "hang on...";
        // Should be:
        //dataGraftApi.utilityFunctionsList(showPublicUtilityFunctions).success(
        //    function(data) {
        //        prettyfyUtilityFunctions(data)
        //    });
        // but this is the work around:
        dataGraftApi.utilityFunctionsList(true).success(
            function(data) {
                if ($scope.showPublicUtilityFunctions) {
                    pretifyUtilityFunctions(data);
                } else {
                    $scope.utilityFunctionsObj = [];
                    
                    for (var i in data) {
                        dataGraftApi.utilityFunctionGet(data[i]["id"]).success( function(singleData) {
                            console.log(JSON.stringify(singleData));
                            if (singleData["public"] !== 'undefined' && singleData["public"]) {
                                console.log("SingleData id = " + singleData["id"]);
                                for (var j in data) {
                                    if (singleData["id"] === data[j]["id"]) {
                                        console.log("pushing data[" + j + "]");
                                        $scope.utilityFunctionsObj.push(data[j]);
                                        break;
                                    }
                                }
                                pretifyUtilityFunctions($scope.utilityFunctionsObj);
                            }
                        });
                    }
                    console.log($scope.utilityFunctionsObj);
                    pretifyUtilityFunctions($scope.utilityFunctionsObj);
                }
            }
        );
    }
    $scope.listUtilityFunctions();
    
    $scope.selectedUtilityFunction = {};
    $scope.setSelectedUtilityFunction = function(uf) {
        console.log("Selecting utility function: " + uf);
        $scope.selectedUtilityFunction = uf;
    }
    
    $scope.deleteUtilityFunction = function(id) { 
        console.log("Not implemented: Delete utility function with id " + id);
    }
    
    $scope.createNewUtilityFunction = function() {
        console.log("Not implemented: Create new utility function");
    }
    
    $scope.createNewTextTransformation = function() {
        console.log("Not implemneted: Create new text transformation");
    }
    
    $scope.applyUtilityFunctionChanges = function() {
        console.log("Not implemented: apply utility function changes");
    }
    
    $scope.cancelUtilityFunctionChanges = function() {
        console.log("Not implemented: cancel utility function changes");
    }
    
    $scope.showClojureCode = function(uf) {
        console.log("Not implemented: show clojure code for " + uf);
    }
    
    
    var pretifyUtilityFunctions = function(ufList) {
        var tmpString = "";
        for ( var j in ufList) {
            tmpString += JSON.stringify(ufList[j], null, 4 );
        }
        $scope.utilityFunctions = tmpString;
    }
    
    
    // This function should open the dialog box and set controller for it.
    // Let's try to use the same controller as we're already in :)
    $scope.defineCustomFunctions = function() {
      //$scope.originalCustomFunctionDeclarations = [];
      //angular.copy($scope.transformation.customFunctionDeclarations, $scope
      //    .originalCustomFunctionDeclarations);
      $mdDialog.show({
        templateUrl: 'views/havaholDialog.html',
        controller: 'UtilityFunctionsCtrl',
        scope: $scope.$new(false, $scope),
        clickOutsideToClose: true
      }).then(
        function() {});//,

        //function() {
        //  angular.copy($scope.originalCustomFunctionDeclarations, $scope.transformation
        //    .customFunctionDeclarations);
        //});
    };
    
    
    $scope.apiKey = dataGraftApi.apiKey;


    
    var metadata = ['{"weather": "sunny", "smurning": "vr40", "good": "oyeah"}',
                    '{"metadata": "yeah"}',
                    '{"metadata": "yeah", "snow": "some"}'];
    
    $scope.utilityFunctionsObj = metadata;
    var id = "1";
    $scope.testText = "Currently nothing is tested";
    
    $scope.testMetadata = function(md) {
        dataGraftApi.transformationCreateMetadata(id, metadata[md]).success(function(data) {
               $scope.testText = JSON.stringify(data, null, 2);
        });
    }
   
    
    
  });
