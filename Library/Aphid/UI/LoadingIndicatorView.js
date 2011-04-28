/**
 * class Aphid.UI.LoadingIndicatorView
 *
 * Manages the display of a canvas-based spinning loading indicator.
**/

Aphid.UI.LoadingIndicatorView = Aphid.Class.create("Aphid.UI.LoadingIndicatorView", Aphid.UI.View, {

  /*
   * Aphid.UI.LoadingIndicatorView#canvasElement -> Element
   *
   * The canvas element where the loading indicator is drawn.
   */
  canvasElement: false,

  /*
   * Aphid.UI.LoadingIndicatorView#canvasContext -> Element
   *
   * The canvas context for the loading indicator.
   */
  canvasContext: false,

  /**
   * Aphid.UI.LoadingIndicatorView#barCount -> Number
   *
   * The number of bars that should be drawn in the spinner. Defaults to 10.
  **/
  barCount: false,

  /**
   * Aphid.UI.LoadingIndicatorView#barSize -> Object
   *
   * The width and height of the bars. Defaults to `{ width: 4, height: 12 }`.
  **/
  barSize: false,

  /**
   * Aphid.UI.LoadingIndicatorView#barColor -> String
  **/
  barColor: false,

  /**
   * Aphid.UI.LoadingIndicatorView#centerPosition -> Object
   *
   * The x and y coordinates for the center point of the loading indicator
   * within the canvas. This should typically be the canvas width and height
   * divided by 2.
  **/
  centerPosition: false,

  /**
   * Aphid.UI.LoadingIndicatorView#innerRadius -> Number
   *
   * The inner radius of the spinning indicator. Each bar will be drawn from
   * this point, outward.
  **/
  innerRadius: false,

  /**
   * Aphid.UI.LoadingIndicatorView#isAnimating -> Boolean
   *
   * Whether or not the loading indicator is currently animating.
  **/
  isAnimating: false,

  /*
   * Aphid.UI.LoadingIndicatorView#_currentOffset -> Number
   *
   * Whether or not the loading indicator is currently animating.
   */
  _currentOffset: 0,

  // /**
  //  * Aphid.UI.LoadingIndicatorView#minimumDisplayTime -> Number
  //  *
  //  * The minimum display time for the loading indicator, as to prevent
  //  * animation flicker.
  // **/
  // minimumDisplayTime: 5.5,

  // /*
  //  * Aphid.UI.LoadingIndicatorView#_displayedAt -> Number
  //  *
  //  * The timestamp, in seconds (with microseconds), at which the loading
  //  * indicator was displayed with Aphid.UI.LoadingIndicatorView#show(). This is
  //  * used to calculate the delay to use when hiding the indicator, with
  //  * Aphid.UI.LoadingIndicatorView#minimumDisplayTime taken into account.
  //  */
  // _displayedAt: false,

  // -------------------------------------------------------------------------

  /**
   * new Aphid.UI.LoadingIndicatorView()
   *
   * Initializes a new instance of the Loading Indicator.
  **/
  initialize: function($super, options)
  {
    $super(options);

    // Set Defaults
    if (!this.barCount) this.barCount = 10;
    if (!this.barSize) this.barSize = { width: 4, height: 12 };
    if (!this.centerPosition) this.centerPosition = { x: 48, y: 48 };
    if (!this.innerRadius) this.innerRadius = 10;
  },

  viewDidLoad: function($super)
  {
    $super();

    // Initialize Canvas Element
    this.canvasElement = new Element("canvas", { width: 96, height: 96 });
    this.get("element").insert(this.canvasElement);

    // If ExplorerCanvas is present, initialize the canvas element with it for
    // compatibility with Internet Explorer
    if (typeof G_vmlCanvasManager !== "undefined")
      G_vmlCanvasManager.initElement(this.get("canvasElement"));
  },

  viewWillAppear: function()
  {
    var color = this.get("element").getStyle("color");
    if (color)
    {
      colors = color.split(',');
      red    = parseInt(colors[0].substr(4, 3), 10);
      green  = parseInt(colors[1], 10);
      blue   = parseInt(colors[2], 10);
      this.barColor = { red: red, green: green, blue: blue };
    }
    else this.barColor = { red: 85, green: 85, blue: 85 };
    this._startAnimation();
  },

  viewDidDisappear: function()
  {
    this._stopAnimation();
  },

  // --------------------------------------------------------------------------

  getCanvasContext: function()
  {
    return this.get("canvasElement").getContext("2d");
  },

  // --------------------------------------------------------------------------

  /*
   * Aphid.UI.LoadingIndicatorView#_startAnimation() -> null
   *
   * Starts the loading indicator animation.
   */
  _startAnimation: function()
  {
    this.isAnimating = true;
    this._animateNextFrame(0);
  },

  /*
   * Aphid.UI.LoadingIndicatorView#_stopAnimation() -> null
   *
   * Stops drawing the loading indicator and clears its context state.
   */
  _stopAnimation: function()
  {
    this.isAnimating = false;
    this._clearFrame(this.get("canvasContext"));
  },

  /*
   * Aphid.UI.LoadingIndicatorView#_draw(context, offset) -> null
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
      this._drawBlock(this.get("canvasContext"), i);
      context.restore();
    }
    context.restore();
  },

  /*
   * Aphid.UI.LoadingIndicatorView#_drawBlock(context, barNumber) -> null
   */
  _drawBlock: function(context, barNumber)
  {
    context.fillStyle = this._makeRGBA(this.barColor.red, this.barColor.green, this.barColor.blue, (this.barCount + 1 - barNumber) / (this.barCount + 1));
    context.fillRect(-this.barSize.width / 2, 0, this.barSize.width, this.barSize.height);
  },

  /*
   * Aphid.UI.LoadingIndicatorView#_animateNextFrame() -> null
   */
  _animateNextFrame: function()
  {
    if (!this.isAnimating) return;
    this._currentOffset = (this._currentOffset + 1) % this.barCount;
    this._draw(this.get("canvasContext"), this._currentOffset);
    this._animateNextFrame.bind(this).delay(0.05);
  },

  /*
   * Aphid.UI.LoadingIndicatorView#_clearFrame() -> null
   */
  _clearFrame: function(context)
  {
    context.clearRect(0, 0, this.get("canvasElement").clientWidth, this.get("canvasElement").clientHeight);
  },

  /*
   * Aphid.UI.LoadingIndicatorView#_calculateAngle(barNumber) -> Float
   */
  _calculateAngle: function(barNumber)
  {
    return 2 * barNumber * Math.PI / this.barCount;
  },

  /*
   * Aphid.UI.LoadingIndicatorView#_calculatePosition(barNumber) -> Object
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
