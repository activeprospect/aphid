/**
 * class Aphid.Core.NotificationCenter
 * 
 * The [[Aphid.Core.NotificationCenter]] object (or simply, *notification
 * center*) provides a mechanism for broadcasting information within an
 * application.
 *
 * ### Definitions
 *
 *  - A **notification** is simply a message that is sent to any registered
 *    *observers* that includes the *sender* of the notification as well as
 *    any optional *info* that pertains to the notification.
 *
 *  - The object instance that is listening for notifications is known as an
 *    **observer**.
 *
 *  - The object instance that posts a notification is known as a **sender**.
 *
 *  - When a notification has been posted, the **callback** method on each
 *    registered *observer* will be invoked with the *sender* and *info*
 *    objects as arguments.
 *
 *  - Notifications are identified by a **notificationName** string, such as
 *    *SelectionChangedNotification* or *SplitViewResizedNotification*.
 *
 * ### Registering an Observer
 *
 * Registering for an observer should be performed
 * only once your object is able to handle the notifications it will receive.
 * In the case of a View, in the following example, you will want to do this
 * after your view has finished loading if you will be updating the view as
 * a result of the notification.
 *
 * In the following example, we have a view that displays the last access
 * timestamp of a User. This view is not the delegate that is responsible for
 * loading a User instance, therefore, it must be informed by the delegate
 * when the user has reloaded so that the timestamp may be updated.
 * 
 *     var UserActivityView = Class.create(Aphid.UI.View, {
 *       ...
 *       lastAccessLabel: false,
 *       viewDidLoad: function()
 *       {
 *         $AppDelegate.notificationCenter.addObserver(this,
 *           this.handleUserReloadNotification,
 *           "UserReloadedNotification");
 *       },
 *       handleUserReloadNotification: function(sender, info)
 *       {
 *         // Update the "Last Access" label, in case it has changed...
 *         this.lastAccessLabel.update(sender.lastAccessTimestamp);
 *       }
 *       ...
 *     });
 *
 * ### Posting a Notification
 *
 * Posting a notification works by calling [[Aphid.Core.NotificationCenter#postNotification]]
 * with the name of the notification, the object that is sending the notification
 * and any additional info pertinent to the notification (optional).
 *
 * In our example above, we registered to be notified when a
 * UserReloadedNotification was posted. In our User model, we can post this
 * notification in the afterReload() method. Since the notification message
 * sent to the registered observer includes the instance of the model as the
 * *sender* argument, we don't need to provide any additional *info* since
 * this is a simple reload operation.
 *
 *     var User = Class.create(Aphid.Model, {
 *       ...
 *       afterReload: function()
 *       {
 *         $AppDelegate.notificationCenter.postNotification("UserReloadedNotification", this);
 *       }
 *       ...
 *     });
 *
 * Now, whenever the User instance is reloaded (using the reload() method)
 * from anywhere in the application (such as a View Controller), the
 * `handleUserReloadNotification` method on our UserActivityView will be
 * called, allowing us to ensure that visible user interface always reflects
 * the latest known "Last Access" timestamp of the User.
**/

Aphid.Core.NotificationCenter = Aphid.Class.create("Aphid.Core.NotificationCenter", {

  /**
   * Aphid.Core.NotificationCenter#observers -> Hash
   *
   * A Hash map of all registered observers keyed by *notificationName*.
  **/
  observers: false,

  /**
   * new Aphid.Core.NotificationCenter()
   *
   * Initializes a new instance of the notification center.
  **/
  initialize: function()
  {
    this.observers = $H();
  },

  /**
   * Aphid.Core.NotificationCenter#addObserver(observer, callback, notificationName[, sender = null]) -> null
   *
   *  - observer (Object): the object that is requesting to observe for
   *    notifications
   *  - callback (Function): the method reference that will be invoked when
   *    the notification is posted
   *  - notificationName (String): the name of the notification to observe
   *  - sender (String): an optional object reference to scope observation to
   *
   * Registers an observer that will be notified whenever the notification has
   * been posted anywhere in the application.
  **/
  addObserver: function(observer, callback, notificationName, sender)
  {
    var registeredNotification = this.observers.get(notificationName);
    if (!registeredNotification)
      registeredNotification = this.observers.set(notificationName, $A());

    registeredNotification.push($H({
      observer: observer,
      callback: callback,
      sender: sender
    }));

    $L.info("Registered as an observer for \"" + notificationName + "\" notifications", observer);
  },

  /**
   * Aphid.Core.NotificationCenter#removeObservers(observer) -> null
   *
   *  - observer (Object): the object whose registered observers should be
   *    removed
   *
   * Removes all registered observers for the observing object passed as
   * *observer*.
  **/
  removeObservers: function(observer)
  {
    this.observers.each(function(pair) {
      var notificationName = pair.key,
          observers = pair.value;
      observers.each(function(notification) {
        if (notification.get("observer") == observer)
        {
          observers.remove(notification);
          $L.info("Stopped observing for \"" + notificationName + "\" notifications", observer);
        }
      }, this);
    });
  },

  /**
   * Aphid.Core.NotificationCenter#removeObserver(observer, notificationName[, sender = null]) -> null
   *
   *  - observer (Object): the object whose registered observers should be
   *    removed
   *  - notificationName (String): the name of the notification to stop
   *    observing
   *  - sender (Object): the sender object to stop observing notifications
   *    matching the notificationName on
   *
   * Removes all registered observers for the observing object passed as
   * *observer* for the given *notificationName* and optional *sender* scope.
  **/
  removeObserver: function(observer, notificationName, sender)
  {
    var observers = this.observers.get(notificationName);
    if (!observers) return;

    observers.each(function(notification) {
      if (sender && notification.get("sender") == sender && notification.get("observer") == observer)
      {
        observers.remove(notification);
        $L.info("Stopped observing for \"" + notificationName + "\" notifications", observer);
      }
      else if (notification.get("observer") == observer)
      {
        observers.remove(notification);
        $L.info("Stopped observing for \"" + notificationName + "\" notifications", observer);
      }
    }, this);
  },

  /**
   * Aphid.Core.NotificationCenter#postNotification(notificationName, sender[, info = null]) -> null
   *
   *  - notificationName (String): the notification identifier that is being
   *    posted
   *  - sender (Object): the object that is responsible for sending the
   *    notification
   *  - info (Object): additional (optional) information to be passed along
   *    with the notification
   *
   * Posts a notification to the notification center, which will send the
   * notification to all registered observers of *notificationName*.
  **/
  postNotification: function(notificationName, sender, info)
  {
    var observers = this.observers.get(notificationName);
    if (!observers) return;

    $L.info("Posted Notification \"" + notificationName + "\"", sender);

    observers.each(function(notification) {
      var observedSender = notification.get("sender");
      var observer = notification.get("observer");
      var callback = notification.get("callback");

      // Don't send a notification message to observers that are observing a
      // specific sender, unless the sender matches.
      if (observedSender && sender != observedSender)
        return;

      // Call the defined callback with the sender and info as arguments.
      callback.call(observer, sender, info);
    });
  }

});
