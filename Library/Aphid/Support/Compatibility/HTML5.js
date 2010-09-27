/**
 * class Aphid.Support.Compatibility.HTML5
 *
 * Compatibility code to bring emerging standards support to legacy browsers,
 * such as Internet Explorer.
**/

//= require <excanvas.compiled>
//= require "../Extensions/Vendor/Prototype/Browser"

if (Prototype.Browser.IE7 || Prototype.Browser.IE8)
{

  Aphid.Support.Compatibility.HTML5 = {

    /**
     * Aphid.Support.Compatibility.HTML5.Elements = [ 'abbr', 'article', 'aside', 'audio', 'canvas', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'mark', 'meter', 'nav', 'output', 'progress', 'section', 'summary', 'time', 'video' ]
     *
     * An Array containing the names of each of the elements found in the HTML5
     * specification.
     *
     * `abbr` `article` `aside` `audio` `canvas` `details` `figcaption` `figure`
     * `footer` `header` `hgroup` `mark` `meter` `nav` `output` `progress`
     * `section` `summary` `time` `video`
    **/
    Elements: [
      'abbr', 'article', 'aside', 'audio', 'canvas', 'details', 'figcaption',
      'figure', 'footer', 'header', 'hgroup', 'mark', 'meter', 'nav', 'output',
      'progress', 'section', 'summary', 'time', 'video'
    ],

    /**
     * Aphid.Support.Compatibility.HTML5.createHTML5Elements() -> null
     *
     * Iterates the `Aphid.Support.Compatibility.HTML5_ELEMENTS` array, creating a
     * new element in the document for each, using `document.createElement(...)`.
    **/
    createElements: function()
    {
      this.Elements.each(this._createElement);
    },

    _createElement: function(elementName)
    {
      document.createElement(elementName);
    },

    Element: {

      /**
       * Aphid.Support.Extensions.Compatibility.HTML5.Element#constructor(tagName, attributes) -> Element
       *
       * Custom implementation of the Element constructor (i.e. new Element())
       * implemented by Prototype that prevents element caching from occurring
       * on HTML5 elements, thus preventing a bug where cloned HTML5 elements
       * in IE7 and IE8 are cloned with an empty namespace (i.e. <:section>),
       * breaking CSS styling of those tags.
      **/
      constructor: function(tagName, attributes)
      {
        attributes = attributes || {};
        tagName = tagName.toLowerCase();

        // Do not attempt to cache HTML5 elements
        if (Aphid.Support.Compatibility.HTML5.Elements.include(tagName))
        {
          var element = Element.extend(document.createElement(tagName))
          return Element.writeAttribute(element, attributes);
        }

        var cache = Element.cache;
        if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
        return Element.writeAttribute(cache[tagName].cloneNode(false), attributes);
      },

      ClassMethods: {

        /**
         * Aphid.Support.Extensions.Compatibility.HTML5.Element.ClassMethods#fromString(htmlString) -> Element
         *
         * - htmlString (String): an HTML-formatted string with a single outer
         *   element.
         *
         * An version of our [[Aphid.Support.Extensions.Vendor.Prototype.Element#fromString]]
         * implementation specific to Internet Explorer for converting an HTML
         * string to an Element instance. This version is compatible with
         * Internet Explorer because it uses the updateSafe method to perform
         * its DOM manipulation.
        **/
        fromString: function(htmlString)
        {
          var element = new Element('div').updateSafe(htmlString);
          return element.firstDescendant();
        }

      },

      /**
       * mixin Aphid.Support.Extensions.Vendor.Prototype.Element.Methods
      **/
      Methods: {

        /**
         *  Aphid.Support.Extensions.Compatibility.HTML5.Element.Methods#updateSafe(element, content) -> Element
         *
         * Wraps Prototype's update() method with support for adding HTML5 elements
         * in Internet Explorer. Based on innerShiv by Joe Bartlett (See
         * http://jdbartlett.github.com/innershiv for more details).
        **/
        updateSafe: function(element, string)
        {
          var container = document.createElement("div");
          var fragment  = document.createDocumentFragment();
         /*@cc_on container.style.display = 'none'; @*/

          var content = container.cloneNode(true);
          /*@cc_on document.body.appendChild(content); @*/
          content.innerHTML = string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
          /*@cc_on document.body.removeChild(content); @*/

          var f = fragment.cloneNode(true),
              i = content.childNodes.length;
          while (i--) f.appendChild(content.firstChild);

          element.update(f.firstChild);

          return element;
        }

      }

    }

  }

  //
  // Extend the Element class with some extensions specific to helping IE7
  // and IE8 work with HTML5 tags.
  //
  Object.extend(Element, Aphid.Support.Compatibility.HTML5.Element.ClassMethods);
  Element.addMethods(Aphid.Support.Compatibility.HTML5.Element.Methods);

  //
  // Add support to the browser for the new HTML5 tags. Without this, Internet
  // Explorer will not apply any styles to tags it does not recognize.
  //
  Aphid.Support.Compatibility.HTML5.createElements();

  //
  // Replace the Element constructor implemented by Prototype with our own
  // implementation that prevents element caching for HTML5 elements.
  //
  var originalElement = Element;
  Element = Aphid.Support.Compatibility.HTML5.Element.constructor;
  Object.extend(Element, originalElement || {});
  if (originalElement) Element.prototype = originalElement.prototype;

}
