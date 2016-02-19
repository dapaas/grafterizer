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

    
    $scope.ufListAll = [];
    $scope.ufListToShow = [];
    var ufListPublicIndices = [];
    
    // New table containing the clojure code as well
    $scope.ufLoaded = {}; // A look up table - no need to iterate
    
    $scope.selectedUtilityFunction = {};
    $scope.hideSwitchSelectedIsPublic = true;
    $scope.switchSelectedIsPublic = false;

    
    // ---- Just for simple testing - start ----
    $scope.ufListAllStr = "hang on...";
    $scope.ufListPrivateStr = "hang on...";
    $scope.ufListPublicStr = "hang on...";
    var stringifyUfList = function(showPublic) {
        var listToStringify = [];
        for(var i in $scope.ufListAll) {
            if (showPublic == ufListPublicIndices[i]) {
                listToStringify.push($scope.ufListAll[i]);
            }
        }
        return JSON.stringify(listToStringify, null, 4);
    }
    var updateUfStrs = function() {
        $scope.ufListAllStr =  JSON.stringify($scope.ufListAll, null, 4);
        $scope.ufListPrivateStr = stringifyUfList(false);
        $scope.ufListPublicStr = stringifyUfList(true);
    }    
    // ---- Just for simple testing - end ----    
    
    
    $scope.listUtilityFunctions = function() {
        $scope.ufListAll = [];
        updateUfStrs();
        dataGraftApi.utilityFunctionsList(true).success( function(data) {
            $scope.ufListAll = data;
            updateUfStrs();
            for (var i in data) {
                if (data[i].public) {
                    ufListPublicIndices.push(true);
                    data[i].publicText = "Public";
                    data[i].publicIcon = "people";
                } else {
                    ufListPublicIndices.push(false);
                    data[i].publicText = "Private";
                    data[i].publicIcon = "person"
                }
            }
            updateUfStrs();
            $scope.ufListToShow = $scope.ufListAll;
        });
    }
    $scope.listUtilityFunctions();

    $scope.switchShowAll = true; 
    $scope.switchShowPublic = true;
    $scope.switchShowPublicText = "Public only";
    
    $scope.ufListUpdate = function() {
        resetSelectedUtilityFunction();
        console.log("Updating utility function list");
        $scope.switchShowPublicText = $scope.switchShowPublic ? "Public only" : "Private only";
        if ($scope.switchShowAll) {
            $scope.ufListToShow = $scope.ufListAll;
        } else {
            $scope.ufListToShow = [];
            for (var i in $scope.ufListAll) {
                if (ufListPublicIndices[i] === $scope.switchShowPublic) {
                    $scope.ufListToShow.push($scope.ufListAll[i]);
                }
            }
        }
    }

    var resetSelectedUtilityFunction = function() {
        $scope.selectedUtilityFunction = {};
        $scope.hideSwitchSelectedIsPublic = true;
    }
    var updateSwitchSelectedIsPublic = function() {
        $scope.hideSwitchSelectedIsPublic = false;
        $scope.switchSelectedIsPublic = $scope.false;
        if ($scope.selectedUtilityFunction.public) {
            $scope.switchSelectedIsPublic = true;
        }
    }
    
    $scope.setSelectedUtilityFunction = function(uf) {
        console.log("Selecting utility function: " + JSON.stringify(uf));
        if (typeof $scope.ufLoaded[uf.id] === "undefined") {
            dataGraftApi.utilityFunctionGet(uf.id).success( function(data) {
                $scope.selectedUtilityFunction = data;
                if ($scope.selectedUtilityFunction.configuration === null
                   || typeof $scope.selectedUtilityFunction.configuration === "undefined") {
                    $scope.selectedUtilityFunction.configuration = {};
                }
                if ($scope.selectedUtilityFunction.configuration.clojure === null 
                    || typeof $scope.selectedUtilityFunction.configuration.clojure === "undefined") {
                    $scope.selectedUtilityFunction.configuration.clojure = "// Could not find clojure code...";
                }
                updateSwitchSelectedIsPublic();
                $scope.selectedUtilityFunction.changed = false;
                $scope.ufLoaded[uf.id] = $scope.selectedUtilityFunction;
            });
        } else {
            $scope.selectedUtilityFunction = $scope.ufLoaded[uf.id];
        }
    }
    
    $scope.changePublicity = function() {
        console.log("Not implemented: Change publicity");
    }
    
    $scope.deleteUtilityFunction = function(id) {
        //Need to remove uf from $scope.ufListAll, $scope.ufListToShow, ufListPublicIndices.
        for (var i in $scope.ufListAll) {
            if (id == $scope.ufListAll[i].id) {
                $scope.ufListAll.splice(i, 1);
                ufListPublicIndices.splice(i, 1);
            }
        }
        $scope.ufListUpdate();
        
        console.log("'Deleting' utility function " + id);
        
        //dataGraftApi.utilityFunctionDelete(id);
        //console.log("Not implemented: Delete utility function with id " + id + "\n" + $scope.ufLoaded[id].configuration.clojure);
    }
    
    $scope.createNewUtilityFunction = function() {
        console.log("Not implemented: Create new utility function");
    }
    
    $scope.createNewTextTransformation = function() {
        console.log("Not implemneted: Create new text transformation");
    }
    
    $scope.cancelUtilityFunctionChanges = function() {
        $mdDialog.cancel();
    }

    $scope.saveChanges = function() {
        console.log("Not implemented: save changes");
    }
    
    $scope.reloadUtilityFunction = function() {
        console.log("Not implemented: Reload utility function for " + $scope.selectedUtilityFunction.name);
    }
    
    $scope.markAsChanged = function() {
        $scope.ufLoaded[$scope.selectedUtilityFunction.id].changed = true;
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
    
    //$scope.utilityFunctionsObj = metadata;
    var id = "1";
    $scope.testText = "Currently nothing is tested";
    
    $scope.testMetadata = function(md) {
        dataGraftApi.transformationCreateMetadata(id, metadata[md]).success(function(data) {
               $scope.testText = JSON.stringify(data, null, 2);
        });
    }
   
    
    
  });
