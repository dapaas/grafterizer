/*jslint node: true */
/*jslint browser: true*/
/*jslint plusplus: true */
/*global $, jQuery, alert, alertInterface, jsedn */
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
    graphNameInput.value = graphURI;
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
        var containingGraph = jQuery.data(this, "containing-graph");
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
        // we also associate the containing graph (as containing element) to the dialog so that we know to which graph to add the element
        jQuery.data(dialog[0], "containing-element", containingGraph);
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


    console.log("CHILD", child);
    console.log("CHILD INDEX", childIndex);
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
    if (containingElement instanceof Graph) {
        this.containingGraph = containingElement;
    } else {
        this.containingGraph = containingElement.containingGraph;
    }
    this.containingElement = containingElement;

    Object.getPrototypeOf(this).addPeer = containingElement.addChild;
    // TODO if not needed - remove
    Object.getPrototypeOf(this).removeSelf = function () {
        console.log("THIS", this);
        console.log("THIS CONTAINING", this.containingElement);
        this.containingElement.removeChild(this);
    };
    // the addChild method should be initialised specifically for each node
    // or should it? - open up dialog


    var rdfElementTable = document.createElement("table");
    rdfElementTable.classList.add("rdf-element-table");
    this.tableElement = rdfElementTable;


    //    this.htmlRepresentation = ;
};

// class representing a property (predicate) from the RDF mapping
var Property = function (containingElement, prefix, propertyName) {

    RDFElement.call(this, containingElement);
    this.propertyName = propertyName;
    this.prefix = prefix;
    var propertyRow = this.tableElement.insertRow(0),
        propertyDataCell = propertyRow.insertCell(0),
        propertySubElementsCell = propertyRow.insertCell(1),

        propertyNameDiv = document.createElement("div"),
        propertyQualifiedName = document.createElement("label"),
        propertyIcon = document.createElement("i"),

        addPropertySign = document.createElement("i"),
        removePropertySign = document.createElement("i"),

        foldSubElementsSign = document.createElement("i"),
        unfoldSubElementsSign = document.createElement("i"),

        addPropertyAssociationDiv = document.createElement("div"),
        addFirstSubElementSign = document.createElement("i"),
        addFirstSubElementLabel = document.createElement("label"),

        newNodeLabel = document.createElement("label"),
        newNodeSign = document.createElement("i");

    propertyDataCell.classList.add("rdf-graph-element-representation");

    propertyIcon.classList.add("fa");
    propertyIcon.classList.add("fa-long-arrow-right");

    propertyQualifiedName.textContent = prefix + ':' + propertyName;
    propertyQualifiedName.classList.add("node-name-label");

    // TODO rename node-div to element-div
    propertyNameDiv.classList.add("element-div");
    propertyNameDiv.appendChild(propertyIcon);
    propertyNameDiv.appendChild(propertyQualifiedName);

    propertyDataCell.appendChild(propertyNameDiv);

    jQuery.data(propertyNameDiv, "element-modified", this);

    $(propertyNameDiv).on("click", function () {
        var dialog = $("#dialog-define-graph-property").dialog(),
            elementModified = jQuery.data(this, "element-modified");

        jQuery.data(dialog[0], "element-modified", elementModified);
        jQuery.data(dialog[0], "containing-element", elementModified.containingElement);

        dialog.dialog("open");
    });

    // buttons for adding siblings and removing current element

    addPropertySign.classList.add("fa");
    addPropertySign.classList.add("fa-plus");
    addPropertySign.classList.add("rdf-node-add-after-button");

    // association of the add button with the node

    propertyDataCell.appendChild(addPropertySign);

    removePropertySign.classList.add("fa");
    removePropertySign.classList.add("fa-times");
    removePropertySign.classList.add("rdf-node-remove-button");

    propertyDataCell.appendChild(removePropertySign);
    // association of the remove button with the node
    jQuery.data(removePropertySign, "containing-element", this);

    // todo make names consistent
    jQuery.data(addPropertySign, "containing-element", this.containingElement);

    $(addPropertySign).on("click", function () {
        var dialog = $("#dialog-define-graph-property").dialog(),
            containingElement = jQuery.data(this, "containing-element");

        // we associate a null value to the "node-modified" variable since we want to create a new element
        jQuery.data(dialog[0], "element-modified", null);
        // we also associate the containing element to the dialog so that we know where to add the new element
        jQuery.data(dialog[0], "containing-element", containingElement);
        dialog.dialog("open");
    });

    $(removePropertySign).on("click", function () {
        // open confirmation dialog for this node
        var nodeToRemove = jQuery.data(removePropertySign, "containing-element");

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

    propertyDataCell.appendChild(foldSubElementsSign);
    $(foldSubElementsSign).on("click", function () {
        $(this).siblings(".icon-fold-unfold-subnodes").show();
        $(this).hide();
        // hide subnodes
        $(this).parent().siblings(".rdf-graph-element-sub-elements").hide();
    });

    propertyDataCell.appendChild(unfoldSubElementsSign);
    $(unfoldSubElementsSign).on("click", function () {
        $(this).hide();
        $(this).siblings(".icon-fold-unfold-subnodes").show();
        // show subnodes
        $(this).parent().siblings(".rdf-graph-element-sub-elements").show();
    });

    // add the first and only sub-element (cannot have more than one object pointed to by a property
    addPropertyAssociationDiv.classList.add("add-first-element-div");
    //containing-element = this
    addFirstSubElementSign.classList.add("fa");
    addFirstSubElementSign.classList.add("fa-plus-circle");

    addFirstSubElementLabel.textContent = "Add node";

    addPropertyAssociationDiv.appendChild(addFirstSubElementSign);
    addPropertyAssociationDiv.appendChild(addFirstSubElementLabel);

    propertySubElementsCell.classList.add("rdf-graph-element-sub-elements");
    propertySubElementsCell.appendChild(addPropertyAssociationDiv);

    // associate this element as a container for any new sub-elements created using this button
    jQuery.data(addPropertyAssociationDiv, "containing-element", this);
    $(addPropertyAssociationDiv).on("click", function () {
        var containingElement = jQuery.data(this, "containing-element"),
            dialog =  $("#dialog-define-graph-node").dialog();

        jQuery.data(dialog[0], "node-modified", null);
        jQuery.data(dialog[0], "containing-element", containingElement);

        dialog.dialog("open");
    });

    this.subElementsCell = propertySubElementsCell;


};
Property.prototype.removeChild = function (child) {
    console.log("removing child");
    var childIndex = this.subElements.indexOf(child),
        initialAddButton = $(".add-property-association-div");

    if (childIndex !== -1) {
        this.subElements.splice(childIndex, 1);
    }

    // find and remove DOM elements
    $(child.tableElement).remove();

    if (this.subElements.length === 0) {
        initialAddButton.show();
    }
};
Property.prototype.addChild = function (child) {

    this.subElements.push(child);

    //    $(this.graphTableElement).find(".rdf-graph-add-first-node").hide();
    //    var rootRow = this.rootsTable.insertRow(0),
    //        rootCell = rootRow.insertCell(0);
    //
    //    rootCell.appendChild(root.tableElement);

    $(this.subElementsCell).find(".add-first-element-div").hide();

    this.subElementsCell.appendChild(child.tableElement);
    // TODO put the node DOM element inside this new cell
    
};


var LiteralNode = function (containingElement, value) {
    RDFElement.call(this, containingElement);
    
    this.literalValue = value;
    
    var literalNodeRow = this.tableElement.insertRow(0),
        literalNodeDataCell = literalNodeRow.insertCell(0),

        literalNodeNameDiv = document.createElement("div"),
        literalNodeName = document.createElement("label"),
        literalNodeIcon = document.createElement("i");
    console.log(this.tableElement);
    literalNodeDataCell.classList.add("rdf-graph-element-representation");

    literalNodeIcon.classList.add("fa");
    literalNodeIcon.classList.add("fa-pencil-square-o");

    literalNodeName.classList.add("node-name-label");
    literalNodeName.textContent = value;

    literalNodeNameDiv.classList.add("element-div");
    literalNodeNameDiv.appendChild(literalNodeIcon);
    literalNodeNameDiv.appendChild(literalNodeName);

    literalNodeDataCell.appendChild(literalNodeNameDiv);
    console.log(literalNodeDataCell);
    // TODO if literal is a root we should be able to add new roots using buttons

};
LiteralNode.prototype = Object.create(LiteralNode.prototype);
LiteralNode.prototype.constructor = LiteralNode;

var ConstantLiteral = function (containingElement, literalText) {
    LiteralNode.call(this, containingElement, literalText);
    //<i class="fa fa-pencil-square-o"></i>
    //{Literal node}
};
ConstantLiteral.prototype = Object.create(LiteralNode.prototype);
ConstantLiteral.prototype.constructor = ConstantLiteral;


var ColumnLiteral = function (containingElement, columnName) {
    LiteralNode.call(this, containingElement, columnName);

};
ColumnLiteral.prototype = Object.create(LiteralNode.prototype);
ColumnLiteral.prototype.constructor = ColumnLiteral;

// Generic URI node class - structural class used to reason based on the type of node (URI or literal)
var URINode = function (containingElement, prefix, unqualifiedName) {
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
    this.value = unqualifiedName;

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

    uriNodeNameDiv.classList.add("element-div");
    uriNodeNameDiv.appendChild(uriNodeIcon);
    uriNodeNameDiv.appendChild(uriNodeQualifiedName);

    uriNodeDataCell.appendChild(uriNodeNameDiv);

    jQuery.data(uriNodeNameDiv, "node-modified", this);

    $(uriNodeNameDiv).on("click", function () {
        var dialog = $("#dialog-define-graph-node").dialog(),
            nodeModified = jQuery.data(this, "node-modified");

        jQuery.data(dialog[0], "node-modified", nodeModified);
        jQuery.data(dialog[0], "containing-element", nodeModified.containingElement);

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
    jQuery.data(addNodeSign, "containing-element", this.containingElement);
    $(addNodeSign).on("click", function () {
        var dialog = $("#dialog-define-graph-node").dialog(),
            containingElement = jQuery.data(this, "containing-element");

        // we associate a null value to the "node-modified" variable since we want to create a new element
        jQuery.data(dialog[0], "node-modified", null);
        // we also associate the containing graph to the dialog so that we know to which graph to add the element
        jQuery.data(dialog[0], "containing-element", containingElement);
        dialog.dialog("open");
    });

    $(removeNodeSign).on("click", function () {
        // open confirmation dialog for this node
        var elementToRemove = jQuery.data(removeNodeSign, "associated-element");

        $("#dialog-confirm").html("Are you sure you want to remove this RDF mapping?");
        $("#dialog-confirm").dialog({
            resizable: false,
            modal: true,
            title: "Confirmation",
            buttons: {
                "Yes": function () {
                    $(this).dialog('close');
                    elementToRemove.removeSelf();
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

    addFirstSubElementDiv.classList.add("add-first-property-div");

    addFirstSubElementSign.classList.add("fa");
    addFirstSubElementSign.classList.add("fa-plus-circle");

    addFirstSubElementLabel.textContent = "Add property";

    addFirstSubElementDiv.appendChild(addFirstSubElementSign);
    addFirstSubElementDiv.appendChild(addFirstSubElementLabel);

    uriNodeSubElementsCell.classList.add("rdf-graph-element-sub-elements");
    uriNodeSubElementsCell.appendChild(addFirstSubElementDiv);

    // associate this element as a container for any new sub-elements created using this button
    jQuery.data(addFirstSubElementDiv, "containing-element", this);
    $(addFirstSubElementDiv).on("click", function () {
        var containingElement = jQuery.data(addFirstSubElementDiv, "containing-element"),
            dialog =  $("#dialog-define-graph-property").dialog();

        // create a new element (indicated to the dialog callback logic by a null value of 'node-modified')
        jQuery.data(dialog[0], "element-modified", null);

        //... as a sub-element of the current element
        jQuery.data(dialog[0], "containing-element", containingElement);

        dialog.dialog("open");

    });
    this.subElementsCell = uriNodeSubElementsCell;

};
URINode.prototype = Object.create(RDFElement.prototype);
URINode.prototype.constructor = URINode;
URINode.prototype.addChild = function (child) {

    this.subElements.push(child);

    //    $(this.graphTableElement).find(".rdf-graph-add-first-node").hide();
    //    var rootRow = this.rootsTable.insertRow(0),
    //        rootCell = rootRow.insertCell(0);
    //
    //    rootCell.appendChild(root.tableElement);

    $(this.subElementsCell).find(".add-first-property-div").hide();

    this.subElementsCell.appendChild(child.tableElement);
    // TODO put the node DOM element inside this new cell
};
URINode.prototype.removeChild = function (child) {
    var childIndex = this.subElements.indexOf(child),
        initialAddButton = $(this.subElementsCell).find(".add-first-property-div");


    console.log("CHILD", child);
    console.log("CHILD INDEX", childIndex);
    if (childIndex !== -1) {
        this.subElements.splice(childIndex, 1);
    }

    // find and remove DOM elements
    $(child.tableElement).remove();

    console.log("this.subElements.length", this.subElements.length);
    if (this.subElements.length === 0) {
        initialAddButton.show();
    }
};

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
        divElement.classList.add("rdf-control-container");

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
