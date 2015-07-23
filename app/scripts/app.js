'use strict';

/**
 * @ngdoc overview
 * @name grafterizerApp
 * @description
 * # Grafterizer
 *
 * This file contains the declaration of the application dependencies,
 * and the modules settings.
 *
 * The theme is defined here, as well as the routing (using a state machine).
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
    'ncy-angular-breadcrumb',
    'angularMoment',
    'ui.sortable',
    'ui.codemirror',
    'ui.grid.selection',
    'ui.grid.edit',
    'ui.grid.resizeColumns',
    'ui.grid.exporter',
    'ngMessages',
    'RecursionHelper',
    'vAccordion'

    //'http-auth-interceptor'
])
  .config(function(
    ontotextAPIProvider,
    PipeServiceProvider,
    $mdThemingProvider,
    $stateProvider,
    $urlRouterProvider,
    $urlMatcherFactoryProvider,
    cfpLoadingBarProvider,
    $breadcrumbProvider,
    $locationProvider) {

    ontotextAPIProvider.setEndpoint('http://ec2-54-76-140-62.eu-west-1.compute.amazonaws.com:8080');

    PipeServiceProvider.setEndpoint(
      window.location.origin === 'http://localhost:9000' ?
      'http://ec2-54-154-72-62.eu-west-1.compute.amazonaws.com:8080'
      : '/backend');

    var urlBase = $urlRouterProvider.otherwise('/transformations/new');

    sessionStorage.localClassAndProperty = JSON.stringify([]);
    sessionStorage.localVocabulary = JSON.stringify([]);

    if (!window.navigator.device &&
      window.location.origin !== 'http://localhost:9000') {
      $locationProvider.html5Mode(true);
    }

    // Workaround for https://github.com/angular-ui/ui-router/issues/1119
    var valToString = function(val) {
      return val !== null ? val.toString() : val;
    };

    $urlMatcherFactoryProvider.type('nonURIEncoded', {
      encode: valToString,
      decode: valToString,
      is: function() {
        return true;
      }
    });

    $stateProvider
      .state('about', {
        url: '/about',
        views: {
          main: {
            templateUrl: 'views/about.html'
          }
        },
        ncyBreadcrumb: {
          label: 'About'
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
          label: 'Data transformations'
        }
      })
      .state('transformations.new', {
        url: '/new',
        views: {
          'main@': {
            controller: 'TransformationNewCtrl',
            templateUrl: 'views/transformation.html'
          },
          'actions@': {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "New transformation"}}'
        }
      })
      .state('transformations.transformation', {
        url: '/{id:nonURIEncoded}',
        views: {
          'main@': {
            templateUrl: 'views/transformation.html',
            controller: 'TransformationCtrl'
          },
          'actions@': {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "File "+id}}'
        }
      })
      .state('transformations.transformation.preview', {
        url: '^/preview/{id:nonURIEncoded}',
        url: '^/transform/{id:nonURIEncoded}',
        params: {
          distribution: null
        },
        views: {
          preview: {
            templateUrl: 'views/preview.html',
            controller: 'PreviewCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{(selectedDistribution || "Preview")|beautifyUri}}'
        }
      })
      .state('datasets', {
        url: '/datasets',
        views: {
          'main@': {
            templateUrl: 'views/datasets.html',
            controller: 'DatasetsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Datasets'
        }
      })
      .state('datasets.dataset', {
        url: '/datasets/{id:nonURIEncoded}',
        views: {
          'main@': {
            templateUrl: 'views/dataset.html',
            controller: 'DatasetCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || id}}'
        }
      })
      .state('distribution', {
        url: '/distribution/{id:nonURIEncoded}',
        views: {
          'main@': {
            templateUrl: 'views/distribution.html',
            controller: 'DistributionCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || id}}'
        }
      })
      .state('embedded', {
        url: '/embedded',
        views: {
          main: true
        },
        ncyBreadcrumb: {
          label: 'Loading'
        }
      })
      .state('apikey', {
        url: '/apiKey',
        views: {
          main: {
            templateUrl: 'views/apikey.html',
            controller: 'ApikeyCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'API Key'
        }
      });

    // The spinner is a bit too much
    cfpLoadingBarProvider.includeSpinner = false;

    // Breadcrumb settings using material-style
    $breadcrumbProvider.setOptions({
      template: '<ol class="breadcrumb">' +
        '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
        '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>' +
        '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
        '</li>' +
        '</ol>'
    });

    // Theme settings

    $mdThemingProvider.definePalette('customPrimary', {
      50: '#a9b2d7',
      100: '#97a2cf',
      200: '#8693c6',
      300: '#7583be',
      400: '#6374b6',
      500: '#5264AE',
      600: '#495a9d',
      700: '#41508c',
      800: '#39467a',
      900: '#313c69',
      A100: '#bac1df',
      A200: '#ccd1e7',
      A400: '#dde0ef',
      A700: '#293258',
      contrastDefaultColor: 'light'
    });

    $mdThemingProvider.definePalette('customAccent', {
      50: '#333333',
      100: '#333333',
      200: '#333333',
      300: '#f7fcfc',
      400: '#e4f4f5',
      500: '#EEEEEE',
      600: '#bfe6e7',
      700: '#addee0',
      800: '#9ad7d9',
      900: '#88cfd2',
      A100: '#EEEEEE',
      A200: '#EEEEEE',
      A400: '#EEEEEE',
      A700: '#75c8cb',
      contrastDefaultColor: 'dark'
    });

    $mdThemingProvider.definePalette('dapaasPrimary', {
      50: '#67ffa0',
      100: '#4eff90',
      200: '#34ff80',
      300: '#1bff70',
      400: '#01ff60',
      500: '#00E756',
      600: '#00cd4c',
      700: '#00b443',
      800: '#009a3a',
      900: '#008130',
      A100: '#81ffb0',
      A200: '#9affc0',
      A400: '#b4ffd0',
      A700: '#006727',
      contrastDefaultColor: 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('customPrimary')
      .accentPalette('customAccent');

      // .primaryPalette('dapaasPrimary')

    // JSEDN is too restrictive by default on valid symbols
    jsedn.Symbol.prototype.validRegex = new RegExp(/.*/);
  }).run(function(datagraftPostMessage, apiKeyService, $state) {
    datagraftPostMessage.setup();

    if (!apiKeyService.hasKeyPass()) {
      window.setTimeout(function() {
        if (!apiKeyService.hasKeyPass()) {
          $state.go('apikey');
        }
      }, 2000);
    }
  });
