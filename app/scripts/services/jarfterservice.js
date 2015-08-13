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

  this.$get = function($http, generateClojure) {
    var api = {};

    api.getJarCreatorStandAloneEndpoint = function() {
      return endpoint + '/jarfter/webresources/jarCreatorStandAlone';
    };

    api.getTransformStandAloneEndpoint = function() {
      return endpoint + '/jarfter/webresources/transformStandAlone';
    };

    api.generateClojure = function(transformation) {
      var clojure = "\n(ns sintef-jarfter-template.core\n  (:require\n   [grafter.rdf :refer [s add prefixer]]\n   [grafter.tabular :refer :all]\n   [grafter.rdf.io :as ses]\n   [grafter.rdf.templater :refer [graph]]\n   [grafter.tabular.common :refer [read-dataset*]]\n   [grafter.vocabularies.rdf :refer :all]\n   [grafter.vocabularies.foaf :refer :all]\n   [grafter.rdf.formats :refer :all]\n   [clojure.string :refer [trim]]\n   )\n   (:gen-class)\n)";
      clojure += generateClojure.fromTransformation(transformation);
      clojure += "\n(defn import-data\n  [quads-seq destination]\n  (add (ses/rdf-serializer destination) quads-seq))\n\n(defn -main [& [path output]]\n  (when-not (and path output)\n    (println \"Usage: lein run <input-file.csv> <output-file.(nt|rdf|n3|ttl)>\")\n    (System/exit 0))\n\n  \n  (import-data \n    (make-graph (my-pipe (read-dataset path)))\n  output)\n\n  (println path \"=>\" output)\n)\n  ";
      return clojure;
    };

    return api;
  };
});
