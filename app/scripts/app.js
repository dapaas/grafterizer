'use strict';

/**
 * @ngdoc overview
 * @name grafterizerApp
 * @description
 * # grafterizerApp
 *
 * Main module of the application.
 */
angular
  .module('grafterizerApp', [
    'ngMaterial',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularFileUpload',
    'ui.grid',
    'ui.grid.autoResize',
    'angular-loading-bar',
    'lbServices'
  ])
  .config(function ($routeProvider, cfpLoadingBarProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/upload', {
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl'
      })
      .when('/grid', {
        templateUrl: 'views/grid.html',
        controller: 'GridCtrl'
      })
      .when('/datapages', {
        templateUrl: 'views/datapages.html',
        controller: 'DatapagesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    cfpLoadingBarProvider.includeSpinner = false;
  });
