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
      mode: 'clojure',
      theme: 'monokai'
    };

    window.setTimeout(function() {
      _.each(document.getElementsByClassName('CodeMirror'), function(el) {
        el.CodeMirror.refresh();
      });
    }, 250);

    $scope.emptyCustomFunction = new transformationDataModel.CustomFunctionDeclaration(
      '', '');
    
    $scope.saveCustomFunct = function() {
      // var customFunctionData = $scope.parseCustomFunctionCode($scope.selectedCustomFunction
        // .clojureCode);

      var result = $scope.$parent.transformation
        .addCustomFunctionDeclaration(
          $scope.selectedCustomFunction.name,
          $scope.selectedCustomFunction.clojureCode);
          // customFunctionData.name,
          // customFunctionData.code);

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

    /*$scope.parseCustomFunctionCode = function(customCode) {
      var functionName;
      var tmp = customCode.split('defn');
      var tmp1 = customCode.split('def');
      if (tmp.length === 1 && tmp1.length === 1) {
        return {};
      }

      tmp = tmp.length > 1 ? tmp : tmp1;

      tmp = tmp[1].trim();
      tmp = tmp.split(/\s+/);
      if (tmp.length === 1) {
        return {};
      }

      functionName = tmp[0];

      return {
        name: functionName,
        code: customCode
      };
    };*/

    /*var functionNameRegex = /\(defn?\s+([^\s\)]+)/i;
    $scope.parseCustomFunctionCode = function(customCode) {
      var m = customCode.match(functionNameRegex);

      if (!m) {
        return {};
      }

      return {
        name: m[1],
        code: customCode
      };
    };*/

    $scope.applyCustomFunctionChanges = function() {
      $mdDialog.hide();
    };

    $scope.cancelCustomFunctionChanges = function() {
      $mdDialog.cancel();
    };

    $scope.removeCustomFunct = function(customFunct) {
      $scope.$parent.transformation.removeCustomFunctionDeclaration(
        customFunct);
      $scope.selectedCustomFunction = $scope.emptyCustomFunction = new transformationDataModel.CustomFunctionDeclaration(
      '', '');
    };

    var randomA = ['convert', 'do', 'analyse', 'parse', 'process', 'ignore', 'compute', 'apply'];
    var randomB = ['method', 'value', 'object', 'world', 'data', 'data', 'life', 'rabbit'];
    $scope.createNewFunct = function() {
      var name = '';
      var cpt = 0;
      do {
        name = randomA[Math.floor(Math.random() * randomA.length)] + '-' + randomB[Math.floor(Math.random() * randomB.length)];
      } while (_.find($scope.$parent.transformation.customFunctionDeclarations, function(v) { return v.name === name; }) && ++cpt < 10);

      $scope.emptyCustomFunction.name = name;
      $scope.emptyCustomFunction.clojureCode = '(defn ' + name + ' [] ())';
      $scope.selectedCustomFunction = $scope.emptyCustomFunction;
      $scope.saveCustomFunct();
    };

    var functionName = /\(defn?\s+([^\s\)]+)/i;

    $scope.$watch('selectedCustomFunction.clojureCode', function() {
      if (!$scope.selectedCustomFunction) return;
      var code = $scope.selectedCustomFunction.clojureCode;
      if (!code) return;

      var m = code.match(functionName);
      if (m) {
        var name = m[1];
        if (!$scope.selectedCustomFunction.name) {
          $scope.selectedCustomFunction.name = name;
          $scope.saveCustomFunct();
        } else {
          $scope.selectedCustomFunction.name = name;
          var found = _.find($scope.$parent.transformation.customFunctionDeclarations, function(v) {
            return v.clojureCode !== $scope.selectedCustomFunction.clojureCode && v.name === name;
          });
          
          $scope.selectedCustomFunction.nameWarning = !!found;
        }
      }

    });
  });
