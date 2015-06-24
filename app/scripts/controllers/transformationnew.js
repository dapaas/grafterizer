'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:TransformationnewCtrl
 * @description
 * # TransformationnewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('TransformationNewCtrl', function (
                $scope,
                 $stateParams,
                 ontotextAPI,
                 $rootScope,
                 $state,
                 $mdToast,
                 $mdDialog,
                 transformationDataModel,
                 generateClojure) {

    $scope.document = {
        title: "New transformation",
        description: "",
    };
    var integerColumn = new transformationDataModel.CustomFunctionDeclaration("integerColumn", "(defn integerColumn [s] (Integer/parseInt s))");
    var stringColumn = new transformationDataModel.CustomFunctionDeclaration("stringColumn", "(defn stringColumn [str] (s str))");
    $scope.clojure = "";
    $scope.pipeline = new transformationDataModel.Pipeline([]);
    $scope.transformation = new transformationDataModel.Transformation([integerColumn, stringColumn], [], [$scope.pipeline], []);

    window.canard = $scope;

    $rootScope.actions = {
        save: function(){
            // var transformationJSON = JSON.stringify($scope.transformation);
            var clojure = generateClojure.fromTransformation($scope.transformation);
            ontotextAPI.newTransformation({
                '@context': ontotextAPI.getContextDeclaration(),
                '@type': 'dcat:Transformation',
                'dct:title': $scope.document.title,
                'dct:description': $scope.document.description,
                'dcat:public': $scope.document['dct:public'] ? 'true': 'false',
                'dct:modified': moment().format("YYYY-MM-DD"),
                'dcat:transformationType': 'pipe',
                'dcat:transformationCommand': 'my-pipe'
            }, clojure, $scope.transformation)
                .success(function(data){
                $mdToast.show(
                    $mdToast.simple()
                    .content('Transformation saved')
                    .position('bottom left')
                    .hideDelay(6000)
                );
                $state.go('transformations.transformation', {
                    id: data['@id']
                });
            });
            /*Transformation.create({
	        	uri: "about:blank",
	        	name: $scope.document.title,
	        	metadata: $scope.document.description,
	        	clojure: $scope.clojure
	        }, function(data) {
	        	$state.go('transformations.transformation', {
	        		id: data.id
	        	});
	        }, function(err) {
	  			$mdToast.show(
			      $mdToast.simple()
			        .content('An error occured: '+err.statusText)
			        .position('right top')
			        .hideDelay(6000)
		        );
	        });*/
        }
    };
    $scope.$watch('fileUpload', function(){
        if ($scope.fileUpload) {
            // TODO
            $mdToast.show(
                $mdToast.simple()
                .content('You need to save the transformation first')
                .position('bottom left')
                .hideDelay(6000)
            );
        }
    });

    $scope.editPrefixers = function () {
        $scope.originalPrefixers = [];
        angular.copy($scope.transformation.prefixers, $scope.originalPrefixers);
        $mdDialog.show({
            templateUrl: 'views/editprefixes.html',
            controller: 'EditprefixersCtrl',
            scope: $scope.$new(false, $scope)
        }).then(function() {
        }, function() {
            angular.copy($scope.originalPrefixers, $scope.transformation.prefixers);
        });
    };

    $scope.defineCustomFunctions = function () {
        $scope.originalCustomFunctionDeclarations = [];
        angular.copy($scope.transformation.customFunctionDeclarations, $scope.originalCustomFunctionDeclarations);
        $mdDialog.show({
            templateUrl: 'views/createcustomfunction.html',
            controller: 'CustomfunctionsdialogcontrollerCtrl',
            scope: $scope.$new(false, $scope)
        }).then(function() {
        }, function() {
            angular.copy($scope.originalCustomFunctionDeclarations, $scope.transformation.customFunctionDeclarations);
        }); 
    };
});
