/**
 * class Aphid.UI.DividerSourceListViewItem < Aphid.UI.SourceListViewItem
 *
 * A list view item implementation that provides a divider that is suitable
 * for use with an [[Aphid.UI.SourceListView]].
**/

Aphid.UI.DividerSourceListViewItem = Class.create(Aphid.UI.SourceListViewItem, {

  displayName: "Aphid.UI.DividerSourceListViewItem",

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.SourceListViewItem([options])
   *
   * - options (Hash): Initial property values to be set on the
   *   SourceListViewItem instance
   *
   * Initializes a new SourceListViewItem instance.
  **/
  initialize: function($super, options)
  {
    $super(options);
  },

  viewDidLoad: function($super)
  {
    this.element.addClassName("DividerSourceListViewItem");
    $super();
  },

  // -------------------------------------------------------------------------

  

});

// Method Name Mappings for Debugging ----------------------------------------

// Aphid.UI.SourceListViewItem.prototype.select.displayName = "Aphid.UI.ListViewItem.select";
// Aphid.UI.SourceListViewItem.prototype.deselect.displayName = "Aphid.UI.ListViewItem.deselect";
