/**
 * class Aphid.UI.ViewController
 *
 * You should use view controllers for major views that are responsible for
 * many subviews (including view controller subviews). Situations where a
 * view controller may be desirable over a view would be the main interfaces
 * of a web application.
 *
 * View controllers are typically long-lived and include additional callbacks
 * and delegates that notify the class of view state changes, such as
 * notifying that the view will be displayed or hidden, etc.
 *
 * ### Delegates Methods
 *
 *  - 
 *
**/
Aphid.UI.ViewController = Class.create(Aphid.UI.View,
{

  // isModal: false,

  // -------------------------------------------------------------------------

  initialize: function($super, delegate)
  {
    $super(this.viewName, delegate);
  },

  // Modal View Controllers --------------------------------------------------

  // presentModalViewController: function(viewController)
  // {
  //   viewController.show();
  // },

  // dismissModalViewController: function()
  // {
  //   
  // }

});
