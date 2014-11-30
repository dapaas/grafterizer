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
        jsEdnMapObject.set(rowVal['mapc-column-key'], new jsedn.sym(rowVal['mapc-function']));
    }
    //    console.log(jsEdnMapObject);
    return jsEdnMapObject;
}

function loadPrefixersInGraphDefinitionDialog(){
    // remove existing options
    // add the ones from the GUI
    $("#custom-prefixer-options > option").remove();

    for (i=0; i<prefixersInGUI.length; ++i){
        var name = prefixersInGUI[i]['prefix-name'];
        if(name == ''){
            continue;
        }
        var optionElement = document.createElement("option");
        optionElement.value = name;
        optionElement.textContent = name;

        $("#custom-prefixer-options").append(optionElement);

    }
}

var prefixersInGUI = [{'prefix-name': '', uri: ''}];
var indexInPipeline = 0;
var customFunctionsMap = [];
var customFunctionCodeMirror;
var outputCodeMirror;
var addCustomCodeMirror;
var currentlySelectedDeriveColFunction = null;

$(function() {

    var mainDialog = $("#dialog-pipeline-main").dialog({
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
        width: "100%",
        change: function( event, data ) {
            var selectionValue = data.item.value;
            switch (selectionValue){
                    // TODO resize! (also for custom functions)
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
                    mainDialog.dialog("option", "height", 400);
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
                    mainDialog.dialog("option", "height", 420);
                    $("#function-specific-form").html(getDeriveColumnElements());
                    // fill in the function options
                    generateSelectOptionsDeriveColumn($("#derived-col-select-func")[0]);
                    // create a jQuery UI select
                    $("#derived-col-select-func").selectmenu({
                        width: 250,
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
    }).selectmenu("menuWidget").addClass("overflow");

    $("#pipelineAddAtEnd").on("click", function(){
        indexInPipeline=0;
        mainDialog.dialog("open");
        mainDialog.dialog("option", "height", 400);
    });

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
    });

    $("#create-custom-func").button().on("click", function(){
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
                clearPrefixersTable();
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
            customFunctionCodeMirror.setSize("100%", "57%");

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
        width: 250,
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
    }).selectmenu("menuWidget").addClass("overflow");

    /**  Initialise dialog for RDF graph mapping  **/

    $("#dialog-rdf-mapping").dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 490,
        width: 500,
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

    /*************************************************************************************************************************************************************************************************************/


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
    /*************************************************************************************************************************************************************************************************************/

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
                console.log(propertyModified);
                var isURI = false;
                var isSourceFromColumn = false;

                // we retrieve the values from the forms to find out the exact values for the node we are creating

                if (propertyModified === null) {
                    console.log("NEW PROPERTY!");
                    // new node must be created
                    var propertyName = $("#property-val").val();
                    var property = new Property(containingElement, propertyName);
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

    /**  Create the RDF mapping control object  **/
    var contr = new RDFControl($("#rdf-control-div").get(0), 100, 79);

});

/***************************************************************************
    Testing functionalities programatically
***************************************************************************/
$(function() {

});

