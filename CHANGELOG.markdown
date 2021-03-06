
# Aphid Release History

## Version 0.9.3 - May 30th, 2012

 * [Support/Editors] Added a TextMate bundle that adds commands and other
   shortcuts specific to Aphid.

 * [Tools] Always display Growl notifications when not building from the
   terminal.

 * [Aphid.UI.PopoverView] Visible popover view instances will now
   automatically dismiss when a modal view is presented.

 * [Aphid.UI.NavigationController] Added popToViewController and
   popToRootViewController methods to complement popViewController for jumping
   up the navigation stack.

 * [Aphid.Support.Object] Added convenience methods callDelegateMethod and
   hasDelegateMethod for calling delegate methods or checking for a valid
   method implemented by the delegate of an object.

 * [Aphid.UI.View] Views are now properly initialized with the correct
   superview. They are also instantiated before being connected to their
   outlets. This allows us to instantiate views that are not connected to an
   outlet.

 * [Aphid.UI.TabViewController] Change the data-* property that defines the
   view to automatically instantiate on tab elements from data-view-class to
   data-content-view-class. This is a backwards incompatible API change!

 * [Aphid.Model.CollectionProxy] Added support for appending to the collection
   by calling appendCollection(). This method takes the same arguments as the
   Aphid.Model.Base.loadCollection() method.

 * [Aphid.UI.ListView] Optimized the reloading of data in a list view so that
   it no longer redraws items that were already present in the list. This also
   fixes an issue where reloading data from cached items would result in the
   cached items not being re-added to the list view after a reloadData call.

 * [Aphid.UI.NavigationController] Added a navigation controller that can be
   used to manage a stack of view controllers and handle switching between
   them.

 * [Aphid.UI.View] Added two new transitions: SlideUpTransition and
   SlideDownTransition.

 * [Aphid.UI.View] Added support for transitions to showAnimated and
   hideAnimated.

 * [Tools] Added support for watching changes with OSX FSEvents API by way of
   the rb-fsevent library. This has the distinct advantage to picking up new,
   removed or renamed files.

 * [Documentation] Added a custom documentation template for PDoc.

 * [Aphid.UI.View] Added scopeIdentifier() for use as a queue scope
   identifier with script.aculo.us' Effect class.

 * [Aphid.Core] Added an auto-incrementing instance counter that can be used
   to identify specific instances of any object that is created with the
   Aphid.Support.Object mixin.

 * [Aphid.Support.Extensions] Added Array#sum().

 * [Aphid.UI.PopoverView] The PopoverView now recalculates and adjusts its
   position in the case of its attachedView changing position as that result
   of a scroll event.

 * [Aphid.UI.View] Added viewDidScroll callback, viewScrollOffsetDidChange
   delegate method and a ViewDidScrollNotification notification that are all
   fired when the view scroll offset changes.

 * [Aphid.UI.View] Added support for handling touch "start", "end" and "move"
   events.

 * [Aphid.UI] Removed all instances of LoadingIndicator, replacing them with
   the new View-based LoadingIndicatorView. This includes moving the global
   loading indicator to Aphid.UI.Window from Aphid.Core.Application.

 * [Aphid.Model] Added support for manually parsing the instance or response
   collections in each model class definition by defining parseCollectionResponse
   or parseInstanceResponse.

 * [Aphid.UI.ModalView] Modal views may now be dismissed by pressing the
   escape key.

 * [Tools] Added "aphid vendorize" for vendorizing Aphid in an existing Aphid
   project.

 * [Tools] When building an Aphid-based project, the toolchain will now copy
   Aphid from the installed location if it is not Vendored.

 * [Tools] Added Aphid.path and Aphid.version for returning the path to the
   current Aphid installation and its version, respectively.

 * [Tools] Added support for initializing bootstrapped projects as Git
   repositories and for disabling Aphid vendorization.

 * [Tools] Fixed an issue where template evaluation during project
   bootstrapping wasn't properly re-writing the evaluated template output.

 * [Tools] Updated YUI Compressor to 2.4.6.

 * [General] Many minor syntax fixes as a result of running Aphid through
   JSHint.

 * [Aphid.UI.View] Wired actions now pass the View that the action belongs
   to and the element that received the event to the defined action method.

 * [Aphid.UI.View] The View instance is now stored on the View's element
   instance (i.e. element.retrieve("view")).

 * [Aphid.UI.LoadingIndicatorView] Ported LoadingIndicator to derive from
   Aphid.UI.View. Both LoadingIndicator and LoadingIndicatorView are
   currently in place, but LoadingIndicator will be removed once integration
   is fully complete.

 * [Aphid.UI.ListView] Added an optional boolean argument to removeItem
   that will force the removal of an item by bypassing the shouldRemoveItem
   callback and listViewShouldRemoveItem delegate methods.

 * [Aphid.UI.MatrixView] Keyboard events are now only observed with the
   MatrixView is focused.

 * [Aphid.Support.Compatibility] Added a compatibility method for
   Date.now(), which is not supported by Internet Explorer 8 or
   older.

 * [Aphid.Support.Compatibility] Added a compatibility method for
   window.stop(), which is not supported by any version of Internet
   Explorer.

 * [Aphid.UI.View] Added a "visible" read-only property that will return
   true if the view is: not hidden, not 100% transparent and all of its
   superviews are also visible.

 * [Aphid.UI.View] Added a "hidden" property that controls the visibility of
   the view. It is important to note that hidden views will not be be made
   visible automatically when passing the view to setView/setViewAnimated
   or addSubview/addSubviewAnimated, although the callbacks viewWillAppear
   and viewDidAppear will still be called.

 * [Aphid.UI.View] Added a "superviews" property that will return all of
   the view's superviews in order from most immediate to least immediate.

 * [Resources] Added a "Light Background" pattern as a lighter variation of
   the existing Background pattern.

 * [Aphid.UI.Window] Added a confirmBeforeLeaving boolean property to Window
   that can be set to false in order to prevent the confirmation prompt from
   being displayed when the user attempts to leave the application.

 * [Aphid.UI.PopoverView] Added support for displaying the PopoverView to the
   top, left and right of the attached view (in addition to the previous
   bottom-only support).

 * [Aphid.UI.View] View callbacks are no longer called if the superview that
   the added view is being added to is not visible. The callbacks will still
   be called on subviews when the superview becomes visible.

 * [Tools] Added support for calling an "after_publish" callback, if it is
   defined in the publish configuration.

 * [Aphid.Support.Cookie] Added setPersistent() that will set a persistent
   cookie (that expires in 10 years).

 * [Aphid.UI.Window] Added a loadResource method that will dynamically load
   JavaScript or CSS Stylesheets by URL.

 * [Aphid.Model] Model instances now post notifications after loading,
   reloading and destroying instances.

 * [Aphid.UI.View] Do not observe for or dispatch events when a view is
   disabled.

 * [Aphid.UI.ImageView] Added ImageView, a view for managing the loading and
   display of an image (by URL) which invokes callbacks upon a successful
   image load or an error.

 * [Aphid.UI.View] Setting or adding a subview on a view will no longer
   attempt to re-display the added view if the view is already a subview of
   the superview.

 * [Aphid.Model.Base] Added support for reloading models with the reload()
   method.

 * [Aphid.Model.Base] Added a call to the modelDidFailWithError delegate
   message when an error occurs.

 * [Tools] Changed publish strategy to use rsync for speed by keeping a remote
   cached copy of the build output so that we're only transferring what has
   changed when publishing a new release.

 * [Aphid.Support.Extensions] Added Array#insert().

 * [Aphid.Model.Base] Added support for creating and destroying records.

 * [Aphid.Core.NotificationCenter] It is no longer possible to register
   multiple observers with the same signature.

 * [Aphid.Model.Base] Added initial support for asynchronous loading of both
   single instances and collections (through a new CollectionProxy object).

 * [Aphid.Support.Properties] Added support for passing function arguments to
   properties with custom getters or computed properties
   (i.e. foo.get("bar", { baz: "bong" })).

 * [Aphid.Support.Object] Added a default initializer that will apply options
   to the instance.

 * [Aphid.UI.MatrixView] Removed scrollIntoView() in favor of using the
   scrollToSelectedItem() method inherited from Aphid.UI.ListView.

 * [Aphid.UI.ListView] Improved the scrollToSelectedItem() method to allow for
   scrolling to items in a horizontal scrolling list.

 * [Aphid.Class] Initializing classes with Aphid.Class will now automatically
   set the displayName property on each Class prototype function defined, for
   an improved debugging experience.

 * [Tools] Resources/Images will now be copied to the Build output folder,
   excluding any image source files (i.e. PSD, AI, etc).

 * [Tools] Added multiple-environment support to the publish functionality.

 * [Tools] Added retry support on closed connections when publishing.

 * [Aphid.Model] Any properties that are part of an association's URL template
   will now be passed automatically when initializing the association if any
   of those matching properties are present on the model instance that is
   initializing the association.

 * [Aphid.Model] New implementation of the model layer (only loading is
   supported at the moment) that fully utilizes properties and replaces
   proxy support with full has many and belongs to association support.

 * [Aphid.Support.Properties] Allow for previously undefined properties to be
   set with set().

 * [Aphid.UI.LoadingIndicator] Added minimumDisplayTime property for defining
   the minimum amount of time that the loading indicator should be visible
   (in seconds). This is used to prevent the indicator from being shown and
   then hidden before the animations have a chance to complete, and by default
   is set to 0.5s.

 * [Aphid.Support.Extensions] Made Array#compare return false if the array
   being compared is null.

 * [Skeleton] Updated the default Rakefile so that it attempts to load the
   Aphid Rake tasks from the vendored Aphid, if present, before attempting to
   load a gem-based install. If neither can be loaded, a friendly error
   message explaining that Aphid is missing will be displayed to the user.

 * [Aphid.Support.Extensions] Added better support for parsing the various ISO
   8601 date formats in String#toDate(), deferring to native browser support
   when available.

 * [Aphid.Core] Added Aphid.Class.create() as a wrapper for Prototype's
   Class.create() method. The Aphid version of this method automatically
   extends the resulting class with Aphid.Support.Properties, sets the
   displayName and className properties to the defined class name and adds a
   hook to call the "inherited(subclass)" class method on a parent class in
   the case of inheritance.

 * [Aphid.UI.View] Added support for handling mouseenter and mouseleave events
   with the handleMouseEnterEvent and handleMouseLeaveEvent callbacks.

 * [Aphid.UI.View] Added support for a layoutSubviews callback that, if
   implemented by a View instance, will be called after viewWillAppear and any
   time that the browser window is resized. This allows you to do complex
   layouts that need recalculation when its container dimensions change.

 * [Aphid.Support.Object] Added addObserver, removeObservers, removeObserver
   and postNotification methods to our core Object extensions so that you can
   simply call this.postNotification() without providing a sender (this will
   be inferred).

 * [Aphid.UI.View] Reset absolutely positioned elements to 0, 0, 0, 0 when
   calling setView.

 * [Aphid.UI.Controls] Added ButtonControl for managing a <button/> with an
   optional toggle state (on/off).

 * [Aphid.Support.Extensions.Element] Added Element#clearData() for removing
   a data attribute and changed all data methods to use readAttribute and
   writeAttribute from Prototype.

 * [Aphid.UI.ListView] Fixed the implementation of removeItem.

 * [Aphid.UI.Controls.SegmentedControl] Implemented a basic segmented button
   control.

 * [Aphid.UI.ViewController] Added support for stacking view controllers with
   pushViewController/pushViewControllerAnimated and
   popViewController/popViewControllerAnimated.

 * [Aphid.UI.Controls.DateView] Added a date view control that will display
   an instance of Aphid.UI.CalendarView in a PopoverView when the field is
   focused.

 * [Aphid.UI.CalendarView] Added a calendar view to the core UI library.

 * [Aphid.Support.Extensions.Date] Added date#daysInMonth() and
   Date.daysInMonth(month, year) for getting the number of days in the given
   month and year.

 * [Aphid.Support.Extensions.Date] Added date#isSameDate(date) for comparing
   just the date (not the time) to a date instance.

 * [Aphid.Support.Extensions.Date] Added shortMonthNames and shortDayNames to
   Date.

 * [Aphid.UI.PopoverView] Implemented a "pop-over" view that allows you to
   display a view relative to another view in a tooltip-like pop-up.

 * [Aphid.UI.View] Added support for observing focus and blur events on Views
   that implement handleFocusEvent and handleBlurEvent methods.

 * [Aphid.UI.MatrixView] Rebased the MatrixView class on top of
   Aphid.UI.ListView, as to not duplicate a lot of logic and to clean
   up the implementation so that it better matches Aphid best practices.

 * [Aphid.UI.View] Implemented automatic Event observer registration (and
   de-registration) for any View class that implements a method to handle the
   event (i.e. "handleClickEvent", "handleMouseMoveEvent", etc). Events will
   be observed when the View appears and observers will be removed when the
   View disappears.

 * [Aphid.UI.MatrixView] Added two new configuration parameters for
   controlling multiple selection and drag selection support. Drag selection
   requires multiple selection to be enabled.

 * [Aphid.UI.View] Return the view from enable() and disable() so that method
   calls may be chained (i.e. someView.hide().disable()).

 * [Aphid.UI.View] Added hide() and show() for hiding or showing a view.

 * [Aphid.UI.Controls.SelectView] Implemented support for a `didSelectOption`
   callback and a `selectViewSelectionDidChange` delegate method that are
   called when the selection changes.

 * [Aphid.UI.Window] Implemented preventTextSelection() and
   allowTextSelection() (from Aphid.UI.Controls.SelectView) for preventing
   and allowing text selection on the document. This is currently only
   supported by WebKit and Gecko-based browsers.

 * [Aphid.UI.Controls.SelectView] Added a SelectViewOption class for managing
   options in the SelectView. All items in a SelectView must now be an
   instance of SelectViewOption (this is similar to the requirements of
   Aphid.UI.ListView).

 * [Aphid.UI.TokenListView] Added a new list view subclass for listing tokens,
   such as filters or recipients.

 * [Aphid.UI.ModalView] Added a modal view class and migrated ViewController's
   presentModalViewController to using the new modal view class.

 * [Aphid.Support.Properties] Renamed "hasProperty" method to simply "has".

 * [Aphid.UI.SplitViewController] Made the split view aware of the differences
   between modes and fixed initialization so that it sets the correct
   secondView position regardless of mode.

 * [Aphid.Model] Disabled asynchronous loading by default, for now.

 * [Aphid.Support.Properties] Added detection for uninitialized properties
   when getting or setting properties with chaining (i.e. "foo.bar.baz").

 * [Aphid.UI.View] Changed the behavior of _addSubview so that we add the
   element to the DOM and hide it with the visibility and opacity properties
   before calling viewWillAppear so that the viewWillAppear callback can
   calculate the added view's position before it appears.

 * [Aphid.UI.TabViewController] Disabled animation by default for new
   TabViewController instances.

 * [Aphid.UI.SplitViewController] Added support for setting the position of
   the split view divider programmatically through the methods setPosition and
   setPositionAnimated.

 * [Aphid.UI.ListView] The willClearSelection and didClearSelection callback
   methods as well as the listViewWillClearSelection and
   listViewDidClearSelection delegate methods are now called when clearing the
   selection of a list view.

 * [Aphid.UI.ListView] Added support for persisting the selected item index in
   a session cookie and restoring that selection when reloading the browser or
   view.

 * [Aphid.Support.Cookie] Added support for cookies with names that include
   square brackets (i.e. "ViewController[identity].property").

 * [Aphid.UI.View] Views are automatically assigned CSS class names for itself
   and all of its superclasses, based on the displayName property of each
   class in the view stack.

 * [Aphid.UI.View] Added support for transitions when setting, adding or
   removing views.

 * [Aphid.UI.View] Added a tagName property (defaults to "section") that is
   used to create an element for the View when a template or element is not
   provided during initialization.

 * [Aphid.UI.View] Prevented the same view from being set as the subview of a
   view if the view is already a subview of that view.

 * [Aphid.UI.SourceListView] Implemented a source list view item that acts as
   a divider (Aphid.UI.DividerSourceListViewItem).

 * [Aphid.UI.SplitViewController] Added a notification that is posted when
   a split view has been resized (SplitViewControllerResizedNotification).

 * [Aphid.UI.SplitViewController] Added callback and delegate calls to the
   split view controller.

 * [Aphid.Support.Object] Implemented Aphid.Support.Object for all Aphid
   subclasses to extend that contains support for common features, such as
   properties and delegates.

 * [Aphid.UI.SplitViewController] Implemented the allowsResize property for
   allowing or disallowing user resizing of the split view.

 * [Aphid.UI.SplitViewController] Significant refactoring of the Split View
   Controller which brought almost all of the code into
   Aphid.UI.SplitViewController which greatly simplifies our integration with
   Aphid and our subclass of Draggable from Scriptaculous.

 * [Vendor/Prototype] Updated to Prototype 1.7.

 * [Aphid.UI.SplitViewController] Fixed persistence support for restoring the
   position of the split view divider upon subsequent reloads.

 * [Aphid.UI.TabViewController] Added support for animation when switching
   between tabs.

 * [Aphid.UI.View] Completed the implementation of the viewWillAppear,
   viewDidAppear, viewWillDisappear and ViewDidDisappear callbacks (including
   tests).

 * [Aphid.UI.View] Fixed an issue where calling setView() with no value would
   throw an error instead of the desired result of simply removing the view.

 * [Aphid.UI.MatrixView] Initial port of MatrixView to Aphid (see
   matrixview.org for more details on the class).

 * [Aphid.UI.SourceListView] Implemented SourceListView and SourceListViewItem
   classes.

 * [Aphid.UI.ListView] Initializing list views from static HTML will now
   honor the data-view-class attribute on <li/> elements for instantiating
   described ListViewItem subclasses.

 * [Aphid.UI.ListView] List views will fall back to operating on the items
   property when either the listViewItemCount or listViewItemForIndex delegate
   methods are not implemented.

 * [Aphid.UI.View] Views will no longer attempt to connect outlets to the view
   when those outlets belong to another view (as determined by a parent
   element with the data-view-class attribute set).

 * [Aphid.Support.Logger] Added persistence to the Aphid.Support.Logger#level
   property so that changing this property manually will persist the level for
   your entire session.

 * [Aphid.UI.View] Set default property values before applying the options
   hash to the View so that property setters may add subviews during
   initialization.

 * [Aphid.UI.View] Initialize views with an empty element when an element,
   template or outlet is not set.

 * [Aphid.UI.ListView] Changed list views to be positioned absolutely within
   their container view.

 * [Aphid.UI.SplitViewController] Added default styles for controllers that
   inherit from split views, as well as 2 additional styles: padded and
   borderless. The additional styles can be set by adding the padded or
   borderless class to the split view.

 * [Aphid.UI.TabViewController] Added support for lazily initializing views
   by specifying the data-view-class attribute on the tab Elements that make
   up the tab view.

 * [Aphid.UI.AlertView] Fixes to animation preferences when displaying and
   dismissing alerts as well as other minor bug fixes, improvements and tests.

 * [Aphid.UI.Window] Added a new property to Window (overlayVisible) for
   determining whether or not the overlay is currently visible as well as
   tests for the overlay functionality.

 * [Aphid.Model] Added a modelDidFailToLoad delegate method for notifying
   delegates of problems that arise during asynchronous loading of models.

 * [Aphid.UI.View] Implemented custom scrollbars for WebKit-based browsers.

 * [Aphid.Support.Extensions] Fixed ordinal suffix output in Date#strftime.

 * [Tools] Added support for compressing JavaScript and CSS build output using
   the YUI Compressor at build time.

 * Added a sample Apache configuration file that that is configured with the
   appropriate caching and compression options for serving Aphid-based
   applications efficiently.

 * [Tools] Added support for appending asset timestamps to any references
   found in templates or stylesheets in order to bust browser caches upon
   publishing new releases.

 * [Tools] Added support for pre-processing the new project skeleton files
   with Erb.

## Version 0.9.2 - November 10th, 2010

 * [Aphid.Support.Properties] Added support for getting or setting chained
   properties (i.e. foo.get("bar.baz.bong") instead of
   foo.get("foo").get("baz").get("bong")).

 * [Aphid.Support.Properties] Added support for computed properties.

 * [Aphid.Model] Added support for properties (Aphid.Support.Properties) on
   instances of Aphid.Model and changed the way that properties are declared
   on models from an array of keys to a hash of keys with an options hash as
   the value.

 * [Aphid.Support] Added Aphid.Support.Properties, a mixin that defines a
   standard accessor and setter pattern for Objects in Aphid.

 * [Tools] Added support for copying any files and folders under Public (in
   the project root) to the Build output folder during builds. This could be
   used for other assets (images, files, etc) that do not fit in to the normal
   Aphid structure.

 * [Tools] Added initial support for publishing the built project output of
   Aphid-based projects by using "rake publish" (publishing is configured in
   the Publish.rb file in the Aphid project root).

 * [General] Added support for Google Chrome Frame.

 * [Aphid.Core.Application] Redirect users of unsupported browsers (Internet
   Explorer 6 only, for now) to a page that explains that we do not support
   their browser and provides a list of supported browsers.

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
