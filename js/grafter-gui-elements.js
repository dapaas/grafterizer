/***************************************************************************
    Utility functions.
****************************************************************************/

/* Extend jQuery with this function to be able to detect if a selector is empty */
$.fn.exists = function () {
    return this.length !== 0;
}

/***************************************************************************
    Functions and variables related to generating pipeline GUI elements.
****************************************************************************/

/* Creates the button used to append a new element to the pipeline */
function getAddSignElement(){
    var addSignElement = document.createElement("i");
    addSignElement.classList.add("fa");
    addSignElement.classList.add("fa-plus");
    addSignElement.classList.add("addAfterButton");

    $(addSignElement).on("click", function(){
        var pipelineTable = $("#pipeline")[0];
        var rowIndex = this.parentElement.parentElement.rowIndex;
        indexInPipeline=rowIndex+1;
        $("#dialog-pipeline-main").dialog("open");
        //        invokePipelineFunctionDialog(rowIndex);
    });

    return addSignElement;
}

/* Creates the button used to remove an existing element from the pipeline */
function getRemoveSignElement(){
    var removeSignElement = document.createElement("i");
    removeSignElement.classList.add("fa");
    removeSignElement.classList.add("fa-times");
    removeSignElement.classList.add("removeButton");
    $(removeSignElement).on("click", function(){
        var pipelineTable = $("#pipeline")[0];
        var rowIndex = this.parentElement.parentElement.rowIndex;
        var isDelete = false;
        $("#dialog-confirm").html("Are you sure you want to delete this pipeline function?");
        $("#dialog-confirm")
        .dialog({
            resizable: false,
            modal: true,
            title: "Confirmation",
            buttons: {
                "Yes": function () {
                    $(this).dialog('close');
                    pipelineTable.deleteRow(rowIndex);

                    if(pipelineTable.rows.length==1){
                        // add the addElementAtEnd button
                        showDefaultAddButton();
                    }
                },
                "No": function () {
                    $(this).dialog('close');
                }
            }
        });
    });
    //    console.log($(removeSignElement));
    return removeSignElement;
}

/* Creates the element that represents a pipeline function */
function getPipelineFunctElement(name){
    var buttonElement = document.createElement("button");
    buttonElement.classList.add("pipelineFunct");
    if(name){
        buttonElement.innerHTML=name;
    }else{
        // TODO error here?
    }
    return buttonElement;
}

/* Convenience function. Initializes a table data element "cell" by 1) setting its width percentage style to "percentWidth+%" and 2) adding the "content" to the children elements of the TD. */
function initPipelineRowTD(cell, percentWidth, content){
    if(content){
        if(content instanceof Array){
            for(i=0;i<content.length;++i){
                cell.appendChild(content[i]);
            }
        }else{
            cell.appendChild(content);
        }
    }
    cell.style.width = percentWidth + "%";
    return cell;
}

/* Adds an element, which represents a pipeline function (with a name "pipelineFunctName"), at a particular "index" in the pipeline and associates a "datum" to it, later used for generating Grafter code */
function addAtIndexInPipeline(pipelineFunctName, index, datum){
    // open the main dialog for creating elements

    var pipelineTable = $("#pipeline")[0];

    // create the row and according TD-s
    var row = pipelineTable.insertRow(index);

    // associate the datum to the row
    jQuery.data(row, "jsedn", datum);
    //    $(row).data(datum);

    var leftMarginTD = row.insertCell();
    initPipelineRowTD(leftMarginTD, 20);

    var pipelineFunctTD = row.insertCell();
    var pipelineFunctElement = getPipelineFunctElement(pipelineFunctName);
    initPipelineRowTD(pipelineFunctTD, 50, pipelineFunctElement);

    var addSign = getAddSignElement();
    var removeSign = getRemoveSignElement();
    var buttonsTD = row.insertCell();
    initPipelineRowTD(buttonsTD, 10, [addSign, document.createTextNode("    ") ,removeSign]);

    var rightMarginTD = row.insertCell();
    initPipelineRowTD(rightMarginTD, 20);

    if($("#addElementAtEndRow").is(":visible")){
        hideDefaultAddButton();
    }
}

function hideDefaultAddButton(){
    if($("#addElementAtEndRow").is(":visible")){
        $("#addElementAtEndRow").hide();
    }
}

function showDefaultAddButton(){
    if(!($("#addElementAtEndRow").is(":visible"))){
        $("#addElementAtEndRow").show();
    }
}

/***************************************************************************
    Attaching listeners to the GUI elements; initializing dialogs
***************************************************************************/

function generateSelectOptionsDeriveColumn(selectControl){
    $(selectControl).empty();
    // choose option text
    var chooseOption = document.createElement('option');
    chooseOption.disabled=true;
    chooseOption.selected=true;
    chooseOption.textContent='Choose...';
    chooseOption.value='derived-col-choose';
    selectControl.appendChild(chooseOption);

    // existing functions options (group)
    var hasAtLeastOneOption = false;
    var existingFunctionsGroup = document.createElement('optgroup');
    existingFunctionsGroup.label = "Existing functions";
    for(var functionName in customFunctionsMap){
        existingFunctionsGroup.appendChild(new Option(functionName, functionName));
        hasAtLeastOneOption=true;
    }
    if(hasAtLeastOneOption)
        selectControl.appendChild(existingFunctionsGroup);

    // TODO later support for creating custom inline function option
    var createNewCodeElement = document.createElement('option');
    createNewCodeElement.value = "derived-col-create-custom-function";
    createNewCodeElement.textContent = 'Create custom function...';
    selectControl.appendChild(createNewCodeElement);
}

function getDeriveColumnElements(){
    var derivedColumnNameLabel = document.createElement("label");
    derivedColumnNameLabel.classList.add("form-label");
    derivedColumnNameLabel.setAttribute("for", "derived-col-name");
    derivedColumnNameLabel.textContent = "Name of derived column:";

    var derivedColumnNameInput = document.createElement("input");
    derivedColumnNameInput.id = "derived-col-name";
    derivedColumnNameInput.setAttribute("type", "text");

    var derivedColumnSourceColsLabel = document.createElement("label");
    derivedColumnSourceColsLabel.classList.add("form-label");
    derivedColumnSourceColsLabel.setAttribute("for", "derived-col-source-cols");
    derivedColumnSourceColsLabel.textContent = "Columns to derive from:";

    var derivedColumnSourceCols = document.createElement("input");
    derivedColumnSourceCols.id = "derived-col-source-cols";
    derivedColumnSourceCols.setAttribute("type", "text");

    var derivedColumnFunctionLabel = document.createElement("label");
    derivedColumnFunctionLabel.classList.add("form-label");
    derivedColumnFunctionLabel.setAttribute("for", "derived-col-select-func");
    derivedColumnFunctionLabel.textContent = "Select function:";

    var derivedColumnFunction = document.createElement("select");
    derivedColumnFunction.id="derived-col-select-func";

    return [derivedColumnNameLabel, derivedColumnNameInput, derivedColumnSourceColsLabel, derivedColumnSourceCols, derivedColumnFunctionLabel, derivedColumnFunction];
}

function getDeriveColumnButtons(dialog){
    var buttons = { 
        "Create function": function (){
            // create jsedn of the column name (jsedn keyword)
            var newColName = $("#derived-col-name").val();
            var newColJsedn = new jsedn.kw(newColName);
            
            // create jsedn for the input columns (jsedn vector)
            var colsToDeriveFrom = $("#derived-col-source-cols").val();
            var colsToDeriveFromJsedn = parseEdnFromString(colsToDeriveFrom);
            
            var functionToDeriveWith = currentlySelectedDeriveColFunction;
            var functionToDeriveWithJsedn = new jsedn.sym(functionToDeriveWith);
            
            var codeJsedn = createDeriveColumn(newColJsedn, colsToDeriveFromJsedn, functionToDeriveWithJsedn);
            
            addAtIndexInPipeline('derive-column', indexInPipeline, codeJsedn);
            
            dialog.dialog("close");
        },
        "Cancel": function (){
            dialog.dialog("close");
        }
    };
    return buttons;
}

function getMapcElements(){
    var mapcTableLabel = document.createElement("label");
    mapcTableLabel.classList.add("form-label");
    mapcTableLabel.setAttribute("for", "mapc-table");
    mapcTableLabel.textContent = "Map columns to functions";

    var mapcTable = document.createElement("table");
    mapcTable.id = "mapc-table";

    return [mapcTableLabel,mapcTable];
}

function getMapcButtons(dialog){
    var buttons = { 
        "Create function": function (){
            $('#mapc-table').appendGrid('removeEmptyRows');
            // TODO fix: what happens if we create a function, put in mapc and later remove
            // first create the mapping that is defined for mapc
            var mapcMappingJsEDN = createColFuncMapcMappingJsEDN();
            // then create the mapc function itself
            var codeJsedn = createMapc(mapcMappingJsEDN);

            addAtIndexInPipeline('mapc', indexInPipeline, codeJsedn);
            dialog.dialog("close");
        },
        "Cancel": function (){
            dialog.dialog("close");
        }
    };
    return buttons;
}

function getCustomFunctionElements(){
    var nameLabel = document.createElement("label");
    nameLabel.classList.add("form-label");
    nameLabel.setAttribute("for", "add-custom-code-alias");
    nameLabel.textContent = "Display name";

    var functionNameInput = document.createElement("input");
    functionNameInput.setAttribute("type", "text");
    functionNameInput.id = "add-custom-code-alias";

    var lineBreak = document.createElement("br");

    var functionCodeLabel = document.createElement("label");
    functionCodeLabel.classList.add("form-label");
    functionCodeLabel.setAttribute("for", "add-custom-code");
    functionCodeLabel.textContent = "Code";

    var codeTextArea = document.createElement("textarea");
    codeTextArea.id = "add-custom-code"; // TODO - do we really need this?
    codeTextArea.setAttribute("rows", 50);
    codeTextArea.style.display="none";

    return [nameLabel,functionNameInput, lineBreak, lineBreak, functionCodeLabel, codeTextArea];
}

function getCustomFunctionButtons(dialog){
    var buttons = { 
        "Create function": function (){ 
            var functionDisplayName = $("#add-custom-code-alias").val();
            if(functionDisplayName == ''){
                alertInterface("Please choose a display name", "");
                return;
            }
            var code = addCustomCodeMirror.getValue();
            var codeJsedn = createCustomCodeForPipeline(code, functionDisplayName);
            if(codeJsedn == null){
                return;
            }
            addAtIndexInPipeline(functionDisplayName, indexInPipeline, codeJsedn);
            dialog.dialog("close");
        },
        "Cancel": function (){
            dialog.dialog("close");
        }
    };
    return buttons;
}

function getMakeDatasetElements(){
    var label = document.createElement("label");
    label.classList.add("form-label");
    label.setAttribute("for", "columns-keywords");
    label.textContent = "Column names:";

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = "columns-keywords";

    return [label,input];
}

function getMakeDatasetButtons(dialog){
    var buttons = { 
        "Create function": function (){ 
            var rawVal = $("#columns-keywords").val();
            var columnsKeywords = parseEdnFromString(rawVal, "Error parsing the Clojure code!");
            var jsEdnMakeDataset = createMakeDataset(columnsKeywords);
            addAtIndexInPipeline("make-dataset", indexInPipeline, jsEdnMakeDataset);
            dialog.dialog("close");
        },
        "Cancel": function (){
            dialog.dialog("close");
        }
    };
    return buttons;
}

function getDropRowsElements(){
    var label = document.createElement("label");
    label.classList.add("form-label");
    label.setAttribute("for", "drop-rows-num");
    label.textContent = "Number of rows:";

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.id = "drop-rows-num";

    return [label,input];
}

function getDropRowsButtons(dialog){
    var buttons = { 
        "Create function": function (){ 
            var rawVal = $("#drop-rows-num").val();
            var rowsToDrop = parseInt(rawVal, 10);
            // TODO: input validation, 

            // create the jsedn element
            var jsEdnRowsFunction = createDropRows(rowsToDrop);

            addAtIndexInPipeline("drop-rows", indexInPipeline, jsEdnRowsFunction);
            dialog.dialog("close");
        },
        "Cancel": function (){
            dialog.dialog("close");
        }
    };
    return buttons;
}

function generateGrafterCode(){

    ////////////////////////


    /* Grafter Declarations */

    var grafterDeclarations = constructGrafterDeclarations();

    /* Prefixers */

    // add only custom prefixers - the Grafter ones are available by default
    for(i=0;i<prefixersInGUI.length;++i){
        var name = prefixersInGUI[i]['prefix-name'];
        var uri = prefixersInGUI[i]['uri'];
        if(name == '' || uri == ''){
            alertInterface("Name or URI of a prefix empty, ignoring...", "");
            continue;
        }
        addGrafterPrefixer(name, uri);
    }

    var grafterPrefixers = constructGrafterPrefixersArray();

    /* User functions */

    for(var functionName in customFunctionsMap){
        parseAndAddUserFunction(customFunctionsMap[functionName].code);
    }

    var grafterCustomFunctions = constructUserFunctions();

    /* Pipeline Function */

    var rows = $("#pipeline")[0].rows;
    for(i=0;i<rows.length;++i){
        if(rows[i].id==="addElementAtEndRow"){
            continue;
        }

        var pipelineFunct = jQuery.data(rows[i], "jsedn");
        addPipelineFunction(pipelineFunct);
    }

    var resultingPipeline = constructPipeline();
    var textStr = "";
    textStr += (grafterDeclarations.ednEncode() + '\n' + '\n');

    for(i=0;i<grafterPrefixers.length;++i){
        textStr += (grafterPrefixers[i].ednEncode() + '\n');
    }
    textStr += '\n';

    for(i=0;i<grafterCustomFunctions.length;++i){
        textStr += (grafterCustomFunctions[i].ednEncode() + '\n');
    }
    textStr += '\n';

    textStr += (resultingPipeline.ednEncode());


    $("#output").val(textStr);




}

function createPrefixer(name, value){
    return {'prefix-name': name, uri: value};
}

function clearPrefixersTable(){
    $('#prefix-table').appendGrid('removeEmptyRows');
    var count = $('#prefix-table').appendGrid('getRowCount');
    for(i=0;i<count; ++i){
        $('#prefix-table').appendGrid('removeRow', 0);
    }
    count = $('#prefix-table').appendGrid('getRowCount');
}

function createCustomFunctionObj(customCode){

    var functionName;
    var tmp = customCode.split("defn");
    if(tmp.length == 1){
        alertInterface("Error parsing custom function: 'defn' keyword not found","");
        return {};
    }


    tmp = tmp[1].trim();
    tmp = tmp.split(/\s+/);
    if(tmp.length == 1){
        alertInterface("Error parsing custom function: wrong function definition","");
        return {};
    }

    functionName = tmp[0];

    return {fnName: functionName, code: customCode};
}

function refreshCustomFunctionsSelect(){
    // remove previous content
    $("optgroup#custom-funct-options > option").remove();

    // create new content
    for(var functionName in customFunctionsMap){
        var option = document.createElement("option");
        option.setAttribute("value", functionName);
        option.innerHTML = functionName;
        $("#custom-funct-options").append(option);
    }
    // refresh jQuery UI control
    $("#custom-functions").selectmenu("refresh");
}

function getCustomFunctionOptions(selectControl){
    $(selectControl).empty();
    // choose option text
    var chooseOption = document.createElement('option');
    chooseOption.disabled=true;
    chooseOption.selected=true;
    chooseOption.textContent='Choose...';
    chooseOption.value='mapc-choose';
    selectControl.appendChild(chooseOption);

    // existing functions options (group)
    var hasAtLeastOneOption = false;
    var existingFunctionsGroup = document.createElement('optgroup');
    existingFunctionsGroup.label = "Existing functions";
    for(var functionName in customFunctionsMap){
        existingFunctionsGroup.appendChild(new Option(functionName, functionName));
        hasAtLeastOneOption=true;
    }
    if(hasAtLeastOneOption)
        selectControl.appendChild(existingFunctionsGroup);

    // TODO later support for creating custom inline function option
    var createNewCodeElement = document.createElement('option');
    createNewCodeElement.value = "mapc-create-custom-function";
    createNewCodeElement.textContent = 'Create custom function...';
    selectControl.appendChild(createNewCodeElement);
}

function handleMapcFunctionSelect(evt, rowIndex){
    switch(evt.target.value){
        case 'mapc-create-custom-function':

            // reset selection
            var selectOptions = $(evt.target).children();
            for(i=0;i<selectOptions.length;++i){
                selectOptions[i].selected = false;
            }
            evt.target[0].selected=true;
            $("#dialog-create-custom-function").dialog(
                {
                    close: function() {
                        // refresh all select controls in the mapc table
                        var selectsToRefresh = $("#mapc-table select");
                        for(i=0;i<selectsToRefresh.length;++i){
                            getCustomFunctionOptions(selectsToRefresh[i]);
                        }
                    } 
                })
            .dialog("open");

            break;
        case 'mapc-choose':
            // do nothing
            break;
        default:
            // a function has been selected!
            break;
    }


}

function createColFuncMapcMapping(column, funct){
    return {column: column, funct: funct};
}

function createColFuncMapcMappingJsEDN(){
    var jsEdnMapObject = new jsedn.Map([]);

    var count = $('#mapc-table').appendGrid('getRowCount');
    for(i=0;i<count; ++i){
        var rowVal = $('#mapc-table').appendGrid('getRowValue', i);
        jsEdnMapObject.set(rowVal['mapc-column-key'], rowVal['mapc-function']);
    }
    console.log(jsEdnMapObject);
    return jsEdnMapObject;
}

var prefixersInGUI = [{'prefix-name': '', uri: ''}];
var indexInPipeline = 0;
var customFunctionsMap = [];
var customFunctionCodeMirror;
var outputCodeMirror;
var addCustomCodeMirror;
var currentlySelectedDeriveColFunction = null;

$(function() {
    var mainDialog = $("#dialog-pipeline-main")
    .dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 300,
        width: 500,
        title: "Add new pipeline element...",
        open: function( event, ui) {
            $("#pipeline-functions")[0].selectedIndex = 0;
            $("#pipeline-functions").selectmenu("refresh");
            $("#function-specific-form").empty();
        },
        close: function( event, ui ) {
            $("#pipeline-functions").selectmenu("refresh");
        },
        buttons: {
        }
    });

    
    
    $("#pipeline-functions").selectmenu({
        change: function( event, data ) {
            var selectionValue = data.item.value;
            switch (selectionValue){
                    // TODO resize! (also for custom functions)
                case "drop-rows":

                    mainDialog.dialog("option", "buttons", getDropRowsButtons(mainDialog));
                    $("#function-specific-form").html(getDropRowsElements());
                    break;

                case "make-dataset":
                    mainDialog.dialog("option", "buttons", getMakeDatasetButtons(mainDialog));
                    $("#function-specific-form").html(getMakeDatasetElements());
                    break;

                case "add-custom-code":
                    mainDialog.dialog("option", "buttons", getCustomFunctionButtons(mainDialog));
                    $("#function-specific-form").html(getCustomFunctionElements());
                    if(addCustomCodeMirror)
                        $(addCustomCodeMirror.getWrapperElement()).remove();

                    addCustomCodeMirror = CodeMirror.fromTextArea(
                        $("#add-custom-code")[0], 
                        {lineWrapping : true, lineNumbers: true}
                    );

                    addCustomCodeMirror.setValue("");
                    break;
                case "mapc":
                    mainDialog.dialog("option", "buttons", getMapcButtons(mainDialog));
                    $("#function-specific-form").html(getMapcElements());

                    // init table

                    $('#mapc-table').appendGrid(
                        'init', {
                            captionTooltip: 'Default and user-defined prefixes',
                            initRows: 1,
                            hideRowNumColumn:true,
                            hideButtons: {
                                remove: true,
                                insert: true,
                                moveUp: true,
                                moveDown: true
                            },
                            columns: [
                                {
                                    name: 'mapc-column-key', display: 'Column key', type: 'text', ctrlAttr: { maxlength: 100 },
                                    // Make the column resizable
                                    resizable: true, ctrlCss: { width: '100%' }, displayCss: { 'min-width': '160px' },
                                    // Customize UI tooltip
                                    displayTooltip: { items: 'td', content: 'Name of the prefix to be used in creating the graph' }
                                },
                                { 
                                    name: 'mapc-function', display: 'Function', type: 'select', 
                                    ctrlOptions: function(selectControl){ getCustomFunctionOptions(selectControl)},
                                    onChange: handleMapcFunctionSelect,
                                    resizable: true, displayCss: { 'min-width': '160px' },
                                    displayTooltip: { items: 'td', content: 'Namespace URI corresponding to the prefix' },

                                }
                            ],
                            initData: [
                            ]
                        }
                    );

                    break;
                case "derive-column":
                    mainDialog.dialog("option", "buttons", getDeriveColumnButtons(mainDialog));
                    $("#function-specific-form").html(getDeriveColumnElements());
                    // fill in the function options
                    generateSelectOptionsDeriveColumn($("#derived-col-select-func")[0]);
                    // create a jQuery UI select
                    $("#derived-col-select-func").selectmenu({
                        change: function( e, d ){
                            var selectionValue = d.item.value;
                            switch (selectionValue){
                                case "derived-col-create-custom-function":
                                    currentlySelectedDeriveColFunction = null;
                                    $("#dialog-create-custom-function").dialog(
                                        {
                                            close: function() {
                                                // refresh the select DOM element
                                                generateSelectOptionsDeriveColumn($("#derived-col-select-func")[0]);
                                                // refresh the jQuery UI control
                                                $("#derived-col-select-func").selectmenu("refresh");
                                            } 
                                        })
                                    .dialog("open");
                                    break;
                                default:
                                    currentlySelectedDeriveColFunction = d.item.value;
                                    break;
                            }
                        }
                    }).selectmenu("menuWidget")
                    .addClass("overflow");
                    break;
                default:
                    break;
            }
        }
    }).selectmenu("menuWidget")
    .addClass("overflow");

    $("#pipelineAddAtEnd").on("click", function(){
        indexInPipeline=0;
        mainDialog.dialog("open");
    });
    $("#generate-code").on("click", function(){
        generateGrafterCode();
        if(outputCodeMirror)
            $(outputCodeMirror.getWrapperElement()).remove();
        //        $('.CodeMirror').remove();
        outputCodeMirror = CodeMirror.fromTextArea(
            $("#output")[0],{
                lineWrapping : true, 
                lineNumbers: true, 
                readOnly: true
            });
    });

    $("#create-custom-func").on("click", function(){
        $("#dialog-create-custom-function").dialog({close: function(){}}).dialog("open");
    });

    $('#prefix-table').appendGrid(
        'init', {
            captionTooltip: 'Default and user-defined prefixes',
            initRows: 1,
            hideRowNumColumn:true,
            hideButtons: {
                remove: true,
                insert: true,
                moveUp: true,
                moveDown: true
            },
            columns: [
                {
                    name: 'prefix-name', display: 'Prefix name', type: 'text', ctrlAttr: { maxlength: 100 },
                    // Make the column resizable
                    resizable: true, ctrlCss: { width: '100%' }, displayCss: { 'min-width': '160px' },
                    // Customize UI tooltip
                    displayTooltip: { items: 'td', content: 'Name of the prefix to be used in creating the graph' }
                },
                { 
                    name: 'uri', display: 'URI', type: 'text', ctrlAttr: { maxlength: 2048}, 
                    resizable: true, ctrlCss: { width: '100%' }, displayCss: { 'min-width': '160px' },
                    displayTooltip: { items: 'td', content: 'Namespace URI corresponding to the prefix' }
                }
            ],
            initData: [
            ]
        }
    );

    // confirmation dialog for prefixers
    $("#dialog-confirm-prefixes").html("Any unsaved changes will be discarded");
    $("#dialog-confirm-prefixes").dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        title: "Confirmation",
        buttons: {
            "Yes": function () {
                $("#dialog-pipeline-prefixers").dialog('close');
                $(this).dialog('close');
            },
            "No": function () {
                $(this).dialog('close');
            }
        }
    });

    $("#dialog-pipeline-prefixers").dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 300,
        width: 500,
        title: "Define RDF prefixes",
        open: function (event, ui) {
            clearPrefixersTable();
            $('#prefix-table').appendGrid('appendRow', prefixersInGUI);
        },
        buttons: {
            "Save": function () {
                // traverse table, create prefixers and save them in the prefixersInGUI coll
                $('#prefix-table').appendGrid('removeEmptyRows');
                var count = $('#prefix-table').appendGrid('getRowCount');
                prefixersInGUI = [];
                for(i=0;i<count; ++i){
                    var rowVal = $('#prefix-table').appendGrid('getRowValue', i);
                    var prefixer = createPrefixer(rowVal['prefix-name'], rowVal['uri']);
                    prefixersInGUI.push(prefixer);
                }
                $(this).dialog('close');
            },
            "Cancel": function () {
                $("#dialog-confirm-prefixes").dialog("open");
                clearPrefixersTable();
            }
        }
    });

    $("#edit-prefixers").on("click", function(){
        $("#dialog-pipeline-prefixers").dialog("open");
    });

    $("#dialog-create-custom-function").dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 490,
        width: 500,
        title: "Define custom function...",
        open: function(event, ui){
            // initialize the code mirror
            if(customFunctionCodeMirror)
                $(customFunctionCodeMirror.getWrapperElement()).remove();

            customFunctionCodeMirror = CodeMirror.fromTextArea(
                $("#custom-function-code")[0],{
                    lineWrapping : true, 
                    lineNumbers: true
                });
            customFunctionCodeMirror.setValue("");

            // initialize the selection
            refreshCustomFunctionsSelect();
        },
        buttons: {
            Done: function(){
                $(this).dialog("close");
            }
        }
    });

    $("#save-function").on("click", function(event){
        event.preventDefault();
        var customFunctionCode = customFunctionCodeMirror.getValue();
        var codeObject = createCustomFunctionObj(customFunctionCode);
        if(codeObject['fnName'] == null){
            return;
        }
        customFunctionsMap[ codeObject['fnName'] ] = codeObject;
        refreshCustomFunctionsSelect();
        // TODO implement DELETE
    });


    $("#dialog-confirm-code").html("Any unsaved changes will be discarded");
    $("#dialog-confirm-code").dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        title: "Confirmation",
        buttons: {
            "Yes": function () {
                $("#dialog-create-custom-function").dialog('close');
                $(this).dialog('close');
            },
            "No": function () {
                $(this).dialog('close');
            }
        }
    });

    $("#custom-functions").selectmenu({
        change: function( event, data ){
            var selectionValue = data.item.value;
            switch (selectionValue){
                case "create-new-func":
                    customFunctionCodeMirror.setValue("");
                    break;
                default:
                    customFunctionCodeMirror.setValue(customFunctionsMap[selectionValue].code);
                    break;
            }
        }
    }).selectmenu("menuWidget")
    .addClass("overflow");

    //    var count = $('#prefix-table').appendGrid('getRowCount');
    //    for(i=0;i<count; ++i){
    //        $('#prefix-table').appendGrid('getCellCtrl', 'prefix-name', i).disabled = true;
    //        $('#prefix-table').appendGrid('getCellCtrl', 'uri', i).disabled = true;
    //    }

    // TODO eventually might look better, but would imply additional logic that needs to be implemented
    //    $("#pipeline-functions-button").on("click", function(){
    //        
    //        var defaultSelectOption = $("#pipeline-functions option[value='please-choose']");
    //        console.log(defaultSelectOption);
    //        if(defaultSelectOption.exists()){
    //            defaultSelectOption.remove();
    //            $("#pipeline-functions option[value='drop-rows']").selected=true;
    //            $("#pipeline-functions").selectmenu("refresh");
    //        }
    //        
    //        
    //    });


});

/***************************************************************************
    Testing functionalities programatically
***************************************************************************/
$(function() {

});

