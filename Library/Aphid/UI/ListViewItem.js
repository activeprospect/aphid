/**
 * class Aphid.UI.ListViewItem < Aphid.UI.View
 *
 * List view items belonging to instances of [[Aphid.UI.ListView]] are
 * required to be instances of this class, [[Aphid.UI.ListViewItem]].
**/

Aphid.UI.ListViewItem = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.ListViewItem",

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

  /**
   * Aphid.UI.ListViewItem#sortIndex -> Number | false
   *
   * When sorting is enabled on the list view that the item belongs to, this
   * property will be set to the index of this item in the sorted list. If
   * sorting is not enabled, the value of this property will be false.
  **/
  sortIndex: false,

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
    if (!this.get("element"))
    {
      $L.debug("Initializing default element...", this);
      this.set("element", new Element('li').addClassName("ListViewItem"));
      this.set("isLoaded", true);
    }
  },

  viewDidLoad: function($super)
  {
    this.get("element").addClassName("ListViewItem");
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
    $L.debug("Selected...", this);
    this.get("element").addClassName('selected');
    this.set("isSelected", true);
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
    $L.debug("Deselected...", this);
    this.get("element").removeClassName('selected');
    this.set("isSelected", false);
    return this;
  }

});

// Method Name Mappings for Debugging ----------------------------------------

Aphid.UI.ListViewItem.prototype.select.displayName = "Aphid.UI.ListViewItem.select";
Aphid.UI.ListViewItem.prototype.deselect.displayName = "Aphid.UI.ListViewItem.deselect";
