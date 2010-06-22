//
// Loading Indicator Component
//
// This component manages the display of a loading indicator, which is
// implemented with the HTML 5 canvas tag.
//
// To display the loading indicator, simply call LoadingIndicator.show()
// anywhere on your site (after including this file, of course). Calling
// LoadingIndicator.hide() will cause the indicator to fade out and stop
// animating.
//
// Adapted for Prototype by Justin Mecham from the examples at:
//   http://starkravingcoder.blogspot.com/2007/09/canvas-loading-indicator.html
// 

var loadingIndicator;
var LoadingIndicator = Class.create();

//
// Class Methods
//
LoadingIndicator.show = function() { loadingIndicator.show(); }
LoadingIndicator.hide = function() { loadingIndicator.hide(); }

//
// Class Definition
//
LoadingIndicator.prototype = {

  // Canvas
  canvas: null,
  context: null,

  // Spinner Options
  bars: null,
  barSize: null,
  barColor: null,
  center: null,
  innerRadius: null,

  // Internal State
  _animating: false,
  _currentOffset: 0,

  initialize: function()
  {

    this._log('Initializing...');

    // Initialize the canvas
    this.canvas = new Element("canvas",
      {
        id: "loadingIndicator",
        width: 96,
        height: 96
      }
    );

    // Internet Explorer / Explorer Canvas
    if (!(typeof G_vmlCanvasManager == 'undefined'))
      G_vmlCanvasManager.initElement(this.canvas);

    this.context = this.canvas.getContext("2d")
    Element.insert(document.body, this.canvas);
    this.canvas.hide()


    // Initialize the Controller
    this.bars = 10
    this.barSize = { width: 4, height: 12 }

    var color = $(this.canvas).getStyle('color')
    if (color)
    {
      colors = color.split(',')
      red = parseInt(colors[0].substr(4, 3))
      green = parseInt(colors[1])
      blue = parseInt(colors[2])
      this.barColor = { red: red, green: green, blue: blue }
    }
    else this.barColor = { red: 85, green: 85, blue: 85 }
    this.center = { x: 48, y: 48}
    this.innerRadius = 10
  },

  //
  // Shows the loading indicator with a fade-in transition.
  //
  show: function()
  {
    if (this._animating) return;

    this._log('Showing the loading indicator...');

    this._startAnimation()
    var opacity = $(this.canvas).getStyle('opacity')
    this.canvas.appear({ duration: 0.35, to: opacity })
  },

  //
  // Hides the loading indicator with a quick fade-out transition.
  //
  hide: function()
  {
    this._log('Hiding the loading indicator...');

    this.canvas.fade({ duration: 0.15 })
    this._stopAnimation.bind(this).delay(0.15)
  },

  //
  // Private API
  //

  _stopAnimation: function()
  {
    this._animating = false
    this._clearFrame(this.context)
  },

  _startAnimation: function()
  {
    this._animating = true
    this._animateNextFrame(0)
  },

  _draw: function(context, offset)
  {
    this._clearFrame(context)
    context.save()
    context.translate(this.center.x, this.center.y)
    for(var i = 0; i < this.bars; i++)
    {
      var currentBar = (offset + i) % this.bars,
          pos        = this._calculatePosition(currentBar)
      context.save()
      context.translate(pos.x, pos.y)
      context.rotate(pos.angle)
      this._drawBlock(this.context, i)
      context.restore()
    }
    context.restore()
  },

  _drawBlock: function(context, barNumber)
  {
    context.fillStyle = this._makeRGBA(this.barColor.red, this.barColor.green, this.barColor.blue, (this.bars + 1 - barNumber) / (this.bars + 1));
    context.fillRect(-this.barSize.width / 2, 0, this.barSize.width, this.barSize.height);
  },

  _animateNextFrame: function()
  {
    if (!this._animating) return;
    this._currentOffset = (this._currentOffset + 1) % this.bars;
    this._draw(this.context, this._currentOffset);
    this._animateNextFrame.bind(this).delay(0.05);
  },

  _clearFrame: function(context)
  {
    context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
  },

  _calculateAngle: function(barNumber)
  {
    return 2 * barNumber * Math.PI / this.bars;
  },

  _calculatePosition: function(barNumber)
  {
    var angle = this._calculateAngle(barNumber);
    return {
      y: (this.innerRadius * Math.cos(-angle)),
      x: (this.innerRadius * Math.sin(-angle)),
      angle: angle
    };
  },

  _makeRGBA: function()
  {
    return "rgba(" + [].slice.call(arguments, 0).join(",") + ")"
  },

  // -------------------------------------------------------------------------

  _log: function(message, level)
  {
    if (!window.console) return;
    if (Object.isUndefined(level)) level = 'log';
    eval('window.console.' + level + '("[LoadingIndicator] ' + message + '")');
  }

}

//
// Initialize Loading Indicator
//

Event.observe(document, 'dom:loaded',
  function(event)
  {

    // Initialize Loading Indicator
    loadingIndicator = new LoadingIndicator();

    // Register for AJAX Callbacks
    Ajax.Responders.register(
      {
        onCreate: LoadingIndicator.show,
        onComplete: LoadingIndicator.hide
      }
    );
  }
);