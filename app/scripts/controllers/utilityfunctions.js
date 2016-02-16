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
    
    
    $scope.utilityFunctions = "";
    $scope.showPublicUtilityFunctions = true;
    
    $scope.listUtilityFunctions = function() {
        dataGraftApi.utilityFunctionsList($scope.showPublicUtilityFunctions).success(
            function(data) {
                $scope.utilityFunctions = JSON.stringify(data, null, '\n');
            }
        );
        
    }
    $scope.listUtilityFunctions();
    
    
    
    
    $scope.apiKey = dataGraftApi.apiKey;


    
    var metadata = ['{"weather": "sunny", "smurning": "vr40", "good": "oyeah"}',
                    '{"metadata": "yeah"}',
                    '{"metadata": "yeah", "snow": "some"}'];
    var id = "1";
    $scope.testText = "Currently nothing is tested";
    
    $scope.testMetadata = function(md) {
        dataGraftApi.transformationCreateMetadata(id, metadata[md]).success(function(data) {
               $scope.testText = JSON.stringify(data, null, 2);
        });
    }
   
    
    
  });
