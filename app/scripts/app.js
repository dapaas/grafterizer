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
    'lbServices',
    'ncy-angular-breadcrumb',
    'angularMoment'
  ])
  .config(function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider, $breadcrumbProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");

    // TODO enable in production
    // $locationProvider.html5Mode(true);

    $stateProvider
      .state('main', {
        url: '/',
        views: {
          main: {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
          } 
        },
        ncyBreadcrumb: {
          label: 'Home page'
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
        },
        ncyBreadcrumb: {
          label: 'Datapages'
        }
      })
      .state('transformations', {
        url: '/transformations',
        views: {
          main: {
            templateUrl: 'views/transformations.html',
            controller: 'TransformationsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Transformations'
        }
      })
      .state('transformations.new', {
        url: '/new',
        views: {
          "main@": {
            template: 'new'
          }
        },
        ncyBreadcrumb: {
          label: 'New transformation'
        }
      })
      .state('files', {
        url: '/files',
        views: {
          main: {
            templateUrl: 'views/files.html',
            controller: 'FilesCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Files'
        }
      })
      .state('files.file', {
        url: '/:id',
        views: {
          "main@": {
            templateUrl: 'views/file.html',
            controller: 'FileCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "File "+id}}'
        }
      });

    cfpLoadingBarProvider.includeSpinner = false;

    $breadcrumbProvider.setOptions({
      template:
        '<ol class="breadcrumb">'+
          '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">'+
            '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>'+
             '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>'+
          '</li>'+
        '</ol>'
    });
  });
