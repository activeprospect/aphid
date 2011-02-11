/**
 * class Aphid.UI.DividerSourceListViewItem < Aphid.UI.SourceListViewItem
 *
 * A list view item implementation that provides a divider that is suitable
 * for use with an [[Aphid.UI.SourceListView]].
**/

Aphid.UI.DividerSourceListViewItem = Aphid.Class.create("Aphid.UI.DividerSourceListViewItem", Aphid.UI.SourceListViewItem, {

  // Initialization ----------------------------------------------------------

  /**
   * new Aphid.UI.DividerSourceListViewItem([options])
   *
   * - options (Hash): Initial property values to be set on the
   *   DividerSourceListViewItem instance
   *
   * Initializes a new DividerSourceListViewItem instance.
  **/
  initialize: function($super, options)
  {
    $super(options);
  }

});
