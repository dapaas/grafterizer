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
               $log,
               transformationDataModel,
               leObject) {

      var connection = leObject.serveraddress;

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

      // this is for search
      var lowercaseTemplate = {
          name: '',
          lowercase:''
      }

      $scope.VocabItems = [];

      $scope.showSearchDialog = true;
      $scope.showProgress = false;
      $scope.hideToolbar = false;

      //search dialog
      $scope.showSearchResult  = false;
      $scope.showSearchEmptyResult = false;

      //add vocabulary dialog
      $scope.showSearchPagination = false;

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
                }

                if($scope.newNode.prefix !== "" || $scope.newNode.constant !== ""){
                  $scope.propertyValue.value = $scope.newNode.prefix + ':' + $scope.newNode.constant;
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
            $scope.newNode = new transformationDataModel.BlankNode([]);
            // TODO not yet implemented
            break;
        }
      };

      $scope.closeDialog = function() {
        $mdDialog.cancel();
      };

      $scope.addNode = function() {
        if ($scope.newNode.__type === 'ConstantURI') {
          if ($scope.propertyValue.value.indexOf(':') >= 0) {
            $scope.newNode.prefix = $scope.propertyValue.value.substring(0, $scope.propertyValue.value.indexOf(':'));
            $scope.newNode.constant = $scope.propertyValue.value.substring(
              $scope.propertyValue.value.indexOf(':') + 1, $scope.propertyValue
                .value.length);
          }
          else if ($scope.newNode.__type !== 'BlankNode') 
          {
            $scope.newNode.prefix = "";
            $scope.newNode.constant = $scope.propertyValue.value;
          }
        }

        $mdDialog.hide($scope.newNode);
      };

      $scope.propertyValue = {
        value: ''
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
          //get search result from server
          $http.get(
            connection + 'search/' +
              Para).success(
                  function(response) {
                      for (var i = response.classResult.length - 1; i >= 0; i--) {
                          $scope.items.push(response.classResult[i].value);
                      }
                      if ($scope.items.length > $scope.pageSize){
                          $scope.showSearchPagination = true;
                      }
                      else{
                          $scope.showSearchPagination = false;
                      }

                      if ($scope.items.length > 0){
                          $scope.showSearchResult = true;
                          $scope.showSearchEmptyResult = false;
                      }
                      else{
                          $scope.showSearchResult = false;
                          $scope.showSearchEmptyResult = true;
                      }

                      $scope.showProgress = false;
                  }).error(function(data, status, headers, config) {
                      console.log('error api/vocabulary/search');
                      $scope.showProgress = false;
          });

          //get search result from local
          var localVocabularies = $scope.$parent.transformation.rdfVocabs;

          for (var i = localVocabularies.length - 1; i >= 0; i--) {
              var ClassList = localVocabularies[i].classes;
              if (ClassList != null){
                  for( var item = ClassList.length - 1; item >= 0; item-- ){
                      if( ClassList[item].lowername.indexOf(Para.toLowerCase()) != -1 ) {
                          $scope.items.push(ClassList[item].name);
                      }
                  }
              }
          }

          $scope.currentPage = 0;
      };


      $scope.addResult = function(value) {
        $scope.propertyValue.value = value;
      };

      $scope.noOperation = function(){

      }
});
