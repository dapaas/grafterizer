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
               leObject,
               $rootScope,
               $mdToast) {

  var connection = leObject.serveraddress;
  $scope.dialogState = {};
  $scope.dialogState.selectedTab = 0;

  $scope.disableBlankNodeOption = false;
  if ($scope.parentNode) {
    if ($scope.parentNode instanceof transformationDataModel.Graph) {
      $scope.disableBlankNodeOption = true;
    }
  }

  if ($scope.nodeCurrentState) {
    
    $scope.propertyValue = {
      value: $scope.nodeCurrentState.__type === 'ConstantURI' ? $scope.nodeCurrentState.prefix + ':' + $scope.nodeCurrentState.constant : ''
    };
      if ($scope.nodeCurrentState.__type === 'ConstantURI') 
          $scope.nodeCurrentState.prefix = $scope.nodeCurrentState.prefix.hasOwnProperty('id') ? $scope.nodeCurrentState.prefix : {id:0, value: $scope.nodeCurrentState.prefix};

    if ($scope.nodeCurrentState.__type === 'ColumnLiteral') $scope.columnLiteralHasDatatype = $scope.nodeCurrentState.datatype.name === 'unspecified'||$scope.nodeCurrentState.datatype.name === undefined ? false : true;
    // serialise the node state object to the proper RDF element type
    $scope.nodeCurrentState = transformationDataModel.getGraphElement($scope.nodeCurrentState);
 if ($scope.nodeCurrentState.__type === 'ColumnURI')   $scope.nodeCurrentState.prefix = {id:0, value:  $scope.nodeCurrentState.prefix};
    // put dialog in the proper state
    switch ($scope.nodeCurrentState.__type) {
      case 'ConstantURI':
      case 'ColumnURI':
        $scope.dialogState.selectedTab = 0;
        $scope.dialogState.mappingType = $scope.nodeCurrentState.__type ===
          'ConstantURI' ? 'free-defined' : 'dataset-col';
        $scope.nodeCurrentStateSubElements = $scope.nodeCurrentState.subElements ? $scope.nodeCurrentState.subElements : [];
           
        break;
      case 'ColumnLiteral':
      case 'ConstantLiteral':
        $scope.dialogState.selectedTab = 1;
        $scope.dialogState.mappingType = $scope.nodeCurrentState.__type ===
          'ConstantLiteral' ? 'free-defined' : 'dataset-col';
        break;
      case 'BlankNode':
        $scope.dialogState.selectedTab = 2;
        break;
    }
  } else {
    $scope.propertyValue = {
      value: ''
    };
       /*$scope.prefixValue = {
           id:0,
      value: ''
    };*/
    $scope.nodeCurrentState = {};
  }

  $scope.VocabItems = [];

  $scope.showSearchDialog = true;
  $scope.showProgress = false;
  $scope.hideToolbar = false;

  //search dialog
  $scope.showSearchResult = false;
  $scope.showSearchEmptyResult = false;

  //add vocabulary dialog
  $scope.showSearchPagination = false;

  // TODO make this more strict - i.e, implement a proper parser; implement IRIs instead of URIs
  // check if a string has a scheme and domain in it (i.e., it is not simply a qualified name)
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
  $scope.colnames = (typeof $rootScope.colnames === 'undefined') ? [] : $rootScope.colnames();
  $scope.prefixes = function() {
      var allPrefixes = [];
      for (var i=0; i<$rootScope.transformation.rdfVocabs.length; ++i)
          allPrefixes.push({id:i, value:$rootScope.transformation.rdfVocabs[i].name});
      return allPrefixes;
  }
  
    $scope.availableDatatypes = [
    {
        "id":0,
        "name":"byte"
    },
    {
        "id":1,
        "name":"short"
    },
    {
        "id":2,
        "name":"integer"
    },
    {
        "id":3,
        "name":"long"
    },
    {
        "id":4,
        "name":"decimal"
    },
  
    {
        "id":5,
        "name":"float"
    },
    {
        "id":6,
        "name":"double"
    },
   
    {
        "id":7,
        "name":"boolean"
    },

    {
        "id":8,
        "name":"date"
    },
    {
        "id":9,
        "name":"string"
    },
    {
        "id":10,
        "name":"custom"
    }
    ];
var colCtr = 0;
$scope.addColumn = function(query) {
    return {
        id: colCtr++,
        value: query
    };
};
    
var prefCtr = 0;
$scope.addPref = function(query) {
    return {
        id: prefCtr++,
        value: query
    };
};
  $scope.changeType = function() {
    
    switch ($scope.dialogState.selectedTab) {
      case 0:
        if ($scope.dialogState.mappingType === 'dataset-col') {
          if ($scope.nodeCurrentState.__type !== 'ColumnURI') {
            $scope.nodeCurrentState = new transformationDataModel.ColumnURI(
              $scope.nodeCurrentState.prefix ? $scope.nodeCurrentState.prefix : {id:0,value:''},
              $scope.nodeCurrentState.column ? $scope.nodeCurrentState.column : '',
              $scope.nodeCurrentStateSubElements ? $scope.nodeCurrentStateSubElements : []
            );

          }
        } else {
          if ($scope.nodeCurrentState.__type !== 'ConstantURI') {
            $scope.nodeCurrentState = new transformationDataModel.ConstantURI(
              $scope.nodeCurrentState.prefix ? $scope.nodeCurrentState.prefix : '',
              $scope.nodeCurrentState.constant ? $scope.nodeCurrentState.constant : '',
              $scope.nodeCurrentStateSubElements ? $scope.nodeCurrentStateSubElements : []
            );
          }
        }

        break;
      case 1:
        if ($scope.dialogState.mappingType === 'dataset-col') {
          if ($scope.nodeCurrentState.__type !== 'ColumnLiteral') {
            /*$scope.nodeCurrentState = new transformationDataModel.ColumnLiteral(
              $scope.nodeCurrentState.literalValue.value ? $scope.nodeCurrentState.literalValue.value : ''
            );*/
              

              $scope.nodeCurrentState = new transformationDataModel.ColumnLiteral(      
              ($scope.nodeCurrentState.literalValue && $scope.nodeCurrentState.literalValue.value ? $scope.nodeCurrentState.literalValue.value : ''),
              ($scope.columnLiteralHasDatatype ? $scope.nodeCurrentState.datatype : {name: 'unspecified', value: 0}),
              $scope.nodeCurrentState.onEmpty,
              $scope.nodeCurrentState.onError,
              ($scope.nodeCurrentState.langTag ? $scope.nodeCurrentState.langTag : ''),
              ($scope.nodeCurrentState.datatypeURI ? $scope.nodeCurrentState.datatypeURI : ''));
             
          }
        } else {
          if ($scope.nodeCurrentState.__type !== 'ConstantLiteral') {
            $scope.nodeCurrentState = new transformationDataModel.ConstantLiteral(
              $scope.nodeCurrentState.literalValue ? $scope.nodeCurrentState.literalValue : ''
            );
          }
        }

        break;
      case 2:
        if ($scope.nodeCurrentState.__type !== 'BlankNode') {
          $scope.nodeCurrentState = new transformationDataModel.BlankNode(
            $scope.nodeCurrentState.subElements ? $scope.nodeCurrentState.subElements : []
          );
        }

        break;
    }
  };

  $scope.closeDialog = function() {
    $mdDialog.cancel();
  };

  $scope.addNode = function() {
      
    if ($scope.nodeCurrentState.__type === 'ConstantURI') {
      if ($scope.isProbablyUri($scope.propertyValue.value)) {
        // probably an outright URI - we put the whole URI in there
        $scope.nodeCurrentState.prefix = '';
        $scope.nodeCurrentState.constant = $scope.propertyValue.value;
        $scope.nodeCurrentState.subElements = $scope.nodeCurrentStateSubElements ? $scope.nodeCurrentStateSubElements : [];
      } else {
        // probably a qualified name - we need to split it into parts
        if ($scope.propertyValue.value.indexOf(':') !== -1) {
          $scope.nodeCurrentState.prefix = $scope.propertyValue.value.substring(0, $scope.propertyValue.value.indexOf(':'));
          $scope.nodeCurrentState.constant = $scope.propertyValue.value.substring($scope.propertyValue.value.indexOf(':') + 1, $scope.propertyValue.value.length);
        } else {
          $mdToast.show(
            $mdToast.simple()
            .content('Error: Invalid node name. Please use a prefixed name (e.g., owl:Thing), or an IRI (e.g., \'http://www.w3.org/2002/07/owl#Thing\')')
            .position('bottom left')
            .hideDelay(4000)
          );
        }
      }
    } else if ($scope.nodeCurrentState.__type === 'ColumnURI') {
        // $scope.nodeCurrentState.prefix = $scope.prefixValue;
      $scope.nodeCurrentState.subElements = $scope.nodeCurrentStateSubElements ? $scope.nodeCurrentStateSubElements : [];
  
    }

    /*else if ($scope.nodeCurrentState.__type === 'ConstantLiteral') {
    } else if ($scope.nodeCurrentState.__type === 'ColumnLiteral') {
    } else if ($scope.nodeCurrentState.__type === 'BlankNode') {
    }*/

    $mdDialog.hide($scope.nodeCurrentState);
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

        for (i = response.classResult.length - 1; i >= 0; i--) {
          var value = response.classResult[i].value;
          if (value.substring(0, value.indexOf(':')).toLowerCase() === Para.toLowerCase() ||
              value.substring(value.indexOf(':') + 1, value.length).toLowerCase() === Para.toLowerCase()
             ) {
            $scope.items.push(value);
            response.classResult.splice(i, 1);
          }
        }

        for (i = response.classResult.length - 1; i >= 0; i--) {
          $scope.items.push(response.classResult[i].value);
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
          file: 'mappingnodedefinitiondialog',
          method:  'search'
        }
      });
      $scope.showProgress = false;
    });

    //get search result from local
    var localVocabularies = $scope.$parent.transformation.rdfVocabs;

    for (var i = localVocabularies.length - 1; i >= 0; i--) {
      var ClassList = localVocabularies[i].classes;
      if (ClassList !== null) {
        for (var item = ClassList.length - 1; item >= 0; item--) {
          if (ClassList[item].lowername.indexOf(Para.toLowerCase()) !== -1) {
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

  $scope.noOperation = function() {

  };

});
