/**
 * class MainViewController < Aphid.UI.ViewController
 *
 * This view controller is responsible for rendering the overall application
 * interface and managing the display of the view controllers that make up
 * this application.
 *
 * Customize or replace this view controller with your own.
**/
var MainViewController = Class.create(Aphid.UI.ViewController, {

  // View Configuration
  displayName: 'MainViewController',
  template: 'MainView',

  // Outlets
  label: false,

  // View Callbacks ----------------------------------------------------------

  viewDidLoad: function($super)
  {
    $super();
    this.get("label.element").update("Hello, world!");
  }

});
