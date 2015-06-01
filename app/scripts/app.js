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
    'ngFileUpload',
    'ui.grid',
    'ui.grid.autoResize',
    'angular-loading-bar',
    'lbServices',
    'ncy-angular-breadcrumb',
    'angularMoment',
    'http-auth-interceptor',
    'ui.sortable'
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
            controller: 'TransformationNewCtrl',
            templateUrl: 'views/transformation.html'
          },
          "actions@": {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'New transformation'
        }
      })
      .state('transformations.transformation', {
        url: '/:id',
        views: {
          "main@": {
            templateUrl: 'views/transformation.html',
            controller: 'TransformationCtrl'
          },
          "actions@": {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "File "+id}}'
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
          },
          "actions@": {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "File "+id}}'
        }
      })
      .state('demo', {
        url: '/demo',
        views: {
          "main@": {
            templateUrl: 'views/demo.html',
            controller: 'DemoCtrl'
          },
          "actions@": {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Demo'
        }
      })
      .state('screenshot', {
        url: '/screenshot',
        views: {
          "main@": {
            templateUrl: 'views/screenshot.html',
            controller: 'DemoCtrl'
          }
        }
      })
      .state('distributions', {
        url: '/distributions',
        views: {
          "main@": {
            templateUrl: 'views/distributions.html',
            controller: 'DistributionsCtrl'
          }
        }
      })
      .state('datasets', {
        url: '/datasets',
        views: {
          "main@": {
            templateUrl: 'views/datasets.html',
            controller: 'DatasetsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Datasets'
        }
      })
      .state('datasets.dataset', {
        url: '/datasets/:id',
        views: {
          "main@": {
            templateUrl: 'views/dataset.html',
            controller: 'DatasetCtrl'
          }//,
          // "actions@": {
          //   templateUrl: 'views/actions.html',
          //   controller: 'ActionsCtrl'
          // }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "Dataset "+id}}'
        }
      })

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
