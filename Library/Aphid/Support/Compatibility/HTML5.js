/**
 * class Aphid.Support.Compatibility.HTML5
 *
 * Compatibility code to bring emerging standards support to legacy browsers,
 * such as Internet Explorer.
**/

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
    this.Elements.each(this._createHTML5Element);
  },

  _createElement: function(elementName)
  {
    document.createElement(element);
  }

}
//
// Add support to the browser for the new HTML5 tags. Without this, Internet
// Explorer will not apply any styles to tags it does not recognize.
//
if (Prototype.Browser.IE)
  Aphid.Support.Compatibility.HTML5.createHTML5Elements();
