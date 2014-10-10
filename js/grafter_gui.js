/* TODO BEFORE FIRST COMMIT - Copyrights!*/


var pipelineFunctions = new jsedn.List([]);

var pipeline = new jsedn.List([jsedn.sym("defn"), jsedn.sym("pipeline"), new jsedn.Vector([new jsedn.sym("dataset")]),
                               new jsedn.List([jsedn.sym("->"), jsedn.sym("dataset")])]);

/* Holds the individual declarations. Used to form the declarations object that can then be rendered in Clojure. */
var declarationsList = new jsedn.List([
    jsedn.kw(":require"),
    new jsedn.Vector([jsedn.sym("grafter.rdf"), jsedn.kw(":refer"), new jsedn.Vector([jsedn.sym("graph-fn"), jsedn.sym("graph"), jsedn.sym("s"), jsedn.sym("add"), jsedn.sym("prefixer")])]),
    new jsedn.Vector([jsedn.sym("grafter.tabular"), jsedn.kw(":refer"), new jsedn.Vector(
        [jsedn.sym("column-names"), jsedn.sym("columns"), jsedn.sym("rows"), jsedn.sym("all-columns"), jsedn.sym("derive-column"),
         jsedn.sym("mapc"), jsedn.sym("swap"), jsedn.sym("drop-rows"), jsedn.sym("open-all-datasets"), jsedn.sym("make-dataset"), 
         jsedn.sym("move-first-row-to-header"), jsedn.sym("_")
        ])]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.sesame"), jsedn.kw(":as"), jsedn.sym("ses")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.rdf"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.foaf"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.void"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.dcterms"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.vcard"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.pmd"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.qb"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.os"), jsedn.kw(":refer"), jsedn.kw(":all")]),
    new jsedn.Vector([jsedn.sym("grafter.rdf.ontologies.sdmx-measure"), jsedn.kw(":refer"), jsedn.kw(":all")])
]);

/* Declarations object. Used to render the individual declarations with the needed enclosing definitions in Clojure. */
var declarations;

/* Holds the individual declarations. Used to form the declarations object that can then be rendered in Clojure. */
var prefixers = [];

/* Holds the jsedn list of user functions. Used to render them in Clojure code. */
var userFunctions = new jsedn.List([]);

/* Jsedn definition of the graph-building function. */
var graphBuilderTemplate;

var graphFunction;

/* List of the graphs that will be included in the graph-building function. */
var graphs = new jsedn.List([]);

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
function constructGrafterPrefixers(){
    return prefixers;
}

/* Adds a user function rendered as a jsedn object to the collection of user functions */
function addUserFunction(userFunctionEdn){
    userFunctions.val.push(userFunctionEdn);
}

/* Calls the jsedn parser and returns the parsed user function */
function parseUserFunction(userFunctionString){
    return parseEdnFromString(userFunctionString, "Error parsing user function!");
}

/*
TODO check this with Rick - difference between the generated and provided graph URI; same with the prefixers

(def make-graph
  (graph-fn [{:keys [name sex age person-uri gender]}]
            (graph (base-graph "example")
                   [person-uri
                    [rdf:a foaf:Person]
                    [foaf:gender sex]
                    [foaf:age age]
                    [foaf:name (s name)]])))
                    
(def make-graph 
   (graph-fn [{:keys [name sex age person-uri gender]}] 
            (graph "http://my-domain.com/example" 
                   [person-uri 
                    [rdf:a foaf:Person] 
                    [foaf:gender sex] 
                    [foaf:age age] 
                    [foaf:name (s name)]])))


*/
function constructGraphTemplate(){
    graphBuilderTemplate = new jsedn.List([
        jsedn.sym("def"), jsedn.sym("make-graph"),
        graphFunction
    ]);

    return graphBuilderTemplate;
}

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
    }
}

// TODO to be defined for future versions of the UI
function constructTriples(){
}

function addPipelineFunction(jsednFunction){
    pipelineFunctions.val.push(jsednFunction);
}

function constructPipeline(){
    pipeline.val.push(pipelineFunctions);
    return pipeline;
}

/*************************
    Pipeline functions.
**************************/

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


function removeFunctionFromPipeline(index){
    pipelineFunctions.val.splice(index, 1);
}

/*
    Testing functionalities programatically
*/
$(function() {
    /* Grafter Declarations */
    
    var grafterDeclarations = constructGrafterDeclarations();
    
    /* Prefixers */
    
    addGrafterPrefixer("base-domain", "http://my-domain.com");
    addGrafterPrefixer("base-graph", "http://my-domain.com/graph/");
    addGrafterPrefixer("base-id", "http://my-domain.com/id/");
    addGrafterPrefixer("base-vocab", "http://my-domain.com/def/");
    addGrafterPrefixer("base-data", "http://my-domain.com/data/");
    
    var grafterPrefixers = constructGrafterPrefixers();
    
    /* User function. */
    var userFunctionString = '(defn ->integer \
                                "An example transformation function that converts a string to an integer" \
                                    [s] \
                                    (Integer/parseInt s) \
                              )';
    
    var userFunctionJsedn = parseUserFunction(userFunctionString);
    
    addUserFunction(userFunctionJsedn);
    
    /* Graph Template */
    
    var graphTriplesString = "[person-uri [rdf:a foaf:Person] [foaf:gender sex] [foaf:age age] [foaf:name (s name)]]";
    
    addGraph("http://my-domain.com/example", graphTriplesString);
                              
    var graphFunctionKeysString = "[name sex age person-uri gender]";
    
    createGraphFunction(graphFunctionKeysString);
    
    var resultingTemplate = constructGraphTemplate();
    
    /* Pipeline Function */
    
    var dropRowsFunct = createDropRows(1);
    var makeDatasetFunc = createMakeDataset(new jsedn.Vector([jsedn.kw(":name"), jsedn.kw(":sex"), jsedn.kw(":age")]));
    var deriveColFunct = createDeriveColumn(jsedn.kw(":person-uri"), new jsedn.Vector([jsedn.sym("name")]), jsedn.sym("base-id"));
    
    var mapcFunctSetString = '{:age ->integer :sex {"f" (s "female") "m" (s "male")}}';
    var mapcFunct = createMapc(parseEdnFromString(mapcFunctSetString, "error parsing"));
    
    addPipelineFunction(dropRowsFunct);
    addPipelineFunction(makeDatasetFunc);
    addPipelineFunction(deriveColFunct);
    addPipelineFunction(mapcFunct);
    
    var resultingPipeline = constructPipeline();
    
    // TODOS: prefixers should be in a normal list; user functions also -> iterate over them
    
    var textStr = "";
    console.log(grafterDeclarations.ednEncode());
    textStr += (grafterDeclarations.ednEncode() + '\n' + '\n');
    for(i=0;i<prefixers.length;++i){
        console.log(prefixers[i].ednEncode());
        textStr += (prefixers[i].ednEncode() + '\n');
    }
    console.log(userFunctions.val[0].ednEncode());
    textStr += ('\n' + '\n' + userFunctions.val[0].ednEncode() + '\n' + '\n');
    console.log(resultingTemplate.ednEncode());
    textStr += (resultingTemplate.ednEncode() + '\n' + '\n');
    console.log(resultingPipeline.ednEncode());
    textStr += (resultingPipeline.ednEncode() + '\n' + '\n');
    
    
    console.log(textStr);
    $("#output").text(textStr);
});

