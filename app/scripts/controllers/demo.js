'use strict';

angular.module('grafterizerApp')
.controller('DemoCtrl', function (
	$scope,
	File,
	Transformation,
	$rootScope,
	PipeService,
	$mdToast) {
	File.find({
		"filter[fields][content]": false,
		"filter[fields][description]": false,
		"filter[fields][date]": false,
		"filter[order]": "id DESC"
	}, function(list){
		$scope.files = list;
	});

	Transformation.find({
		"filter[fields][clojure]": false,
		"filter[fields][model]": false,
		"filter[fields][metadata]": false,
		"filter[order]": "id DESC"
	}, function(list){
		$scope.transformations = list;
	});

	$scope.gridOptions = {
		data: null,
		columnDefs: []
	};

	var preview = function() {
		if (!$scope.selectedTransformation || !$scope.selectedFile) {
			return;
		}

		// TODO This is ugly :-)
		var iframe = document.getElementsByTagName("iframe")[0].contentWindow;

		var sourceCode = iframe.getCode(),
			jsonCode = iframe.getJsonCode();

		console.log("generated source code", sourceCode);
		console.log("generated json code", jsonCode);

		Transformation.prototype$updateAttributes({
			id: $scope.selectedTransformation.id
		}, {
			clojure: sourceCode,
			model: jsonCode
		}, function(){
			PipeService.pipe(
				$scope.selectedTransformation.id,
				$scope.selectedFile.id
			).success(function(data){
				console.log(data);
				delete $scope.graftwerkException;
				$scope.gridOptions.columnDefs = 
					_.map(data[":column-names"], function(f) {
						return {name: f, width: Math.min(80+f.length*8, 250)};});
				$scope.gridOptions.data = data[":rows"];
			}).error(function(data){
				console.log(data);
				$scope.graftwerkException = data[":message"];
				$mdToast.show(
					$mdToast.simple()
						.content('Graftwerk exception: '+data[":class"])
						.position('right top')
						.hideDelay(5000)
				);
			});
		}, function(error) {
			$mdToast.show(
				$mdToast.simple()
					.content('Error: '+error.statusText)
					.position('right top')
					.hideDelay(6000)
     		);
		});

	};

	$rootScope.actions = {
		preview: preview
	};

	$scope.$watchGroup(['selectedFile', 'selectedTransformation'], preview);

	$scope.$watch('selectedTransformation', function() {
		if ($scope.selectedTransformation) {
			Transformation.findById({
				id: $scope.selectedTransformation.id
			}, function(data) {
				console.log(data);
				document.getElementsByTagName("iframe")[0].contentWindow.setJsonCode(data.model);
			});
		}
	});
});
