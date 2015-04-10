'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:FileCtrl
 * @description
 * # FileCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('FileCtrl', function (
    $scope,
    $stateParams,
    File,
    $rootScope,
    $state,
    $mdToast,
    $mdDialog) {

  	var id = $scope.id = $stateParams.id;

  	File.findById({
  		id: id
  	}, function(value){
  		// todo merge
  		$scope.document = {
  			title: value.name,
        description: value.description
  		};
  		var data = value.content;
	  	$scope.gridOptions = {
	  		//data: $rootScope.data ? $rootScope.data.data: null
	  		data: data ? data.data: null,
	  		columnDefs: data ? 
	  			_.map(data.meta.fields, function(f){return {name: f,width:Math.min(80+f.length*8, 250)};}) :
	  			[{name:'empty document', width:'100%'}]
	  	};
  	}, function(error){
      $mdToast.show(
        $mdToast.simple()
          .content('Error: '+error)
          .position('right top')
          .hideDelay(6000)
      );
  	});

    $rootScope.actions = {
      save: function(){
        File.prototype$updateAttributes({
          id: id
        }, {
          name: $scope.document.title,
          description: $scope.document.description
        });
      },
      delete: function(ev) {
        var confirm = $mdDialog.confirm()
          .title('Do you really want to delete this file?')
          .content('It\'s a nice file')
          .ariaLabel('Deletion confirmation')
          .ok('Please do it!')
          .cancel('Finally no, I like it')
          .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
          File.deleteById({id: id}).$promise.then(function(){
            $state.go('files');
            $mdToast.show(
              $mdToast.simple()
                .content('File "'+$scope.document.title+'" deleted')
                .position('right top')
                .hideDelay(6000)
            );
          });
        });
      }
    };
  });
