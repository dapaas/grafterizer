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
    
    var utilityFunctionsObj = [];
    $scope.utilityFunctions = "";
    $scope.showPublicUtilityFunctions = true;
    
    $scope.listUtilityFunctions = function() {
        $scope.utilityFunctions = "hang on...";
        // Should be:
        //dataGraftApi.utilityFunctionsList(showPublicUtilityFunctions).success(
        //    function(data) {
        //        prettyfyUtilityFunctions(data)
        //    });
        // but this is the work around:
        dataGraftApi.utilityFunctionsList(true).success(
            function(data) {
                if ($scope.showPublicUtilityFunctions) {
                    pretifyUtilityFunctions(data);
                } else {
                    utilityFunctionsObj = [];
                    
                    for (var i in data) {
                        dataGraftApi.utilityFunctionGet(data[i]["id"]).success( function(singleData) {
                            console.log(JSON.stringify(singleData));
                            if (singleData["public"] !== 'undefined' && singleData["public"]) {
                                console.log("SingleData id = " + singleData["id"]);
                                for (var j in data) {
                                    if (singleData["id"] === data[j]["id"]) {
                                        console.log("pushing data[" + j + "]");
                                        utilityFunctionsObj.push(data[j]);
                                        break;
                                    }
                                }
                                pretifyUtilityFunctions(utilityFunctionsObj);
                            }
                        });
                    }
                    console.log(utilityFunctionsObj);
                    pretifyUtilityFunctions(utilityFunctionsObj);
                }
            }
        );
    }
    $scope.listUtilityFunctions();
    
    
    var pretifyUtilityFunctions = function(ufList) {
        var tmpString = "";
        for ( var j in ufList) {
            tmpString += JSON.stringify(ufList[j], null, 4 );
        }
        $scope.utilityFunctions = tmpString;
    }
    
    
    
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
