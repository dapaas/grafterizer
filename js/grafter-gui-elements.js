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

//function getAddFirstElementButton(){
//    var removeSignElement = document.createElement("i");
//    removeSignElement.id = "pipelineAddAtEnd";
//    removeSignElement.classList.add("fa");
//    removeSignElement.classList.add("fa-plus-circle");
//    removeSignElement.classList.add("fa-lg");
//    // add listener here!
//    $(removeSignElement).on("click", function(){
//        // TODO listener should trigger a dialog instead!
//        addAtIndexInPipeline("make-dataset");
//    });
//    return removeSignElement;
//}

/* Creates the button used to append a new element to the pipeline */
function getAddSignElement(){
    var addSignElement = document.createElement("i");
    addSignElement.classList.add("fa");
    addSignElement.classList.add("fa-plus");
    addSignElement.classList.add("addAfterButton");

    $(addSignElement).on("click", function(){
        var pipelineTable = $("#pipeline")[0];
        var rowIndex = this.parentElement.parentElement.rowIndex;
        console.log(rowIndex);
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
    console.log($(removeSignElement));
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
            // TODO: input validation, 

            // create the jsedn element
            var jsEdnMakeDataset = createMakeDataset(columnsKeywords);
            console.log(jsEdnMakeDataset);
            addAtIndexInPipeline("make-dataset", indexInPipeline, jsEdnMakeDataset);
            dialog.dialog("close");
        },
        "Cancel": function (){
            console.log(this);
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
            console.log(this);
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

    addGrafterPrefixer("base-domain", "http://my-domain.com");
    addGrafterPrefixer("base-graph", "http://my-domain.com/graph/");
    addGrafterPrefixer("base-id", "http://my-domain.com/id/");
    addGrafterPrefixer("base-vocab", "http://my-domain.com/def/");
    addGrafterPrefixer("base-data", "http://my-domain.com/data/");

    var grafterPrefixers = constructGrafterPrefixers();

    /* Pipeline Function */

    var rows = $("#pipeline")[0].rows;
    console.log(rows);
    for(i=0;i<rows.length;++i){
        if(rows[i].id==="addElementAtEndRow"){
            continue;
        }
        
        var pipelineFunct = jQuery.data(rows[i], "jsedn");
        console.log(pipelineFunct);
        addPipelineFunction(pipelineFunct);
    }

    var resultingPipeline = constructPipeline();
    var textStr = "";
    textStr += (grafterDeclarations.ednEncode() + '\n' + '\n');
    textStr += (resultingPipeline.ednEncode() + '\n' + '\n');
    
    console.log(textStr);
    
    $("#output").val(textStr);
    
    
    
    
}

var indexInPipeline = 0;
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

                case "drop-rows":

                    mainDialog.dialog("option", "buttons", getDropRowsButtons(mainDialog));
                    $("#function-specific-form").html(getDropRowsElements());
                    break;

                case "make-dataset":
                    mainDialog.dialog("option", "buttons", getMakeDatasetButtons(mainDialog));
                    $("#function-specific-form").html(getMakeDatasetElements());
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
    });
    


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



})

/***************************************************************************
    Testing functionalities programatically
***************************************************************************/
$(function() {

});

