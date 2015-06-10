/*jslint node: true */
/*jslint browser: true*/
/*jslint plusplus: true */
/*global $, jQuery, alert, alertInterface, jsedn */
/*jshint multistr: true */
/*jslint es5: true */
/*jslint nomen: true */
"use strict";

// TODO validate all class inputs

//Graph.prototype.save() = function () {};
var SerializationTypesRegistry = {};

var Prefixer = function (name, uri) {
    this.name = name;
    this.uri = uri;
    this.__type = "Prefixer";
};
Prefixer.revive = function (data) {
    return new Prefixer(data.name, data.uri);
};

var PipelineFunction = function (index) {
    this.index = index;
};

var CustomFunctionDeclaration = function (name, clojureCode) {
    this.name = name;
    this.clojureCode = clojureCode;
    this.__type = "CustomFunctionDeclaration";
};
CustomFunctionDeclaration.revive = function (data) {
    return new CustomFunctionDeclaration(data.name, data.clojureCode);
};

var CustomCode = function (index, name, clojureCode) {
    PipelineFunction.call(this, index);
    this.name = name; // display name in the pipeline
    this.clojureCode = clojureCode; // clojure code corresponding to the function
    this.__type = "CustomCode";
};
CustomCode.prototype = Object.create(PipelineFunction.prototype);
CustomCode.prototype.getFunctionName = function () {
    return this.name;
};
CustomCode.revive = function (data) {
    return new CustomCode(data.index, data.name, data.clojureCode);
};

var DropRowsFunction = function (index, numberOfRows) {
    PipelineFunction.call(this, index);
    this.numberOfRows = numberOfRows;
    this.__type = "DropRowsFunction";
};
DropRowsFunction.prototype = Object.create(PipelineFunction.prototype);
DropRowsFunction.prototype.getFunctionName = function () {
    return "drop-rows";
};
DropRowsFunction.revive = function (data) {
    return new DropRowsFunction(data.index, data.numberOfRows);
};

var DeriveColumnFunction = function (index, newColName, colsToDeriveFrom, functionToDeriveWith) {
    PipelineFunction.call(this, index);
    this.newColName = newColName;
    this.colsToDeriveFrom = colsToDeriveFrom;
    if (functionToDeriveWith !== null) {
        if (!(functionToDeriveWith instanceof CustomFunctionDeclaration) && functionToDeriveWith.__type === "CustomFunctionDeclaration") {
            functionToDeriveWith = CustomFunctionDeclaration.revive(functionToDeriveWith);
        }
        if (!(functionToDeriveWith instanceof Prefixer) && functionToDeriveWith.__type === "Prefixer") {
            functionToDeriveWith = Prefixer.revive(functionToDeriveWith);
        }
    }

    this.functionToDeriveWith = functionToDeriveWith;
    this.__type = "DeriveColumnFunction";
};
DeriveColumnFunction.prototype = Object.create(PipelineFunction.prototype);
DeriveColumnFunction.prototype.getFunctionName = function () {
    return "derive-column";
};
DeriveColumnFunction.revive = function (data) {
    return new DeriveColumnFunction(data.index, data.newColName, data.colsToDeriveFrom, data.functionToDeriveWith);
};

var KeyFunctionPair = function (key, func) {
    this.key = key;
    if (func !== null) {
        if (!(func instanceof CustomFunctionDeclaration) && func.__type === "CustomFunctionDeclaration") {
            func = CustomFunctionDeclaration.revive(func);
        }
        // Prefixers are also functions
        if (!(func instanceof Prefixer)  && func.__type === "Prefixer") {
            func = Prefixer.revive(func);
        }
    } else {
        console.error("NULL function mapping");
    }
    this.func = func;
    this.__type = "KeyFunctionPair";
};
KeyFunctionPair.revive = function (data) {
    return new KeyFunctionPair(data.key, data.func);
};

var MapcFunction = function (index, keyFunctionPairs) {
    // array of obj with [key, function]
    PipelineFunction.call(this, index);
    var i, kfPair;
    if (keyFunctionPairs !== null) {
        for (i = 0; i < keyFunctionPairs.length; ++i) {
            kfPair = keyFunctionPairs[i];
            if (!(kfPair instanceof KeyFunctionPair) && kfPair.__type === "KeyFunctionPair") {
                keyFunctionPairs[i] = KeyFunctionPair.revive(kfPair);
            }
        }
    }
    this.keyFunctionPairs = keyFunctionPairs;
    this.__type = "MapcFunction";
};
MapcFunction.prototype = Object.create(PipelineFunction.prototype);
MapcFunction.prototype.getFunctionName = function () {
    return "mapc";
};
MapcFunction.revive = function (data) {
    return new MapcFunction(data.index, data.keyFunctionPairs);
};

var MakeDatasetFunction = function (index, columnsArray) {
    // array of column names
    PipelineFunction.call(this, index);
    this.columnsArray = columnsArray;
    this.__type = "MakeDatasetFunction";
};
MakeDatasetFunction.prototype = Object.create(PipelineFunction.prototype);
MakeDatasetFunction.prototype.getFunctionName = function () {
    return "make-dataset";
};
MakeDatasetFunction.revive = function (data) {
    return new MakeDatasetFunction(data.index, data.columnsArray);
};
SerializationTypesRegistry.MakeDatasetFunction = MakeDatasetFunction;

var Pipeline = function (functions) {
    // functions that make up the pipeline
    // TODO: revive!
    var funct, i;
    for (i = 0; i < functions.length; ++i) {
        funct = functions[i];
        if (!(funct instanceof PipelineFunction)) {
            if (funct.__type === "CustomCode") {
                functions[i] = CustomCode.revive(funct);
            }
            if (funct.__type === "DropRowsFunction") {
                functions[i] = DropRowsFunction.revive(funct);
            }
            if (funct.__type === "DeriveColumnFunction") {
                functions[i] = DeriveColumnFunction.revive(funct);
            }
            if (funct.__type === "MapcFunction") {
                functions[i] = MapcFunction.revive(funct);
            }
            if (funct.__type === "MakeDatasetFunction") {
                functions[i] = MakeDatasetFunction.revive(funct);
            }
        }
    }
    this.functions = functions;
    this.__type = "Pipeline";
};
Pipeline.revive = function (data) {
    return new Pipeline(data.functions);
};
Pipeline.removeFunction = function (funct) {
    var functIndex = this.functions.indexOf(funct);
    
    if(functIndex !== -1) {
        this.functions.splice(functIndex, 1);
    }
};

// TODO refactor - make function the same for all classes
function getStringifiableElement(inputElement) {
    if (!(inputElement instanceof StringifiableRDFElement)) {
        return SerializationTypesRegistry[inputElement.__type].revive(inputElement);
    } else {
        return inputElement;
    }
}

var StringifiableRDFElement = function (subElements) {
    var i, subElement, stringifiableSubElements;
    stringifiableSubElements = [];
    if (subElements) {
        for (i = 0; i < subElements.length; ++i) {
            stringifiableSubElements.push(getStringifiableElement(subElements[i]));
        }
    }
    this.subElements = stringifiableSubElements;
};

var StringifiableURINode = function (prefix, subElements) {
    StringifiableRDFElement.call(this, subElements);
    this.prefix = prefix;
};
StringifiableURINode.prototype = Object.create(StringifiableRDFElement.prototype);
StringifiableURINode.revive = function (data) {
    return new StringifiableURINode(data.prefix, data.subElements);
};

var StringifiableConstantURI = function (prefix, constantURIText, subElements) {
    StringifiableURINode.call(this, prefix, subElements);
    this.constant = constantURIText;
    this.__type = "StringifiableConstantURI";
};
StringifiableConstantURI.prototype = Object.create(StringifiableURINode.prototype);
StringifiableConstantURI.prototype.getDOMElement = function (containingElement) {
    var i, subElement, constantURI;
    constantURI = new ConstantURI(containingElement, this.prefix, this.constant);
    constantURI.subElements = [];
    if (this.subElements) {
        for (i = 0; i < this.subElements.length; ++i) {
            subElement = this.subElements[i];
            constantURI.addChild(subElement.getDOMElement(constantURI));
        }
    }
    return constantURI;
};
StringifiableConstantURI.revive = function (data) {
    return new StringifiableConstantURI(data.prefix, data.constant, data.subElements);
};

var StringifiableColumnURI = function (prefix, columnName, subElements) {
    StringifiableURINode.call(this, prefix, subElements);
    this.column = columnName;
    this.__type = "StringifiableColumnURI";
};
StringifiableColumnURI.prototype = Object.create(StringifiableURINode.prototype);
StringifiableColumnURI.prototype.getDOMElement = function (containingElement) {
    var i, subElement, columnURI;
    columnURI = new ColumnURI(containingElement, this.prefix, this.column);
    columnURI.subElements = [];
    if (this.subElements) {
        for (i = 0; i < this.subElements.length; ++i) {
            subElement = this.subElements[i];
            columnURI.addChild(subElement.getDOMElement(columnURI));
        }
    }
    return columnURI;
};
StringifiableColumnURI.revive = function (data) {
    return new StringifiableColumnURI(data.prefix, data.column, data.subElements);
};

var StringifiableProperty = function (prefix, propertyName, subElements) {
    StringifiableRDFElement.call(this, subElements);
    this.prefix = prefix;
    this.propertyName = propertyName;
    this.__type = "StringifiableProperty";
};
StringifiableProperty.prototype = Object.create(StringifiableRDFElement.prototype);
StringifiableProperty.prototype.getDOMElement = function (containingElement) {
    var i, subElement, property;
    property = new Property(containingElement, this.prefix, this.propertyName);
    property.subElements = [];
    if (this.subElements) {
        for (i = 0; i < this.subElements.length; ++i) {
            subElement = this.subElements[i];
            property.addChild(subElement.getDOMElement(property));
        }
    }
    return property;
};
StringifiableProperty.revive = function (data) {
    return new StringifiableProperty(data.prefix, data.propertyName, data.subElements);
};

var StringifiableColumnLiteral = function (literalText, subElements) {
    StringifiableRDFElement.call(this, subElements);
    this.literalValue = literalText;
    this.__type = "StringifiableColumnLiteral";
};
StringifiableColumnLiteral.prototype = Object.create(StringifiableRDFElement.prototype);
StringifiableColumnLiteral.prototype.getDOMElement = function (containingElement) {
    var i, subElement, columnLiteral;
    columnLiteral = new ColumnLiteral(containingElement, this.literalValue);
    columnLiteral.subElements = [];
    if (this.subElements) {
        for (i = 0; i < this.subElements.length; ++i) {
            subElement = this.subElements[i];
            columnLiteral.addChild(subElement.getDOMElement(columnLiteral));
        }
    }
    return columnLiteral;
};
StringifiableColumnLiteral.revive = function (data) {
    return new StringifiableColumnLiteral(data.literalValue, data.subElements);
};

var StringifiableConstantLiteral = function (literalText, subElements) {
    StringifiableRDFElement.call(this, subElements);
    this.literalValue = literalText;
    this.__type = "StringifiableConstantLiteral";
};
StringifiableConstantLiteral.prototype = Object.create(StringifiableRDFElement.prototype);
StringifiableConstantLiteral.prototype.getDOMElement = function (containingElement) {
    var i, subElement, constantLiteral;
    constantLiteral = new ConstantLiteral(containingElement, this.literalValue);
    constantLiteral.subElements = [];
    if (this.subElements) {
        for (i = 0; i < this.subElements.length; ++i) {
            subElement = this.subElements[i];
            constantLiteral.addChild(subElement.getDOMElement(constantLiteral));
        }
    }
    return constantLiteral;
};
StringifiableConstantLiteral.revive = function (data) {
    return new StringifiableColumnLiteral(data.literalText, data.subElements);
};

var StringifiableGraph = function (graphURI, graphRoots) {
    var i, stringifiableGraphRoots;
    
    stringifiableGraphRoots = [];
    // just a string
    this.graphURI = graphURI;
    // need to get stringifiable roots first
    for (i = 0; i < graphRoots.length; ++i) {
        stringifiableGraphRoots.push(getStringifiableElement(graphRoots[i]));
    }
    this.graphRoots = stringifiableGraphRoots;
    this.__type = "StringifiableGraph";
};
StringifiableGraph.loadDOMGraph = function (rdfControl, stringifiableGraph) {
    var resultingGraph, i, graphRoot;
    resultingGraph = new Graph(stringifiableGraph.graphURI, rdfControl);
    for (i = 0; i < stringifiableGraph.graphRoots.length; ++i) {
        graphRoot = stringifiableGraph.graphRoots[i];
        resultingGraph.addChild(graphRoot.getDOMElement(resultingGraph));
    }
    // iterate roots
    // create dom root
    // add to resulting graph
    return resultingGraph;
};
StringifiableGraph.revive = function (data) {
    return new StringifiableGraph(data.graphURI, data.graphRoots);
};

var Transformation = function (customFunctionDeclarations, prefixers, pipelines, graphs) {
    // validate that inputs are revived
    var i, cfd, prefixer, pipeline, graph;
    
    for (i = 0; i < customFunctionDeclarations.length; ++i) {
        cfd = customFunctionDeclarations[i];
        if (!(cfd instanceof CustomFunctionDeclaration)  && cfd.__type === "CustomFunctionDeclaration") {
            // TODO: validate, above doesn't check for null
            customFunctionDeclarations[i] = CustomFunctionDeclaration.revive(cfd);
        }
    }

    for (i = 0; i < prefixers.length; ++i) {
        prefixer = prefixers[i];
        if (!(prefixer instanceof Prefixer) && prefixer.__type === "Prefixer") {
            // TODO: validate
            prefixers[i] = Prefixer.revive(prefixer);
        }
    }

    for (i = 0; i < pipelines.length; ++i) {
        pipeline = pipelines[i];
        if (!(pipeline instanceof Pipeline) && pipeline.__type === "Pipeline") {
            // TODO: validate
            pipelines[i] = Pipeline.revive(pipeline);
        }
    }
   
    for (i = 0; i < graphs.length; ++i) {
        graph = graphs[i];
        if (!(graph instanceof StringifiableGraph) && graph.__type === "StringifiableGraph") {
            graphs[i] = StringifiableGraph.revive(graphs[i]);
        }
    }

    this.customFunctionDeclarations = customFunctionDeclarations;
    this.prefixers = prefixers;
    this.pipelines = pipelines;
    this.graphs = graphs;
    this.__type = "Transformation";
};
Transformation.revive = function (data) {
    
    return new Transformation(data.customFunctionDeclarations, data.prefixers, data.pipelines, data.graphs);
};

SerializationTypesRegistry.Transformation = Transformation;
SerializationTypesRegistry.Graph = Graph; 
SerializationTypesRegistry.Property = Property;
SerializationTypesRegistry.ConstantLiteral = ConstantLiteral;
SerializationTypesRegistry.ColumnLiteral = ColumnLiteral;
SerializationTypesRegistry.ColumnURI = ColumnURI;
SerializationTypesRegistry.ConstantURI = ConstantURI;
SerializationTypesRegistry.BlankNode = BlankNode;
SerializationTypesRegistry.Prefixer = Prefixer;
SerializationTypesRegistry.CustomFunctionDeclaration = CustomFunctionDeclaration;
SerializationTypesRegistry.CustomCode = CustomCode;
SerializationTypesRegistry.DropRowsFunction = DropRowsFunction;
SerializationTypesRegistry.DeriveColumnFunction = DeriveColumnFunction;
SerializationTypesRegistry.KeyFunctionPair = KeyFunctionPair;
SerializationTypesRegistry.MapcFunction = MapcFunction;
SerializationTypesRegistry.Pipeline = Pipeline;
SerializationTypesRegistry.StringifiableConstantURI = StringifiableConstantURI;
SerializationTypesRegistry.StringifiableColumnURI = StringifiableColumnURI;
SerializationTypesRegistry.StringifiableProperty = StringifiableProperty;
SerializationTypesRegistry.StringifiableColumnLiteral = StringifiableColumnLiteral;
SerializationTypesRegistry.StringifiableConstantLiteral = StringifiableConstantLiteral;
SerializationTypesRegistry.StringifiableGraph = StringifiableGraph;
