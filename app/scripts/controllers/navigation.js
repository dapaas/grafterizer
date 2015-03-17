'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('NavigationCtrl', function ($mdSidenav, $q) {

  	this.toggleSideMenu = function() {
		$mdSidenav('left').toggle();
  	};
  });
