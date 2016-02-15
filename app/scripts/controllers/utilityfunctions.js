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

    var metadata1 = '{"weather": "sunny", "smurning": "vr40", "good": "oyeah"}';
    var metadata2 = '{"metadata": "yeah"}';
    var metadata3 = '{"metadata": "yeah", "snow": "some"}';

    var id = "1";
    $scope.testText = "Currently nothing is tested";
    
    $scope.testMetadata2 = function() {
        dataGraftApi.transformationCreateMetadata(id, metadata2).success(function(data) {
               $scope.testText = data.toString();
        });
    }
    $scope.testMetadata1 = function() {
        dataGraftApi.transformationCreateMetadata(id, metadata1).success(function(data) {
               $scope.testText = data.toString();
        });
    }
    $scope.testMetadata3 = function() {
        dataGraftApi.transformationCreateMetadata(id, metadata3).success(function(data) {
               $scope.testText = data.toString();
        });
    }
    
    
  });
