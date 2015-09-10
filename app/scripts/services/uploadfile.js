'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.uploadFile
 * @description
 * # uploadFile
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('uploadFile', function(ontotextAPI) {
    this.upload = function(file, finalCallback) {
      var callback = function(idDataset) {
        var metadata = {
          '@context': ontotextAPI.getContextDeclaration(),
          '@type': 'dcat:Distribution',
          'dct:title': file.name,
          'dct:description': 'File uploaded from Grafterizer in preview mode',
          'dcat:fileName': file.name,
          'dcat:mediaType': file.type
        };
        ontotextAPI.uploadDistribution(idDataset, file, metadata)
            .success(finalCallback);
      };

      // First we need to check if we have a preview dataset
      ontotextAPI.searchDataset('Previewed datasets').success(function(data) {
        if (!data || !data['dcat:record'] || data['dcat:record'].length === 0) {
          // we need to create a new one
          ontotextAPI.newDataset({
              '@context': ontotextAPI.getContextDeclaration(),
              '@type': 'dcat:Dataset',
              'dct:title': 'Previewed datasets',
              'dct:description': 'Dataset containing the previewed files from Grafterizer',
              'dcat:public': 'false'
            })
            .success(function(data) {
              callback(data['@id']);
            });
        } else {
          callback(data['dcat:record'][
              data['dcat:record'].length - 1]['foaf:primaryTopic']);
        }
      });
    };
  });
