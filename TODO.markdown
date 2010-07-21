# Aphid To-Do List

## Aphid.UI.View

 * Add support for initializing views from outlets with custom templates
   defined as the data-template attribute on the outlet element.

## Aphid.UI.LoadingIndicator

 * Convert to a subclass of Aphid.UI.View.

 * Add tests.

## Aphid.UI.SplitViewController

 * Clean up and document `Aphid.UI.SplitViewController` and move more of the
   logic from the `Draggable` subclass (`Aphid.UI.SplitViewController.Draggable`)
   into delegates or callbacks on `Aphid.UI.SplitViewController`.

 * Add persistence to the SplitViewController so that the last dimensions are
   always used when the view is reloaded.

## Aphid.UI.TabViewController

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
