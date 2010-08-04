# Aphid To-Do List

## Documentation

 * Add overview documentation on how to start a new project with Aphid that
   covers both initialization scenarios: fully dynamic and asynchronous and
   from a static document.

 * Copy all of the inline TODOs to TODO.markdown.

## Compatibility

 * Ensure compatibility with Internet Explorer 7+.

 * Ensure compatibility with Firefox 3+.

## Tools

 * Add an `aphid` command-line tool for starting new Aphid projects or for
   applying Aphid to a Rails or other type of project.

 * Add a rake task for creating gem packages of Aphid (that would include the
   `aphid` command for easy project setup).

 * Add a rake task for creating release packages of Aphid.

## Library

### Aphid.Support.Logger

 * Make the Logger accept an object as the optional second parameter and
   implement a protocol that Aphid classes should respond to identify(), which
   will return an identification string for the message that was logged (i.e.
   "[Aphid.UI.SplitViewController - MySplitViewController] _Log Message_").

### Aphid.UI.View

 * Add support for initializing views from outlets with custom templates
   defined as the data-template attribute on the outlet element.

### Aphid.UI.LoadingIndicator

 * Convert to a subclass of Aphid.UI.View.

 * Add tests.

### Aphid.UI.SplitViewController

 * Clean up and document `Aphid.UI.SplitViewController` and move more of the
   logic from the `Draggable` subclass (`Aphid.UI.SplitViewController.Draggable`)
   into delegates or callbacks on `Aphid.UI.SplitViewController`.

 * Add persistence to the SplitViewController so that the last dimensions are
   always used when the view is reloaded.

 * Allow min-width/max-width to be enforced on the right pane.

 * Automatically detect vertical or horizontal constraint based on the
   absolute position characteristics (i.e. if both have top: 0 we can assume
   its a vertical split, or if both have left: 0 we can assume its horizontal).

 * Automatically position and size the drag handle based on the following
   formulas:

   * Vertical Split Views: (secondView.left - (firstView.left + firstView.width + (firstView.borderWidth * 2)))
   * Horizontal Split Views: (secondView.top - (firstView.top + firstView.height + (firstView.borderWidth * 2)))

 * Fix issue where the drag handle isn't moved centered (set background of
   dragHandle to red to illustrate).

 * Implement double-click support (both with a callback and default behavior
   minimizing the first pane).

### Aphid.UI.TabViewController

 * Add support for switching between content sets. The current implementation
   only registers for events and manages the delegate calls to make the
   delegate aware that the tab view changed, leaving the content switching up
   to the delegate. This class needs to be able to stand on its own.

 * Split `Aphid.UI.TabViewController` into `Aphid.UI.TabView`, for managing tab
   views themselves, and `Aphid.UI.TabViewController` for using a TabView as a
   full view controller.

 * Investigate the possibility of subclassing `Aphid.UI.ListView` for a
   `Aphid.UI.TabView` subclass. A tab view is basically a list that requires
   selection support, which is something that `Aphid.UI.ListView` already does,
   therefore, the two classes are already very similar. Another option would
   be to extract the list selection functionality into a mixin that can be
   included in both classes.

 * Add tests for selection persistence.
