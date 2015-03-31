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
    'ui.router',
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
  .config(function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .state('upload', {
        url: '/upload',
        templateUrl: 'views/upload.html',
        controller: 'UploadCtrl'
      })
      .state('grid', {
        url: '/grid',
        templateUrl: 'views/grid.html',
        controller: 'GridCtrl'
      })
      .state('datapages', {
        url: '/datapages',
        templateUrl: 'views/datapages.html',
        controller: 'DatapagesCtrl'
      })
      .state('transformations', {
        url: '/transformations',
        templateUrl: 'views/transformations.html',
        controller: 'TransformationsCtrl'
      })
      .state('files', {
        url: '/files',
        templateUrl: 'views/files.html',
        controller: 'FilesCtrl'
      })
      .state('file', {
        url: '/file/:id',
        templateUrl: 'views/file.html',
        controller: 'FileCtrl'
      });

    cfpLoadingBarProvider.includeSpinner = false;
  });
