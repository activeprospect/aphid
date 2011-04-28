/**
 * mixin Aphid.Support.Extensions.String
 *
 * Extensions to the core JavaScript String implementation.
 *
**/
Aphid.Support.Extensions.String = {

  /**
   * Aphid.Support.Extensions.String#attributize() -> String
   *
   * Converts a String from a camelized format to a dasherized format suitable
   * for use as part of an HTML attribute name.
   *
   * Calling this method is equivalent to calling Prototype's `underscore` and
   * `dasherize` methods on the String.
   *
   * #### Example
   *
   *     "multipleSelectionEnabled".attributize();
   *     // => "multiple-selection-enabled"
   *
  **/
  attributize: function()
  {
    return this.underscore().dasherize();
  },

  /**
   * Aphid.Support.Extensions.String#lowerCaseFirst() -> String
   *
   * Converts the first character of a string to its lower-case form, without
   * changing the case of the rest of the string.
  **/
  lowerCaseFirst: function()
  {
    return this.charAt(0).toLowerCase() + this.substring(1);
  },

  /**
   * Aphid.Support.Extensions.String#upperCaseFirst() -> String
   *
   * Converts the first character of a string to its upper-case form, without
   * changing the case of the rest of the string.
  **/
  upperCaseFirst: function()
  {
    return this.charAt(0).toUpperCase() + this.substring(1);
  },

  /**
   * Aphid.Support.Extensions.String#toInt() -> Number
  **/
  toInt: function()
  {
    return parseInt(this, 10);
  },

  /**
   * Aphid.Support.Extensions.Date#toString() -> Date
   *
   * Returns the current String as an instance of Date.
  **/
  toDate: function()
  {
    var date, parts, year, month, day, hours, minutes, seconds, ms;

    // Check for ISO 8601 dates
    if ((parts = this.match(/^([0-9]{4})\-([0-9]{2})\-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.([0-9]{1,3}))?(Z|([\-+0-9:]{6}))$/)))
    {
      date = Date.parse(this);

      if (isNaN(date)) // ISO-8601 Parsing Unsupported...
      {
        year    = parts[1];
        month   = parts[2];
        day     = parts[3];
        hours   = parts[4];
        minutes = parts[5];
        seconds = parts[6];
        ms      = parts[8] || 0;
        tz      = parts[10] || false;

        if (tz)
        {
          var dateString = Date.shortMonthNames[month - 1] + " " + day + ", " + year + " " + hours + ":" + minutes + ":" + seconds + " GMT" + tz.gsub(":", "");
          date = new Date(Date.parse(dateString));
        }
        else
          date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds, ms));
      }
      else
        date = new Date(date);
    }

    // Pass-through all other date formats...
    else
      date = new Date(this.toString());

    return date;
  },

  /**
   * Aphid.Support.Extensions.String#pluralize(count[, plural]) -> String
  **/
  pluralize: function(count, plural)
  {
    if (Object.isUndefined(plural))
      plural = this + 's';
    return (count == 1 ? this + '' : plural);
  },

  /**
   * Aphid.Support.Extensions.String#parseURI() -> Object
   *
   * Parses the String as a URI and returns an Object containing all of its
   * parts.
   *
   * This implementation is based on parseUri 1.2 by Steven Levithan. More
   * information on his implementation may be found at
   * http://blog.stevenlevithan.com/archives/parseuri.
  **/
  parseURI: function()
  {
    var keys         = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
        parser       = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        paramsParser = /(?:^|&)([^&=]*)=?([^&]*)/g,
        uri          = {},
        i            = keys.length,
        match        = parser.exec(this);

    // URI Parts
    while (i--) uri[keys[i]] = match[i] || "";

    // Request Parameters
    uri.params = {};
    uri.query.replace(paramsParser, function($0, $1, $2)
    {
      if ($1) uri.params[$1] = $2;
    });

    return uri;
  }

};

Object.extend(String.prototype, Aphid.Support.Extensions.String);

/**
 * Aphid.Support.Extensions.String.random([length = 10]) -> String
 *
 * Returns a random string of *length* consisting of upper and lower-case
 * letters and numbers.
**/
String.random = function(length)
{
  if (Object.isUndefined(length)) length = 10;
  var chars = $R('a', 'z').toArray().concat($R('A', 'Z').toArray()).concat($R(0, 9).toArray());
  return $R(1, length).inject('', function(m, i) { return m + chars.random(); });
};
