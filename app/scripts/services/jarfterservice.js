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
      var clojure = "(ns sintef-jarfter-template.core\r\n  (:require\r\n   [grafter.rdf :refer [s add prefixer]]\r\n   [grafter.tabular :refer :all]\r\n   [grafter.rdf.io :as ses]\r\n   [grafter.rdf.templater :refer [graph]]\r\n   [grafter.tabular.common :refer [read-dataset*]]\r\n   [grafter.vocabularies.rdf :refer :all]\r\n   [grafter.vocabularies.foaf :refer :all]\r\n   [grafter.rdf.formats :refer :all]\r\n   [clojure.string :refer [trim trim-newline triml trimr upper-case lower-case capitalize]]\r\n   )\r\n   (:gen-class)\r\n)";
      
      // pipeline and graft
      clojure += generateClojure.fromTransformation(transformation);
      console.log(rScope.transformation.graphs);
      console.log(rScope.transformation.graphs.length);
      if (rScope.transformation.graphs &&
          rScope.transformation.graphs.length !== 0) {
        // if graft - execute the pipeline and then the graft
        clojure += "(defn import-data\r\n  [quads-seq destination]\r\n  (add (ses\/rdf-serializer destination) quads-seq)\r\n)\r\n\r\n(defn -main [& [path output]]\r\n  (when-not (and path output)\r\n    (println \"Usage: lein run <input-file.csv> <output-file.(nt|rdf|n3|ttl)>\")\r\n    (System\/exit 0))\r\n\r\n  \r\n  (import-data \r\n    (make-graph (my-pipe (read-dataset path)))\r\n  output)\r\n\r\n  (println path \"=>\" output)\r\n)";
      } else {
        // if pipe - execute just pipe
        clojure += "(defn import-data\r\n  [pipe-result destination]\r\n  (write-dataset destination pipe-result)\r\n)\r\n\r\n(defn -main [& [path output]]\r\n  (when-not (and path output)\r\n    (println \"Usage: lein run <input-file.csv> <output-file.csv>\")\r\n    (System\/exit 0))\r\n\r\n  \r\n  (import-data \r\n    (my-pipe (read-dataset path))\r\n  output)\r\n\r\n  (println path \"=>\" output)\r\n)";
      }

      console.log(clojure);
      return clojure;
    };

    return api;
  };
});
