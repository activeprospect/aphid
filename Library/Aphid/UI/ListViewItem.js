/**
 * class Aphid.UI.ListViewItem < Aphid.UI.View
 *
 * List view items belonging to instances of [[Aphid.UI.ListView]] are
 * required to be instances of this class, [[Aphid.UI.ListViewItem]].
**/

Aphid.UI.ListViewItem = Class.create(Aphid.UI.View, {

  displayName: "ListViewItem",

  /**
   * Aphid.UI.ListViewItem#isSelected -> Boolean
   *
   * Denotes the selected state of the list view item.
  **/
  isSelected: false,

  /**
   * Aphid.UI.ListViewItem#listView -> Aphid.UI.ListView
   *
   * The [[Aphid.UI.ListView]] instance that this item belongs to.
  **/
  listView: false,

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.ListViewItem([options])
   *
   * - options (Hash): Initial property values to be set on the View instance
   *
   * Initializes a new View instance.
  **/
  initialize: function($super, options)
  {
    $super(options);
    if (!this.element)
    {
      $L.debug("Initializing default element...", this.displayName)
      this.element = new Element('li').addClassName("ListViewItem");
      this.isLoaded = true;
    }
  },

  viewDidLoad: function($super)
  {
    this.element.addClassName("ListViewItem");
  },

  // -------------------------------------------------------------------------

  /**
   * Aphid.UI.ListViewItem#select() -> Aphid.UI.ListViewItem
   *
   * Selects the list view item by adding the `selected` CSS class to the
   * element and setting [[Aphid.UI.ListViewItem#isSelected]] to `true`. This
   * method returns the list view item instance.
  **/
  select: function()
  {
    $L.debug("Selected...", this.displayName);
    this.element.addClassName('selected');
    this.isSelected = true;
    return this;
  },

  /**
   * Aphid.UI.ListViewItem#deselect() -> Aphid.UI.ListViewItem
   *
   * Deselects the list view item by removing the `selected` CSS class from
   * the element and setting [[Aphid.UI.ListViewItem#isSelected]] to `false`.
   * This method returns the list view item instance.
  **/
  deselect: function()
  {
    $L.debug("Deselected...", this.displayName);
    this.element.removeClassName('selected');
    this.isSelected = false;
    return this;
  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.ListViewItem.prototype.select.displayName = "Aphid.UI.ListViewItem.select";
Aphid.UI.ListViewItem.prototype.deselect.displayName = "Aphid.UI.ListViewItem.deselect";
