'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('DemoCtrl', function($scope, $http) {
    
    function querySearch(query) {
      return $http.get(
          'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8081/ManageVocabulary/api/vocabulary/autocomplete'
        )
        .then(function(data) {
          var allStates = '';
          var labels = data.data.result;

          for (var i = 0; i < labels.length; i++) {
            allStates += labels[i].value;
            allStates += ', ';
          }

          var temp = allStates.split(/, +/g).map(function(state) {
            return {
              value: state.toLowerCase(),
              display: state
            };
          });

          var results = query ? temp.filter(createFilterFor(query)) : [];
          return results;
        });
    }

    function selectedItemChange(item) {
      $scope.propertyValue.value = item.value;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }

    // list of `state` value/display objects
    this.querySearch = querySearch;
    this.selectedItemChange = selectedItemChange;

  });
