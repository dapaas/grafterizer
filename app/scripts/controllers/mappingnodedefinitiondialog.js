'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:MappingnodedefinitiondialogCtrl
 * @description
 * # MappingnodedefinitiondialogCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('MappingnodedefinitiondialogCtrl', function(
              $scope,
               $http,
               $mdDialog,
               $timeout,
               $log,
               transformationDataModel,
               leObject) {

  var localClassAndProperty = leObject.localClassAndProperty;
  var localVocabulary = leObject.localVocabulary;
  var object = leObject.object;
  var test = $scope.$parent.transformation;
  console.log($scope);
  $scope.propertyValue = {
    value: ''
  };

  $scope.dragProcess = false;
  $scope.hideSelect = false;
  $scope.dialogState = {};
  $scope.dialogState.selectedTab = 0;
  if (!$scope.newNode) {
    // we create a new node
    $scope.newNode = {};
  } else {
    // put dialog in the proper state
    switch ($scope.newNode.__type) {
      case 'ConstantURI':
      case 'ColumnURI':
        $scope.dialogState.selectedTab = 0;
        $scope.dialogState.mappingType = $scope.newNode.__type ===
          'ConstantURI' ? 'free-defined' : 'dataset-col';

        break;
      case 'ColumnLiteral':
      case 'ConstantLiteral':
        $scope.dialogState.selectedTab = 1;
        break;
      case 'BlankNode':
        $scope.dialogState.selectedTab = 2;
        break;
    }
  }

  $scope.changeType = function() {

    switch ($scope.dialogState.selectedTab) {
      case 0:
        if ($scope.dialogState.mappingType === 'dataset-col') {
          $scope.newNode = new transformationDataModel.ColumnURI($scope.newNode
                                                                 .prefix ? $scope.newNode.prefix : '', '', []);
        } else {
          if ($scope.newNode.__type !== 'ConstantURI') {
            $scope.newNode = new transformationDataModel.ConstantURI(
              $scope.newNode.prefix ? $scope.newNode.prefix : '', '', []
            );
          } else {
            if (!$scope.newNode) {
              $scope.newNode = new transformationDataModel.ConstantURI('',
                                                                       '', []);
            } else {
              $scope.propertyValue.value = $scope.newNode.prefix + ':' +
                $scope.newNode.constant;
            }
          }
        }

        break;
      case 1:
        if ($scope.dialogState.mappingType === 'dataset-col') {
          $scope.newNode = new transformationDataModel.ColumnLiteral('', []);

        } else {
          $scope.newNode = new transformationDataModel.ConstantLiteral('', []);
        }

        break;
      case 2:
        $scope.newNode = new transformationDataModel.BlankNode();

        // TODO not yet implemented
        break;
    }
  };

  $scope.closeDialog = function() {
    $mdDialog.cancel();
  };

  $scope.addNode = function() {

    if ($scope.propertyValue.value.indexOf(':') >= 0) {
      $scope.newNode.prefix = $scope.propertyValue.value.substring(0,
                                                                   $scope.propertyValue.value.indexOf(':'));
      $scope.newNode.constant = $scope.propertyValue.value.substring(
        $scope.propertyValue.value.indexOf(':') + 1, $scope.propertyValue
        .value.length);
    }

    $mdDialog.hide($scope.newNode);
  };

  $scope.propertyValue = {
    value: ''
  };

  $scope.showProgress = false;
  $scope.showManageDialogToolBar = true;
  $scope.showSearchDialogToolBar = false;
  $scope.showAddDialogToolBar = false;

  $scope.closeDialog = function() {
    $mdDialog.cancel();
  };

  $scope.currentPage = 0;
  $scope.pageSize = 5;
  $scope.items = [];
  $scope.itemslocal = [];
  $scope.numberOfPages = function() {
    return Math.ceil($scope.itemslocal.length / $scope.pageSize);
  };

  var keywordscope;

  $scope.search = function(Para) {
    if (Para === undefined) {
      return;
    }

    $scope.showProgress = true;
    $scope.itemslocal = [];
    keywordscope = Para;
    $http.get(
      'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/search/' +
      Para)
      .success(function(response) {

      for (var i = response.result.length - 1; i >= 0; i--) {
        $scope.itemslocal.push(response.result[i].value);
      }

      $scope.showProgress = false;
    }).error(function(data, status, headers, config) {
      console.log('error /api/vocabulary/search');
      $scope.showProgress = false;
    });

    localClassAndProperty = JSON.parse(
      window.sessionStorage.getItem('localClassAndProperty'));

    for (var i = localClassAndProperty.length - 1; i >= 0; i--) {
      var str = localClassAndProperty[i].value;
      if (str.indexOf(keywordscope) !== -1) {
        $scope.itemslocal.push(localClassAndProperty[i].value);
      }
    }

    $scope.hideValue = true;
  };

  //local
  $scope.switchToManageDialog = function() {
    $scope.selection = 'manageDialog';

    var localVocabulary = JSON.parse(
      window.sessionStorage.getItem('localVocabulary'));

    $scope.VocabItemsServer = [];
    $http.get(
      'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/getAll'
    ).success(function(response) {
      for (var i = response.result.length - 1; i >= 0; i--) {
        $scope.VocabItemsServer.push(response.result[i].name);
      }
    }).error(function(data, status, headers, config) {
      console.log('error /api/vocabulary/getAll');
    });

    $scope.VocabItems = localVocabulary;
    $scope.showManageDialogToolBar = true;
    $scope.showSearchDialogToolBar = false;
    $scope.showAddDialogToolBar = false;

    $scope.hideSelect = true;
  };

  $scope.switchToSearchDialog = function() {
    $scope.selection = 'searchDialog';
    $scope.showManageDialogToolBar = false;
    $scope.showSearchDialogToolBar = true;
    $scope.showAddDialogToolBar = false;

    $scope.hideSelect = false;
  };

  $scope.switchToAddDialog = function() {
    $scope.selection = 'addVocabDialog';
    $scope.showManageDialogToolBar = false;
    $scope.showSearchDialogToolBar = false;
    $scope.showAddDialogToolBar = true;

    $scope.hideSelect = true;
  };

  //local
  $scope.deleteItem = function(name, vocabNamespace) {
    var i;
    localClassAndProperty = JSON.parse(
      window.sessionStorage.getItem('localVocabulary'));
    window.sessionStorage.removeItem('localVocabulary');

    for (i = localVocabulary.length - 1; i >= 0; i--) {
      if (localVocabulary[i] === name) {
        localVocabulary.splice(i, 1);
      }
    }

    $scope.VocabItems = localVocabulary;

    window.sessionStorage.setItem('localVocabulary', JSON.stringify(
      localVocabulary));

    localClassAndProperty = JSON.parse(
      window.sessionStorage.getItem('localClassAndProperty'));
    window.sessionStorage.removeItem('localClassAndProperty');

    for (i = localClassAndProperty.length - 1; i >= 0; i--) {
      var str = localClassAndProperty[i];
      if (str.value.indexOf(name) === 0) {
        localClassAndProperty.splice(i, 1);
      }
    }

    window.sessionStorage.setItem('localClassAndProperty', JSON.stringify(
      localClassAndProperty));
  };

  //local
  $scope.addVocabToTable = function(vocabName, vocabPrefix, vocabLoc) {
    if (vocabName === undefined || vocabPrefix === undefined) {
      // TODO print an error
      return;
    }

    if (vocabLoc === undefined && !object.data) {
      // TODO print an error
      return;
    }

    $scope.showProgress = true;
    $http.post(
      'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/getClassAndPropertyFromVocabulary', {
        name: vocabName,
        path: vocabLoc,
        data: object.data
      })
      .success(function(response) {
      console.log("test");

      var localClassAndProperty = JSON.parse(
        window.sessionStorage.getItem('localClassAndProperty'));

      for (var i = response.result.length - 1; i >= 0; i--) {
        localClassAndProperty.push(response.result[i]);
      }

      window.sessionStorage.setItem('localClassAndProperty', JSON.stringify(
        localClassAndProperty));

      var localVocabulary = JSON.parse(
        window.sessionStorage.getItem('localVocabulary'));
      localVocabulary.push(vocabName);
      window.sessionStorage.setItem('localVocabulary', JSON.stringify(
        localVocabulary));

      $scope.switchToManageDialog();
      $scope.showProgress = false;
    }).error(function(data, status, headers, config) {
      console.log(
        'error /api/vocabulary/getClassAndPropertyFromVocabulary');
    });
  };

  $scope.addResult = function(value) {
    $scope.propertyValue.value = value;
  };

  $scope.data = {
    cb: true
  };

  $scope.onChange = function(cbState) {
    if (cbState === true) {
      $scope.localPath = false;
    } else {
      $scope.localPath = true;
    }
  };
});
