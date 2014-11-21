/*jslint node: true */
/*jslint browser: true*/
/*jslint plusplus: true */
/*global $, jQuery, alert, alertInterface */
"use strict";
//var ColorEnum = Object.freeze({RED: 0, GREEN: 1, BLUE: 2});x
/* 
    Generic RDF element class. Constructor takes a callback to adding a peer element.
*/
var RDFElement = function (addPeerCallback, containingGraph) {
    this.subElements = [];
    this.prototype.addPeer = addPeerCallback;


    var rdfElementTable = document.createElement("table"),
        graphNameRow = rdfElementTable.insertRow(0),
        graphNameCell = graphNameRow.insertCell(0),
        graphDefForm = document.createElement("form"),
        graphNameLabel = document.createElement("label"),
        graphNameInput = document.createElement("input"),
        addSignElement = document.createElement("i"),
        createGraphElementTop = document.createElement("i"),
        createGraphElementBottom = document.createElement("i"),
        removeSignElement = document.createElement("i");
    this.tableElement = rdfElementTable;
    //    this.htmlRepresentation = ;
};

RDFElement.prototype.addSubElement = function (subElement) {
    this.subElements.push(subElement);
    // add row to parent table here

};

// class representing a generic URI node
var URINode = function (nodeName) {
    //<i class="fa fa-share-alt"></i>
    //{Node}

};
// inherit from RDFElement
URINode.prototype = Object.create(RDFElement.prototype);
URINode.prototype.constructor = URINode;


// class representing a root node in the RDF mapping
var RootNode = function (columnOrConstantURI, addPeerCallback, conatiningGraph) {
    //<i class="fa fa-share-alt"></i>
    //{Node}
    RDFElement.call(this, addPeerCallback, conatiningGraph);

};
// inherit from URINode
RootNode.prototype = Object.create(URINode.prototype);
RootNode.prototype.constructor = RootNode;


// class representing a property (predicate) from the RDF mapping
var Property = function () {
    //<i class="fa fa-long-arrow-right"></i>
    //{Property}

};

var ConstantLiteral = function (literalText) {
    //<i class="fa fa-pencil-square-o"></i>
    //{Literal node}
};

var ColumnLiteral = function () {
    //<i class="fa fa-columns"></i>
    //{Column node}

};

var ColumnURI = function () {
    //<i class="fa fa-share-alt"></i>
    //{Node}
};



var BlankNode = function () {
    //<i class="fa fa-dot-circle-o"></i>
    //{Blank node}
};

// generic literal node
var LiteralNode = function () {
    //<i class="fa fa-pencil-square-o"></i>
    //{Literal node}
};

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
        createFirstGraphElementButton = document.createElement("i"),
        removeSignElement = document.createElement("i");


    graphTableElement.classList.add("rdf-graph-table");

    /********************************************************************
        Table row that contains graph name and buttons for adding a new graph
    *********************************************************************/
    graphNameLabel.textContent = "Graph URI: ";
    graphNameLabel.classList.add("form-label-sameline");

    graphNameInput.type = "input";
    graphNameInput.style.borderTop = "0";
    graphNameInput.style.borderLeft = "0";
    graphNameInput.style.borderRight = "0";
    graphNameInput.classList.add("rdf-graph-name-input");
    jQuery.data(graphNameInput, "containing-graph", this);

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



        containingRDFControl.addGraphAfterElement(containingGraph.graphTableElement, new Graph("", containingRDFControl));


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

    $(graphNameInput).on("change", function () {
        var containingGraph = jQuery.data(graphNameInput, "containing-graph");
        containingGraph.setURI(this.value);
    });

    this.graphTableElement = graphTableElement;
    this.graphNameInput = graphNameInput;

    /********************************************************************
        Table row that contains the user-defined mapping to RDF
    *********************************************************************/

    this.graphRoots = [];
    graphMappingRow.classList.add("rdf-graph-mapping-tr");

    createFirstGraphElementButton.classList.add("fa");
    createFirstGraphElementButton.classList.add("fa-plus-circle");
    createFirstGraphElementButton.classList.add("rdf-graph-add-first-node");
    createFirstGraphElementButton.classList.add("fa-lg");
    createFirstGraphElementButton.innerHTML = "Add node";
    jQuery.data(createFirstGraphElementButton, "containing-graph", this);
    
    $(createFirstGraphElementButton).on("click", function () {
        var dialog = $("#dialog-define-graph-node").dialog("open");
        var containingGraph = jQuery.data(createFirstGraphElementButton, "containing-graph");
        
        // we associate a null value to the "node-modified" variable since we want to create a new one
        jQuery.data(dialog[0], "node-modified", null);
        // we also associate the containing graph to the dialog so that we know to which graph to add the element
        jQuery.data(dialog[0], "associated-graph", containingGraph);
    });

    graphMappingCell.classList.add("rdf-graph-mapping-cell");
    graphMappingCell.appendChild(createFirstGraphElementButton);
};

Graph.prototype.setURI = function (newGraphURI) {
    this.graphURI = newGraphURI || "{Enter graph URI}";
    this.graphNameInput = this.graphURI;
};

Graph.prototype.addEmptyRoot = function () {
    var rootNode = new RootNode(this.addRoot, this),
        tableToAdd = rootNode.tableElement;
};

Graph.prototype.addRoot = function (root) {
    this.graphRoots.push(root);
    var rootRow = this.graphTableElement.insertRow(0),
        rootCell = rootRow.insertCell(0),
        rootDataCell = rootRow.insertCell(1);

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
    this.holder.appendChild(graph.graphTableElement);
    $(".add-first-graph-button").hide();

};

RDFControl.prototype.addGraphAfterElement = function (element, graph) {
    this.graphs.push(graph);
    $(element).after(graph.graphTableElement);
};

RDFControl.prototype.removeGraph = function (graph) {
    if (typeof graph === 'undefined') {
        alertInterface("Removing RDF mapping failed - RDF mapping graph undefined", "");
    }

    // find and remove from graph objects in graphs array
    var graphIndex = this.graphs.indexOf(graph),
        initialAddButton = $(".add-first-graph-button");
    if (graphIndex !== -1) {
        this.graphs.splice(graphIndex, 1);
    }

    // find and remove DOM elements
    $(graph.graphTableElement).remove();

    if (this.graphs.length === 0) {
        // if there are no other graphs - show the add-first-graph-button again
        initialAddButton.show();
    }
};