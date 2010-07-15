/**
 * Aphid.Support.Extensions.String
 *
 * Extensions to the core JavaScript String implementation.
 *
**/
Aphid.Support.Extensions.String = {

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
    return parseInt(this);
  },

  /**
   * Aphid.Support.Extensions.String#pluralize(count[, plural]) -> String
  **/
  pluralize: function(count, plural)
  {
    if (Object.isUndefined(plural))
      plural = this + 's';
    return (count == 1 ? this + '' : plural);
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
  return $R(1, length).inject('', function(m, i) { return m + chars.random() });
}
