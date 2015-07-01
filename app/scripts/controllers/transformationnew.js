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
    var customfunctions = [
        new transformationDataModel.CustomFunctionDeclaration("integer-literal", "(defn integerColumn [s] (Integer/parseInt s))"),
        new transformationDataModel.CustomFunctionDeclaration("string-literal", "(def string-literal s)"),
        new transformationDataModel.CustomFunctionDeclaration("boolean", ""),
        new transformationDataModel.CustomFunctionDeclaration("count", ""),
        new transformationDataModel.CustomFunctionDeclaration("cast", ""),
        new transformationDataModel.CustomFunctionDeclaration("capitalize", ""),
        new transformationDataModel.CustomFunctionDeclaration("dec", ""),
        new transformationDataModel.CustomFunctionDeclaration("double", ""),
        new transformationDataModel.CustomFunctionDeclaration("first", ""),
        new transformationDataModel.CustomFunctionDeclaration("float", ""),
        new transformationDataModel.CustomFunctionDeclaration("inc", ""),
        new transformationDataModel.CustomFunctionDeclaration("keyword", ""),
        new transformationDataModel.CustomFunctionDeclaration("last", ""),
        new transformationDataModel.CustomFunctionDeclaration("long", ""),
        new transformationDataModel.CustomFunctionDeclaration("name", ""),
        new transformationDataModel.CustomFunctionDeclaration("second", ""),
        new transformationDataModel.CustomFunctionDeclaration("short", ""),
        new transformationDataModel.CustomFunctionDeclaration("join", '(defn join [& strings] (clojure.string/join " " strings))'),
        new transformationDataModel.CustomFunctionDeclaration("lower-case", ""),
        new transformationDataModel.CustomFunctionDeclaration("upper-case", ""),
        new transformationDataModel.CustomFunctionDeclaration("reverse", ""),
        new transformationDataModel.CustomFunctionDeclaration("trim", ""),
        new transformationDataModel.CustomFunctionDeclaration("trim-newline", ""),
        new transformationDataModel.CustomFunctionDeclaration("triml", ""),
        new transformationDataModel.CustomFunctionDeclaration("trimr", ""),
        new transformationDataModel.CustomFunctionDeclaration("rem", "")];
    customfunctions.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;

        }
        else {return -1;}

    });;
    var numericcustomfunctions = [new transformationDataModel.CustomFunctionDeclaration("+", ""),
                                  new transformationDataModel.CustomFunctionDeclaration("-", ""),
                                  new transformationDataModel.CustomFunctionDeclaration("*", ""),
                                  new transformationDataModel.CustomFunctionDeclaration("/", "")];
    var allcustomfunctions = customfunctions.concat(numericcustomfunctions);
    $scope.clojure = "";
    $scope.pipeline = new transformationDataModel.Pipeline([]);
    $scope.transformation = new transformationDataModel.Transformation(allcustomfunctions, [], [$scope.pipeline], []);
    /*$scope.transformation = new transformationDataModel.Transformation([integerColumn, 
        stringColumn, count, bool, cast, dec, toDouble, first, toFloat, inc, keyword, last, toLong, name, rem, second, toShort, 
        capitalize, join, lowerCase,upperCase, reverse,  trim, trimNewline, trimr, triml,
        add, subtr, prod, div], [], [$scope.pipeline], []);
*/
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
