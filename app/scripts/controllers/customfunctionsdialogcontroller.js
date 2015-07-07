'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:CustomfunctionsdialogcontrollerCtrl
 * @description
 * # CustomfunctionsdialogcontrollerCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('CustomfunctionsdialogcontrollerCtrl', function(
    $scope, transformationDataModel, $mdToast, $mdDialog) {

    $scope.codemirrorOpts = {
      lineWrapping: true,
      lineNumbers: true,
      mode: 'clojure'
    };

    window.setTimeout(function() {
      _.each(document.getElementsByClassName('CodeMirror'), function(el) {
        el.CodeMirror.refresh();
      });
    }, 250);

    $scope.emptyCustomFunction = new transformationDataModel.CustomFunctionDeclaration(
      '', '');
    
    $scope.saveCustomFunct = function() {
      var customFunctionData = $scope.parseCustomFunctionCode($scope.selectedCustomFunction
        .clojureCode);

      var result = $scope.$parent.transformation
        .addCustomFunctionDeclaration(
          customFunctionData.name,
          customFunctionData.code);

      if (!result) {
        $mdToast.show(
          $mdToast.simple()
          .content('Modified existing custom function.')
          .position('bottom left')
          .hideDelay(2000)
        );
      } else {
        var indexOfNewFunct = $scope.$parent.transformation.customFunctionDeclarations
          .length - 1;
        $scope.selectedCustomFunction = $scope.$parent.transformation.customFunctionDeclarations[
          indexOfNewFunct];
      }

    };

    $scope.parseCustomFunctionCode = function(customCode) {
      var functionName;
      var tmp = customCode.split('defn');
      var tmp1 = customCode.split('def');
      if (tmp.length === 1 && tmp1.length === 1) {
        $mdToast.show(
          $mdToast.simple()
          .content(
            'Error parsing custom function: Neither \'defn\' nor \'def\' keyword found'
          )
          .position('bottom left')
          .hideDelay(3000)
        );
        return {};
      }

      tmp = tmp.length > 1 ? tmp : tmp1;

      tmp = tmp[1].trim();
      tmp = tmp.split(/\s+/);
      if (tmp.length === 1) {
        $mdToast.show(
          $mdToast.simple()
          .content(
            'Error parsing custom function: wrong function definition')
          .position('bottom left')
          .hideDelay(3000)
        );
        return {};
      }

      functionName = tmp[0];

      return {
        name: functionName,
        code: customCode
      };
    };

    $scope.applyCustomFunctionChanges = function() {
      $mdDialog.hide();
    };

    $scope.cancelCustomFunctionChanges = function() {
      $mdDialog.cancel();
    };

    $scope.removeCustomFunct = function(customFunct) {
      $scope.$parent.transformation.removeCustomFunctionDeclaration(
        customFunct);
      $scope.selectedCustomFunction = $scope.emptyCustomFunction;
    };

    $scope.createNewFunct = function() {
      $scope.emptyCustomFunction.name = '';
      $scope.emptyCustomFunction.clojureCode = '';
      $scope.selectedCustomFunction = $scope.emptyCustomFunction;
    };
  });
