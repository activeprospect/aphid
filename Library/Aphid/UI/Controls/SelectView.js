/**
 * class Aphid.UI.Controls.SelectView < Aphid.UI.View
 *
 * # Delegate Methods
 *
 *  * `selectViewSelectionDidChange(selectView, option)` - Called when the
 *    current selection has changed.
 *
 * # Subclassing Notes
 *
 * If you wish to subclass [[Aphid.UI.Controls.SelectView]] instead of
 * wrapping an instance and implementing the delegate pattern, you may also
 * override the following methods:
 *
 *  * `didSelectOption(option)` - Called when the specified option has been
 *    selected.
 *
**/

//= require "SelectViewOption"

Aphid.UI.Controls.SelectView = Aphid.Class.create("Aphid.UI.Controls.SelectView", Aphid.UI.View, {

  // Properties
  selectElement: false,
  widgetElement: false,
  listElement: false,
  hoverElement: false,

  // Private Properties
  _isDragging: false,

  /**
   * Aphid.UI.Controls.SelectView#options -> Array
   *
   * An array of [[Aphid.UI.Controls.SelectViewOption]] instances for each
   * option available for selection.
  **/
  options: false,

  /**
   * Aphid.UI.Controls.SelectView#selectedOption -> [[Aphid.UI.Controls.SelectViewOption]] | false
   *
   * An instance of [[Aphid.UI.Controls.SelectViewOption]] that denotes the
   * currently selected option.
  **/
  selectedOption: false,

  /**
   * Aphid.UI.Controls.SelectView#placeholder -> String | false
   *
   * A string that will be used as the placeholder when no item has been
   * selected.
  **/
  placeholder: false,

  // Initialization ----------------------------------------------------------

  viewDidLoad: function()
  {

    // TODO Internet Explorer 7 is not supported at this time, so return here
    //      and make it use a native widget.
    if (Prototype.Browser.IE7)
      return;

    // Set the <select> element as the selectElement property
    this.set("selectElement", this.element);

    // Overwrite the element property with our new control element
    var element = new Element("div").addClassName("SelectView");
    element.observe('mousedown', this._handleMouseDownEvent.bind(this));
    this.set("element", element);

    // Widget Element
    var widgetElement = new Element("div").addClassName("widget");
    widgetElement.setAttribute("tabindex", 0);
    widgetElement.observe("focus", this._handleFocusEvent.bind(this));
    widgetElement.observe("blur", this._handleBlurEvent.bind(this));
    widgetElement.update(this.get("placeholder"));
    this.set("widgetElement", widgetElement);
    this.element.insert(this.get("widgetElement"));

    // List Element
    var listElement = new Element("ul");
    listElement.addClassName("SelectView");
    listElement.hide();
    this.set("listElement", listElement);
    Element.insert(document.body, this.get("listElement"));

    // Initialize Items from Select Element
    // this._initializeItemsFromSelectElement();
    this._initializeStaticSelectViewOptions();

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
    if (selectedOption && selectedOption.readAttribute("value"))
      this.select(selectedOption.readAttribute("value"));

    // Prevent Text Selection (in Internet Explorer)
    if (Prototype.Browser.IE)
    {
      this.element.onselectstart = function() { return false; };
      this.widgetElement.onselectstart = function() { return false; };
      this.listElement.onselectstart = function() { return false; };
    }
  },

  // Original Select Box -----------------------------------------------------

  /*
   * Aphid.UI.Controls.SelectView#_initializeStaticListViewItems() -> null
   */
  _initializeStaticSelectViewOptions: function()
  {
    var options = this.get("selectElement").childElements().collect(this._initializeStaticSelectViewOption, this);
    this.set("options", options);
  },

  /*
   * Aphid.UI.Controls.SelectView#_initializeStaticSelectViewOption(element) -> null
   */
  _initializeStaticSelectViewOption: function(element)
  {
    var viewClass = element.getData("view-class");
    if (!viewClass) viewClass = "Aphid.UI.Controls.SelectViewOption";

    $L.info("Initializing Option as " + viewClass, this);

    var viewClassImplementation = resolveClassName(viewClass);
    return new viewClassImplementation({ element: element });
  },

  // Options View ------------------------------------------------------------

  displayOptions: function()
  {
    $L.info("displayOptions", this.displayName);

    this.listElement.style.visibility = "hidden";
    this.listElement.show();

    this.listElement.select(".selected").invoke("removeClassName", "selected");

    var selectedItem = this.listElement.down("[data-value='" + this.selectedOption.value + "']");
    var top, left;

    if (selectedItem)
    {
      selectedItem.addClassName("selected");
      this._updateHoverElement(selectedItem);

      var offset = (selectedItem.getHeight() / 2) + selectedItem.positionedOffset().top;
      top = (this.get("element").cumulativeOffset().top - selectedItem.positionedOffset().top) + "px";
      left = this.get("element").cumulativeOffset().left + "px";
    }

    else
    {
      top = this.get("element").cumulativeOffset().top + "px";
      left = this.get("element").cumulativeOffset().left + "px";
    }

    this.listElement.style.top = top;
    this.listElement.style.left = left;
    this.listElement.style.minWidth = this.get("widgetElement").getWidth() + "px";

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
    var selectedOption = this._findOptionWithValue(value);
    if (!selectedOption) return false;

    this.set("selectedOption", selectedOption);
    this.get("widgetElement").update(selectedOption.get("label"));

    // Update Original <select> Box
    var originalOption = this.get("selectElement").select("[value='" + value + "']");
    if (originalOption.length == 1)
    {
      originalOptionElement = originalOption.first();
      originalOptionElement.selected = true;
    }

    // Hide listElement (if visible)
    var listElement = this.get("listElement");
    if (listElement.visible())
    {
      var selectedElement = listElement.down("[data-value='" + selectedOption.get("value") + "']");
      if (selectedElement)
      {
        new Effect.Pulsate(selectedElement, { duration: 0.1, pulses: 1 });
        this.dismissOptions();
      }
      this.get("widgetElement").focus();
    }

    this._didSelectOption(selectedOption);
  },

  /**
   * Aphid.UI.Controls.SelectView#selectIndex(value) -> Boolean
   *
   * - index (Number): the index of the option to be selected
   *
   * Selects the option at the specified index in the list view. Returns true
   * if the selection took place or false if the index was not found.
  **/
  selectIndex: function(index)
  {
    var selectedOption = this.get("options")[index];
    if (Object.isUndefined(selectedOption)) return false;

    $L.info("Selecting option at index " + index + " (" + selectedOption.get("label") + ")", this);

    this.set("selectedOption", selectedOption);
    this.get("widgetElement").update(selectedOption.get("label"));

    // Hide listElement (if visible)
    if (this.get("listElement").visible())
      this.dismissOptions();
  },

  // Select Items ------------------------------------------------------------

  /**
   * Aphid.UI.Controls.SelectView#setOptions(options) -> null
   *
   *  - options (Array): Array of [[Aphid.UI.Controls.SelectViewOption]]
   *    instances
   *
   * Sets the specified options as the options on the SelectView, removing any
   * existing options in the process.
  **/
  setOptions: function(options)
  {
    options = $A(options);

    // Replace Placeholder
    this.get("widgetElement").update(this.get("placeholder"));

    // Clear Selection
    this.set("selectedOption", false);

    $L.info("Setting options to: " + options, this);

    // Ensure that we are only passed instances of Aphid.UI.ListViewItem...
    if (!options.all(this._validateOption))
    {
      $L.error("All options must be instances of Aphid.UI.Controls.SelectViewOption!", this);
      return;
    }

    // Reset Selection, Element and Items
    // this.clearSelection();
    this.get("listElement").update();
    this.options = $A();

    // Add each item to the list
    options.each(this._addOption, this);

    // Setup sorting
    // if (this.items.length > 0 && this.sortingEnabled)
    //   this._setupSorting();

    return options;
  },

  /**
   * Aphid.UI.Controls.SelectView#addOption(option) -> Aphid.UI.Controls.SelectViewOption
   *
   * - option ([[Aphid.UI.Controls.SelectViewOption]]): The option to be added
   *   to the selection list
   *
   * Adds the specified option to the end of the select view.
  **/
  addOption: function(option)
  {
    return this._addOption(option);
  },

  /*
   * Aphid.UI.Controls.SelectView#_addOption(item) -> Aphid.UI.Controls.SelectViewOption
   *
   * - item (Element): The item to be added to the list
   *
   * Internal implementation for adding an item to the list view that bypasses
   * any delegate or callback methods.
   */
  _addOption: function(option)
  {
    // Add Item to items Property
    this.get("options").push(option);

    // Set listView on Item
    option.set("selectView", this);

    // Set the sortIndex property on the item to its index in the items array
    // if (this.get("sortingEnabled"))
    //   item.set("sortIndex", this.get("items").indexOf(item));

    // Add Item View to Subviews
    var listItemElement = option.get("element");
    this.get("listElement").insert(listItemElement);

    // Observe Item
    listItemElement.observe("click", this._handleClickEventOnListItem.bind(this));
    listItemElement.observe("mousemove", this._handleMouseMoveEventOnListItem.bind(this));
    listItemElement.observe("mouseout", this._handleMouseOutEventOnListItem.bind(this));

    return option;
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

    $AppDelegate.mainWindow.preventTextSelection();

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

    $AppDelegate.mainWindow.allowTextSelection();
    document.body.stopObserving("mouseup", this._handleMouseUpEventOnDocumentCached);

    this._isDragging = false;
  },

  _handleClickEventOnListItem: function(event)
  {
    var element = event.element();
    event.stop();

    $L.info("_handleClickEventOnListItem - " + element.outerHTML, this.displayName);

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
    var element;

    // Up Arrow
    if (event.keyCode == 38)
    {
      event.stop();

      if (!this.listElement.visible())
        return this.displayOptions();

      if (this.hoverElement)
        element = this.hoverElement.previous();
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

      if (this.hoverElement)
        element = this.hoverElement.next();
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
   * Aphid.UI.Controls.SelectView#_didSelectOption(option) -> null
   *
   * Performs any internal actions after an option has been selected before
   * calling the `didSelectOption` callback and the `selectViewSelectionDidChange`
   * delegate method.
   */
  _didSelectOption: function(option)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didSelectOption)
      this.didSelectOption(option);

    // Call the selectViewSelectionDidChange method on the delegate, if the
    // delegate has implemented it.
    if (this.delegate && this.delegate.selectViewSelectionDidChange)
      this.delegate.selectViewSelectionDidChange(this, option);
  },

  // -------------------------------------------------------------------------

  /*
   * Aphid.UI.Controls.SelectView#_validateOption(option) -> Boolean
   *
   * - option (Object): the object to be validated
   *
   * Evaluates the passed option and ensures that it meets the requirements
   * for use within a select view.
   */
  _validateOption: function(option)
  {
    return (option instanceof Aphid.UI.Controls.SelectViewOption);
  },

  /*
   * Aphid.UI.Controls.SelectView#_findOptionWithValue(value) -> [[Aphid.UI.Controls.SelectViewOption]]
   *
   * - value (String): the value to be searched for
   *
   * Iterates all options and returns the first that matches the specified
   * value. If no option was found to match the value, false will be returned.
   */
  _findOptionWithValue: function(value)
  {
    return (this.get("options").find(function(option) {
      return option.get("value") == value;
    }) || false);
  }

});
