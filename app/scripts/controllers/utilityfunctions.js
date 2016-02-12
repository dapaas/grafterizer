'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:UtilityfunctionsCtrl
 * @description
 * # UtilityfunctionsCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('UtilityFunctionsCtrl', function ($scope, dataGraftApi) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    var dummy1 = "Dummy no 1";
    var dummy2 = "Dummy no 2";
    
    $scope.dummy = dummy1;
    $scope.dummySwitch = true;
    $scope.swapDummy = function(ds) {
        if (ds) {
            $scope.dummy = dummy1;
        } else {
            $scope.dummy = dummy2;
        }
    }
    
    $scope.apiKey = dataGraftApi.apiKey;
    
    
    
  });
