'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PropertydialogCtrl
 * @description
 * # PropertydialogCtrl
 * Controller of the grafterizerApp
 */

angular.module('grafterizerApp').controller('PropertydialogCtrl', function ($scope,
                                                                            $rootScope,
                                                                            $http,
                                                                            $mdDialog,
                                                                            $log,
                                                                            transformationDataModel,
                                                                            leObject) {

  var storage = leObject.storage;
  var connection = leObject.serveraddress;
  var object = leObject.object;

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
    lowercase: ''
  }

  $scope.showSearchDialog = true;
  $scope.showManageDialog = false;
  $scope.showAddDialog = false;
  $scope.showProgress = false;

  //search dialog
  $scope.showSearchResult = false;
  $scope.showSearchEmptyResult = false;

  //vocabulary edit dialog
  $scope.showProgressCircular = false;

  //add vocabulary dialog
  $scope.showSearchPagination = false;
  $scope.showVocabularyPagination = false;
  $scope.namespaceInputDisable = false;
  $scope.dragProcess = false;

  $scope.VocabItems = [];

  if (!$scope.property) {
    $scope.property = new transformationDataModel.Property('', '', []);
  } else {
    $scope.propertyValue.value = $scope.property.prefix + ':' + $scope.property.propertyName;
  }

  $scope.addProperty = function () {
    // TODO add support for absolute URIs
    /*var patt = new RegExp("(http://|https://|ftp://|smb://)[^ :]+");
     var res = patt.test($scope.propertyValue.value);

     if(res){
     var trimmedPropertyValue = $scope.propertyValue.value.trim();
     var lastSlashIndex = trimmedPropertyValue.lastIndexOf("/");
     var propertyValueLength = trimmedPropertyValue.length;
     $scope.property.prefix = trimmedPropertyValue.substring(0, lastSlashIndex);

     while (lastSlashIndex == propertyValueLength) {
     // we have a prefix ending in a slash: http://[prefix/][value/]
     trimmedPropertyValue = trimmedPropertyValue.substring(0, propertyValueLength - 1);
     lastSlashIndex = trimmedPropertyValue.lastIndexOf("/");
     if(!patt.test($scope.propertyValue.value)){
     return;
     }
     // http://www.example.com
     }

     $scope.property.value = $scope.propertyValue.value.trim().substring(lastSlashIndex + 1, $scope.propertyValue.value.length);
     // what to do??

     } else { */

    if ($scope.propertyValue.value.indexOf(':') >= 0) {
      $scope.property.prefix = $scope.propertyValue.value.substring(0, $scope.propertyValue.value.indexOf(':'));
      $scope.property.propertyName = $scope.propertyValue.value.substring($scope.propertyValue.value.indexOf(':') +
        1, $scope.propertyValue.value.length);
    }
    else {
      $scope.property.propertyName = $scope.propertyValue.value;
      $scope.property.prefix = "";
    }
    //    }


    $mdDialog.hide($scope.property);
  };

  $scope.closeDialog = function () {
    $mdDialog.cancel();
  };

  $scope.currentPage = 0;
  $scope.pageSize = 5;
  $scope.items = [];
  $scope.numberOfPages = function () {
    return Math.ceil($scope.items.length / $scope.pageSize);
  };

  $scope.vocabcurrentPage = 0;
  $scope.vocabpageSize = 5;
  $scope.vocabnumberOfPages = function () {
    return Math.ceil($scope.VocabItems.length / $scope.vocabpageSize);
  };

  $scope.search = function (Para) {
    if (Para === undefined) {
      return;
    }

    $scope.showProgress = true;
    $scope.items = [];
    //get search result from server
    $http.get(
      connection + 'search/' +
      Para).success(
      function (response) {
        for (var i = response.propertyResult.length - 1; i >= 0; i--) {
          $scope.items.push(response.propertyResult[i].value);
        }
        if ($scope.items.length > $scope.pageSize) {
          $scope.showSearchPagination = true;
        }
        else {
          $scope.showSearchPagination = false;
        }

        if ($scope.items.length > 0) {
          $scope.showSearchResult = true;
          $scope.showSearchEmptyResult = false;
        }
        else {
          $scope.showSearchResult = false;
          $scope.showSearchEmptyResult = true;
        }

        $scope.showProgress = false;
      }).error(function (data, status, headers, config) {
        console.log('error api/vocabulary/search');
        $scope.showProgress = false;
      });

    //get search result from local
    var localVocabulary = $rootScope.transformation.rdfVocabs;

    for (var i = localVocabulary.length - 1; i >= 0; i--) {

      var propertyList = localVocabulary[i].properties;
      if (propertyList != null) {
        for (var item = propertyList.length - 1; item >= 0; item--) {
          if (propertyList[item].lowername.indexOf(Para.toLowerCase()) != -1) {
            $scope.items.push(propertyList[item].name);
          }
        }
      }
    }

    $scope.currentPage = 0;
  };

  //show current saved vocabulary and operations
  $scope.switchToManageDialog = function () {
    $scope.selection = 'manageDialog';

    //show local vocabulary
    var localVocabulary = $rootScope.transformation.rdfVocabs;

    var VocabList = [];
    if (localVocabulary != null) {
      for (var i = localVocabulary.length - 1; i >= 0; i--) {
        VocabList.push(localVocabulary[i]);
      }
    }

    $scope.VocabItems = VocabList;
    $scope.showProgressCircular = true;

    //show server vocabulary
    $http.get(
      connection + 'getAll'
    ).success(
      function (response) {
        for (var i = response.result.length - 1; i >= 0; i--) {
          vocabItemTemplate = new Object();
          vocabItemTemplate.name = response.result[i].name;
          vocabItemTemplate.namespace = response.result[i].namespace;
          vocabItemTemplate.fromServer = true;

          $scope.VocabItems.push(vocabItemTemplate);

          if ($scope.VocabItems.length > $scope.pageSize) {
            $scope.showVocabularyPagination = true;
          }
          else {
            $scope.showVocabularyPagination = false;
          }
        }
        $scope.showProgressCircular = false;
      }).error(function (data, status, headers, config) {
        console.log('error /api/vocabulary/getAll');
        $scope.showProgressCircular = false;
      });

    $scope.showManageDialog = true;
    $scope.showSearchDialog = false;
    $scope.showAddDialog = false;
  };

  $scope.switchToSearchDialog = function () {
    $scope.selection = 'searchDialog';
    $scope.showManageDialog = false;
    $scope.showSearchDialog = true;
    $scope.showAddDialog = false;

  };

  $scope.switchToAddDialog = function (name, namespace) {
    $scope.selection = 'addVocabDialog';

    $scope.showManageDialog = false;
    $scope.showSearchDialog = false;
    $scope.showAddDialog = true;

    $scope.vocabName = null;
    $scope.vocabNamespace = null;

    $scope.localPath = false;
    $scope.remotePath = false;

    // if namespace is not null, then we are editing vocabulary,
    if (name != undefined) {
      $scope.vocabName = name;
    }

    if (namespace != undefined && namespace != "") {
      $scope.vocabNamespace = namespace;
      $scope.namespaceInputDisable = true;
      $scope.addorEdit = "Edit";
    }
    else {
      $scope.namespaceInputDisable = false;
      $scope.addorEdit = "Add";
    }
  };

  //delete local vocabulary
  $scope.deleteItem = function (vocabNamespace) {
    //delete from local storage
    var localVocabulary = $rootScope.transformation.rdfVocabs;
    for (var i = localVocabulary.length - 1; i >= 0; i--) {
      if (localVocabulary[i].namespace === vocabNamespace) {
        localVocabulary.splice(i, 1);
      }
    }

    for (var i = $scope.VocabItems.length - 1; i >= 0; i--) {
      if ($scope.VocabItems[i].namespace === vocabNamespace) {
        $scope.VocabItems.splice(i, 1);
      }
    }
  };

  //editing vocabulary
  $scope.editItem = function (name, namespace) {
    $scope.switchToAddDialog(name, namespace);
  };

  //delete vocabulary from server
  $scope.deleteItemFromServer = function (name, vocabNamespace) {

    $http.post(
      connection + 'delete/',
      {name: name, namespace: vocabNamespace}).success(function (response) {
        if (response.http_code == '200') {
          for (var i = VocabularCollection.length - 1; i >= 0; i--) {
            if (VocabularCollection[i].name === name) {
              VocabularCollection.splice(i, 1);
            }
          }
          //$scope.manageTableParams.reload();
        }
      }).error(function (data, status, headers, config) {
        alert('error');
      });
  }

  //add vocabulary to server
  $scope.addVocabtoServer = function (vocabName, vocabNamespace, vocabLoc) {
    $http.post(
      connection + 'add'
      , {
        name: vocabName,
        namespace: vocabNamespace,
        path: vocabLoc,
        data: object.data
      }).success(function (response) {
        $scope.switchToManageDialog();
      }).error(function (data, status, headers, config) {
        console.log('error', data);
      });
  };

  //add vocabulary to local
  $scope.addVocabtoLocal = function (vocabName, vocabNamespace, vocabLoc) {
    if (vocabName === "" || vocabNamespace === "") {
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
      }
      else {
        vocabItemTemplate = new Object();

        vocabItemTemplate.name = vocabName;
        vocabItemTemplate.namespace = vocabNamespace;
        vocabItemTemplate.fromServer = false;

        localVocabulary.push(vocabItemTemplate);
      }

      $scope.switchToManageDialog();

      return;
    }

    var isLocalfile = false;

    if (vocabLoc === undefined || vocabLoc === "") {
      vocabLoc = object.filename;
      isLocalfile = true;
    }

    $scope.showProgress = true;
    $http.post(
      connection + 'getClassAndPropertyFromVocabulary'
      , {
        name: vocabName,
        namespace: vocabNamespace,
        path: vocabLoc,
        data: object.data,
        islocal: isLocalfile
      }).success(function (response) {
        //add vocabulary name, a list of classes, a list of properties in local storage
        var localVocabulary = $rootScope.transformation.rdfVocabs;

        var classArray = [];
        var propertyArray = [];

        //var classArrayforClojureCode = [];
        //var propertyArrayforClojureCode = [];

        for (var i = response.classResult.length - 1; i >= 0; i--) {
          //lower case is easier for search
          lowercaseTemplate = new Object();
          lowercaseTemplate.name = response.classResult[i].value;
          lowercaseTemplate.lowername = response.classResult[i].value.toLowerCase();
          classArray.push(lowercaseTemplate);
          //classArrayforClojureCode.push(response.classResult[i].value);
          //console.log(response.classResult[i].value);
        }
        for (var i = response.propertyResult.length - 1; i >= 0; i--) {
          lowercaseTemplate = new Object();
          lowercaseTemplate.name = response.propertyResult[i].value;
          lowercaseTemplate.lowername = response.propertyResult[i].value.toLowerCase();
          propertyArray.push(lowercaseTemplate);
          //propertyArrayforClojureCode.push(response.propertyResult[i].value);
          //console.log(response.propertyResult[i].value);
        }
        console.log("class number: " + response.classResult.length);
        console.log("property number: " + response.propertyResult.length);

        vocabItemTemplate = new Object();

        if ($scope.namespaceInputDisable === true) {
          //editing vocabulary
          for (var i = localVocabulary.length - 1; i >= 0; i--) {
            if (localVocabulary[i].namespace === vocabNamespace) {
              localVocabulary[i].name = vocabName;
              localVocabulary[i].classes = classArray;
              localVocabulary[i].properties = propertyArray;
            }
          }
        }
        else {
          //adding new vocabulary
          vocabItemTemplate.name = vocabName;
          vocabItemTemplate.namespace = vocabNamespace;
          vocabItemTemplate.classes = classArray;
          vocabItemTemplate.properties = propertyArray;
          vocabItemTemplate.fromServer = false;

          localVocabulary.push(vocabItemTemplate);
        }

        $scope.switchToManageDialog();
        $scope.showProgress = false;
      }).error(function (data, status, headers, config) {
        console.log('error api/vocabulary/getClassAndPropertyFromVocabulary');
        $scope.showProgress = false;
      });
  };

  $scope.addResult = function (value) {
    $scope.propertyValue.value = value;
  };

  $scope.noOperation = function () {

  }

  // let us choose how to add vocabulary path
  //------------------------------------------
  $scope.choices = [
    "Add vocabulary path by url",
    "Add local vocabulary",
    "Add vocabulary later"
  ];

  $scope.localPath = false;
  $scope.remotePath = false;

  $scope.onChange = function (choice) {
    if (choice === "Add vocabulary path by url") {
      $scope.localPath = false;
      $scope.remotePath = true;
    }
    else if (choice === "Add local vocabulary") {
      $scope.localPath = true;
      $scope.remotePath = false;
    } else {
      $scope.localPath = false;
      $scope.remotePath = false;
    }
  };
  //-----------------------------------------

});
