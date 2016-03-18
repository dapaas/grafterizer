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
    
    // settings for the code text field
    $scope.codemirrorOpts = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'clojure',
      theme: 'monokai',
      readOnly: 'nocursor'
    };
    // Fix to properly align line numbers:
    window.setTimeout(function() {
      _.each(document.getElementsByClassName('CodeMirror'), function(el) {
        el.CodeMirror.refresh();
      });
    }, 250);
    
    
    
    var _debug_ = false;
    var log = function(a) {
        if (_debug_) {
            console.log(a);
        }
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
            - changed (boolean for if it can be saved or not)
            - showDeleteOptions (boolean for showing the "Sure you want to delete?" option)
            - serverHasClojure (boolean if clojure code exists. Makes a different for POST or PUT changed clojure code)
            - serverHasConfiguration (boolean. Same as above, to prevent us from loosing other kinds of configurations if clojure does not exist)
            - isNew (is this a new utility function or not?)
            - nameIsChanged (do we have to update the name as well when saving changed code?)
            - nameWarning (make a warning to the user about the name being used already)
            
            
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
    var publicField = {'text': "Public"};
    var privateField = {'text': "Private"};
    
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
                $scope.ufAll[id].nameIsChanged = false;
                $scope.ufAll[id].nameWarning = false;
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
            log("Loading utility function " + id);
            dataGraftApi.utilityFunctionGet(id).success( function(data) {
                log("Loaded id " + id + ":\n" + pretty(data));
                
                // Copy each field from data into the correct ufAll
                for (var i in data) {
                    $scope.ufAll[id][i] = data[i];
                }
                
                // Check if configuration field exist
                $scope.ufAll[id].serverHasConfiguration = true;
                if( typeof($scope.ufAll[id].configuration) === 'undefinied' || $scope.ufAll[id].configuration === null) {
                    $scope.ufAll[id].serverHasConfiguration = false;
                    $scope.ufAll[id].configuration = {};
                }
                // Check if clojure code exists
                $scope.ufAll[id].serverHasClojure = true;
                if (typeof($scope.ufAll[id].configuration.code) === 'undefined' || $scope.ufAll[id].configuration.code === null) {
                    $scope.ufAll[id].serverHasClojure = false;
                    $scope.ufAll[id].configuration.code = "// No clojure code yet...";
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
                    log("changed publicity");
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
                log("Deleted UF " + id + " successfully");
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
        patch.code = $scope.ufAll[id].configuration.code;
        log("Patch from code field:\n" + pretty(patch));
        if (!$scope.ufAll[id].serverHasConfiguration) {
            log("Creating configuration with clojure for " + id);
            dataGraftApi.utilityFunctionCreateConfiguration(id, patch)
                .success( function(data) {
                    $scope.ufAll[id].changed = false;
                    $scope.ufAll[id].serverHasConfiguration = true;
                    $scope.ufAll[id].serverHasClojure = true;
                    logServerUtilityFunction(id);
                    updateNameServerSide(id);
            });
        } else if (!$scope.ufAll[id].serverHasClojure) {
            log("Creating configuration code key for " + id);
            dataGraftApi.utilityFunctionCreateConfigurationByKey(id, "code", patch.code)
                .success( function(data) {
                    $scope.ufAll[id].changed = false;
                    $scope.ufAll[id].serverHasClojure = true;
                    logServerUtilityFunction(id);
                    updateNameServerSide(id);
            });
        } else {
            log("Updating clojure for " + id);
            dataGraftApi.utilityFunctionUpdateConfigurationByKey(id, "code", $scope.ufAll[id].configuration.code)
                .success( function(data) {
                    $scope.ufAll[id].changed = false;
                    log("Response from save changes: " + pretty(data));
                    logServerUtilityFunction(id);
                    updateNameServerSide(id);
                });
        }
    }
    
    var updateNameServerSide = function(id) {
        if ($scope.ufAll[id].nameIsChanged) {
            var patchedUF = {};
            patchedUF.name = $scope.ufAll[id].name;
            log("Should update name to be: " + pretty(patchedUF));
            dataGraftApi.utilityFunctionPatch(id, patchedUF).success(
                function(data) {
                    log("Name updated with response: " + pretty(data));
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
        newUF.configuration.code = $scope.ufAll[id].configuration.code;
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
            log("Server version of " + id + ":\n" + pretty(data));
        });

    }
    
    $scope.reloadUtilityFunction = function(id) {
        log("Resetting: " + id);
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
        newUF.configuration.code = "// Please write your clojure code here";
        
        var id = generateNewUFid();
        $scope.ufAll[id] = newUF;
        
        $scope.setSelectedUF(id);
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
        log("Not implemneted: Create new text transformation");
    }
    

    $scope.cancelUtilityFunctionChanges = function() {
        $mdDialog.cancel();
    }
    
    // clojure.substr(clojure.indexOf("(defn ") + 6, clojure.substr(clojure.indexOf("(defn ") + 6).indexOf(" "))

    
    var functionName = /\(defn?\s+([^\s\)]+)/i;
    
    // $Watch gives a list of variables that should have more complex update behaviour when they are modified.
    $scope.$watch('ufAll[selectedUF].configuration.code', function() {
        var id = $scope.selectedUF; 
        
        if (!id) return;
        
        var code = $scope.ufAll[id].configuration.code;
        if (!code) return;
        
        var m = code.match(functionName);
        if (m) {
            var name = m[1];
            if ($scope.ufAll[id].name == name) return;
            
            $scope.ufAll[id].name = name;
            $scope.ufAll[id].nameIsChanged = true;
            $scope.ufAll[id].changed = true;
            
            var conflict = false;
            for (var i in $scope.ufAll) {
                if (($scope.ufAll[i].name == name) && (i != id)) {
                    conflict = true;
                }
            }
            $scope.ufAll[id].nameWarning = conflict;
            
        }
    });
    
    // We need to have selected a UF in order to modify the code
    $scope.$watch('selectedUF', function() {
        var undef = (typeof $scope.selectedUF === 'undefined');
        var nocursor = ($scope.codemirrorOpts.readOnly == 'nocursor');
        
        if (undef && !nocursor) {
            $scope.codemirrorOpts.readOnly = 'nocursor';
        }
        else if (!undef && nocursor) {
            $scope.codemirrorOpts.readOnly = false;
        }
    });
    
    // Need to monitor two more variables... This becomes messy...
    $scope.$watch('switchShowAll', function() {
        if ($scope.selectedUF === undefined) return;
        if ($scope.switchShowAll) return;
        if ($scope.switchShowPublic === $scope.ufAll[$scope.selectedUF].public) return;
        
        $scope.selectedUF = undefined;
    });
    $scope.$watch('switchShowPublic', function() {
        if ($scope.selectedUF === undefined) return;
        if ($scope.switchShowPublic === $scope.ufAll[$scope.selectedUF].public) return;
        
        $scope.selectedUF = undefined;
    });
});
