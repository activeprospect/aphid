/**
 * class Aphid.Support.Logger
 * 
 * Logging utility class for Aphid with support for multiple levels of
 * verbosity.
 *
 * **Usage Example**
 *
 *     var logger = new Aphid.Support.Logger(Aphid.Support.Logger.DEBUG_LEVEL);
 *     logger.info("Loading assets from server", "AssetLoader");
 *     // => "[AssetLoader] Loading assets from server" to the console
 *
**/
Aphid.Support.Logger = Class.create();

/**
 * Aphid.Support.Logger.DEBUG_LEVEL = 4;
 *
 * Displays all messages, including those that are simply for debugging
 * purposes.
**/
Aphid.Support.Logger.DEBUG_LEVEL = 4;

/**
 * Aphid.Support.Logger.INFO_LEVEL = 3;
 * 
 * Displays messages of informational significance, as well as all warning
 * and error messages.
**/
Aphid.Support.Logger.INFO_LEVEL = 3;

/**
 * Aphid.Support.Logger.WARNING_LEVEL = 2;
 * 
 * Displays warning messages that may or may not need attention, as well all
 * error messages.
**/
Aphid.Support.Logger.WARNING_LEVEL = 2;

/**
 * Aphid.Support.Logger.ERROR_LEVEL = 1;
 * 
 * Displays only critical error messages that need attention.
**/
Aphid.Support.Logger.ERROR_LEVEL = 1;

Aphid.Support.Logger.prototype = {

  /**
   * Aphid.Support.Logger#level -> Number
   *
   * A number from 0 to 3 that represents the level of verbosity that should
   * be evaluated when the various instance methods are called. See constants
   * on [[Aphid.Support.Logger]] for available levels.
  **/
  level: false,

  /**
   * new Aphid.Support.Logger([level])
   * 
   * Initializes a new Logger instance with an optional log *level*.
  **/
  initialize: function(level)
  {
    this.level = Object.isUndefined(level) ? Aphid.Support.Logger.INFO_LEVEL : level;
  },

  /**
   * Aphid.Support.Logger#debug(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *debug* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `DEBUG_LEVEL`).
  **/
  debug: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.DEBUG_LEVEL) return;
    if (prefix)
      window.console.debug('[' + prefix + '] ' + message);
    else
      window.console.debug(message);
  },

  /**
   * Aphid.Support.Logger#info(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *info* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `INFO_LEVEL`).
  **/
  info: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.INFO_LEVEL) return;
    if (prefix)
      window.console.info('[' + prefix + '] ' + message);
    else
      window.console.info(message);
  },

  /**
   * Aphid.Support.Logger#warn(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *warn* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `WARNING_LEVEL`).
  **/
  warn: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.WARNING_LEVEL) return;
    if (prefix)
      window.console.warn('[' + prefix + '] ' + message);
    else
      window.console.warn(message);
  },
  
  /**
   * Aphid.Support.Logger#error(message[, prefix]) -> null
   *
   * - message (String): the message to be displayed in the console
   * - prefix (String): an optional prefix to be displayed before the message
   *   that will be wrapped in square brackets (i.e. "\[*prefix*] *message*").
   *
   * Prints the *message* to the console at the *error* level (if
   * [[Aphid.Support.Logger#level]] instance variable is set to at least
   * `ERROR_LEVEL`).
  **/
  error: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.ERROR_LEVEL) return;
    if (prefix)
      window.console.error('[' + prefix + '] ' + message);
    else
      window.console.error(message);
  }

};
