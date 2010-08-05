
# Aphid Release History

## Version 0.9.1 - *Not Yet Released*

 * Fixed model initialization so that it sets the configured attributes to
   null on the object when the model is not initialized with initial data so
   that calls to attributes do not result in "undefined".

 * Added default styles for items in a toolbar with the "status" CSS class.

 * Added default styling for placeholder items in Aphid.UI.ListView instances.

 * Fixed an issue on Aphid.UI.ListView that was causing deselections to happen
   even when multipleSelectionEnabled was false.

 * Added getData and setData to Element for making the accessing and setting
   of HTML5 data attributes easier.

 * Added getMinimumWidth(), getMinimumHeight(), getMaximumWidth(),
   getMaximumHeight(), getBorderHeight(), getBorderWidth(), getInnerHeight(),
   getInnerWidth(), getOuterHeight() and getOuterWidth() to Element.

 * Fixed an issue where Aphid.UI.SplitViewController wasn't taking border
   widths/heights into account when resizing.

 * Allow Aphid.UI.SplitViewController to be initialized and used with a
   horizontal constraint.

 * Added support for placeholder items in ListViews. ListViews that are
   initialized with a list item that has the CSS class of "placeholder" will
   be ignored by the ListView, as if the list contained no items.

 * Added support for URL templates in Aphid.Model class definitions so that
   the record identifier can be placed anywhere in the URL, not just at the
   end.

 * Added support for proxies on attributes that contain an array of objects
   that should be instantiated with the configured proxy class.

 * Added a new abstract class for models, Aphid.Model.

 * Added multiple selection support to Aphid.UI.ListView. This includes the
   following changes:

   * Added multipleSelectionEnabled property with a default value of false.
   * Renamed isSortable property to sortingEnabled, for consistency.
   * Added selectedItems property, which is used in place of selectedItem,
     when multiple selection is enabled.
   * Added deselectItem(item) method for deselecting individual items when
     multiple selection is enabled.
   * Added support for calling listViewShouldDeselectItem and
     listViewShouldOpenItem on delegates of Aphid.UI.ListView.
   * Added support for calling shouldDeselectItem and shouldOpenItem on
     subclasses of Aphid.UI.ListView.
   * Other miscellaneous bug fixes and documentation tweaks.

## Version 0.9.0 - July 21st, 2010

  * Initial release.
