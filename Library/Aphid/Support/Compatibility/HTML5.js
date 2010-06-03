
//= require <prototype>

//
// Add support to the browser for the new HTML5 tags. Without this, Internet
// Explorer will not apply any styles to tags it does not recognize.
//
if (Prototype.Browser.IE)
{
  HTML5_ELEMENTS = [
    'abbr', 'article', 'aside', 'audio', 'canvas', 'details', 'figcaption',
    'figure', 'footer', 'header', 'hgroup', 'mark', 'meter', 'nav', 'output',
    'progress', 'section', 'summary', 'time', 'video'
  ].each(function(element) { document.createElement(element) });
}
