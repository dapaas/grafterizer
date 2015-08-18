'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:EditlibrariesCtrl
 * @description
 * # EditlibrariesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('EditlibrariesCtrl', function($scope, $mdDialog,
    transformationDataModel, $mdToast) {
    $scope.gridOpts = {
      onRegisterApi: function(gridApi) {
        $scope.gridApi = gridApi;
      },

      exporterMenuCsv: true,
      exporterMenuPdf: false,
      enableGridMenu: true,
      headerRowHeight: 82,
      rowHeight: 38,
      columnDefs: [
        {
          name: 'libRef'
        }
        ],
      data: []
    };
    for (var i = 0; i < $scope.$parent.transformation.libraries.length; ++i) {
      var library = $scope.$parent.transformation.libraries[i];

      $scope.gridOpts.data.push({
        libRef: library.name,
      });

    }

    $scope.applyLibrariesChanges = function() {
      $mdDialog.hide();
    };

    $scope.cancelLibrariesChanges = function() {
      $mdDialog.cancel();
    };

    $scope.removeSelectedLibraries = function() {
      var selectedRows = $scope.gridApi.selection.getSelectedRows();
      var i;

      for (i = 0; i < selectedRows.length; ++i) {
        if (!$scope.transformation.removeLibrary(selectedRows[i].libRef)) {
          $mdToast.show(
            $mdToast.simple()
            .content(
              'Error removing library. Model out of sync (library doesn\'t exist).'
            )
            .position('bottom left')
            .hideDelay(3000)
          );
        }
      }

      angular.forEach(selectedRows, function(data, index) {
        $scope.gridOpts.data.splice($scope.gridOpts.data.lastIndexOf(
          data), 1);
      });

    };

    $scope.addLibrary = function() {
      if (!$scope.libRef) {
        $mdToast.show(
          $mdToast.simple()
          .content(
            'Error adding library. No code provided for \'require\'.')
          .position('bottom left')
          .hideDelay(3000)
        );
        return;
      }

      if (!$scope.transformation.addLibrary($scope.libRef)) {
        $mdToast.show(
          $mdToast.simple()
          .content(
            'Error adding library.'
          )
          .position('bottom left')
          .hideDelay(3000)
        );
        return;
      }

      $scope.gridOpts.data.push({
        libRef: $scope.libRef
      });
    };
  });
