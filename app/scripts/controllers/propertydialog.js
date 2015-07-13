'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PropertydialogCtrl
 * @description
 * # PropertydialogCtrl
 * Controller of the grafterizerApp
 */

angular.module('grafterizerApp').controller('PropertydialogCtrl', function(
    $scope,
    $http,
    $mdDialog,
    $timeout,
    $log,
    transformationDataModel,
    leObject,
    $rootScope) {

    var object = leObject.object;
    var localVocabulary = leObject.localVocabulary;
    $scope.propertyValue = {
        value: ''
    };

    var vocabItemTemplate = {
        name: '',
        namespace: '',
        classes: [],
        properties: []
    };

    $scope.dragProcess = false;
    $scope.showProgress = false;
    $scope.showManageDialogToolBar = false;
    $scope.showSearchDialogToolBar = true;
    $scope.showAddDialogToolBar = false;

    if (!$scope.property) {
        $scope.property = new transformationDataModel.Property('', '', []);
    } else {
        $scope.propertyValue.value = $scope.property.prefix + ':' + $scope.property.propertyName;
    }

    $scope.addProperty = function() {
        if ($scope.propertyValue.value.indexOf(':') >= 0) {
            $scope.property.prefix = $scope.propertyValue.value.substring(0, $scope.propertyValue.value.indexOf(':'));
            $scope.property.propertyName = $scope.propertyValue.value.substring($scope.propertyValue.value.indexOf(':') +
            1, $scope.propertyValue.value.length);
        }

        $mdDialog.hide($scope.property);
    };

    $scope.closeDialog = function() {
        $mdDialog.cancel();
    };

    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.items = [];
    $scope.numberOfPages = function() {
        return Math.ceil($scope.items.length / $scope.pageSize);
    };

    $scope.search = function(Para) {
        if (Para === undefined) {
            return;
        }

        $scope.showProgress = true;
        $scope.items = [];
        $http.get(
            'http://localhost:8080/ManageVocabulary/api/vocabulary/search/' +
            //'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/search/' +
        Para).success(
        function(response) {

            for( var i = response.propertyResult.length - 1; i >= 0; i-- ) {
                var tmp = response.propertyResult[i];
                var str = tmp.value;
                $scope.items.push(str);
            }

            $scope.showProgress = false;
        }).error(function(data, status, headers, config) {
            console.log('error api/vocabulary/search');
            $scope.showProgress = false;
        });

        localVocabulary = JSON.parse(
        window.sessionStorage.getItem('localVocabulary'));

        for( var i = localVocabulary.length - 1; i >= 0; i-- ) {
            /*var classList = localVocabulary[i].classes;
            for( var item = classList.length - 1; item >= 0; item-- ){
                if( classList[item].indexOf(Para) !== -1 ) {
                    $scope.items.push(classList[item].value);
                }
            }
            */

            var propertyList = localVocabulary[i].properties;
            for( var item = propertyList.length - 1; item >= 0; item-- ){
                if( propertyList[item].indexOf(Para) !== -1 ) {
                    $scope.items.push(propertyList[item]);
                }
            }
        }

        $scope.currentPage = 0;

        $scope.hideValue = true;
    };

    //show current saved vocabulary and operations
    $scope.switchToManageDialog = function() {
        $scope.selection = 'manageDialog';

        localVocabulary = JSON.parse(sessionStorage.getItem('localVocabulary'));

        var VocabList = [];
        for( var i = localVocabulary.length - 1; i >= 0; i-- ) {
            VocabList.push(localVocabulary[i]);
        }
        $scope.VocabItems = VocabList;

        $scope.VocabItemsServer = [];
        $http.get(
            'http://localhost:8080/ManageVocabulary/api/vocabulary/getAll'
            //'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/getAll'
        ).success(
            function(response) {
              vocabItemTemplate = new Object();
              for (var i = response.result.length - 1; i >= 0; i--) {
                  vocabItemTemplate.name = response.result[i].name;
                  vocabItemTemplate.namespace = response.result[i].namespace;
                  $scope.VocabItemsServer.push(vocabItemTemplate);
              }
            }).error(function(data, status, headers, config) {
            console.log('error /api/vocabulary/getAll');
        });

        $scope.showManageDialogToolBar = true;
        $scope.showSearchDialogToolBar = false;
        $scope.showAddDialogToolBar = false;
    };

    $scope.switchToSearchDialog = function() {
        $scope.selection = 'searchDialog';
        $scope.showManageDialogToolBar = false;
        $scope.showSearchDialogToolBar = true;
        $scope.showAddDialogToolBar = false;

    };

    $scope.switchToAddDialog = function(name, namespace) {
        $scope.selection = 'addVocabDialog';
        $scope.showManageDialogToolBar = false;
        $scope.showSearchDialogToolBar = false;
        $scope.showAddDialogToolBar = true;
        $scope.vocabName = null;
        $scope.vocabNamespace = null;
        if (name != undefined){
            $scope.vocabName = name;
        }
        if (namespace != undefined) {
            $scope.vocabNamespace = namespace;
        }
    };

    //delete local vocabulary
    $scope.deleteItem = function(vocabNamespace) {
        localVocabulary = JSON.parse(window.sessionStorage.getItem('localVocabulary'));
        window.sessionStorage.removeItem('localVocabulary');
        for( var i = localVocabulary.length - 1; i >= 0; i-- ) {
            if( localVocabulary[i].namespace === vocabNamespace ){
                localVocabulary.splice(i, 1);
            }
        }

        var VocabList = [];
        for( var i = localVocabulary.length - 1; i >= 0; i-- ) {
            vocabItemTemplate.name = localVocabulary[i].name;
            vocabItemTemplate.namespace = localVocabulary[i].namespace;
            VocabList.push(vocabItemTemplate);
        }
        $scope.VocabItems = VocabList;
    };

    $scope.editItem = function(name, namespace){
        $scope.switchToAddDialog(name, namespace);
    };
/*
    //delete vocabulary from server
    $scope.deleteItem = function(name, vocabNamespace) {

          $http.post('http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/delete/', {name: name, namespace: vocabNamespace}).success(function(response){
          if(response.http_code == '200'){
            for (var i = VocabularCollection.length - 1; i >= 0; i--) {
              if (VocabularCollection[i].name === name) {
                  VocabularCollection.splice(i, 1);
              }
            }
            //$scope.manageTableParams.reload();
          }
      }).error(function(data, status, headers, config) {
        alert('error');
      });
    }
*/
    //add vocabulary to server
    $scope.addVocabtoServer = function(vocabName, vocabNamespace, vocabLoc) {
        $http.post(
          'http://localhost:8080/ManageVocabulary/api/vocabulary/add'
          //'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/add'
          , {
          name: vocabName,
          namespace: vocabNamespace,
          path: vocabLoc
        }).success(function(response) {
          $scope.switchToManageDialog();
        }).error(function(data, status, headers, config) {
          console.log('error', data);
        });
    };

    //add vocabulary to local
    $scope.addVocabtoLocal = function(vocabName, vocabNamespace, vocabLoc) {
        if (vocabName === undefined || vocabNamespace === undefined) {
            return;
        }

        // if path is empty, just add vocabulary name to local storage.
        if (vocabLoc === undefined && !object.data) {
            localVocabulary = JSON.parse(window.sessionStorage.getItem('localVocabulary'));
            var jsonObject = '{"name":"' + vocabName + '","namespace":"'+ vocabNamespace +'","classes":"","properties": ""}';
            localVocabulary.push(jsonObject);
            $rootScope.transformation.rdfVocabs.push(new transformationDataModel.RDFVocabulary(vocabName, vocabNamespace, [], []));

            window.sessionStorage.setItem('localVocabulary', JSON.stringify(localVocabulary));

            $scope.switchToManageDialog();

            return;
        }

        $scope.showProgress = true;
        $http.post(
            'http://localhost:8080/ManageVocabulary/api/vocabulary/getClassAndPropertyFromVocabulary'
            //'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/getClassAndPropertyFromVocabulary'
            , {
                name: vocabName,
                namespace: vocabNamespace,
                path: vocabLoc,
                data: object.data
            }).success(function(response) {
                //add vocabulary name, a list of classes, a list of properties in local storage
                localVocabulary = JSON.parse(window.sessionStorage.getItem('localVocabulary'));

                var classArray = [];
                var propertyArray = [];
                for (var i = response.classResult.length - 1; i >= 0; i--) {
                    classArray.push(response.classResult[i].value);
                }
                for (var i = response.propertyResult.length - 1; i >= 0; i--) {
                    propertyArray.push(response.propertyResult[i].value);
                }

                var localVocabulary = [];

                vocabItemTemplate = new Object();

                vocabItemTemplate.name = vocabName;
                vocabItemTemplate.namespace = vocabNamespace;
                vocabItemTemplate.classes = classArray;
                vocabItemTemplate.properties = propertyArray;

                localVocabulary.push(vocabItemTemplate);

                window.sessionStorage.setItem('localVocabulary', JSON.stringify(localVocabulary));

                $scope.switchToManageDialog();
                $scope.showProgress = false;
            }).error(function(data, status, headers, config) {
                console.log('error api/vocabulary/getClassAndPropertyFromVocabulary');
                $scope.showProgress = false;
            });
    };

    $scope.addResult = function(value) {
      $scope.propertyValue.value = value;
    };

    // let us choose how to add vocabulary path
    //------------------------------------------
    $scope.choices = [
        "Add vocabulary path by url",
        "Add local vocabulary",
        "Add vocabulary later"
    ];

    $scope.localPath = false;
    $scope.remotePath = false;

    $scope.onChange = function(choice) {
        if( choice === "Add vocabulary path by url" ){
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
