/**
 * mixin Aphid.Support.Extensions.Vendor.Prototype.Element
**/

Aphid.Support.Extensions.Vendor.Prototype.Element = {

  /**
   * Aphid.Support.Extensions.Vendor.Prototype.Element#fromString(htmlString) -> Element
   *
   * - htmlString (String): an HTML-formatted string with a single outer
   *   element.
   *
   * Returns a new Element instance from an HTML string.  This is primarily
   * useful for accessing the result of a Template evaluation that returns an
   * HTML snippet before adding the snippet to the DOM.
   *
   * **Example**
   *
   *     var myElement = Element.fromString('<div class="new">Foo</div>');
   *     // => Element
   *
  **/
  Element.fromString = function(string)
  {
    return new Element('div').update(string.trim()).firstChild;
  }

};

/**
 * mixin Aphid.Support.Extensions.Vendor.Prototype.Element.Methods
**/
Aphid.Support.Extensions.Vendor.Prototype.Element.Methods = {

  /**
   * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#insert -> Element
   * 
   * Adds support for inserting an Array of Elements
  **/
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
Element.addMethods(Aphid.Support.Extensions.Vendor.Prototype.Element.Methods);
