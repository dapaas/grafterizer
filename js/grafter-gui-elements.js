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
    label.textContent = "Clojure array of columns (as keywords):";

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

var prefixersInGUI = [{'prefix-name': '', uri: ''}];

var indexInPipeline = 0;

var customFunctionsMap = [];
var customFunctionCodeMirror;
var outputCodeMirror;
var addCustomCodeMirror;

$(function() {
    var mainDialog = $("#dialog-pipeline-main")
    .dialog({
        resizable: true,
        autoOpen: false,
        modal: true,
        height: 300,
        width: 500,
        title: "Add new pipeline element...",
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
        $("#dialog-create-custom-function").dialog("open");
    });

    $('#prefix-table').appendGrid(
        'init', {
            captionTooltip: 'Default and user-defined prefixes',
            initRows: 1,
            hideRowNumColumn:true,
            // TODO - disable create/remove/move up/move down buttons only for the default prefixers
            hideButtons: {
                remove: true,
                insert: true,
                moveUp: true,
                moveDown: true
            },
            // TODO - create a custom delete button that doesn't remove the default prefixers

            //            customFooterButtons: [
            //                {
            //                    uiButton: { icons: { primary: 'ui-icon-plusthick' }},
            //                    btnClass: 'ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only removeLast',
            //                    click: function (evt) {
            //                    }
            //                }
            //            ],

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
                //                { 'prefix-name': '', 'uri': ''}
                // TODO add this as init data
                //                { 'prefix-name': 'dcat', 'uri': 'http://www.w3.org/ns/dcat#'},
                //                { 'prefix-name': 'dcterms', 'uri': 'http://purl.org/dc/terms/'},
                //                { 'prefix-name': 'foaf', 'uri': 'http://xmlns.com/foaf/0.1/'},
                //                { 'prefix-name': 'org', 'uri': 'http://www.w3.org/ns/org#'},
                //                { 'prefix-name': 'os', 'uri': 'http://data.ordnancesurvey.co.uk/ontology/postcode/'},
                //                { 'prefix-name': 'owl', 'uri': 'http://www.w3.org/2002/07/owl#'},
                //                { 'prefix-name': 'pmd', 'uri': 'http://publishmydata.com/def/dataset#'},
                //                { 'prefix-name': 'qb', 'uri': 'http://purl.org/linked-data/cube#'},
                //                { 'prefix-name': 'rdf', 'uri': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'},
                //                { 'prefix-name': 'rdfs', 'uri': 'http://www.w3.org/2000/01/rdf-schema#'},
                //                { 'prefix-name': 'sdmx-attribute', 'uri': 'http://purl.org/linked-data/sdmx/2009/attribute#'},
                //                { 'prefix-name': 'sdmx-concept', 'uri': 'http://purl.org/linked-data/sdmx/2009/concept#'},
                //                { 'prefix-name': 'sdmx-measure', 'uri': 'http://purl.org/linked-data/sdmx/2009/measure#'},
                //                { 'prefix-name': 'skos', 'uri': 'http://www.w3.org/2004/02/skos/core#'},
                //                { 'prefix-name': 'vcard', 'uri': 'http://www.w3.org/2006/vcard/ns'},
                //                { 'prefix-name': 'void', 'uri': 'http://rdfs.org/ns/void#'},
                //                { 'prefix-name': 'xsd', 'uri': 'http://www.w3.org/2001/XMLSchema#'}
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

    var prefixersDialog = $("#dialog-pipeline-prefixers").dialog({
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
        // TODO saving custom function - 
        event.preventDefault();
        var customFunctionCode = customFunctionCodeMirror.getValue();
        var codeObject = createCustomFunctionObj(customFunctionCode);
        if(codeObject['fnName'] == null){
            return;
        }
        customFunctionsMap[ codeObject['fnName'] ] = codeObject;
        refreshCustomFunctionsSelect();
        // TODO update select
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
            // TODO when changing selection - load the code of the function in the editor
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

