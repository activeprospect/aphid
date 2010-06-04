//
// Element Extensions for Prototype - Aphid Version <%= APHID_VERSION %>
// Written by Justin Mecham <justin@activeprospect.com>
//

//
// Element#fromString (for Prototype)
//
// Returns a new Element instance from an HTML string.  This is primarily useful
// for accessing the result of a Template evaluation that returns an HTML snippet
// before adding the snippet to the DOM.
//
// Usage:
//
//   var myElement = Element.fromString('<div class="new">Foo</div>');
//
Element.fromString = function(string)
{
  return new Element('div').update(string.trim()).firstChild;
}

Element.addMethods(
  {
    insert: Element.insert.wrap(
      function(insert, element, insertation)
      {
        if (!Object.isArray(insertation))
          return insert(element, insertation);

          element = $(element);
          insertation.each(insert.curry(element));
          return element;
      }
    )
  }
)
