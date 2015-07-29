'use strict';

angular.module('grafterizerApp').controller('validateMappingCtrl', function(
    $scope,
    $http,
    $mdDialog,
    $log,
    leObject){

    var triple = "";
    var tripleArray = [];

    function createTriple(element, triple, lol){

        switch(lol){
          case 1:
              if(triple != ""){
                  if(element.__type == 'ConstantURI'){
                    triple += ' ' + element.prefix + ':' + element.constant;
                  }

                  if(element.__type == 'ColumnURI'){
                    triple += ' ' + element.prefix + ':' + element.column;
                  }

                  if(element.__type == 'Property'){
                    triple += ' ' + element.prefix + ':' + element.propertyName;
                  }

                  if(element.__type == 'ConstantLiteral'){
                    triple += ' ' + element.constant;
                  }

                  if(element.__type == 'ColumnLiteral'){
                    triple += ' ' + element.literalValue;
                  }
                  tripleArray.push(triple);
                  triple = "";
              }
              break;
          case 2:
              var res = triple.split(" ");
              triple = "";
              triple += ' ' + res[1];
              break;
          case 3:
              var res = triple.split(" ");
              triple = "";
              triple += ' ' + res[0];
              triple += ' ' + res[1];
              break;
        }

        if(element.__type == 'ConstantURI'){
            triple += ' ' + element.prefix + ':' + element.constant;
        }

        if(element.__type == 'ColumnURI'){
            triple += ' ' + element.prefix + ':' + element.column;
        }

        if(element.__type == 'Property'){
            triple += ' ' + element.prefix + ':' + element.propertyName;
        }

        if(element.__type == 'ConstantLiteral'){
            triple += ' ' + element.constant;
        }

        if(element.__type == 'ColumnLiteral'){
            triple += ' ' + element.literalValue;
        }

      return triple;
    }

    function getConcept(element){
        if(element.__type == 'ConstantURI' || element.__type == 'ColumnURI'){
            if(triple == ""){
                for(var i = 0; i < element.subElements.length; i++) {
                    triple = createTriple(element, triple, 1);
                    getConcept(element.subElements[i]);
                }
            }
            else{
                triple = createTriple(element, triple, 1);
                for(var i = 0; i < element.subElements.length; i++) {
                    getConcept(element.subElements[i]);
                }
            }
        }

        if(element.__type == 'Property'){
            for(var i = 0; i < element.subElements.length; i++) {
                triple = createTriple(element, triple, 2);
                getConcept(element.subElements[i]);
            }
        }

        if(element.__type == 'ConstantLiteral' || element.__type == "ColumnLiteral"){
            triple = createTriple(element, triple, 3);
        }
    }

    var element = null;
    if($scope.$parent.transformation.graphs.length > 0) {
        element = $scope.$parent.transformation.graphs[0].graphRoots[0];
        getConcept(element);
        var a = 1;
    }
})
