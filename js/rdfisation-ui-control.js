/*jslint node: true */
/*jslint browser: true*/
/*jslint plusplus: true */
/*global $, jQuery, alert, alertInterface */
"use strict";

//var ColorEnum = Object.freeze({RED: 0, GREEN: 1, BLUE: 2});

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
        //        rootsTable = document.createElement("table"),
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

    // the rootsTable contains all roots of the graph (we permit more than one)
    //    graphMappingCell.appendChild(rootsTable);
    //    this.rootsTable = rootsTable;
    this.graphMappingCell = graphMappingCell;

    graphMappingRow.classList.add("rdf-graph-mapping-tr");

    createFirstGraphElementButton.classList.add("fa");
    createFirstGraphElementButton.classList.add("fa-plus-circle");
    createFirstGraphElementButton.classList.add("rdf-graph-add-first-node");
    createFirstGraphElementButton.classList.add("fa-lg");
    createFirstGraphElementButton.innerHTML = "Add node";
    jQuery.data(createFirstGraphElementButton, "containing-graph", this);

    $(createFirstGraphElementButton).on("click", function () {
        var dialog = $("#dialog-define-graph-node").dialog(),
            containingGraph = jQuery.data(createFirstGraphElementButton, "containing-graph");

        // we associate a null value to the "node-modified" variable since we want to create a new one
        jQuery.data(dialog[0], "node-modified", null);
        // we also associate the containing graph to the dialog so that we know to which graph to add the element
        jQuery.data(dialog[0], "associated-graph", containingGraph);
        dialog.dialog("open");
    });

    graphMappingCell.classList.add("rdf-graph-mapping-cell");
    graphMappingCell.appendChild(createFirstGraphElementButton);
};

Graph.prototype.setURI = function (newGraphURI) {
    this.graphURI = newGraphURI || "{Enter graph URI}";
    this.graphNameInput = this.graphURI;
};

Graph.prototype.addEmptyRoot = function () {
    //    var rootNode = new RootNode(this.addChild, this),
    //        tableToAdd = rootNode.tableElement;
};

// add a child to the graph (i.e. a root node)
Graph.prototype.addChild = function (child) {

    this.graphRoots.push(child);

    //    $(this.graphTableElement).find(".rdf-graph-add-first-node").hide();
    //    var rootRow = this.rootsTable.insertRow(0),
    //        rootCell = rootRow.insertCell(0);
    //
    //    rootCell.appendChild(root.tableElement);

    $(this.graphMappingCell).find(".rdf-graph-add-first-node").hide();

    this.graphMappingCell.appendChild(child.tableElement);
    // TODO put the node DOM element inside this new cell
};

Graph.prototype.removeChild = function (child) {
    var childIndex = this.graphRoots.indexOf(child),
        initialAddButton = $(".rdf-graph-add-first-node");

    if (childIndex !== -1) {
        this.graphRoots.splice(childIndex, 1);
    }

    // find and remove DOM elements
    $(child.tableElement).remove();

    if (this.graphRoots.length === 0) {
        initialAddButton.show();
    }
};

//    Generic RDF element class
var RDFElement = function (containingElement) {
    this.subElements = [];
    if (typeof containingElement === Graph) {
        this.containingGraph = containingElement;
    } else {
        this.containingGraph = containingElement.containingGraph;
    }
    this.containingElement = containingElement;

    Object.getPrototypeOf(this).addPeer = containingElement.addChild;
    // TODO if not needed - remove
    Object.getPrototypeOf(this).removeSelf = function () {
        this.containingElement.removeChild(this);
    };
    // the addChild method should be initialised specifically for each node
    // or should it? - open up dialog


    var rdfElementTable = document.createElement("table");
    rdfElementTable.classList.add("rdf-element-table");
    this.tableElement = rdfElementTable;


    //    this.htmlRepresentation = ;
};

RDFElement.prototype.addSubElement = function (subElement) {
    this.subElements.push(subElement);
    // add row to parent table here

};

// class representing a property (predicate) from the RDF mapping
var Property = function () {
    //<i class="fa fa-long-arrow-right"></i>
    //{Property}

};

var LiteralNode = function (containingElement, name) {
    //<i class="fa fa-pencil-square-o"></i>
    //{Literal node}
};

var ConstantLiteral = function (containingElement, literalText) {
    //<i class="fa fa-pencil-square-o"></i>
    //{Literal node}
};
ConstantLiteral.prototype = Object.create(LiteralNode.prototype);
ConstantLiteral.prototype.constructor = ConstantLiteral;


var ColumnLiteral = function () {
    //<i class="fa fa-columns"></i>
    //{Column node}

};

// Generic URI node class - structural class used to reason based on the type of node (URI or literal)
var URINode = function (containingElement, prefix, unqualifiedName) {
    //<i class="fa fa-share-alt"></i>
    //{Node}

    RDFElement.call(this, containingElement);

    var uriNodeRow = this.tableElement.insertRow(0),
        uriNodeDataCell = uriNodeRow.insertCell(0),
        uriNodeSubElementsCell = uriNodeRow.insertCell(1),

        uriNodeNameDiv = document.createElement("div"),
        uriNodeQualifiedName = document.createElement("label"),
        uriNodeIcon = document.createElement("i"),

        addNodeSign = document.createElement("i"),
        removeNodeSign = document.createElement("i"),

        foldSubElementsSign = document.createElement("i"),
        unfoldSubElementsSign = document.createElement("i"),

        addFirstSubElementDiv = document.createElement("div"),
        addFirstSubElementSign = document.createElement("i"),
        addFirstSubElementLabel = document.createElement("label"),

        newPropertyLabel = document.createElement("label"),
        newPropertySign = document.createElement("i");

    this.prefix = prefix;
    
    /***************************************/
//    this.column = column;

    uriNodeDataCell.classList.add("rdf-graph-element-representation");

    // TODO Validation - if column is empty - display message or what?


    uriNodeIcon.classList.add("fa");
    uriNodeIcon.classList.add("fa-share-alt");
    //    uriNodeSign.classList.add("fa-lg");

    if (prefix === null) {
        uriNodeQualifiedName.textContent = "(Graph URI):" + unqualifiedName;
    } else if (prefix === "") {
        uriNodeQualifiedName.textContent = ":" + unqualifiedName;
    } else {
        uriNodeQualifiedName.textContent = prefix + ':' + unqualifiedName;
    }

    uriNodeQualifiedName.classList.add("node-name-label");

    uriNodeNameDiv.classList.add("node-div");
    uriNodeNameDiv.appendChild(uriNodeIcon);
    uriNodeNameDiv.appendChild(uriNodeQualifiedName);

    uriNodeDataCell.appendChild(uriNodeNameDiv);

    jQuery.data(uriNodeNameDiv, "node-modified", this);

    $(uriNodeNameDiv).on("click", function () {
        var dialog = $("#dialog-define-graph-node").dialog(),
            nodeModified = jQuery.data(this, "node-modified");

        jQuery.data(dialog[0], "node-modified", nodeModified);
        jQuery.data(dialog[0], "associated-graph", nodeModified.containingGraph);

        dialog.dialog("open");
    });

    // buttons for adding siblings and removing current element

    addNodeSign.classList.add("fa");
    addNodeSign.classList.add("fa-plus");
    addNodeSign.classList.add("rdf-node-add-after-button");

    // association of the add button with the node

    uriNodeDataCell.appendChild(addNodeSign);

    removeNodeSign.classList.add("fa");
    removeNodeSign.classList.add("fa-times");
    removeNodeSign.classList.add("rdf-node-remove-button");
    
    uriNodeDataCell.appendChild(removeNodeSign);
    // association of the remove button with the node
    jQuery.data(removeNodeSign, "associated-element", this);

    // todo make names consistent
    jQuery.data(addNodeSign, "node-modified", this);
    $(addNodeSign).on("click", function () {
        var dialog = $("#dialog-define-graph-node").dialog(),
            nodeModified = jQuery.data(this, "node-modified");

        // we associate a null value to the "node-modified" variable since we want to create a new element
        jQuery.data(dialog[0], "node-modified", null);
        // we also associate the containing graph to the dialog so that we know to which graph to add the element
        jQuery.data(dialog[0], "associated-graph", nodeModified.containingGraph);
        dialog.dialog("open");
    });

    $(removeNodeSign).on("click", function () {
        // open confirmation dialog for this node
        var nodeToRemove = jQuery.data(removeNodeSign, "associated-element"),
            containingGraph = nodeToRemove.containingGraph;

        $("#dialog-confirm").html("Are you sure you want to remove this RDF mapping?");
        $("#dialog-confirm").dialog({
            resizable: false,
            modal: true,
            title: "Confirmation",
            buttons: {
                "Yes": function () {
                    $(this).dialog('close');
                    nodeToRemove.removeSelf();
                },
                "No": function () {
                    $(this).dialog('close');
                }
            }
        });

    });

    foldSubElementsSign.classList.add("fa");
    foldSubElementsSign.classList.add("fa-minus-square-o");
    foldSubElementsSign.classList.add("icon-fold-unfold-subnodes");
    $(foldSubElementsSign).show();

    unfoldSubElementsSign.classList.add("fa");
    unfoldSubElementsSign.classList.add("fa-plus-square-o");
    unfoldSubElementsSign.classList.add("icon-fold-unfold-subnodes");
    $(unfoldSubElementsSign).hide();

    uriNodeDataCell.appendChild(foldSubElementsSign);
    $(foldSubElementsSign).on("click", function () {
        $(this).siblings(".icon-fold-unfold-subnodes").show();
        $(this).hide();
        // hide subnodes
        $(this).parent().siblings(".rdf-graph-element-sub-elements").hide();
    });

    uriNodeDataCell.appendChild(unfoldSubElementsSign);
    $(unfoldSubElementsSign).on("click", function () {
        $(this).hide();
        $(this).siblings(".icon-fold-unfold-subnodes").show();
        // show subnodes
        $(this).parent().siblings(".rdf-graph-element-sub-elements").show();
    });

    addFirstSubElementDiv.classList.add("add-first-element-div");

    addFirstSubElementSign.classList.add("fa");
    addFirstSubElementSign.classList.add("fa-plus-circle");

    addFirstSubElementLabel.textContent = "Add property";

    addFirstSubElementDiv.appendChild(addFirstSubElementSign);
    addFirstSubElementDiv.appendChild(addFirstSubElementLabel);

    uriNodeSubElementsCell.classList.add("rdf-graph-element-sub-elements");
    uriNodeSubElementsCell.appendChild(addFirstSubElementDiv);

};
// inherit from RDFElement
URINode.prototype = Object.create(RDFElement.prototype);
URINode.prototype.constructor = URINode;

var ColumnURI = function (containingElement, prefix, columnName) {
    // call parent constructor
    URINode.call(this, containingElement, prefix, columnName);
    // type-specific class attribute - column
    this.column = columnName;
};
ColumnURI.prototype = Object.create(URINode.prototype);
ColumnURI.prototype.constructor = ColumnURI;

var ConstantURI = function (containingElement, prefix, constantURIText) {
    // call parent constructor
    URINode.call(this, containingElement, prefix, constantURIText);
    // type-specific class attribute - column
    this.constant = constantURIText;
};
ConstantURI.prototype = Object.create(URINode.prototype);
ConstantURI.prototype.constructor = ConstantURI;


var BlankNode = function () {
    //<i class="fa fa-dot-circle-o"></i>
    //{Blank node}
};

// generic literal node

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