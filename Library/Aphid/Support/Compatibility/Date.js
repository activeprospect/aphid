/**
 * Aphid.Support.Compatibility.Date
**/

if (Object.isUndefined(Date.now))
{
  Date.now = function()
  {
    return new Date().getTime();
  };
}
