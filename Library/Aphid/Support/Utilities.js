
/**
 * resolveClassName(className) -> Function
**/
function resolveClassName(className)
{
  var namespaces = className.split("."),
      implementation = window;
  for (var i = 0; i < namespaces.length; i++)
    implementation = implementation[namespaces[i]];
  return implementation;
}
