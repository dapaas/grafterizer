'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.transformationDataModel
 * @description
 * # transformationDataModel
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('transformationDataModel', function($mdToast) {
  var _this = this;

  var Prefixer = function(name, uri) {
    this.name = name;
    this.uri = uri;
    this.__type = 'Prefixer';
  };

  Prefixer.revive = function(data) {
    return new Prefixer(data.name, data.uri);
  };

  this.Prefixer = Prefixer;

  var GenericFunction = function() {
    if (!this.generateClojure) {
      this.generateClojure = function() {
        return new jsedn.List([jsedn.sym(this.name)]);
      };
    }
  };

  var CustomFunctionDeclaration = function(name, clojureCode) {
    this.name = name;
    this.clojureCode = clojureCode;
    this.__type = 'CustomFunctionDeclaration';
  };
  CustomFunctionDeclaration.revive = function(data) {
    return new CustomFunctionDeclaration(data.name, data.clojureCode);
  };
  this.CustomFunctionDeclaration = CustomFunctionDeclaration;

  var CustomCode = function(name, clojureCode) {
    GenericFunction.call(this);
    this.name = 'custom-code';
    this.displayName = name; // display name in the pipeline
    this.clojureCode = clojureCode; // clojure code corresponding to the function
    this.__type = 'CustomCode';
  };
  CustomCode.revive = function(data) {
    return new CustomCode(data.displayName, data.clojureCode);
  };
  CustomCode.prototype.generateClojure = function() {
    try {
      return jsedn.parse(this.clojureCode);
    } catch (e) {
      $mdToast.show(
        $mdToast.simple()
        .content('Unable to parse custom code in ' + this.name)
        .position('bottom left')
        .hideDelay(6000)
      );
      return null;
    }
  };
  this.CustomCode = CustomCode;

  var DropRowsFunction = function(numberOfRows) {
    GenericFunction.call(this);
    this.numberOfRows = numberOfRows;
    this.name = 'drop-rows';
    this.displayName = 'drop-rows';
    this.__type = 'DropRowsFunction';
  };
  DropRowsFunction.revive = function(data) {
    return new DropRowsFunction(data.numberOfRows);
  };
  DropRowsFunction.prototype.generateClojure = function() {
    return new jsedn.List([jsedn.sym('drop-rows'), this.numberOfRows]);
  };
  this.DropRowsFunction = DropRowsFunction;

  var TakeRowsFunction = function(numberOfRows) {
    GenericFunction.call(this);
    this.numberOfRows = numberOfRows;
    this.name = 'take-rows';
    this.displayName = 'take-rows';
    this.__type = 'TakeRowsFunction';
  };
  TakeRowsFunction.revive = function(data) {
    return new TakeRowsFunction(data.numberOfRows);
  };
  TakeRowsFunction.prototype.generateClojure = function() {
    return new jsedn.List([jsedn.sym('take-rows'), this.numberOfRows]);
  };
  this.TakeRowsFunction = TakeRowsFunction;
  
  var DeriveColumnFunction = function(newColName, colsToDeriveFrom, functionToDeriveWith) {
    GenericFunction.call(this);
    this.newColName = newColName;
    this.colsToDeriveFrom = colsToDeriveFrom;
    this.name = 'derive-column';
    this.displayName = 'derive-column';
    if (functionToDeriveWith !== null) {
      if (!(functionToDeriveWith instanceof CustomFunctionDeclaration) && functionToDeriveWith.__type ===
          'CustomFunctionDeclaration') {
        functionToDeriveWith = CustomFunctionDeclaration.revive(functionToDeriveWith);
      }

      if (!(functionToDeriveWith instanceof Prefixer) && functionToDeriveWith.__type === 'Prefixer') {
        functionToDeriveWith = Prefixer.revive(functionToDeriveWith);
      }
    }

    this.functionToDeriveWith = functionToDeriveWith;
    this.__type = 'DeriveColumnFunction';
  };
  DeriveColumnFunction.revive = function(data) {
    return new DeriveColumnFunction(data.newColName, data.colsToDeriveFrom, data.functionToDeriveWith);
  };
  DeriveColumnFunction.prototype.generateClojure = function() {
    var colsToDeriveFromClj = new jsedn.Vector([]);
    var flag = false;
    for (var i = 0; i < this.colsToDeriveFrom.length; ++i) {
      colsToDeriveFromClj.val.push(new jsedn.kw(':' + this.colsToDeriveFrom[i]));
      flag = true;
    }

    var values = [jsedn.sym('derive-column'),
                  this.newColName ? new jsedn.kw(':' + this.newColName) : new jsedn.kw(':unnamed'),
                  colsToDeriveFromClj];

    if (this.functionToDeriveWith && this.functionToDeriveWith.name) {
      values.push(jsedn.sym(this.functionToDeriveWith.name));
    }

    return new jsedn.List(values);
  };
  this.DeriveColumnFunction = DeriveColumnFunction;

  var KeyFunctionPair = function(key, funcName) {
    this.key = key;

    //        if (func !== null) {
    //            console.log('mapc');
    //            console.log(key, func);
    //            try{
    //                var tmp = JSON.parse(func);
    //                func = tmp;
    //            } catch(e) {
    //                console.log('couldn't parse, moving on');
    //            }
    //            console.log('after parsing');
    //            console.log(key, func);
    //            funcName = func.name;
    // TODO is reviving necessary here? we only need the name which we can get from parsing
    ////            if(func)
    //            if (!(func instanceof CustomFunctionDeclaration) && func.__type === 'CustomFunctionDeclaration') {
    //                func = CustomFunctionDeclaration.revive(func);
    //            }
    //            // Prefixers are also functions
    //            if (!(func instanceof Prefixer)  && func.__type === 'Prefixer') {
    //                func = Prefixer.revive(func);
    //            }
    //        } else {
    //            console.error('NULL function mapping');
    //        }
    this.func = funcName;
    this.__type = 'KeyFunctionPair';
  };
  KeyFunctionPair.revive = function(data) {
    return new KeyFunctionPair(data.key, data.func);
  };
  this.KeyFunctionPair = KeyFunctionPair;

  var MapcFunction = function(keyFunctionPairs) {
    // array of obj with [key, function]
    GenericFunction.call(this);
    this.name = 'mapc';
    this.displayName = 'mapc';
    var i;
    var kfPair;
    if (keyFunctionPairs !== null) {
      for (i = 0; i < keyFunctionPairs.length; ++i) {
        kfPair = keyFunctionPairs[i];
        if (kfPair !== null) {
          if (!(kfPair instanceof KeyFunctionPair) && kfPair.__type === 'KeyFunctionPair') {
            keyFunctionPairs[i] = KeyFunctionPair.revive(kfPair);
          }
        }
      }
    }

    this.keyFunctionPairs = keyFunctionPairs;
    this.__type = 'MapcFunction';
  };
  MapcFunction.revive = function(data) {
    return new MapcFunction(data.keyFunctionPairs);
  };
  MapcFunction.prototype.generateClojure = function() {
    var i;
    var keyFunctionPairsClj = new jsedn.Map([]);

    for (i = 0; i < this.keyFunctionPairs.length; ++i) {
      keyFunctionPairsClj.set(
        new jsedn.kw(':' + this.keyFunctionPairs[i].key),
        new jsedn.sym(this.keyFunctionPairs[i].func)
      );
    }

    return new jsedn.List([jsedn.sym('mapc'), keyFunctionPairsClj]);
  };
  MapcFunction.prototype.removeKeyFunctionPair = function(kfPair) {
    var index = this.keyFunctionPairs.indexOf(kfPair);
    if (index === -1 || kfPair === null || kfPair === undefined) {
      console.log('tried to remove non-existing function');
      return false;
    }

    this.keyFunctionPairs.splice(index, 1);
    return true;
  };
  this.MapcFunction = MapcFunction;

  this.getGraphElement = function(inputElement) {
    if (!(inputElement instanceof RDFElement)) {
      return _this[inputElement.__type].revive(inputElement);
    } else {
      return inputElement;
    }
  };


  var MakeDatasetFunction = function(columnsArray) {
    // array of column names
    this.name = 'make-dataset';
    this.displayName = 'make-dataset';
    GenericFunction.call(this);
    this.columnsArray = columnsArray;
    this.__type = 'MakeDatasetFunction';
  };
  MakeDatasetFunction.revive = function(data) {
    return new MakeDatasetFunction(data.columnsArray);
  };
  MakeDatasetFunction.prototype.generateClojure = function() {
    //(make-dataset [:name :sex :age])
    var i;
    var colNamesClj = new jsedn.Vector([]);
    for (i = 0; i < this.columnsArray.length; ++i) {
      colNamesClj.val.push(new jsedn.kw(':' + this.columnsArray[i]));
    }

    return new jsedn.List([jsedn.sym('make-dataset'), colNamesClj]);
  };

  this.MakeDatasetFunction = MakeDatasetFunction;

  var Pipeline = function(functions) {
    // functions that make up the pipeline
    // TODO: revive!
    var funct;
    var i;
    for (i = 0; i < functions.length; ++i) {
      funct = functions[i];
      if (!(funct instanceof GenericFunction)) {
        if (funct.__type === 'CustomCode') {
          functions[i] = CustomCode.revive(funct);
        }

        if (funct.__type === 'DropRowsFunction') {
          functions[i] = DropRowsFunction.revive(funct);
        }

        if (funct.__type === 'TakeRowsFunction') {
          functions[i] = TakeRowsFunction.revive(funct);
        }
        
        if (funct.__type === 'DeriveColumnFunction') {
          functions[i] = DeriveColumnFunction.revive(funct);
        }

        if (funct.__type === 'MapcFunction') {
          functions[i] = MapcFunction.revive(funct);
        }

        if (funct.__type === 'MakeDatasetFunction') {
          functions[i] = MakeDatasetFunction.revive(funct);
        }
      }
    }

    this.functions = functions;
    this.__type = 'Pipeline';
  };
  Pipeline.revive = function(data) {
    return new Pipeline(data.functions);
  };
  Pipeline.prototype.addAfter = function(funct, functionToAdd) {
    var index = this.functions.indexOf(funct);
    if (!functionToAdd || index === -1) {
      this.functions.push(functionToAdd);
    } else {
      if (index === this.functions.length - 1) {
        this.functions.push(functionToAdd);
        return true;
      } else {
        return this.functions.splice(index + 1, 0, functionToAdd);
      }
    }
  };
  Pipeline.prototype.remove = function(funct) {
    var index = this.functions.indexOf(funct);
    if (index === -1 || funct === null || funct === undefined) {
      console.log('tried to remove non-existing function');
      return false;
    }

    this.functions.splice(index, 1);
    return true;
  };
  this.Pipeline = Pipeline;

  this.getGraphElement = function(inputElement) {
    if (!(inputElement instanceof RDFElement)) {
      return _this[inputElement.__type].revive(inputElement);
    } else {
      return inputElement;
    }
  };

  // TODO remove subElements and move to URINode (which are the only elements that can have subelements)
  var RDFElement = function(subElements) {
    var i;
    var resolvedSubElements;
    resolvedSubElements = [];
    if (subElements) {
      for (i = 0; i < subElements.length; ++i) {
        resolvedSubElements.push(_this.getGraphElement(subElements[i]));
      }
    }

    this.subElements = resolvedSubElements;
  };

  var URINode = function(prefix, subElements) {
    RDFElement.call(this, subElements);
    this.prefix = prefix;
  };
  URINode.prototype = Object.create(RDFElement.prototype);
  URINode.revive = function(data) {
    return new URINode(data.prefix, data.subElements);
  };
  URINode.prototype.addChild = function(child) {
    this.subElements.push(child);
  };
  URINode.prototype.addNodeAfter = function(property, propertyToAdd) {
    var index = this.subElements.indexOf(property);
    if (!property || index === -1) {
      this.subElements.push(propertyToAdd);
    } else {
      if (index === this.subElements.length - 1) {
        this.subElements.push(propertyToAdd);
        return true;
      } else {
        this.subElements.splice(index + 1, 0, propertyToAdd);
        return true;
      }
    }

    return false;
  };
  URINode.prototype.removeChild = function(child) {
    var childIndex = this.subElements.indexOf(child);
    if (childIndex !== -1) {
      this.subElements.splice(childIndex, 1);
    }
  };
  this.URINode = URINode;

  var ConstantURI = function(prefix, constantURIText, subElements) {
    URINode.call(this, prefix, subElements);
    this.constant = constantURIText;
    this.__type = 'ConstantURI';
  };
  ConstantURI.prototype = Object.create(URINode.prototype);
  ConstantURI.revive = function(data) {
    return new ConstantURI(data.prefix, data.constant, data.subElements);
  };
  this.ConstantURI = ConstantURI;

  var ColumnURI = function(prefix, columnName, subElements) {
    URINode.call(this, prefix, subElements);
    this.column = columnName;
    this.__type = 'ColumnURI';
  };
  ColumnURI.prototype = Object.create(URINode.prototype);
  ColumnURI.revive = function(data) {
    return new ColumnURI(data.prefix, data.column, data.subElements);
  };
  this.ColumnURI = ColumnURI;

  var Property = function(prefix, propertyName, subElements) {
    RDFElement.call(this, subElements);
    this.prefix = prefix;
    this.propertyName = propertyName;
    this.__type = 'Property';
  };
  Property.prototype = Object.create(RDFElement.prototype);
  Property.prototype.removeChild = function(child) {
    var childIndex = this.subElements.indexOf(child);
    if (childIndex !== -1) {
      this.subElements.splice(childIndex, 1);
    }
  };
  Property.prototype.addNodeAfter = function(node, nodeToAdd) {
    var index = this.subElements.indexOf(node);
    if (!node || index === -1) {
      this.subElements.push(nodeToAdd);
      return true;
    }

    if (index === this.subElements.length - 1) {
      this.subElements.push(nodeToAdd);
      return true;
    }

    return this.subElements.splice(index + 1, 0, nodeToAdd);
  };
  Property.prototype.addChild = function(child) {
    this.subElements.push(child);
  };
  Property.revive = function(data) {
    return new Property(data.prefix, data.propertyName, data.subElements);
  };
  this.Property = Property;

  var ColumnLiteral = function(literalText, subElements) {
    RDFElement.call(this, subElements);
    this.literalValue = literalText;
    this.__type = 'ColumnLiteral';
  };
  ColumnLiteral.prototype = Object.create(RDFElement.prototype);
  ColumnLiteral.revive = function(data) {
    return new ColumnLiteral(data.literalValue, data.subElements);
  };
  this.ColumnLiteral = ColumnLiteral;

  var ConstantLiteral = function(literalText, subElements) {
    RDFElement.call(this, subElements);
    this.literalValue = literalText;
    this.__type = 'ConstantLiteral';
  };
  ConstantLiteral.prototype = Object.create(RDFElement.prototype);
  ConstantLiteral.revive = function(data) {
    return new ConstantLiteral(data.literalText, data.subElements);
  };
  this.ConstantLiteral = ConstantLiteral;

  // TODO add support for blank nodes
  var BlankNode = function() {
    this.__type = 'BlankNode';
  };
  BlankNode.revive = function(data) {
    return new BlankNode();
  };
  this.BlankNode = BlankNode;

  var RDFVocabulary = function(prefixName, namespaceURI, properties, classes) {
    this.prefixName = prefixName;
    this.namespaceURI = namespaceURI;
    this.properties = properties;
    this.classes = classes;

    this.__type = 'RDFVocabulary';
  };
  RDFVocabulary.revive = function(data) {
    return new RDFVocabulary(data.prefixName, data.namespaceURI, data.properties, data.classes);
  };
  this.RDFVocabulary = RDFVocabulary;

  var Graph = function(graphURI, existingGraphRoots) {
    var i;
    var graphRootsToAdd;

    graphRootsToAdd = [];

    // just a string
    this.graphURI = graphURI;

    // need to get stringifiable roots first
    for (i = 0; i < existingGraphRoots.length; ++i) {
      graphRootsToAdd.push(_this.getGraphElement(existingGraphRoots[i]));
    }

    this.graphRoots = graphRootsToAdd;
    this.__type = 'Graph';
  };
  Graph.prototype.addChild = function(child) {
    this.graphRoots.push(child);
  };
  Graph.prototype.removeChild = function(child) {
    var childIndex = this.graphRoots.indexOf(child);
    if (childIndex !== -1) {
      this.graphRoots.splice(childIndex, 1);
    }
  };
  Graph.prototype.addNodeAfter = function(root, rootToAdd) {
    var index = this.graphRoots.indexOf(root);
    if (!root || index === -1) {
      this.graphRoots.push(rootToAdd);
      return true;
    }

    if (index === this.graphRoots.length - 1) {
      this.graphRoots.push(rootToAdd);
      return true;
    }

    return this.graphRoots.splice(index + 1, 0, rootToAdd);
  };
  Graph.revive = function(data) {
    return new Graph(data.graphURI, data.graphRoots);
  };
  this.Graph = Graph;

  var Transformation = function(customFunctionDeclarations, prefixers, pipelines, graphs, rdfVocabs) {

    // validate that inputs are revived
    var i;
    var cfd;
    var prefixer;
    var pipeline;
    var graph;
    var rdfVocab;
    if (!customFunctionDeclarations)
      customFunctionDeclarations = [];
    if (!prefixers)
      prefixers = [];
    if (!pipelines)
      pipelines = [];
    if (!graphs)
      graphs = [];
    if (!rdfVocabs)
      rdfVocabs = [];

    for (i = 0; i < customFunctionDeclarations.length; ++i) {
      cfd = customFunctionDeclarations[i];
      if (!(cfd instanceof CustomFunctionDeclaration) && cfd.__type === 'CustomFunctionDeclaration') {
        // TODO: validate, above doesn't check for null
        customFunctionDeclarations[i] = CustomFunctionDeclaration.revive(cfd);
      }
    }

    for (i = 0; i < prefixers.length; ++i) {
      prefixer = prefixers[i];
      if (!(prefixer instanceof Prefixer) && prefixer.__type === 'Prefixer') {
        // TODO: validate
        prefixers[i] = Prefixer.revive(prefixer);
      }
    }

    for (i = 0; i < pipelines.length; ++i) {
      pipeline = pipelines[i];
      if (!(pipeline instanceof Pipeline) && pipeline.__type === 'Pipeline') {
        // TODO: validate
        pipelines[i] = Pipeline.revive(pipeline);
      }
    }

    for (i = 0; i < graphs.length; ++i) {
      graph = graphs[i];
      if (!(graph instanceof Graph) && graph.__type === 'Graph') {
        graphs[i] = Graph.revive(graphs[i]);
      }
    }

    for (i = 0; i < rdfVocabs.length; ++i) {
      rdfVocab = rdfVocabs[i];
      if (!(rdfVocab instanceof RDFVocabulary) && rdfVocab.__type === 'RDFVocabulary') {
        rdfVocabs[i] = RDFVocabulary.revive(rdfVocabs[i]);
      }
    }

    this.customFunctionDeclarations = customFunctionDeclarations;
    this.prefixers = prefixers;
    this.pipelines = pipelines;
    this.graphs = graphs;
    this.rdfVocabs = rdfVocabs;//TODO fill this
    this.__type = 'Transformation';

  };
  Transformation.revive = function(data) {
    return new Transformation(data.customFunctionDeclarations, data.prefixers, data.pipelines, data.graphs, data.rdfVocabs);
  };
  this.Transformation = Transformation;
  Transformation.prototype.addGraphAfter = function(graph, graphToAdd) {

    var index = this.graphs.indexOf(graph);
    if (!graph || index === -1) {
      this.graphs.push(graphToAdd);
    } else {
      if (index === this.graphs.length - 1) {
        this.graphs.push(graphToAdd);
        return true;
      } else {
        return this.graphs.splice(index + 1, 0, graphToAdd);
      }
    }
  };
  Transformation.prototype.addPrefixer = function(name, uri) {
    for (var i = 0; i < this.prefixers.length; ++i) {
      if (this.prefixers[i].name === name.trim()) {
        return false;
      }
    }

    this.prefixers.push(new Prefixer(name.trim(), uri.trim()));
    return true;
  };
  Transformation.prototype.removePrefixer = function(name) {
    for (var i = 0; i < this.prefixers.length; ++i) {
      if (this.prefixers[i].name === name.trim()) {
        this.prefixers.splice(i, 1);
        return true;
      }
    }

    return false;
  };
  Transformation.prototype.addCustomFunctionDeclaration = function(name, clojureCode) {
    for (var i = 0; i < this.customFunctionDeclarations.length; ++i) {
      if (this.customFunctionDeclarations[i].name === name.trim()) {
        this.customFunctionDeclarations[i].clojureCode = clojureCode;
        return false;
      }
    }

    this.customFunctionDeclarations.push(new CustomFunctionDeclaration(name, clojureCode));
    return true;
  };
  Transformation.prototype.removeCustomFunctionDeclaration = function(customFunct) {
    for (var i = 0; i < this.customFunctionDeclarations.length; ++i) {
      if (this.customFunctionDeclarations[i].name === customFunct.name.trim()) {
        this.customFunctionDeclarations.splice(i, 1);
        return true;
      }
    }

    return false;

    //        var index = this.customFunctionDeclarations.indexOf(customFunct);
    //        if(!customFunct || index === -1) {
    //            console.log('Nothing to do here');
    //            return false;
    //        } else {
    //            this.customFunctionDeclarations.splice(index, 1);
    //            return true;
    //        }
  };
  Transformation.prototype.findPrefixerOrCustomFunctionByName = function(name) {
    var i;
    for (i = 0; i < this.prefixers.length; ++i) {
      if (this.prefixers[i].name === name) {
        return this.prefixers[i];
      }
    }

    for (i = 0; i < this.customFunctionDeclarations.length; ++i) {
      if (this.customFunctionDeclarations[i].name === name) {
        return this.customFunctionDeclarations[i];
      }
    }

    return null;
  };
  Transformation.prototype.getColumnKeysFromPipeline = function() {
    var i;
    var j;
    var currentFunction;
    var availableColumnKeys = [];

    for (j = 0; j < this.pipelines.length; ++j) {
      for (i = 0; i < this.pipelines[j].functions.length; ++i) {
        currentFunction = this.pipelines[j].functions[i];
        if (currentFunction instanceof DeriveColumnFunction) {
          availableColumnKeys.push(currentFunction.newColName);
        }

        if (currentFunction instanceof MakeDatasetFunction) {
          for (var k = 0; k < currentFunction.columnsArray.length; ++k) {
            availableColumnKeys.push(currentFunction.columnsArray[k]);
          }

        }
      }
    }

    return availableColumnKeys;
  };
  // AngularJS will instantiate a singleton by calling 'new' on this function
});
