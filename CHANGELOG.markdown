
# Aphid Release History

## Version 0.9.2 - *Not Yet Released*

 * [Tools] Add or update the .buildstamp file to the Build output directory
   after each build and add the .buildstamp file to the list of watched files
   when Aphid is vendored within another application so that changes to the
   vendored Aphid result in a rebuild of the application.

 * [Aphid.Support.Extensions] Updated Date#strftime with a new formatting
   component (%z) for displaying the timezone offset (i.e. -4).

 * [Aphid.Support.Extensions] Fixed parsing of ISO-8601 formatted dates when
   using String#toDate() so that it initializes the date as a UTC date.

 * [Aphid.Support.Extensions] Added String#parseURI() for parsing a URI string
   into its various parts (i.e. protocol, host, port, path, etc).

 * [Aphid.Support.Extensions] Added support to String#toDate() for parsing
   strings in the ISO 8601 format.

 * [General] New Aphid projects no longer have an index.html file in the root
   of the project. Instead, the default file is located in
   Resources/Templates/Application.html and is output as Build/index.html
   when building. This file is also now observed for changes by the "watch"
   Rake task.

 * [Tools] Expanded the Aphid library for Ruby to also include most of the
   Rake tasks and supporting methods that can be shared by both Aphid and
   Aphid-based projects.

 * [General] Restructured the Build output folder so that it follows a
   similar, albeit *compiled* structure resembling typical Aphid project
   structures (i.e. Library, Resources/Images, Resources/Stylesheets, etc).

 * [General] Added an exception handler to all Ajax.Request instances so that
   exceptions thrown in callback methods are properly thrown to the user so
   that we no longer have cases where an error in viewDidLoad fails silently.

 * [Aphid.UI.Controls.SelectView] Added SelectView, a custom control that
   replaces HTML SELECT controls with our own custom styling and behaviors.

 * [Aphid.Core.Application] Alias Application.sharedInstance to $AppDelegate
   upon application initialization.

 * [Aphid.Core.Application] Initialize a shared notification center during
   application initialization (accessible as
   Application.sharedInstance.notificationCenter).

 * [Aphid.Core.NotificationCenter] Added NotificationCenter which provides a
   mechanism for broadcasting information throughout an application.

 * [Tools] Fixed an issue where a mis-configured Growl configuration would
   cause the Rake "watch" task to fail. When Growl is not configured properly,
   a message is displayed to the user that tells them how to resolve the
   problem.

 * [Aphid.UI.View] Improved error reporting when a template load request fails
   for any reason by displaying an AlertView with the error that was
   encountered.

 * [Aphid.Support.Logger] Added support for sending an object to the Logger
   instead of a String to use as the prefix. The logger will use the
   displayName property of the class as the message prefix, if available.

 * [Tools] Added rake tasks to support building packages and gem files.

 * [Tools] Added an "aphid" command-line tool that can be used to bootstrap a
   new Aphid application (e.g. "aphid new ProjectName").

 * [Skeleton] Added a skeleton project in the Skeleton directory that may be
   used to start new Aphid-based applications. It contains an application
   delegate, a view controller and a Rakefile for building the project.

 * [Aphid.UI.View] Changed the default load path for view templates from
   _APPLICATION_/Views to _APPLICATION_/Resources/Templates.

## Version 0.9.1 - October 7th, 2010

 * [Aphid.Model] Added support for specifying proxied attributes as a hash
   with the following keys: type and validate. Type would be the class name
   of the proxy (as a string or a literal) and validate is a boolean denoting
   whether or not the proxy should be validated when validate() is called on
   its parent model.

 * [Aphid.UI.View] When initializing views from outlets that are loaded from
   a template, add only the template wrapper's child elements to the outlet
   element to avoid double-wrapping the view with an element with the same
   DOM ID (or other characteristics).

 * [Aphid.Model] Fixed an issue where proxies whose attributes were either
   undefined or null were preventing the model instance from fully
   initializing.

 * [Aphid.Model] Fixed an issue where models that were initialized with
   missing attributes (as defined by the model's attribute property) were
   silently failing to initialize.

 * [Aphid.Model] Added afterInitialize() callback that is called after the
   model instance has finished initialization.

 * [Aphid.UI.View] Added Aphid.UI.View#clearSubviews() for removing all
   subviews of a view.

 * Merged a new tab view template into Aphid proper.

 * [Aphid.Support.Extensions] Added Array#compare() for comparing two arrays.

 * Reordering a sortable list now updates the order of the items in the items
   array on the list view to match the presented order.

 * List view items in sortable list views are now draggable anywhere in the
   element instead of just the drag handle to resolve some issues.

 * Initial support for validations on Aphid.Model. Models that implement
   the validate() method will have this method called before saving can take
   place. If any errors have been added to the instance using the addError()
   method, the save will not be performed and an error message will be
   displayed.

 * Added Array#remove(item) for removing the specified item from the array
   without creating a copy of the array.

 * Added support to Aphid.UI.ListView for tracking and selecting list view
   items by their index in Aphid.UI.ListView#items by referencing the
   selectedItemIndex and selectedItemIndexes properties and calling the
   selectItemAtIndex(), deselectItemAtIndex() and openItemAtIndex() methods.

 * Added dirty state tracking support to Aphid.Model through the new isDirty()
   method. Models who have had attribute values change will return true when
   isDirty() is called.

 * Added support for reloading models after they have been loaded and
   Aphid.Model will now automatically reload the model after it has been
   saved.

 * Added Aphid.Model#identifierAttribute for specifying the name of the
   attribute that should be considered the identifier for the model to be used
   when loading, reloading and saving.

 * Added a custom String#toDate extension to be used for converting dates
   formatted as strings to instances of Date.

 * Added a custom Date#strftime extension to be used for formatting dates with
   format strings.

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
