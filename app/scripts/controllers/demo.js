'use strict';

angular.module('grafterizerApp')
  .controller('DemoCtrl', function ($scope, File, Transformation, $rootScope) {
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
  		"filter[fields][metadata]": false,
      	"filter[order]": "id DESC"
  	}, function(list){
  		$scope.transformations = list;
  	});

  	$scope.gridOptions = {
  		data: null,
  		columnDefs: []
  	};

    $rootScope.actions = {
    	preview: function() {


    	}
    };
  });
