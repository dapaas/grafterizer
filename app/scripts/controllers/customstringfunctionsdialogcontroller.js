'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:CustomStringfunctionsdialogcontrollerCtrl
 * @description
 * # CustomStringfunctionsdialogcontrollerCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('CustomStringfunctionsdialogcontrollerCtrl', function(
    $scope, transformationDataModel, $mdToast, $mdDialog) {

    $scope.functionCodeOptions = {
        name: '',
        docstring: '',
        textCaseOption: '',
        textTrimOption: '',
        substr: [null,null],
        replaceMap: [null,null]
    };
        
    $scope.getMapLength = function(num) {
            var b = new Array();
            for (var i =0;i<=num/2;i+=2) b.push(i);
            return b;
        };


    $scope.emptyCustomFunction = new transformationDataModel.CustomFunctionDeclaration(
      '', '');
    $scope.saveCustomFunct = function() {
        if (!$scope.functionCodeOptions.name) $scope.functionCodeOptions.name = 'transform-text';
        if (!$scope.functionCodeOptions.docstring) $scope.functionCodeOptions.docstring = 'Transforms text';
        
        var options = $scope.functionCodeOptions;
        var functionCode = '(defn '+options.name+' "'+options.docstring+'" [s] (when (seq s) (->   s ' + 
                        options.textCaseOption + ' ' +
                        options.textTrimOption + ' ';
        if (options.substr[0]) functionCode+= '(subs '+options.substr[0]+' ' + options.substr[1] + ') ';
        if (!(options.replaceMap[0]=== null&&options.replaceMap[1]=== null)) for (var i=0;i<options.replaceMap.length; i+=2)
        
        functionCode+= '(clojure.string/replace "'+(options.replaceMap[i]?options.replaceMap[i]:'')+'" "' + (options.replaceMap[i+1]?options.replaceMap[i+1]:'') + '") ';
        functionCode+= ')))';
        var result = $scope.$parent.transformation.addCustomFunctionDeclaration($scope.functionCodeOptions.name,functionCode);

      if (!result) {
        $mdToast.show(
          $mdToast.simple()
          .content('Function with this name already exists.')
          .position('bottom left')
          .hideDelay(2000)
        );
      } 
      else {
          $mdToast.show(
            $mdToast.simple()
            .content('New text transformation function created.')
            .position('bottom left')
            .hideDelay(2000)
          );
      } 
    };
    $scope.addMapPair = function(){
    $scope.functionCodeOptions.replaceMap.push(null);
    $scope.functionCodeOptions.replaceMap.push(null);
    };
    $scope.removeMapPair = function(index){
    $scope.functionCodeOptions.replaceMap.splice(index,2);
    };
    $scope.sample = '" This is  sample text. \n \n Here you may see the effect of \n transformations on your  text data. \n For more complex transformations use \n [Edit utility functions] option.    "';
    $scope.sampleOrigin = '" This is  sample text. \n \n Here you may see the effect of \n transformations on your  text data. \n For more complex transformations use \n [Edit utility functions] option.    "';
    $scope.changeSample = function(){
    switch ($scope.functionCodeOptions.textCaseOption) {
        case ('upper-case'):
           $scope.sample=$scope.sample.toUpperCase();
        break;
        case ('lower-case'):
           $scope.sample=$scope.sample.toLowerCase();
        break;
        default:
           $scope.sample=$scope.sampleOrigin;
        break;
    }
    };

    
    $scope.trimOptions = [
        {
          name: 'do not trim',
          code: ''
        },
        {
          name: 'trim both sides',
          code: 'trim'
        },
        {
          name: 'trim left side',
          code: 'triml'
        },
        {
          name: 'trim right side',
          code: 'trimr'
        },
        {
          name: 'trim newlines',
          code: 'trim-newline'
        },
        {
          name: 'remove all blank space',
          code: 'remove-blanks'
        }
    ];
    $scope.caseOptions = [
        { 
          name: 'preserve case',
          code: ''
        },
        { 
          name: 'UPPER CASE',
          code: 'upper-case'
        },
        { 
          name: 'lower case',
          code: 'lower-case'
        },
        { 
          name: 'Capitalize string',
          code: 'capitalize'
        },

        { 
          name: 'Capitalize Each Word',
          code: 'titleize'
        }
    ];

    $scope.applyCustomFunctionChanges = function() {
      $scope.saveCustomFunct();
      $mdDialog.hide();
    };

    $scope.cancelCustomFunctionChanges = function() {
      $mdDialog.cancel();
    };

    $scope.createNewFunct = function() {
      var name = '';
      var docstring = '';
      $scope.emptyCustomFunction.name = name;
      $scope.emptyCustomFunction.clojureCode = '(defn ' + name + ' "" [] ())';
      //$scope.emptyCustomFunction.docstring = docstring;
      $scope.selectedCustomFunction = $scope.emptyCustomFunction;
      $scope.saveCustomFunct();
    };

  });
