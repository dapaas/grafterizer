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
                                                                            leObject,
                                                                            $mdToast) {

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




  // TODO turn this into a utility function (in a utilityFunctions service)!!
  $scope.isProbablyUri = function(string) {
    //    var url = new URI("foaf:asdf");
    var uriRegEx = new RegExp('^' +
                              '(?:' +
                              '([^:/?#]+)' +         // scheme
                              ':)?' +
                              '(?://' +
                              '(?:([^/?#]*)@)?' +    // credentials
                              '([^/?#:@]*)' +        // domain
                              '(?::([0-9]+))?' +     // port
                              ')?' +
                              '([^?#]+)?' +            // path
                              '(?:\\?([^#]*))?' +      // query
                              '(?:#(.*))?' +           // fragment
                              '$');
    var match = ('' + string).match(uriRegEx);

    // probably a full URI (and not a qualified name) if it has a scheme and a domain
    if (match[1]) {
      // has a scheme
      if (match[3]) {
        // has a domain
        return true;
      }
    }

    return false;
  };
  if (!$scope.property) {
    $scope.property = new transformationDataModel.Property('', '', []);
  } else {
    if($scope.property.prefix) {
      // we have a prefix - display prefix:property-name
      $scope.propertyValue.value = $scope.property.prefix + ':' + $scope.property.propertyName;
    } else {
      // no prefix, need to determine if it is a URI or non-prefixed value
      if ($scope.isProbablyUri($scope.property.propertyName)){
        // (probably) a URI - display the property name (no ':')
        $scope.propertyValue.value = $scope.property.propertyName;
      } else {
        // a non-prefixed property - use the base graph URI in that case (with ':')
        $scope.propertyValue.value = ':' + $scope.property.propertyName;
      }
    }
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


    if ($scope.isProbablyUri($scope.propertyValue.value)) {
      // probably an outright URI - we put the whole URI in there
      $scope.property.prefix = '';
      $scope.property.propertyName = $scope.propertyValue.value;
    } else {
      // probably a qualified name - we need to split it into parts
      if ($scope.propertyValue.value.indexOf(':') >= 0) {
        $scope.property.prefix = $scope.propertyValue.value.substring(0, $scope.propertyValue.value.indexOf(':'));
        $scope.property.propertyName = $scope.propertyValue.value.substring($scope.propertyValue.value.indexOf(':') +
                                                                            1, $scope.propertyValue.value.length);
      } else {
        $mdToast.show(
          $mdToast.simple()
          .content('Error: Invalid property name. Please use a prefixed name (e.g., owl:sameAs), or an IRI (e.g., \'http://www.w3.org/2002/07/owl#sameAs\')')
          .position('bottom left')
          .hideDelay(4000)
        );
      }
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
        var i;

        for (i = response.propertyResult.length - 1; i >= 0; i--) {
          var value = response.propertyResult[i].value;
          if (value.substring(0, value.indexOf(':')).toLowerCase() === Para.toLowerCase() || value.substring(
            value.indexOf(':') + 1, value.length).toLowerCase() === Para.toLowerCase()) {
            $scope.items.push(value);
            response.propertyResult.splice(i, 1);
          }
        }

        for (i = response.propertyResult.length - 1; i >= 0; i--) {
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
