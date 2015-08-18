'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PropertydialogCtrl
 * @description
 * # PropertydialogCtrl
 * Controller of the grafterizerApp
 */

angular.module('grafterizerApp').controller('PropertydialogCtrl', function($scope,
  $rootScope,
  $http,
  $mdDialog,
  $log,
  transformationDataModel,
  leObject) {

  var connection = leObject.serveraddress;

  $scope.propertyValue = {
    value: ''
  };

  $scope.showSearchDialog = true;
  $scope.showProgress = false;

  //search dialog
  $scope.showSearchResult = false;
  $scope.showSearchEmptyResult = false;

  //add vocabulary dialog
  $scope.showSearchPagination = false;

  $scope.VocabItems = [];

  if (!$scope.property) {
    $scope.property = new transformationDataModel.Property('', '', []);
  } else {
    $scope.propertyValue.value = $scope.property.prefix + ':' + $scope.property.propertyName;
  }

  $scope.addProperty = function() {
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
    } else {
      $scope.property.propertyName = $scope.propertyValue.value;
      $scope.property.prefix = '';
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

    //get search result from server
    $http.get(
      connection + 'search/' +
      Para).success(
      function(response) {
        for (var i = response.propertyResult.length - 1; i >= 0; i--) {
          $scope.items.push(response.propertyResult[i].value);
        }

        if ($scope.items.length > $scope.pageSize) {
          $scope.showSearchPagination = true;
        } else {
          $scope.showSearchPagination = false;
        }

        if ($scope.items.length > 0) {
          $scope.showSearchResult = true;
          $scope.showSearchEmptyResult = false;
        } else {
          $scope.showSearchResult = false;
          $scope.showSearchEmptyResult = true;
        }

        $scope.showProgress = false;
      }).error(function(data, status, headers, config) {
      Raven.captureMessage('error api/vocabulary/search', {
        tags: {
          file: 'propertydialog',
          method: 'search'
        }
      });
      $scope.showProgress = false;
    });

    //get search result from local
    var localVocabulary = $rootScope.transformation.rdfVocabs;

    for (var i = localVocabulary.length - 1; i >= 0; i--) {

      var propertyList = localVocabulary[i].properties;
      if (propertyList !== null) {
        for (var item = propertyList.length - 1; item >= 0; item--) {
          if (propertyList[item].lowername.indexOf(Para.toLowerCase()) !== -1) {
            $scope.items.push(propertyList[item].name);
          }
        }
      }
    }

    $scope.currentPage = 0;
  };

  $scope.addResult = function(value) {
    $scope.propertyValue.value = value;
  };

  $scope.noOperation = function() {

  };

});
