//
// Application - Aphid Version <%= APHID_VERSION %>
// Written by Justin Mecham <justin@activeprospect.com>
//

//= require <Aphid>

Aphid.Core.Application = Class.create();

Aphid.Core.Application.prototype = {

  // Application Logging
  logLevel: Aphid.Support.Logger.DEBUG_LEVEL,
  logger: false,

  //
  initialize: function()
  {
    this._initializeLogger();
  },

  //
  // Initializes a new Logger instances to be shared by the Application. The
  // Logger instance is accessible as Application.sharedInstance.logger as
  // well as the shortcut $L (i.e. $L.warn("Danger, Will Robinson! Danger!")).
  //
  _initializeLogger: function()
  {
    this.logger = new Aphid.Support.Logger(this.logLevel);
    $L = this.logger;
  }

};
