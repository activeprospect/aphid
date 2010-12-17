/**
 * class Aphid.UI.Controls.SelectView < Aphid.UI.View
 *
**/

Aphid.UI.Controls.SelectView = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.Controls.SelectView",

  // Properties
  selectElement: false,
  widgetElement: false,
  listElement: false,
  hoverElement: false,

  // Private Properties
  _isDragging: false,

  // Initialization ----------------------------------------------------------

  viewDidLoad: function()
  {

    // TODO Internet Explorer 7 is not supported at this time, so return here
    //      and make it use a native widget.
    if (Prototype.Browser.IE7)
      return;

    // Set the <select> element as the selectElement property
    this.selectElement = this.element;

    // Overwrite the element property with our new control element
    this.element = new Element("div").addClassName("SelectView");
    this.element.observe('mousedown', this._handleMouseDownEvent.bind(this));

    // Widget Element
    this.widgetElement = new Element("div").addClassName("widget");
    this.widgetElement.setAttribute("tabindex", 0);
    this.widgetElement.observe("focus", this._handleFocusEvent.bind(this));
    this.widgetElement.observe("blur", this._handleBlurEvent.bind(this));
    this.element.insert(this.widgetElement);

    // List Element
    this.listElement = new Element("ul");
    this.listElement.addClassName("SelectView");
    this.listElement.hide();
    Element.insert(document.body, this.listElement);

    // Initialize Items from Select Element
    this._initializeItemsFromSelectElement();

    // Replace the Original <select> Element
    this.selectElement.insert({ after: this.element });
    this.selectElement.hide();

    // Observe <select> and relay events to the Aphid.UI.Controls.SelectView
    this.selectElement.observe("change", function(event) {
      var value = event.element().value;
      this.select(value);
    }.bind(this));

    // Select Item
    var selectedOption = this.selectElement.down("[selected]");
    if (selectedOption)
      this.select(selectedOption.readAttribute("value"));
    else
      this.selectIndex(0);

    // Prevent Text Selection (in Internet Explorer)
    if (Prototype.Browser.IE)
    {
      this.element.onselectstart = function() { return false };
      this.widgetElement.onselectstart = function() { return false };
      this.listElement.onselectstart = function() { return false };
    }
  },

  // Original Select Box -----------------------------------------------------

  _initializeItemsFromSelectElement: function()
  {

    // Parse Options
    this._options = this.selectElement.childElements().collect(this._parseOptionElement, this);

    // Add Items to Options List Element
    this._listItems = this._options.collect(this._listItemForOption, this);
    this.listElement.insert(this._listItems);

  },

  _parseOptionElement: function(element)
  {
    return {
      label: element.innerHTML,
      value: element.readAttribute("value")
    };
  },

  _listItemForOption: function(option)
  {
    var listItemElement = new Element("li");
    listItemElement.update(option.label);
    listItemElement.setData("value", option.value);
    listItemElement.observe('click', this._handleClickEventOnListItem.bind(this));
    listItemElement.observe("mousemove", this._handleMouseMoveEventOnListItem.bind(this));
    listItemElement.observe("mouseout", this._handleMouseOutEventOnListItem.bind(this));
    return listItemElement;
  },

  // _validateElement: function()
  // {
  //   if (this.element.tagName != "SELECT")
  //   {
  //     $L.error("Must be initialized with a <select> element", this.displayName);
  //     return false;
  //   }
  //   else if (!Object.isUndefined(this.element.getAttribute("multiple")))
  //   {
  //     $L.error("Select boxes with multiple selection enabled are not supported", this.displayName);
  //     return false;
  //   }
  //   return true;
  // },

  // Options View ------------------------------------------------------------

  displayOptions: function()
  {
    $L.info("displayOptions", this.displayName);

    this.listElement.style.visibility = "hidden";
    this.listElement.show();

    this.listElement.select(".selected").invoke("removeClassName", "selected");
    this.selectedItem = this.listElement.down("[data-value='" + this.selectedOption["value"] + "']");
    this.selectedItem.addClassName("selected");

    var offset = (this.selectedItem.getHeight() / 2) + this.selectedItem.positionedOffset().top;

    this._updateHoverElement(this.selectedItem);
    
    this.listElement.style.top = (this.element.cumulativeOffset().top - this.selectedItem.positionedOffset().top) + "px";
    this.listElement.style.left = this.element.cumulativeOffset().left + "px";
    this.listElement.style.minWidth = this.widgetElement.getWidth() + "px";

    this.listElement.hide();
    this.listElement.style.visibility = "visible";
    this.listElement.appear({ duration: 0.2 });

    this._handleMouseDownEventOnDocumentCached = this._handleMouseDownEventOnDocument.bindAsEventListener(this);
    document.observe("mousedown", this._handleMouseDownEventOnDocumentCached);
  },

  dismissOptions: function()
  {
    $L.info("dismissOptions", this.displayName);
    this.listElement.fade({ duration: 0.2, queue: "end" });
    document.stopObserving("mousedown", this._handleMouseDownEventOnDocumentCached);
  },

  // Option Selection --------------------------------------------------------

  /**
   * Aphid.UI.Controls.SelectView#select(value) -> Boolean
   *
   * - value (String): the option value to be selected
   *
   * Selects the option in the select view whose value matches the provided
   * value. Returns true if the selection took place or false if the value
   * could not be selected.
  **/
  select: function(value)
  {
    var selectedOption = this._options.find(
      function(option)
      {
        return option["value"] == value;
      }
    );
    this.widgetElement.update(selectedOption["label"]);
    this.selectedOption = selectedOption;

    // Update <select> Box
    var originalOption = this.selectElement.select("[value='" + value + "']");
    if (originalOption.length == 1)
    {
      originalOptionElement = originalOption.first();
      originalOptionElement.selected = true;
    }

    // Hide listElement (if visible)
    if (this.listElement.visible())
    {
      var selectedElement = this.listElement.down("[data-value='" + selectedOption["value"] + "']");
      if (selectedElement)
      {
        new Effect.Pulsate(selectedElement, { duration: 0.1, pulses: 1 });
        this.dismissOptions();
      }
      this.widgetElement.focus();
    }
  },

  selectIndex: function(index)
  {
    var selectedOption = this._options[index];
    this.widgetElement.update(selectedOption["label"]);
    this.selectedOption = selectedOption;

    // Hide listElement (if visible)
    if (this.listElement.visible())
      this.dismissOptions();
  },

  // Event Handlers ----------------------------------------------------------

  _handleMouseDownEvent: function(event)
  {
    var element = event.element();
    event.stop();

    $L.info("_handleMouseDownEvent - " + element.outerHTML, this.displayName);

    this.widgetElement.focus();

    // Start Drag Select Timer
    this._isDraggingTimer = setTimeout(function() {
      $L.info("\"Drag to Selection\" enabled...", this.displayName);
      this._isDragging = true;
     }.bind(this), 250);

    if (!this.listElement.visible())
      this.displayOptions();

    this._preventTextSelection();

    this._handleMouseUpEventOnDocumentCached = this._handleMouseUpEventOnDocument.bindAsEventListener(this);
    document.body.observe("mouseup", this._handleMouseUpEventOnDocumentCached);
  },

  _handleMouseDownEventOnDocument: function(event)
  {
    $L.info(event.element().outerHTML, this.displayName);
    event.stop();
    if (!event.element().descendantOf(this.listElement))
      this.dismissOptions();
  },

  _handleMouseUpEventOnDocument: function(event)
  {
    var element = event.element();
    event.stop();

    $L.info("_handleMouseUpEventOnDocument - " + element.outerHTML, this.displayName);

    clearTimeout(this._isDraggingTimer);

    if (this._isDragging)
    {
      var hoveredElement = this.listElement.down(".hover");
      if (hoveredElement)
        this.select(hoveredElement.getData("value"));
      else
        this.dismissOptions();
    }

    this._allowTextSelection();
    document.body.stopObserving("mouseup", this._handleMouseUpEventOnDocumentCached);

    this._isDragging = false;
  },

  _handleClickEventOnListItem: function(event)
  {
    var element = event.element();
    event.stop();

    $L.info("_handleClickEvent - " + element.outerHTML, this.displayName);

    this.select(element.getData("value"));
  },

  _handleMouseMoveEventOnListItem: function(event)
  {
    var element = event.element();
    if (element != this.hoverElement)
      this._updateHoverElement(element);
  },

  _handleMouseOutEventOnListItem: function(event)
  {
    var element = event.element();
    element.removeClassName("hover");
    this.hoverElement = false;
  },

  _handleKeyDownEvent: function(event)
  {
    var selectedValue = false;

    // Up Arrow
    if (event.keyCode == 38)
    {
      event.stop();

      if (!this.listElement.visible())
        return this.displayOptions();

      var element;
      if (this.hoverElement)
        element = this.hoverElement.previous()
      else
        element = this.listElement.childElements().last();

      if (!Object.isUndefined(element))
        this._updateHoverElement(element);

      return;
    }

    // Down Arrow
    else if (event.keyCode == 40)
    {
      event.stop();

      if (!this.listElement.visible())
        return this.displayOptions();

      var element;
      if (this.hoverElement)
        element = this.hoverElement.next()
      else
        element = this.listElement.childElements().first();

      if (!Object.isUndefined(element))
        this._updateHoverElement(element);

      return;
    }

    // Space Bar
    else if (event.keyCode == 32)
    {
      event.stop();

      if (!this.listElement.visible())
        return this.displayOptions();

      if (this.hoverElement)
        selectedValue = this.hoverElement.getData("value");
    }

    // Enter Key
    else if (event.keyCode == 13)
    {
      event.stop();

      if (!this.listElement.visible())
        return this.displayOptions();

      if (this.listElement.visible())
      {
        if (this.hoverElement)
          selectedValue = this.hoverElement.getData("value");
      }
    }

    // Type Ahead Find (a-z, A-Z, 0-9)
    else if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 48 && event.keyCode <= 57))
    {
      if (!this.listElement.visible() && (event.ctrlKey || event.metaKey))
        return;

      event.stop();

      // Find First Matching Item
      var character       = String.fromCharCode(event.keyCode);
      var matchingElement = this.listElement.childElements().find(
        function(element)
        {
          return element.innerHTML[0] == character;
        }
      );

      if (matchingElement)
      {
        if (this.listElement.visible())
          this._updateHoverElement(matchingElement);
        else
          selectedValue = matchingElement.getData("value");
      }
    }

    if (selectedValue)
      this.select(selectedValue);
  },

  _handleFocusEvent: function(event)
  {
    this._handleKeyDownEventCached = this._handleKeyDownEvent.bindAsEventListener(this);
    this.element.observe("keydown", this._handleKeyDownEventCached);
  },

  _handleBlurEvent: function(event)
  {
    this.element.stopObserving("keydown", this._handleKeyDownEventCached);
    this._handleKeyDownEventCached = false;
  },

  _updateHoverElement: function(element)
  {
    if (this.hoverElement) this.hoverElement.removeClassName("hover");
    this.hoverElement = element.addClassName("hover");
  },

  // -------------------------------------------------------------------------

  /*
   * Aphid.UI.Controls.SelectView#_preventTextSelection() -> null
   *
   * Disables any text selection from occurring on the document. Text
   * selection can be re-enabled by calling [[Aphid.UI.Controls.SelectView#_allowTextSelection]].
  **/
  _preventTextSelection: function()
  {
    // document.onselectstart = function() { return false; }
    // this.element.observe('selectstart', function() { window.console.log("Foo"); return false; });
    document.body.setStyle({
      "-webkit-user-select": "none",
      "-moz-user-select": "none"
    });
  },

  /*
   * Aphid.UI.Controls.SelectView#_allowTextSelection() -> null
   *
   * Allows text selection to occur on the document. This is normally called
   * after text selection has been suspended with a previous call to
   * [[Aphid.UI.Controls.SelectView#_preventTextSelection]].
  **/
  _allowTextSelection: function()
  {
    // document.onselectstart = null;
    document.body.setStyle({
      "-webkit-user-select": "auto",
      "-moz-user-select": "auto"
    });
  }

});
