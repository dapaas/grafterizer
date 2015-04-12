/***************************************************************************
    Main Grafter/Clojure generation variables and functions.
****************************************************************************/

var grafterSupportedRDFPrefixes = [
    {name: 'dcat', text: ""},
    {name: 'dcterms', text: ""},
    {name: 'foaf', text: ""},
    {name: 'org', text: ""},
    {name: 'os', text: ""},
    {name: 'owl', text: ""},
    {name: 'pmd', text: ""},
    {name: 'qb', text: ""},
    {name: 'rdf', text: ""},
    {name: 'sdmx-attribute', text: ""},
    {name: 'sdmx-measure', text: ""},
    {name: 'sdmx-concept', text: ""},
    {name: 'skos', text: ""},
    {name: 'vcard', text: ""},
    {name: 'void', text: ""},
    {name: 'xsd', text: ""}
];

function isSupportedPrefix(prefixName){
    for(i=0;i<grafterSupportedRDFPrefixes.length; ++i){
        if(grafterSupportedRDFPrefixes[i]['name'] === prefixName)
            return true;
    }
    return false;
}

var pipelineFunctions = new jsedn.List([]);

var pipeline = new jsedn.List([jsedn.sym("defn"), jsedn.sym("pipeline"), new jsedn.Vector([new jsedn.sym("dataset")]),
                               new jsedn.List([jsedn.sym("->"), jsedn.sym("dataset")])]);

/* Holds the individual declarations. Used to form the declarations object that can then be rendered in Clojure. */
var declarationsList = new jsedn.List([
    jsedn.kw(":require"),
    new jsedn.Vector([jsedn.sym("grafter.rdf"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.tabular"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.parse"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.sequences"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.sesame"), jsedn.kw(":as"), jsedn.sym("ses")]),
    new jsedn.Vector([jsedn.sym("clojure-csv.core"), jsedn.kw(":as"), jsedn.sym("csv")]),
    new jsedn.Vector([jsedn.sym("clojure.string"), jsedn.kw(":as"), jsedn.sym("cstr")]),
    new jsedn.Vector([jsedn.sym("incanter.core")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.dcat"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.dcterms"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.foaf"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.ons-geography"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.org"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.os"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.owl"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.pmd"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.qb"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.rdf"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.sdmx-attribute"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.sdmx-concept"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.sdmx-measure"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.skos"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.vcard"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.void"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.xsd"), jsedn.kw(":refer"), jsedn.kw(":all")])
    
]);

/* Declarations object. Used to render the individual declarations with the needed enclosing definitions in Clojure. */
var declarations;

/* Holds the individual declarations. Used to form the declarations object that can then be rendered in Clojure. */
var prefixers = [];

/* Holds the jsedn list of user functions. Used to render them in Clojure code. */
var userFunctions = [];

/* Jsedn definition of the graph-building function. */
var graphBuilderTemplate;

var graphFunction;

/* List of the graphs that will be included in the graph-building function. */
var graphs = new jsedn.List([]);

/* List of column keys derived through the GUI pipeline functions */
var columnKeys = new jsedn.Vector([]);

/* Interface for alerts about errors. To be used to connect to other interface components when we integrate the GUI. */
function alertInterface(error, errorString){
    /*
    TODO re-define me when integrating with the rest of the UI
    */
    alert(error, errorString);
}

/* Adds a namespace declaration to the  */
function addGrafterDeclaration(aDeclaration){
    declarationsList.val.push(aDeclaration);
}

/* Adds a prefixer to the list of pre-defined prefixers */
function addGrafterPrefixer(name, prefixString){
    var prefixer = new jsedn.List([jsedn.sym("def"), jsedn.sym(name), new jsedn.List([jsedn.sym("prefixer"), prefixString])]);
    prefixers.push(prefixer);
}

/* Constructs the namespace declarations used by Grafter */
function constructGrafterDeclarations(){
    declarations = new jsedn.List([
        jsedn.sym("ns"), jsedn.sym("sintef-grafter-gui-template.core"), declarationsList
    ]);
    return declarations;
}

/* Constructs the collection of defined prefixers for RDF-isation */
function constructGrafterPrefixersArray(){
    // we make a copy of the prefixers array that we eventually return
    var result = prefixers.slice();

    /* the prefixers array needs to be re-initialized so that we don't append new values to it when generating the Grafter code */
    prefixers=[];
    return result;
}

/* Adds a user function rendered as a jsedn object to the collection of user functions */
function addUserFunction(userFunctionEdn){
    userFunctions.push(userFunctionEdn);
}

/* Calls the jsedn parser and returns the parsed user function */
function parseAndAddUserFunction(userFunctionString){
    var result = parseEdnFromString(userFunctionString, "Error parsing user function!");
    if(result == null)
        return false;

    addUserFunction(result);
    return true;
}

function constructUserFunctions(){
    // we make a copy of the user functions array that we eventually return
    var result = userFunctions.slice();

    /* the user functions array needs to be re-initialized so that we don't append new values to it when generating the Grafter code */
    userFunctions = [];

    return result;
}

/* Constructs and returns the function used for transforming data to RDF */
function constructGraphTemplate(){
    graphBuilderTemplate = new jsedn.List([
        jsedn.sym("def"), jsedn.sym("make-graph"),
        graphFunction
    ]);

    return graphBuilderTemplate;
}

/* Creates the Grafter "graph-fn" function and encloses the separate graph-creating Grafter functions */
function createGraphFunction(keysString){

    graphFunction = new jsedn.List([
        jsedn.sym("graph-fn"), new jsedn.Vector([
            new jsedn.Map([
                jsedn.kw(":keys"), 
                parseEdnFromString(keysString, "Error parsing column keys Clojure string.")
            ])
        ])
    ]);
    graphs.map(function(arg){
        graphFunction.val.push(arg);
    });
}

/* Creates a new graph-creating Grafter function "graph" and adds it to an array used to create the "graph-fn" function */
function addGraph(graphURI, triplesString){
    var triplesObject = parseTriplesFromString(triplesString);

    var graphToAdd = new jsedn.List([
        jsedn.sym("graph"), graphURI,
        triplesObject
    ]);

    graphs.val.push(graphToAdd);
}

/* Temporary hack for the initial GUI implementation. Parses an input string (provided by the user) and creates
the corresponding jsedn objects. */
function parseTriplesFromString(triplesString){
    return parseEdnFromString(triplesString, "Error parsing triples string.");
}

/* Generic clojure code parser. Outputs a message to the alertInterface function 
in case an error occurs during parsing. 
*/
function parseEdnFromString(toParse, messageOnError){
    try{
        var ednObject = jsedn.parse(toParse);
        return ednObject;
    }catch(e){
        alertInterface(e, messageOnError);
        return null;
    }
}

/* Add a pipeline function (either user-defined or provided by Grafter) to an array which is used to construct the data transformation pipeline. */
function addPipelineFunction(jsednFunction){
    pipelineFunctions.val.push(jsednFunction);
}

/* Constructs and returns the data transformation pipeline. */
function constructPipeline(){
    pipeline = null;
    pipeline = new jsedn.List([jsedn.sym("defn"), jsedn.sym("pipeline"), new jsedn.Vector([new jsedn.sym("dataset")]), new jsedn.List([jsedn.sym("->"), jsedn.sym("dataset")])]);

    pipelineFunctions.map(function(arg){
        pipeline.val[3].val.push(arg);
    });
    pipelineFunctions=new jsedn.List([]);
    return pipeline;
}

/* Removes a function from the pipeline. TODO IS THIS NEEDED AT ALL?? */
function removeFunctionFromPipeline(index){
    pipelineFunctions.val.splice(index, 1);
}

/* Constructs and returns the RDF creation function. */
function constructRDFGraphFunction(rdfControl){
    var graphsJsEdnArray = [];
    var currentGraph = null;
    var graphFunction = new jsedn.List([
                                     new jsedn.sym("graph-fn"), 
                                     new jsedn.Vector([
                                         new jsedn.Map([new jsedn.kw(":keys"), columnKeys])
                                     ])
                                 ]);
    var currentGraphJsEdn = null;
    var currentRootJsEdn = null;
    
    for(i=0;i<rdfControl.graphs.length; ++i){
        currentGraph = rdfControl.graphs[i];
        console.log(currentGraph);
        currentGraphJsEdn = new jsedn.List([jsedn.sym("graph"), currentGraph.graphURI]);

        // construct a vector for each of the roots and add it to the graph jsedn
        for(j=0;j<currentGraph.graphRoots.length;++j){
            currentRootJsEdn = constructNodeVectorEdn(currentGraph.graphRoots[j]);
            currentGraphJsEdn.val.push(currentRootJsEdn);
        }
        console.log("GRAPH " + i + " ENCODED:", currentGraphJsEdn.ednEncode());
        graphFunction.val.push(currentGraphJsEdn);
    }
    var result = new jsedn.List([jsedn.sym("defn"), jsedn.sym("make-graph"), graphFunction]);


    return result;
}

function constructNodeVectorEdn(node){

    if (node instanceof Property) {
        if(node.subElements.length === 0){
            alertInterface("Error found in RDF mapping for the sub-elements node " + node.propertyName + "!");
            return;
        }
        var propertyValue = node.subElements[0];
        // [name {either single node or URI node with sub-nodes (as vector)}
        console.log("returning prop value");
        return new jsedn.Vector([constructPropertyJsEdn(node), constructNodeVectorEdn(propertyValue)]);
    }
    if (node instanceof ColumnLiteral) {
        if(node.literalValue.trim() === ""){
            alertInterface("Empty column literal mapping found!");
        }
        // return the value as symbol
        return new jsedn.sym(node.literalValue);
    }
    if (node instanceof ConstantLiteral) {
        if(node.literalValue.trim() === ""){
            alertInterface("Empty text literal found in RDF mapping!");
        }
        // return the value as string
        return node.literalValue;
    }
    if (node instanceof ColumnURI) {
        if (node.subElements.length == 0){
            // we terminate by this URI, return the column
            // TODO check in keywords array if this exists
            return constructColumnURINodeJsEdn(node);

        } else {
            console.log("more than one sub-elements of colURI");
            // [node-uri-as-generated {sub-1's edn representation} {sub-2's edn representation} ... {sub-n's edn representation}]
            var allSubElementsVector = new jsedn.Vector([constructColumnURINodeJsEdn(node)]);
            var subElementEdn;
            console.log("node.subElements.length:", node.subElements.length);
            for(k=0;k<node.subElements.length;++k){
                console.log("i", k);
                subElementEdn = constructNodeVectorEdn(node.subElements[k]);
                console.log("subElementEdn:", subElementEdn.ednEncode());
                allSubElementsVector.val.push(subElementEdn);
                console.log("allSubElementsVector:", allSubElementsVector.ednEncode());
            }
            return allSubElementsVector;
        }
    }
    if (node instanceof ConstantURI) {
        if (node.subElements.length == 0){
            // we terminate by this URI, return the column
            // TODO check in keywords array if this exists
            return constructConstantURINodeJsEdn(node);

        } else {
            // [node-uri-as-generated {sub-1's edn representation} {sub-2's edn representation} ... {sub-n's edn representation}]
            var allSubElementsVector = new jsedn.Vector([constructConstantURINodeJsEdn(node)]);
            var subElementEdn;
            for(i=0;i<node.subElements.length;++i){
                subElementEdn = constructNodeVectorEdn(node.subElements[i]);
                allSubElementsVector.val.push(subElementEdn);
            }
            return allSubElementsVector;
        }

    }
    if (node instanceof BlankNode) {
        // TODO not supported yet
    }
}

function constructPropertyJsEdn(property) {
    // graph URI as prefix, add nothing
    var propertyPrefix = property.prefix;
    var propertyName = property.propertyName;
    if(propertyPrefix == null) {
        alertInterface("Property prefix cannot be null:" + propertyName);
        return;
    } else if (propertyPrefix == "") {
        alertInterface("Property prefix cannot be omitted:" + propertyName);
        return;
    } else {
        if(isSupportedPrefix(propertyPrefix.trim())){
            // assume it's a supported property
            return new jsedn.sym(propertyPrefix+':'+propertyName);
        } else {
            // TODO make a check if we have defined the prefix
            // some custom prefix, that is hopefully defined in the UI (Edit Prefixes...)
            return new jsedn.List([new jsedn.sym(propertyPrefix), propertyName]);
        }
    }

}

function constructColumnURINodeJsEdn(colURINode) {
    // graph URI as prefix, add nothing
    var nodePrefix = colURINode.prefix;
    var nodeValue = colURINode.value;
    if(nodePrefix == null) {
        // base graph URI
        // ((prefixer "graphURI") nodeValue)
        return new jsedn.List([new jsedn.List([new jsedn.sym("prefixer"), colURINode.containingGraph.graphURI]), new jsedn.sym(nodeValue)]);
    } else if (nodePrefix == "") {
        // empty prefix - just take the column as symbol
        // nodeValue
        return new jsedn.sym(nodeValue);
    } else {
        if(isSupportedPrefix(nodePrefix.trim())){
            // supported prefix - no need to use prefixer - simple library call
            // nodePrefix:nodeValue (e.g. vcard:Address)
            alertInterface("Cannot associate column '" + nodeValue + "' with prefix '" + nodePrefix + "'!");
            return;
            //            return new jsedn.sym(nodePrefix + ":" + nodeValue);
        } else {
            // TODO make a check if we have defined the prefix
            // some custom prefix, that is hopefully defined in the UI (Edit Prefixes...)
            // both are symbols and we get (nodePrefix nodeValue) as a result
            return new jsedn.List([new jsedn.sym(nodePrefix), new jsedn.sym(nodeValue)]);
        }
    }

}

function constructConstantURINodeJsEdn(constURINode) {
    // graph URI as prefix, add nothing
    var nodePrefix = constURINode.prefix;
    var nodeValue = constURINode.value;
    if(nodePrefix == null) {
        // base graph URI
        // ((prefixer "graphURI") "nodeValue")
        return new jsedn.List([new jsedn.List([new jsedn.sym("prefixer"), constURINode.containingGraph.graphURI]), nodeValue]);
    } else if (nodePrefix == "") {
        // empty prefix - just take the column as symbol
        // nodeValue
        return nodeValue;
    } else {
        if(isSupportedPrefix(nodePrefix.trim())){

            // nodePrefix:nodeValue (e.g. vcard:Address)
            return new jsedn.sym(nodePrefix + ":" + nodeValue);
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
function createMakeDataset(columnsJsednSet){
    var jsednFunction = new jsedn.List([jsedn.sym("make-dataset"), columnsJsednSet]);
    return jsednFunction;
}

/* 
Creates and returns a 'drop-rows' Grafter function. 
Prototype: (drop-rows dataset n) - dataset is implied 
*/
function createDropRows(numberOfRows){
    var jsednFunction = new jsedn.List([jsedn.sym("drop-rows"), numberOfRows]);
    return jsednFunction;
}

/* 
Creates and returns a 'derive-column' Grafter function. 
Prototype: (derive-column dataset new-column-name from-cols f) - dataset is implied
*/
function createDeriveColumn(newColNameJsedn, fromColsJsedn, functionJsedn){

    if(typeof functionJsedn == 'undefined' || functionJsedn == null){
        var jsednFunction = new jsedn.List([jsedn.sym("derive-column"), newColNameJsedn, fromColsJsedn]);
    }else{
        var jsednFunction = new jsedn.List([jsedn.sym("derive-column"), newColNameJsedn, fromColsJsedn, functionJsedn]);
    }

    return jsednFunction;
}

/* 
Creates and returns a 'mapc' Grafter function in jsedn data model. Takes an array or a hashmap of functions and maps each to the key column of every row.
Prototype: (mapc dataset fs) - dataset is implied
*/
function createMapc(functionSetOrArrayJsedn){
    var jsednFunction = new jsedn.List([jsedn.sym("mapc"), functionSetOrArrayJsedn]);

    return jsednFunction;
}

function createCustomCodeForPipeline(code, displayName){
    var customCodeEdn = parseEdnFromString(code, "Error parsing custom code in " + displayName); 

    return customCodeEdn;
}

/***************************************************************************
    Testing functionalities programatically
***************************************************************************/
//$(function() {
//    /* Grafter Declarations */
//
//    var grafterDeclarations = constructGrafterDeclarations();
//
//    /* Prefixers */
//
//    addGrafterPrefixer("base-domain", "http://my-domain.com");
//    addGrafterPrefixer("base-graph", "http://my-domain.com/graph/");
//    addGrafterPrefixer("base-id", "http://my-domain.com/id/");
//    addGrafterPrefixer("base-vocab", "http://my-domain.com/def/");
//    addGrafterPrefixer("base-data", "http://my-domain.com/data/");
//
//    var grafterPrefixers = constructGrafterPrefixers();
//
//    /* User function. */
//    var userFunctionString = '(defn ->integer \
//"An example transformation function that converts a string to an integer" \
//[s] \
//(Integer/parseInt s) \
//)';
//
//    var userFunctionJsedn = parseUserFunction(userFunctionString);
//
//    addUserFunction(userFunctionJsedn);
//
//    /* Graph Template */
//
//    var graphTriplesString = "[person-uri [rdf:a foaf:Person] [foaf:gender sex] [foaf:age age] [foaf:name (s name)]]";
//
//    addGraph("http://my-domain.com/example", graphTriplesString);
//
//    var graphFunctionKeysString = "[name sex age person-uri gender]";
//
//    createGraphFunction(graphFunctionKeysString);
//
//    var resultingTemplate = constructGraphTemplate();
//
//    /* Pipeline Function */
//
//    var dropRowsFunct = createDropRows(1);
//    var makeDatasetFunc = createMakeDataset(new jsedn.Vector([jsedn.kw(":name"), jsedn.kw(":sex"), jsedn.kw(":age")]));
//    var deriveColFunct = createDeriveColumn(jsedn.kw(":person-uri"), new jsedn.Vector([jsedn.sym("name")]), jsedn.sym("base-id"));
//
//    var mapcFunctSetString = '{:age ->integer :sex {"f" (s "female") "m" (s "male")}}';
//    var mapcFunct = createMapc(parseEdnFromString(mapcFunctSetString, "error parsing"));
//
//    addPipelineFunction(dropRowsFunct);
//    addPipelineFunction(makeDatasetFunc);
//    addPipelineFunction(deriveColFunct);
//    addPipelineFunction(mapcFunct);
//
//    var resultingPipeline = constructPipeline();
//
//    var textStr = "";
////    console.log(grafterDeclarations.ednEncode());
//    textStr += (grafterDeclarations.ednEncode() + '\n' + '\n');
//    for(i=0;i<prefixers.length;++i){
////        console.log(prefixers[i].ednEncode());
//        textStr += (prefixers[i].ednEncode() + '\n');
//    }
////    console.log(userFunctions.val[0].ednEncode());
//    textStr += ('\n' + '\n' + userFunctions.val[0].ednEncode() + '\n' + '\n');
////    console.log(resultingTemplate.ednEncode());
//    textStr += (resultingTemplate.ednEncode() + '\n' + '\n');
////    console.log(resultingPipeline.ednEncode());
//    textStr += (resultingPipeline.ednEncode() + '\n' + '\n');
//
//
////    console.log(textStr);
//    $("#output").text(textStr);
//
//});

function setCode(code) {
    console.log("source code received", code);
};

function getCode() {
    return "this is a test";
};