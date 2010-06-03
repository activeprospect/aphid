//
// Logger - Aphid Version <%= APHID_VERSION %>
// Written by Justin Mecham <justin@activeprospect.com>
//

//= require <Aphid>

Aphid.Support.Logger = Class.create();

Aphid.Support.Logger.DEBUG_LEVEL   = 4;
Aphid.Support.Logger.INFO_LEVEL    = 3;
Aphid.Support.Logger.WARNING_LEVEL = 2;
Aphid.Support.Logger.ERROR_LEVEL   = 1;

Aphid.Support.Logger.prototype = {

  level: false,

  initialize: function(level)
  {
    this.level = Object.isUndefined(level) ? Aphid.Logger.INFO_LEVEL : level;
  },

  debug: function(message, sender)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.DEBUG_LEVEL) return;
    if (sender)
      window.console.debug('[' + sender + '] ' + message);
    else
      window.console.debug(message);
  },

  info: function(message, sender)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.INFO_LEVEL) return;
    if (sender)
      window.console.info('[' + sender + '] ' + message);
    else
      window.console.info(message);
  },

  warn: function(message, sender)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.WARNING_LEVEL) return;
    if (sender)
      window.console.warn('[' + sender + '] ' + message);
    else
      window.console.warn(message);
  },
  
  error: function(message, sender)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.ERROR_LEVEL) return;
    if (sender)
      window.console.error('[' + sender + '] ' + message);
    else
      window.console.error(message);
  }

};
