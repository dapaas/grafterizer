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
        views: {
          main: {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          } 
        }
      })
      .state('about', {
        url: '/about',
        views: {
          main: {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
          }
        }
      })
      .state('upload', {
        url: '/upload',
        views: {
          main: {
            templateUrl: 'views/upload.html',
            controller: 'UploadCtrl'
          }
        }
      })
      .state('grid', {
        url: '/grid',
        views: {
          main: {
            templateUrl: 'views/grid.html',
            controller: 'GridCtrl'
          }
        }
      })
      .state('datapages', {
        url: '/datapages',
        views: {
          main: {
            templateUrl: 'views/datapages.html',
            controller: 'DatapagesCtrl'
          }
        }
      })
      .state('transformations', {
        url: '/transformations',
        views: {
          main: {
            templateUrl: 'views/transformations.html',
            controller: 'TransformationsCtrl'
          }
        }
      })
      .state('files', {
        url: '/files',
        views: {
          main: {
            templateUrl: 'views/files.html',
            controller: 'FilesCtrl'
          }
        }
      })
      .state('files.file', {
        url: '^/file/:id',
        views: {
          "main@": {
            templateUrl: 'views/file.html',
            controller: 'FileCtrl'
          }
        }
      });

    cfpLoadingBarProvider.includeSpinner = false;
  });
