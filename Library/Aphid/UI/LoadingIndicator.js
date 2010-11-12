/**
 * class Aphid.UI.LoadingIndicator
 *
 * Manages the display of a canvas-based spinning loading indicator.
**/

// TODO Make this a subclass of Aphid.UI.View...

Aphid.UI.LoadingIndicator = Class.create({

  displayName: "Aphid.UI.LoadingIndicator",

  /*
   * Aphid.UI.LoadingIndicator#_canvas -> Element
   *
   * The canvas element where the loading indicator is drawn.
   */
  _canvas: false,

  /*
   * Aphid.UI.LoadingIndicator#_canvas -> Element
   *
   * The canvas context for the loading indicator.
  **/
  _context: false,

  /**
   * Aphid.UI.LoadingIndicator#barCount -> Integer
   *
   * The number of bars that should be drawn in the spinner. Defaults to 10.
  **/
  barCount: false,

  /**
   * Aphid.UI.LoadingIndicator#barSize -> Object
   *
   * The width and height of the bars. Defaults to `{ width: 4, height: 12 }`.
  **/
  barSize: false,

  /**
   * Aphid.UI.LoadingIndicator#barColor -> String
  **/
  barColor: false,

  /**
   * Aphid.UI.LoadingIndicator#centerPosition -> Object
   *
   * The x and y coordinates for the center point of the loading indicator
   * within the canvas. This should typically be the canvas width and height
   * divided by 2.
  **/
  centerPosition: false,

  /**
   * Aphid.UI.LoadingIndicator#innerRadius -> Integer
   *
   * The inner radius of the spinning indicator. Each bar will be drawn from
   * this point, outward.
  **/
  innerRadius: false,

  /**
   * Aphid.UI.LoadingIndicator#isAnimating -> Boolean
   *
   * Whether or not the loading indicator is currently animating.
  **/
  isAnimating: false,

  /*
   * Aphid.UI.LoadingIndicator#_currentOffset -> Integer
   *
   * Whether or not the loading indicator is currently animating.
   */
  _currentOffset: 0,

  /**
   * new Aphid.UI.LoadingIndicator()
   *
   * Initializes a new instance of the Loading Indicator.
  **/
  initialize: function()
  {
    $L.info('Initializing...', this);

    // Set Defaults
    this.barCount       = 10;
    this.barSize        = { width: 4, height: 12 };
    this.centerPosition = { x: 48, y: 48 };
    this.innerRadius    = 10;

    // Initialize the canvas
    // TODO Size needs to be configurable
    this._canvas = new Element("canvas",
      {
        id: "loadingIndicator",
        width: 96,
        height: 96
      }
    );

    // If ExplorerCanvas is present, initialize the canvas element with it for
    // compatibility with Internet Explorer
    if (!(typeof G_vmlCanvasManager == 'undefined'))
      G_vmlCanvasManager.initElement(this._canvas);

    this._context = this._canvas.getContext("2d")
    Element.insert(document.body, this._canvas);
    this._canvas.hide();

    var color = $(this._canvas).getStyle('color');
    if (color)
    {
      colors = color.split(',');
      red    = parseInt(colors[0].substr(4, 3));
      green  = parseInt(colors[1]);
      blue   = parseInt(colors[2]);
      this.barColor = { red: red, green: green, blue: blue };
    }
    else this.barColor = { red: 85, green: 85, blue: 85 };
  },

  /**
   * Aphid.UI.LoadingIndicator#show() -> null
   *
   * Shows the loading indicator with a fade-in transition.
  **/
  show: function()
  {
    if (this.isAnimating) return;

    $L.info('Showing the loading indicator...', this);

    this._startAnimation();
    var opacity = $(this._canvas).getStyle('opacity');
    this._canvas.appear({ duration: 0.2, to: opacity });
  },

  /**
   * Aphid.UI.LoadingIndicator#hide() -> null
   *
   * Hides the loading indicator with a quick, fade-out transition.
  **/
  hide: function()
  {
    $L.info('Hiding the loading indicator...', this);
    this._canvas.fade({ duration: 0.2 });
    this._stopAnimation.bind(this).delay(0.2);
  },

  /*
   * Aphid.UI.LoadingIndicator#_startAnimation() -> null
   *
   * Starts the loading indicator animation.
   */
  _startAnimation: function()
  {
    this.isAnimating = true;
    this._animateNextFrame(0);
  },

  /*
   * Aphid.UI.LoadingIndicator#_stopAnimation() -> null
   *
   * Stops drawing the loading indicator and clears its context state.
   */
  _stopAnimation: function()
  {
    this.isAnimating = false;
    this._clearFrame(this._context);
  },

  /*
   * Aphid.UI.LoadingIndicator#_draw(context, offset) -> null
   */
  _draw: function(context, offset)
  {
    this._clearFrame(context);
    context.save();
    context.translate(this.centerPosition.x, this.centerPosition.y);
    for (var i = 0; i < this.barCount; i++)
    {
      var currentBar = (offset + i) % this.barCount,
          pos        = this._calculatePosition(currentBar);
      context.save();
      context.translate(pos.x, pos.y);
      context.rotate(pos.angle);
      this._drawBlock(this._context, i);
      context.restore();
    }
    context.restore();
  },

  /*
   * Aphid.UI.LoadingIndicator#_drawBlock(context, barNumber) -> null
   */
  _drawBlock: function(context, barNumber)
  {
    context.fillStyle = this._makeRGBA(this.barColor.red, this.barColor.green, this.barColor.blue, (this.barCount + 1 - barNumber) / (this.barCount + 1));
    context.fillRect(-this.barSize.width / 2, 0, this.barSize.width, this.barSize.height);
  },

  /*
   * Aphid.UI.LoadingIndicator#_animateNextFrame() -> null
   */
  _animateNextFrame: function()
  {
    if (!this.isAnimating) return;
    this._currentOffset = (this._currentOffset + 1) % this.barCount;
    this._draw(this._context, this._currentOffset);
    this._animateNextFrame.bind(this).delay(0.05);
  },

  /*
   * Aphid.UI.LoadingIndicator#_clearFrame() -> null
   */
  _clearFrame: function(context)
  {
    context.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
  },

  /*
   * Aphid.UI.LoadingIndicator#_calculateAngle(barNumber) -> Float
   */
  _calculateAngle: function(barNumber)
  {
    return 2 * barNumber * Math.PI / this.barCount;
  },

  /*
   * Aphid.UI.LoadingIndicator#_calculatePosition(barNumber) -> Object
   */
  _calculatePosition: function(barNumber)
  {
    var angle = this._calculateAngle(barNumber);
    return {
      y: (this.innerRadius * Math.cos(-angle)),
      x: (this.innerRadius * Math.sin(-angle)),
      angle: angle
    };
  },

  // TODO Move this to Aphid.Support
  _makeRGBA: function()
  {
    return "rgba(" + [].slice.call(arguments, 0).join(",") + ")";
  }

});
