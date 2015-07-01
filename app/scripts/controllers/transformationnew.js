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
   
    var boolean = new transformationDataModel.CustomFunctionDeclaration("boolean", "");
    var count = new transformationDataModel.CustomFunctionDeclaration("count", "");
    var cast = new transformationDataModel.CustomFunctionDeclaration("cast", ""); 
    var dec = new transformationDataModel.CustomFunctionDeclaration("dec", "");
    var double = new transformationDataModel.CustomFunctionDeclaration("double", "");
    var first = new transformationDataModel.CustomFunctionDeclaration("first", "");
    var float = new transformationDataModel.CustomFunctionDeclaration("float", "");
    var inc = new transformationDataModel.CustomFunctionDeclaration("inc", "");
    var keyword = new transformationDataModel.CustomFunctionDeclaration("keyword", "");
    var last = new transformationDataModel.CustomFunctionDeclaration("last", "");
    var long = new transformationDataModel.CustomFunctionDeclaration("long", "");
    var name = new transformationDataModel.CustomFunctionDeclaration("name", "");
    var second = new transformationDataModel.CustomFunctionDeclaration("second", "");
    var short = new transformationDataModel.CustomFunctionDeclaration("short", "");
  /*String functions*/
      var capitalize = new transformationDataModel.CustomFunctionDeclaration("capitalize", "");
      var join = new transformationDataModel.CustomFunctionDeclaration("join", ' (defn join [& strings] (clojure.string/join " " strings))'); 
      var lowerCase = new transformationDataModel.CustomFunctionDeclaration("lower-case", "");
      var upperCase = new transformationDataModel.CustomFunctionDeclaration("upper-case", "");
      var reverse = new transformationDataModel.CustomFunctionDeclaration("reverse", "");
      var trim = new transformationDataModel.CustomFunctionDeclaration("trim", "");
      var trimNewline = new transformationDataModel.CustomFunctionDeclaration("trim-newline", "");
      var triml = new transformationDataModel.CustomFunctionDeclaration("triml", "");
      var trimr = new transformationDataModel.CustomFunctionDeclaration("trimr", "");

/*Numbers*/
      
      var rem = new transformationDataModel.CustomFunctionDeclaration("rem", "");
      var add = new transformationDataModel.CustomFunctionDeclaration("+", "");
      var subtr = new transformationDataModel.CustomFunctionDeclaration("-", "");
      var prod = new transformationDataModel.CustomFunctionDeclaration("*", "");
      var div = new transformationDataModel.CustomFunctionDeclaration("/", "");
    $scope.clojure = "";
    $scope.pipeline = new transformationDataModel.Pipeline([]);
    $scope.transformation = new transformationDataModel.Transformation([integerColumn, 
        stringColumn, count, boolean, cast, dec, double, first, float, inc, keyword, last, long, name, rem, second, short, 
        capitalize, join, lowerCase,upperCase, reverse,  trim, trimNewline, trimr, triml,
        add, subtr, prod, div], [], [$scope.pipeline], []);

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
