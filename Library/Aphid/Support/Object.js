/**
 * class Aphid.Support.Object
**/

//= require <Aphid/Support/Properties>

Aphid.Support.Object = Class.create({

  /**
   * Aphid.Support.Object#delegate -> Object
   *
   * An object that will receive calls for delegate methods of this class.
  **/
  delegate: false,

  /**
   * Aphid.Support.Object#instanceIdentifier -> Number | false
  **/
  instanceIdentifier: false,

  // Initialization ----------------------------------------------------------

  initialize: function(options)
  {
    // Apply Options to Instance
    Object.applyOptionsToInstance(this, options);

    this.instanceIdentifier = Aphid.Class.instanceCounter++;
  },

  // Notification Proxy Methods ----------------------------------------------

  /**
   * Aphid.Support.Object#addObserver(callback, notificationName[, sender = null]) -> null
   *
   *  - callback (Function): the method reference that will be invoked when
   *    the notification is posted
   *  - notificationName (String): the name of the notification to observe
   *  - sender (Object): an optional object reference to scope observation to
   *
   * Registers an observer that will be notified whenever the notification has
   * been posted anywhere in the application. See [[Aphid.Core.NotificationCenter]]
   * for more information on notifications.
  **/
  addObserver: function(callback, notificationName, sender)
  {
    return $AppDelegate.get("notificationCenter").addObserver(this, callback, notificationName, sender);
  },

  /**
   * Aphid.Support.Object#removeObservers() -> null
   *
   * Removes all registered observers for the object. See [[Aphid.Core.NotificationCenter]]
   * for more information on notifications.
  **/
  removeObservers: function()
  {
    return $AppDelegate.get("notificationCenter").removeObservers(this);
  },

  /**
   * Aphid.Support.Object#removeObserver(notificationName[, sender = null]) -> null
   *
   *  - notificationName (String): the name of the notification to stop
   *    observing
   *  - sender (Object): the sender object to stop observing notifications
   *    matching the notificationName on
   *
   * Removes all registered observers for the object for the given
   * *notificationName* and optional *sender* scope. See [[Aphid.Core.NotificationCenter]]
   * for more information on notifications.
  **/
  removeObserver: function(notificationName, sender)
  {
    return $AppDelegate.get("notificationCenter").removeObserver(this, notificationName, sender);
  },

  /**
   * Aphid.Support.Object#postNotification(notificationName[, info = null]) -> null
   *
   *  - notificationName (String): the notification identifier that is being
   *    posted
   *  - info (Object): additional (optional) information to be passed along
   *    with the notification
   *
   * Posts a notification to the shared notification center on the Application
   * Delegate (if present), which will send the notification to all registered
   * observers of *notificationName*. See [[Aphid.Core.NotificationCenter]]
   * for more information on notifications.
  **/
  postNotification: function(notificationName, info)
  {
    return $AppDelegate.get("notificationCenter").postNotification(notificationName, this, info);
  }

});

// Mixins --------------------------------------------------------------------

Object.extend(Aphid.Support.Object.prototype, Aphid.Support.Properties);
