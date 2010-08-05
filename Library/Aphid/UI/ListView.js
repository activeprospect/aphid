/**
 * class Aphid.UI.ListView < Aphid.UI.View
 *
 * Manages an HTML unordered list by providing support for selection of the
 * items contained within the list.
 *
 * #### Usage
 *
 * To initialize an instance of [[Aphid.UI.ListView]], you must specify the
 * `data-view-class` attribute on an HTML unordered list element. The value
 * of this attribute should be either [[Aphid.UI.ListView]], for a standard
 * list, or the name of your [[Aphid.UI.ListView]] subclass. For example:
 *
 *     <ul data-outlet="listView" data-view-class="Aphid.UI.ListView">
 *       <li>Inbox</li>
 *       <li>Sent</li>
 *       <li>Trash</li>
 *     </ul>
 *
 * #### Delegate Methods
 *
 *  * `listViewShouldSelectItem(listView, item)` - Called just before the item
 *    selection process begins. Returning false will prevent the selection
 *    from happening.
 *
 *  * `listViewShouldDeselectItem(listView, item)` - Called just before the
 *    item deselection process begins. Returning false will prevent the
 *    deselection from happening.
 *
 *  * `listViewSelectionDidChange(listView, item)` - Called when the current
 *    selection has changed.
 *
 *  * `listViewShouldOpenItem(listView, item)` - Called just before the
 *    item opening process begins. Returning false will prevent the item from
 *    being opened.
 *
 *  * `listViewDidOpenItem(listView, openedItem)` - Called when the user has
 *    requested to open an item, usually by double-clicking on the item.
 *
 *  * `listViewOrderDidChange(listView)` - Called when the sort order has
 *    changed, but not necessarily before the user has finished dragging the
 *    item to its final position.
 *
 *  * `listViewOrderDidUpdate(listView)` - Called after the user
 *    has finished dragging.
 *
 * #### Subclassing Notes
 *
 * If you wish to subclass [[Aphid.UI.ListView]] instead of wrapping an
 * instance and implementing the delegate pattern, you may also override the
 * following methods:
 *
 *  * `shouldSelectItem(item)` - Called just before the item selection process
 *    begins. Returning false will prevent the item from being selected.
 *
 *  * `didSelectItem(item)` - Called when the specified item has been
 *    selected.
 *
 *  * `shouldDeselectItem(item)` - Called just before the item deselection
 *    process begins. Returning false will prevent the item from being
 *    deselected.
 *
 *  * `didDeselectItem(item)` - Called when the specified item has been
 *    deselected.
 *
 *  * `shouldOpenItem(item)` - Called just before the item opening process
 *    begins. Returning false will prevent the item from being opened.
 *
 *  * `didOpenItem(item)` - Called when the specifeid item has been opened.
 *
**/

Aphid.UI.ListView = Class.create(Aphid.UI.View, {

  displayName: false,

  /**
   * Aphid.UI.ListView#items -> Array
   *
   * An array of Elements for each list item that is part of the list.
  **/
  items: false,

  /** related to: Aphid.UI.ListView#selectedItems
   * Aphid.UI.ListView#selectedItem -> Element | false
   *
   * The currently selected list item, or false if no item is currently
   * selected or the list has multiple selection enabled.
  **/
  selectedItem: false,

  /** related to: Aphid.UI.ListView#selectedItem
   * Aphid.UI.ListView#selectedItems -> Array | false
   *
   * The currently selected list items or false if the list has multiple
   * selection disabled.
  **/
  selectedItems: false,

  /**
   * Aphid.UI.ListView#multipleSelectionEnabled -> Boolean
   *
   * If multipleSelectionEnabled is set to true, the list will have multiple
   * selection support applied to it.
  **/
  multipleSelectionEnabled: false,

  /**
   * Aphid.UI.ListView#sortingEnabled -> Boolean
   *
   * If sortingEnabled is set to true, the list will have Sortable applied to
   * it automatically.
  **/
  sortingEnabled: false,

  /**
   * Aphid.UI.ListView#sortableOptions -> Object
   *
   * Options to be passed to the Sortable instance when sorting is enabled.
   * For a list of options, consule the [Sortable documentation](http://wiki.github.com/madrobby/scriptaculous/sortable-create)
   * in the script.aculo.us library. Defaults:
   *
   *     {
   *       handle: "handle",
   *       onChange: this._listViewOrderDidChange.bind(this),
   *       onUpdate: this._listViewOrderDidUpdate.bind(this)
   *     }
  **/
  sortableOptions: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.ListView()
   *
   * Initializes a new instance.
  **/
  initialize: function($super, options)
  {
    this.items = $A();
    this.sortableOptions = {
      handle: "handle",
      onChange: this._listViewOrderDidChange.bind(this),
      onUpdate: this._listViewOrderDidUpdate.bind(this)
    };
    $super(options);
    if (this.multipleSelectionEnabled)
      this.selectedItems = $A();
    else
      this.selectedItems = false;
  },

  viewDidLoad: function($super)
  {
    $super();
    if (this._validateContainer())
    {
      this.element.addClassName('ListView');
      this.setItems(this.element.childElements());
      this.element.observe('click', this.clearSelection.bind(this));
    }
  },

  // Items -------------------------------------------------------------------

  /**
   * Aphid.UI.ListView#setItems(newItems) -> null
   *
   *  - newItems (Array): An array of list item Elements to set on the list
   *
   * Sets the items in the list view to the specified items. Previous items
   * will be removed.
  **/
  setItems: function(newItems)
  {
    if (this.items && this.items.length > 0)
      this.clearSelection();
    this.items = this.element.update().insert(newItems).select('>li:not(.placeholder)');
    if (this.items.length > 0)
    {
      this._initializeItems();
      if (this.sortingEnabled) this._setupSorting();
    }
  },

  /**
   * Aphid.UI.ListView#addItem(item) -> null
   *
   * - item (Element): The item to be added to the list
   *
   * Adds the specified item to the end of the list view.
  **/
  addItem: function(item)
  {
    this.element.insert(item);
    this.items.push(item);
    this._initializeItem(item);
    if (this.sortingEnabled)
      this._setupSorting();
  },

  /*
   * Aphid.UI.ListView#_initializeItems() -> null
   *
   * Calls [[Aphid.UI.ListView#_initializeItem]] for each item.
  **/
  _initializeItems: function()
  {
    this.items.each(this._initializeItem, this);
  },

  /*
   * Aphid.UI.ListView#_initializeItem(item) -> null
   *
   * - item (Element): the item to be initialized
   *
   * Initializes the item by adding observers and sort handles, if enabled.
  **/
  _initializeItem: function(item)
  {
    item.observe('click', this._handleClickEvent.bind(this));
    item.observe('dblclick', this._handleDoubleClickEvent.bind(this));
  },

  // Selection ---------------------------------------------------------------

  /**
   * Aphid.UI.ListView#selectItem(listItem) -> null
   *
   * Selects the specified list item. The list item must be an Element
   * reference to the item to be selected.
  **/
  selectItem: function(item)
  {
    // Ensure that we can select the item...
    if (!this._shouldSelectItem(item))
      return;

    // Clear the previous selection and set the newly selected item, unless
    // multiple selection is enabled.
    if (!this.multipleSelectionEnabled)
    {
      this._clearSelection();
      this.selectedItem = item.addClassName('selected');
    }
    else
    {
      this.selectedItems.push(item.addClassName('selected'));
    }

    this._didSelectItem(item);
  },

  /**
   * Aphid.UI.ListView#deselectItem(listItem) -> null
   *
   * Deselects the specified list item, if it is currently selected. The list
   * item must be an Element reference to the item to be deselected.
  **/
  deselectItem: function(item)
  {
    // Ensure that we can deselect the item...
    if (!this._shouldDeselectItem(item))
      return;

    item.removeClassName('selected');

    if (this.multipleSelectionEnabled)
      this.selectedItems = this.selectedItems.without(item);
    else
      this.selectedItem = false;

    this._didDeselectItem(item);
  },

  /**
   * Aphid.UI.ListView#clearSelection() -> null
   *
   * Clears the currently selected item, if any, leaving the list view in an
   * unselected state.
  **/
  clearSelection: function()
  {
    this._clearSelection();

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, false);
  },

  _clearSelection: function()
  {
    this.items.invoke('removeClassName', 'selected');
    this.selectedItem = false;
    if (this.multipleSelectionEnabled)
      this.selectedItems = $A();
    else
      this.selectedItems = false;
  },

  /**
   * Aphid.UI.ListView#openItem(listItem) -> null
   *
   * Instructs the delegate or subclass that the specified item should be
   * opened or otherwise acted upon. This functionality is implemented by the
   * subclass or delegate and has no behavior by default.
  **/
  openItem: function(item)
  {
    // Ensure that we can open the item...
    if (!this._shouldOpenItem(item))
      return;

    this._didOpenItem(item);
  },

  // Sorting -----------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_setupSorting() -> null
  **/
  _setupSorting: function()
  {
    if (this.element.hasClassName('sortable'))
      Sortable.destroy(this.element);
    else
      this.element.addClassName('sortable');
    this._addDragHandlesToItems();
    this._addOrderedIdentitiesToItems();
    Sortable.create(this.element, this.sortableOptions);
  },

  _addOrderedIdentitiesToItems: function()
  {
    this.items.invoke('identify');
  },

  _addDragHandlesToItems: function()
  {
    this.items.each(this._addDragHandleToItem, this);
  },

  _addDragHandleToItem: function(item)
  {
    if (item.down('div.handle')) return;
    var dragHandle = new Element('div').addClassName('handle');
    item.insert(dragHandle);
  },

  // Call the listViewSelectionDidChange method on the delegate, if the
  // delegate has defined it.
  _listViewOrderDidChange: function()
  {
    $L.info('_listViewOrderDidChange', 'Aphid.UI.ListView');
    if (this.delegate && this.delegate.listViewOrderDidChange)
      this.delegate.listViewOrderDidChange(this);
  },

  _listViewOrderDidUpdate: function()
  {
    $L.info('_listViewOrderDidUpdate', 'Aphid.UI.ListView');
    if (this.delegate && this.delegate.listViewOrderDidUpdate)
      this.delegate.listViewOrderDidUpdate(this);
  },

  // Event Handling ----------------------------------------------------------

  /*
   * Aphid.UI.ListView#_handleClickEvent() -> null
   *
   * Handles "click" events that are triggered by the observer on each item.
  **/
  _handleClickEvent: function(event)
  {
    event.stop();
    var item = event.findElement('li');
    if (this.multipleSelectionEnabled && item.hasClassName('selected'))
      this.deselectItem(item);
    else
      this.selectItem(item);
  },

  /*
   * Aphid.UI.ListView#_handleDoubleClickEvent() -> null
   *
   * Handles "dblclick" events that are triggered by the observer on each item.
  **/
  _handleDoubleClickEvent: function(event)
  {
    event.stop();
    var item = event.findElement('li');
    this.selectItem(item);
    this.openItem(item);
  },

  // Callbacks ---------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_shouldSelectItem(item) -> Boolean
   *
   * Checks for basic conditions that should prevent item selection from
   * occurring, such as the item already being selected. It also evaluates the
   * `shouldSelectItem` callback and the `listViewShouldSelectItem` delegate
   * method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the item should be
   * selected.
  **/
  _shouldSelectItem: function(item)
  {
    var shouldSelect = true;
    if (item == this.selectedItem)
      shouldSelect = false;
    if (this.shouldSelectItem)
      shouldSelect = this.shouldSelectItem(item);
    if (this.delegate && this.delegate.listViewShouldSelectItem)
      shouldSelect = this.delegate.listViewShouldSelectItem(this, item);
    return shouldSelect;
  },

  /*
   * Aphid.UI.ListView#_didSelectItem(item) -> null
   *
   * Performs any internal actions after an item has been selected before
   * calling the `didSelectItem` callback and the `listViewSelectionDidChange`
   * delegate method.
  **/
  _didSelectItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didSelectItem)
      this.didSelectItem(item);

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, item);
  },

  /*
   * Aphid.UI.ListView#_shouldDeselectItem(item) -> Boolean
   *
   * Checks for basic conditions that should prevent item deselection from
   * occurring, such as the item not being selected. It also evaluates the
   * `shouldDeselectItem` callback and the `listViewShouldDeselectItem`
   * delegate method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the item should be
   * deselected.
  **/
  _shouldDeselectItem: function(item)
  {
    var shouldDeselect = true;
    if (this.multipleSelectionEnabled && !this.selectedItems.include(item))
      shouldDeselect = false;
    else if (!this.multipleSelectionEnabled && item != this.selectedItem)
      shouldDeselect = false;
    if (this.shouldDeselectItem)
      shouldDeselect = this.shouldDeselectItem(item);
    if (this.delegate && this.delegate.listViewShouldDeselectItem)
      shouldDeselect = this.delegate.listViewShouldDeselectItem(this, item);
    return shouldDeselect;
  },

  /*
   * Aphid.UI.ListView#_didDeselectItem(item) -> null
   *
   * Performs any internal actions after an item has been deselected before
   * calling the `didDeselectItem` callback and the `listViewSelectionDidChange`
   * delegate method.
  **/
  _didDeselectItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didDeselectItem)
      this.didDeselectItem(item);

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, item);
  },

  /*
   * Aphid.UI.ListView#_shouldOpenItem(item) -> Boolean
   *
   * Checks with the subclass and delegate to see if the item should be
   * opened.
   *
   * Delegates have the final say in whether or not the item should be
   * opened.
  **/
  _shouldOpenItem: function(item)
  {
    var shouldOpen = true;
    if (this.shouldOpenItem)
      shouldOpen = this.shouldOpenItem(item);
    if (this.delegate && this.delegate.listViewShouldOpenItem)
      shouldDeselect = this.delegate.listViewShouldOpenItem(this, item);
    return shouldOpen;
  },

  /*
   * Aphid.UI.ListView#_didOpenItem(item) -> null
   *
   * Performs any internal actions after an item has been opened before
   * calling the `didOpenItem` callback and the `listViewDidOpenItem`
   * delegate method.
  **/
  _didOpenItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didOpenItem)
      this.didOpenItem(item);

    // Call the listViewDidOpenItem method on the delegate, if the delegate
    // has defined it.
    if (this.delegate && this.delegate.listViewDidOpenItem)
      this.delegate.listViewDidOpenItem(this, item);
  },

  // -------------------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_validateContainer() -> Boolean
   *
   * Evaluates the element for this instance to ensure that the element meets
   * all requirements to be used with this class.
  **/
  _validateContainer: function()
  {
    if (this.element.tagName != 'UL')
    {
      $L.error('Container (' + this.element.inspect() + ') is not an Unordered List (<ul>).', 'Aphid.UI.ListView');
      return false;
    }
    return true;
  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.ListView.prototype.initialize.displayName = "Aphid.UI.ListView.initialize";
Aphid.UI.ListView.prototype.setItems.displayName = "Aphid.UI.ListView.setItems";
Aphid.UI.ListView.prototype.addItem.displayName = "Aphid.UI.ListView.addItem";
Aphid.UI.ListView.prototype.selectItem.displayName = "Aphid.UI.ListView.selectItem";
Aphid.UI.ListView.prototype.deselectItem.displayName = "Aphid.UI.ListView.deselectItem";
Aphid.UI.ListView.prototype.clearSelection.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype.openItem.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype._initializeItems.displayName = "Aphid.UI.ListView._initializeItems";
Aphid.UI.ListView.prototype._initializeItem.displayName = "Aphid.UI.ListView._initializeItem";
Aphid.UI.ListView.prototype._setupSorting.displayName = "Aphid.UI.ListView._setupSorting";
Aphid.UI.ListView.prototype._addOrderedIdentitiesToItems.displayName = "Aphid.UI.ListView._addOrderedIdentitiesToItems";
Aphid.UI.ListView.prototype._addDragHandlesToItems.displayName = "Aphid.UI.ListView._addDragHandlesToItems";
Aphid.UI.ListView.prototype._addDragHandleToItem.displayName = "Aphid.UI.ListView._addDragHandleToItem";
Aphid.UI.ListView.prototype._listViewOrderDidChange.displayName = "Aphid.UI.ListView._listViewOrderDidChange";
Aphid.UI.ListView.prototype._listViewOrderDidUpdate.displayName = "Aphid.UI.ListView._listViewOrderDidUpdate";
Aphid.UI.ListView.prototype._handleClickEvent.displayName = "Aphid.UI.ListView._handleClickEvent";
Aphid.UI.ListView.prototype._handleDoubleClickEvent.displayName = "Aphid.UI.ListView.prototype._handleDoubleClickEvent"
Aphid.UI.ListView.prototype._shouldSelectItem.displayName = "Aphid.UI.ListView._shouldSelectItem";
Aphid.UI.ListView.prototype._didSelectItem.displayName = "Aphid.UI.ListView._didSelectItem";
Aphid.UI.ListView.prototype._shouldDeselectItem.displayName = "Aphid.UI.ListView._shouldDeselectItem";
Aphid.UI.ListView.prototype._didDeselectItem.displayName = "Aphid.UI.ListView._didDeselectItem";
Aphid.UI.ListView.prototype._shouldOpenItem.displayName = "Aphid.UI.ListView._shouldOpenItem";
Aphid.UI.ListView.prototype._didOpenItem.displayName = "Aphid.UI.ListView._didOpenItem";
Aphid.UI.ListView.prototype._validateContainer.displayName = "Aphid.UI.ListView._validateContainer";
