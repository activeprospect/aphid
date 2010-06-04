/**
 * Aphid.Support.Extensions.String
**/
Aphid.Support.Extensions.String = {

  /**
   * Aphid.Support.Extensions.String#lowerCaseFirst() -> String
  **/
  lowerCaseFirst: function()
  {
    return this.charAt(0).toLowerCase() + this.substring(1);
  },

  /**
   * Aphid.Support.Extensions.String#toInt() -> Number
  **/
  toInt: function()
  {
    return parseInt(this);
  }

};

Object.extend(String.prototype, Aphid.Support.Extensions.String);
