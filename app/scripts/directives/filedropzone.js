'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:fileDropzone
 * @description
 * # fileDropzone
 */
angular.module('grafterizerApp')
  .directive('fileDropzone', function(leObject) {
    return {
      restrict: 'A',
      scope: {
        file: '=',
        fileName: '='
      },
      link: function($scope, element, attrs) {
        var object = leObject.object;

        var validMimeTypes;
        var processDragOverOrEnter = function(event) {
          if (event !== null) {
            event.preventDefault();
          }

          event.dataTransfer.effectAllowed = 'copy';
          return false;
        };

        validMimeTypes = attrs.fileDropzone;

        element.bind('dragover', processDragOverOrEnter);
        element.bind('dragenter', processDragOverOrEnter);
        return element.bind('drop', function(event) {
          var file;
          var name;
          var reader;
          var size;
          var type;
          if (event !== null) {
            event.preventDefault();
          }

          reader = new FileReader();
          reader.onloadstart = function(e) {
            $scope.dragProcess = true;
          };

          reader.onload = function(evt) {
            object.filename = file.name;
            object.data = evt.target.result;
            $scope.dragProcess = false;
            $scope.fileName.value = file.name;
            $scope.$apply();
          };

          file = event.dataTransfer.files[0];
          name = file.name;
          type = file.type;
          size = file.size;
          reader.readAsText(file);

          return false;
        });
      }
    };
  });
  