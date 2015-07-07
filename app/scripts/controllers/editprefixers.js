'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:EditprefixersCtrl
 * @description
 * # EditprefixersCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('EditprefixersCtrl', function($scope, $mdDialog,
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
          name: 'prefixName'
        },
        {
          name: 'uri'
        }
        ],
      data: []
    };
    for (var i = 0; i < $scope.$parent.transformation.prefixers.length; ++i) {
      var prefixer = $scope.$parent.transformation.prefixers[i];

      //      console.log($scope.$parent.transformation.prefixers);
      $scope.gridOpts.data.push({
        prefixName: prefixer.name,
        uri: prefixer.uri
      });

    }

    $scope.applyPrefixersChanges = function() {
      $mdDialog.hide();
    };

    $scope.cancelPrefixersChanges = function() {
      $mdDialog.cancel();
    };

    $scope.removeSelectedPrefixers = function() {
      var selectedRows = $scope.gridApi.selection.getSelectedRows();
      var i;

      for (i = 0; i < selectedRows.length; ++i) {
        if (!$scope.transformation.removePrefixer(selectedRows[i].prefixName)) {
          $mdToast.show(
            $mdToast.simple()
            .content(
              'Error removing prefixer. Model out of sync (prefixer doesn\'t exist).'
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

    $scope.addPrefixer = function() {
      if (!$scope.prefixName) {
        $mdToast.show(
          $mdToast.simple()
          .content(
            'Error adding prefixer. No name provided for prefixer.')
          .position('bottom left')
          .hideDelay(3000)
        );
        return;
      }

      if (!$scope.prefixUri) {
        $mdToast.show(
          $mdToast.simple()
          .content('Error adding prefixer. No URI provided for prefixer.')
          .position('bottom left')
          .hideDelay(3000)
        );
        return;
      }

      if (!$scope.transformation.addPrefixer($scope.prefixName, $scope.prefixUri)) {
        $mdToast.show(
          $mdToast.simple()
          .content(
            'Error adding prefixer. Prefixer with the same name already exists.'
          )
          .position('bottom left')
          .hideDelay(3000)
        );
        return;
      }

      $scope.gridOpts.data.push({
        prefixName: $scope.prefixName,
        uri: $scope.prefixUri
      });
    };
  });
