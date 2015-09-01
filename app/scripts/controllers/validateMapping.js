'use strict';

angular.module('grafterizerApp').controller('validateMappingCtrl', function(
    $scope,
    $http,
    $mdDialog,
    $log,
    leObject){

    var connection = leObject.serveraddress;

    var tripleStr = '';

    $scope.showNoError = false;

    function convertTriple(element){
        if(element === null){
            return '';
        }

        if(element.__type == 'ConstantURI'){
            return ' ' + element.prefix + ':' + element.constant;
        }

        if(element.__type == 'ColumnURI'){
            return ' ' + element.prefix + ':' + element.column;
        }

        if(element.__type == 'Property'){
            return ' ' + element.prefix + ':' + element.propertyName;
        }

        if(element.__type == 'ConstantLiteral'){
            return ' ' + '"' + element.constant + '"';
        }

        if(element.__type == 'ColumnLiteral'){
            return ' ' + '"' + element.literalValue + '"';
        }
    }

    // recursive function to get triples from map and save it in tripleArray
    function getTriple(element){
        var subject = element;
        var subjectStr = convertTriple(subject);

        for(var i = 0; i < subject.subElements.length; i++){
            var predicate = subject.subElements[i];
            var predicateStr = convertTriple(predicate);
            for(var j = 0; j < predicate.subElements.length; j++){
                var object = predicate.subElements[j];
                var objectStr = convertTriple(predicate.subElements[j]);
                var triple = subjectStr + ' ' + predicateStr + ' ' + objectStr + '.';
                tripleStr += triple;
                getTriple(object);
            }
        }
    }

    $scope.closeDialog = function () {
        $mdDialog.cancel();
    };

    var element = null;
    if($scope.$parent.transformation.graphs.length > 0) {
        element = $scope.$parent.transformation.graphs[0].graphRoots[0];
        getTriple(element);

        $http.post(
            connection + 'validate',
            {
                data: tripleStr
            }
        ).success(function(response){
            $scope.errArray = response.errorArray;
            if(response.errorlevel == "Correct"){
                $scope.showNoError = true;
            }
            else{
                $scope.showNoError = false;
            }
        }

        ).error(function(data, status, headers, config) {

        })
    }
})
