/**
 * Aphid.Support.Extensions.Object
 *
 * Extensions to the core JavaScript Object implementation.
**/
Aphid.Support.Extensions.Object = {

  /**
   * Aphid.Support.Extensions.Object.isEvent() -> Boolean
   *
   * Returns true if the object is an Event (i.e. MouseEvent, KeyEvent, etc).
  **/
  isEvent: function(object)
  {
    return Object.isArray(object.toString().match('Event'));
  }

}

Object.extend(Object, Aphid.Support.Extensions.Object);
