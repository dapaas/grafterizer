'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.jarfterService
 * @description
 * # jarfterService
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .provider('jarfterService', function($sceDelegateProvider) {
  var endpoint = '';

  this.setEndpoint = function(newEndpoint) {
    var sceList = $sceDelegateProvider.resourceUrlWhitelist();
    sceList.push(newEndpoint + '/**');
    $sceDelegateProvider.resourceUrlWhitelist(sceList);
    endpoint = newEndpoint;
  };

  this.$get = function($http, generateClojure, $injector) {
    var api = {}, rScope = $injector.get('$rootScope');
    
    api.getJarCreatorStandAloneEndpoint = function() {
      return endpoint + '/jarfter/webresources/jarCreatorStandAlone';
    };

    api.getTransformStandAloneEndpoint = function() {
      return endpoint + '/jarfter/webresources/transformStandAlone';
    };

    api.generateClojure = function(transformation) {
      
      // namespace declaration and imports
      var clojure = "\r\n(ns grafterizer.transformation\r\n  (:require\r\n   [grafter.rdf :refer [s add prefixer]]\r\n   [grafter.tabular :refer :all]\r\n   [grafter.rdf.io :as ses]\r\n   [grafter.rdf.templater :refer [graph]]\r\n   [grafter.tabular.common :refer [read-dataset*]]\r\n   [grafter.vocabularies.rdf :refer :all]\r\n   [grafter.vocabularies.foaf :refer :all]\r\n   [grafter.rdf.formats :refer :all]\r\n   [clojure.string :refer [trim]]\r\n   )\r\n)";
      
      // pipeline and graft
      clojure += generateClojure.fromTransformation(transformation);
      if (rScope.transformation.graphs &&
          rScope.transformation.graphs.length !== 0) {
        // if graft - execute the pipeline and then the graft
        clojure += "\r\n(defn import-data\r\n  [quads-seq destination]\r\n  (add (ses\/rdf-serializer destination) quads-seq)\r\n)\r\n\r\n(defn my-transformation [dataset output]\r\n\r\n  (import-data \r\n    (make-graph (my-pipe dataset))\r\n  output)\r\n)";
      } else {
        // if pipe - execute just pipe
        clojure += "\r\n(defn import-data\r\n  [pipe-result destination]\r\n  (write-dataset destination pipe-result)\r\n)\r\n\r\n(defn my-transformation [dataset output]\r\n\r\n  (import-data \r\n    (make-graph (my-pipe dataset))\r\n  output)\r\n)";
      }

      return clojure;
    };

    return api;
  };
});
