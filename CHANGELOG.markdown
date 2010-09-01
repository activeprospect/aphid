
# Aphid Release History

## Version 0.9.1 - *Not Yet Released*

 * Added "enabled" state management to Aphid.UI.View through the isEnabled
   property and the enable() and disable() methods.

 * Fixed issues with Aphid.UI.SplitViewController that prevented split views
   from being initialized when asynchronous loading is not enabled.

 * Renamed the `viewDidFinishLoading` delegate method, called by Aphid.UI.View
   when asynchronously loaded views are initialized, to `viewDidLoadAsynchronously`.

 * Added support for updating elements with HTML5 tags in Internet Explorer
   versions less than 9.

 * Added support for configuring asynchronous view loading and disabled it,
   by default, until we have more time to test it with Internet Explorer.

 * Setting or adding items to an instance of Aphid.UI.ListView now honors the
   selection state on the items properly.

 * Adding list view items to Aphid.UI.ListView instances now always have their
   listView property set to the owning list view.

 * Added support for calling Aphid.Model#afterLoad() callback when implemented
   by a subclass.

 * Added Aphid.Model#save() for serializing and updating a record on a remote
   web service.

 * Added Aphid.Model#serialize() for serializing a model instance's attributes
   to a Hash that is suitable for initializing another instance or converting
   to JSON for transport to a web service.

 * Brought in ExplorerCanvas as a dependency for supporting HTML5 canvas in
   Internet Explorer and other bug fixes preventing Aphid from initializing.

 * Improved Aphid.UI.ListView item selection so that the selected item is
   always made visible in cases where it may be outside the current visible
   scroll position of the list view.

 * Added support to Aphid.UI.View for initializing views with options
   specified as HTML5 data-* attributes (i.e. <section data-outlet="someView"
   data-view-class="SomeView" data-is-enabled="true">...</section> will set
   the isEnabled property on the SomeView instance).

 * Added String#attributize, a method that takes a camelized string (i.e.
   multipleSelectionEnabled) and returns the string in a format suitable for
   use with an HTML5 data-* attribute (i.e. "multiple-selection-enabled").

 * Fixed an issue with initializing outlets on elements that do not have child
   elements (such as an INPUT element).

 * Added support for Data Sources to Aphid.UI.ListView.

 * Added Aphid.UI.AlertView for displaying modal alert messages (errors,
   notices, etc).

 * Made Aphid.UI.Window a subclass of Aphid.UI.View so that it functions as
   part of the full view stack as the root view.

 * Moved overlay display responsibilities to Aphid.UI.Window, which can now be
   managed by using the Aphid.UI.Window#displayOverlay(),
   Aphid.UI.Window#displayOverlayAnimated(), Aphid.UI.Window#dismissOverlay()
   and Aphid.UI.Window#dismissOverlayAnimated() methods.

 * Added support for removing list view items with
   Aphid.UI.ListView#removeItem(item).

 * Added support for displaying placeholder messages on block elements that
   specify the custom data-placeholder attribute.

 * Added listViewShouldClearSelection (delegate method) and
   shouldClearSelection (callback) to Aphid.UI.ListView.

 * Aphid.UI.ListView now requires all list items to be instances of
   Aphid.UI.ListViewItem (a new subclass of Aphid.UI.View) so that the
   standard view hierarchy is observed. Any static list items that are present
   in the list when initializing from an element or template will
   automatically be initialized as instances of Aphid.UI.ListViewItem.

 * Element#setData() now returns the element so that you can use it with
   method chaining.

 * Added support for clearing the selection when you click in the empty space
   of an Aphid.UI.ListView instance.

 * Fixed an issue where selecting items in a ListView would call the
   listViewSelectionDidChange delegate method twice.

 * Added Aphid.UI.ListView#addItem(item) for adding items to a list view and
   fixed some issues with registering event observers and managing list
   sorting.

 * Fixed an issue where the previous selection would not have been cleared
   when setting new items on Aphid.UI.ListView.

 * Fixed model initialization so that it sets the configured attributes to
   null on the object when the model is not initialized with initial data so
   that calls to attributes do not result in "undefined".

 * Added default styles for items in a toolbar with the "status" CSS class.

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
