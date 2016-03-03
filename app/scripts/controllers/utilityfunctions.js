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

    
    /* 
        Large required refactoring:
        ufListAll -> ufAll
        Should not be a list, but a dict:
            ufListAll[id] = utility function with that id.
        When loading a uf for the first time, overwriting similar fields.
        Additional fields not stored on the server: 
            - visible (according to public/private/all, shown list is filtered on this variable)
            - isLoaded (if GET on id is already called)
            - public.text (hover text for private/public button)
            - public.icon (name of icon of above button)
            - changed (boolean for if it can be saved or not)
            - showDeleteOptions (boolean for showing the "Sure you want to delete?" option)
            
            
        SelectedUF should then just be the id.
        
        Need two lists with public ids and private ids.
        
        New utility functions should have id "new" + newUfCounter - this is safe as all IDs are numerical. When saved, we should delete this entry, reload the new one and set the new one as selectedUF.
        
        Should really have some unit tests before doing this refactoring... :P
    */
    
    // New variables
    $scope.ufAll = {};
    $scope.publicUFs = [];
    $scope.privateUFs = [];
    
    // Old variables - should be deprecated
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
        //$scope.ufListAllStr =  JSON.stringify($scope.ufListAll, null, 4);
        //$scope.ufListPrivateStr = stringifyUfList(false);
        //$scope.ufListPublicStr = stringifyUfList(true);
    }    
    // ---- Just for simple testing - end ----    
    
    
    $scope.listUtilityFunctions = function() {
        $scope.ufListAll = [];
        ufListPublicIndices = [];
        updateUfStrs();
        dataGraftApi.utilityFunctionsList(true).success( function(data) {
            $scope.ufListAll = data;
            updateUfStrs();
            for (var i in data) {
                $scope.ufAll[data[i].id] = data[i];
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
        console.log("Selecting utility function: " + JSON.stringify(uf, null, 2));
        setSelectedUtilityFunctionById(uf.id);
    }
    var setSelectedUtilityFunctionById = function(id) {
        if (typeof $scope.ufLoaded[id] === "undefined") {
            dataGraftApi.utilityFunctionGet(id).success( function(data) {
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
                $scope.selectedUtilityFunction.showDeleteOption = false;
                $scope.ufLoaded[id] = $scope.selectedUtilityFunction;
            });
        } else {
            $scope.selectedUtilityFunction = $scope.ufLoaded[id];
        }
    }
    
    $scope.changePublicity = function() {
        var patchUF = {};
        patchUF.public = !$scope.selectedUtilityFunction.public;
        dataGraftApi.utilityFunctionPatch($scope.selectedUtilityFunction.id, patchUF)
            .success(function (data) {
                console.log("changed publicity");
                // Using the response data to update local variables
                $scope.selectedUtilityFunction[id] = data;
                for (var i in $scope.ufListAll) {
                    if ($scope.ufListAll[i].id == data.id) {
                        console.log("Response from patch publicity\n" + JSON.stringify(data[i]));
                        $scope.ufListAll[i].public = data.public;
                        $scope.ufListAll[i].publicText = data.public ? "Public" : "Private";
                        $scope.ufListAll[i].publicIcon = data.public ? "people" : "person";
                        ufListPublicIndices[i] = !ufListPublicIndices[i];
                    }
                }
                $scope.reloadUtilityFunction();
                $scope.ufListUpdate();
        });
    }
    
    $scope.showDelete = function() {
        $scope.selectedUtilityFunction.showDeleteOption = true;
    }
    $scope.abortDelete = function() {
        $scope.selectedUtilityFunction.showDeleteOption = false;
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
        dataGraftApi.utilityFunctionDelete(id);
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
        var patchUF = {};
        //patchUF.configuration = "{'clojure': '" + $scope.selectedUtilityFunction.configuration.clojure + "'}";
        patchUF.configuration.clojure = $scope.selectedUtilityFunction.configuration.clojure;
        dataGraftApi.utilityFunctionPatch($scope.selectedUtilityFunction.id, patchUF)
            .success( function(data) {
            $scope.selectedUtilityFunction.changed = false;
            console.log("Response from save changes: " + JSON.stringify(data));
        });
    }
    
    $scope.reloadUtilityFunction = function() {
        
        delete $scope.ufLoaded[$scope.selectedUtilityFunction.id];
        setSelectedUtilityFunctionById($scope.selectedUtilityFunction.id);
        
        console.log("Resetting: " + $scope.selectedUtilityFunction.name);
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


    // ---------- Testing transformations with metadata ---------
    
    var metadata = ['{"weather": "sunny", "smurning": "vr40", "good": "oyeah"}',
                    '{"metadata": "yeah"}',
                    '{"metadata": "yeah", "snow": "some"}'];
    
    //$scope.utilityFunctionsObj = metadata;
    var id = "testah";
    $scope.testText = "Currently nothing is tested";
    $scope.getMetaData = function() {
        dataGraftApi.transformationGetMetadata(id).success(function(data) {
            $scope.testText = JSON.stringify(data, null, 2);
        });
    }
    $scope.getMetaData();
    
    $scope.testMetadata = function(md) {
        dataGraftApi.transformationCreateMetadata(id, metadata[md]).success(function(data) {
                $scope.testText = JSON.stringify(data, null, 2);
                dataGraftApi.transformationGetMetadata(id).success(function(data) {
                    $scope.testText = JSON.stringify(data, null, 2);
                });
        });
    }
    
    $scope.metadataKey;
    $scope.metadataValue;
    $scope.updateMetaData = function() {
        dataGraftApi.transformationUpdateMetadataByKey(id, $scope.metadataKey, $scope.metadataValue).success(function(data) {
            console.log(data);
            $scope.getMetaData();
        });
    }
    $scope.createMetaData = function() {
        dataGraftApi.transformationCreateMetadataByKey(id, $scope.metadataKey, $scope.metadataValue).success( function(data) {
            console.log(data);
            $scope.getMetaData();
        });
    }
    $scope.deleteMetaData = function() {
        dataGraftApi.transformationDeleteMetadataByKey(id, $scope.metadataKey).success( function(data) {
            console.log(data);
            $scope.getMetaData();
        });
    }
   
    // ---------- TESTING CONFIGURATION ---------
    
    var configuration = ['{"weather": "sunny", "smurning": "vr40", "good": "oyeah"}',
                    '{"configuration": "yeah"}',
                    '{"configuration": "yeah", "snow": "some"}'];
    $scope.cftestText = "Currently nothing is tested";
    $scope.getConfiguration = function() {
        dataGraftApi.transformationGetConfiguration(id).success(function(data) {
            $scope.cftestText = JSON.stringify(data, null, 2);
        });
    }
    $scope.getConfiguration();
    
    $scope.testConfiguration = function(conf) {
        dataGraftApi.transformationCreateConfiguration(id, configuration[conf]).success(function(data) {
                console.log(JSON.stringify(data, null, 2));
                $scope.getConfiguration();
        });
    }
    
    $scope.configKey;
    $scope.configValue;
    $scope.updateConfig = function() {
        dataGraftApi.transformationUpdateConfigurationByKey(id, $scope.configKey, $scope.configValue).success(function(data) {
            console.log(data);
            $scope.getConfiguration();
        });
    }
    $scope.createConfig = function() {
        dataGraftApi.transformationCreateConfigurationByKey(id, $scope.configKey, $scope.configValue).success( function(data) {
            console.log(data);
            $scope.getConfiguration();
        });
    }
    $scope.deleteConfig = function() {
        dataGraftApi.transformationDeleteConfigurationByKey(id, $scope.configKey).success( function(data) {
            console.log(data);
            $scope.getConfiguration();
        });
    }
    
    // ---------- TESTING UTILITY FUNCTION CONFIGURATION ----
            
    var uf = "26";
    var configuration = ['{"weather": "sunny", "smurning": "vr40", "good": "oyeah"}',
                    '{"configuration": "yeah"}',
                    '{"configuration": "yeah", "snow": "some"}'];
    $scope.ufcftestText = "Currently nothing is tested";
    $scope.getUFConfiguration = function() {
        dataGraftApi.utilityFunctionGetConfiguration(uf).success(function(data) {
            $scope.ufcftestText = JSON.stringify(data, null, 2);
        });
    }
    $scope.getUFConfiguration();
    
    $scope.testUFConfiguration = function(conf) {
        dataGraftApi.utilityFunctionCreateConfiguration(uf, configuration[conf]).success(function(data) {
                console.log(JSON.stringify(data, null, 2));
                $scope.getUFConfiguration();
        });
    }
    
    $scope.UFconfigKey;
    $scope.UFconfigValue;
    $scope.updateUFConfig = function() {
        dataGraftApi.utilityFunctionUpdateConfigurationByKey(uf, $scope.UFconfigKey, $scope.UFconfigValue).success(function(data) {
            console.log(data);
            $scope.getUFConfiguration();
        });
    }
    $scope.createUFConfig = function() {
        dataGraftApi.utilityFunctionCreateConfigurationByKey(uf, $scope.UFconfigKey, $scope.UFconfigValue).success( function(data) {
            console.log(data);
            $scope.getUFConfiguration();
        });
    }
    $scope.deleteUFConfig = function() {
        dataGraftApi.utilityFunctionDeleteConfigurationByKey(uf, $scope.UFconfigKey).success( function(data) {
            console.log(data);
            $scope.getUFConfiguration();
        });
    }
    
});
