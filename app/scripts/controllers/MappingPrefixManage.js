'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:MappingPrefixManageCtrl
 * @description
 * # MappingPrefixManageCtrl
 * Controller of the grafterizerApp
 */

angular.module('grafterizerApp').controller('MappingPrefixManageCtrl', function(
  $scope,
  $rootScope,
  $http,
  $mdDialog,
  $log,
  $mdSidenav,
  $mdUtil,
  leObject) {

  var connection = leObject.serveraddress;
  var object = leObject.object;

  $scope.hint = "Add, edit, delete prefixed for mapping";

  $scope.propertyValue = {
    value: ''
  };

  var vocabItemTemplate = {
    name: '',
    namespace: '',
    classes: [],
    properties: [],
    fromServer: false
  };

  var lowercaseTemplate = {
    name: '',
    lowercase:''
  };

  var oriWidth;

  $scope.showManageDialog = false;
  $scope.showAddDialog = false;
  $scope.showProgress = false;

  //vocabulary edit dialog
  $scope.showProgressCircular = false;

  //add vocabulary dialog
  $scope.namespaceInputDisable = false;
  $scope.dragProcess = false;

  $scope.VocabItems = [];

  $scope.closeDialog = function() {
    $mdDialog.cancel();
  };

  //show current saved vocabulary and operations
  function switchToManageDialog() {
    $scope.selection = 'manageDialog';

    if(document.getElementById('abc') != null){
      document.getElementById('abc').style.width = oriWidth;
    }

    //show local vocabulary
    var localVocabulary = $rootScope.transformation.rdfVocabs;

    var VocabList = [];
    $scope.VocabItems = [];
    if (localVocabulary) {
      for (var i = localVocabulary.length - 1; i >= 0; i--) {
        if (localVocabulary[i].fromServer === false) {
          VocabList.push(localVocabulary[i]);
        }
      }
    }

    $scope.VocabItems = VocabList;
    $scope.showProgressCircular = true;

    //show server vocabulary
    $http.get(
      connection + 'getAll'
    ).success(
      function(response) {
        for (var i = response.result.length - 1; i >= 0; i--) {
          vocabItemTemplate = {};
          vocabItemTemplate.name = response.result[i].name;
          vocabItemTemplate.namespace = response.result[i].namespace;
          vocabItemTemplate.fromServer = true;

          $scope.VocabItems.push(vocabItemTemplate);

          if ($scope.VocabItems.length > $scope.vocabpageSize) {
            $scope.showVocabularyPagination = true;
          } else {
            $scope.showVocabularyPagination = false;
          }
        }

        $scope.showProgressCircular = false;
      }).error(function(data, status, headers, config) {
        Raven.captureMessage('error /api/vocabulary/getAll', {tags: {
          file: 'MappingPrefixManage',
          method: 'switchToManageDialog'
        }});
        $scope.showProgressCircular = false;
      });

    $scope.showManageDialog = true;
    $scope.showAddDialog = false;
  }

  $scope.switchToManageDialogScope = function() {
    switchToManageDialog();
  };

  switchToManageDialog();

  $scope.switchToAddDialog = function(name, namespace, fromServer) {
    $http.get("http://api.datagraft.net:8080/dapaas-services/userid").success(
      function(response) {


      }).error(function(data, status, headers, config) {
        });

    if (fromServer === true) {
      return;
    }
    oriWidth = document.getElementById('abc').style.width;
    document.getElementById('abc').style.width = '350px';

    $scope.selection = 'addVocabDialog';

    $scope.showManageDialog = false;
    $scope.showAddDialog = true;

    $scope.vocabName = null;
    $scope.vocabNamespace = null;

    $scope.localPath = false;
    $scope.remotePath = false;

    // if namespace is not null, then we are editing vocabulary,
    if (name !== null && name !== undefined) {
      $scope.vocabName = name;
    }

    if (namespace !== null && namespace !== undefined && namespace !== '') {
      $scope.vocabNamespace = namespace;
      $scope.namespaceInputDisable = true;
      $scope.addorEdit = 'Edit';
    } else {
      $scope.namespaceInputDisable = false;
      $scope.addorEdit = 'Add';
    }
  };

  $scope.vocabClassArray = [];
  $scope.vocabPropertyArray = [];

  $scope.viewItem = function(name, namespace) {

      $mdSidenav("vocabdetail")
        .toggle()
        .then(function () {
      });

      //show classes and properties in a vocabulary
      $http.post(
        connection + 'getClassAndProperty',
        {
          name: name,
          namespace: namespace
        }).success(function(response) {
          $scope.vocabClassArray = [];
          $scope.vocabPropertyArray = [];
          var i;
          for (i = response.classResult.length - 1; i >= 0; i--) {
            $scope.vocabClassArray.push(response.classResult[i].value);
          }

          for (i = response.propertyResult.length - 1; i >= 0; i--) {
            $scope.vocabPropertyArray.push(response.propertyResult[i].value);
          }
        }).error(function(data, status, headers, config) {

        });
  }

  //delete local vocabulary
  $scope.deleteItem = function(vocabNamespace) {
      // Appending dialog to document.body to cover sidenav in docs app
      /*var confirm = $mdDialog.confirm()
        .title('Delete')
        .content('Do you want to delete prefix?')
        .ariaLabel('Lucky day')
        .ok('OK')
        .cancel('Cancel');
      */
    /*
      $mdDialog.show(confirm).then(function() {
      */
        //delete from local storage
        var localVocabulary = $scope.$parent.transformation.rdfVocabs;
        for (var i = localVocabulary.length - 1; i >= 0; i--) {
          if( localVocabulary[i].namespace === vocabNamespace ){
            localVocabulary.splice(i, 1);
          }
        }

        for (var i = $scope.VocabItems.length - 1; i >= 0; i--) {
          if ($scope.VocabItems[i].namespace === vocabNamespace){
            $scope.VocabItems.splice(i, 1);
          }
        }
    /*
      }, function() {
      });
      */
  };

  //editing vocabulary
  $scope.editItem = function(name, namespace, fromServer) {
    $scope.switchToAddDialog(name, namespace, fromServer);
  };

  //delete vocabulary from server
  $scope.deleteItemFromServer = function(name, vocabNamespace) {

    // TODO this code doesn't work
    // we need to fix it

    /*$http.post(
      connection + 'delete/',
      {name: name, namespace: vocabNamespace}).success(function(response) {
        if (response.status === 200) {
          for (var i = VocabularCollection.length - 1; i >= 0; i--) {
            if (VocabularCollection[i].name === name) {
              VocabularCollection.splice(i, 1);
            }
          }
        }
      }).error(function(data, status, headers, config) {
        // TODO
        alert('error');
      });*/
  };

  //add vocabulary to local
  $scope.addVocabtoLocal = function(vocabName, vocabNamespace, vocabLoc) {
    if (vocabName === '' || vocabNamespace === '') {
      return;
    }

    // if only specify prefix and namespace, just add vocabulary name to local storage.
    if (vocabLoc === undefined && !object.data) {
      var localVocabulary = $rootScope.transformation.rdfVocabs;

      if ($scope.namespaceInputDisable === true) {
        for (var i = localVocabulary.length - 1; i >= 0; i--) {
          if (localVocabulary[i].namespace === vocabNamespace) {
            localVocabulary[i].name = vocabName;
          }
        }
      } else {
        vocabItemTemplate = {};

        vocabItemTemplate.name = vocabName;
        vocabItemTemplate.namespace = vocabNamespace;
        vocabItemTemplate.fromServer = false;

        localVocabulary.push(vocabItemTemplate);
      }

      switchToManageDialog();

      return;
    }

    var isLocalfile = false;

    if (vocabLoc === undefined || vocabLoc === '') {
      vocabLoc = object.filename;
      isLocalfile = true;
    }

    $scope.showProgress = true;
    $http.post(
      connection + 'getClassAndPropertyFromVocabulary',
      {
        name: vocabName,
        namespace: vocabNamespace,
        path: vocabLoc,
        data: object.data,
        islocal: isLocalfile
      }).success(function(response) {
        //add vocabulary name, a list of classes, a list of properties in local storage
        var localVocabulary = $rootScope.transformation.rdfVocabs;

        var classArray = [];
        var propertyArray = [];

        var i;

        for (i = response.classResult.length - 1; i >= 0; i--) {
          //lower case is easier for search
          lowercaseTemplate = {};
          lowercaseTemplate.name = response.classResult[i].value;
          lowercaseTemplate.lowername = response.classResult[i].value.toLowerCase();
          classArray.push(lowercaseTemplate);
        }

        for (i = response.propertyResult.length - 1; i >= 0; i--) {
          lowercaseTemplate = {};
          lowercaseTemplate.name = response.propertyResult[i].value;
          lowercaseTemplate.lowername = response.propertyResult[i].value.toLowerCase();
          propertyArray.push(lowercaseTemplate);
        }

        vocabItemTemplate = {};

        if ($scope.namespaceInputDisable === true) {
          //editing vocabulary
          for (i = localVocabulary.length - 1; i >= 0; i--) {
            if (localVocabulary[i].namespace === vocabNamespace) {
              localVocabulary[i].name = vocabName;
              localVocabulary[i].classes = classArray;
              localVocabulary[i].properties = propertyArray;
            }
          }
        } else {
          //adding new vocabulary
          vocabItemTemplate.name = vocabName;
          vocabItemTemplate.namespace = vocabNamespace;
          vocabItemTemplate.classes = classArray;
          vocabItemTemplate.properties = propertyArray;
          vocabItemTemplate.fromServer = false;

          localVocabulary.push(vocabItemTemplate);
        }

        switchToManageDialog();
        $scope.showProgress = false;
      }).error(function(data, status, headers, config) {
        Raven.captureMessage('error api/vocabulary/getClassAndPropertyFromVocabulary', {tags: {
          file: 'MappingPrefixManage',
          method: 'addVocabtoLocal'
        }});
        $scope.showProgress = false;
      });
  };

  // let us choose how to add vocabulary path
  //------------------------------------------
  $scope.choices = [
    "URL",
    "Upload from disk"
  ];

  $scope.localPath = false;
  $scope.remotePath = false;

  $scope.onChange = function(choice) {
    if (choice === "URL"){
      $scope.localPath = false;
      $scope.remotePath = true;
    }
    else if (choice === "Upload from disk") {
      $scope.localPath = true;
      $scope.remotePath = false;
    } else {
      $scope.localPath = false;
      $scope.remotePath = false;
    }
  };

});
