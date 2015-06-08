'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('MainCtrl', function (transformationDataModel, $scope, $mdDialog) {
    /************************ Temporary testing data BEGIN **************************/
    var prefixer = new transformationDataModel.Prefixer("examplePrefixer", "http://www.asdf.org/#/");
    var customFunctionDeclaration = new transformationDataModel.CustomFunctionDeclaration("exampleCustomFunct", "(defn example asdf)");
    $scope.transformation = new transformationDataModel.Transformation([customFunctionDeclaration], [prefixer], [], []);
    console.log($scope);

    /************************ Temporary testing data END **************************/

    $scope.$watch("selectedTransformationAction", function(selectedAction) {
        if(selectedAction){
            switch(selectedAction) {
                case "edit-prefixes":
                    $mdDialog.show({
                        templateUrl: 'views/editPipelineFunctionDialog.html',
                        // scope: $scope,
                        preserveScope: true
                    }).then(function(/*pipeFunct*/) {
                    }, function() {
                    }); 
                    break;
                case "create-custom-function":
                    break;
                case "preview-pipeline":
                    break;
                case "modify-rdf-mapping":
                    break;
            }
        }
    });
});
