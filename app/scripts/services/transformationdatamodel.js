'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.transformationDataModel
 * @description
 * # transformationDataModel
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
    .service('transformationDataModel', function () {
    // TODO some day use JS6 class syntax
    // TODO VERY DIRTY HACK PLEASE FIXME
    var Types = this;

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

    var GenericFunction = function () {
        if (!this.generateClojure) {
            this.generateClojure = function(){
                return new jsedn.List([jsedn.kw(":todo")]);
            };
        }
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

    var CustomCode = function (name, clojureCode) {
        GenericFunction.call(this);
        this.name = "custom-code";
        this.displayName = name; // display name in the pipeline
        this.clojureCode = clojureCode; // clojure code corresponding to the function
        this.__type = "CustomCode";
    };
    CustomCode.revive = function (data) {
        return new CustomCode(data.name, data.clojureCode);
    };
    CustomCode.prototype.generateClojure = function(){
        // return new jsedn.List([jsedn.kw(":canard")]);
        try{
            var ednObject = jsedn.parse(this.clojureCode);
            return ednObject;
        }catch(e){
            // alertInterface(e, messageOnError);
            return null;
        }
        // return parseEdnFromString(this.clojureCode, "Error parsing custom code in " + this.name); 
    };
    Types.CustomCode = CustomCode;

    var DropRowsFunction = function (numberOfRows) {
        GenericFunction.call(this);
        this.numberOfRows = numberOfRows;
        this.name = "drop-rows";
        this.displayName = "drop-rows";
        this.__type = "DropRowsFunction";
    };
    DropRowsFunction.revive = function (data) {
        return new DropRowsFunction(data.numberOfRows);
    };
    Types.DropRowsFunction = DropRowsFunction;

    var DeriveColumnFunction = function (newColName, colsToDeriveFrom, functionToDeriveWith) {
        GenericFunction.call(this);
        this.newColName = newColName;
        this.colsToDeriveFrom = colsToDeriveFrom;
        this.name = "derive-column";
        this.displayName = "derive-column";
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
        return new DeriveColumnFunction(data.newColName, data.colsToDeriveFrom, data.functionToDeriveWith);
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

    var MapcFunction = function (keyFunctionPairs) {
        // array of obj with [key, function]
        GenericFunction.call(this);
        this.name = "mapc";
        this.displayName = "mapc";
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
        return new MapcFunction(data.keyFunctionPairs);
    };
    Types.MapcFunction = MapcFunction;

    var MakeDatasetFunction = function (columnsArray) {
        // array of column names
        this.name = "make-dataset";
        this.displayName = "make-dataset";
        GenericFunction.call(this);
        this.columnsArray = columnsArray;
        this.__type = "MakeDatasetFunction";
    };
    MakeDatasetFunction.revive = function (data) {
        return new MakeDatasetFunction(data.columnsArray);
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
    Pipeline.prototype.addAfter = function (funct, functionToAdd){
        var index = this.functions.indexOf(funct);
        if(!functionToAdd || index === -1) {
            this.functions.push(functionToAdd);
        } else {
            if(index === this.functions.length - 1){
                this.functions.push(functionToAdd);
                return true;
            }
            else {
                return this.functions.splice(index + 1, 0, functionToAdd);
            }
        }
    };
    Pipeline.prototype.remove = function (funct) {
        var index = this.functions.indexOf(funct);
        if(index ===-1 || funct === null || funct === undefined) {
            console.log("tried to remove non-existing function");
            return false;
        }
        
        this.functions.splice(index, 1);
        return true;
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

        for (i = 0; i < pipelines.length; ++i) {
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
    // AngularJS will instantiate a singleton by calling "new" on this function
});
