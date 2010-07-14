/**
 * class Aphid.Support.Cookie
 * 
 * A utility class for simplifying the management of browser cookies. This
 * class is also aliased as the `$C` global (i.e. `$C.get('someCookie')`).
 *
 * **Setting a Session Cookie**
 *
 * Cookies set without an expiration date are session cookies and will be
 * expired when the user closes their browser.
 *
 *     Aphid.Support.Cookie.set("someCookie", "someValue");
 *     // => "someCookie=someValue"
 *
 * **Setting a Cookie w/Expiration**
 *
 * An expiration date may be specified, in number of days, as the third
 * parameter to the `set` method. You may also use a float as the expiration
 * to denote partial days (i.e. 2.5).
 *
 *     Aphid.Support.Cookie.set("someCookie", "someValue", 2.5);
 *     // => "someCookie=someValue; expires=Sat, 03 Jul 2010 05:41:45 GMT"
 *
 * **Reterieving Cookies**
 *
 * You may retrieve the cookie value by name. If the cookie is not set, null
 * will be returned.
 *
 *     Aphid.Support.Cookie.get("someCookie");
 *     // => "someValue"
 *
**/

// TODO Add support for setting and retrieving JSON cookies...

Aphid.Support.Cookie = {

  /**
   * Aphid.Support.Cookie.set(name, value[, daysToExpire]) -> String
   *
   * - name (String): the name of the cookie
   * - value (String): the value to be set in the cookie
   * - daysToExpire (Integer): the optional number of days before the cookie
   *   should expire
   *
   * Sets a browser cookie with the provided *name* and *value*. If
   * *daysToExpire* has not been provided, the cookie will be valid for the
   * current browser session only.
   *
   * This method returns the cookie string as it was sent to the browser.
  **/
  set: function(name, value, daysToExpire)
  {
    var expire = '';
    if (!Object.isUndefined(daysToExpire))
    {
      var date = new Date()
      date.setTime(date.getTime() + (86400000 * parseFloat(daysToExpire)));
      expire = '; expires=' + date.toGMTString();
    }
    return (document.cookie = escape(name) + '=' + (value || '') + expire);
  },

  /**
   * Aphid.Support.Cookie.get(name) -> String | false
   *
   * - name (String): the name of the cookie
   *
   * Attempts to return the cookie value by looking it up by name. If a cookie
   * could not be located, _false_ will be returned so that you may simply
   * check the existence of a cookie with `if (Aphid.Support.Cookie.get('cookieName')) { ... }`.
  **/
  get: function(name)
  {
    var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'));
    return (cookie ? cookie[2] : false);
  },

  /**
   * Aphid.Support.Cookie.erase(name) -> String | false
   *
   * - name (String): the name of the cookie
   *
   * Erases a previously set cookie and returns the value of the cookie that
   * was erased. If a cookie could not be located, _false_ will be returned.
  **/
  erase: function(name)
  {
    var cookie = Aphid.Support.Cookie.get(name) || false;
    Aphid.Support.Cookie.set(name, '', -1);
    return cookie;
  },

  /**
   * Aphid.Support.Cookie.acceptsCookies(name) -> Boolean
   *
   * Tests the browser for cookie support.
  **/
  acceptsCookies: function()
  {
    if (typeof navigator.cookieEnabled == 'boolean')
      return navigator.cookieEnabled;
    Cookie.set('_test', '1');
    return Cookie.erase('_test') != false;
  }

}

$C = Aphid.Support.Cookie;
