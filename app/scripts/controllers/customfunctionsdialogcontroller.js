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
      var docstring = '';
      var cpt = 0;
      do {
        name = randomA[Math.floor(Math.random() * randomA.length)] + '-' + randomB[Math.floor(Math.random() * randomB.length)];
      } while (_.find($scope.$parent.transformation.customFunctionDeclarations, function(v) { return v.name === name; }) && ++cpt < 10);

      $scope.emptyCustomFunction.name = name;
      $scope.emptyCustomFunction.clojureCode = '(defn ' + name + ' "" [] ())';
      //$scope.emptyCustomFunction.docstring = docstring;
      $scope.selectedCustomFunction = $scope.emptyCustomFunction;
      $scope.saveCustomFunct();
    };
    $scope.createNewText = function() {
    
      $mdDialog.show({
        templateUrl: 'views/createstringcustomfunction.html',
        controller: 'CustomStringfunctionsdialogcontrollerCtrl',
        scope: $scope.$new(false, $scope)
  })
    }; 
    var functionName = /\(defn?\s+([^\s\)]+)/i;
    $scope.$watch('selectedCustomFunction.clojureCode', function() {
      if (!$scope.selectedCustomFunction) return;
      var code = $scope.selectedCustomFunction.clojureCode;
      if (!code) return;

      var m = code.match(functionName);
      var d = code.match(/".*?"/g); 
      if (d) $scope.selectedCustomFunction.docstring = d[0].replace(/^"|"$/g, "");
      //console.log($scope.selectedCustomFunction.docstring);
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

    $scope.$watchCollection('$parent.transformation.customFunctionDeclarations', function() {
      $scope.functionsList = _.filter($scope.$parent.transformation.customFunctionDeclarations, function(f) {
        return !ignoredKeyWords.hasOwnProperty(f.name) || f.clojureCode;
      });
    });

    var ignoredKeyWords = {
      '+': true,
      '-': true,
      '*': true,
      '/': true,
      'empty?': true,
      'every?': true,
      'false?': true,
      'rational?': true,
      'string?': true,
      'true?': true,
      'zero?': true,
      'float?': true,
      'keyword?': true,
      'neg?': true,
      'nil?': true,
      'number?': true,
      'odd?': true,
      'pos?': true,
      'ratio?': true,
      'lower-case': true,
      'upper-case': true,
      reverse: true,
      trim: true,
      'trim-newline': true,
      triml: true,
      trimr: true,
      rem: true,
      boolean: true,
      count: true,
      cast: true,
      capitalize: true,
      dec: true,
      double: true,
      first: true,
      float: true,
      inc: true,
      keyword: true,
      last: true,
      long: true,
      name: true,
      second: true,
      short: true
    };
  });
