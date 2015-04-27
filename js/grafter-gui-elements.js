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
    addSignElement.classList.add("fa-lg");
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
    removeSignElement.classList.add("fa-lg");
    $(removeSignElement).on("click", function(){
        var pipelineTable = $("#pipeline")[0];
        var rowIndex = this.parentElement.parentElement.rowIndex;
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
    buttonElement.disabled=true;
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
function addAtIndexInPipeline(pipelineFunctName, index, jsedn){
    // open the main dialog for creating elements

    var pipelineTable = $("#pipeline")[0];

    // create the row and according TD-s
    var row = pipelineTable.insertRow(index);

    // associate the datum to the row
    jQuery.data(row, "jsedn", jsedn);

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
    derivedColumnFunctionLabel.style.marginTop = "8px";
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
            var newColJsedn = new jsedn.sym(newColName);
            columnKeys.val.push(newColJsedn);

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
// TODO clean this out or implement the rest of the calls using it
function createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index){
    var newColJsedn = new jsedn.kw(newColName);
    var newColJsednColKey = new jsedn.sym(newColName.substring(1));
    columnKeys.val.push(newColJsednColKey);
    var colsToDeriveFromJsedn = parseEdnFromString(colsToDeriveFrom);
    var functionToDeriveWithJsedn = new jsedn.sym(functionToDeriveWith);

    var codeJsedn = createDeriveColumn(newColJsedn, colsToDeriveFromJsedn, functionToDeriveWithJsedn);

    addAtIndexInPipeline('derive-column', index, codeJsedn);
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
            var mapcMappingJsEDN = new jsedn.Map([]);

            var count = $('#mapc-table').appendGrid('getRowCount');
            for(i = 0; i < count; ++i){
                var rowVal = $('#mapc-table').appendGrid('getRowValue', i);
                var colKey = rowVal['mapc-column-key'];
                mapcMappingJsEDN.set(new jsedn.sym(colKey.trim()), new jsedn.sym(rowVal['mapc-function']));
                columnKeys.val.push(new jsedn.sym(colKey.trim().substr(1)));
            }

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

// TODO clean this out or implement the rest of the calls using it
function createAndAddCustomFunctionToPipeline(functionDisplayName, code, index){
    var codeJsedn = createCustomCodeForPipeline(code, functionDisplayName);
    addAtIndexInPipeline(functionDisplayName, index, codeJsedn);
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
            var columnsKeywords = parseEdnFromString('[' + rawVal + ']', "Error parsing the Clojure code!");
            for(i=0; i<columnsKeywords.val.length; ++i){
                columnKeys.val.push(columnsKeywords.val[i]);
            }
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

    /* Grafter Declarations */
    // TODO those are not needed here
    //    var grafterDeclarations = constructGrafterDeclarations();

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

    /* Graph Template */

    var graphTemplate = constructRDFGraphFunction(rdfControl);

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
    //    textStr += (grafterDeclarations.ednEncode() + '\n' + '\n');

    for(i=0;i<grafterPrefixers.length;++i){
        textStr += (grafterPrefixers[i].ednEncode() + '\n');
    }
    textStr += '\n';

    for(i=0;i<grafterCustomFunctions.length;++i){
        textStr += (grafterCustomFunctions[i].ednEncode() + '\n');
    }

    textStr += graphTemplate.ednEncode();

    textStr += '\n';
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
    for(i = 0; i < count; ++i){
        $('#prefix-table').appendGrid('removeRow', 0);
    }
    count = $('#prefix-table').appendGrid('getRowCount');
}

function createCustomFunctionObj(customCode){

    var functionName;
    var tmp = customCode.split("defn");
    var tmp1 = customCode.split("def");
    if(tmp.length == 1 && tmp1.length == 1){
        alertInterface("Error parsing custom function: Neither 'defn' nor 'def' keyword found","");
        return {};
    }

    tmp.length > 1 ? tmp=tmp : tmp=tmp1; 

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

function loadPrefixersInGraphDefinitionDialog(){
    // remove existing options
    // add the ones defined in the grafter-code-generator.js
    $("#pre-defined-prefix-options > option").remove();

    for (i=0; i<grafterSupportedRDFPrefixes.length; ++i){
        var prefixName = grafterSupportedRDFPrefixes[i]['name'];
        if(prefixName == ''){
            continue;
        }
        var optionElement = document.createElement("option");
        optionElement.value = prefixName;
        optionElement.textContent = prefixName;

        $("#pre-defined-prefix-options").append(optionElement);

    }

    // remove existing options
    // add the ones from the GUI
    $("#custom-prefixer-options > option").remove();

    for (i=0; i<prefixersInGUI.length; ++i){
        var name = prefixersInGUI[i]['prefix-name'];
        if(name == ''){
            continue;
        }
        optionElement = document.createElement("option");
        optionElement.value = name;
        optionElement.textContent = name;

        $("#custom-prefixer-options").append(optionElement);

    }
}

var prefixersInGUI = [/*{'prefix-name': '', uri: ''}*/];
var indexInPipeline = 0;
var customFunctionsMap = [];
var customFunctionCodeMirror;
var outputCodeMirror;
var addCustomCodeMirror;
var currentlySelectedDeriveColFunction = null;
var rdfControl;
var activeTransformation;

$(function() {
    /**  Initialise dialog for choosing pipeline function  **/

    var mainDialog = $("#dialog-pipeline-main").dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 500,
        width: 500,
        title: "Add new pipeline element...",
        open: function( event, ui) {
            mainDialog.dialog("option", "height", 500);
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
    activeTransformation = new Transformation([], [], [], []);

    $("#pipeline-functions").selectmenu({
        width: "100%",
        change: function( event, data ) {
            var selectionValue = data.item.value;
            switch (selectionValue){
                case "drop-rows":
                    mainDialog.dialog("option", "buttons", getDropRowsButtons(mainDialog));
                    mainDialog.dialog("option", "height", 400);
                    $("#function-specific-form").html(getDropRowsElements());
                    break;

                case "make-dataset":
                    mainDialog.dialog("option", "buttons", getMakeDatasetButtons(mainDialog));
                    mainDialog.dialog("option", "height", 400);
                    $("#function-specific-form").html(getMakeDatasetElements());
                    break;
                case "mapc":
                    mainDialog.dialog("option", "buttons", getMapcButtons(mainDialog));
                    mainDialog.dialog("option", "height", "auto");
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
                                    displayTooltip: { items: 'td', content: 'Name of the column to which you want to apply a function' }
                                },
                                { 
                                    name: 'mapc-function', 
                                    display: 'Function', 
                                    type: 'select', 
                                    ctrlOptions: function(selectControl){ getCustomFunctionOptions(selectControl)},
                                    ctrlCss: { width: '100%' }, 
                                    onChange: handleMapcFunctionSelect,
                                    resizable: false, 
                                    displayCss: { 'min-width': '160px' },
                                    displayTooltip: { items: 'td', content: 'Function to apply to the chosen column' },

                                }
                            ],
                            initData: [
                            ]
                        }
                    );

                    break;
                case "derive-column":
                    mainDialog.dialog("option", "buttons", getDeriveColumnButtons(mainDialog));
                    mainDialog.dialog("option", "height", 580);
                    $("#function-specific-form").html(getDeriveColumnElements());
                    // fill in the function options
                    generateSelectOptionsDeriveColumn($("#derived-col-select-func")[0]);
                    // create a jQuery UI select
                    $("#derived-col-select-func").selectmenu({
                        width: "100%",
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
                        .addClass("derived-col-select-overflow");
                    break;
                case "add-custom-code":
                    mainDialog.dialog("option", "buttons", getCustomFunctionButtons(mainDialog));
                    mainDialog.dialog("option", "height", 530);
                    $("#function-specific-form").html(getCustomFunctionElements());
                    if(addCustomCodeMirror)
                        $(addCustomCodeMirror.getWrapperElement()).remove();

                    addCustomCodeMirror = CodeMirror.fromTextArea(
                        $("#add-custom-code")[0], 
                        {lineWrapping : true, lineNumbers: true}
                    );
                    addCustomCodeMirror.setSize("100%", "55%");

                    addCustomCodeMirror.setValue("");
                    break;
                default:
                    break;
            }
        }
    }).selectmenu("menuWidget").addClass("pipeline-functions-overflow");

    $("#pipelineAddAtEnd").on("click", function(){
        indexInPipeline=0;
        mainDialog.dialog("open");
        //        mainDialog.dialog("option", "height", "500");
    });

    /**  Initiate code generation  **/

    $("#generate-code").button().on("click", function(){
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
        /************** TEST TODO REMOVEME *************/
        //        console.log(outputCodeMirror.getValue());
        var TESTVAR = jsedn.parse("(" + outputCodeMirror.getValue() + ")");
        console.log(TESTVAR);

        /************** TEST TODO REMOVEME ***************/
    });

    $("#clear-grafterizer-ui").button().on("click", function(){
        // TODO ask if they are sure!
        clearUI();
    });

    $("#test-load-transformation").button().on("click", function(){
        // TODO ask if they are sure!
        loadTransformationInUI(testTransformation);
    });

    $("#create-custom-func").button().on("click", function(){
        $("#dialog-create-custom-function").dialog({close: function(){}}).dialog("open");
    });

    /**  Initialise dialog for defining prefixes  **/

    $("#dialog-pipeline-prefixers").dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: "auto",
        width: "auto",
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

            }
        }
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
                    resizable: true, ctrlCss: { width: '100%' }, displayCss: { 'min-width': '   100px' },
                    // Customize UI tooltip
                    displayTooltip: { items: 'td', content: 'Name of the prefix to be used in creating the graph' }
                },
                { 
                    name: 'uri', display: 'URI', type: 'text', ctrlAttr: { maxlength: 2048}, 
                    resizable: false, ctrlCss: { width: '460px' }, displayCss: { 'min-width': '160px' },
                    displayTooltip: { items: 'td', content: 'Namespace URI corresponding to the prefix' }
                }
            ],
            initData: [
            ]
        });

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
                clearPrefixersTable();
            },
            "No": function () {
                $(this).dialog('close');
            }
        }
    });

    $("#edit-prefixers").button().on("click", function(){
        $("#dialog-pipeline-prefixers").dialog("open");
    });

    /**  Initialise dialog for creating custom functions  **/

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
            customFunctionCodeMirror.setSize("98%", "57%");

            // initialize the selection
            refreshCustomFunctionsSelect();
        },
        buttons: {
            Done: function(){
                $(this).dialog("close");
            }
        }
    });

    $("#save-function").button().on("click", function(event){
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
        width: '100%',
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
    }).selectmenu("menuWidget").addClass("custom-functions-select-overflow");

    /**  Initialise dialog for RDF graph mapping  **/

    $("#dialog-rdf-mapping").dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 700,
        width: 800,
        title: "Define RDF mapping...",
        buttons: {
            Done: function(){
                $(this).dialog("close");
            }
        }
    });

    $("#open-rdf-dialog").button().on("click", function(){
        $("#dialog-rdf-mapping").dialog("open");
    });

    /**  Initialise dialog for defining graph nodes  **/

    $("#dialog-define-graph-node").dialog({
        dialogClass: "dialog-define-graph-node",
        autoOpen: false,
        resizable: false,
        modal: true,
        height: "auto",
        width: "auto",
        title: "Choose node type",
        open: function () {
            // select for source = column
            // select for the prefix = prefix or empty (if prefix has been deleted)
            loadPrefixersInGraphDefinitionDialog();
            var nodeModified = jQuery.data(this, "node-modified");
            // in case we use the graph URI prefix has a null value

            if (nodeModified instanceof ColumnURI) {
                var prefix = nodeModified.prefix || "", 
                    column = nodeModified.column;
                // check appropriate radio button
                $("input[name=node-type-radio]:checked").prop("checked", false);
                $("input#uri-radio[name=node-type-radio]").prop("checked", true);
                $("input[name=node-type-radio]").trigger("change");

                // change value of prefix field
                $(".custom-combobox-input").val(prefix == "" ? "(no prefix)" : prefix);

                // change value of source combo
                $("#uri-node-val-src").val("uri-node-val-src-column");
                $("#uri-node-val-src").selectmenu("refresh");
                $("#uri-node-val-column-elements").show();
                $("#uri-node-val-text-elements").hide();

                // change value of column 
                $("#uri-node-val-column").val(column);
            }

            if (nodeModified instanceof ConstantURI) {

                var prefix = nodeModified.prefix || "", 
                    constant = nodeModified.constant;

                // check appropriate radio button
                $("input[name=node-type-radio]:checked").prop("checked", false);
                $("input#uri-radio[name=node-type-radio]").prop("checked", true);
                $("input[name=node-type-radio]").trigger("change");

                // change value of prefix field
                $(".custom-combobox-input").val(prefix == "" ? "(no prefix)" : prefix);

                // change value of source combo
                $("#uri-node-val-src").val("uri-node-val-src-text");
                $("#uri-node-val-src").selectmenu("refresh");
                $("#uri-node-val-column-elements").hide();
                $("#uri-node-val-text-elements").show();

                // change value of column 
                $("#uri-node-val-text").val(constant);

            }

            if (nodeModified instanceof ColumnLiteral) {

            }

            if (nodeModified instanceof ConstantLiteral) {

            }

            // determine the type of node

        },
        buttons: {
            Done: function () {
                // how to know to which graph we should add the node?
                // 1) put this with the code for initializing 
                // 2) associate position to add the dialog when opening it
                // retrieve it there through jquery.data(this, "something-something")
                // remove add first button
                // add new node
                // create node object according to the current state of the dialog

                var nodeModified = jQuery.data(this, "node-modified");
                var containingElement = jQuery.data(this, "containing-element");

                var isURI = false;
                var isSourceFromColumn = false;

                // we retrieve the values from the forms to find out the exact values for the node we are creating
                var prefixSelectValue = $("#uri-node-prefixer").val();
                var nodeType = $('input[name=node-type-radio]:checked', '#graph-node-type').val();
                var literalValueSource = $("#literal-node-val-src").val();
                var nodeValueSource = $("#uri-node-val-src").val();

                // variable holds the prefix used in creating the object representation of the RDF node
                var prefix = "";

                switch(prefixSelectValue){
                    case "default-uri-prefix":
                        // create a URI node with a prefix value equal to null (we will add the concrete value when constructing the graph)
                        prefix = null;
                        break;
                    case "no-uri-prefix":
                        prefix = "";
                        // create a URI node with an empty prefix
                        break;
                    default:
                        if (prefixSelectValue.trim() === ""){
                            prefix = "";

                        } else {
                            prefix = prefixSelectValue;
                        }
                        // create a URI node with a prefix value equal to the string
                        // also need to check for empty strings (then default is no-uri)
                        // later on we can validate as well

                        break;
                }
                switch (nodeType) {
                    case "uri":
                        isURI = true;
                        // determine whether the source is a column or user-defined text
                        switch (nodeValueSource) {
                            case "uri-node-val-src-column": 
                                isSourceFromColumn = true;
                                // column
                                break;
                            case "uri-node-val-src-text":
                                isSourceFromColumn = false;
                                // text
                                break;
                            default:
                                alertInterface("Invalid node source selection for RDF mapping");
                                // TODO error?
                                break;
                        }

                        break;
                    case "literal":
                        isURI = false;
                        switch (literalValueSource) {
                            case "literal-node-val-src-column": 
                                isSourceFromColumn = true;
                                // column
                                break;
                            case "literal-node-val-src-text":
                                isSourceFromColumn = false;
                                // text
                                break;
                            default:
                                alertInterface("Invalid node source selection for RDF mapping");
                                // TODO error?
                                break;
                        }
                        break;
                    case "blank":
                        if(nodeModified === null && containingElement instanceof Graph){
                            alertInterface("Invalid node type! Graph roots cannot be blank.");
                        }
                        break;

                    default:
                        alertInterface("Invalid node type!");
                        // roots can be only uri-s and literals; choosing blank nodes as root should not be possible
                        return;
                }

                // TODO determine if we should create a new element or modify an existing one
                if (nodeModified === null) {
                    console.log("NEW NODE!");

                    if(!isURI && !isSourceFromColumn){
                        var constantName = $("#literal-node-val-text").val();
                        var node = new ConstantLiteral(containingElement, constantName);
                        containingElement.addChild(node);
                        // ConstantLiteral
                    }
                    if(!isURI && isSourceFromColumn){
                        var columnName = $("#literal-node-val-column").val();
                        var node = new ColumnLiteral(containingElement, columnName);
                        containingElement.addChild(node);
                        // ColumnLiteral
                    }
                    if(isURI && !isSourceFromColumn){
                        var constantName = $("#uri-node-val-text").val();
                        var node = new ConstantURI(containingElement, prefix, constantName);
                        containingElement.addChild(node);
                    }
                    if(isURI && isSourceFromColumn){
                        var columnName = $("#uri-node-val-column").val();
                        var node = new ColumnURI(containingElement, prefix, columnName);
                        containingElement.addChild(node);
                    }

                    // new node must be created
                } else {
                    console.log("OLD NODE TODO - replace the old node with a new one");
                    return;
                    // modify an existing element (i.e. replace it)
                }

                //                console.log("URI? -", isURI);
                //                console.log("from column? -", isSourceFromColumn);
                //                console.log("chose prefix:", prefix == "" ? "(empty)" : prefix);




                $(this).dialog("close");
            }
        }
    });
    $('input[name=node-type-radio]').change(function () {

        switch ($('input[name=node-type-radio]:checked').val()) {
            case "uri":
                $(".define-graph-node-right").show();
                $("#form-uri-node").show();
                $("#form-literal-node").hide();
                break;
            case "literal":
                $(".define-graph-node-right").show();
                $("#form-uri-node").hide();
                $("#form-literal-node").show();
                break;
            case "blank":
                $(".define-graph-node-right").hide();
                $("#form-uri-node").hide();
                $("#form-literal-node").hide();
                break;
            default: 
                console.log("nothing checked");
                break;
        }
    });

    $("#uri-node-val-src").selectmenu({
        width: 200,
        change: function( event, data ){
            var selectionValue = data.item.value;
            switch (selectionValue) {
                case "uri-node-val-src-column":
                    $("#uri-node-val-column-elements").show();
                    $("#uri-node-val-text-elements").hide();
                    break;
                case "uri-node-val-src-text":
                    $("#uri-node-val-column-elements").hide();
                    $("#uri-node-val-text-elements").show();
                    break;
                default:
                    $("#uri-node-val-column-elements").hide();
                    $("#uri-node-val-text-elements").hide();
                    break;
            }
        }
    }).selectmenu("menuWidget").addClass("overflow");

    $("#literal-node-val-src").selectmenu({
        width: 200,
        change: function( event, data ){
            var selectionValue = data.item.value;
            switch (selectionValue) {
                case "literal-node-val-src-column":
                    $("#literal-node-val-column-elements").show();
                    $("#literal-node-val-text-elements").hide();
                    break;
                case "literal-node-val-src-text":
                    $("#literal-node-val-column-elements").hide();
                    $("#literal-node-val-text-elements").show();
                    break;
                default:
                    $("#literal-node-val-column-elements").hide();
                    $("#literal-node-val-text-elements").hide();
                    break;
            }
        }
    }).selectmenu("menuWidget").addClass("overflow");

    // Custom combo for choosing prefixers for defining graph nodes 
    $.widget( "custom.combobox", {
        _create: function() {
            this.wrapper = $( "<span>" )
                .addClass( "custom-combobox" )
                .insertAfter( this.element );

            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function() {
            var selected = this.element.children( ":selected" ),
                value = selected.val() ? selected.text() : "";

            this.input = $( "<input>" )
                .appendTo( this.wrapper )
                .val( value )
                .attr( "title", "" )
                .attr( "spellcheck", false )
                .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
                .css("font-size", "0.8em")
                .autocomplete({
                delay: 0,
                minLength: 0,
                source: $.proxy( this, "_source" )
            })
                .tooltip({
                tooltipClass: "ui-state-highlight"
            });

            this._on( this.input, {
                autocompleteselect: function( event, ui ) {
                    ui.item.option.selected = true;
                    this._trigger( "select", event, {
                        item: ui.item.option
                    });
                },

                autocompletechange: "_removeIfInvalid"
            });
        },

        _createShowAllButton: function() {
            var input = this.input,
                wasOpen = false;

            $( "<a>" )
                .attr( "tabIndex", -1 )
                .attr( "title", "Show All Items" )
                .tooltip()
                .appendTo( this.wrapper )
                .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
                .removeClass( "ui-corner-all" )
                .addClass( "custom-combobox-toggle ui-corner-right" )
                .mousedown(function() {
                wasOpen = input.autocomplete( "widget" ).is( ":visible" );
            })
                .click(function() {
                input.focus();

                // Close if already visible
                if ( wasOpen ) {
                    return;
                }

                // Pass empty string as value to search for, displaying all results
                input.autocomplete( "search", "" );
            });
        },

        _source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            response( this.element.find( "option" ).map(function() {
                var text = $( this ).text();
                if ( this.value && ( !request.term || matcher.test(text) ) )
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }) );
        },

        _removeIfInvalid: function( event, ui ) {

            // Selected an item, nothing to do
            if ( ui.item ) {
                return;
            }

            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children( "option" ).each(function() {
                if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                    this.selected = valid = true;
                    return false;
                }
            });

            // Found a match, nothing to do
            if ( valid ) {
                return;
            }

            // Remove invalid value and replace by empty
            $(this.element).find("option[value='no-uri-prefix']")[0].selected = true;
            this.input
                .val( $(this.element).find("option[value='no-uri-prefix']").text() )
                .attr( "value", value + " didn't match any prefix name" )
                .tooltip( "open" );

            this._delay(function() {
                this.input.tooltip( "close" ).attr( "title", "" );
            }, 2500 );
            this.input.autocomplete( "instance" ).term = "";

            //            console.log("this.input.val():", this.input.val());
            //            console.log("this.element.val():", this.element.val());
            //            console.log('$("#uri-node-prefixer").val()', $("#uri-node-prefixer").val());
        },

        _destroy: function() {
            this.wrapper.remove();
            this.element.show();
        }
    });

    $( "#uri-node-prefixer" ).combobox();

    /**  Initialise dialog for registering Grafter transformations  **/

    $("#dialog-define-graph-property").dialog({
        dialogClass: "dialog-define-graph-node",
        autoOpen: false,
        resizable: false,
        modal: true,
        height: "auto",
        width: "auto",
        title: "Choose node type",
        open: function () {
            // TODO editing properties by clicking on the element
        },
        buttons: {
            Done: function () {
                var propertyModified = jQuery.data(this, "element-modified");
                var containingElement = jQuery.data(this, "containing-element");
                var isURI = false;
                var isSourceFromColumn = false;

                // we retrieve the values from the forms to find out the exact values for the node we are creating

                if (propertyModified === null) {
                    console.log("NEW PROPERTY!");
                    // new node must be created
                    var propertyText = $("#property-val").val();
                    // TODO hack - should have a separate prefix field to choose the prefix name from
                    var prefix = propertyText.split(':')[0].trim();
                    var propName = propertyText.split(':')[1].trim();
                    var property = new Property(containingElement, prefix, propName);
                    containingElement.addChild(property);
                } else {
                    console.log("OLD PROPERTY TODO - replace the old node with a new one");
                    return;
                    // modify an existing element (i.e. replace it)
                }


                $(this).dialog("close");
            }
        }
    });


    $("#open-pipeline-registration-dialog").button().on("click", function(){
        $("#dialog-pipeline-registration").dialog("open");
    });


    $("#dialog-pipeline-registration").dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 490,
        width: 500,
        title: "Register Grafter pipeline and mapping",
        open: function(event, ui){
        },
        buttons: {
            Register: function(){
                generateGrafterCode();
                var pipelineId = $("#pipeline-registration-id").val(),
                    pipelineDescription = $("#pipeline-registration-description").val(),
                    pipelineCode = $("#output").val();
                registerPipeline(pipelineId, pipelineDescription, "asdf");
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });
    /**  Create the RDF mapping control object  **/
    rdfControl = new RDFControl($("#rdf-control-div").get(0), 100, 95);



});

function registerPipeline(id, description, code){
    var url = "http://dapaas.ontotext.com/grafter-gui-service/generate-executable";

    var xhr = createCORSRequest('POST', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        alert(text);
    };

    xhr.onerror = function() {
        console.log('Woops, there was an error making the request.');
    };
    var data = new FormData();
    //    console.log(id);
    //    console.log(description);
    //    console.log(code);
    //    data.append("id", id);
    //    data.append("description", description);
    //    data.append("code", code);
    xhr.withCredentials = true;
    //    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('id', id);
    xhr.setRequestHeader('description', description);
    xhr.setRequestHeader('code', code);
    console.log(data);
    xhr.send(data);
}

function getAllPipelines(){
    var url = "http://dapaas.ontotext.com/dapaas-import-services/grafter/list";
    var method = "GET";

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        alert(text);
    };

    xhr.onerror = function() {
        alert('Woops, there was an error making the request.');
    };
    xhr.withCredentials = true;
    xhr.send();
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true, "dapaas", "dApAAs2014");
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}


/***************************************************************************
    Testing functionalities programatically - preloading some test data
***************************************************************************/
$(function() {
    //
    //    /*******************************************************************************
    //        Custom functions
    //    *******************************************************************************/
    //
    //    var f1 = "(defn select-row [ds n]\r\n  (->> (rows ds [n])\r\n       incanter.core\/to-list\r\n       first))";
    //
    //    var f2 = "(defn normalise-header-c\r\n  \"cultural facilities\"\r\n  [ds f]\r\n  (let [[div sub-div & years-row] (->> (select-row ds 0)\r\n                                       (drop 3))\r\n        type-row (->> (select-row ds 1)\r\n                      (drop 3))\r\n\r\n        data-type-row (->> (select-row ds 2)\r\n                           (drop 3))\r\n\r\n        new-header (->> (map #(str (cstr\/trim %1) \" \" (cstr\/trim %2) \" \" (cstr\/trim %3)) years-row type-row data-type-row)\r\n                        (concat [\"file\" \"division\" \"type\"])\r\n                        (map f))]\r\n    (make-dataset ds (map str new-header))))";
    //
    //
    //    var f3 = "(defn normalise-header-t\r\n  \"traffic equipment\"\r\n  [ds f]\r\n  (let [[div & years-row] (->> (select-row ds 0)\r\n                               (drop 2))\r\n        type-row (->> (select-row ds 1)\r\n                      (drop 2))\r\n\r\n        data-type-row (->> (select-row ds 2)\r\n                           (drop 2))\r\n\r\n        new-header (->> (map #(str (cstr\/trim %1) \" \" (cstr\/trim %2) \" \" (cstr\/trim %3)) years-row type-row data-type-row)\r\n                        (concat [\"file\" \"division\"])\r\n                        (map f))]\r\n    (make-dataset ds (map str new-header))))";
    //
    //    var f4 = "(defn normalise-header-h\r\n  \"highschool\"\r\n  [ds f]\r\n  (let [[div type & years-row] (->> (select-row ds 0)\r\n                                    (drop 3))\r\n        type-row (->> (select-row ds 1)\r\n                      (drop 3))\r\n\r\n        new-header (->> (map #(str (cstr\/trim %1) \" \" (cstr\/trim %2)) years-row type-row)\r\n                        (concat [\"file\" \"division\" \"type\"])\r\n                        (map f))]\r\n    (make-dataset ds (map str new-header))))";
    //
    //    var f5 = "(defn replace-words [mapping]\r\n  (fn [s] (reduce (fn [st [match replacement]]\r\n                    ;(cstr\/replace st (re-pattern (str \"\\\\b\" match \"\\\\b\")) replacement)) s\r\n                    (cstr\/replace st (re-pattern match) replacement)) s\r\n                  (partition 2 mapping))))";
    //
    //    var f6 = "(defn ->Integer [i]\r\n  (cond\r\n    (= \"-\" i) 0\r\n    (nil? i) 0\r\n    (number? i) (int i)\r\n    (string? i) (Integer\/parseInt i)))";
    //
    //    var f7 = "(defn replace-varible-string [cell]\r\n  (-> cell\r\n      (cstr\/replace #\".* #\" \"number\")\r\n      (cstr\/replace #\"[0-9]{4} \" \"\")))";
    //
    //    var f8 = "(defn extract-year [cell]\r\n  ;(first (cstr\/split (str cell) #\" # | art | railroad \")))\r\n  (apply str (filter #(Character\/isDigit %) (str cell))))";
    //
    //    var f9 = "(defn remove-extension [cell]\r\n  (cstr\/replace cell \".xlsx\" \"\"))";
    //
    //    var f10 = "(defn hyphenate [str]\r\n  (cstr\/replace str \" \" \"-\"))";
    //
    //    var f11 = "(defn observation-uri [variable division year]\r\n  (->> [variable division year]\r\n       (interpose \" \")\r\n       (apply str)\r\n       hyphenate\r\n       cstr\/lower-case\r\n       pluqi-data))";
    //
    //    var f12 = "(def filename->indicator-uri\r\n  {\"2005-2006_cultural facilities.xlsx\" (pluqi-schema \"Cultural_satisfaction\")\r\n   \"2007-2008_cultural facilities.xlsx\" (pluqi-schema \"Cultural_satisfaction\")\r\n   \"2009-2011_cultural facilities.xlsx\" (pluqi-schema \"Cultural_satisfaction\")\r\n   \"2011-2012_cultural facilities.xlsx\" (pluqi-schema \"Cultural_satisfaction\")\r\n   \"2005-2012_traffic equipment.xlsx\"   (pluqi-schema \"Daily_life_satisfaction\")\r\n   \"2005-2008_green space.xlsx\"         (pluqi-schema \"Environmental_needs_and_efficiency\")\r\n   \"2009-2012_green space.xlsx\"         (pluqi-schema \"Environmental_needs_and_efficiency\")\r\n   \"2011-2013_highschool.xlsx\"          (pluqi-schema \"Level_of_opportunity\")\r\n   \"2011-2012_place of a crime.xlsx\"    (pluqi-schema \"Safety_and_security\")})";
    //
    //    var f13 = "(defn division-uri [s]\r\n  (pluqi-data s))";
    //
    //    var f14 = "(defn date-format [fmt]\r\n  (let [parser (java.text.SimpleDateFormat. fmt)]\r\n    (fn [s]\r\n      (.parse parser (str s) (java.text.ParsePosition. 0)))))";
    //
    //    var f15 = "(defn observation-label [var year division]\r\n  (str (cstr\/capitalize var) \" in \" division \" in \" year \".\"))";
    //
    //    var f16 = "(def call-year (date-format \"yyyy\"))";
    //    var f17 = "(def call-comp-removeext (comp pluqi-data remove-extension))";
    //    var f18 = "(def call-comp-hyphenate (comp pluqi-data hyphenate))";
    //
    //    var codeObject = createCustomFunctionObj(f1);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f2);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f3);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f4);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f5);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f6);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f7);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f8);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f9);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f10);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f11);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f12);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f13);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f14);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f15);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f16);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f17);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f18);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //
    //    /*******************************************************************************
    //        Prefixes
    //    *******************************************************************************/
    //
    //
    //    var prefixer = createPrefixer("base-domain", "http://project.dapaas.eu/pluqi");
    //    prefixersInGUI.push(prefixer);
    //    prefixer = createPrefixer("pluqi-graph", "http://project.dapaas.eu/pluqi/graph/pluqi/");
    //    prefixersInGUI.push(prefixer);
    //    prefixer = createPrefixer("pluqi-schema", "http://project.dapaas.eu/pluqi/schema/");
    //    prefixersInGUI.push(prefixer);
    //    prefixer = createPrefixer("pluqi-data", "http://project.dapaas.eu/pluqi/data/");
    //    prefixersInGUI.push(prefixer);
    //
    //
    //    /*******************************************************************************
    //        Pipeline
    //    *******************************************************************************/
    //
    //
    //    var jsEdnRowsFunction = createDropRows(4);
    //    addAtIndexInPipeline("drop-rows", 0, jsEdnRowsFunction);
    //
    //    var index = 1;
    //    var functionDisplayName = "apply-columns";
    //    var code = "(apply-columns {:division fill-when})"
    //    createAndAddCustomFunctionToPipeline(functionDisplayName, code, index);
    //
    //    var index = 2;
    //    var functionDisplayName = "mapply-melt";
    //    var code = "(mapply-melt pivot-keys)"
    //    createAndAddCustomFunctionToPipeline(functionDisplayName, code, index);
    //
    //    var newColName = ":year";
    //    var colsToDeriveFrom = ":variable";
    //    var functionToDeriveWith = "extract-year";
    //    index = 3;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //    var index = 4;
    //    var functionDisplayName = "mapc";
    //    var code = "(mapc {:variable replace-varible-string :value ->Integer})"
    //    createAndAddCustomFunctionToPipeline(functionDisplayName, code, index);
    //
    //    newColName = ":observation-label";
    //    colsToDeriveFrom = ":variable :year :division";
    //    functionToDeriveWith = "observation-label";
    //    index = 5;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //
    //    newColName = ":observation-date";
    //    colsToDeriveFrom = ":year";
    //    functionToDeriveWith = "call-year";
    //    index = 6;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //
    //    newColName = ":dataset-uri";
    //    colsToDeriveFrom = ":file";
    //    functionToDeriveWith = "call-comp-removeext";
    //    index = 7;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //
    //    newColName = ":dimension-uri";
    //    colsToDeriveFrom = ":variable";
    //    functionToDeriveWith = "call-comp-hyphenate";
    //    index = 8;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //
    //    newColName = ":observation-uri";
    //    colsToDeriveFrom = ":variable :division :year";
    //    functionToDeriveWith = "observation-uri";
    //    index = 9;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //
    //    newColName = ":indicator-uri";
    //    colsToDeriveFrom = ":file";
    //    functionToDeriveWith = "filename->indicator-uri";
    //    index = 10;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //
    //    newColName = ":division-uri";
    //    colsToDeriveFrom = ":division";
    //    functionToDeriveWith = "division-uri";
    //    index = 11;
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //    var graph = new Graph("http://project.dapaas.eu/pluqi/graph/pluqi/example", rdfControl);
    //    var dimensionRoot = new ColumnURI(graph, "", "dimension-uri");
    //
    //    var prop1 = new Property(dimensionRoot, "rdf", "a");
    //    var indicatorURINode = new ColumnLiteral(prop1, "indicator-uri");
    //
    //    var prop2 = new Property(dimensionRoot, "rdf", "a");
    //    var owlNamedIndiv = new ConstantLiteral(prop2, "owl:NamedIndividual");
    //
    //    var prop3 = new Property(dimensionRoot, "pluqi-schema", "hasValue");
    //    var observationURINode = new ColumnLiteral(prop3, "observation-uri");
    //
    //    var observationRoot = new ColumnURI(graph, "", "observation-uri");
    //
    //    var prop4 = new Property(observationRoot, "rdf", "a");
    //    var owlNamedIndiv1 = new ConstantLiteral(prop4, "owl:NamedIndividual");
    //
    //    var prop5 = new Property(observationRoot, "rdf", "a");
    //    var pluqiValue = new ColumnURI(prop5, "pluqi-schema", "Value");
    //
    //    var prop6 = new Property(observationRoot, "rdfs", "label");
    //    var observationLabel = new ColumnLiteral(prop6, "observation-label");
    //
    //    var prop7 = new Property(observationRoot, "pluqi-schema", "measure");
    //    var valueColumnLiteral = new ColumnLiteral(prop7, "value");
    //
    //    var prop8 = new Property(observationRoot, "pluqi-schema", "location");
    //    var divisionURINode = new ColumnLiteral(prop8, "division-uri");
    //
    //    var prop9 = new Property(observationRoot, "pluqi-schema", "hasValue");
    //    var datasetURINode = new ColumnLiteral(prop9, "dataset-uri");
    //
    //    var prop10 = new Property(observationRoot, "pluqi-schema", "time");
    //    var observationDateURINode = new ColumnLiteral(prop10, "observation-date");
    //
    //    var prop11 = new Property(observationRoot, "rdfs", "comment");
    //    var typeLabel = new ColumnLiteral(prop11, "type");
    //
    //
    //
    //    var datasetRoot = new ColumnURI(graph, "", "dataset-uri");
    //
    //    var prop12 = new Property(datasetRoot, "rdf", "a");
    //    var pluqiDatasource = new ColumnURI(prop12, "pluqi-schema", "DataSource");
    //
    //    var prop13 = new Property(datasetRoot, "rdf", "a");
    //    var owlNamedIndiv2 = new ConstantLiteral(prop13, "owl:NamedIndividual");
    //
    //
    //    rdfControl.addGraph(graph);
    //    graph.addChild(dimensionRoot);
    //
    //    dimensionRoot.addChild(prop1);
    //    prop1.addChild(indicatorURINode);
    //
    //    dimensionRoot.addChild(prop2);
    //    prop2.addChild(owlNamedIndiv);
    //
    //    dimensionRoot.addChild(prop3);
    //    prop3.addChild(observationURINode);
    //
    //
    //    graph.addChild(observationRoot);
    //
    //    observationRoot.addChild(prop4);
    //    prop4.addChild(owlNamedIndiv1);
    //
    //    observationRoot.addChild(prop5);
    //    prop5.addChild(pluqiValue);
    //
    //    observationRoot.addChild(prop6);
    //    prop6.addChild(observationLabel);
    //
    //    observationRoot.addChild(prop7);
    //    prop7.addChild(valueColumnLiteral);
    //
    //    observationRoot.addChild(prop8);
    //    prop8.addChild(divisionURINode);
    //
    //    observationRoot.addChild(prop9);
    //    prop9.addChild(datasetURINode);
    //
    //    observationRoot.addChild(prop10);
    //    prop10.addChild(observationDateURINode);
    //
    //    observationRoot.addChild(prop11);
    //    prop11.addChild(typeLabel);
    //
    //
    //    graph.addChild(datasetRoot);
    //
    //    datasetRoot.addChild(prop12);
    //    prop12.addChild(pluqiDatasource);
    //
    //    datasetRoot.addChild(prop13);
    //    prop13.addChild(owlNamedIndiv2);
    //
    //    $("#pipeline-registration-id").val("PLUQIGrafterTransformation");
    //    $("#pipeline-registration-description").val("PLUQI use case example Grafter transformation. Cleans unnecessary data fields and maps the remaining data to RDF.");
    //    
    //    var obj = graph.getStringifiableGraph();
    ////    console.log(obj);
    //    var str = JSON.stringify(obj);
    //    
    //    
});

function clearPipeline() {
    var pipelineTable = $("#pipeline")[0];
    showDefaultAddButton();
    while (pipelineTable.rows.length > 1){
        pipelineTable.deleteRow(0);
    }
    userFunctions = [];
    columnKeys = new jsedn.Vector([]);
    pipeline = new jsedn.List([jsedn.sym("defn"), jsedn.sym("pipeline"), new jsedn.Vector([new jsedn.sym("dataset")]),
                               new jsedn.List([jsedn.sym("->"), jsedn.sym("dataset")])]);
}

function clearGraphs() {
    var i, numGraphs;
    numGraphs = rdfControl.graphs.length;
    for(i = 0; i < numGraphs; ++i){
        rdfControl.removeGraph(rdfControl.graphs[0]);
    }
    graphs = new jsedn.List([]);
}

function clearCustomFunctions(){
    // clear custom functions
    customFunctionsMap = [];
    refreshCustomFunctionsSelect();
}

function clearPrefixers() {
    clearPrefixersTable();
    prefixersInGUI = [];
    prefixers = [];
}

function clearUI() {
    clearCustomFunctions();
    clearGraphs();
    clearPipeline();
    clearPrefixers();
}

function loadTransformationInUI(transformation){
    var i, cfName, cfCode, cfObject, prefixer, pipeline, stringifiableGraph;
    // check if valid transformation object
    console.log(transformation);
    if(!(transformation instanceof Transformation)){
        console.error("Couldn't load transformation: error parsing JSON.");
        clearUI();
        return;
    }

    //    clearUI();

    /*******************************************************************************
        Custom functions
    *******************************************************************************/

    for(i = 0; i < transformation.customFunctionDeclarations.length; ++i){
        cfCode = transformation.customFunctionDeclarations[i].clojureCode;
        cfName = transformation.customFunctionDeclarations[i].name; // we don't use it now
        cfObject = createCustomFunctionObj(cfCode);
        if(cfObject) {
            customFunctionsMap[cfObject['fnName']] = cfObject;
        }
    }


    /*******************************************************************************
        Prefixers
    *******************************************************************************/

    for(i = 0; i < transformation.prefixers.length; ++i){
        prefixer = createPrefixer(
            transformation.prefixers[i].name, 
            transformation.prefixers[i].uri
        );

        if(prefixer) {
            prefixersInGUI.push(prefixer);
        }
    }

    /*******************************************************************************
        Pipeline
    *******************************************************************************/

    if(transformation.pipelines.length > 1){
        console.error("Unexpected number of pipelines: ", transformation.pipelines.length);
        clearUI();
        return;
    }

    pipeline = transformation.pipelines[0];

    for(i = 0; i < pipeline.functions.length; ++i){

    }

    //    var jsEdnRowsFunction = createDropRows(1);
    //    addAtIndexInPipeline("drop-rows", 0, jsEdnRowsFunction);
    //
    //    var index = 1;
    //    var columnsKeywords = parseEdnFromString('[:name :sex :age]', "Error parsing the Clojure code!");
    //    columnKeys.val.push(new jsedn.sym("name"));
    //    columnKeys.val.push(new jsedn.sym("sex"));
    //    columnKeys.val.push(new jsedn.sym("age"));
    //
    //    var jsEdnMakeDataset = createMakeDataset(columnsKeywords);
    //    addAtIndexInPipeline("make-dataset", index, jsEdnMakeDataset);
    //
    //
    //    index = 2;
    //    var newColName = ":person-uri";
    //    var colsToDeriveFrom = ":name";
    //    var functionToDeriveWith = "base-id";
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //    index = 3;
    //    var codeJsedn = createMapc(parseEdnFromString("{:age ->integer :sex ->gender}", "Error"));
    //    addAtIndexInPipeline('mapc', index, codeJsedn);


    /*******************************************************************************
        Graph
    *******************************************************************************/

    if(transformation.graphs.length > 1){
        console.error("Unexpected number of grafts: ", transformation.graphs.length);
        clearUI();
        return;
    }

    stringifiableGraph = transformation.graphs[0];

    rdfControl.addGraph(StringifiableGraph.loadDOMGraph(rdfControl, stringifiableGraph));
}


var testTransformation;
$(function () {
    var f1, f2, cf1, cf2, customFunctionDeclarations, prefixer1, prefixer2, baseIdPrefixer, prefixer4, prefixer5, prefixers, pipeline, dropRowsFunction, makeDatasetFunction, deriveColumnFunction, ageKeyFuncMapping, sexKeyFuncMapping, mapcFunction, stringifiableGraph, graph, str, obj, personURIRoot, prop1, foafPersonURINode, prop2, sexColumn, prop3, ageColumn, prop4, nameColumn;

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


    /*******************************************************************************
        Graph
    *******************************************************************************/

    graph = new Graph("http://my-domain.com/graph/example", rdfControl);
    personURIRoot = new ColumnURI(graph, "", "person-uri");

    prop1 = new Property(personURIRoot, "rdf", "a");
    foafPersonURINode = new ConstantURI(prop1, "foaf", "Person");

    prop2 = new Property(personURIRoot, "foaf", "gender");
    sexColumn = new ColumnLiteral(prop2, "sex");

    prop3 = new Property(personURIRoot, "foaf", "age");
    ageColumn = new ColumnLiteral(prop3, "age");

    prop4 = new Property(personURIRoot, "foaf", "name");
    nameColumn = new ColumnLiteral(prop4, "name");

    rdfControl.addGraph(graph);
    graph.addChild(personURIRoot);

    personURIRoot.addChild(prop1);
    prop1.addChild(foafPersonURINode);

    personURIRoot.addChild(prop2);
    prop2.addChild(sexColumn);

    personURIRoot.addChild(prop3);
    prop3.addChild(ageColumn);

    personURIRoot.addChild(prop4);
    prop4.addChild(nameColumn);

    //    graph = rdfControl.graphs[0];

    stringifiableGraph = Graph.revive(graph);

    testTransformation = new Transformation(customFunctionDeclarations, prefixers, [pipeline], [stringifiableGraph]);

    str = JSON.stringify(testTransformation);
    obj = JSON.parse(str, function (key, value) {
        return key === '' && value.hasOwnProperty('__type')
            ? SerializationTypesRegistry[value.__type].revive(value) : this[key];
    });
    var graphObj = StringifiableGraph.loadDOMGraph(rdfControl, obj.graphs[0]);
    //    rdfControl.addGraph(graphObj);
    testTransformation = obj;
    //    console.log(testTransformation.constructor.revive(testTransformation));
    //    console.log(testTransformation.pipelines[0].functions[0] instanceof PipelineFunction);
});

$(function() {

    /*******************************************************************************
        Custom functions
    *******************************************************************************/

    //    var f1 = "(defn -\x3Einteger  \n    \"An example transformation function that converts a string to an integer\"  \n    [s]  \n    (Integer\x2FparseInt s)\n)";
    //
    //    var f2 = "(defn -\x3Egender\n    [str] \n    {\"f\" (s \"female\") \"m\" (s \"male\")}\n)";
    //
    //
    //    var codeObject = createCustomFunctionObj(f1);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    codeObject = createCustomFunctionObj(f2);
    //    if(codeObject['fnName'] == null){
    //        return;
    //    }
    //    customFunctionsMap[codeObject['fnName']] = codeObject;
    //
    //    /*******************************************************************************
    //        Prefixes
    //    *******************************************************************************/
    //
    //
    //    var prefixer = createPrefixer("base-domain", "http://my-domain.com");
    //    prefixersInGUI.push(prefixer);
    //    prefixer = createPrefixer("base-graph", "http://my-domain.com/graph/");
    //    prefixersInGUI.push(prefixer);
    //    prefixer = createPrefixer("base-id", "http://my-domain.com/id/");
    //    prefixersInGUI.push(prefixer);
    //    prefixer = createPrefixer("base-vocab", "http://my-domain.com/def/");
    //    prefixersInGUI.push(prefixer);
    //    prefixer = createPrefixer("base-data", "http://my-domain.com/data/");
    //    prefixersInGUI.push(prefixer);
    //
    //
    //    /*******************************************************************************
    //        Pipeline
    //    *******************************************************************************/
    //
    //
    //    var jsEdnRowsFunction = createDropRows(1);
    //    addAtIndexInPipeline("drop-rows", 0, jsEdnRowsFunction);
    //
    //    var index = 1;
    //    var columnsKeywords = parseEdnFromString('[:name :sex :age]', "Error parsing the Clojure code!");
    //    columnKeys.val.push(new jsedn.sym("name"));
    //    columnKeys.val.push(new jsedn.sym("sex"));
    //    columnKeys.val.push(new jsedn.sym("age"));
    //
    //    var jsEdnMakeDataset = createMakeDataset(columnsKeywords);
    //    addAtIndexInPipeline("make-dataset", index, jsEdnMakeDataset);
    //
    //
    //    index = 2;
    //    var newColName = ":person-uri";
    //    var colsToDeriveFrom = ":name";
    //    var functionToDeriveWith = "base-id";
    //    createDeriveColumnPipelineFunction(newColName, colsToDeriveFrom, functionToDeriveWith, index);
    //
    //    index = 3;
    //    var codeJsedn = createMapc(parseEdnFromString("{:age ->integer :sex ->gender}", "Error"));
    //    addAtIndexInPipeline('mapc', index, codeJsedn);
    //
    //
    //    /*******************************************************************************
    //        Graph
    //    *******************************************************************************/
    //
    //    var graph = new Graph("http://my-domain.com/graph/example", rdfControl);
    //    var personURIRoot = new ColumnURI(graph, "", "person-uri");
    //
    //    var prop1 = new Property(personURIRoot, "rdf", "a");
    //    var foafPersonURINode = new ConstantURI(prop1, "foaf", "Person");
    //
    //    var prop2 = new Property(personURIRoot, "foaf", "gender");
    //    var sexColumn = new ColumnLiteral(prop2, "sex");
    //
    //    var prop3 = new Property(personURIRoot, "foaf", "age");
    //    var ageColumn = new ColumnLiteral(prop3, "age");
    //
    //    var prop4 = new Property(personURIRoot, "foaf", "name");
    //    var nameColumn = new ColumnLiteral(prop4, "name");
    //
    //    rdfControl.addGraph(graph);
    //    graph.addChild(personURIRoot);
    //
    //    personURIRoot.addChild(prop1);
    //    prop1.addChild(foafPersonURINode);
    //
    //    personURIRoot.addChild(prop2);
    //    prop2.addChild(sexColumn);
    //
    //    personURIRoot.addChild(prop3);
    //    prop3.addChild(ageColumn);
    //
    //    personURIRoot.addChild(prop4);
    //    prop4.addChild(nameColumn);
    //
    //    $("#pipeline-registration-id").val("PLUQIGrafterTransformation");
    //    $("#pipeline-registration-description").val("PLUQI use case example Grafter transformation. Cleans unnecessary data fields and maps the remaining data to RDF.");
    //
    //    var obj = Graph.revive(graph);
    //    var str = JSON.stringify(obj);

}); 
