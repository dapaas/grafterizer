/*jslint node: true */
/*jslint browser: true*/
/*jslint plusplus: true */
/*global $, jQuery, alert, alertInterface, jsedn */
/*jshint multistr: true */
/*jslint es5: true */
/*jslint nomen: true */
"use strict";

var Types = {};

// TODO validate all class inputs

//Graph.prototype.save() = function () {};

var Graft = function (graph) {
    this.graph = graph;
    this.__type = "Graft";
};
Graft.revive = function (data) {
    return new Graft(data.graph);
};
Types.Graft = Graft;

var Prefixer = function (name, uri) {
    this.name = name;
    this.uri = uri;
    this.__type = "Prefixer";
};
Prefixer.revive = function (data) {
    return new Prefixer(data.name, data.uri);
};
Types.Prefixer = Prefixer;

var GenericFunction = function (index) {
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
Types.CustomFunctionDeclaration = CustomFunctionDeclaration;

var CustomCode = function (index, name, clojureCode) {
    GenericFunction.call(this, index);
    this.name = name; // display name in the pipeline
    this.clojureCode = clojureCode; // clojure code corresponding to the function
    this.__type = "CustomCode";
};
CustomCode.revive = function (data) {
    return new CustomCode(data.index, data.name, data.clojureCode);
};
Types.CustomCode = CustomCode;

var DropRowsFunction = function (index, numberOfRows) {
    GenericFunction.call(this, index);
    this.numberOfRows = numberOfRows;
    this.__type = "DropRowsFunction";
};
DropRowsFunction.revive = function (data) {
    return new DropRowsFunction(data.index, data.numberOfRows);
};
Types.DropRowsFunction = DropRowsFunction;

var DeriveColumnFunction = function (index, newColName, colsToDeriveFrom, functionToDeriveWith) {
    GenericFunction.call(this, index);
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
DeriveColumnFunction.revive = function (data) {
    return new DeriveColumnFunction(data.index, data.newColName, data.colsToDeriveFrom, data.functionToDeriveWith);
};
Types.DeriveColumnFunction = DeriveColumnFunction;

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
Types.KeyFunctionPair = KeyFunctionPair;

var MapcFunction = function (index, keyFunctionPairs) {
    // array of obj with [key, function]
    GenericFunction.call(this, index);
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
MapcFunction.revive = function (data) {
    return new MapcFunction(data.index, data.keyFunctionPairs);
};
Types.MapcFunction = MapcFunction;

var MakeDatasetFunction = function (index, columnsArray) {
    // array of column names
    GenericFunction.call(this, index);
    this.columnsArray = columnsArray;
    this.__type = "MakeDatasetFunction";
};
MakeDatasetFunction.revive = function (data) {
    return new MakeDatasetFunction(data.index, data.columnsArray);
};
Types.MakeDatasetFunction = MakeDatasetFunction;

var Pipeline = function (functions) {
    // functions that make up the pipeline
    // TODO: revive!
    var funct, i;
    for (i = 0; i < functions.length; ++i) {
        funct = functions[i];
        if (!(funct instanceof GenericFunction)) {
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
Types.Pipeline = Pipeline;

var Transformation = function (customFunctionDeclarations, prefixers, pipelines, grafts) {
    // validate that inputs are revived
    var i, cfd, prefixer, pipeline, graft;
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

    for (i = 0; i < prefixers.length; ++i) {
        pipeline = pipelines[i];
        if (!(pipeline instanceof Pipeline) && pipeline.__type === "Pipeline") {
            // TODO: validate
            pipelines[i] = Pipeline.revive(pipeline);
        }
    }

    for (i = 0; i < prefixers.length; ++i) {
        graft = grafts[i];
        if (!(graft instanceof Graft) && prefixer.__type === "Graft") {
            // TODO: validate
            grafts[i] = Graft.revive(graft);
        }
    }

    this.customFunctionDeclarations = customFunctionDeclarations;
    this.prefixers = prefixers;
    this.pipelines = pipelines;
    this.grafts = grafts;
    this.__type = "Transformation";
};
Transformation.revive = function (data) {
    return new Transformation(data.customFunctionDeclarations, data.prefixers, data.pipelines, data.grafts);
};
Types.Transformation = Transformation;

$(function () {
    var f1, f2, cf1, cf2, customFunctionDeclarations, prefixer1, prefixer2, baseIdPrefixer, prefixer4, prefixer5, prefixers, pipeline, dropRowsFunction, makeDatasetFunction, deriveColumnFunction, ageKeyFuncMapping, sexKeyFuncMapping, mapcFunction, str, obj;

    f1 = "(defn ->integer \"An example transformation function that converts a string to an integer\"\
[s]\
(Integer/parseInt s))";

    f2 = "(defn ->gender\
[str]\
{\"f\" (s \"female\") \"m\" (s \"male\")}\
)";
    cf1 = new CustomFunctionDeclaration("->integer", f1);
    cf2 = new CustomFunctionDeclaration("->gender", f2);
    customFunctionDeclarations =  [cf1, cf2];

    prefixer1 = new Prefixer("base-domain", "http://my-domain.com");
    prefixer2 = new Prefixer("base-graph", "http://my-domain.com/graph/");
    baseIdPrefixer = new Prefixer("base-id", "http://my-domain.com/id/");
    prefixer4 = new Prefixer("base-vocab", "http://my-domain.com/def/");
    prefixer5 = new Prefixer("base-data", "http://my-domain.com/data/");

    prefixers = [prefixer1, prefixer2, baseIdPrefixer, prefixer4, prefixer5];

    dropRowsFunction = new DropRowsFunction(0, 1);
    makeDatasetFunction = new MakeDatasetFunction(1, [":name", ":sex", ":age"]);
    deriveColumnFunction = new DeriveColumnFunction(2, ":person-uri", [":name"], baseIdPrefixer);

    ageKeyFuncMapping = new KeyFunctionPair(":age", cf1);
    sexKeyFuncMapping = new KeyFunctionPair(":sex", cf2);
    mapcFunction = new MapcFunction(3, [ageKeyFuncMapping, sexKeyFuncMapping]);

    pipeline = new Pipeline([dropRowsFunction, makeDatasetFunction, deriveColumnFunction, mapcFunction]);

//    obj = JSON.parse(str, function (key, value) {
//        return key === '' && value.hasOwnProperty('__type')
//            ? Types[value.__type].revive(value) : this[key];
//    });

});