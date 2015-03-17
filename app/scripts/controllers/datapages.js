'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:DatapagesCtrl
 * @description
 * # DatapagesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('DatapagesCtrl', function ($scope, datapagesResource, $rootScope) {
  	$rootScope.title = 'Data pages';
  	$rootScope.sectionTitle = null;
  	
  	$scope.datapages = _.values(datapagesResource.query()); 
  });
