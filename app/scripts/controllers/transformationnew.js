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
    transformationDataModel) {

  	$scope.document = {
  		title: "New transformation",
  		description: "",
  	};

  	$scope.clojure = "";
    var prefixer = new transformationDataModel.Prefixer("examplePrefixer", "http://www.asdf.org/#/");
    var customFunctionDeclaration = new transformationDataModel.CustomFunctionDeclaration("exampleCustomFunct", "(defn example asdf)");
    $scope.pipeline = new transformationDataModel.Pipeline([]);
    $scope.transformation = new transformationDataModel.Transformation([customFunctionDeclaration], [prefixer], [$scope.pipeline], []);

    window.canard = $scope;

    $rootScope.actions = {
    	save: function(){
        var transformationJSON = JSON.stringify($scope.transformation);
        ontotextAPI.newTransformation({
            '@context': ontotextAPI.getContextDeclaration(),
            '@type': 'dcat:Transformation',
            'dct:title': $scope.document.title,
            'dct:description': $scope.document.description,
            'dct:public': $scope.document['dct:public'],
            'dct:modified': moment().format("YYYY-MM-DD")
          }, "this is clojure", transformationJSON)
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
  });
