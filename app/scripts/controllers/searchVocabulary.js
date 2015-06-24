/**
 * 
 */
var app = angular.module('grafterizerApp');
app. filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
app.controller('SearchVocabularyController', function ($scope, $http, $mdDialog) {
		
	$scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.items = [];
    $scope.numberOfPages=function(){
        return Math.ceil($scope.items.length/$scope.pageSize);                
    }
	
	var keywordscope;
	
	$scope.search = function(keyword) {
		if(keyword.indexOf(":") > 0){
			keyword = keyword.substring(keyword.indexOf(":") + 1, keyword.length);
		}
		
		keywordscope = keyword;
		$scope.loading = true;
		
		$http.get('http://localhost:8080/ManageVocabulary/api/vocabulary/search/' + keywordscope).success(function(response){
				if(response.http_code == "200"){
					$scope.items = response.result;
				}
			}).error(function(data, status, headers, config) {
    			alert("error");
    		});
		//$scope.searchTableParams.reload();
	};
	
	/*
	$scope.searchTableParams = new ngTableParams({
		page: 1,            
		count: 10           
	}, {
		total: 0, 
		getData: function($defer, params) {
			
		}
	});
*/
    $scope.addResult = function(keyword) {
    	this.searchvalue.keyword = keyword;
    	
    };
    
    var VocabularCollection;
    
	$scope.switchToManageDialog = function() {	
    	$scope.selection = "manageDialog";
    	$scope.loading = true;
    	//$scope.manageTableParams.reload();
	}
	/*
    $scope.manageTableParams = new ngTableParams({
    	page: 1,            
    	count: 10           
    }, {
    	total: 0, 
    	getData: function($defer, params) {
    		$http.get('http://localhost:8080/ManageVocabulary/api/vocabulary/getAll').success(function(data, status, headers, config){
    				VocabularCollection = data.result;
    				params.total(VocabularCollection.length);
    				$defer.resolve(VocabularCollection.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    				$scope.loading = false;
    		}).
    		error(function(data, status, headers, config) {
    			alert("error");
    		})
    	}
    });
	*/
    
    $scope.switchToSearchDialog = function() {
    	$scope.selection = "searchDialog";
    	
    }
    
    $scope.switchToAddDialog = function() {
    	$scope.selection = "addVocabDialog";
    }
    
    $scope.deleteItem = function(name, vocabNamespace) {
        $http.post('http://localhost:8080/ManageVocabulary/api/vocabulary/delete/', {name: name, namespace: vocabNamespace}).success(function(response){
        	if(response.http_code == "200"){
        		for (var i=VocabularCollection.length-1; i>=0; i--) {
        		    if (VocabularCollection[i].name === name) {
        		    	VocabularCollection.splice(i, 1);
        		    }
        		}
        		//$scope.manageTableParams.reload();
        	}
		}).error(function(data, status, headers, config) {
			alert("error");
		});
    }
    
    
    $scope.addVocabToTable = function(vocabName, vocabPrefix, vocabLoc) {
    	$scope.loading = true;
    	$http.post('http://localhost:8080/ManageVocabulary/api/vocabulary/add', {name:vocabName, namespace:vocabPrefix, path:vocabLoc}).success(function(response){
			if(response.http_code == "200"){
				$scope.switchToManageDialog();
				$scope.loading = false;
			}
		}).error(function(data, status, headers, config) {
			alert("error");
		});        
    }
	
	$scope.closeDialog = function(){
		$mdDialog.hide();
	}
});