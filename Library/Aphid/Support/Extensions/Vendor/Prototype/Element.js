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
  fromString: function(string)
  {
    return new Element('div').update(string.trim()).firstChild;
  }

};

Object.extend(Element, Aphid.Support.Extensions.Vendor.Prototype.Element);

/**
 * mixin Aphid.Support.Extensions.Vendor.Prototype.Element.Methods
**/
Aphid.Support.Extensions.Vendor.Prototype.Element.Methods = {

    /**
     * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#getBorderHeight(element) -> Integer
     *
     * - element (Element): The element to get the border height from
     *
     * Returns the cumulative height of the Element's top and bottom borders.
    **/
    getBorderHeight: function(element)
    {
      element = $(element);
      var height = parseInt(element.getStyle('border-top-width'));
      height += parseInt(element.getStyle('border-bottom-width'));
      return height;
    },

    /**
     * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#getBorderWidth(element) -> Integer
     *
     * - element (Element): The element to get the border width from
     *
     * Returns the cumulative width of the Element's left and right borders.
    **/
    getBorderWidth: function(element)
    {
      element = $(element);
      var width = parseInt(element.getStyle('border-left-width'));
      width += parseInt(element.getStyle('border-right-width'));
      return width;
    },

    /**
     * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#getInnerHeight(element) -> Integer
     *
     * - element (Element): The element to get the inner height from
     *
     * Returns the height of the Element without padding or borders.
    **/
    getInnerHeight: function(element)
    {
      element = $(element);
      var height = element.getHeight();
      height -= parseInt(element.getStyle('padding-top'));
      height -= parseInt(element.getStyle('padding-bottom'));
      height -= parseInt(element.getStyle('border-top-width'));
      height -= parseInt(element.getStyle('border-bottom-width'));
      return height;
    },

    /**
     * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#getInnerWidth(element) -> Integer
     *
     * - element (Element): The element to get the inner width from
     *
     * Returns the width of the Element without padding or borders.
    **/
    getInnerWidth: function(element)
    {
      element = $(element);
      var width = element.getWidth();
      width -= parseInt(element.getStyle('padding-left'));
      width -= parseInt(element.getStyle('padding-right'));
      width -= parseInt(element.getStyle('border-left-width'));
      width -= parseInt(element.getStyle('border-right-width'));
      return width;
    },

    /**
     * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#getOuterHeight(element) -> Integer
     *
     * - element (Element): The element to get the outer height from
     *
     * Returns the height of the Element, including any margins.
    **/
    getOuterHeight: function(element)
    {
      element = $(element);
      var height = element.getHeight();
      height += parseInt(element.getStyle('margin-top'));
      height += parseInt(element.getStyle('margin-bottom'));
      return height;
    },

    /**
     * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#getOuterWidth(element) -> Integer
     *
     * - element (Element): The element to get the outer width from
     *
     * Returns the width of the Element, including any margins.
    **/
    getOuterWidth: function(element)
    {
      element = $(element);
      var width = element.getWidth();
      width += parseInt(element.getStyle('margin-left'));
      width += parseInt(element.getStyle('margin-right'));
      return width;
    },

    /**
     * Aphid.Support.Extensions.Vendor.Prototype.Element.Methods#insert() -> Element
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

};

Element.addMethods(Aphid.Support.Extensions.Vendor.Prototype.Element.Methods);
