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

  var Prefixer = function(name, uri, parentPrefix) {
    this.name = name;
    this.uri = uri;
    this.parentPrefix=parentPrefix;
    this.__type = 'Prefixer';
  };

  Prefixer.revive = function(data) {
    return new Prefixer(data.name, data.uri, data.parentPrefix);
  };

  this.Prefixer = Prefixer;

  var GenericFunction = function() {
    if (!this.generateClojure) {
      this.generateClojure = function() {
        return new jsedn.List([jsedn.sym(this.name)]);
      };
    }
  };
  var CustomFunctionDeclaration = function(name, clojureCode, docstring) {
    this.name = name;
    this.clojureCode = clojureCode;
    this.docstring = docstring;
    this.__type = 'CustomFunctionDeclaration';
  };
  CustomFunctionDeclaration.revive = function(data) {
    return new CustomFunctionDeclaration(data.name, data.clojureCode, data.docstring);
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

  var DropRowsFunction = function(numberOfRows, docstring) {
    GenericFunction.call(this);
    this.numberOfRows = numberOfRows;
    this.name = 'drop-rows';
    this.displayName = 'drop-rows';
    if(!docstring) this.docstring = 'Drop '+numberOfRows.toString()+' first row(s)'; else this.docstring = docstring;
    this.__type = 'DropRowsFunction';
  };
  DropRowsFunction.revive = function(data) {
    return new DropRowsFunction(data.numberOfRows, data.docstring);
  };
  DropRowsFunction.prototype.generateClojure = function() {
    return new jsedn.List([jsedn.sym('drop-rows'), this.numberOfRows]);
  };
  this.DropRowsFunction = DropRowsFunction;

  var TakeRowsFunction = function(numberOfRows,docstring) {
    GenericFunction.call(this);
    this.numberOfRows = numberOfRows;
    this.name = 'take-rows';
    this.displayName = 'take-rows';
    if (!docstring) this.docstring = 'Take '+numberOfRows.toString()+' first row(s)'; else this.docstring=docstring;
    this.__type = 'TakeRowsFunction';
  };
  TakeRowsFunction.revive = function(data) {
    return new TakeRowsFunction(data.numberOfRows,data.docstring);
  };
  TakeRowsFunction.prototype.generateClojure = function() {
    return new jsedn.List([jsedn.sym('take-rows'), this.numberOfRows]);
  };
  this.TakeRowsFunction = TakeRowsFunction;
  
  var AddColumnFunction = function(newColName,colValue,colExpr,docstring) {
    GenericFunction.call(this);
    this.newColName = newColName;
    this.colValue = colValue;
    this.colExpr  = colExpr;
    this.name = 'add-column';
    this.displayName = 'add-column';
    if (!docstring) this.docstring = 'Add new column '+newColName.toString();
    else this.docstring = docstring;
    this.__type = 'AddColumnFunction';
  };
  AddColumnFunction.revive = function(data) {
    return new AddColumnFunction(data.newColName,data.colValue, data.colExpr, data.docstring);
  };
  AddColumnFunction.prototype.generateClojure = function() {
    if (!this.colExpr) return new jsedn.List([jsedn.sym('add-column'), new jsedn.kw(':'+this.newColName), this.colValue]);
    else return new jsedn.List([jsedn.sym('add-column'), new jsedn.kw(':'+this.newColName), jsedn.sym(this.colExpr)]);

  };
  this.AddColumnFunction = AddColumnFunction;
  
  var GrepFunction = function(colsToFilter, functionsToFilterWith, filterText, filterRegex, ignoreCase, docstring) {
    GenericFunction.call(this);
    this.colsToFilter = colsToFilter;
    this.name = 'grep';
    this.displayName = 'grep';
    this.filterRegex=filterRegex;
    this.ignoreCase=ignoreCase;
    var filterFunc;
    if (functionsToFilterWith !== null) {
        for (var i=0; i< functionsToFilterWith.length; ++i) {
            filterFunc = functionsToFilterWith[i];
            if (filterFunc !== null) {
                if (!(filterFunc instanceof CustomFunctionDeclaration) && filterFunc.__type ===
          'CustomFunctionDeclaration') {
               functionsToFilterWith[i] = CustomFunctionDeclaration.revive(filterFunc);
                }

                if (!(filterFunc instanceof Prefixer) && filterFunc.__type === 'Prefixer') {
                    functionsToFilterWith[i] = Prefixer.revive(filterFunc);
                 }
            }
        }
    }
    this.functionsToFilterWith = functionsToFilterWith;
    this.__type = 'GrepFunction';
    if (!docstring) 
        this.docstring = 'Filter dataset';
        
    
    else this.docstring = docstring;
    this.filterText = filterText;
  };
  GrepFunction.revive = function(data) {
    return new GrepFunction(data.colsToFilter, data.functionsToFilterWith, data.filterText, data.filterRegex, data.ignoreCase, data.docstring);
  };
  GrepFunction.prototype.generateClojure = function() {
    var colsToFilter = new jsedn.Vector([]);
    var flag = false;
    var filterFunc;
    if (this.colsToFilter.length>0) 
        for (var i = 0; i < this.colsToFilter.length; ++i) {
            colsToFilter.val.push(new jsedn.kw(':' + this.colsToFilter[i]));
      flag = true;
    }

    var values = [jsedn.sym('grep')];
    var opt = this.filterText?"txt":(this.filterRegex?"regex":"funs");
   
    switch (opt){
        
        case ("txt"): 
            values.push(this.filterText);
            break;
        
        case ("regex"):
            var regexParsed = '#\"' + this.filterRegex + '\"';
            values.push(new jsedn.List([jsedn.sym("read-string"),regexParsed]));
            break;
        
        case ("funs"):
            if (this.functionsToFilterWith.length === 1) {
                values.push(jsedn.sym(this.functionsToFilterWith[0].name));
            }
            else {
                var comp = [jsedn.sym('comp')];
                for (var i=0; i< this.functionsToFilterWith.length; ++i) {
                filterFunc = this.functionsToFilterWith[i];
                comp.push(jsedn.sym(filterFunc.name));
                }
                values.push(new jsedn.List(comp));
            }
            break;

        default:
            console.log("Error in defining  grep option");
            break;
    }
    if (this.colsToFilter.length>0) values.push(colsToFilter);
    
    return new jsedn.List(values);
  };
  this.GrepFunction = GrepFunction;
  
  
  var DeriveColumnFunction = function(newColName, colsToDeriveFrom, functionsToDeriveWith, paramsToFunctions, docstring) {
    GenericFunction.call(this);
    this.newColName = newColName;
    this.colsToDeriveFrom = colsToDeriveFrom;
    this.name = 'derive-column';
    this.displayName = 'derive-column';
    this.paramsToFunctions = paramsToFunctions;
    var deriveFunc;
    if (functionsToDeriveWith !== null) {
        for (var i=0; i< functionsToDeriveWith.length; ++i) {
            deriveFunc = functionsToDeriveWith[i];
            if (deriveFunc !== null) {
                if (!(deriveFunc instanceof CustomFunctionDeclaration) && deriveFunc.__type ===
          'CustomFunctionDeclaration') {
               functionsToDeriveWith[i] = CustomFunctionDeclaration.revive(deriveFunc);
                }

                if (!(deriveFunc instanceof Prefixer) && deriveFunc.__type === 'Prefixer') {
                    functionsToDeriveWith[i] = Prefixer.revive(deriveFunc);
                 }
            }
        }
    }
    this.functionsToDeriveWith = functionsToDeriveWith;
    this.__type = 'DeriveColumnFunction';
    if (!docstring) {
        this.docstring = 'Derive column '+newColName.toString()+' from column(s) ';
        for (var i = 0; i < colsToDeriveFrom.length; ++i) {
          this.docstring+=colsToDeriveFrom[i].toString()+' ';
        }
    }
    else this.docstring = docstring;
  };
  DeriveColumnFunction.revive = function(data) {
    return new DeriveColumnFunction(data.newColName, data.colsToDeriveFrom, data.functionsToDeriveWith,data.paramsToFunctions, data.docstring);
  };
  DeriveColumnFunction.prototype.generateClojure = function() {
    var colsToDeriveFromClj = new jsedn.Vector([]);
    var flag = false;
    var deriveFunc;
    for (var i = 0; i < this.colsToDeriveFrom.length; ++i) {
      colsToDeriveFromClj.val.push(new jsedn.kw(':' + this.colsToDeriveFrom[i]));
      flag = true;
    }

    var values = [jsedn.sym('derive-column'),
                  this.newColName ? new jsedn.kw(':' + this.newColName) : new jsedn.kw(':unnamed'),
                  colsToDeriveFromClj];

    if (this.functionsToDeriveWith.length === 1) {
      if (this.paramsToFunctions[0]) values.push(new jsedn.List([jsedn.sym(this.functionsToDeriveWith[0].name),this.paramsToFunctions[0].toString()]));
      else
      values.push(jsedn.sym(this.functionsToDeriveWith[0].name));
    }
    else {
        var comp = "comp ";
        for (var i=0; i< this.functionsToDeriveWith.length; ++i) {
            deriveFunc = this.functionsToDeriveWith[i];
            if (this.paramsToFunctions[i]) comp+='('+deriveFunc.name+' "'+this.paramsToFunctions[i]+'") ';
            else
            comp += deriveFunc.name+" ";
        }
        values.push(new jsedn.List([jsedn.sym(comp)]));
    }

    return new jsedn.List(values);
  };
  this.DeriveColumnFunction = DeriveColumnFunction;
  
  var RenameColumnsFunction = function(functionsToRenameWith,mappings,docstring) {
    GenericFunction.call(this);
    this.name = 'rename-columns';
    this.displayName = 'rename-columns';
    this.mappings = mappings;
    var renameFunc;
    if (functionsToRenameWith!==null) {
        for (var i=0; i< functionsToRenameWith.length; ++i) {
            renameFunc = functionsToRenameWith[i]; 
        if (renameFunc !== null) {
            if (!(renameFunc instanceof CustomFunctionDeclaration) && renameFunc.__type ===
           'CustomFunctionDeclaration') {
            functionsToRenameWith[i] = CustomFunctionDeclaration.revive(renameFunc);
        }

        if (!(renameFunc instanceof Prefixer) && renameFunc.__type === 'Prefixer') {
            functionsToRenameWith[i] = Prefixer.revive(renameFunc);
        }
        }
    }
    }
/*    if (functionToRenameWith!==null)  {
         
            if (!(functionToRenameWith instanceof CustomFunctionDeclaration) && functionToRenameWith.__type ===
           'CustomFunctionDeclaration') {
            functionToRenameWith = CustomFunctionDeclaration.revive(functionToRenameWith);
        }

        if (!(functionToRenameWith instanceof Prefixer) && functionToRenameWith.__type === 'Prefixer') {
            functionToRenameWith = Prefixer.revive(functionToRenameWith);
        }
        }*/
    
    this.functionsToRenameWith = functionsToRenameWith;
    this.__type = 'RenameColumnsFunction';
    if (!docstring) {
        this.docstring = 'Rename columns by applying ';
        if  (!mappings[0]){
           if ( functionsToRenameWith!==null) { 
            for (var i=0; i< functionsToRenameWith.length; ++i) {
                if (i === 1) this.docstring += 'composed with ';
                renameFunc = functionsToRenameWith[i]; 
                if (renameFunc!== null) this.docstring += renameFunc.name+' ';
            }
        this.docstring+="function(s).";
        }
        }

    else 
        this.docstring+=" map";
    }
    else this.docstring = docstring;
    };
  RenameColumnsFunction.revive = function(data) {
    return new RenameColumnsFunction(data.functionsToRenameWith, data.mappings,data.docstring);
  };

  RenameColumnsFunction.prototype.generateClojure = function() {
    if (!this.mappings[0] )  {
        var renameFunc;
         if (this.functionsToRenameWith.length === 1) {
            renameFunc = this.functionsToRenameWith[0];
            return new jsedn.List([jsedn.sym('rename-columns'),jsedn.sym(renameFunc.name)]);
        }
        else {
        // (rename-columns (comp funct1 funct2))
            var comp="comp ";
        
            for (var i=0; i<this.functionsToRenameWith.length;++i) {
                renameFunc=this.functionsToRenameWith[i];
                comp+=renameFunc.name+" ";
            }
            return new jsedn.List([jsedn.sym('rename-columns'), new jsedn.List([jsedn.sym(comp)])]);
        }
    }
    else {
        //rename with mapping
        var mapPairs = new jsedn.Map([]);
        for(var i =0; i< this.mappings.length; i+=2) 
            mapPairs.set( new jsedn.kw(':' + this.mappings[i]),
                          new jsedn.kw(':' + this.mappings[i+1])
                        );
        return new jsedn.List([jsedn.sym('rename-columns'),mapPairs]);
    }
  };
  RenameColumnsFunction.prototype.removeRenameFunction = function(index) {

    this.functionsToRenameWith.splice(index, 1);
    return true;
  };
  this.RenameColumnsFunction = RenameColumnsFunction;


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

  var ApplyColumnsFunction = function(keyFunctionPairs, docstring) {
    // array of obj with [key, function]
    GenericFunction.call(this);
    this.name = 'apply-columns';
    this.displayName = 'apply-columns';
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
    if(!docstring) this.docstring = "Map columns"; //TODO:detailed docstring
    else this.docstring = docstring;
    this.keyFunctionPairs = keyFunctionPairs;
    this.__type = 'ApplyColumnsFunction';
  };
  ApplyColumnsFunction.revive = function(data) {
    return new ApplyColumnsFunction(data.keyFunctionPairs, data.docstring);
  };
  ApplyColumnsFunction.prototype.generateClojure = function() {
    var i;
    var keyFunctionPairsClj = new jsedn.Map([]);

    for (i = 0; i < this.keyFunctionPairs.length; ++i) {
      keyFunctionPairsClj.set(
        new jsedn.kw(':' + this.keyFunctionPairs[i].key),
        new jsedn.sym(this.keyFunctionPairs[i].func)
      );
    }

    return new jsedn.List([jsedn.sym('apply-columns'), keyFunctionPairsClj]);
  };
  ApplyColumnsFunction.prototype.removeKeyFunctionPair = function(kfPair) {
    var index = this.keyFunctionPairs.indexOf(kfPair);
    if (index === -1 || kfPair === null || kfPair === undefined) {
      console.log('tried to remove non-existing function');
      return false;
    }

    this.keyFunctionPairs.splice(index, 1);
    return true;
  };
  this.ApplyColumnsFunction = ApplyColumnsFunction;

  var MapcFunction = function(keyFunctionPairs,docstring) {
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
    if (!docstring) this.docstring = "Map columns"; else this.docstring = docstring;
    this.keyFunctionPairs = keyFunctionPairs;
    this.__type = 'MapcFunction';
  };
  MapcFunction.revive = function(data) {
    return new MapcFunction(data.keyFunctionPairs,data.docstring);
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


  var MakeDatasetFunction = function(columnsArray,useLazy,numberOfColumns,moveFirstRowToHeader,docstring) {
    // array of column names
    this.name = 'make-dataset';
    this.displayName = 'make-dataset';
    GenericFunction.call(this);
    this.columnsArray = columnsArray;
    this.useLazy = useLazy;
    this.numberOfColumns = numberOfColumns;
    this.moveFirstRowToHeader = moveFirstRowToHeader;
    this.__type = 'MakeDatasetFunction';
    if (!docstring) {
        this.docstring = "Make dataset";
        if (moveFirstRowToHeader) this.docstring+=", create header from the first row";
    }
    else this.docstring = docstring;
  };
  MakeDatasetFunction.revive = function(data) {
    return new MakeDatasetFunction(data.columnsArray,data.useLazy,data.numberOfColumns,data.moveFirstRowToHeader);
  };
  MakeDatasetFunction.prototype.generateClojure = function() {
    //(make-dataset [:name :sex :age])
    var i;
    var colNamesClj = new jsedn.Vector([]);
    var moveFirst = this.moveFirstRowToHeader?" move-first-row-to-header":"";
    if (this.useLazy === null) {
        if (this.columnsArray.length>0) { 
            // (make-dataset [columns])
            for (i = 0; i < this.columnsArray.length; ++i) {
          colNamesClj.val.push(new jsedn.kw(':' + this.columnsArray[i]));
        }

        return new jsedn.List([jsedn.sym('make-dataset'), colNamesClj]);
        }

        else 
        // (make-dataset)    
        {
            return new jsedn.List([jsedn.sym('make-dataset'+moveFirst)]);
        }
    }
    else {
        // make dataset with lazy naming
        return new jsedn.List([jsedn.sym('make-dataset'), jsedn.sym('(into[] (take '+this.numberOfColumns.toString()+' (alphabetical-column-names)))')]);
    }
  };

  this.MakeDatasetFunction = MakeDatasetFunction;

  var ColumnsFunction = function(columnsArray,useLazy,numberOfColumns, docstring) {
    // array of column names
    this.name = 'columns';
    this.displayName = 'columns';
    GenericFunction.call(this);
    this.columnsArray = columnsArray;
    this.useLazy = useLazy;
    this.numberOfColumns = numberOfColumns;
    this.__type = 'ColumnsFunction';

    if (!docstring) { 
        this.docstring="Narrow dataset to "; 
        if (useLazy) this.docstring+=numberOfColumns.toString()+" columns"
        else {
            var i;
            this.docstring+=" columns:";
            for (i = 0; i < columnsArray.length; ++i) {
                this.docstring+=" "+columnsArray[i].toString();
           }
        }
    }
    else this.docstring = docstring;
  };
  ColumnsFunction.revive = function(data) {
    return new ColumnsFunction(data.columnsArray,data.useLazy,data.numberOfColumns, data.docstring);
  };
  ColumnsFunction.prototype.generateClojure = function() {
    var i;
    var colNamesClj = new jsedn.Vector([]);
    if (this.useLazy === null) {
        for (i = 0; i < this.columnsArray.length; ++i) {
          colNamesClj.val.push(new jsedn.kw(':' + this.columnsArray[i]));
        }

        return new jsedn.List([jsedn.sym('columns'), colNamesClj]);
    }
    else {
        return new jsedn.List([jsedn.sym('columns'), jsedn.sym('(into[] (take '+this.numberOfColumns.toString()+' (alphabetical-column-names)))')]);
    }

  };

  this.ColumnsFunction = ColumnsFunction;
  
  var MeltFunction = function(columnsArray, docstring) {
    // array of column names
    this.name = 'melt';
    this.displayName = 'melt';
    GenericFunction.call(this);
    this.columnsArray = columnsArray;
    this.__type = 'MeltFunction';

    if (!docstring) {
        this.docstring="Reshape dataset on columns: "; 
        var i;
        for (i = 0; i < columnsArray.length; ++i) {
             this.docstring+=" "+columnsArray[i].toString();
        }
    }
    else this.docstring = docstring;
    

  };
  MeltFunction.revive = function(data) {
    return new MeltFunction(data.columnsArray,data.docstring);
  };
  MeltFunction.prototype.generateClojure = function() {
    var i;
    var colNamesClj = new jsedn.Vector([]);
        for (i = 0; i < this.columnsArray.length; ++i) {
          colNamesClj.val.push(new jsedn.kw(':' + this.columnsArray[i]));
        }

        return new jsedn.List([jsedn.sym('melt'), colNamesClj]);

  };

  this.MeltFunction = MeltFunction;
  
  
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
        
        if (funct.__type === 'AddColumnFunction') {
          functions[i] = AddColumnFunction.revive(funct);
        }
        
        if (funct.__type === 'DeriveColumnFunction') {
          functions[i] = DeriveColumnFunction.revive(funct);
        }

        if (funct.__type === 'RenameColumnsFunction') {
          functions[i] = RenameColumnsFunction.revive(funct);
        }

        if (funct.__type === 'MapcFunction') {
          functions[i] = MapcFunction.revive(funct);
        }

        if (funct.__type === 'ApplyColumnsFunction') {
          functions[i] = ApplyColumnsFunction.revive(funct);
        }
        
        if (funct.__type === 'MakeDatasetFunction') {
          functions[i] = MakeDatasetFunction.revive(funct);
        }
        
        if (funct.__type === 'ColumnsFunction') {
          functions[i] = ColumnsFunction.revive(funct);
        }
        
        if (funct.__type === 'MeltFunction') {
          functions[i] = MeltFunction.revive(funct);
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
  Transformation.prototype.addPrefixer = function(name, uri, parentPrefix) {
    for (var i = 0; i < this.prefixers.length; ++i) {
      if (this.prefixers[i].name === name.trim()) {
        return false;
      }
    }

    this.prefixers.push(new Prefixer(name.trim(), uri.trim(),parentPrefix.trim()));
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
  Transformation.prototype.addCustomFunctionDeclaration = function(name, clojureCode,docstring) {
    for (var i = 0; i < this.customFunctionDeclarations.length; ++i) {
      if (this.customFunctionDeclarations[i].name === name.trim()) {
        this.customFunctionDeclarations[i].clojureCode = clojureCode;
        return false;
      }
    }

    this.customFunctionDeclarations.push(new CustomFunctionDeclaration(name, clojureCode, docstring));
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
        
        if (currentFunction instanceof AddColumnFunction) {
          availableColumnKeys.push(currentFunction.newColName);
        }
        
        if (currentFunction instanceof MeltFunction) {
          availableColumnKeys.push("variable");
          availableColumnKeys.push("value");
        }
//TODO: clean and get new availColKeys for RenameColumns

        if (currentFunction instanceof MakeDatasetFunction) {
          for (var k = 0; k < currentFunction.columnsArray.length; ++k) {
            availableColumnKeys.push(currentFunction.columnsArray[k]);
          }

        }
        
        if (currentFunction instanceof ColumnsFunction) {
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
