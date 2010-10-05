/**
 * class Application < Aphid.Core.Application
 *
 * The application delegate for the application. This class will automatically
 * be initialized by Aphid once the request has finished loading.
**/

//= require "Controllers/MainViewController"

var Application = Class.create(Aphid.Core.Application, {

  mainViewController: false,

  initialize: function($super)
  {
    $super();

    //
    // This method will be called by Aphid automatically when the page is
    // loading. Add to this method if you need to do any other initialization
    // before the Aphid framework is fully initialized.
    //
  },

  applicationDidFinishInitialization: function()
  {
    //
    // This method is called after the application has finished initializing.
    // You should initialize and add your primary view controller to the
    // browser window in this callback.
    //
    this.mainViewController = new MainViewController({ delegate: this });
    if (this.mainViewController.isLoaded)
      this.mainWindow.addSubview(this.mainViewController);
  }

});
