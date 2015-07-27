'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.generateClojure
 * @description
 * # generateClojure
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('generateClojure', function(transformationDataModel, $rootScope) {
  /***************************************************************************
     * Main Grafter/Clojure generation variables and functions.
    ****************************************************************************/

  var grafterSupportedRDFPrefixes = [
    {name: 'dcat', text: ''},
    {name: 'dcterms', text: ''},
    {name: 'foaf', text: ''},
    {name: 'org', text: ''},
    {name: 'os', text: ''},
    {name: 'owl', text: ''},
    {name: 'pmd', text: ''},
    {name: 'qb', text: ''},
    {name: 'rdf', text: ''},
    {name: 'sdmx-attribute', text: ''},
    {name: 'sdmx-measure', text: ''},
    {name: 'sdmx-concept', text: ''},
    {name: 'skos', text: ''},
    {name: 'vcard', text: ''},
    {name: 'void', text: ''},
    {name: 'xsd', text: ''}
  ];

  function isSupportedPrefix(prefixName) {
    var i;
    for (i = 0; i < grafterSupportedRDFPrefixes.length; ++i) {
      if (grafterSupportedRDFPrefixes[i].name === prefixName)
        return true;
    }

    return false;
  }

  var pipelineFunctions = new jsedn.List([]);

  var pipeline = new jsedn.List([
    jsedn.sym('defn'),
    jsedn.sym('pipeline'),
    new jsedn.Vector([new jsedn.sym('dataset')]),
    new jsedn.List([jsedn.sym('->'), jsedn.sym('dataset')])]);

  /* Holds the individual declarations. Used to form the declarations object that can then be rendered in Clojure. */
  /*var declarationsList = new jsedn.List([
          jsedn.kw(':require'),
          new jsedn.Vector([jsedn.sym('grafter.rdf'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.tabular'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.parse'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.sequences'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.sesame'), jsedn.kw(':as'), jsedn.sym('ses')]),
          new jsedn.Vector([jsedn.sym('clojure-csv.core'), jsedn.kw(':as'), jsedn.sym('csv')]),
          new jsedn.Vector([jsedn.sym('clojure.string'), jsedn.kw(':as'), jsedn.sym('cstr')]),
          new jsedn.Vector([jsedn.sym('incanter.core')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.dcat'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.dcterms'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.foaf'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.ons-geography'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.org'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.os'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.owl'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.pmd'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.qb'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.rdf'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.sdmx-attribute'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.sdmx-concept'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.sdmx-measure'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.skos'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.vcard'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.void'), jsedn.kw(':refer'), jsedn.kw(':all')]),
          new jsedn.Vector([jsedn.sym('grafter.rdf.ontologies.xsd'), jsedn.kw(':refer'), jsedn.kw(':all')])

      ]);*/

  /* Declarations object. Used to render the individual declarations with the needed enclosing definitions in Clojure. */
  /*var declarations;*/




  /* Holds the individual declarations. Used to form the declarations object that can then be rendered in Clojure. */
  var prefixers = [];

  /* Holds the jsedn list of user functions. Used to render them in Clojure code. */
  var userFunctions = [];

  /* Jsedn definition of the graph-building function. */
  /*var graphBuilderTemplate;*/

  /*var graphFunction;*/

  /* List of the graphs that will be included in the graph-building function. */
  /*var graphs = new jsedn.List([]);*/

  /* List of column keys derived through the GUI pipeline functions
     * TODO this is never used
     */

  // var columnKeys = new jsedn.Vector([]);

  /* Interface for alerts about errors. To be used to connect to other interface components when we integrate the GUI. */
  function alertInterface(error, errorString) {
    /*
       * TODO re-define me when integrating with the rest of the UI
       */
    console.log(error, errorString);
  }

  /* Adds a namespace declaration to the  */
  /*function addGrafterDeclaration(aDeclaration) {
      declarationsList.val.push(aDeclaration);
    }*/





  /* Adds a prefixer to the list of pre-defined prefixers */
  function addGrafterPrefixer(name, prefixString, parentPrefix) {
    if (parentPrefix.toString().trim() === "")   {var prefixer = new jsedn.List([
      jsedn.sym('def'),
      jsedn.sym(name),
      new jsedn.List([jsedn.sym('prefixer'), prefixString])]);

                                                  prefixers.push(prefixer);}
    else {

      var prefixer = new jsedn.List([
        jsedn.sym('def'),
        jsedn.sym(name),
        new jsedn.List([jsedn.sym('prefixer'),
                        new jsedn.List([jsedn.sym(parentPrefix),prefixString])
                       ])
      ]);
      prefixers.push(prefixer);
    }
  }

  /* Adds a prefixer derived from another prefixer to the list of pre-defined prefixers */
  /* function addGrafterPrefixerChild(name, prefixString, parentPrefix) {
    var prefixer = new jsedn.List([
      jsedn.sym('def'),
      jsedn.sym(name),
      new jsedn.List([jsedn.sym('prefixer'),
          jsedn.List([jsedn.sym(parentPrefix),prefixString])
                     ])
      ]);
    prefixers.push(prefixer);
  }
*/
  /* Constructs the namespace declarations used by Grafter */
  /*function constructGrafterDeclarations() {
      declarations = new jsedn.List([
            jsedn.sym('ns'), jsedn.sym('sintef-grafter-gui-template.core'), declarationsList
        ]);
      return declarations;
    }*/

  /* Constructs the collection of defined prefixers for RDF-isation */
  function constructGrafterPrefixersArray() {
    // we make a copy of the prefixers array that we eventually return
    var result = prefixers.slice();

    /* the prefixers array needs to be re-initialized so that we don't append new values to it when generating the Grafter code */
    prefixers = [];
    return result;
  }

  /* Adds a user function rendered as a jsedn object to the collection of user functions */
  function addUserFunction(userFunctionEdn) {
    userFunctions.push(userFunctionEdn);
  }

  /* Calls the jsedn parser and returns the parsed user function */
  function parseAndAddUserFunction(userFunctionString) {
    var result = parseEdnFromString(userFunctionString, 'Error parsing user function!');

    if (!result) return false;

    addUserFunction(result);
    return true;
  }

  function constructUserFunctions() {
    // we make a copy of the user functions array that we eventually return
    var result;

    userFunctions = userFunctions.filter(function(elem) { return elem !== undefined; });

    if (userFunctions)
      result = userFunctions.slice();

    /* the user functions array needs to be re-initialized so that we don't append new values
       * to it when generating the Grafter code */
    userFunctions = [];

    return result;
  }

  /* Constructs and returns the function used for transforming data to RDF */
  /*function constructGraphTemplate() {
      graphBuilderTemplate = new jsedn.List([
            jsedn.sym('def'), jsedn.sym('my-graph-template'),
            graphFunction
        ]);

      return graphBuilderTemplate;
    }*/

  /* Creates the Grafter 'graph-fn' function and encloses the separate graph-creating Grafter functions */
  /*function createGraphFunction(keysString) {

      graphFunction = new jsedn.List([
            jsedn.sym('graph-fn'), new jsedn.Vector([
                new jsedn.Map([
                    jsedn.kw(':keys'),
                    parseEdnFromString(keysString, 'Error parsing column keys Clojure string.')
                ])
            ])
        ]);
      graphs.map(function(arg) {
        graphFunction.val.push(arg);
      });
    }*/

  /* Creates a new graph-creating Grafter function 'graph' and adds it to an array used to create the 'graph-fn' function */
  /*function addGraph(graphURI, triplesString) {
      var triplesObject = parseTriplesFromString(triplesString);

      var graphToAdd = new jsedn.List([
            jsedn.sym('graph'), graphURI,
            triplesObject
        ]);

      graphs.val.push(graphToAdd);
    }*/

  /* Temporary hack for the initial GUI implementation. Parses an input string (provided by the user) and creates
     * the corresponding jsedn objects. */
  /*function parseTriplesFromString(triplesString) {
      return parseEdnFromString(triplesString, 'Error parsing triples string.');
    }*/

  /* Generic clojure code parser. Outputs a message to the alertInterface function
     * in case an error occurs during parsing.
     */
  function parseEdnFromString(toParse, messageOnError) {
    try {
      var ednObject = jsedn.parse(toParse);
      return ednObject;
    } catch (e) {
      alertInterface(e, messageOnError);
      return null;
    }
  }

  /* Add a pipeline function (either user-defined or provided by Grafter) to an array
     * which is used to construct the data transformation pipeline. */
  function addPipelineFunction(jsednFunction) {
    if (angular.isFunction(jsednFunction.generateClojure)) {
      pipelineFunctions.val.push(jsednFunction.generateClojure());
    }
  }

  /* Constructs and returns the data transformation pipeline. */
  function constructPipeline() {
    var readDatasetFunct = new jsedn.List([
      new jsedn.sym('read-dataset'),
      new jsedn.sym('data-file')
    ]);

    pipeline = null;

    pipeline = new jsedn.List([
      jsedn.sym('defpipe'),
      jsedn.sym('my-pipe'),
      'Pipeline to convert tabular persons data into a different tabular format.',
      new jsedn.Vector([new jsedn.sym('data-file')]),
      new jsedn.List([jsedn.sym('->'), readDatasetFunct])]);

    pipelineFunctions.map(function(arg) {
      pipeline.val[4].val.push(arg);
    });

    //(read-dataset data-file :format :csv)
    pipelineFunctions = new jsedn.List([]);
    return pipeline;
  }

  /* Removes a function from the pipeline. TODO IS THIS NEEDED AT ALL?? */
  /*function removeFunctionFromPipeline(index) {
      pipelineFunctions.val.splice(index, 1);
    }*/

  /* Constructs and returns the RDF creation function. */
  function constructRDFGraphFunction(transformation) {
    var i;
    var j;
    var currentGraph = null;

    var colKeysClj = new jsedn.Vector([]);
    var columnKeysFromPipeline = transformation.getColumnKeysFromPipeline();
    for (i = 0; i < columnKeysFromPipeline.length; ++i) {
      colKeysClj.val.push(new jsedn.sym(columnKeysFromPipeline[i]));
    }

    var graphFunction = new jsedn.List([
      new jsedn.sym('graph-fn'),
      new jsedn.Vector([
        new jsedn.Map([new jsedn.kw(':keys'), colKeysClj])
      ])
    ]);
    var currentGraphJsEdn = null;
    var currentRootJsEdn = null;

    for (i = 0; i < transformation.graphs.length; ++i) {
      currentGraph = transformation.graphs[i];

      currentGraphJsEdn = new jsedn.List([jsedn.sym('graph'), currentGraph.graphURI]);

      // construct a vector for each of the roots and add it to the graph jsedn
      for (j = 0; j < currentGraph.graphRoots.length; ++j) {
        currentRootJsEdn = constructNodeVectorEdn(currentGraph.graphRoots[j], currentGraph);
        currentGraphJsEdn.val.push(currentRootJsEdn);
      }

      graphFunction.val.push(currentGraphJsEdn);
    }

    var result = new jsedn.List([jsedn.sym('def'), jsedn.sym('make-graph'), graphFunction]);

    return result;
  }

  function constructNodeVectorEdn(node, containingGraph) {
    var i;
    var allSubElementsVector;
    var subElementEdn;

    if (node instanceof transformationDataModel.Property) {
      if (node.subElements.length === 0) {
        alertInterface('Error found in RDF mapping for the sub-elements node ' + node.propertyName + '!');
        return;
      }

      var propertyValue = node.subElements[0];

      // [name {either single node or URI node with sub-nodes (as vector)}
      return new jsedn.Vector([constructPropertyJsEdn(node), constructNodeVectorEdn(propertyValue, containingGraph)]);
    }

    if (node instanceof transformationDataModel.ColumnLiteral) {
      if (node.literalValue.trim() === '') {
        alertInterface('Empty column literal mapping found!');
      }

      // return the value as symbol
      return new jsedn.sym(node.literalValue);
    }

    if (node instanceof transformationDataModel.ConstantLiteral) {
      console.log(node);
      if (node.literalValue.trim() === '') {
        alertInterface('Empty text literal found in RDF mapping!');
      }

      // return the value as string
      return node.literalValue;
    }

    if (node instanceof transformationDataModel.ColumnURI) {
      if (node.subElements.length === 0) {
        // we terminate by this URI, return the column
        // TODO check in keywords array if this exists
        return constructColumnURINodeJsEdn(node, containingGraph);

      } else {
        // [node-uri-as-generated {sub-1's edn representation} {sub-2's edn representation} ... {sub-n's edn representation}]
        allSubElementsVector = new jsedn.Vector([constructColumnURINodeJsEdn(node, containingGraph)]);
        var k;

        for (k = 0; k < node.subElements.length; ++k) {
          subElementEdn = constructNodeVectorEdn(node.subElements[k]);

          allSubElementsVector.val.push(subElementEdn);

        }

        return allSubElementsVector;
      }
    }

    if (node instanceof transformationDataModel.ConstantURI) {
      if (node.subElements.length === 0) {
        // we terminate by this URI, return the column
        // TODO check in keywords array if this exists
        return constructConstantURINodeJsEdn(node, containingGraph);

      } else {
        // [node-uri-as-generated {sub-1's edn representation} {sub-2's edn representation} ... {sub-n's edn representation}]
        allSubElementsVector = new jsedn.Vector([constructConstantURINodeJsEdn(node, containingGraph)]);
        for (i = 0; i < node.subElements.length; ++i) {
          subElementEdn = constructNodeVectorEdn(node.subElements[i]);
          allSubElementsVector.val.push(subElementEdn);
        }

        return allSubElementsVector;
      }

    }

    /*if (node instanceof transformationDataModel.BlankNode) {
        // TODO not supported yet
      }*/
  }

  function constructPropertyJsEdn(property) {
    // graph URI as prefix, add nothing
    var propertyPrefix = property.prefix;
    var propertyName = property.propertyName;
    if (!propertyPrefix) {
      alertInterface('Property prefix cannot be null:' + propertyName);
      return;
    } else if (propertyPrefix === '') {
      alertInterface('Property prefix cannot be omitted:' + propertyName);
      return;
    } else {
      if (isSupportedPrefix(propertyPrefix.trim())) {
        // assume it's a supported property
        return new jsedn.sym(propertyPrefix + ':' + propertyName);
      } else {
        // TODO make a check if we have defined the prefix
        // some custom prefix, that is hopefully defined in the UI (Edit Prefixes...)
        return new jsedn.List([new jsedn.sym(propertyPrefix), propertyName]);
      }
    }

  }

  function constructColumnURINodeJsEdn(colURINode, containingGraph) {
    // graph URI as prefix, add nothing
    var nodePrefix = colURINode.prefix;
    var nodeValue = colURINode.column;
    if (nodePrefix === null || nodePrefix === undefined) {
      // base graph URI
      // ((prefixer "graphURI") nodeValue)
      return new jsedn.List([new jsedn.List([new jsedn.sym('prefixer'), containingGraph.graphURI]), new jsedn.sym(
        nodeValue)]);
    } else if (nodePrefix === '') {
      // empty prefix - just take the column as symbol
      // nodeValue
      return new jsedn.sym(nodeValue);
    } else {
      if (isSupportedPrefix(nodePrefix.trim())) {
        // supported prefix - no need to use prefixer - simple library call
        // nodePrefix:nodeValue (e.g. vcard:Address)
        alertInterface('Cannot associate column \'' + nodeValue + '\' with prefix \'' + nodePrefix + '\'!');

        //                return;
        return new jsedn.List([new jsedn.sym(nodePrefix), new jsedn.sym(nodeValue)]);
      } else {
        // TODO make a check if we have defined the prefix
        // some custom prefix, that is hopefully defined in the UI (Edit Prefixes...)
        // both are symbols and we get (nodePrefix nodeValue) as a result
        return new jsedn.List([new jsedn.sym(nodePrefix), new jsedn.sym(nodeValue)]);
      }
    }

  }

  function constructConstantURINodeJsEdn(constURINode, containingGraph) {
    // graph URI as prefix, add nothing
    var nodePrefix = constURINode.prefix;
    var nodeValue = constURINode.constant;
    if (nodePrefix === null || nodePrefix === undefined) {
      // base graph URI
      // ((prefixer 'graphURI') 'nodeValue')
      return new jsedn.List([new jsedn.List([new jsedn.sym('prefixer'), containingGraph.graphURI]), nodeValue]);
    } else if (nodePrefix === '') {
      // empty prefix - just take the column as symbol
      // nodeValue
      return nodeValue;
    } else {
      if (isSupportedPrefix(nodePrefix.trim())) {

        // nodePrefix:nodeValue (e.g. vcard:Address)
        return new jsedn.sym(nodePrefix + ':' + nodeValue);
      } else {
        // TODO make a check if we have defined the prefix
        // some custom prefix, that is hopefully defined in the UI (Edit Prefixes...)
        // both are symbols and we get (nodePrefix nodeValue) as a result
        return nodePrefix + nodeValue;
      }
    }

    // prefix null, empty or undefined
  }

  /***************************************************************************
      Convenience functions for generating code corresponding to the Grafter API.
  ****************************************************************************/

  /*
      Creates and returns a 'make-dataset' Grafter function.
      Prototype:  (make-dataset)
                  (make-dataset data)
                  (make-dataset data columns-or-f)

                  - dataset is implied
    */
  /*function createMakeDataset(columnsJsednSet) {
      var jsednFunction = new jsedn.List([jsedn.sym('make-dataset'), columnsJsednSet]);
      return jsednFunction;
    }*/

  /*
     * Creates and returns a 'drop-rows' Grafter function.
     * Prototype: (drop-rows dataset n) - dataset is implied
     */
  /*function createDropRows(numberOfRows) {
      var jsednFunction = new jsedn.List([jsedn.sym('drop-rows'), numberOfRows]);
      return jsednFunction;
    }*/

  /*
     * Creates and returns a 'derive-column' Grafter function.
     * Prototype: (derive-column dataset new-column-name from-cols f) - dataset is implied
     */
  /*function createDeriveColumn(newColNameJsedn, fromColsJsedn, functionJsedn) {

      if (typeof functionJsedn === 'undefined' || functionJsedn === null) {
        return new jsedn.List([jsedn.sym('derive-column'), newColNameJsedn, fromColsJsedn]);
      }

      return new jsedn.List([jsedn.sym('derive-column'), newColNameJsedn, fromColsJsedn, functionJsedn]);
    }*/

  /*
     * Creates and returns a 'mapc' Grafter function in jsedn data model. Takes an array or a hashmap
     * of functions and maps each to the key column of every row.
     * Prototype: (mapc dataset fs) - dataset is implied
     */
  /*function createMapc(functionSetOrArrayJsedn) {
      var jsednFunction = new jsedn.List([jsedn.sym('mapc'), functionSetOrArrayJsedn]);

      return jsednFunction;
    }*/

  /*function createCustomCodeForPipeline(code, displayName) {
      var customCodeEdn = parseEdnFromString(code, 'Error parsing custom code in ' + displayName);

      return customCodeEdn;
    }*/

  function tempCheckExistingVocabInGraft(prefix){
    var vocab = ['dcat', 'dcterms', 'foaf', 'statistical-entity', 'org', 'os', 'owl', 'pmd', 'qb', 'rdf',
                 'sdmx-attribute', 'sdmx-concept', 'sdmx-measure', 'skos', 'vcard', 'void', 'xsd'];

    for (var i = 0; i < vocab.length; i++){
      if(vocab[i] === prefix){
        return false;
      }
    }

    return true;
  }

  function tempCheckExistingClassorPropertiesInGraft(prefix, name){
    var items = [
      'owl:Ontology','owl:Class',
      'foaf:Person','foaf:age','foaf:depiction','foaf:gender','foaf:homepage','foaf:interest','foaf:knows','foaf:name','foaf:nick',
      'sdmx-measure:obsValue',
      'sdmx-concept:statUnit','sdmx-concept:unitMeasure',
      'rdfs','rdf:a','rdf:Property','rdfs:subPropertyOf','rdfs:Class','rdfs:subClassOf','rdfs:label','rdfs:comment','rdfs:isDefinedBy','rdfs:range','rdfs:domain',
      'vcard:Address','vcard:hasAddress','vcard:hasUrl','vcard:street-address','vcard:postal-code','vcard:locality','vcard:country-name',
      'qb:DataStructureDefinition','qb:DataSet','qb:dataSet','qb:component','qb:componentRequired','qb:componentAttachment','qb:ComponentSpecification','qb:ComponentProperty','qb:Attachable','qb:order','qb:structure','qb:dimension','qb:DimensionProperty','qb:attribute','qb:AttributeProperty','qb:measure','qb:measureType','qb:MeasureProperty','qb:Observation','qb:concept','qb:Slice','qb:slice',
      'skos:ConceptScheme','skos:hasTopConcept','skos:Concept','skos:inScheme','skos:topConceptOf','skos:prefLabel','skos:definition','skos:notation','skos:altLabel','skos:note','skos:Collection','skos:member',
      'dcat:Dataset','dcat:theme',
      'pmd:Dataset','pmd:contactEmail','pmd:graph','folder:Folder','folder:hasTree','folder:defaultTree','folder:parentFolder','folder:inFolder','folder:inTree',
      'os:postcode',
      'statistical-entity:name','statistical-entity:abbreviation','statistical-entity:owner','statistical-entity:coverage',
      'statistical-entity:relatedentity','statistical-entity:status','statistical-entity:liveinstances','statistical-entity:archivedinstances',
      'statistical-entity:coverage','statistical-entity:firstcode','statistical-entity:lastcode','statistical-entity:reservedcode',
      'statistical-entity:introduced','statistical-entity:lastinstancechange','statistical-entity:code','statistical-entity:crossborderinstances',
      'statistical-entity:theme','statistical-geography','statistical-geography:officialname','statistical-geography:status',
      'statistical-geography:parentcode','boundary-change','boundary-change:operativedate','boundary-change:originatingChangeOrder','boundary-change:terminateddate','boundary-change:changeOrderTitle',
      'sdmx-attribute:statUnit','sdmx-attribute:unitMeasure',
      'dcterms:title','dcterms:modified','dcterms:created','dcterms:description','dcterms:issued','dcterms:license','dcterms:publisher','dcterms:creator','dcterms:references','dcterms:isReplacedBy','dcterms:replaces',
      'org:Organization',
      'void:Dataset','void:dataDump','void:sparqlEndpoint','void:triples','void:vocabulary',
    ]

    for (var i = 0; i < items.length; i++){
      var str = prefix + ':' + name;
      if(items[i] === str){
        return false;
      }
    }

    return true;
  }

  //check whether the prefix is added or not
  var graphPrefix = [];
  function isPrefixExist(prefix){
    for (var i = 0; i < graphPrefix.length; i++){
      if(graphPrefix[i] === prefix){

        return true;
      }
    }
    graphPrefix.push(prefix);
    return false;
  }

  var graphConcept = [];
  function isConceptExist(prefix, concept){

    var name = prefix + ':' + concept;
    for (var i = 0; i < graphConcept.length; i++){
      if(graphConcept[i] === name){
        return true;
      }
    }
    graphConcept.push(name);
    return false;
  }

  var namespaceMap = {
    prefix: '',
    namespace: '',
  };

  var namespaceMaps = [];

  //load a mapping between prefix and namespace from windows localStorage.
  //the storage is edited in propertydialog.js and mappingnodedefinitiondialog.js
  function loadNamespaceMapping(localVocabularies){
    //load user defined vocabulary
    if(!localVocabularies){
      return;
    }
    for (var i = localVocabularies.length - 1; i >= 0; i--) {
      namespaceMap = new Object();

      namespaceMap.prefix = localVocabularies[i].name;
      namespaceMap.namespace = localVocabularies[i].namespace;
      namespaceMaps.push(namespaceMap);
    }
  }

  //get namespace based on prefix
  function getNamespaceofPrefix(prefix){
    for (var i = 0; i < namespaceMaps.length; i++){
      if(namespaceMaps[i].prefix === prefix){
        return namespaceMaps[i].namespace;
      }
    }

    return "";
  }


  // recursive function to add clojure code about property and class
  function getConcept(element, str, containingGraph){

    //define vocabulary
    if(element.prefix != "" && element.prefix != undefined){
      if(!isPrefixExist(element.prefix)) {
        if (tempCheckExistingVocabInGraft(element.prefix)) {
          var namespace = getNamespaceofPrefix(element.prefix);
          if(namespace != ""){
            str += ('(def ' + element.prefix + ' ' + '"' + namespace + '"' + ')');
            str += '\n';
          } else {
            str += ('(def ' + element.prefix + ' ' + '"' + containingGraph.graphURI + '"' + ')');
            str += '\n';
          }
        }
      }
      //define property
      if (element.__type === "Property") {
        if(!isConceptExist(element.prefix, element.propertyName)){
          if (tempCheckExistingClassorPropertiesInGraft(element.prefix, element.propertyName)) {
            str += '(def ' + element.prefix + ':' + element.propertyName + ' (' + element.prefix + ' "' + element.propertyName + '"))';
            str += '\n';
          }
        }
      }

      //define class
      if (element.__type === "ConstantURI") {
        if(!isConceptExist(element.prefix, element.constant)){
          if (tempCheckExistingClassorPropertiesInGraft(element.prefix, element.constant)) {
            str += '(def ' + element.prefix + ':' + element.constant + ' (' + element.prefix + ' "' + element.constant + '"))';
            str += '\n';
          }
        }
      }
    }

    //recursive: do the same for all sub elements
    for(var i = 0; i < element.subElements.length; i++) {
      str = getConcept(element.subElements[i], str, containingGraph);
    }

    return str;
  }

  function generateGrafterCode(transformation) {
    graphPrefix = [];
    graphConcept = [];
    /* Grafter Declarations */

    // TODO those are not needed here; may be needed afterwards?
    //    var grafterDeclarations = constructGrafterDeclarations();

    /* Prefixers */

    var prefixersInGUI = transformation.prefixers;

    // add only custom prefixers - the Grafter ones are available by default
    for (var i = 0; i < prefixersInGUI.length; ++i) {
      var name = prefixersInGUI[i].name;
      var uri = prefixersInGUI[i].uri;
      var parentPrefix = prefixersInGUI[i].parentPrefix;
      if (name === '' || uri === '') {
        alertInterface('Name or URI of a prefix empty, ignoring...', '');
        continue;
      }

      addGrafterPrefixer(name, uri, parentPrefix);
    }

    var grafterPrefixers = constructGrafterPrefixersArray();
    /* User functions */

    //    var customFunctionsMap = transformation.customFunctionDeclarations;
    for (i = 0; i < transformation.customFunctionDeclarations.length; ++i) {
    /*Regex parsing*/
        var codeToParse;
        var regexesPattern = /#"(.*?)"/g

            var regexes = regexesPattern.exec(transformation.customFunctionDeclarations[i].clojureCode);
            if (regexes) {
                for (var j=0;j<regexes.length;++j) {
            var newstring = regexes[j].replace(' #"',' (read-string "#\\"');
            newstring = newstring.replace(/"$/, '\\"")');
                codeToParse = transformation.customFunctionDeclarations[i].clojureCode.replace(regexes[j],newstring);
            }
        parseAndAddUserFunction(
          //transformation.customFunctionDeclarations[i].clojureCode
          codeToParse
        );
      }
      else

        parseAndAddUserFunction(
          transformation.customFunctionDeclarations[i].clojureCode
        );
    }

    var grafterCustomFunctions = constructUserFunctions();

    /* Graph Template */

    var graphTemplate = constructRDFGraphFunction(transformation);

    /* Pipeline Function */
    angular.forEach(transformation.pipelines, function(pipeline) {
      angular.forEach(pipeline.functions, function(genericFunction) {
        addPipelineFunction(genericFunction);
      });
    });

    var resultingPipeline = constructPipeline();
    var textStr = '';

    loadNamespaceMapping(transformation.rdfVocabs);

    if(transformation.graphs.length > 0){
      for(i=0; i<transformation.graphs.length; ++i){
        if(transformation.graphs[i].graphRoots){
          if(transformation.graphs[i].graphRoots.length > 0){
            textStr += getConcept(transformation.graphs[0].graphRoots[0], textStr, transformation.graphs[i]);
          }
        }
      }
    }

    for (i = 0; i < grafterPrefixers.length; ++i) {
      textStr += (grafterPrefixers[i].ednEncode() + '\n');
    }

    textStr += '\n';

    for (i = 0; i < grafterCustomFunctions.length; ++i) {
      textStr += (grafterCustomFunctions[i].ednEncode() + '\n');
    }

    textStr += graphTemplate.ednEncode();

    textStr += '\n';
    textStr += '\n';
    textStr += (resultingPipeline.ednEncode());

    textStr += '\n';
    textStr += '\n';

    textStr +=
      '(defgraft my-graft "Pipeline to convert the tabular persons data sheet into graph data." my-pipe make-graph)';

    return textStr;
  }

  // TODO this is just a PoC
  var overridedClojure = null;
  var generatedClojureBeforeGeneration = null;

  this.fromTransformation = function(transformation, noOverride) {
    try {
      var generatedCode = generateGrafterCode(transformation);
      if (!noOverride && overridedClojure && generatedClojureBeforeGeneration === generatedCode) {
        return overridedClojure;
      }

      return generatedCode;
    } catch (e) {
      console.log(e);
      return '';
    }
  };

  this.overrideClojure = function(overrided, before) {
    overridedClojure = overrided;
    generatedClojureBeforeGeneration = before;
  };

  this.removeOverrideClojure = function() {
    overridedClojure = null;
    generatedClojureBeforeGeneration = null;
  };
});
