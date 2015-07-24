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
          new transformationDataModel.CustomFunctionDeclaration('replace-varible-string', '(defn replace-varible-string [cell]   (-> cell  (clojure.string/replace (read-string "#\\".* #\\"") "number") (clojure.string/replace (read-string "#\\"[0-9]{4} \\"") "") ))',''),
          new transformationDataModel.CustomFunctionDeclaration('add-filename-to-column', '(defn add-filename-to-column [ds destination-column] (let [fname (:grafter.tabular/data-source (meta ds))] (add-column ds destination-column fname)))     ',''),
          new transformationDataModel.CustomFunctionDeclaration('organize-date', '(defn organize-date "Transform date dd/mm/yyyy ~> yyyy-mm-dd" [date] (when (seq date)  (let [[d m y] (clojure.string/split date  (read-string "#\\"/\\""))]  (apply str (interpose "-" [y m d])))))','Transform date dd/mm/yyyy ~> yyyy-mm-dd'),
          new transformationDataModel.CustomFunctionDeclaration('integer-literal', '(defn integer-literal [s] (Integer/parseInt s))','Coerce to integer'),
          new transformationDataModel.CustomFunctionDeclaration('fill-when', '','Takes a sequence of values and copies a value through the sequence depending on the supplied predicate function'),
          new transformationDataModel.CustomFunctionDeclaration('transform-gender', '(def transform-gender {"f" (s "female") "m" (s "male")})','Maps "f" to "female" and "m" to "male"'),
          new transformationDataModel.CustomFunctionDeclaration('stringToNumeric', '(defn stringToNumeric    [x] (if (= "" x) nil  (if (.contains x ".") (Double/parseDouble x)(Integer/parseInt x))))','Convert string to numeric'),
          new transformationDataModel.CustomFunctionDeclaration('string-literal', '(def string-literal s)','Coerce to string'),
          new transformationDataModel.CustomFunctionDeclaration('boolean', '','Coerce to boolean'),
          new transformationDataModel.CustomFunctionDeclaration('count', '','Returns the number of items in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('cast', '',' Throws a ClassCastException if x is not a c, else returns x'),
          new transformationDataModel.CustomFunctionDeclaration('capitalize',
        '','Converts first character of the string to upper-case, all other characters to lower-case.'),
          new transformationDataModel.CustomFunctionDeclaration('dec', '','Returns a number one less than num'),
          new transformationDataModel.CustomFunctionDeclaration('double', '','Coerce to double'),
          new transformationDataModel.CustomFunctionDeclaration('first', '','Returns the first item in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('float', '','Coerce to float'),
          new transformationDataModel.CustomFunctionDeclaration('inc', '','Returns a number one greater than num'),
          new transformationDataModel.CustomFunctionDeclaration('keyword', '','Returns a Keyword with the given namespace and name.  Do not use : in the keyword strings, it will be added automatically.'),
          new transformationDataModel.CustomFunctionDeclaration('last', '','Return the last item in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('long', '','Coerce to long'),
          new transformationDataModel.CustomFunctionDeclaration('name', '','Returns the name String of a string, symbol or keyword'),
          new transformationDataModel.CustomFunctionDeclaration('second', '','Returns the second item in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('short', '','Coerce to short'),
          new transformationDataModel.CustomFunctionDeclaration('join',
        '(defn join [& strings] (clojure.string/join " " strings))','Returns a string of all elements in the collection separated by space.'),
          new transformationDataModel.CustomFunctionDeclaration('lower-case',
        '','Converts string to all lower-case'),
          new transformationDataModel.CustomFunctionDeclaration('upper-case',
        '','Converts string to all upper-case'),
          new transformationDataModel.CustomFunctionDeclaration('reverse', '','Returns given string with its characters reversed'),
          new transformationDataModel.CustomFunctionDeclaration('trim', '','Removes whitespace from both ends of string'),
          new transformationDataModel.CustomFunctionDeclaration('trim-newline',
        '','Removes all trailing newline \n or return \r characters from string'),
          new transformationDataModel.CustomFunctionDeclaration('triml', '','Removes whitespace from the left side of string'),
          new transformationDataModel.CustomFunctionDeclaration('trimr', '','Removes whitespace from the right side of string'),
          new transformationDataModel.CustomFunctionDeclaration('rem', '','Returns remainder of dividing numerator by denominator')];
    customfunctions.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;

      } else {
        return -1;
      }

    });

    var predicatefunctions = [new transformationDataModel.CustomFunctionDeclaration(
        'empty?', '','Returns true if given collection has no items'),new transformationDataModel.CustomFunctionDeclaration(
        'every?', '','Returns true if first argument predicate is logical true for every x in collection, else false'),new transformationDataModel.CustomFunctionDeclaration(
        'false?', '','Returns true if given value is the value false, false otherwise'),new transformationDataModel.CustomFunctionDeclaration(
        'float?', '','Returns true if given value is a floating point number'),new transformationDataModel.CustomFunctionDeclaration(
        'keyword?', '','Return true if given argument is a Keyword'),new transformationDataModel.CustomFunctionDeclaration(
        'neg?', '','Returns true if argument is less than zero, else false'),new transformationDataModel.CustomFunctionDeclaration(
        'nil?', '','Returns true if argument is nil, false otherwise'),new transformationDataModel.CustomFunctionDeclaration(
        'number?', '','Returns true if argument is a Number'),new transformationDataModel.CustomFunctionDeclaration(
        'odd?', '','Returns true if argument is odd, throws an exception if it is not an integer'),new transformationDataModel.CustomFunctionDeclaration(
        'pos?', '','Returns true if argument is greater than zero, else false'),new transformationDataModel.CustomFunctionDeclaration(
        'ratio?', '','Returns true if argument is a Ratio'),new transformationDataModel.CustomFunctionDeclaration(
        'rational?', '','Returns true if argument is a rational number'),new transformationDataModel.CustomFunctionDeclaration(
        'string?', '','Return true if argument is a String'),new transformationDataModel.CustomFunctionDeclaration(
        'true?', '','Returns true if argument is the value true, false otherwise'),new transformationDataModel.CustomFunctionDeclaration(
        'zero?', '','Returns true if argument is zero, else false')];

    var numericcustomfunctions = [new transformationDataModel.CustomFunctionDeclaration(
        '+', '',''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '-', '',''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '*', '',''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '/', '','')];

    var allcustomfunctions = customfunctions.concat(predicatefunctions.concat(numericcustomfunctions));
    $scope.clojure = '';
    $scope.pipeline = new transformationDataModel.Pipeline([]);
    $scope.transformation = new transformationDataModel.Transformation(
      allcustomfunctions, [], [$scope.pipeline], []);
  $rootScope.transformation = $scope.transformation;


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

    $scope.editLibraries = function() {
      $scope.originalLibraries = [];
      angular.copy($scope.transformation.libraries, $scope.originalLibraries);
      $mdDialog.show({
        templateUrl: 'views/editlibraries.html',
        controller: 'EditlibrariesCtrl',
        scope: $scope.$new(false, $scope)
      }).then(
      function() {},

      function() {
        angular.copy($scope.originalLibraries, $scope.transformation.libraries);
      });
    };


    $scope.editRDFPrefixes = function(){
      $mdDialog.show({
        templateUrl: 'views/MappingPrefixManage.html',
        controller: 'MappingPrefixManageCtrl',
        scope: $scope.$new(false, $scope)
      })
    }


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
