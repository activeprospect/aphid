/**
 * class Aphid.UI.Controls.SegmentedControl < Aphid.UI.Control
 *
 * ### Example
 *
 *     <ul data-view-class="Aphid.UI.Controls.SegmentedControl">
 *       <li>Settings</li>
 *       <li class="selected">Options</li>
 *       <li>Advanced</li>
 *     </ul>
 *
 * #### Delegate Methods
 *
 *  * `selectViewSelectionDidChange(selectView, option)` - Called when the
 *    current selection has changed.
 *
 * #### Subclassing Notes
 *
 * If you wish to subclass [[Aphid.UI.Controls.SelectView]] instead of
 * wrapping an instance and implementing the delegate pattern, you may also
 * override the following methods:
 *
 *  * `didSelectOption(option)` - Called when the specified option has been
 *    selected.
 *
**/

Aphid.UI.Controls.SegmentedControl = Aphid.Class.create("Aphid.UI.Controls.SegmentedControl", Aphid.UI.Control, {

  /**
   * Aphid.UI.Controls.SegmentedControl#segments -> Array
   *
   * An array of segments.
  **/
  segments: false,

  /**
   * Aphid.UI.Controls.SelectView#selectedSegment -> Hash | false
   *
   * The currently selected segment.
  **/
  selectedSegment: false,

  /**
   * Aphid.UI.Controls.SelectView#selectedSegmentIndex -> Number
   *
   * The index of the currently selected segment.
  **/
  selectedSegmentIndex: -1,

  // Initialization ----------------------------------------------------------

  viewDidLoad: function()
  {
    // // Initialize Items from Select Element
    this._initializeStaticSegments();

    // // Select Item
    // var selectedOption = this.selectElement.down("[selected]");
    // if (selectedOption && selectedOption.readAttribute("value"))
    //   this.select(selectedOption.readAttribute("value"));
    // 
    // // Prevent Text Selection (in Internet Explorer)
    // if (Prototype.Browser.IE)
    // {
    //   this.element.onselectstart = function() { return false };
    //   this.widgetElement.onselectstart = function() { return false };
    //   this.listElement.onselectstart = function() { return false };
    // }
  },

  // Original Select Box -----------------------------------------------------

  /*
   * Aphid.UI.Controls.SegmentedControl#_initializeStaticSegments() -> null
   */
  _initializeStaticSegments: function()
  {
    var segments = this.get("element").childElements().collect(this._initializeStaticSegment, this);
    this.set("segments", segments);
  },

  /*
   * Aphid.UI.Controls.SegmentedControl#_initializeStaticSegment(element) -> null
   */
  _initializeStaticSegment: function(element)
  {
    var segment = $H();

    segment.set("title", element.innerHTML);
    segment.set("action", element.getData("action"));
    segment.set("element", element);

    element.store("segment", segment);

    $L.info("Initializing Segment: " + segment.toString(), this);

    if (element.hasClassName("selected"))
    {
      this.selectedSegment = segment;
      this.selectedSegmentIndex = this.get("segments").length + 1;
    }

    return segment;
  },

  // Option Selection --------------------------------------------------------

  /**
   * Aphid.UI.Controls.SegmentedControl#selectSegment(segment) -> Boolean
   *
   * - segment (Hash): the option value to be selected
   *
   * Selects the option in the select view whose value matches the provided
   * value. Returns true if the selection took place or false if the value
   * could not be selected.
  **/
  selectSegment: function(segment)
  {
    segment = this.set("selectedSegment", segment);
    this.set("selectedSegmentIndex", this.get("segments").indexOf(segment));

    // Clear Selection
    this.get("element").select(".selected").invoke("removeClassName", "selected");

    // Select Segment Element
    segment.get("element").addClassName("selected");

    this._didSelectSegment(segment);
  },

  /**
   * Aphid.UI.Controls.SegmentedControl#selectSegmentAtIndex(index) -> Boolean
   *
   * - index (Number): the index of the segment to be selected
   *
   * Selects the option at the specified index in the list view. Returns true
   * if the selection took place or false if the index was not found.
  **/
  selectSegmentAtIndex: function(index)
  {
    var selectedSegment = this.get("segments")[index];
    if (Object.isUndefined(selectedSegment)) return false;

    $L.info("Selecting segment at index " + index + " (" + selectedSegment.get("title") + ")", this);

    this.selectSegment(selectedSegment);
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
  // setSegments: function(options)
  // {
  //   options = $A(options);
  // 
  //   // Replace Placeholder
  //   this.get("widgetElement").update(this.get("placeholder"));
  // 
  //   // Clear Selection
  //   this.set("selectedOption", false);
  // 
  //   $L.info("Setting options to: " + options, this);
  // 
  //   // Ensure that we are only passed instances of Aphid.UI.ListViewItem...
  //   if (!options.all(this._validateOption))
  //   {
  //     $L.error("All options must be instances of Aphid.UI.Controls.SelectViewOption!", this);
  //     return;
  //   }
  // 
  //   // Reset Selection, Element and Items
  //   // this.clearSelection();
  //   this.get("listElement").update();
  //   this.options = $A();
  // 
  //   // Add each item to the list
  //   options.each(this._addOption, this);
  // 
  //   // Setup sorting
  //   // if (this.items.length > 0 && this.sortingEnabled)
  //   //   this._setupSorting();
  // 
  //   return options;
  // },

  /**
   * Aphid.UI.Controls.SelectView#addOption(option) -> Aphid.UI.Controls.SelectViewOption
   *
   * - option ([[Aphid.UI.Controls.SelectViewOption]]): The option to be added
   *   to the selection list
   *
   * Adds the specified option to the end of the select view.
  **/
  // addSegment: function(option)
  // {
  //   return this._addOption(option);
  // },

  /*
   * Aphid.UI.Controls.SelectView#_addOption(item) -> Aphid.UI.Controls.SelectViewOption
   *
   * - item (Element): The item to be added to the list
   *
   * Internal implementation for adding an item to the list view that bypasses
   * any delegate or callback methods.
   */
  // _addOption: function(option)
  // {
  //   // Add Item to items Property
  //   this.get("options").push(option);
  // 
  //   // Select Item
  //   // if (item.get("isSelected"))
  //   // {
  //   //   var itemIndex = this.get("items").indexOf(item);
  //   //   if (!this.get("multipleSelectionEnabled"))
  //   //   {
  //   //     if (this.get("selectedItem"))
  //   //       this._deselectItem(this.get("selectedItem"));
  //   //     this.set("selectedItem", item);
  //   //     this.set("selectedItemIndex", itemIndex);
  //   //   }
  //   //   else
  //   //   {
  //   //     this.get("selectedItems").push(item);
  //   //     this.get("selectedItemIndexes").push(itemIndex);
  //   //   }
  //   // }
  // 
  //   // Set listView on Item
  //   option.set("selectView", this);
  // 
  //   // Set the sortIndex property on the item to its index in the items array
  //   // if (this.get("sortingEnabled"))
  //   //   item.set("sortIndex", this.get("items").indexOf(item));
  // 
  //   // Add Item View to Subviews
  //   var listItemElement = option.toListItemElement();
  //   this.get("listElement").insert(listItemElement);
  // 
  //   // Observe Item
  //   listItemElement.observe("click", this._handleClickEventOnListItem.bind(this));
  //   listItemElement.observe("mousemove", this._handleMouseMoveEventOnListItem.bind(this));
  //   listItemElement.observe("mouseout", this._handleMouseOutEventOnListItem.bind(this));
  // 
  //   return option;
  // },

  // Event Handlers ----------------------------------------------------------

  handleMouseUpEvent: function(event, element)
  {
    if (element.tagName != "LI")
      element = event.findElement("li");
    var segment = element.getStorage().get("segment");
    if (segment)
    {
      this.selectSegment(segment);
      event.stop();
    }
  },

  // -------------------------------------------------------------------------

  /*
   * Aphid.UI.Controls.SegmentedControl#_didSelectSegment(segment) -> null
   *
   * Performs any internal actions after a segment has been selected before
   * calling the `didSelectSegment` callback and the
   * `segmentedControlSelectionDidChange` delegate method.
   */
  _didSelectSegment: function(segment)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didSelectSegment)
      this.didSelectSegment(segment);

    // Call the segmentedControlSelectionDidChange method on the delegate, if the
    // delegate has implemented it.
    this.callDelegateMethod("segmentedControlSelectionDidChange", segment);
  }

});
