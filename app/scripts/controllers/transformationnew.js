'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:TransformationnewCtrl
 * @description
 * # TransformationnewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('TransformationNewCtrl', function(
    $scope,
    $stateParams,
    ontotextAPI,
    $rootScope,
    $state,
    $mdToast,
    $mdDialog,
    transformationDataModel,
    generateClojure) {

    $scope.document = {
      title: 'New transformation',
      description: ''
    };

    var customfunctions = [
        new transformationDataModel.CustomFunctionDeclaration("integer-literal", "(defn integer-literal [s] (Integer/parseInt s))"),
        'integer-literal', '(defn integerColumn [s] (Integer/parseInt s))'),
        new transformationDataModel.CustomFunctionDeclaration("transform-gender", '(def transform-gender {"f" (s "female") "m" (s "male")})'),
        'string-literal', '(def string-literal s)'),
          new transformationDataModel.CustomFunctionDeclaration('boolean', ''),
          new transformationDataModel.CustomFunctionDeclaration('count', ''),
          new transformationDataModel.CustomFunctionDeclaration('cast', ''),
          new transformationDataModel.CustomFunctionDeclaration('capitalize',
        ''),
          new transformationDataModel.CustomFunctionDeclaration('dec', ''),
          new transformationDataModel.CustomFunctionDeclaration('double', ''),
          new transformationDataModel.CustomFunctionDeclaration('first', ''),
          new transformationDataModel.CustomFunctionDeclaration('float', ''),
          new transformationDataModel.CustomFunctionDeclaration('inc', ''),
          new transformationDataModel.CustomFunctionDeclaration('keyword', ''),
          new transformationDataModel.CustomFunctionDeclaration('last', ''),
          new transformationDataModel.CustomFunctionDeclaration('long', ''),
          new transformationDataModel.CustomFunctionDeclaration('name', ''),
          new transformationDataModel.CustomFunctionDeclaration('second', ''),
          new transformationDataModel.CustomFunctionDeclaration('short', ''),
          new transformationDataModel.CustomFunctionDeclaration('join',
        '(defn join [& strings] (clojure.string/join " " strings))'),
          new transformationDataModel.CustomFunctionDeclaration('lower-case',
        ''),
          new transformationDataModel.CustomFunctionDeclaration('upper-case',
        ''),
          new transformationDataModel.CustomFunctionDeclaration('reverse', ''),
          new transformationDataModel.CustomFunctionDeclaration('trim', ''),
          new transformationDataModel.CustomFunctionDeclaration('trim-newline',
        ''),
          new transformationDataModel.CustomFunctionDeclaration('triml', ''),
          new transformationDataModel.CustomFunctionDeclaration('trimr', ''),
          new transformationDataModel.CustomFunctionDeclaration('rem', '')];
    customfunctions.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;

      } else {
        return -1;
      }

    });

    var numericcustomfunctions = [new transformationDataModel.CustomFunctionDeclaration(
        '+', ''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '-', ''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '*', ''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '/', '')];

    var allcustomfunctions = customfunctions.concat(numericcustomfunctions);
    $scope.clojure = '';
    $scope.pipeline = new transformationDataModel.Pipeline([]);
    $scope.transformation = new transformationDataModel.Transformation(
      allcustomfunctions, [], [$scope.pipeline], []);

    $rootScope.actions = {
      save: function() {
        var clojure = generateClojure.fromTransformation($scope.transformation);

        var transformationType = 'pipe';
        var transformationCommand = 'my-pipe';

        if ($scope.transformation.graphs &&
          $scope.transformation.graphs.length !== 0) {
          transformationType = 'graft';
          transformationCommand = 'my-graft';
        }

        ontotextAPI.newTransformation({
            '@context': ontotextAPI.getContextDeclaration(),
            '@type': 'dcat:Transformation',
            'dct:title': $scope.document.title,
            'dct:description': $scope.document.description,
            'dcat:public': $scope.document['dct:public'] ? 'true' : 'false',
            'dct:modified': moment().format('YYYY-MM-DD'),
            'dcat:transformationType': transformationType,
            'dcat:transformationCommand': transformationCommand
          }, clojure, $scope.transformation)
          .success(function(data) {
            $mdToast.show(
              $mdToast.simple()
              .content('Transformation saved')
              .position('bottom left')
              .hideDelay(6000)
            );
            $state.go('transformations.transformation', {
              id: data['@id']
            });
          });
      }
    };
    $scope.$watch('fileUpload', function() {
      if ($scope.fileUpload) {
        $mdToast.show(
          $mdToast.simple()
          .content('You need to save the transformation first')
          .position('bottom left')
          .hideDelay(6000)
        );
      }
    });

    $scope.editPrefixers = function() {
      $scope.originalPrefixers = [];
      angular.copy($scope.transformation.prefixers, $scope.originalPrefixers);
      $mdDialog.show({
        templateUrl: 'views/editprefixes.html',
        controller: 'EditprefixersCtrl',
        scope: $scope.$new(false, $scope)
      }).then(
      function() {},

      function() {
        angular.copy($scope.originalPrefixers, $scope.transformation.prefixers);
      });
    };

    $scope.defineCustomFunctions = function() {
      $scope.originalCustomFunctionDeclarations = [];
      angular.copy($scope.transformation.customFunctionDeclarations, $scope
        .originalCustomFunctionDeclarations);
      
      $mdDialog.show({
        templateUrl: 'views/createcustomfunction.html',
        controller: 'CustomfunctionsdialogcontrollerCtrl',
        scope: $scope.$new(false, $scope)
      }).then(
      function() {},

      function() {
        angular.copy($scope.originalCustomFunctionDeclarations, $scope.transformation
          .customFunctionDeclarations);
      });
    };
  });
