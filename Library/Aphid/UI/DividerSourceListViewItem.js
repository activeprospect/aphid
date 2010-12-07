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
