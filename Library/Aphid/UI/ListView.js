/**
 * class Aphid.UI.ListView < Aphid.UI.View
 *
 * Manages an HTML unordered list by providing support for selection of the
 * items contained within the list.
 *
 * # Usage
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
 * # Data Source Methods
 *
 *  * `listViewItemCount(listView)` - Should return the number of items
 *    contained within the list view.
 *
 *  * `listViewItemForIndex(listView, index)` - Should return the item to be
 *    displayed at the given index.
 *
 * # Delegate Methods
 *
 *  * `listViewShouldSelectItem(listView, item)` - Called just before the item
 *    selection process begins. Returning false will prevent the selection
 *    from happening.
 *
 *  * `listViewWillSelectItem(listView, item)` — Called just before the
 *    specified item will be selected.
 *
 *  * `listViewDidSelectItem(listView, item)` - Called when the current
 *    selection has changed.
 *
 *  * `listViewShouldDeselectItem(listView, item)` - Called just before the
 *    item deselection process begins. Returning false will prevent the
 *    deselection from happening.
 *
 *  * `listViewWillDeselectItem(listView, item)` — Called just before the
 *    specified item will be selected.
 *
 *  * `listViewSelectionDidChange(listView, item)` - Called when the current
 *    selection has changed.
 *
 *  * `listViewShouldClearSelection(listView)` - Called just before the list
 *    selection clearing process begins. Returning false will prevent the
 *    list selection from being cleared.
 *
 *  * `listViewWillClearSelection(listView)` — Called just before the
 *    selection is cleared.
 *
 *  * `listViewShouldOpenItem(listView, item)` - Called just before the
 *    item opening process begins. Returning false will prevent the item from
 *    being opened.
 *
 *  * `listViewWillOpenItem(listView, item)` — Called just before the
 *    specified item will be opened.
 *
 *  * `listViewDidOpenItem(listView, item)` - Called when the user has
 *    requested to open an item, usually by double-clicking on the item.
 *
 *  * `listViewShouldRemoveItem(listView, item)` — Called just before the
 *    item removal process begins. Returning false will prevent the item from
 *    being removed.
 *
 *  * `listViewWillRemoveItem(listView, item)` — Called just before the
 *    specified item will be removed.
 *
 *  * `listViewDidRemoveItem(listView, item)` - Called when the item has been
 *    removed.
 *
 *  * `listViewOrderDidChange(listView)` - Called when the sort order has
 *    changed, but not necessarily before the user has finished dragging the
 *    item to its final position.
 *
 *  * `listViewOrderDidUpdate(listView)` - Called after the user
 *    has finished dragging.
 *
 *
 * # Subclassing Notes
 *
 * If you wish to subclass [[Aphid.UI.ListView]] instead of wrapping an
 * instance and implementing the delegate pattern, you may also override the
 * following methods:
 *
 *  * `shouldSelectItem(item)` - Called just before the item selection process
 *    begins. Returning false will prevent the item from being selected.
 *
 *  * `willSelectItem(item)` — Called just before the specified item will be
 *    selected.
 *
 *  * `didSelectItem(item)` - Called when the specified item has been
 *    selected.
 *
 *  * `shouldDeselectItem(item)` - Called just before the item deselection
 *    process begins. Returning false will prevent the item from being
 *    deselected.
 *
 *  * `willDeselectItem(item)` — Called just before the specified item will be
 *    deselected.
 *
 *  * `didDeselectItem(item)` - Called when the specified item has been
 *    deselected.
 *
 *  * `shouldClearSelection()` - Called just before the list selection
 *    clearing process begins. Returning false will prevent the list selection
 *    from being cleared.
 *
 *  * `willClearSelection()` — Called just before the selection will be
 *    cleared.
 *
 *  * `didClearSelection()` — Called when the selection has been cleared.
 *
 *  * `shouldOpenItem(item)` - Called just before the item opening process
 *    begins. Returning false will prevent the item from being opened.
 *
 *  * `willOpenItem(item)` — Called just before the specified item will be
 *    opened.
 *
 *  * `didOpenItem(item)` - Called when the specified item has been opened.
 *
 *  * `shouldRemoveItem(item)` — Called before the specified item is to be
 *    removed. Returning false from this method will prevent the operation
 *    from taking place.
 *
 *  * `willRemoveItem(item)` — Called just before the specified item will be
 *    removed.
 *
 *  * `didRemoveItem(item)` — Called after the specified item has been removed.
 *    You might implement your application logic to remove the item in this
 *    callback method.
 *
**/

Aphid.UI.ListView = Aphid.Class.create("Aphid.UI.ListView", Aphid.UI.View, {

  /**
   * Aphid.UI.ListView#tagName -> String
   *
   * The required element tag name.
  **/
  tagName: "ul",

  /**
   * Aphid.UI.ListView#itemViewClass -> String
   *
   * The default base class.
  **/
  itemViewClass: "Aphid.UI.ListViewItem",

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
   * Aphid.UI.ListView#persistSelectedItem -> Boolean
   *
   * If persistSelectedItem is *true* the selected item will be persisted as a
   * cookie and the persisted selection will be re-applied on page reloads.
   * The default value is *false*.
  **/
  persistSelectedItem: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.ListView()
   *
   * Initializes a new instance.
  **/
  initialize: function($super, options)
  {
    this.items = $A();
    this.selectedItems = $A();
    this.selectedItemIndexes = $A();
    this.selectedItemIndex = false;

    $super(options);
  },

  /*
   * Aphid.UI.ListView#_initializeStaticListViewItems() -> null
   */
  _initializeStaticListViewItems: function()
  {
    var items = this.get("element").select(">li").collect(this._initializeStaticListViewItem, this);
    this.set("items", items);
  },

  /*
   * Aphid.UI.ListView#_initializeStaticListViewItem(element) -> null
   */
  _initializeStaticListViewItem: function(element)
  {
    var viewClass = element.getData("view-class");
    if (!viewClass) viewClass = this.get("itemViewClass");

    $L.debug("Initializing static list element (" + element.outerHTML + ") as an instance of " + viewClass + " ...", this);

    var viewClassImplementation = resolveClassName(viewClass);
    var viewClassInstance = new viewClassImplementation({ element: element });
    viewClassInstance.get("element").setData("item", viewClassInstance);

    return viewClassInstance;
  },

  viewDidLoad: function($super)
  {
    if (this._validateContainer())
    {
      if (this.dataSource && this.dataSource.listViewItemCount && this.dataSource.listViewItemForIndex)
        this.reloadData();
      else
        this._initializeStaticListViewItems();
      if (this.get("persistSelectedItem"))
        this._restoreSelection();
    }
    $super();
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
    if (!items.all(this._validateItem, this))
    {
      $L.error("Unable to set items as all items must be instances of " + this.get("itemViewClass") + "!", this);
      return;
    }

    // Clear existing items out of the list
    this._clearSelection();
    this.items.invoke("removeFromSuperview");
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
  addItem: function(item)
  {
    this._addItem(item);
    if (this.sortingEnabled)
      this._setupSorting();
    return item;
  },

  /*
   * Aphid.UI.ListView#_addItem(item) -> Aphid.UI.ListViewItem
   *
   * - item (Element): The item to be added to the list
   *
   * Internal implementation for adding an item to the list view that bypasses
   * any delegate or callback methods.
   */
  _addItem: function(item)
  {
    // Add Item to items Property
    this.get("items").push(item);

    // Select Item
    if (item.get("isSelected"))
    {
      var itemIndex = this.get("items").indexOf(item);
      if (!this.get("multipleSelectionEnabled"))
      {
        if (this.get("selectedItem"))
          this._deselectItem(this.get("selectedItem"));
        this.set("selectedItem", item);
        this.set("selectedItemIndex", itemIndex);
      }
      else
      {
        this.get("selectedItems").push(item);
        this.get("selectedItemIndexes").push(itemIndex);
      }
    }

    // Reference Item on Element
    item.get("element").getStorage().set("item", item);

    // Set listView on Item
    item.set("listView", this);

    // Set the sortIndex property on the item to its index in the items array
    if (this.get("sortingEnabled"))
      item.set("sortIndex", this.get("items").indexOf(item));

    // Add Item View to Subviews
    this.addSubview(item);

    return item;
  },

  // Data Source -------------------------------------------------------------

  /**
   * Aphid.UI.ListView#reloadData() -> null
   *
   * Reloads the items in the list view by asking the data source for each of
   * the list view items in the list.
   *
   * **Note:** When reloading data and items have been removed during the
   * reload, the callback and delegate methods will not be notified or
   * consulted for the removed items.
  **/
  reloadData: function()
  {
    var newItems = $A();
    var newItemCount = this._listViewItemCount();
    for (var i = 0; i < newItemCount; i++)
      newItems.push(this._listViewItemForIndex(i));

    // Removed Items
    var removedItems = this.get("items").reject(function(existingItem) {
      return newItems.include(existingItem);
    }, this);
    removedItems.each(function(removedItem) {
      this._removeItem(removedItem);
    }, this);

    // Add New Items
    newItems.each(function(newItem) {
      if (!this.get("items").include(newItem))
        this._addItem(newItem);
    }, this);

    // Setup sorting
    if (this.get("items").length > 0 && this.get("sortingEnabled"))
      this._setupSorting();
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
    if (this.get("dataSource") && Object.isFunction(this.get("dataSource").listViewItemCount))
      listViewItemCount = this.get("dataSource").listViewItemCount(this);
    else
    {
      $L.warn('Data source does not implement required method "listViewItemCount(listView)"', this);
      listViewItemCount = this.get("items").length;
    }
    return listViewItemCount;
  },

  /*
   * Aphid.UI.ListView#_listViewItemForIndex(index) -> null
   *
   * Proxy method that returns the list view item for the specified index as
   * returned by the dataSource. If the object set as the dataSource has not
   * implemented the `listViewItemForIndex` method, an error will be raised.
   */
  _listViewItemForIndex: function(index)
  {
    var listViewItem;
    if (this.get("dataSource") && Object.isFunction(this.get("dataSource").listViewItemForIndex))
      listViewItem = this.get("dataSource").listViewItemForIndex(this, index);
    else
    {
      $L.warn('Data source does not implement required method "listViewItemForIndex(listView, index)"', this);
      listViewItem = this.get("items")[index];
    }
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
    if (!this._shouldSelectItem(item)) return false;
    this._willSelectItem(item);

    // Get the index of the selected item
    var index = this.get("items").indexOf(item);

    // Clear the previous selection and set the newly selected item, unless
    // multiple selection is enabled.
    if (!this.get("multipleSelectionEnabled"))
    {
      this._clearSelection();
      this.set("selectedItem", item.select());
      this.set("selectedItemIndex", index);
      this.scrollToSelectedItem();
    }
    else
    {
      this.get("selectedItems").push(item.select());
      this.get("selectedItemIndexes").push(index);
    }

    this._didSelectItem(item);

    if (this.get("persistSelectedItem"))
      this._persistSelection();

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
    var item = this.get("items")[index];
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
    var item = this.get("items")[index];
    return this.deselectItem(item);
  },

  /*
   * Aphid.UI.ListView#_deselectItem(listItem) -> null
   *
   * Internal implementation for deselecting the specified list item without
   * calling any of the delegate or callback methods.
   */
  _deselectItem: function(item)
  {
    // Get the index of the item
    var index = this.get("items").indexOf(item);

    // Deselect the item
    item.deselect();

    // Clear the selection state
    if (this.get("multipleSelectionEnabled"))
    {
      this.set("selectedItems", this.selectedItems.without(item));
      this.set("selectedItemIndexes", this.selectedItemIndexes.without(index));
    }
    else
    {
      this.set("selectedItem", false);
      this.set("selectedItemIndex", false);
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

    this._willClearSelection();
    this._clearSelection();
    this._didClearSelection();
  },

  /*
   * Aphid.UI.ListView#_clearSelection() -> null
   *
   * Internal implementation of [[Aphid.UI.ListView#clearSelection]] that
   * handles the core logic of clearing the selection.
   */
  _clearSelection: function()
  {
    if (this.get("selectedItem"))
    {
      this.get("selectedItem").deselect();
      this.set("selectedItem", false);
      this.set("selectedItemIndex", false);
    }
    if (this.get("multipleSelectionEnabled"))
    {
      this.get("selectedItems").invoke("deselect");
      this.set("selectedItems", $A());
      this.set("selectedItemIndexes", $A());
    }
    else
    {
      this.set("selectedItems", false);
      this.set("selectedItemIndexes", false);
    }
    if (this.get("persistSelectedItem"))
      this._persistSelection();
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

    this._willOpenItem(item);
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
    var item = this.get("items")[itemIndex];
    return this.openItem(item);
  },

  /**
   * Aphid.UI.ListView#removeItem(item[, force = false]) -> null
   *
   * - item ([[Aphid.UI.ListViewItem]]): the list view item to be removed
   * - force (Boolean): if force is true, the listViewShouldRemoveItem delegate
   *   method and shouldRemoveItem callback will not be consulted before
   *   removing.
   *
   * Instructs the delegate or subclass that the specified item should be
   * removed. This functionality is implemented by the subclass or delegate
   * and has no behavior by default.
  **/
  removeItem: function(item, force)
  {
    if (Object.isUndefined(force))
      force = false;

    if (!force && !this._shouldRemoveItem(item))
      return;

    this._willRemoveItem(item);
    this._removeItem(item);
    this._didRemoveItem(item);
  },

  /*
   * Aphid.UI.ListView#_removeItem(item) -> null
   *
   * - item ([[Aphid.UI.ListViewItem]]): the list view item to be removed
   *
   * This is the internal implementation of the public removeItem method that
   * simply performs the action without checking with or notifying any
   * delegate or callback methods. See [[Aphid.UI.ListView#removeItem]] for
   * more details.
   */
  _removeItem: function(item, force)
  {
    this.deselectItem(item);
    item.removeFromSuperview();
    this.get("items").remove(item);
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
    var scrollElement = this.get("element");
    if (scrollElement.scrollHeight < scrollElement.getHeight() && scrollElement.scrollWidth < scrollElement.getWidth())
      return;

    var selectedItemTop     = this.get("selectedItem.element").cumulativeOffset().top - scrollElement.cumulativeOffset().top;
    var selectedItemBottom  = selectedItemTop + this.get("selectedItem.element").getHeight();
    var selectedItemLeft    = this.get("selectedItem.element").cumulativeOffset().left - scrollElement.cumulativeOffset().left;
    var selectedItemRight   = selectedItemLeft + this.get("selectedItem.element").getWidth();
    var currentScrollTop    = scrollElement.scrollTop;
    var currentScrollBottom = scrollElement.scrollTop + scrollElement.getHeight();
    var currentScrollLeft   = scrollElement.scrollLeft;
    var currentScrollRight  = scrollElement.scrollLeft + scrollElement.getWidth();
    var itemTopMargin       = parseInt(this.get("selectedItem.element").getStyle("margin-top"), 10);
    var itemBottomMargin    = parseInt(this.get("selectedItem.element").getStyle("margin-bottom"), 10);
    var itemLeftMargin      = parseInt(this.get("selectedItem.element").getStyle("margin-left"), 10);
    var itemRightMargin     = parseInt(this.get("selectedItem.element").getStyle("margin-right"), 10);
    var scrollTopValue      = selectedItemTop - itemTopMargin;
    var scrollLeftValue     = selectedItemLeft - itemLeftMargin;
    var shouldScrollTop     = false;
    var shouldScrollLeft    = false;

    // selectedItem is above current scroll position
    if (selectedItemTop < currentScrollTop)
      shouldScrollTop = true;

    // selectedItem is below current, viewable scroll position
    if (selectedItemTop >= currentScrollBottom)
      shouldScrollTop = true;

    // selectedItem is partially visible below the current, viewable scroll position
    else if (selectedItemBottom > currentScrollBottom)
    {
      shouldScrollTop = true;
      scrollTopValue = currentScrollTop + (selectedItemBottom - currentScrollBottom) + itemBottomMargin;
    }

    // selectedItem is left of current scroll position
    if (selectedItemLeft < currentScrollLeft)
      shouldScrollLeft = true;

    // selectedItem is right of current, viewable scroll position
    if (selectedItemLeft >= currentScrollRight)
      shouldScrollLeft = true;

    // selectedItem is partially visible below the current, viewable scroll position
    else if (selectedItemRight > currentScrollRight)
    {
      shouldScrollLeft = true;
      scrollLeftValue = currentScrollLeft + (selectedItemRight - currentScrollRight) + itemRightMargin;
    }

    if (shouldScrollTop || shouldScrollLeft)
    {
      if (shouldScrollTop)  scrollElement.scrollTop  = scrollTopValue;
      if (shouldScrollLeft) scrollElement.scrollLeft = scrollLeftValue;
    }

    return (shouldScrollTop || shouldScrollLeft);
  },

  // Sorting -----------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_setupSorting() -> null
   */
  _setupSorting: function()
  {
    if (this.get("element").hasClassName("sortable"))
      Sortable.destroy(this.get("element"));
    else
      this.get("element").addClassName("sortable");
    this._addOrderedIdentitiesToItems();
    Sortable.create(this.get("element"), {
      onChange: this._listViewOrderDidChange.bind(this),
      onUpdate: this._listViewOrderDidUpdate.bind(this)
    });
  },

  _addOrderedIdentitiesToItems: function()
  {
    this.get("items").each(function(item) { item.get("element").identify(); });
  },

  // Call the listViewOrderDidChange method on the delegate, if the
  // delegate has defined it.
  _listViewOrderDidChange: function()
  {
    $L.debug("List view order changed...", this);
    this.callDelegateMethod("listViewOrderDidChange");
  },

  _listViewOrderDidUpdate: function()
  {
    $L.info('_listViewOrderDidUpdate', this);
    this._updateSortIndexes();
    this.callDelegateMethod("listViewOrderDidUpdate");
  },

  _updateSortIndexes: function()
  {
    var sequence = Sortable.sequence(this.element);
    sequence.each(
      function(seq, index)
      {
        var item = this.get("items").find(
          function(item)
          {
            return item.get("element").identify().endsWith("_" + seq);
          }
        );
        item.set("sortIndex", index);
      }.bind(this)
    );
    this.get("items").sort(function(a, b) { return a.get("sortIndex") - b.get("sortIndex"); });

    // Reset Selected Item Index(es)
    if (this.get("selectedItem"))
      this.set("selectedItemIndex", this.get("items").indexOf(this.get("selectedItem")));
    else if (this.get("selectedItems"))
      this.set("selectedItemIndexes", this.get("selectedItems").each(function(item) {
        return this.get("items").indexOf(item);
      }, this));
  },

  // Event Handling ----------------------------------------------------------

  handleClickEvent: function(event)
  {
    var element = event.element();
    if (element.tagName != "LI")
      element = element.up("li");
    if (!element || !element.descendantOf(this.get("element")))
      this.clearSelection();
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
   */
  _shouldSelectItem: function(item)
  {
    var shouldSelect = true;
    if (item == this.get("selectedItem"))
      shouldSelect = false;
    if (this.shouldSelectItem)
      shouldSelect = this.shouldSelectItem(item);
    if (this.hasDelegateMethod("listViewShouldSelectItem"))
      shouldSelect = this.callDelegateMethod("listViewShouldSelectItem", item);
    return shouldSelect;
  },

  /*
   * Aphid.UI.ListView#_willSelectItem(item) -> null
   *
   * This method is called just before the item is to be selected. It will
   * perform the following actions when called, in order:
   *
   *  - Calls the `willSelectItem(item)` callback, if the instance is a
   *    subclass that has implemented the method.
   *
   *  - Calls the `listViewWillSelectItem(listView, item)` delegate
   *    method, if it has been implemented by the delegate.
   *
   */
  _willSelectItem: function(item)
  {
    if (this.willSelectItem)
      this.willSelectItem(item);
    this.callDelegateMethod("listViewWillSelectItem", item);
  },

  /*
   * Aphid.UI.ListView#_didSelectItem(item) -> null
   *
   * Performs any internal actions after an item has been selected before
   * calling the `didSelectItem` callback and the `listViewSelectionDidChange`
   * delegate method.
   */
  _didSelectItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didSelectItem)
      this.didSelectItem(item);

    // Call the listViewDidSelectItem method on the delegate, if the
    // delegate has defined it.
    this.callDelegateMethod("listViewDidSelectItem", item);

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    this.callDelegateMethod("listViewSelectionDidChange", item);
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
   */
  _shouldDeselectItem: function(item)
  {
    var shouldDeselect = true;
    if (this.get("multipleSelectionEnabled") && !this.get("selectedItems").include(item))
      shouldDeselect = false;
    else if (!this.get("multipleSelectionEnabled") && item != this.get("selectedItem"))
      shouldDeselect = false;
    if (this.shouldDeselectItem)
      shouldDeselect = this.shouldDeselectItem(item);
    if (this.hasDelegateMethod("listViewShouldDeselectItem"))
      shouldDeselect = this.callDelegateMethod("listViewShouldDeselectItem", item);
    return shouldDeselect;
  },

  /*
   * Aphid.UI.ListView#_willDeselectItem(item) -> null
   *
   * This method is called just before the item is to be de-selected. It will
   * perform the following actions when called, in order:
   *
   *  - Calls the `willDeselectItem(item)` callback, if the instance is a
   *    subclass that has implemented the method.
   *
   *  - Calls the `listViewWillDeselectItem(listView, item)` delegate
   *    method, if it has been implemented by the delegate.
   *
   */
  _willDeselectItem: function(item)
  {
    if (this.willDeselectItem)
      this.willDeselectItem(item);
    this.callDelegateMethod("listViewWillDeselectItem", item);
  },

  /*
   * Aphid.UI.ListView#_didDeselectItem(item) -> null
   *
   * Performs any internal actions after an item has been deselected before
   * calling the `didDeselectItem` callback and the `listViewSelectionDidChange`
   * delegate method.
   */
  _didDeselectItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didDeselectItem)
      this.didDeselectItem(item);

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    this.callDelegateMethod("listViewSelectionDidChange", item);
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
   */
  _shouldClearSelection: function()
  {
    var shouldClearSelection = true;
    if (this.get("multipleSelectionEnabled") && this.get("selectedItems").length === 0)
      shouldClearSelection = false;
    else if (!this.get("multipleSelectionEnabled") && !this.get("selectedItem"))
      shouldClearSelection = false;
    if (this.shouldClearSelection)
      shouldClearSelection = this.shouldClearSelection();
    if (this.hasDelegateMethod("listViewShouldClearSelection"))
      shouldClearSelection = this.callDelegateMethod("listViewShouldClearSelection");
    return shouldClearSelection;
  },

  /*
   * Aphid.UI.ListView#_willClearSelection() -> null
   *
   * This method is called just before the selection is cleared. It will
   * perform the following actions when called, in order:
   *
   *  - Calls the `willClearSelection()` callback, if the instance is a
   *    subclass that has implemented the method.
   *
   *  - Calls the `listViewWillClearSelection(listView)` delegate method,
   *    if it has been implemented by the delegate.
   *
   */
  _willClearSelection: function()
  {
    if (this.willClearSelection)
      this.willClearSelection(item);
    this.callDelegateMethod("listViewWillClearSelection");
  },

  /*
   * Aphid.UI.ListView#_didClearSelection() -> Boolean
   *
   * Performs any internal actions after an item has been deselected before
   * calling the `didClearSelection` callback and the two delegate methods:
   * `listViewSelectionDidChange` and `listViewDidClearSelection`.
   */
  _didClearSelection: function()
  {
    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    this.callDelegateMethod("listViewSelectionDidChange");

    // Call the listViewDidClearSelection method on the delegate, if the
    // delegate has defined it.
    this.callDelegateMethod("listViewDidClearSelection");
  },

  /*
   * Aphid.UI.ListView#_shouldOpenItem(item) -> Boolean
   *
   * Checks with the subclass and delegate to see if the item should be
   * opened.
   *
   * Delegates have the final say in whether or not the item should be
   * opened.
   */
  _shouldOpenItem: function(item)
  {
    var shouldOpen = true;
    if (this.shouldOpenItem)
      shouldOpen = this.shouldOpenItem(item);
    if (this.hasDelegateMethod("listViewShouldOpenItem"))
      this.callDelegateMethod("listViewShouldOpenItem", item);
    return shouldOpen;
  },

  /*
   * Aphid.UI.ListView#_willOpenItem(item) -> null
   *
   * This method is called just before the item is opened. It will perform the
   * following actions when called, in order:
   *
   *  - Calls the `willOpenItem(item)` callback, if the instance is a subclass
   *    that has implemented the method.
   *
   *  - Calls the `listViewWillOpenItem(listView, item)` delegate method,
   *    if it has been implemented by the delegate.
   *
   */
  _willOpenItem: function(item)
  {
    if (this.willOpenItem)
      this.willOpenItem(item);
    this.callDelegateMethod("listViewWillOpenItem", item);
  },

  /*
   * Aphid.UI.ListView#_didOpenItem(item) -> null
   *
   * Performs any internal actions after an item has been opened before
   * calling the `didOpenItem` callback and the `listViewDidOpenItem`
   * delegate method.
   */
  _didOpenItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didOpenItem)
      this.didOpenItem(item);

    // Call the listViewDidOpenItem method on the delegate, if the delegate
    // has defined it.
    this.callDelegateMethod("listViewDidOpenItem", item);
  },

  /*
   * Aphid.UI.ListView#_shouldRemoveItem(item) -> Boolean
   *
   * Checks with the subclass and delegate to see if the item should be
   * removed.
   *
   * Delegates have the final say in whether or not the item should be
   * removed.
   */
  _shouldRemoveItem: function(item)
  {
    var shouldRemove = true;
    if (!this.get("items").include(item))
    {
      $L.error("Attempted to remove item that is not a part of the list", this);
      return false;
    }
    if (this.shouldRemoveItem)
      shouldOpen = this.shouldRemoveItem(item);
    if (this.hasDelegateMethod("listViewShouldRemoveItem"))
      shouldRemove = this.callDelegateMethod("listViewShouldRemoveItem", item);
    return shouldRemove;
  },

  /*
   * Aphid.UI.ListView#_willRemoveItem(item) -> null
   *
   * This method is called just before the item is removed. It will perform the
   * following actions when called, in order:
   *
   *  - Calls the `willRemoveItem(item)` callback, if the instance is a
   *    subclass that has implemented the method.
   *
   *  - Calls the `listViewWillRemoveItem(listView, item)` delegate method,
   *    if it has been implemented by the delegate.
   *
   */
  _willRemoveItem: function(item)
  {
    if (this.willRemoveItem)
      this.willRemoveItem(item);
    this.callDelegateMethod("listViewWillRemoveItem", item);
  },

  /*
   * Aphid.UI.ListView#_didRemoveItem(item) -> null
   *
   * Performs any internal actions after an item has been removed before
   * calling the `didRemoveItem` callback and the `listViewDidRemoveItem`
   * delegate method.
   */
  _didRemoveItem: function(item)
  {
    // Call the public callback, that may have been implemented by a subclass.
    if (this.didRemoveItem)
      this.didRemoveItem(item);

    // Call the listViewDidRemoveItem method on the delegate, if the delegate
    // has defined it.
    this.callDelegateMethod("listViewDidRemoveItem", item);
  },

  // -------------------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_validateContainer() -> Boolean
   *
   * Evaluates the element for this instance to ensure that the element meets
   * all requirements to be used with this class.
   */
  _validateContainer: function()
  {
    if (this.get("element").tagName != 'UL')
    {
      $L.error('Container (' + this.element.inspect() + ') is not an Unordered List (<ul>).', this);
      return false;
    }
    return true;
  },

  /*
   * Aphid.UI.ListView#_validateItem(item) -> Boolean
   *
   * - item (Object): the object to be validated
   *
   * Evaluates the passed list view item and ensures that it meets the
   * requirements for use within a list view.
   */
  _validateItem: function(item)
  {
    return (item instanceof resolveClassName(this.get("itemViewClass")));
  },

  // Selection Persistence ---------------------------------------------------

  _persistSelection: function()
  {
    var identity   = this.get("element").readAttribute("id"),
        cookieName = this.displayName + "[" + identity + "].selectedItemIndex";

    if (!identity)
    {
      $L.warn("Unable to persist selection because the list view element is lacking a unique id", this);
      return false;
    }

    $L.info("Persisting selected item (index: " + this.get("selectedItemIndex") + ") in cookie \"" + cookieName + "\"", this);

    if (this.get("selectedItemIndex") >= 0)
      $C.set(cookieName, this.get("selectedItemIndex").toString());
    else
      $C.erase(cookieName);

    return true;
  },

  _restoreSelection: function()
  {
    var identity   = this.get("element").readAttribute("id"),
        cookieName = this.displayName + "[" + identity + "].selectedItemIndex",
        itemIndex  = $C.get(cookieName);

    if (!itemIndex)
    {
      $L.warn("Not restoring selection as no persisted selection was found", this);
      return false;
    }

    $L.info("Restoring selection to item at index \"" + itemIndex + "\" from cookie \"" + cookieName + "\"", this);

    this.selectItemAtIndex(parseInt(itemIndex, 10));

    return true;
  }

});
