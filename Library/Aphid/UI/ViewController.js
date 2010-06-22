//
// View Class & Base View Object
//
// All Views should extend this class.
//

Aphid.UI.ViewController = Class.create(Aphid.UI.View,
{

  isModal: false,

  // -------------------------------------------------------------------------

  initialize: function($super, delegate)
  {

    $super(this.viewName, delegate);

    // Load the View
    // if (this.viewName)
    // {
    //   this.view = new View(this.viewName);
    //   // this._connectToOutlets();
    //   // this._wireActionsToInstance();
    // }

  },

  // Modal View Controllers --------------------------------------------------

  presentModalViewController: function(viewController)
  {
    viewController.show();
  }

});
