'use strict';

angular.module('grafterizerApp')
  .controller('TransformationsCtrl', function ($scope, Transformation) {
  	Transformation.find({
		"filter[fields][clojure]": false,
    	"filter[order]": "id DESC"
  	}, function(list){
  	 	$scope.transformations = list;
  	}, function(error){
  		console.log("pas glop")
  	});
  });
