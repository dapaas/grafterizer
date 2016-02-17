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
    
    $scope.ufAllObj = [];
    $scope.ufPrivateObj = [];
    $scope.ufPublicObj = [];
    $scope.ufShowObj = [];
    
    $scope.ufAllStr = "hang on...";
    $scope.ufPrivateStr = "hang on...";
    $scope.ufPublicStr = "hang on...";
    var updateUfStrs = function() {
        $scope.ufAllStr = JSON.stringify($scope.ufAllObj, null, 4);
        $scope.ufPrivateStr = JSON.stringify($scope.ufPrivateObj, null, 4);
        $scope.ufPublicStr = JSON.stringify($scope.ufPublicObj, null, 4);
    }
    
    $scope.listUtilityFunctions = function() {
        $scope.ufAllObj = [];
        $scope.ufPrivateObj = [];
        $scope.ufPublicObj = [];
        dataGraftApi.utilityFunctionsList(true).success( function(data) {
            $scope.ufAllObj = data;
            updateUfStrs();
            for (var i in data) {
                if (data[i].public) {
                    $scope.ufPublicObj.push(data[i]);
                } else {
                    $scope.ufPrivateObj.push(data[i]);
                }
            }
            updateUfStrs();
        });
    }
    
    
    
    $scope.utilityFunctionsObj = [];
    $scope.utilityFunctions = "";
    $scope.showPublicUtilityFunctions = true;
    

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
    
    $scope.markAsChanged = function() {
        console.log("Not implemented: Mark as changed");
    }
    
    var pretifyUtilityFunctions = function(ufList) {
        $scope.utilityFunctions = JSON.stringify(ufList, null, 4);
        //var tmpString = "";
        //for ( var j in ufList) {
        //    tmpString += JSON.stringify(ufList[j], null, 4 );
        //}
        //$scope.utilityFunctions = tmpString;
    }
    
    
    
    // ------ Below this line should be in parent controller --------- //
    
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
