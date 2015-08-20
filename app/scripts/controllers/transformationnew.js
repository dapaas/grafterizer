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
          new transformationDataModel.CustomFunctionDeclaration('replace-varible-string',
        '(defn replace-varible-string [cell]   (-> cell  (clojure.string/replace (read-string "#\\".* #\\"") "number") (clojure.string/replace (read-string "#\\"[0-9]{4} \\"") "") ))',
        'SERVICE', ''),
          new transformationDataModel.CustomFunctionDeclaration('add-filename-to-column',
        '(defn add-filename-to-column [ds destination-column] (let [fname (:grafter.tabular/data-source (meta ds))] (add-column ds destination-column fname)))     ',
        'SERVICE', ''),
          new transformationDataModel.CustomFunctionDeclaration('remove-columns',
        '(defn remove-columns [ds cols] (columns ds (remove (fn [item] (some (fn [a] (= item a)) cols )) (column-names ds)))) ',
        'SERVICE', 'Given a dataset and collection of column names narrows dataset to all but specified columns'),
          new transformationDataModel.CustomFunctionDeclaration('organize-date',
        '(defn organize-date "Transform date dd/mm/yyyy ~> yyyy-mm-dd" [date] (when (seq date)  (let [[d m y] (clojure.string/split date  (read-string "#\\"/\\""))]  (apply str (interpose "-" [y m d])))))',
        'DATE FUNCTIONS', 'Transform date dd/mm/yyyy ~> yyyy-mm-dd'),
          new transformationDataModel.CustomFunctionDeclaration('double-literal',
        '(defn integer-literal [s] (Double/parseDouble s))', 'CONVERT DATATYPE', 'Coerce to integer'),
          new transformationDataModel.CustomFunctionDeclaration('integer-literal',
        '(defn integer-literal [s] (Integer/parseInt s))', 'CONVERT DATATYPE', 'Coerce to integer'),
          new transformationDataModel.CustomFunctionDeclaration('fill-when', '', 'SERVICE',
        'Takes a sequence of values and copies a value through the sequence depending on the supplied predicate function'
      ),
          new transformationDataModel.CustomFunctionDeclaration('transform-gender',
        '(def transform-gender {"f" (s "female") "m" (s "male")})', 'UTILITY',
        'Maps "f" to "female" and "m" to "male"'),
          new transformationDataModel.CustomFunctionDeclaration('stringToNumeric',
        '(defn stringToNumeric    [x] (if (= "" x) nil  (if (.contains x ".") (Double/parseDouble x)(Integer/parseInt x))))',
        'CONVERT DATATYPE', 'Convert string to numeric'),
          new transformationDataModel.CustomFunctionDeclaration('string-literal', '(def string-literal s)',
        'CONVERT DATATYPE', 'Coerce to string'),
          new transformationDataModel.CustomFunctionDeclaration('boolean', '', 'CONVERT DATATYPE', 'Coerce to boolean'),
          new transformationDataModel.CustomFunctionDeclaration('count', '', 'COLLECTION',
        'Returns the number of items in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('cast', '', 'CONVERT DATATYPE',
        ' Throws a ClassCastException if x is not a c, else returns x'),
          new transformationDataModel.CustomFunctionDeclaration('capitalize',
        '', 'STRING', 'Converts first character of the string to upper-case, all other characters to lower-case.'),
          new transformationDataModel.CustomFunctionDeclaration('dec', '', 'NUMBER',
        'Returns a number one less than num'),
          new transformationDataModel.CustomFunctionDeclaration('double', '', 'CONVERT DATATYPE', 'Coerce to double'),
          new transformationDataModel.CustomFunctionDeclaration('first', '', 'COLLECTION',
        'Returns the first item in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('float', '', 'CONVERT DATATYPE', 'Coerce to float'),
          new transformationDataModel.CustomFunctionDeclaration('inc', '', 'NUMBER',
        'Returns a number one greater than num'),
          new transformationDataModel.CustomFunctionDeclaration('keyword', '', 'CONVERT DATATYPE',
        'Returns a Keyword with the given namespace and name. '),
          new transformationDataModel.CustomFunctionDeclaration('last', '', 'COLLECTION',
        'Return the last item in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('long', '', 'CONVERT DATATYPE', 'Coerce to long'),
          new transformationDataModel.CustomFunctionDeclaration('name', '', 'CONVERT DATATYPE',
        'Returns the name String of a string, symbol or keyword'),
          new transformationDataModel.CustomFunctionDeclaration('second', '', 'COLLECTION',
        'Returns the second item in the collection'),
          new transformationDataModel.CustomFunctionDeclaration('short', '', 'CONVERT DATATYPE', 'Coerce to short'),
          new transformationDataModel.CustomFunctionDeclaration('join',
        '(defn join [& strings] (clojure.string/join " " strings))', 'STRING',
        'Returns a string of all elements in the collection separated by space.'),
          new transformationDataModel.CustomFunctionDeclaration('lower-case',
        '', 'STRING', 'Converts string to all lower-case'),
          new transformationDataModel.CustomFunctionDeclaration('upper-case',
        '','STRING','Converts string to all upper-case'),
          new transformationDataModel.CustomFunctionDeclaration('reverse', '','STRING','Returns given string with its characters reversed'),
          new transformationDataModel.CustomFunctionDeclaration('string-as-keyword', '(defn string-as-keyword [s] (when (seq s) (->   s   (clojure.string/replace " " "_") (clojure.string/replace ":" "") (clojure.string/replace "\\"" ""))))','STRING','Removes blanks, double quotes and colons in a string thus making it possible to use it as a keyword'),
          new transformationDataModel.CustomFunctionDeclaration('remove-blanks', '(defn remove-blanks [s]  (when (seq s)  (clojure.string/replace s " " "")))','STRING','Removes blanks in a string'),
          new transformationDataModel.CustomFunctionDeclaration('titleize', '(defn titleize [st] (when (seq st) (let [a (clojure.string/split st (read-string "#\\" \\"")) c (map clojure.string/capitalize a)]  (->> c (interpose " ") (apply str) trim))))','STRING','Capitalizes each word in a string'),
          new transformationDataModel.CustomFunctionDeclaration('trim', '','STRING','Removes whitespace from both ends of string'),
          new transformationDataModel.CustomFunctionDeclaration('trim-newline',
        '', 'STRING', 'Removes all trailing newline \n or return \r characters from string'),
          new transformationDataModel.CustomFunctionDeclaration('triml', '', 'STRING',
        'Removes whitespace from the left side of string'),
          new transformationDataModel.CustomFunctionDeclaration('trimr', '', 'STRING',
        'Removes whitespace from the right side of string'),
          new transformationDataModel.CustomFunctionDeclaration('rem', '', 'NUMBER',
        'Returns remainder of dividing numerator by denominator')];
    customfunctions.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;

      } else {
        return -1;
      }

    });

    var predicatefunctions = [new transformationDataModel.CustomFunctionDeclaration(
        'empty?', '', 'PREDICATE', 'Returns true if given collection has no items'), new transformationDataModel.CustomFunctionDeclaration(
        'every?', '', 'PREDICATE',
        'Returns true if first argument predicate is logical true for every x in collection, else false'), new transformationDataModel
      .CustomFunctionDeclaration(
        'false?', '', 'PREDICATE', 'Returns true if given value is the value false, false otherwise'), new transformationDataModel
      .CustomFunctionDeclaration(
        'float?', '', 'PREDICATE', 'Returns true if given value is a floating point number'), new transformationDataModel
      .CustomFunctionDeclaration(
        'keyword?', '', 'PREDICATE', 'Return true if given argument is a Keyword'), new transformationDataModel.CustomFunctionDeclaration(
        'neg?', '', 'PREDICATE', 'Returns true if argument is less than zero, else false'), new transformationDataModel
      .CustomFunctionDeclaration(
        'nil?', '', 'PREDICATE', 'Returns true if argument is nil, false otherwise'), new transformationDataModel.CustomFunctionDeclaration(
        'number?', '', 'PREDICATE', 'Returns true if argument is a Number'), new transformationDataModel.CustomFunctionDeclaration(
        'odd?', '', 'PREDICATE', 'Returns true if argument is odd, throws an exception if it is not an integer'), new transformationDataModel
      .CustomFunctionDeclaration(
        'pos?', '', 'PREDICATE', 'Returns true if argument is greater than zero, else false'), new transformationDataModel
      .CustomFunctionDeclaration(
        'ratio?', '', 'PREDICATE', 'Returns true if argument is a Ratio'), new transformationDataModel.CustomFunctionDeclaration(
        'rational?', '', 'PREDICATE', 'Returns true if argument is a rational number'), new transformationDataModel.CustomFunctionDeclaration(
        'string?', '', 'PREDICATE', 'Return true if argument is a String'), new transformationDataModel.CustomFunctionDeclaration(
        'true?', '', 'PREDICATE', 'Returns true if argument is the value true, false otherwise'), new transformationDataModel
      .CustomFunctionDeclaration(
        'zero?', '', 'PREDICATE', 'Returns true if argument is zero, else false')];

    var numericcustomfunctions = [new transformationDataModel.CustomFunctionDeclaration(
        '+', '', 'NUMBER', ''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '-', '', 'NUMBER', ''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '*', '', 'NUMBER', ''),
                                    new transformationDataModel.CustomFunctionDeclaration(
        '/', '', 'NUMBER', '')];

    var allcustomfunctions = customfunctions.concat(predicatefunctions.concat(numericcustomfunctions));
    $scope.clojure = '';

    //Initial functions: Make dataset with first row from header and rename columns as keywords to allow referring to them
    var j;
    for (j = 0; j < customfunctions.length; ++j)
      if (customfunctions[j].name === 'keyword') break;
    
    $scope.pipeline = new transformationDataModel.Pipeline([/*makeds,renamecols*/]);
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

    $scope.defineStringCustomFunctions = function() {
      $mdDialog.show({
        templateUrl: 'views/createstringcustomfunction.html',
        controller: 'CustomStringfunctionsdialogcontrollerCtrl',
        scope: $scope.$new(false, $scope)
      });
    };

    $scope.hideUploadButton = true;
  });
