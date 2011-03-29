/**
 * Aphid.Support.Compatibility.Window
**/

if (Object.isUndefined(window.stop))
{
  window.stop = function()
  {
    try {
      document.executeCommand("Stop");
    }
    catch(err) {}
  }
}
