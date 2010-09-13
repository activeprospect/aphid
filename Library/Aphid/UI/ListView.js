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
 * #### Data Source Methods
 *
 *  * `listViewItemCount(listView)` - Should return the number of items
 *    contained within the list view.
 *
 *  * `listViewItemForIndex(listView, index)` - Should return the item to be
 *    displayed at the given index.
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
 *  * `listViewShouldClearSelection(listView)` - Called just before the list
 *    selection clearing process begins. Returning false will prevent the
 *    list selection from being cleared.
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
 *  * `shouldClearSelection()` - Called just before the list selection
 *    clearing process begins. Returning false will prevent the list selection
 *    from being cleared.
 *
 *  * `shouldOpenItem(item)` - Called just before the item opening process
 *    begins. Returning false will prevent the item from being opened.
 *
 *  * `didOpenItem(item)` - Called when the specifeid item has been opened.
 *
**/

Aphid.UI.ListView = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.ListView",

  /**
   * Aphid.UI.ListView#dataSource -> Object | false
   *
   * If a data source is provided for the list view instance, it will be
   * asked for data.
  **/
  dataSource: false,

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

  /** related to: Aphid.UI.ListView#selectedItemIndexes
   * Aphid.UI.ListView#selectedItemIndex -> Number | false
   *
   * The index of the currently selected item (as found in
   * [[Aphid.UI.ListView#items]] or false if no item is currently selected or
   * the list has multiple selection enabled.
  **/
  selectedItemIndex: false,

  /** related to: Aphid.UI.ListView#selectedItemIndex
   * Aphid.UI.ListView#selectedItemIndexes -> Array | false
   *
   * An array containing the indexes of all currently selected items (as found
   * in [[Aphid.UI.ListView#items]]) or false if the list has multiple
   * selection disabled.
  **/
  selectedItemIndexes: false,

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
      onChange: this._listViewOrderDidChange.bind(this),
      onUpdate: this._listViewOrderDidUpdate.bind(this)
    };
    $super(options);
    if (this.multipleSelectionEnabled)
    {
      this.selectedItems = $A();
      this.selectedItemIndexes = $A();
    }
    else
    {
      this.selectedItems = false;
      this.selectedItemIndex = false;
    }
    if (this.dataSource)
      this.reloadData();
  },

  /*
   * Aphid.UI.ListView#_initializeStaticListViewItems() -> null
  **/
  _initializeStaticListViewItems: function()
  {
    var items = this.element.select('>li').collect(
      function(element)
      {
        return new Aphid.UI.ListViewItem({ element: element });
      });
    this.setItems(items);
  },

  viewDidLoad: function($super)
  {
    $super();
    if (this._validateContainer())
    {
      this.element.addClassName('ListView');
      this.element.observe('click', this.clearSelection.bind(this));
      this._initializeStaticListViewItems();
    }
  },

  // Items -------------------------------------------------------------------

  /**
   * Aphid.UI.ListView#setItems(items) -> null
   *
   *  - items (Array): Array of [[Aphid.UI.ListViewItem]] instances
   *
   * Sets the specified items as the items on the ListView, removing any
   * existing items in the process.
  **/
  setItems: function(items)
  {
    // Ensure that we are only passed instances of Aphid.UI.ListViewItem...
    if (!items.all(this._validateItem))
    {
      $L.error("All items must be instances of Aphid.UI.ListViewItem!", "Aphid.UI.ListView");
      return;
    }

    // Reset Selection, Element and Items
    this.clearSelection();
    this.element.update();
    this.items = $A();

    // Add each item to the list
    items.each(this._addItem, this);

    // Setup sorting
    if (this.items.length > 0 && this.sortingEnabled)
      this._setupSorting();

    return items;
  },

  /**
   * Aphid.UI.ListView#addItem(item) -> Aphid.UI.ListViewItem
   *
   * - item (Element): The item to be added to the list
   *
   * Adds the specified item to the end of the list view.
  **/
  // TODO addItem and setItem should not be duplicating logic...
  addItem: function(item)
  {
    this._addItem(item);
    if (this.sortingEnabled)
      this._setupSorting();
    return item;
  },

  /*
   * Aphid.UI.ListView#addItem(item) -> Aphid.UI.ListViewItem
   *
   * - item (Element): The item to be added to the list
   *
   * Internal implementation for adding an item to the list view that bypasses
   * any delegate or callback methods.
  **/
  _addItem: function(item)
  {

    // Add Item to items Property
    this.items.push(item);

    // Select Item
    if (item.isSelected)
    {
      var itemIndex = this.items.indexOf(item);
      if (!this.multipleSelectionEnabled)
      {
        if (this.selectedItem) this._deselectItem(this.selectedItem);
        this.selectedItem = item;
        this.selectedItemIndex = itemIndex;
      }
      else
      {
        this.selectedItems.push(item);
        this.selectedItemIndexes.push(itemIndex);
      }
    }

    // Set listView on Item
    item.listView = this;

    // Set the sortIndex property on the item to its index in the items array
    if (this.sortingEnabled)
      item.sortIndex = this.items.indexOf(item);

    // Add Item View to Subviews
    this.addSubview(item);

    // Observe Item
    this._observeItem(item);

    return item;

  },

  removeItem: function(item)
  {
    if (!this.items.include(item))
    {
      $L.error("Attempted to remove item that is not a part of the list", this.displayName);
      return;
    }
    this.deselectItem(item);
    item.removeFromSuperview();
    this.items.remove(item);
  },

  /*
   * Aphid.UI.ListView#_observeItems() -> null
   *
   * Calls [[Aphid.UI.ListView#_observeItem]] for each item.
  **/
  _observeItems: function()
  {
    this.items.each(this._observeItem, this);
  },

  /*
   * Aphid.UI.ListView#_observeItem(item) -> null
   *
   * - item (Element): the item to be initialized
   *
   * Observes the list view item's element for click events.
  **/
  _observeItem: function(item)
  {
    item.element.observe('click', this._handleClickEvent.bindAsEventListener(this, item));
    item.element.observe('dblclick', this._handleDoubleClickEvent.bindAsEventListener(this, item));
  },

  // Data Source -------------------------------------------------------------

  /**
   * Aphid.UI.ListView#reloadData() -> null
   *
   * Reloads the items in the list view by asking the data source for each of
   * the list view items in the list.
  **/
  reloadData: function()
  {
    var items     = $A();
    var itemCount = this._listViewItemCount();
    for (var i = 0; i < itemCount; i++)
      items.push(this._listViewItemForIndex(i));
    this.setItems(items);
  },

  /*
   * Aphid.UI.ListView#_listViewItemCount() -> null
   *
   * Proxy method that returns the list view item count as defined by the
   * dataSource. If the object set as the dataSource has not implemented the
   * `listViewItemCount` method, an error will be raised.
  **/
  _listViewItemCount: function()
  {
    var listViewItemCount = 0;
    if (this.dataSource && this.dataSource.listViewItemCount)
      listViewItemCount = this.dataSource.listViewItemCount(this);
    else
      $L.error('Data source does not implement required method "listViewItemCount(listView)"', this.displayName);
    return listViewItemCount;
  },

  /*
   * Aphid.UI.ListView#_listViewItemForIndex(index) -> null
   *
   * Proxy method that returns the list view item for the specified index as
   * returned by the dataSource. If the object set as the dataSource has not
   * implemented the `listViewItemForIndex` method, an error will be raised.
  **/
  _listViewItemForIndex: function(index)
  {
    var listViewItem;
    if (this.dataSource && this.dataSource.listViewItemForIndex)
      listViewItem = this.dataSource.listViewItemForIndex(this, index);
    else
      $L.error('Data source does not implement required method "listViewItemForIndex(listView, index)"', this.displayName);
    return listViewItem;
  },

  // Selection ---------------------------------------------------------------

  /**
   * Aphid.UI.ListView#selectItem(item) -> Boolean
   *
   * - item ([[Aphid.UI.ListViewItem]]): the list view item to select
   *
   * Selects the specified list item. Returns true if the item was selected or
   * false if no action was performed.
  **/
  selectItem: function(item)
  {
    // Ensure that we can select the item...
    if (!this._shouldSelectItem(item))
      return false;

    // Get the index of the selected item
    var index = this.items.indexOf(item);

    // Clear the previous selection and set the newly selected item, unless
    // multiple selection is enabled.
    if (!this.multipleSelectionEnabled)
    {
      this._clearSelection();
      this.selectedItem = item.select();
      this.selectedItemIndex = index;
      this.scrollToSelectedItem();
    }
    else
    {
      this.selectedItems.push(item.select());
      this.selectedItemIndexes.push(index);
    }

    this._didSelectItem(item);

    return true;
  },

  /**
   * Aphid.UI.ListView#selectItemAtIndex(index) -> Boolean
   *
   * - index (Number): the index of the list view item to select
   *
   * Selects the list item at the specified index. Returns true if the item
   * was selected or false if no action was performed.
  **/
  selectItemAtIndex: function(index)
  {
    var item = this.items[index];
    return this.selectItem(item);
  },

  /**
   * Aphid.UI.ListView#deselectItem(item) -> Boolean
   *
   * - item ([[Aphid.UI.ListViewItem]]): the list view item to deselect
   *
   * Deselects the specified list view item, if it is currently selected.
   * Returns true if the item was deselected or false if no action was
   * performed.
  **/
  deselectItem: function(item)
  {
    if (!this._shouldDeselectItem(item))
      return false;
    this._deselectItem(item);
    this._didDeselectItem(item);
    return true;
  },

  /**
   * Aphid.UI.ListView#deselectItemAtIndex(index) -> Boolean
   *
   * - index (Number): the index of the list view item to deselect
   *
   * Deselects the list view item at the specified index, if it is currently
   * selected. Returns true if the item was deselected or false if no action
   * was performed.
  **/
  deselectItemAtIndex: function(index)
  {
    var item = this.items[index];
    return this.deselectItem(item);
  },

  /*
   * Aphid.UI.ListView#_deselectItem(listItem) -> null
   *
   * Internal implementation for deselecting the specified list item without
   * calling any of the delegate or callback methods.
  **/
  _deselectItem: function(item)
  {
    // Get the index of the item
    var index = this.items.indexOf(item);

    // Deselect the item
    item.deselect();

    // Clear the selection state
    if (this.multipleSelectionEnabled)
    {
      this.selectedItems = this.selectedItems.without(item);
      this.selectedItemIndexes = this.selectedItemIndexes.without(index);
    }
    else
    {
      this.selectedItem = false;
      this.selectedItemIndex = false;
    }
  },

  /**
   * Aphid.UI.ListView#clearSelection() -> null
   *
   * Clears the currently selected item, if any, leaving the list view in an
   * unselected state.
  **/
  clearSelection: function()
  {
    if (!this._shouldClearSelection())
      return;

    this._clearSelection();

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, false);
  },

  _clearSelection: function()
  {
    if (this.items)
      this.items.invoke('deselect');
    if (this.selectedItem)
    {
      this.selectedItem = false;
      this.selectedItemIndex = false;
    }
    if (this.multipleSelectionEnabled)
    {
      this.selectedItems = $A();
      this.selectedItemIndexes = $A();
    }
    else
    {
      this.selectedItems = false;
      this.selectedItemIndexes = false;
    }
  },

  /**
   * Aphid.UI.ListView#openItem(item) -> null
   *
   * - item ([[Aphid.UI.ListViewItem]]): the list view item to be opened
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

  /**
   * Aphid.UI.ListView#openItemAtIndex(index) -> null
   *
   * - index (Number): the index of the list view item to be opened
   *
   * Instructs the delegate or subclass that the specified item should be
   * opened or otherwise acted upon. This functionality is implemented by the
   * subclass or delegate and has no behavior by default.
  **/
  openItemAtIndex: function(index)
  {
    var item = this.items[itemIndex];
    return this.openItem(item);
  },

  /**
   * Aphid.UI.ListView#scrollToSelectedItem() -> Boolean
   *
   * Scrolls the list view to fully expose the selected item if it is not
   * fully visible within the list view. Returns true or false depending on
   * whether the scroll was performed.
  **/
  scrollToSelectedItem: function()
  {
    if (this.element.scrollHeight < this.element.getHeight())
      return;

    var selectedItemTop     = this.selectedItem.element.cumulativeOffset().top - this.element.cumulativeOffset().top;
    var selectedItemBottom  = selectedItemTop + this.selectedItem.element.getHeight();
    var currentScrollTop    = this.element.scrollTop;
    var currentScrollBottom = this.element.scrollTop + this.element.getHeight();
    var itemTopMargin       = parseInt(this.selectedItem.element.getStyle("margin-top"));
    var itemBottomMargin    = parseInt(this.selectedItem.element.getStyle("margin-bottom"));
    var scrollTo            = selectedItemTop - itemTopMargin;
    var shouldScroll        = false;

    // selectedItem is above current scroll position
    if (selectedItemTop < currentScrollTop)
      shouldScroll = true;

    // selectedItem is below current, viewable scroll position
    if (selectedItemTop >= currentScrollBottom)
      shouldScroll = true;

    // selectedItem is partially visible below the current, viewable scroll position
    else if (selectedItemBottom > currentScrollBottom)
    {
      shouldScroll = true;
      scrollTo = currentScrollTop + (selectedItemBottom - currentScrollBottom) + itemBottomMargin;
    }

    if (shouldScroll)
      this.element.scrollTop = scrollTo;

    return shouldScroll;
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
    this._addOrderedIdentitiesToItems();
    Sortable.create(this.element, this.sortableOptions);
  },

  _addOrderedIdentitiesToItems: function()
  {
    this.items.each(function(item) { item.element.identify() });
  },

  // Call the listViewOrderDidChange method on the delegate, if the
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
    this._updateSortIndexes();
    if (this.delegate && this.delegate.listViewOrderDidUpdate)
      this.delegate.listViewOrderDidUpdate(this);
  },

  _updateSortIndexes: function()
  {
    var sequence = Sortable.sequence(this.element);
    sequence.each(
      function(seq, index)
      {
        var item = this.items.find(
          function(item)
          {
            return item.element.identify().endsWith("_" + seq);
          }
        );
        item.sortIndex = index;
      }.bind(this)
    );
    this.items.sort(function(a, b) { return a.sortIndex - b.sortIndex; });
  },

  // Event Handling ----------------------------------------------------------

  /*
   * Aphid.UI.ListView#_handleClickEvent() -> null
   *
   * Handles "click" events that are triggered by the observer on each item.
  **/
  _handleClickEvent: function(event, item)
  {
    event.stop();

    if (this.multipleSelectionEnabled && item.isSelected)
      this.deselectItem(item);
    else
      this.selectItem(item);
  },

  /*
   * Aphid.UI.ListView#_handleDoubleClickEvent() -> null
   *
   * Handles "dblclick" events that are triggered by the observer on each item.
  **/
  _handleDoubleClickEvent: function(event, item)
  {
    event.stop();
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
   * Aphid.UI.ListView#_shouldClearSelection(item) -> Boolean
   *
   * Checks for basic conditions that should prevent the selection from being
   * cleared, such as when no items are currently selected. It also evaluates
   * the `shouldClearSelection` callback and the `listViewShouldClearSelection`
   * delegate method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the list selection should
   * be cleared.
  **/
  _shouldClearSelection: function()
  {
    var shouldClearSelection = true;
    if (this.multipleSelectionEnabled && this.selectedItems.length == 0)
      shouldClearSelection = false;
    else if (!this.multipleSelectionEnabled && !this.selectedItem)
      shouldClearSelection = false;
    if (this.shouldClearSelection)
      shouldClearSelection = this.shouldClearSelection();
    if (this.delegate && this.delegate.listViewShouldClearSelection)
      shouldClearSelection = this.delegate.listViewShouldClearSelection(this);
    return shouldClearSelection;
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
  },

  _validateItem: function(item)
  {
    return (item instanceof Aphid.UI.ListViewItem);
  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.ListView.prototype.initialize.displayName = "Aphid.UI.ListView.initialize";
Aphid.UI.ListView.prototype.setItems.displayName = "Aphid.UI.ListView.setItems";
Aphid.UI.ListView.prototype.addItem.displayName = "Aphid.UI.ListView.addItem";
Aphid.UI.ListView.prototype.selectItem.displayName = "Aphid.UI.ListView.selectItem";
Aphid.UI.ListView.prototype.selectItemAtIndex.displayName = "Aphid.UI.ListView.selectItemAtIndex";
Aphid.UI.ListView.prototype.deselectItem.displayName = "Aphid.UI.ListView.deselectItem";
Aphid.UI.ListView.prototype.deselectItemAtIndex.displayName = "Aphid.UI.ListView.deselectItemAtIndex";
Aphid.UI.ListView.prototype.clearSelection.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype.openItem.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype._observeItems.displayName = "Aphid.UI.ListView._observeItems";
Aphid.UI.ListView.prototype._observeItem.displayName = "Aphid.UI.ListView._observeItem";
Aphid.UI.ListView.prototype._setupSorting.displayName = "Aphid.UI.ListView._setupSorting";
Aphid.UI.ListView.prototype._addOrderedIdentitiesToItems.displayName = "Aphid.UI.ListView._addOrderedIdentitiesToItems";
Aphid.UI.ListView.prototype._listViewOrderDidChange.displayName = "Aphid.UI.ListView._listViewOrderDidChange";
Aphid.UI.ListView.prototype._listViewOrderDidUpdate.displayName = "Aphid.UI.ListView._listViewOrderDidUpdate";
Aphid.UI.ListView.prototype._handleClickEvent.displayName = "Aphid.UI.ListView._handleClickEvent";
Aphid.UI.ListView.prototype._handleDoubleClickEvent.displayName = "Aphid.UI.ListView.prototype._handleDoubleClickEvent"
Aphid.UI.ListView.prototype._shouldSelectItem.displayName = "Aphid.UI.ListView._shouldSelectItem";
Aphid.UI.ListView.prototype._didSelectItem.displayName = "Aphid.UI.ListView._didSelectItem";
Aphid.UI.ListView.prototype._shouldDeselectItem.displayName = "Aphid.UI.ListView._shouldDeselectItem";
Aphid.UI.ListView.prototype._didDeselectItem.displayName = "Aphid.UI.ListView._didDeselectItem";
Aphid.UI.ListView.prototype._shouldClearSelection.displayName = "Aphid.UI.ListView._shouldClearSelection"
Aphid.UI.ListView.prototype._shouldOpenItem.displayName = "Aphid.UI.ListView._shouldOpenItem";
Aphid.UI.ListView.prototype._didOpenItem.displayName = "Aphid.UI.ListView._didOpenItem";
Aphid.UI.ListView.prototype._validateContainer.displayName = "Aphid.UI.ListView._validateContainer";
Aphid.UI.ListView.prototype._validateItem.displayName = "Aphid.UI.ListView._validateItem";
