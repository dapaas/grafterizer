/*jslint node: true */
/*jslint browser: true*/
/*jslint plusplus: true */
/*global $, jQuery, alert, alertInterface */
"use strict";

var ConstantLiteral = function (literalText) {
    
};

var ColumnLiteral = function () {

    
    
};

var ColumnURI = function () {};

var Predicate = function () {};

var BlankNode = function () {};

var LiteralNode = function () {};

var URINode = function () {};

var RDFElement = function () {};

var Graph = function (graphURI, rdfControl) {
    if (typeof rdfControl === 'undefined') {
        alertInterface("Graph initialisation failed - RDF control undefined", "");
    }
    this.rdfControl = rdfControl;
    this.graphURI = graphURI || "";

    // create graph element
    var graphTableElement = document.createElement("table"),
        graphNameRow = graphTableElement.insertRow(0),
        graphMappingRow = graphTableElement.insertRow(1),
        graphNameCell = graphNameRow.insertCell(0),
        graphMappingCell = graphMappingRow.insertCell(0),
        graphDefForm = document.createElement("form"),
        graphNameLabel = document.createElement("label"),
        graphNameInput = document.createElement("input"),
        addSignElement = document.createElement("i"),
        createGraphElementTop = document.createElement("i"),
        createGraphElementBottom = document.createElement("i"),
        removeSignElement = document.createElement("i");


    graphTableElement.classList.add("rdf-graph-table");

    /********************************************************************
        Row that contains graph name and buttons for adding a new graph
    *********************************************************************/
    graphNameLabel.textContent = "Graph URI: ";
    graphNameLabel.classList.add("form-label-sameline");

    graphNameInput.type = "input";
    graphNameInput.style.borderTop = "0";
    graphNameInput.style.borderLeft = "0";
    graphNameInput.style.borderRight = "0";
    graphNameInput.classList.add("rdf-graph-name-input");

    addSignElement.classList.add("fa");
    addSignElement.classList.add("fa-plus");
    addSignElement.classList.add("rdf-graph-add-after-button");
    addSignElement.classList.add("fa-lg");
    // association of the add button with the graph
    jQuery.data(addSignElement, "containing-graph", this);

    removeSignElement.classList.add("fa");
    removeSignElement.classList.add("fa-times");
    removeSignElement.classList.add("rdf-graph-remove-button");
    removeSignElement.classList.add("fa-lg");
    // association of the remove button with the graph
    jQuery.data(removeSignElement, "containing-graph", this);

    graphNameCell.appendChild(graphNameLabel);
    graphNameCell.appendChild(graphNameInput);
    graphNameCell.appendChild(addSignElement);
    graphNameCell.appendChild(removeSignElement);
    
    $(addSignElement).on("click", function () {
        // get a reference to the containing graph
        var containingGraph = jQuery.data(this, "containing-graph"),
            containingRDFControl = containingGraph.rdfControl;
        
        containingRDFControl.addGraphAfterElement(containingGraph.graphElement, new Graph("", containingRDFControl));
    });
    
    
    $(removeSignElement).on("click", function () {
        var containingGraph = jQuery.data(this, "containing-graph"),
            containingRDFControl = containingGraph.rdfControl;
        
        $("#dialog-confirm").html("Are you sure you want to delete this RDF mapping graph?");
        $("#dialog-confirm").dialog({
            resizable: false,
            modal: true,
            title: "Confirmation",
            buttons: {
                "Yes": function () {
                    $(this).dialog('close');
                    containingRDFControl.removeGraph(containingGraph);
                },
                "No": function () {
                    $(this).dialog('close');
                }
            }
        });
    });
    this.graphElement = graphTableElement;
    
    /********************************************************************
        Row that contains the user-defined mapping to RDF
    *********************************************************************/
//    <i class="fa fa-arrows-alt"></i>
//    graphMappingCell.innerHTML = "ememseusdfbhpuiopiufds";
//    
//  <i class="fa fa-share-alt"></i>
//  {Node}
//<br/>
//
//<i class="fa fa-long-arrow-right"></i>
//  {Property}
//<br/>
//<i class="fa fa-dot-circle-o"></i>
//  {Blank node}
//<br/>
//<i class="fa fa-columns"></i>
//  {Column node}

    createGraphElementTop.classList.add("fa");
    createGraphElementTop.classList.add("fa-arrows-alt");
    createGraphElementTop.classList.add("rdf-graph-add-first-root-button");
    createGraphElementTop.classList.add("fa-stack-1x");
    
    createGraphElementBottom.classList.add("fa");
    createGraphElementBottom.classList.add("fa-th-large");
    createGraphElementBottom.classList.add("rdf-graph-add-first-root-button");
    createGraphElementBottom.classList.add("fa-stack-1x");
    
    graphMappingCell.appendChild(createGraphElementTop);
    graphMappingCell.appendChild(createGraphElementBottom);
};

Graph.prototype.setURI = function (newGraphURI) {
    this.graphURI = newGraphURI || "{Enter graph URI}";
};

var RDFControl = function (divElement, widthPercent, heightPercent) {
    if (divElement.tagName === 'DIV') {
        // apply styles to the control
        divElement.style.width = widthPercent + "%";
        divElement.style.height = heightPercent + "%";
        divElement.style.overflow = "auto";
        divElement.style.border = "1px solid ccc";

        // associate the RDFControl object to the div element
        jQuery.data(divElement, "containing-rdf-control", this);

        // associate div element to the RDF control
        this.holder = divElement;

        // initialise graphs
        this.graphs = [];

        // insert an add button to be used initially
        var initialAddButton = document.createElement("i");

        initialAddButton.classList.add("fa");
        initialAddButton.classList.add("fa-plus-circle");
        initialAddButton.classList.add("add-first-graph-button");
        initialAddButton.classList.add("fa-2x");

        jQuery.data(initialAddButton, "containing-rdf-control", this);

        divElement.appendChild(initialAddButton);

        $(initialAddButton).on("click", function (i, d) {
            var rdfctrl = jQuery.data(this, "containing-rdf-control"),
                graph = new Graph("", rdfctrl);

            /* add the graph to the rdf control (add to graphs collection of the control 
            and add according DOM elements to its DOM tree in the right place) */
            rdfctrl.addGraph(graph);
        });
    }
};

RDFControl.prototype.addGraph = function (graph) {

    this.graphs.push(graph);
    this.holder.appendChild(graph.graphElement);
    $(".add-first-graph-button").hide();

};

RDFControl.prototype.addGraphAfterElement = function (element, graph) {
    this.graphs.push(graph);
    console.log(element);
    $(element).after(graph.graphElement);
};

RDFControl.prototype.removeGraph = function (graph) {
    if (typeof graph === 'undefined') {
        alertInterface("Removing RDF mapping failed - RDF mapping graph undefined", "");
    }
    
    // find and remove from graph objects in graphs array
    var graphIndex = this.graphs.indexOf(graph),
        initialAddButton = $(".add-first-graph-button");
    console.log(graphIndex);
    if (graphIndex !== -1) {
        this.graphs.splice(graphIndex, 1);
    }
    
    // find and remove DOM elements
    $(graph.graphElement).remove();
    
    if (this.graphs.length === 0) {
        // if there are no other graphs - show the add-first-graph-button again
        initialAddButton.show();
    }
};