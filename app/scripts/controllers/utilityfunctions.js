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
    var log = function(a) {
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
            - publicInfo.text (hover text for private/public button)
            - publicInfo.icon (name of icon of above button)
            - changed (boolean for if it can be saved or not)
            - showDeleteOptions (boolean for showing the "Sure you want to delete?" option)
            - serverHasClojure (boolean if clojure code exists. Makes a different for POST or PUT changed clojure code)
            - isNew (is this a new utility function or not?)
            
            
        selectedUF should then just be the id.
        
        Need two lists with public ids and private ids.
        
        New utility functions should have id "new" + newUfCounter - this is safe as all IDs are numerical. When saved, we should delete this entry, reload the new one and set the new one as selectedUF. The new id (and updating counter) is done by generateNewUFid();
        
        Should really have some unit tests before doing this refactoring... :P
    */
    
    // New variables
    $scope.ufAll = {};
    
    $scope.selectedUF = undefined;
    var newUFCounter = 0;
    var generateNewUFid = function() {
        var newID = "new" + newUFCounter;
        newUFCounter = newUFCounter + 1;
        return newID;
    }
    
    // public and private objects
    var publicField = {'text': "Public", 'icon': "people"};
    var privateField = {'text': "Private", 'icon': "person"};
    
    // Load the list of utility functions
    // This should only be done when loading the view.
    var loadUFList = function() {
        dataGraftApi.utilityFunctionsList().success( function(data) {
            for (var i in data) {
                var id = data[i].id;
                $scope.ufAll[id] = data[i];
                // Adding local fields:
                $scope.ufAll[id].visible = true;
                $scope.ufAll[id].isLoaded = false;
                $scope.ufAll[id].changed = false;
                $scope.ufAll[id].showDeleteOption = false;
                $scope.ufAll[id].isNew = false;
                $scope.ufAll[id].publicInfo =
                    getPublicInfo(data[i].public);
            }
        });
    }
    loadUFList();
    
    
    $scope.switchShowAll = true; 
    $scope.switchShowPublic = true;
    $scope.switchShowPublicText = "Public only";
    
    $scope.updateUFList = function() {
        if ($scope.switchShowAll) {
            for (var id in $scope.ufAll) {
                $scope.ufAll[id].visible = true;
            }
        } else {
            for (var id in $scope.ufAll) {
                $scope.ufAll[id].visible = ($scope.ufAll[id].public == $scope.switchShowPublic);
            }
        }
    }
    
    // Need to set selectedUF at the end so that we are sure that
    // the clojure code is loaded
    $scope.setSelectedUF = function(id) {
        if (!$scope.ufAll[id].isLoaded) {
            console.log("Loading utility function " + id);
            dataGraftApi.utilityFunctionGet(id).success( function(data) {
                // Copy each field from data into the correct ufAll
                for (var i in data) {
                    $scope.ufAll[id][i] = data[i];
                }
                
                // Check if configuration field exist
                if( typeof($scope.ufAll[id].configuration) === 'undefinied' || $scope.ufAll[id].configuration === null) {
                    $scope.ufAll[id].configuration = {};
                }
                // Check if clojure code exists
                $scope.ufAll[id].serverHasClojure = true;
                if (typeof($scope.ufAll[id].configuration.clojure) === 'undefined' || $scope.ufAll[id].configuration.clojure === null) {
                    $scope.ufAll[id].serverHasClojure = false;
                    $scope.ufAll[id].configuration.clojure = "// No clojure code yet...";
                }
                
                $scope.ufAll[id].isLoaded = true;
                $scope.selectedUF = id;                
            });
        } else {
            $scope.selectedUF = id;
        }
    }
    
    $scope.markAsChanged = function() {
        $scope.ufAll[$scope.selectedUF].changed = true;
    }
    
    $scope.changePublicity = function(id) {
        if ($scope.ufAll[id].isNew) {
            changePublicityLocally(id);
        }
        else {
            var patch = {};
            patch.public = !$scope.ufAll[id].public;
            dataGraftApi.utilityFunctionPatch(id, patch)
                .success(function (data) {
                    console.log("changed publicity");
                    changePublicityLocally(id);
            });
        }
    }
    
    var changePublicityLocally = function(id) {
        $scope.ufAll[id].public = !$scope.ufAll[id].public
        $scope.ufAll[id].publicInfo = getPublicInfo($scope.ufAll[id].public);
        if (!$scope.switchShowAll) {
            // The UF will no longer be listed
            $scope.selectedUF = undefined;
        }
        $scope.updateUFList();
    }
    
        
    $scope.showDelete = function() {
        $scope.ufAll[$scope.selectedUF].showDeleteOption = true;
    }
    $scope.abortDelete = function() {
        $scope.ufAll[$scope.selectedUF].showDeleteOption = false;
    }
    
    // If the user is fast, the user can change selectedUF before
    // the request is successful, and we therefore take id as input
    // to be sure we remove the correct entry.
    $scope.deleteUtilityFunction = function(id) {
        if ($scope.ufAll[id].isNew) {
            deleteUFLocally(id);
        } else {
            dataGraftApi.utilityFunctionDelete(id).success( function(data) {
                console.log("Deleted UF " + id + " successfully");
                deleteUFLocally(id);
            });
        }
    }
    
    var deleteUFLocally = function(id) {
        delete $scope.ufAll[id];
        if ($scope.selectedUF === id) {
            $scope.selectedUF = undefined;
        }
    }
    
    
    $scope.saveChanges = function(id) {
        var patch = {};
        patch.clojure = $scope.ufAll[id].configuration.clojure;
        console.log(pretty(patch));
        if ($scope.ufAll[id].serverHasClojure) {
            console.log("Updating clojure for " + id);
            dataGraftApi.utilityFunctionUpdateConfigurationByKey(id, "clojure", $scope.ufAll[id].configuration.clojure)
                .success( function(data) {
                    $scope.ufAll[id].changed = false;
                    console.log("Response from save changes: " + pretty(data));
                    logServerUtilityFunction(id);
                });
        } else {
            console.log("Creating clojure for " + id);
            dataGraftApi.utilityFunctionCreateConfiguration(id, patch)
                .success( function(data) {
                    $scope.ufAll[id].changed = false;
                    $scope.ufAll[id].serverHasClojure = true;
                    logServerUtilityFunction(id);
                });
        }
    }
    
    // Saving a brand new utility function
    $scope.saveNewUtilityFunction = function(id) {
        // Should we build this object here, or in datagraftapi.js???
        var newUF = {};
        newUF.public = $scope.ufAll[id].public;
        newUF.name = $scope.ufAll[id].name;
        newUF.configuration = {};
        newUF.configuration.clojure = $scope.ufAll[id].configuration.clojure;
        log("creating new utilityFunction from:\n" + pretty(newUF));
        dataGraftApi.utilityFunctionCreate(newUF).success(function(data) {
            log("Creating new UF - response from server:\n" + pretty(data));
            var reloadedUF = $scope.ufAll[id];
            reloadedUF.isNew = false;
            reloadedUF.isLoaded = true;
            reloadedUF.changed = false;
            //reloadedUF.serverHasClojure = true;
            reloadedUF.id = data.id;
            delete $scope.ufAll[id];
            $scope.ufAll[data.id] = reloadedUF;
            $scope.setSelectedUF(data.id);
            
            // Hack fix to store clojure:
            $scope.saveChanges(data.id);
            
        });
        
    }
    
    
    
    
    var logServerUtilityFunction = function(id) {
        dataGraftApi.utilityFunctionGet(id).success( function(data) {
            console.log("Server version of " + id + ":\n" + pretty(data));
        });

    }
    
    $scope.reloadUtilityFunction = function(id) {
        console.log("Resetting: " + id);
        $scope.ufAll[id].isLoaded = false;
        $scope.ufAll[id].changed = false;
        $scope.setSelectedUF(id);
    }
    
    
    $scope.createNewUtilityFunction = function() {
        var newUF = {};
        newUF.isNew = true;
        
        newUF.visible = true;
        newUF.isLoaded = true;
        newUF.public = false;
        newUF.publicInfo = getPublicInfo(newUF.public);
        newUF.changed = true;
        newUF.showDeleteOption = false;
        newUF.serverHasClojure = false;
        newUF.configuration = {};
        newUF.configuration.clojure = "// Please write your clojure code here";
        
        var id = generateNewUFid();
        $scope.ufAll[id] = newUF;
        
        $scope.setSelectedUF(id);
    }
    

    
    
    
    
    $scope.cancelUtilityFunctionChanges = function() {
        $mdDialog.cancel();
    }
    
    
    // --- helpful "private" functions
    var pretty = function(data) {
        return JSON.stringify(data, null, 2);
    }
    
    var getPublicInfo = function(pub) {
        if (typeof(pub) !== 'undefined' && pub) {
            return publicField;
        } else {
            return privateField;
        }
    }
    

    
    
    
    

    
    $scope.createNewTextTransformation = function() {
        console.log("Not implemneted: Create new text transformation");
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
