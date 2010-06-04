//
// String Extensions - Aphid Version <%= APHID_VERSION %>
// Written by Justin Mecham <justin@activeprospect.com>
//

Object.extend(String.prototype,
  {
    lowerCaseFirst: function()
    {
      return this.charAt(0).toLowerCase() + this.substring(1);
    },
    toInt: function()
    {
      return parseInt(this);
    }
  }
);

if (Object.isUndefined(''.trim))
{
  String.prototype.trim = function()
  {
    return this.replace(/^\s+|\s+$/g,"");
  }
  String.prototype.trimLeft = function()
  {
    return this.replace(/^\s+/,"");
  }
  String.prototype.trimRight = function()
  {
    return this.replace(/\s+$/,"");
  }
}
