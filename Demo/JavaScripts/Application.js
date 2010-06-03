//
// Application
// Sample Application
//
// ...
//

var Application = Class.create(Aphid.Core.Application, {

  name: 'Sample Application',
  version: '1.0',

  initialize: function($super)
  {
    $super();
  }

});

Application.sharedInstance = false;
Application.initialize = function()
{
  Application.sharedInstance = new Application();
}

document.observe('dom:loaded', Application.initialize);
