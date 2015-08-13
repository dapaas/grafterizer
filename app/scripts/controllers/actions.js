'use strict';

angular.module('grafterizerApp')
  .controller('ActionsCtrl', function($scope, $rootScope, $state) {

    $rootScope.$watch('actions', function() {
      for (var key in $rootScope.actions) {
        $scope[key] = $rootScope.actions[key];
      }
    });

    $rootScope.$on('addAction', function(ev, data) {
      $scope[data.name] = data.callback;
    });

    $rootScope.$on('removeAction', function(ev, data) {
      delete $scope[data];
    });

    $scope.$on('$destroy', function() {
      delete $rootScope.actions;
    });

    $scope.isIframe = window !== window.top;
  });
