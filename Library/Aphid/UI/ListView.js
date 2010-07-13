/**
 * class Aphid.UI.ListView
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
 *     </ul>
 *
 * #### Delegate Methods
 *
 *  * `listViewShouldSelectItem(listView, item)` - Called just before the item
 *    selection process begins. Returning false will prevent the selection
 *    from happening.
 *
 *  * `listViewSelectionDidChange(listView, selectedItem)` - Called when the
 *    current selection has changed.
 *
 *  * `listViewDidOpenItem(listView, openedItem)` - Called when the use has
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
**/

Aphid.UI.ListView = Class.create(Aphid.UI.View, {

  viewName: false,

  /**
   * Aphid.UI.ListView#items -> Array
   *
   * An array of Elements for each list item that is part of the list.
  **/
  items: false,

  /**
   * Aphid.UI.ListView#selectedItem -> Element | false
   *
   * The currently selected list item, or false if no item is currently
   * selected.
  **/
  selectedItem: false,

  /**
   * Aphid.UI.ListView#isSortable -> Boolean
   *
   * If isSortable is set to true, the list will have Sortable applied to it
   * automatically.
  **/
  isSortable: false,

  /**
   * Aphid.UI.ListView#sortableOptions -> Object
   *
   * Options to be passed to the Sortable instance when sorting is enabled.
   * For a list of options, consule the [Sortable documentation](http://wiki.github.com/madrobby/scriptaculous/sortable-create)
   * in the script.aculo.us library. Defaults:
   *
   *     {
   *       asdf: "foo"
   *     }
  **/
  sortableOptions: false,

  /**
   * new Aphid.UI.ListView()
   *
   * Initializes a new instance.
  **/
  initialize: function($super)
  {
    $super();
    this.items = $A();
    this.sortableOptions = {
      handle: "handle",
      onChange: this._listViewOrderDidChange.bind(this),
      onUpdate: this._listViewOrderDidUpdate.bind(this)
    }
  },

  initializeFromTemplate: function($super, element)
  {
    $super(element);
    if (this._validateContainer())
    {
      this.items = this.element.childElements();
      this._setupObservers();
      if (this.isSortable)
        $L.info('sortable')
    }
  },

  awakeFromHTML: function()
  {
    $L.info('Awoke from HTML', 'Aphid.UI.ListView');
    if (this.isSortable)
      this._setupSorting();
    this.element.addClassName('ListView');
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
    this.items = this.element.update().insert(newItems).select('>li');
    this._setupObservers();
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
    // Check with the listViewShouldSelectItem delegate to be sure that we are
    // in a state that will allow for its selection...
    if (!this._listViewShouldSelectItem(item))
      return;

    $L.info('Selecting item ' + this.items.indexOf(item) + ' in list...', 'Aphid.UI.ListView');

    // Don't allow the currently selected item to be reselected.
    if (this.selectedItem && this.selectedItem == item)
      return;

    // Clear the previous selection and select the new item.
    this.clearSelection();
    this.selectedItem = item.addClassName('selected');

    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, item);
  },

  openItem: function(item)
  {
    // Call the listViewSelectionDidChange method on the delegate, if the
    // delegate has defined it.
    if (this.delegate && this.delegate.listViewDidOpenItem)
      this.delegate.listViewDidOpenItem(this, item);
  },

  /**
   * Aphid.UI.ListView#clearSelection() -> null
   *
   * Clears the currently selected item, if any, leaving the list view in an
   * unselected state.
  **/
  clearSelection: function()
  {
    this.items.invoke('removeClassName', 'selected');
    this.selectedItem = false;
  },

  // Sorting -----------------------------------------------------------------

  /*
   * Aphid.UI.ListView#_setupSorting() -> null
  **/
  _setupSorting: function()
  {
    this.element.addClassName('sortable');
    this._addDragHandlesToItems();
    this._addOrderedIdentitiesToItems();
    Sortable.create(this.element, this.sortableOptions);
  },

  // TODO This is a hack to make the onUpdate callback trigger after the list order was updated
  _addOrderedIdentitiesToItems: function()
  {
    this.items.each(this._addOrderedIdentityToItem.bind(this));
  },

  _addOrderedIdentityToItem: function(item)
  {
    $L.info(item.identify())
  },

  _addDragHandlesToItems: function()
  {
    this.items.each(this._addDragHandlesToItem.bind(this));
  },

  _addDragHandlesToItem: function(item)
  {
    var foo = new Element('div').addClassName('handle');
    item.insert(foo)
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
   * Aphid.UI.ListView#_setupObservers() -> null
   *
   * Iterates across each item in the list adding event observers for handling
   * click events and wiring them up to callbacks.
  **/
  _setupObservers: function()
  {
    var anchors = this.element.select('> li > a');
    if (anchors.length > 0)
      anchors.invoke('observe', 'click', this._handleClickEvent.bind(this));
    else
    {
      this.items.invoke('observe', 'click', this._handleClickEvent.bind(this));
      this.items.invoke('observe', 'dblclick', this._handleDoubleClickEvent.bind(this));
    }
  },

  _handleClickEvent: function(event)
  {
    event.stop();
    var item = event.findElement('li');
    this.selectItem(item);
  },

  _handleDoubleClickEvent: function(event)
  {
    event.stop();
    var item = event.findElement('li');
    this.selectItem(item);
    this.openItem(item);
  },

  // Callbacks ---------------------------------------------------------------

  _listViewShouldSelectItem: function(item)
  {
    $L.info('_listViewShouldSelectItem', 'Aphid.UI.ListView');
    var shouldSelect = true;
    if (item == this.selectedItem)
      shouldSelect = false;
    if (this.delegate && this.delegate.listViewShouldSelectItem)
      shouldSelect = this.delegate.listViewShouldSelectItem(item);
    return shouldSelect;
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
Aphid.UI.ListView.prototype.initializeFromTemplate.displayName = "Aphid.UI.ListView.initializeFromTemplate";
Aphid.UI.ListView.prototype.awakeFromHTML.displayName = "Aphid.UI.ListView.awakeFromHTML";
Aphid.UI.ListView.prototype.setItems.displayName = "Aphid.UI.ListView.setItems";
Aphid.UI.ListView.prototype.selectItem.displayName = "Aphid.UI.ListView.selectItem";
Aphid.UI.ListView.prototype.clearSelection.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype._setupSorting.displayName = "Aphid.UI.ListView._setupSorting";
Aphid.UI.ListView.prototype._addOrderedIdentitiesToItems.displayName = "Aphid.UI.ListView._addOrderedIdentitiesToItems";
Aphid.UI.ListView.prototype._addOrderedIdentityToItem.displayName = "Aphid.UI.ListView._addOrderedIdentityToItem";
Aphid.UI.ListView.prototype._addDragHandlesToItems.displayName = "Aphid.UI.ListView._addDragHandlesToItems";
Aphid.UI.ListView.prototype._addDragHandlesToItem.displayName = "Aphid.UI.ListView._addDragHandlesToItem";
Aphid.UI.ListView.prototype._listViewOrderDidChange.displayName = "Aphid.UI.ListView._listViewOrderDidChange";
Aphid.UI.ListView.prototype._listViewOrderDidUpdate.displayName = "Aphid.UI.ListView._listViewOrderDidUpdate";
Aphid.UI.ListView.prototype._setupObservers.displayName = "Aphid.UI.ListView._setupObservers";
Aphid.UI.ListView.prototype._handleClickEvent.displayName = "Aphid.UI.ListView._handleClickEvent";
Aphid.UI.ListView.prototype._listViewShouldSelectItem.displayName = "Aphid.UI.ListView._listViewShouldSelectItem";
Aphid.UI.ListView.prototype._validateContainer.displayName = "Aphid.UI.ListView._validateContainer";
