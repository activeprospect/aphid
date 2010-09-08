
var Aphid = {

  Version: '0.9.1-PRE'

};


Aphid.Support = {};


Aphid.Support.Compatibility = {};


document.createElement("canvas").getContext||(function(){var s=Math,j=s.round,F=s.sin,G=s.cos,V=s.abs,W=s.sqrt,k=10,v=k/2;function X(){return this.context_||(this.context_=new H(this))}var L=Array.prototype.slice;function Y(b,a){var c=L.call(arguments,2);return function(){return b.apply(a,c.concat(L.call(arguments)))}}var M={init:function(b){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var a=b||document;a.createElement("canvas");a.attachEvent("onreadystatechange",Y(this.init_,this,a))}},init_:function(b){b.namespaces.g_vml_||
b.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml","#default#VML");b.namespaces.g_o_||b.namespaces.add("g_o_","urn:schemas-microsoft-com:office:office","#default#VML");if(!b.styleSheets.ex_canvas_){var a=b.createStyleSheet();a.owningElement.id="ex_canvas_";a.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}g_o_\\:*{behavior:url(#default#VML)}"}var c=b.getElementsByTagName("canvas"),d=0;for(;d<c.length;d++)this.initElement(c[d])},
initElement:function(b){if(!b.getContext){b.getContext=X;b.innerHTML="";b.attachEvent("onpropertychange",Z);b.attachEvent("onresize",$);var a=b.attributes;if(a.width&&a.width.specified)b.style.width=a.width.nodeValue+"px";else b.width=b.clientWidth;if(a.height&&a.height.specified)b.style.height=a.height.nodeValue+"px";else b.height=b.clientHeight}return b}};function Z(b){var a=b.srcElement;switch(b.propertyName){case "width":a.style.width=a.attributes.width.nodeValue+"px";a.getContext().clearRect();
break;case "height":a.style.height=a.attributes.height.nodeValue+"px";a.getContext().clearRect();break}}function $(b){var a=b.srcElement;if(a.firstChild){a.firstChild.style.width=a.clientWidth+"px";a.firstChild.style.height=a.clientHeight+"px"}}M.init();var N=[],B=0;for(;B<16;B++){var C=0;for(;C<16;C++)N[B*16+C]=B.toString(16)+C.toString(16)}function I(){return[[1,0,0],[0,1,0],[0,0,1]]}function y(b,a){var c=I(),d=0;for(;d<3;d++){var f=0;for(;f<3;f++){var h=0,g=0;for(;g<3;g++)h+=b[d][g]*a[g][f];c[d][f]=
h}}return c}function O(b,a){a.fillStyle=b.fillStyle;a.lineCap=b.lineCap;a.lineJoin=b.lineJoin;a.lineWidth=b.lineWidth;a.miterLimit=b.miterLimit;a.shadowBlur=b.shadowBlur;a.shadowColor=b.shadowColor;a.shadowOffsetX=b.shadowOffsetX;a.shadowOffsetY=b.shadowOffsetY;a.strokeStyle=b.strokeStyle;a.globalAlpha=b.globalAlpha;a.arcScaleX_=b.arcScaleX_;a.arcScaleY_=b.arcScaleY_;a.lineScale_=b.lineScale_}function P(b){var a,c=1;b=String(b);if(b.substring(0,3)=="rgb"){var d=b.indexOf("(",3),f=b.indexOf(")",d+
1),h=b.substring(d+1,f).split(",");a="#";var g=0;for(;g<3;g++)a+=N[Number(h[g])];if(h.length==4&&b.substr(3,1)=="a")c=h[3]}else a=b;return{color:a,alpha:c}}function aa(b){switch(b){case "butt":return"flat";case "round":return"round";case "square":default:return"square"}}function H(b){this.m_=I();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.fillStyle=this.strokeStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=k*1;this.globalAlpha=1;this.canvas=b;
var a=b.ownerDocument.createElement("div");a.style.width=b.clientWidth+"px";a.style.height=b.clientHeight+"px";a.style.overflow="hidden";a.style.position="absolute";b.appendChild(a);this.element_=a;this.lineScale_=this.arcScaleY_=this.arcScaleX_=1}var i=H.prototype;i.clearRect=function(){this.element_.innerHTML=""};i.beginPath=function(){this.currentPath_=[]};i.moveTo=function(b,a){var c=this.getCoords_(b,a);this.currentPath_.push({type:"moveTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};
i.lineTo=function(b,a){var c=this.getCoords_(b,a);this.currentPath_.push({type:"lineTo",x:c.x,y:c.y});this.currentX_=c.x;this.currentY_=c.y};i.bezierCurveTo=function(b,a,c,d,f,h){var g=this.getCoords_(f,h),l=this.getCoords_(b,a),e=this.getCoords_(c,d);Q(this,l,e,g)};function Q(b,a,c,d){b.currentPath_.push({type:"bezierCurveTo",cp1x:a.x,cp1y:a.y,cp2x:c.x,cp2y:c.y,x:d.x,y:d.y});b.currentX_=d.x;b.currentY_=d.y}i.quadraticCurveTo=function(b,a,c,d){var f=this.getCoords_(b,a),h=this.getCoords_(c,d),g={x:this.currentX_+
0.6666666666666666*(f.x-this.currentX_),y:this.currentY_+0.6666666666666666*(f.y-this.currentY_)};Q(this,g,{x:g.x+(h.x-this.currentX_)/3,y:g.y+(h.y-this.currentY_)/3},h)};i.arc=function(b,a,c,d,f,h){c*=k;var g=h?"at":"wa",l=b+G(d)*c-v,e=a+F(d)*c-v,m=b+G(f)*c-v,r=a+F(f)*c-v;if(l==m&&!h)l+=0.125;var n=this.getCoords_(b,a),o=this.getCoords_(l,e),q=this.getCoords_(m,r);this.currentPath_.push({type:g,x:n.x,y:n.y,radius:c,xStart:o.x,yStart:o.y,xEnd:q.x,yEnd:q.y})};i.rect=function(b,a,c,d){this.moveTo(b,
a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath()};i.strokeRect=function(b,a,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(b,a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath();this.stroke();this.currentPath_=f};i.fillRect=function(b,a,c,d){var f=this.currentPath_;this.beginPath();this.moveTo(b,a);this.lineTo(b+c,a);this.lineTo(b+c,a+d);this.lineTo(b,a+d);this.closePath();this.fill();this.currentPath_=f};i.createLinearGradient=function(b,
a,c,d){var f=new D("gradient");f.x0_=b;f.y0_=a;f.x1_=c;f.y1_=d;return f};i.createRadialGradient=function(b,a,c,d,f,h){var g=new D("gradientradial");g.x0_=b;g.y0_=a;g.r0_=c;g.x1_=d;g.y1_=f;g.r1_=h;return g};i.drawImage=function(b){var a,c,d,f,h,g,l,e,m=b.runtimeStyle.width,r=b.runtimeStyle.height;b.runtimeStyle.width="auto";b.runtimeStyle.height="auto";var n=b.width,o=b.height;b.runtimeStyle.width=m;b.runtimeStyle.height=r;if(arguments.length==3){a=arguments[1];c=arguments[2];h=g=0;l=d=n;e=f=o}else if(arguments.length==
5){a=arguments[1];c=arguments[2];d=arguments[3];f=arguments[4];h=g=0;l=n;e=o}else if(arguments.length==9){h=arguments[1];g=arguments[2];l=arguments[3];e=arguments[4];a=arguments[5];c=arguments[6];d=arguments[7];f=arguments[8]}else throw Error("Invalid number of arguments");var q=this.getCoords_(a,c),t=[];t.push(" <g_vml_:group",' coordsize="',k*10,",",k*10,'"',' coordorigin="0,0"',' style="width:',10,"px;height:",10,"px;position:absolute;");if(this.m_[0][0]!=1||this.m_[0][1]){var E=[];E.push("M11=",
this.m_[0][0],",","M12=",this.m_[1][0],",","M21=",this.m_[0][1],",","M22=",this.m_[1][1],",","Dx=",j(q.x/k),",","Dy=",j(q.y/k),"");var p=q,z=this.getCoords_(a+d,c),w=this.getCoords_(a,c+f),x=this.getCoords_(a+d,c+f);p.x=s.max(p.x,z.x,w.x,x.x);p.y=s.max(p.y,z.y,w.y,x.y);t.push("padding:0 ",j(p.x/k),"px ",j(p.y/k),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",E.join(""),", sizingmethod='clip');")}else t.push("top:",j(q.y/k),"px;left:",j(q.x/k),"px;");t.push(' ">','<g_vml_:image src="',b.src,
'"',' style="width:',k*d,"px;"," height:",k*f,'px;"',' cropleft="',h/n,'"',' croptop="',g/o,'"',' cropright="',(n-h-l)/n,'"',' cropbottom="',(o-g-e)/o,'"'," />","</g_vml_:group>");this.element_.insertAdjacentHTML("BeforeEnd",t.join(""))};i.stroke=function(b){var a=[],c=P(b?this.fillStyle:this.strokeStyle),d=c.color,f=c.alpha*this.globalAlpha;a.push("<g_vml_:shape",' filled="',!!b,'"',' style="position:absolute;width:',10,"px;height:",10,'px;"',' coordorigin="0 0" coordsize="',k*10," ",k*10,'"',' stroked="',
!b,'"',' path="');var h={x:null,y:null},g={x:null,y:null},l=0;for(;l<this.currentPath_.length;l++){var e=this.currentPath_[l];switch(e.type){case "moveTo":a.push(" m ",j(e.x),",",j(e.y));break;case "lineTo":a.push(" l ",j(e.x),",",j(e.y));break;case "close":a.push(" x ");e=null;break;case "bezierCurveTo":a.push(" c ",j(e.cp1x),",",j(e.cp1y),",",j(e.cp2x),",",j(e.cp2y),",",j(e.x),",",j(e.y));break;case "at":case "wa":a.push(" ",e.type," ",j(e.x-this.arcScaleX_*e.radius),",",j(e.y-this.arcScaleY_*e.radius),
" ",j(e.x+this.arcScaleX_*e.radius),",",j(e.y+this.arcScaleY_*e.radius)," ",j(e.xStart),",",j(e.yStart)," ",j(e.xEnd),",",j(e.yEnd));break}if(e){if(h.x==null||e.x<h.x)h.x=e.x;if(g.x==null||e.x>g.x)g.x=e.x;if(h.y==null||e.y<h.y)h.y=e.y;if(g.y==null||e.y>g.y)g.y=e.y}}a.push(' ">');if(b)if(typeof this.fillStyle=="object"){var m=this.fillStyle,r=0,n={x:0,y:0},o=0,q=1;if(m.type_=="gradient"){var t=m.x1_/this.arcScaleX_,E=m.y1_/this.arcScaleY_,p=this.getCoords_(m.x0_/this.arcScaleX_,m.y0_/this.arcScaleY_),
z=this.getCoords_(t,E);r=Math.atan2(z.x-p.x,z.y-p.y)*180/Math.PI;if(r<0)r+=360;if(r<1.0E-6)r=0}else{var p=this.getCoords_(m.x0_,m.y0_),w=g.x-h.x,x=g.y-h.y;n={x:(p.x-h.x)/w,y:(p.y-h.y)/x};w/=this.arcScaleX_*k;x/=this.arcScaleY_*k;var R=s.max(w,x);o=2*m.r0_/R;q=2*m.r1_/R-o}var u=m.colors_;u.sort(function(ba,ca){return ba.offset-ca.offset});var J=u.length,da=u[0].color,ea=u[J-1].color,fa=u[0].alpha*this.globalAlpha,ga=u[J-1].alpha*this.globalAlpha,S=[],l=0;for(;l<J;l++){var T=u[l];S.push(T.offset*q+
o+" "+T.color)}a.push('<g_vml_:fill type="',m.type_,'"',' method="none" focus="100%"',' color="',da,'"',' color2="',ea,'"',' colors="',S.join(","),'"',' opacity="',ga,'"',' g_o_:opacity2="',fa,'"',' angle="',r,'"',' focusposition="',n.x,",",n.y,'" />')}else a.push('<g_vml_:fill color="',d,'" opacity="',f,'" />');else{var K=this.lineScale_*this.lineWidth;if(K<1)f*=K;a.push("<g_vml_:stroke",' opacity="',f,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',aa(this.lineCap),
'"',' weight="',K,'px"',' color="',d,'" />')}a.push("</g_vml_:shape>");this.element_.insertAdjacentHTML("beforeEnd",a.join(""))};i.fill=function(){this.stroke(true)};i.closePath=function(){this.currentPath_.push({type:"close"})};i.getCoords_=function(b,a){var c=this.m_;return{x:k*(b*c[0][0]+a*c[1][0]+c[2][0])-v,y:k*(b*c[0][1]+a*c[1][1]+c[2][1])-v}};i.save=function(){var b={};O(this,b);this.aStack_.push(b);this.mStack_.push(this.m_);this.m_=y(I(),this.m_)};i.restore=function(){O(this.aStack_.pop(),
this);this.m_=this.mStack_.pop()};function ha(b){var a=0;for(;a<3;a++){var c=0;for(;c<2;c++)if(!isFinite(b[a][c])||isNaN(b[a][c]))return false}return true}function A(b,a,c){if(!!ha(a)){b.m_=a;if(c)b.lineScale_=W(V(a[0][0]*a[1][1]-a[0][1]*a[1][0]))}}i.translate=function(b,a){A(this,y([[1,0,0],[0,1,0],[b,a,1]],this.m_),false)};i.rotate=function(b){var a=G(b),c=F(b);A(this,y([[a,c,0],[-c,a,0],[0,0,1]],this.m_),false)};i.scale=function(b,a){this.arcScaleX_*=b;this.arcScaleY_*=a;A(this,y([[b,0,0],[0,a,
0],[0,0,1]],this.m_),true)};i.transform=function(b,a,c,d,f,h){A(this,y([[b,a,0],[c,d,0],[f,h,1]],this.m_),true)};i.setTransform=function(b,a,c,d,f,h){A(this,[[b,a,0],[c,d,0],[f,h,1]],true)};i.clip=function(){};i.arcTo=function(){};i.createPattern=function(){return new U};function D(b){this.type_=b;this.r1_=this.y1_=this.x1_=this.r0_=this.y0_=this.x0_=0;this.colors_=[]}D.prototype.addColorStop=function(b,a){a=P(a);this.colors_.push({offset:b,color:a.color,alpha:a.alpha})};function U(){}G_vmlCanvasManager=
M;CanvasRenderingContext2D=H;CanvasGradient=D;CanvasPattern=U})();

Aphid.Support.Compatibility.HTML5 = {

  Elements: [
    'abbr', 'article', 'aside', 'audio', 'canvas', 'details', 'figcaption',
    'figure', 'footer', 'header', 'hgroup', 'mark', 'meter', 'nav', 'output',
    'progress', 'section', 'summary', 'time', 'video'
  ],

  createElements: function()
  {
    this.Elements.each(this._createElement);
  },

  _createElement: function(elementName)
  {
    document.createElement(elementName);
  }

}
if (Prototype.Browser.IE)
  Aphid.Support.Compatibility.HTML5.createElements();

Aphid.Support.Compatibility.String = {}

Aphid.Support.Compatibility.String.TrimSupport = {

  trim: function()
  {
    return this.replace(/^\s+|\s+$/g,"");
  },

  trimLeft: function()
  {
    return this.replace(/^\s+/,"");
  },

  trimRight: function()
  {
    return this.replace(/\s+$/,"");
  }

}

if (Object.isUndefined("".trim))
  Object.extend(String.prototype, Aphid.Support.Compatibility.String.TrimSupport);

Aphid.Support.Extensions = {};


Aphid.Support.Extensions.Vendor = {};


Aphid.Support.Extensions.Vendor.Prototype = {};

Aphid.Support.Extensions.Vendor.Prototype.BrowserFeatures = {

  HTML5StructuralElements: function() {
    var element = document.createElement("div");
    element.innerHTML = "<section></section>";
    if (element.innerHTML.length == 0)
      return false;
    else
      return true;
  }

};

Object.extend(Prototype.BrowserFeatures, Aphid.Support.Extensions.Vendor.Prototype.BrowserFeatures);

Aphid.Support.Extensions.Vendor.Prototype.Element = {

  fromString: function(htmlString)
  {
    htmlString = htmlString.trim();
    var element;
    if (Prototype.BrowserFeatures.HTML5StructuralElements())
      element = new Element('div').update(htmlString).firstChild;
    else
      element = new Element('div').updateSafe(htmlString).firstChild;
    return element;
  }

};

Object.extend(Element, Aphid.Support.Extensions.Vendor.Prototype.Element);

Aphid.Support.Extensions.Vendor.Prototype.Element.Methods = {

  getBorderHeight: function(element)
  {
    element = $(element);
    var height = parseInt(element.getStyle('border-top-width'));
    height += parseInt(element.getStyle('border-bottom-width'));
    return height;
  },

  getBorderWidth: function(element)
  {
    element = $(element);
    var width = parseInt(element.getStyle('border-left-width'));
    width += parseInt(element.getStyle('border-right-width'));
    return width;
  },

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

  getMaximumHeight: function(element)
  {
    element = $(element);
    var maxHeight = parseInt(element.getStyle('max-height'));
    if (isNaN(maxHeight)) return false;
    return maxHeight;
  },

  getMaximumWidth: function(element)
  {
    element = $(element);
    var maxWidth = parseInt(element.getStyle('max-width'));
    if (isNaN(maxWidth)) return false;
    return maxWidth;
  },

  getMinimumHeight: function(element)
  {
    element = $(element);
    var minHeight = parseInt(element.getStyle('min-height'));
    return minHeight;
  },

  getMinimumWidth: function(element)
  {
    element = $(element);
    var minWidth = parseInt(element.getStyle('min-width'));
    return minWidth;
  },

  getOuterHeight: function(element)
  {
    element = $(element);
    var height = element.getHeight();
    height += parseInt(element.getStyle('margin-top'));
    height += parseInt(element.getStyle('margin-bottom'));
    return height;
  },

  getOuterWidth: function(element)
  {
    element = $(element);
    var width = element.getWidth();
    width += parseInt(element.getStyle('margin-left'));
    width += parseInt(element.getStyle('margin-right'));
    return width;
  },

  insert: Element.insert.wrap(
    function(insert, element, insertation)
    {
      if (!Object.isArray(insertation))
        return insert(element, insertation);
      element = $(element);
      insertation.each(insert.curry(element));
      return element;
    }
  ),

  getData: function(element, attribute)
  {
    var value = element.getAttribute("data-" + attribute);
    if (!value) return false;
    return value;
  },

  setData: function(element, attribute, value)
  {
    element.setAttribute("data-" + attribute, value);
    return element;
  },

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

};

Element.addMethods(Aphid.Support.Extensions.Vendor.Prototype.Element.Methods);
Aphid.Support.Extensions.Object = {

  isEvent: function(object)
  {
    return Object.isArray(object.toString().match('Event'));
  },

  applyOptionsToInstance: function(instance, options)
  {
    options = $H(options);
    options.each(function(pair) {
      if (Object.isUndefined(instance[pair.key])) return;
      $L.debug("Setting " + pair.key + " = " + pair.value, "Object#applyOptionsToInstance");
      instance[pair.key] = pair.value;
    });
  }

}

Object.extend(Object, Aphid.Support.Extensions.Object);
Aphid.Support.Extensions.Array = {

  random: function()
  {
    return this[parseInt(Math.random() * this.length)];
  },

  randomize: function()
  {
    for (var rnd, tmp, i = this.length; i; rnd = parseInt(Math.random() * i), tmp = this[--i], this[i] = this[rnd], this[rnd] = tmp);
  },

  remove: function(item)
  {
    var itemIndex = this.indexOf(item);
    if (itemIndex == -1)
      return false;
    else
      return this.splice(itemIndex, 1);
  }

}

Object.extend(Array.prototype, Aphid.Support.Extensions.Array);
Aphid.Support.Extensions.Date = {

  strftime: function(format)
  {
    var formatted,
        ordinals   = $H({ 1: "st", 2: "nd", 3: "rd", 4: "th", 5: "th", 6: "th", 7: "th", 8: "th", 9: "th" }),
        syntax     = /(^|.|\r|\n)(%([A-Za-z]{1,2}))/,
        components = {
          a:  Date.dayNames[this.getDay()].substring(0, 3),
          A:  Date.dayNames[this.getDay()],
          b:  Date.monthNames[this.getMonth()].substring(0, 3),
          B:  Date.monthNames[this.getMonth()],
          d:  this.getDate(),
          dd: this.getDate().toPaddedString(2),
          H:  this.getHours() % 12 || 12,
          HH: (this.getHours() % 12 || 12).toPaddedString(2),
          I:  this.getHours(),
          II: this.getHours().toPaddedString(2),
          m:  this.getMonth() + 1,
          mm: (this.getMonth() + 1).toPaddedString(2),
          M:  this.getMinutes(),
          MM: this.getMinutes().toPaddedString(2),
          o:  "%o", // Pass Through
          p:  this.getHours() >= 12 ? 'pm' : 'am',
          P:  this.getHours() >= 12 ? 'PM' : 'AM',
          S:  this.getSeconds(),
          SS: this.getSeconds().toPaddedString(2),
          w:  this.getDay(),
          y:  this.getFullYear().toString().substring(2, 4),
          Y:  this.getFullYear()
        };
    formatted = format.interpolate(components, syntax);
    if (formatted.indexOf("%o") >= 0)
      formatted = formatted.replace("%o", this.getDate() > 10 ? ordinals.get(this.getDate().toString().substring(1)) : ordinals.get(this.getDate()));
    return formatted;
  }

}

Object.extend(Date.prototype, Aphid.Support.Extensions.Date);

Date.monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

Date.dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
Aphid.Support.Extensions.String = {

  attributize: function()
  {
    return this.underscore().dasherize();
  },

  lowerCaseFirst: function()
  {
    return this.charAt(0).toLowerCase() + this.substring(1);
  },

  upperCaseFirst: function()
  {
    return this.charAt(0).toUpperCase() + this.substring(1);
  },

  toInt: function()
  {
    return parseInt(this);
  },

  toDate: function()
  {
    return new Date(this);
  },

  pluralize: function(count, plural)
  {
    if (Object.isUndefined(plural))
      plural = this + 's';
    return (count == 1 ? this + '' : plural);
  }

};
Object.extend(String.prototype, Aphid.Support.Extensions.String);

String.random = function(length)
{
  if (Object.isUndefined(length)) length = 10;
  var chars = $R('a', 'z').toArray().concat($R('A', 'Z').toArray()).concat($R(0, 9).toArray());
  return $R(1, length).inject('', function(m, i) { return m + chars.random() });
}


Aphid.Support.Cookie = {

  set: function(name, value, daysToExpire)
  {
    var expire = '';
    if (!Object.isUndefined(daysToExpire))
    {
      var date = new Date()
      date.setTime(date.getTime() + (86400000 * parseFloat(daysToExpire)));
      expire = '; expires=' + date.toGMTString();
    }
    return (document.cookie = escape(name) + '=' + (value || '') + expire);
  },

  get: function(name)
  {
    var cookie = document.cookie.match(new RegExp('(^|;)\\s*' + escape(name) + '=([^;\\s]*)'));
    return (cookie ? cookie[2] : false);
  },

  erase: function(name)
  {
    var cookie = Aphid.Support.Cookie.get(name) || false;
    Aphid.Support.Cookie.set(name, '', -1);
    return cookie;
  },

  acceptsCookies: function()
  {
    if (typeof navigator.cookieEnabled == 'boolean')
      return navigator.cookieEnabled;
    Cookie.set('_test', '1');
    return Cookie.erase('_test') != false;
  }

}

$C = Aphid.Support.Cookie;
Aphid.Support.Logger = Class.create({

  level: false,

  initialize: function(level)
  {
    this.level = Object.isUndefined(level) ? Aphid.Support.Logger.INFO_LEVEL : level;
  },

  debug: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.DEBUG_LEVEL) return;
    if (prefix)
      window.console.debug('[' + prefix + '] ' + message);
    else
      window.console.debug(message);
  },

  info: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.INFO_LEVEL) return;
    if (prefix)
      window.console.info('[' + prefix + '] ' + message);
    else
      window.console.info(message);
  },

  warn: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.WARNING_LEVEL) return;
    if (prefix)
      window.console.warn('[' + prefix + '] ' + message);
    else
      window.console.warn(message);
  },

  error: function(message, prefix)
  {
    if (!window.console) return;
    if (this.level < Aphid.Support.Logger.ERROR_LEVEL) return;
    if (prefix)
      window.console.error('[' + prefix + '] ' + message);
    else
      window.console.error(message);
  }

});

Aphid.Support.Logger.DEBUG_LEVEL = 4;

Aphid.Support.Logger.INFO_LEVEL = 3;

Aphid.Support.Logger.WARNING_LEVEL = 2;

Aphid.Support.Logger.ERROR_LEVEL = 1;

$L = new Aphid.Support.Logger();

Aphid.Core = {};


var Application;

Aphid.Core.Application = Class.create({

  logger: false,

  logLevel: Aphid.Support.Logger.DEBUG_LEVEL,

  loadingIndicator: false,

  mainWindow: false,

  baseViewPath: false,

  initialize: function()
  {
    this._initializeLogger();
    this._initializeLoadingIndicator();
    this.mainWindow = new Aphid.UI.Window();
    this.baseViewPath = "Views";
  },

  applicationDidFinishInitialization: function()
  {

  },

  /*
   * Aphid.Core.Application#_initializeLoadingIndicator() -> Aphid.UI.LoadingIndicator
   *
   * Initializes a new LoadingIndicator instance to be shared by the
   * application.
   */
  _initializeLoadingIndicator: function()
  {
    this.loadingIndicator = new Aphid.UI.LoadingIndicator();
    Ajax.Responders.register({
      onCreate:   this.loadingIndicator.show.bind(this.loadingIndicator),
      onComplete: this.loadingIndicator.hide.bind(this.loadingIndicator)
    });
    return this.loadingIndicator;
  },

  /*
   * Aphid.Core.Application#_initializeLogger() -> Aphid.Support.Logger
   *
   * Initializes a new Logger instance to be shared by the Application. The
   * Logger instance is accessible as Application.sharedInstance.logger as
   * well as the shortcut $L (i.e. $L.warn("Danger, Will Robinson! Danger!")).
   */
  _initializeLogger: function()
  {
    this.logger = new Aphid.Support.Logger(this.logLevel);
    return this.logger;
  }

});

/*
 * Aphid.Core.Application.bootstrap() -> null
 *
 * Initializes the application delegate (an instance of Application that
 * subclasses [[Aphid.Core.Application]] or a default instance of
 * [[Aphid.Core.Application]] if a custom subclass does not exist).
 *
 * This method should be called after the DOM has been loaded and should never
 * be called directly by your application.
**/
Aphid.Core.Application.bootstrap = function()
{
  if (Object.isUndefined(Application))
  {
    $L.warn("Initializing a default application delegate as 'Application' ... You should define your own Aphid.Core.Application subclass.", "Aphid.Core.Application");
    Application = Class.create(Aphid.Core.Application);
  }
  Application.sharedInstance = new Application();
  if (!Object.isUndefined(Application.sharedInstance.applicationDidFinishInitialization))
    Application.sharedInstance.applicationDidFinishInitialization();
}
document.observe('dom:loaded', Aphid.Core.Application.bootstrap);

Aphid.Model = Class.create({

  delegate: false,

  url: false,

  identifier: false,

  identifierAttribute: false,

  element: false,

  object: false,

  json: false,

  attributes: $A(),

  proxies: $H(),

  isLoaded: false,


  initialize: function(options)
  {
    Object.applyOptionsToInstance(this, options);

    if (this.identifier)
      this._initializeFromIdentifier();
    else if (this.element)
      this._initializeFromElement();
    else if (this.object)
      this._initializeFromObject();
    else if (this.json)
      this._initializeFromJSON();
    else
      this._initializeEmptyObject();
  },

  /*
   * Aphid.Model#_initializeFromIdentifier() -> null
   *
   * Initializes the instance by attempting to load the record from a remote
   * datasource using the identifier provided as an option during
   * initialization.
   *
   * Implement the delegate methods `modelDidFinishLoading` to be notified
   * when the model has been completely initialized.
   *
   * TODO Implement error handling for when the request fails
  **/
  _initializeFromIdentifier: function()
  {
    $L.info("Initializing from Record Identifier...", "Aphid.Model");

    var urlTemplate = new Template(this.url);
    var url = urlTemplate.evaluate({ identifier: this.identifier });


    var options = {
      method: 'get',
      contentType: 'application/json',
      onSuccess: function(transport)
      {
        this.object = transport.responseJSON;
        this._initializeFromObject();
        this.isLoaded = true;
        this._afterLoad();
      }.bind(this),
      onFailure: function(transport)
      {
        var alertView = new Aphid.UI.AlertView();
        alertView.title = "Error Loading Resource";
        alertView.message = "Failed to load an instance of <strong>" + this.displayName + "</strong> using the identifier: <strong>" + this.identifier + "</strong>";
        alertView.status = "Error " + transport.status + " - " + transport.statusText;
        alertView.showAnimated();
      }.bind(this)
    };

    new Ajax.Request(url, options);
  },

  /*
   * Aphid.Model#_initializeFromElement() -> null
   *
   * Initializes the instance from the HTML Element provided as an option
   * during initialization.
  **/
  _initializeFromElement: function()
  {
    $L.info("Initializing from Element...", "Aphid.Model");
    if (Object.isString(this.element))
      this.element = Element.fromString(this.element);
    this.attributes.each(
      function(attribute)
      {
        $L.debug('Setting value of attribute "' + attribute + '" to "' + this.element.getData(attribute) + '"');
        this[attribute] = this.element.getData(attribute);
        this["_" + attribute] = this.element.getData(attribute);
      }.bind(this)
    );
    if (this.identifierAttribute && !this.identifier && this[this.identifierAttribute])
    {
      $L.debug('Setting identifier to ' + this[this.identifierAttribute] + '"');
      this.identifier = this[this.identifierAttribute];
    }
    this._instantiateProxies();
  },

  /*
   * Aphid.Model#_initializeFromObject() -> null
   *
   * Initializes the instance from a JavaScript object by applying any of the
   * attributes for this model that are found in the object to the instance.
  **/
  _initializeFromObject: function()
  {
    $L.info("Initializing from Object...", "Aphid.Model");
    this.attributes.each(
      function(attribute)
      {
        $L.debug('Setting value of attribute "' + attribute + '" to "' + this.object[attribute] + '"');
        this[attribute] = this.object[attribute];
        this["_" + attribute] = this.object[attribute];
      }.bind(this)
    );
    if (this.identifierAttribute && !this.identifier && this[this.identifierAttribute])
    {
      $L.debug('Setting identifier to ' + this[this.identifierAttribute] + '"');
      this.identifier = this[this.identifierAttribute];
    }
    this._instantiateProxies();
  },

  /*
   * Aphid.Model#_initializeFromJSON() -> null
   *
   * Initializes the instance from the JSON string provided as an option
   * during initialization by first evaluating the string and then passing it
   * on to [[Aphid.Model#_initializeFromObject()]].
  **/
  _initializeFromJSON: function()
  {
    $L.info("Initializing from JSON...", "Aphid.Model");
    this.object = this.json.evalJSON();
    this._initializeFromObject();
  },

  /*
   * Aphid.Model#_initializeEmptyObject() -> null
   *
   * Initializes an empty instance with each attribute set to null.
  **/
  _initializeEmptyObject: function()
  {
    $L.info("Initializing empty object...", "Aphid.Model");
    this.attributes.each(
      function(attribute)
      {
        this[attribute] = null;
        this["_" + attribute] = null;
      }.bind(this)
    );
  },


  isDirty: function()
  {
    var isDirty = false;

    this.attributes.each(function(attribute)
    {
      if (this.proxies && $H(this.proxies).keys().include(attribute))
      {
        if (Object.isArray(this[attribute]))
        {
          this[attribute].each(function(proxyAttribute) {
            if (!proxyAttribute.identifier && proxyAttribute.isDirty())
              isDirty = true;
          }, this);
        }
      }
      else if (this[attribute] != this["_" + attribute])
        isDirty = true;
    }, this);

    return isDirty;
  },


  /*
   * Aphid.Model#_instantiateProxies() -> null
   *
   * Instantiates any configured proxies on the model instance.
  **/
  _instantiateProxies: function()
  {
    $H(this.proxies).each(this._instantiateProxy, this);
  },

  /*
   * Aphid.Model#_instantiateProxy(proxy) -> null
   *
   * - proxy (Hash): a key/value pair containing the attribute (as the key)
   *   and the class to be instantiated (as the value).
   *
   * Instantiates a new instance of the configured class for the given
   * proxy (attribute). If the attribute's value is an array, each element of
   * the array will be instantiated as the configured proxy class.
  **/
  _instantiateProxy: function(proxy)
  {
    var attribute = proxy[0],
        klass     = proxy[1];
    if (Object.isArray(this[attribute]))
      this[attribute] = this[attribute].collect(function(tuple) {
        var instance = new klass({ object: tuple })
        return instance;
      });
    else
      this[attribute] = new klass({ object: this[attribute] });
  },


  serialize: function()
  {
    var attributes = {};

    this.attributes.each(function(attribute)
    {
      if (Object.isUndefined(this[attribute]) || this[attribute] == null)
        attributes[attribute] = "";

      else if (Object.isArray(this[attribute]))
      {
        attributes[attribute] = this[attribute].collect(
          function(tuple) {
            return Object.isUndefined(tuple.serialize) ? tuple : tuple.serialize()
          }
        );
      }

      else if (this[attribute].serialize)
        attributes[attribute] = this[attribute].serialize();

      else
        attributes[attribute] = this[attribute];
    }, this);

    return attributes;
  },

  save: function()
  {
    $L.info("Saving...", this.displayName);

    var urlTemplate = new Template(this.url);
    var url = urlTemplate.evaluate({ identifier: this.key });


    var options = {
      method: 'POST',
      requestHeaders: { "X-HTTP-Method-Override": "PUT" },
      contentType: 'application/json',
      postBody: Object.toJSON(this.serialize()),
      onSuccess: function(transport)
      {
        this.object = transport.responseJSON;
        this._initializeFromObject();
        this._afterSave();
      }.bind(this),
      onFailure: function(transport)
      {
        var alertView = new Aphid.UI.AlertView();
        alertView.title = "Error Saving Resource";
        alertView.message = "Failed to save <strong>" + this.displayName + "</strong> with identifier: <strong>" + this.key + "</strong>";
        alertView.status = "Error " + transport.status + " - " + transport.statusText;
        alertView.showAnimated();
      }.bind(this)
    };

    new Ajax.Request(url, options);
  },

  reload: function()
  {
    $L.info("Reloading " + this.displayName + " with identifier " + this.identifier);


    var urlTemplate = new Template(this.url);
    var url = urlTemplate.evaluate({ identifier: this.identifier });

    var options = {
      method: 'get',
      asynchronous: false,
      contentType: 'application/json',
      onSuccess: function(transport)
      {
        this.object = transport.responseJSON;
        this._initializeFromObject();
        this._afterReload();
      }.bind(this),
      onFailure: function(transport)
      {
        var alertView = new Aphid.UI.AlertView();
        alertView.title = "Error Reloading Resource";
        alertView.message = "Failed to reload an instance of <strong>" + this.displayName + "</strong> using the identifier: <strong>" + this.identifier + "</strong>";
        alertView.status = "Error " + transport.status + " - " + transport.statusText;
        alertView.showAnimated();
      }.bind(this)
    };

    new Ajax.Request(url, options);
  },


  _afterLoad: function()
  {
    if (this.afterLoad)
      this.afterLoad(this);
    if (this.delegate && this.delegate.modelDidFinishLoading)
      this.delegate.modelDidFinishLoading(this);
  },

  _afterReload: function()
  {
    if (this.afterReload)
      this.afterReload(this);
    if (this.delegate && this.delegate.modelDidFinishReloading)
      this.delegate.modelDidFinishReloading(this);
  },

  _afterSave: function()
  {
    if (this.afterSave)
      this.afterSave(this);
    if (this.delegate && this.delegate.modelDidFinishSaving)
      this.delegate.modelDidFinishSaving(this);
  },


  toTemplateReplacements: function()
  {
    var attributes = {};
    this.attributes.each(
      function(attribute)
      {
        attributes[attribute] = this[attribute];
      }.bind(this)
    );
    return attributes;
  }

});

Aphid.UI = {};


Aphid.UI.View = Class.create(
{

  delegate: false,

  displayName: false,

  template: false,

  element: false,

  outlet: false,

  subviews: false,

  superview: false,

  isLoaded: false,

  isLoading: false,

  isEnabled: true,

  initializedFromOutlet: false,

  asynchronousLoadingEnabled: false,


  initialize: function(options)
  {
    Object.applyOptionsToInstance(this, options);

    this.subviews  = $A();
    this.isLoaded  = false;
    this.isLoading = false;

    if (this.outlet)
      this._initializeFromOutlet();

    else if (this.element)
      this._initializeFromElement();

    else if (this.template)
      this._initializeFromTemplate();

  },

  _initializeFromElement: function()
  {
    $L.info("Initializing from Element", "Aphid.UI.View");
    this._setupView();
  },

  _initializeFromTemplate: function()
  {
    $L.info("Initializing from Template", "Aphid.UI.View");
    this._loadTemplate();
  },

  _initializeFromOutlet: function()
  {
    $L.info("Initializing from Outlet", "Aphid.UI.View");
    if (this.template)
      this._initializeFromTemplate();
    else
    {
      this.element = this.outlet;
      this._setupView();
    }
  },


  setView: function(view)
  {
    this._setView(view, false);
  },

  setViewAnimated: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    this._setView(view, animated);
  },

  /*
   * Aphid.UI.View#_setView(view[, animated = false]) -> null
   *
   * - view (View): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   *
   * Clears all subviews of the current view and presents the specified *view*
   * with an animated effect (currently this effect is *appear*).
  **/
  _setView: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    this.subviews.invoke('removeFromSuperview', animated);

    this.subviews = $A();

    this.addSubviewAnimated(view, animated);
  },

  addSubview: function(view)
  {
    if (view.isLoading)
      this._addSubview.bind(this).delay(0.1, view, false);

    else
      this._addSubview(view, false);
  },

  addSubviewAnimated: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    if (view.isLoading)
      this._addSubview.bind(this).delay(0.1, view, animated);

    else
      this._addSubview(view, animated);
  },

  /*
   * Aphid.UI.View#_addSubview(view[, animated = false]) -> null
   *
   * - view (View): the view that should be set
   * - animated (Boolean): true if the view should be presented with animation
   *
   * Adds the specified *view* as a subview of the view instance and optionally
   * presents it with an animated effect.
  **/
  _addSubview: function(view, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    if (!view.isLoaded)
    {
      this._addSubview.bind(this).delay(0.1, view, animated);
      return;
    }

    $L.info('Adding "' + (view.displayName || "Unknown") + '" as a subview to "' + (this.displayName || "unknown") + '" (animated: ' + animated + ')', 'Aphid.UI.View');

    view.element.hide();
    view.superview = this;
    this.subviews.push(view);

    if (view.viewWillAppear)
      view.viewWillAppear();

    this.element.insert(view.element);

    animated ? view.element.appear({ duration: 0.25 }) : view.element.show();

    if (view.viewDidAppear)
      view.viewDidAppear();
  },

  removeFromSuperview: function()
  {
    this._removeFromSuperview(false);
  },

  removeFromSuperviewAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    this._removeFromSuperview(animated);
  },

  /*
   * Aphid.UI.View#_removeFromSuperview([animated = false]) -> null
   *
   * - animated (Boolean): true if the view should be dismissed with animation
   *
   * Removes the view from its superview, with an optional animated effect.
   * This method will return immediately if the view does not belong to a
   * superview.
  **/
  _removeFromSuperview: function(animated)
  {
    if (Object.isUndefined(animated)) animated = false;
    if (!this.superview)
      return;

    if (this.viewWillDisappear)
      this.viewWillDisappear();

    animated ? this.element.fade({ duration: 0.25 }) : this.element.hide();

    if (this.element.parentNode != null)
      this.element = this.element.remove()

    this.superview.subviews.remove(this);

    this.superview = false;

    if (this.viewDidDisappear)
      this.viewDidDisappear();
  },


  /*
   * Aphid.UI.View#_loadTemplate() -> null
   *
   * Loads the View template (as derived from the *template* and
   * *Application.baseViewPath* properties) asynchronously.
  **/
  _loadTemplate: function()
  {
    var viewPath = Application.sharedInstance.baseViewPath + '/' + this.template + '.html',
        options  = {
          asynchronous: this.asynchronousLoadingEnabled,
          method: 'get',
          onComplete: this._templateDidFinishLoading.bind(this),
          onFailure: function(transport)
          {
            if (transport.status == 404)
              $L.error("Missing Template (" + Application.sharedInstance.baseViewPath + "/" + this.template + ".html)", "Aphid.UI.View");
          }.bind(this)
        };

    this.isLoaded  = false;
    this.isLoading = true;

    new Ajax.Request(viewPath, options);
  },

  /*
   * Aphid.UI.View#_templateDidFinishLoading(transport) -> null
   *
   * Callback method that is called once the view has finished loading
   * asynchronously. This method sets up the View instance by wiring any
   * outlets and actions found in the template and then calls the appropriate
   * delegate methods.
   *
   * TODO This method should probably just be viewDidFinishLoading so that subclasses can call it instead of making it a delegate call
   *
  **/
  _templateDidFinishLoading: function(transport)
  {
    var loadedTemplate = Element.fromString(transport.responseText);

    if (this.outlet)
    {
      this.element = this.outlet.update(loadedTemplate);
    }

    else
    {
      if (Object.isElement(loadedTemplate))
        this.element = loadedTemplate;
      else
        this.element = new Element("section", { className: "view" }).update(transport.responseText);
    }

    this._setupView();
  },


  /*
   * Aphid.UI.View#_setupView() -> null
   *
   * Processes the view template which has already been loaded remotely or was
   * present in the page when initialized with an element. This will connect
   * all outlets and actions to the view instance and call the appropriate
   * callbacks.
  **/
  _setupView: function()
  {
    this._connectToOutlets();
    this._wireActionsToInstance();

    this.isLoaded  = true;
    this.isLoading = false;

    if (this.element.hasClassName("disabled"))
      this.disable();
    else if (this.isEnabled)
      this.enable();
    else
      this.disable();

    this.viewDidLoad();
    if (this.asynchronousLoadingEnabled)
      if (this.delegate && this.delegate.viewDidLoadAsynchronously)
        this.delegate.viewDidLoadAsynchronously(this);
  },


  enable: function()
  {
    this.isEnabled = true;
    if (!this.isLoaded) return;
    this.element.removeClassName("disabled");
  },

  disable: function()
  {
    this.isEnabled = false;
    if (!this.isLoaded) return;
    this.element.addClassName("disabled");
  },


  /*
   * Aphid.UI.View#_connectToOutlets() -> null
   *
   * Scans the view template for elements that have the *data-outlet*
   * attribute defined and attempts to wire them up to the View instance by
   * the specified name.
   *
   * For example, if you have a property named `someView` defined on your View
   * class and the following in your view template:
   *
   *     <section data-outlet="someView">...</section>
   *
   * ... your view instance will automatically have the `someView` property
   * reference a View instance that wraps the DOM element.
   *
   * * TODO This is still a little early in its implementation and needs to be
   *      thought out better on how to handle different event types or
   *      different element types.
  **/
  _connectToOutlets: function()
  {
    if (this.element.childElements().length == 0) return;

    var outletElements = this.element.select('*[data-outlet]');
    $L.debug('Found ' + outletElements.length + ' ' + "outlet".pluralize(outletElements.length) + ' in the view (' + this.displayName + ')...', 'Aphid.UI.View');

    outletElements.each(
      function(element)
      {
        var outlet    = element.getAttribute('data-outlet'),
            viewClass = element.getAttribute('data-view-class');

        if (!viewClass)
        {
          viewClassImplementation = eval("Aphid.UI.View");
          viewClass = "Aphid.UI.View";
        }
        else
          viewClassImplementation = eval(viewClass);

        if (!Object.isUndefined(this[outlet]))
        {
          var instance;
          $L.info('Connecting outlet "' + outlet + '" to view (class: ' + viewClass + ')...', 'Aphid.UI.View');
          try {

            var options = $H();
            $H(viewClassImplementation.prototype).keys().each(
              function(property)
              {
                if (property.startsWith('_'))
                  return;
                if (Object.isFunction(viewClassImplementation.prototype[property]))
                  return;
                var value;
                if ((value = element.readAttribute("data-" + property.attributize())) != null)
                {
                  if (value == "true") value = true;
                  if (value == "false") value = false;
                  options.set(property, value);
                }
              }
            );
            instance = new viewClassImplementation(options.merge({
              outlet: element,
              delegate: this,
              dataSource: this,
              superview: this
            }));
          }
          catch (error)
          {
            $L.error("Unable to connect outlet (" + outlet + ") to view class (" + viewClass + ")... " + error);
            return;
          }
          this[outlet] = instance;
          this.subviews.push(instance);
        }
        else
          $L.warn('Unable to connect outlet "' + outlet + '" to view controller as the controller does not define a matching member variable', 'Aphid.UI.View');
      }.bind(this)
    );
  },


  /*
   * Aphid.UI.View#_wireActionsToInstance() -> null
   *
   * Scans the view template for elements that have the *data-action*
   * attribute defined and sets up Event observers to call the specified
   * method on the View instance when the Element triggers the appropriate
   * event.
   *
   * For example, if you have a method named `doSomething` defined on your View
   * class and the following in your view template:
   *
   *     <input type="button" data-action="doSomething" />
   *
   * ... the element will automatically be set up to call doSomething() on
   * your view instance when the user clicks the button.
   *
   * TODO This is still a little early in its implementation and needs to be
   *      thought out better on how to handle different event types or
   *      different element types.
  **/
  _wireActionsToInstance: function()
  {
    if (this.element.childElements().length == 0) return;

    var actionElements = this.element.select('*[data-action]');
    $L.debug('Found ' + actionElements.length + ' ' + "action".pluralize(actionElements.length) + ' in the view (' + this.displayName + ')...', 'Aphid.UI.View');

    actionElements.each(
      function(element)
      {
        var action = element.getAttribute('data-action');
        if (!Object.isUndefined(this[action]))
        {
          element.observe('click',
            function(event)
            {
              eval('this.' + action + '()');
            }.bind(this)
          );

        }
        else
          $L.warn('Unable to connect action "' + action + '" to view controller as the controller does not define the requested method', 'Aphid.UI.View');
      }.bind(this)
    );
  },


  viewDidLoad: function()
  {
  },


  viewDidLoadAsynchronously: function(view)
  {
  }

});


Aphid.UI.View.prototype.setView.displayName = "Aphid.UI.View.setView";
Aphid.UI.View.prototype.setViewAnimated.displayName = "Aphid.UI.View.setViewAnimated";
Aphid.UI.View.prototype._setView.displayName = "Aphid.UI.View._setView";
Aphid.UI.View.prototype.addSubview.displayName = "Aphid.UI.View.addSubview";
Aphid.UI.View.prototype.addSubviewAnimated.displayName = "Aphid.UI.View.addSubviewAnimated";
Aphid.UI.View.prototype._addSubview.displayName = "Aphid.UI.View._addSubview";
Aphid.UI.View.prototype.removeFromSuperview.displayName = "Aphid.UI.View.removeFromSuperview";
Aphid.UI.View.prototype.removeFromSuperviewAnimated.displayName = "Aphid.UI.View.removeFromSuperviewAnimated";
Aphid.UI.View.prototype._removeFromSuperview.displayName = "Aphid.UI.View._removeFromSuperview";
Aphid.UI.View.prototype._loadTemplate.displayName = "Aphid.UI.View._loadTemplate";
Aphid.UI.View.prototype._templateDidFinishLoading.displayName = "Aphid.UI.View._templateDidFinishLoading";
Aphid.UI.View.prototype._connectToOutlets.displayName = "Aphid.UI.View._connectToOutlets";
Aphid.UI.View.prototype._wireActionsToInstance.displayName = "Aphid.UI.View._wireActionsToInstance";
Aphid.UI.Window = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.Window",

  /*
   * Aphid.UI.Window#_overlayElement -> Element | false
   *
   * The semi-translucent overlay element that is displayed behind modal
   * views, alert and message dialogs.
  **/
  _overlayElement: false,

  initialize: function($super, options)
  {
    options = $H(options);
    options.set("element", document.body);
    options.set("outlet", false);
    options.set("template", false);

    $super(options);
  },

  displayOverlay: function()
  {
    this.displayOverlayAnimated(false);
  },

  displayOverlayAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (!this._overlayElement)
    {
      this._overlayElement = new Element("div", { className: 'overlay' });
      this._overlayElement.hide();
      Element.insert(document.body, { top: this._overlayElement });
    }
    animated ? this._overlayElement.appear({ duration: 0.25 }) : this._overlayElement.show();
  },

  dismissOverlay: function()
  {
    this.dismissOverlayAnimated(false);
  },

  dismissOverlayAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    animated ? this._overlayElement.fade({ duration: 0.25 }) : this._overlayElement.hide();
  }

});


Aphid.UI.ViewController = Class.create(Aphid.UI.View,
{

  /*
   * Aphid.UI.ViewController#_modalViewContainer -> Element | false
   *
   * The container element that will contain the modal view controller's view.
  **/
  _modalViewContainer: false,

  modalViewController: false,


  initialize: function($super, options)
  {
    $super(options);
  },


  presentModalViewController: function(viewController)
  {
    $L.info("presentModalViewController", "Aphid.UI.ViewController");
    this.presentModalViewControllerAnimated(viewController, false);
  },

  presentModalViewControllerAnimated: function(viewController, animated)
  {
    if (Object.isUndefined(animated)) animated = true;

    if (viewController.isLoading)
      this._presentModalViewController.bind(this).delay(0.1, viewController, animated);

    else
      this._presentModalViewController(viewController, animated);
  },

  /*
   * Aphid.UI.View#_presentModalViewController(viewController[, animated = false]) -> null
   *
   * - viewController (ViewController): the view controller that should be presented
   * - animated (Boolean): true if the view controller should be presented with animation
   *
   * Presents the specified *viewController* as the modal view of the current
   * view controller, presenting it optionally with an animated effect.
  **/
  _presentModalViewController: function(viewController, animated)
  {
    if (Object.isUndefined(animated)) animated = false;

    if (!viewController.isLoaded)
    {
      this._presentModalViewController.bind(this).delay(0.1, viewController, animated);
      return;
    }

    $L.info('Adding "' + viewController.displayName + '" as a subview to "' + (this.displayName || "unknown") + '" (animated: ' + animated + ')', 'Aphid.UI.ViewController');

    var mainWindow = Application.sharedInstance.mainWindow;
    mainWindow.displayOverlayAnimated(animated);

    if (!this._modalViewContainer)
    {
      this._modalViewContainer = new Element("div", { className: 'modalView' });
      this._modalViewContainer.hide();
      document.body.insert(this._modalViewContainer);
    }
    animated ? this._modalViewContainer.appear({ duration: 0.5 }).morph({ top: "10%", bottom: "10%" }, { duration: 0.25 }) : this._modalViewContainer.show();

    viewController.element.hide();
    viewController.superview = this;

    this.modalViewController = viewController;
    this.subviews.push(this.modalViewController);

    if (this.modalViewController.viewWillAppear)
      this.modalViewController.viewWillAppear();

    this._modalViewContainer.insert(this.modalViewController.element);

    animated ? this.modalViewController.element.appear({ duration: 0.25 }) : this.modalViewController.element.show();

    if (this.modalViewController.viewDidAppear)
      this.modalViewController.viewDidAppear();
  },

  dismissModalViewController: function()
  {
    this.dismissModalViewControllerAnimated(false);
  },

  dismissModalViewControllerAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;
    if (!this.modalViewController) return;

    var mainWindow = Application.sharedInstance.mainWindow;
    mainWindow.dismissOverlayAnimated(animated);

    animated ? this._modalViewContainer.fade({ duration: 0.25 }) : this._modalViewContainer.hide();
    animated ? this._modalViewContainer.update.delay(0.25) : this._modalViewContainer.update();

    this.modalViewController = false;
  }

});

Aphid.UI.TabViewController = Class.create(Aphid.UI.ViewController, {

  displayName: "TabViewController",

  persistSelectedTab: false,

  tabs: false,

  defaultTab: false,

  selectedTab: false,

  /*
   * Aphid.UI.TabViewController#contentView -> Element | false
   *
   * TODO ...
  **/
  contentView: false,


  initialize: function($super, options)
  {
    $super(options);
  },

  viewDidLoad: function($super)
  {
    $super();

    this.element.addClassName("TabViewController");

    var tabElements = this.element.select('li');
    this.tabs = tabElements
    this._setupObservers();

    if (this.persistSelectedTab)
    {
      var selectedTab = $C.get(this.displayName + '.selectedTab');
      if (selectedTab)
      {
        $L.info('Restoring previously selected tab "' + selectedTab + '"');
        this.selectTab(selectedTab);
        return;
      }
    }

    $L.info('Selecting default tab "' + this.defaultTab + '"');
    this.selectDefaultTab();
  },


  selectTab: function(tab)
  {
    if (!Object.isElement(tab))
    {
      if (Object.isString(tab))
      {
        var tabName = tab;
        tab = this._findTabByName(tabName);
        if (Object.isUndefined(tab))
        {
          $L.warn('Tried to select a tab (' + tabName + ') that could not be found in the template');
          return;
        }
      }
    }

    if (!this._shouldSelectTab(tab))
      return;

    this.tabs.invoke('removeClassName', 'current');
    tab.addClassName('current');

    this.selectedTab = tab;

    this._didSelectTab(tab);
  },

  selectDefaultTab: function()
  {
    if (this.defaultTab)
      this.selectTab(this.defaultTab);
    else
      this.selectTab(this.tabs.first());
  },


  /*
   * Aphid.UI.TabViewController#_setupObservers() -> null
   *
   * Iterates across each tab item in the tab view, adding event observers for
   * handling the events that we're interested in.
  **/
  _setupObservers: function()
  {
    this.tabs.invoke('observe', 'click', this._handleClickEvent.bind(this));
  },

  _handleClickEvent: function(event)
  {
    event.stop();
    var tab = event.findElement('li');
    this.selectTab(tab);
  },


  /*
   * Aphid.UI.TabViewController#_findTabByName(tabName) -> Element | false
   *
   * - tabName (String): the name of the tab, as specified in the tab items
   *   data-tab attribute.
   *
   * Iterates the `tabs` property and returns the first tab element that
   * matches the data-tab attribute with the provided *tabName*.
  **/
  _findTabByName: function(tabName)
  {
    return this.tabs.find(
      function(tab)
      {
        if (tab.getAttribute('data-tab') == tabName)
          return true;
      }
    )
  },


  /*
   * Aphid.UI.TabViewController#_shouldSelectTab(tab) -> Boolean
   *
   * Checks for basic conditions that should prevent tab selection from
   * occurring, such as the tab already being selected. It also evaluates the
   * `shouldSelectTab` callback and the `tabViewShouldSelectTab` delegate
   * method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the tab should be
   * selected.
  **/
  _shouldSelectTab: function(tab)
  {
    var shouldSelect = true;
    if (tab == this.selectedTab)
      shouldSelect = false;
    if (this.shouldSelectTab)
      shouldSelect = this.shouldSelectTab(tab);
    if (this.delegate && this.delegate.tabViewShouldSelectTab)
      shouldSelect = this.delegate.tabViewShouldSelectTab(this, tab);
    return shouldSelect;
  },

  /*
   * Aphid.UI.TabViewController#_didSelectTab(tab) -> null
   *
   * Performs any internal actions after a tab has been selected before
   * calling the `didSelectTab` callback and the `tabViewSelectionDidChange`
   * delegate method.
  **/
  _didSelectTab: function(tab)
  {
    if (this.persistSelectedTab)
    {
      var tabName = tab.getAttribute('data-tab');
      $C.set(this.displayName + '.selectedTab', tabName);
    }

    if (this.didSelectTab)
      this.didSelectTab(tab);

    if (this.delegate && this.delegate.tabViewSelectionDidChange)
      this.delegate.tabViewSelectionDidChange(this, tab);
  }

});

Aphid.UI.SplitViewController = Class.create(Aphid.UI.ViewController, {

  firstView: false,
  secondView: false,

  constraint: false, // "horizontal, vertical"

  draggableInstance: false,


  initialize: function($super, options)
  {
    $super(options);
  },

  _initializeDraggableInstance: function()
  {
    if (Prototype.Browser.IE)
      return; // Resizing is not supported by Internet Explorer, yet...

    var minHeight = parseInt(this.firstView.element.getStyle('min-height')),
        maxHeight = parseInt(this.firstView.element.getStyle('max-height')),
        minWidth  = parseInt(this.firstView.element.getStyle('min-width')),
        maxWidth  = parseInt(this.firstView.element.getStyle('max-width'));

    this.draggableInstance = new Aphid.UI.SplitViewController.Draggable(
      this.firstView.element,
      this.secondView.element,
      {
        constraint: this.constraint,
        minHeight: minHeight,
        maxHeight: maxHeight,
        minWidth: minWidth,
        maxWidth: maxWidth,
        onStart: this.onStart.bind(this),
        onDrag: this.onDrag.bind(this),
        change: this.change.bind(this),
        onEnd: this.onEnd.bind(this)
      });
  },


  viewDidLoad: function($super)
  {
    $super();
    $L.info('viewDidLoad', 'Aphid.UI.SplitViewController');
    this.element.addClassName('SplitViewController');
    if (!this.asynchronousLoadingEnabled)
      this._initializeDraggableInstance();
  },


  viewDidLoadAsynchronously: function(view)
  {
    if (!this.firstView && !this.secondView)
    {
      $L.error("firstView and secondView have not been defined", "Aphid.UI.SplitViewController");
      return;
    }
    if (this.firstView.isLoaded && this.secondView.isLoaded)
      this._initializeDraggableInstance();
  },


  onStart: function(arg)
  {
    $L.debug("onStart", "Aphid.UI.SplitViewController");
  },

  onDrag: function(arg)
  {
    $L.debug("onDrag", "Aphid.UI.SplitViewController");
  },

  change: function(arg)
  {
    $L.debug("change", "Aphid.UI.SplitViewController");
  },

  onEnd: function(arg)
  {
    $L.debug("onEnd", "Aphid.UI.SplitViewController");
  }

});

/*
 * class Aphid.UI.SplitViewController.Draggable
 *
 * Draggable is a custom subclass of Draggable from script.aculo.us that adds
 * support for minimum/maximum widths and heights, as defined by the
 * min-width and min-height CSS properties.
 *
 * ### TODO
 *
 *  * Move some of the logic out of this to a delegate or callback
**/
Aphid.UI.SplitViewController.Draggable = Class.create(Draggable, {

  firstPane: null,
  secondPane: null,
  dragHandle: null,

  afterResize: null,

  initialize: function($super, firstPane, secondPane)
  {
    var options = arguments[3] || { };
    if (!options.constraint)
      options.constraint = 'horizontal';

    this.firstPane = $(firstPane);
    this.secondPane = $(secondPane);

    this._insertDragHandle(options.constraint);
    $super(this.dragHandle, options);
    this._setupObservers();
    this._initializePaneDimensions();
  },

  updateDrag: function($super, event, pointer)
  {
    $L.debug("updateDrag", "Aphid.UI.SplitViewController.Draggable")
    var minWidth, maxWidth, minHeight, maxHeight;
    var offset = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
    {
      minHeight = this.firstPane.getMinimumHeight();
      maxHeight = this.firstPane.getMaximumHeight();

      if (event.clientY - this.dragHandleClickOffset <= minHeight + offset[1])
      {
        this.resizeVertical(minHeight + offset[1]);
        this._persistState();
        return;
      }
      else if (event.clientY - this.dragHandleClickOffset >= maxHeight + offset[1])
      {
        this.resizeVertical(maxHeight + offset[1]);
        this._persistState();
        return;
      }

      $super(event, pointer);

      var height = event.clientY - this.dragHandleClickOffset;
      this.resizeVertical(height);
    }
    else
    {
      minWidth = this.firstPane.getMinimumWidth();
      maxWidth = this.firstPane.getMaximumWidth();

      if (event.clientX - this.dragHandleClickOffset <= minWidth + offset[0])
      {
        this.resizeHorizontal(minWidth + offset[0]);
        this._persistState();
        return;
      }
      else if (event.clientX - this.dragHandleClickOffset >= maxWidth + offset[0])
      {
        this.resizeHorizontal(maxWidth + offset[0]);
        this._persistState();
        return;
      }

      $super(event, pointer);

      var width = event.clientX - this.dragHandleClickOffset;
      this.resizeHorizontal(width);
    }
  },

  resizeHorizontal: function(x)
  {
    var cumulativeOffset = this.firstPane.cumulativeOffset()[0],
        borderWidth      = this.firstPane.getBorderWidth(),
        dragHandleWidth  = this.dragHandle.getWidth();
    this.firstPane.setStyle({ width: x - cumulativeOffset + 'px' });
    this.secondPane.setStyle({ left: (x - cumulativeOffset + borderWidth + dragHandleWidth) + 'px' });
    this.dragHandle.setStyle({ left: (x - cumulativeOffset + borderWidth) + 'px' });
  },

  resizeVertical: function(y)
  {
    var cumulativeOffset = this.firstPane.cumulativeOffset()[1],
        borderHeight     = this.firstPane.getBorderHeight(),
        dragHandleHeight = this.dragHandle.getHeight();
    this.firstPane.setStyle({ height: y - cumulativeOffset + 'px' });
    this.secondPane.setStyle({ top: (y - cumulativeOffset + borderHeight + dragHandleHeight) + 'px' });
    this.dragHandle.setStyle({ top: (y - cumulativeOffset + borderHeight) + 'px' });
  },


  _persistState: function()
  {
    if (this.options.constraint == 'vertical')
      $C.set("ResizablePanes." + this.paneSet, this.firstPane.getHeight());
    else
      $C.set("ResizablePanes." + this.paneSet, this.firstPane.getWidth());
  },

  _restoreState: function()
  {
    var paneSize = parseInt($C.get("ResizablePanes." + this.paneSet));
    var offset   = this.firstPane.cumulativeOffset();

    if (this.options.constraint == 'vertical')
      this.resizeVertical(paneSize + offset[1]);
    else
      this.resizeHorizontal(paneSize + offset[0]);
  },

  _initializePaneDimensions: function()
  {
    if (this.options.constraint == 'vertical')
    {
      var topOffset = parseInt(this.dragHandle.getStyle('top')) + parseInt(this.dragHandle.getStyle('height'));
      this.secondPane.setStyle('top: ' + topOffset  + 'px');
    }
    else
    {
      var leftOffset = parseInt(this.dragHandle.getStyle('left')) + parseInt(this.dragHandle.getStyle('width'));
      this.secondPane.setStyle('left: ' + leftOffset + 'px');
    }
  },


  _insertDragHandle: function(constraint)
  {
    this.dragHandle = new Element("div").addClassName("dragHandle");
    this.dragHandle.addClassName(constraint);
    Element.insert(this.firstPane, { after: this.dragHandle });
  },

  _setupObservers: function()
  {
    this.dragHandle.observe('mouseup', this._resetDragHandleClickOffset.bind(this));
    this.dragHandle.observe('mousedown', this._determineDragHandleClickOffset.bind(this));
  },

  _determineDragHandleClickOffset: function(event)
  {
    if (this.options.constraint == 'vertical')
    {
      var offset = (this.firstPane.cumulativeOffset()[1] + this.firstPane.getHeight() + this.dragHandle.getHeight()) - event.clientY;
      this.dragHandleClickOffset = this.dragHandle.getHeight() - offset;
    }
    else
    {
      var offset = (this.firstPane.cumulativeOffset()[0] + this.firstPane.getWidth() + this.dragHandle.getWidth()) - event.clientX;
      this.dragHandleClickOffset = this.dragHandle.getWidth() - offset;
    }
  },

  _resetDragHandleClickOffset: function(event)
  {
    this.dragHandleClickOffset = null;
    this._persistState();
  }

});




Aphid.UI.LoadingIndicator = Class.create({

  /*
   * Aphid.UI.LoadingIndicator#_canvas -> Element
   *
   * The canvas element where the loading indicator is drawn.
  **/
  _canvas: false,

  /*
   * Aphid.UI.LoadingIndicator#_canvas -> Element
   *
   * The canvas context for the loading indicator.
  **/
  _context: false,

  barCount: false,

  barSize: false,

  barColor: false,

  centerPosition: false,

  innerRadius: false,

  isAnimating: false,

  /*
   * Aphid.UI.LoadingIndicator#_currentOffset -> Integer
   *
   * Whether or not the loading indicator is currently animating.
  **/
  _currentOffset: 0,

  initialize: function()
  {
    $L.info('Initializing...', 'Aphid.UI.LoadingIndicator');

    this.barCount       = 10;
    this.barSize        = { width: 4, height: 12 };
    this.centerPosition = { x: 48, y: 48 };
    this.innerRadius    = 10;

    this._canvas = new Element("canvas",
      {
        id: "loadingIndicator",
        width: 96,
        height: 96
      }
    );

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

  show: function()
  {
    if (this.isAnimating) return;

    $L.info('Showing the loading indicator...', 'Aphid.UI.LoadingIndicator');

    this._startAnimation();
    var opacity = $(this._canvas).getStyle('opacity');
    this._canvas.appear({ duration: 0.35, to: opacity });
  },

  hide: function()
  {
    $L.info('Hiding the loading indicator...', 'Aphid.UI.LoadingIndicator');
    this._canvas.fade({ duration: 0.15 });
    this._stopAnimation.bind(this).delay(0.15);
  },

  /*
   * Aphid.UI.LoadingIndicator#_startAnimation() -> null
   *
   * Starts the loading indicator animation.
  **/
  _startAnimation: function()
  {
    this.isAnimating = true;
    this._animateNextFrame(0);
  },

  /*
   * Aphid.UI.LoadingIndicator#_stopAnimation() -> null
   *
   * Stops drawing the loading indicator and clears its context state.
  **/
  _stopAnimation: function()
  {
    this.isAnimating = false;
    this._clearFrame(this._context);
  },

  /*
   * Aphid.UI.LoadingIndicator#_draw(context, offset) -> null
  **/
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
  **/
  _drawBlock: function(context, barNumber)
  {
    context.fillStyle = this._makeRGBA(this.barColor.red, this.barColor.green, this.barColor.blue, (this.barCount + 1 - barNumber) / (this.barCount + 1));
    context.fillRect(-this.barSize.width / 2, 0, this.barSize.width, this.barSize.height);
  },

  /*
   * Aphid.UI.LoadingIndicator#_animateNextFrame() -> null
  **/
  _animateNextFrame: function()
  {
    if (!this.isAnimating) return;
    this._currentOffset = (this._currentOffset + 1) % this.barCount;
    this._draw(this._context, this._currentOffset);
    this._animateNextFrame.bind(this).delay(0.05);
  },

  /*
   * Aphid.UI.LoadingIndicator#_clearFrame() -> null
  **/
  _clearFrame: function(context)
  {
    context.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
  },

  /*
   * Aphid.UI.LoadingIndicator#_calculateAngle(barNumber) -> Float
  **/
  _calculateAngle: function(barNumber)
  {
    return 2 * barNumber * Math.PI / this.barCount;
  },

  /*
   * Aphid.UI.LoadingIndicator#_calculatePosition(barNumber) -> Object
  **/
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
    return "rgba(" + [].slice.call(arguments, 0).join(",") + ")";
  }

});
Aphid.UI.AlertView = Class.create(Aphid.UI.View,
{

  title: false,

  /*
   * Aphid.UI.AlertView#_titleElement -> Element | false
   *
   * A reference to the element that will display the title string in the
   * alert dialog markup.
  **/
  _titleElement: false,

  message: false,

  /*
   * Aphid.UI.AlertView#_messageElement -> Element | false
   *
   * A reference to the element that will display the message string in the
   * alert dialog markup.
  **/
  _messageElement: false,

  status: false,

  /*
   * Aphid.UI.AlertView#_statusElement -> Element | false
   *
   * A reference to the element that will display the status message string in
   * the alert dialog markup.
  **/
  _statusElement: false,


  initialize: function($super, options)
  {
    options = $H(options);
    options.set("element", this._element());
    $super(options);
  },

  /*
   * Aphid.UI.AlertView#_element() -> Element
   *
   * Creates the element for the AlertView programmatically.
  **/
  _element: function()
  {

    var element = new Element("section");
    element.addClassName("AlertView");

    var headerElement = new Element("header");
    this._titleElement = new Element("h1");
    headerElement.insert(this._titleElement);
    element.insert(headerElement);

    this._messageElement = new Element("p").addClassName("message");
    element.insert(this._messageElement);

    this._statusElement = new Element("p").addClassName("status");
    element.insert(this._statusElement);

    var closeButton = new Element("input", { type: "button", value: "Dismiss" });
    closeButton.observe("click", this.dismissAnimated.bind(this));
    element.insert(closeButton);

    return element;
  },

  show: function()
  {
    this.showAnimated(false);
  },

  showAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;

    if (Aphid.UI.AlertView.currentAlertView) return;

    this._titleElement.update(this.title || "");
    this._messageElement.update(this.message || "");
    this._statusElement.update(this.status || "");

    var mainWindow = Application.sharedInstance.mainWindow;
    mainWindow.displayOverlayAnimated(animated);
    mainWindow.addSubview(this);
  },

  dismiss: function()
  {
    this.dismissAnimated(false);
  },

  dismissAnimated: function(animated)
  {
    if (Object.isUndefined(animated)) animated = true;

    var mainWindow = Application.sharedInstance.mainWindow;
    mainWindow.dismissOverlayAnimated(animated);

    this.removeFromSuperviewAnimated();

    this.title = false;
    this.message = false;
    this.status = false;
  }

});

Aphid.UI.AlertView.currentAlertView = false;

Aphid.UI.ListView = Class.create(Aphid.UI.View, {

  displayName: "Aphid.UI.ListView",

  dataSource: false,

  items: false,

  selectedItem: false,

  selectedItems: false,

  selectedItemIndex: false,

  selectedItemIndexes: false,

  multipleSelectionEnabled: false,

  sortingEnabled: false,

  sortableOptions: false,


  initialize: function($super, options)
  {
    this.items = $A();
    this.sortableOptions = {
      handle: "handle",
      onChange: this._listViewOrderDidChange.bind(this),
      onUpdate: this._listViewOrderDidUpdate.bind(this)
    };
    $super(options);
    if (this.multipleSelectionEnabled)
    {
      this.selectedItems = $A();
      this.selectedItemIndexes = $A();
    }
    else
    {
      this.selectedItems = false;
      this.selectedItemIndex = false;
    }
    if (this.dataSource)
      this.reloadData();
  },

  /*
   * Aphid.UI.ListView#_initializeStaticListViewItems() -> null
  **/
  _initializeStaticListViewItems: function()
  {
    var items = this.element.select('>li').collect(
      function(element)
      {
        return new Aphid.UI.ListViewItem({ element: element });
      });
    this.setItems(items);
  },

  viewDidLoad: function($super)
  {
    $super();
    if (this._validateContainer())
    {
      this.element.addClassName('ListView');
      this.element.observe('click', this.clearSelection.bind(this));
      this._initializeStaticListViewItems();
    }
  },


  setItems: function(items)
  {
    if (!items.all(this._validateItem))
    {
      $L.error("All items must be instances of Aphid.UI.ListViewItem!", "Aphid.UI.ListView");
      return;
    }

    this.clearSelection();
    this.element.update();
    this.items = $A();

    items.each(this._addItem, this);

    if (this.items.length > 0 && this.sortingEnabled)
      this._setupSorting();

    return items;
  },

  addItem: function(item)
  {
    this._addItem(item);
    if (this.sortingEnabled)
      this._setupSorting();
    return item;
  },

  /*
   * Aphid.UI.ListView#addItem(item) -> Aphid.UI.ListViewItem
   *
   * - item (Element): The item to be added to the list
   *
   * Internal implementation for adding an item to the list view that bypasses
   * any delegate or callback methods.
  **/
  _addItem: function(item)
  {

    this.items.push(item);

    if (item.isSelected)
    {
      var itemIndex = this.items.indexOf(item);
      if (!this.multipleSelectionEnabled)
      {
        if (this.selectedItem) this._deselectItem(this.selectedItem);
        this.selectedItem = item;
        this.selectedItemIndex = itemIndex;
      }
      else
      {
        this.selectedItems.push(item);
        this.selectedItemIndexes.push(itemIndex);
      }
    }

    item.listView = this;

    this.addSubview(item);

    this._initializeItem(item);

    return item;

  },

  removeItem: function(item)
  {
    if (!this.items.include(item))
    {
      $L.error("Attempted to remove item that is not a part of the list", this.displayName);
      return;
    }
    this.deselectItem(item);
    item.removeFromSuperview();
    this.items.remove(item);
  },

  /*
   * Aphid.UI.ListView#_initializeItems() -> null
   *
   * Calls [[Aphid.UI.ListView#_initializeItem]] for each item.
  **/
  _initializeItems: function()
  {
    this.items.each(this._initializeItem, this);
  },

  /*
   * Aphid.UI.ListView#_initializeItem(item) -> null
   *
   * - item (Element): the item to be initialized
   *
   * Initializes the item by adding observers and sort handles, if enabled.
  **/
  _initializeItem: function(item)
  {
    item.element.observe('click', this._handleClickEvent.bindAsEventListener(this, item));
    item.element.observe('dblclick', this._handleDoubleClickEvent.bindAsEventListener(this, item));
  },


  reloadData: function()
  {
    var items     = $A();
    var itemCount = this._listViewItemCount();
    for (var i = 0; i < itemCount; i++)
      items.push(this._listViewItemForIndex(i));
    this.setItems(items);
  },

  /*
   * Aphid.UI.ListView#_listViewItemCount() -> null
   *
   * Proxy method that returns the list view item count as defined by the
   * dataSource. If the object set as the dataSource has not implemented the
   * `listViewItemCount` method, an error will be raised.
  **/
  _listViewItemCount: function()
  {
    var listViewItemCount = 0;
    if (this.dataSource && this.dataSource.listViewItemCount)
      listViewItemCount = this.dataSource.listViewItemCount(this);
    else
      $L.error('Data source does not implement required method "listViewItemCount(listView)"', this.displayName);
    return listViewItemCount;
  },

  /*
   * Aphid.UI.ListView#_listViewItemForIndex(index) -> null
   *
   * Proxy method that returns the list view item for the specified index as
   * returned by the dataSource. If the object set as the dataSource has not
   * implemented the `listViewItemForIndex` method, an error will be raised.
  **/
  _listViewItemForIndex: function(index)
  {
    var listViewItem;
    if (this.dataSource && this.dataSource.listViewItemForIndex)
      listViewItem = this.dataSource.listViewItemForIndex(this, index);
    else
      $L.error('Data source does not implement required method "listViewItemForIndex(listView, index)"', this.displayName);
    return listViewItem;
  },


  selectItem: function(item)
  {
    if (!this._shouldSelectItem(item))
      return false;

    var index = this.items.indexOf(item);

    if (!this.multipleSelectionEnabled)
    {
      this._clearSelection();
      this.selectedItem = item.select();
      this.selectedItemIndex = index;
      this.scrollToSelectedItem();
    }
    else
    {
      this.selectedItems.push(item.select());
      this.selectedItemIndexes.push(index);
    }

    this._didSelectItem(item);

    return true;
  },

  selectItemAtIndex: function(index)
  {
    var item = this.items[index];
    return this.selectItem(item);
  },

  deselectItem: function(item)
  {
    if (!this._shouldDeselectItem(item))
      return false;
    this._deselectItem(item);
    this._didDeselectItem(item);
    return true;
  },

  deselectItemAtIndex: function(index)
  {
    var item = this.items[index];
    return this.deselectItem(item);
  },

  /*
   * Aphid.UI.ListView#_deselectItem(listItem) -> null
   *
   * Internal implementation for deselecting the specified list item without
   * calling any of the delegate or callback methods.
  **/
  _deselectItem: function(item)
  {
    var index = this.items.indexOf(item);

    item.deselect();

    if (this.multipleSelectionEnabled)
    {
      this.selectedItems = this.selectedItems.without(item);
      this.selectedItemIndexes = this.selectedItemIndexes.without(index);
    }
    else
    {
      this.selectedItem = false;
      this.selectedItemIndex = false;
    }
  },

  clearSelection: function()
  {
    if (!this._shouldClearSelection())
      return;

    this._clearSelection();

    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, false);
  },

  _clearSelection: function()
  {
    if (this.items)
      this.items.invoke('deselect');
    if (this.selectedItem)
    {
      this.selectedItem = false;
      this.selectedItemIndex = false;
    }
    if (this.multipleSelectionEnabled)
    {
      this.selectedItems = $A();
      this.selectedItemIndexes = $A();
    }
    else
    {
      this.selectedItems = false;
      this.selectedItemIndexes = false;
    }
  },

  openItem: function(item)
  {
    if (!this._shouldOpenItem(item))
      return;

    this._didOpenItem(item);
  },

  openItemAtIndex: function(index)
  {
    var item = this.items[itemIndex];
    return this.openItem(item);
  },

  scrollToSelectedItem: function()
  {
    if (this.element.scrollHeight < this.element.getHeight())
      return;

    var selectedItemTop     = this.selectedItem.element.cumulativeOffset().top - this.element.cumulativeOffset().top;
    var selectedItemBottom  = selectedItemTop + this.selectedItem.element.getHeight();
    var currentScrollTop    = this.element.scrollTop;
    var currentScrollBottom = this.element.scrollTop + this.element.getHeight();
    var itemTopMargin       = parseInt(this.selectedItem.element.getStyle("margin-top"));
    var itemBottomMargin    = parseInt(this.selectedItem.element.getStyle("margin-bottom"));
    var scrollTo            = selectedItemTop - itemTopMargin;
    var shouldScroll        = false;

    if (selectedItemTop < currentScrollTop)
      shouldScroll = true;

    if (selectedItemTop >= currentScrollBottom)
      shouldScroll = true;

    else if (selectedItemBottom > currentScrollBottom)
    {
      shouldScroll = true;
      scrollTo = currentScrollTop + (selectedItemBottom - currentScrollBottom) + itemBottomMargin;
    }

    if (shouldScroll)
      this.element.scrollTop = scrollTo;

    return shouldScroll;
  },


  /*
   * Aphid.UI.ListView#_setupSorting() -> null
  **/
  _setupSorting: function()
  {
    if (this.element.hasClassName('sortable'))
      Sortable.destroy(this.element);
    else
      this.element.addClassName('sortable');
    this._addDragHandlesToItems();
    this._addOrderedIdentitiesToItems();
    Sortable.create(this.element, this.sortableOptions);
  },

  _addOrderedIdentitiesToItems: function()
  {
    this.items.each(function(item) { item.element.identify() });
  },

  _addDragHandlesToItems: function()
  {
    this.items.each(this._addDragHandleToItem, this);
  },

  _addDragHandleToItem: function(item)
  {
    if (item.element.down('div.handle')) return;
    var dragHandle = new Element('div').addClassName('handle');
    item.element.insert(dragHandle);
  },

  _listViewOrderDidChange: function()
  {
    $L.info('_listViewOrderDidChange', 'Aphid.UI.ListView');
    if (this.delegate && this.delegate.listViewOrderDidChange)
      this.delegate.listViewOrderDidChange(this);
  },

  _listViewOrderDidUpdate: function()
  {
    $L.info('_listViewOrderDidUpdate', 'Aphid.UI.ListView');
    if (this.delegate && this.delegate.listViewOrderDidUpdate)
      this.delegate.listViewOrderDidUpdate(this);
  },


  /*
   * Aphid.UI.ListView#_handleClickEvent() -> null
   *
   * Handles "click" events that are triggered by the observer on each item.
  **/
  _handleClickEvent: function(event, item)
  {
    event.stop();

    if (this.multipleSelectionEnabled && item.isSelected)
      this.deselectItem(item);
    else
      this.selectItem(item);
  },

  /*
   * Aphid.UI.ListView#_handleDoubleClickEvent() -> null
   *
   * Handles "dblclick" events that are triggered by the observer on each item.
  **/
  _handleDoubleClickEvent: function(event, item)
  {
    event.stop();
    this.selectItem(item);
    this.openItem(item);
  },


  /*
   * Aphid.UI.ListView#_shouldSelectItem(item) -> Boolean
   *
   * Checks for basic conditions that should prevent item selection from
   * occurring, such as the item already being selected. It also evaluates the
   * `shouldSelectItem` callback and the `listViewShouldSelectItem` delegate
   * method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the item should be
   * selected.
  **/
  _shouldSelectItem: function(item)
  {
    var shouldSelect = true;
    if (item == this.selectedItem)
      shouldSelect = false;
    if (this.shouldSelectItem)
      shouldSelect = this.shouldSelectItem(item);
    if (this.delegate && this.delegate.listViewShouldSelectItem)
      shouldSelect = this.delegate.listViewShouldSelectItem(this, item);
    return shouldSelect;
  },

  /*
   * Aphid.UI.ListView#_didSelectItem(item) -> null
   *
   * Performs any internal actions after an item has been selected before
   * calling the `didSelectItem` callback and the `listViewSelectionDidChange`
   * delegate method.
  **/
  _didSelectItem: function(item)
  {
    if (this.didSelectItem)
      this.didSelectItem(item);

    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, item);
  },

  /*
   * Aphid.UI.ListView#_shouldDeselectItem(item) -> Boolean
   *
   * Checks for basic conditions that should prevent item deselection from
   * occurring, such as the item not being selected. It also evaluates the
   * `shouldDeselectItem` callback and the `listViewShouldDeselectItem`
   * delegate method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the item should be
   * deselected.
  **/
  _shouldDeselectItem: function(item)
  {
    var shouldDeselect = true;
    if (this.multipleSelectionEnabled && !this.selectedItems.include(item))
      shouldDeselect = false;
    else if (!this.multipleSelectionEnabled && item != this.selectedItem)
      shouldDeselect = false;
    if (this.shouldDeselectItem)
      shouldDeselect = this.shouldDeselectItem(item);
    if (this.delegate && this.delegate.listViewShouldDeselectItem)
      shouldDeselect = this.delegate.listViewShouldDeselectItem(this, item);
    return shouldDeselect;
  },

  /*
   * Aphid.UI.ListView#_didDeselectItem(item) -> null
   *
   * Performs any internal actions after an item has been deselected before
   * calling the `didDeselectItem` callback and the `listViewSelectionDidChange`
   * delegate method.
  **/
  _didDeselectItem: function(item)
  {
    if (this.didDeselectItem)
      this.didDeselectItem(item);

    if (this.delegate && this.delegate.listViewSelectionDidChange)
      this.delegate.listViewSelectionDidChange(this, item);
  },

  /*
   * Aphid.UI.ListView#_shouldClearSelection(item) -> Boolean
   *
   * Checks for basic conditions that should prevent the selection from being
   * cleared, such as when no items are currently selected. It also evaluates
   * the `shouldClearSelection` callback and the `listViewShouldClearSelection`
   * delegate method before returning *true* or *false*.
   *
   * Delegates have the final say in whether or not the list selection should
   * be cleared.
  **/
  _shouldClearSelection: function()
  {
    var shouldClearSelection = true;
    if (this.multipleSelectionEnabled && this.selectedItems.length == 0)
      shouldClearSelection = false;
    else if (!this.multipleSelectionEnabled && !this.selectedItem)
      shouldClearSelection = false;
    if (this.shouldClearSelection)
      shouldClearSelection = this.shouldClearSelection();
    if (this.delegate && this.delegate.listViewShouldClearSelection)
      shouldClearSelection = this.delegate.listViewShouldClearSelection(this);
    return shouldClearSelection;
  },

  /*
   * Aphid.UI.ListView#_shouldOpenItem(item) -> Boolean
   *
   * Checks with the subclass and delegate to see if the item should be
   * opened.
   *
   * Delegates have the final say in whether or not the item should be
   * opened.
  **/
  _shouldOpenItem: function(item)
  {
    var shouldOpen = true;
    if (this.shouldOpenItem)
      shouldOpen = this.shouldOpenItem(item);
    if (this.delegate && this.delegate.listViewShouldOpenItem)
      shouldDeselect = this.delegate.listViewShouldOpenItem(this, item);
    return shouldOpen;
  },

  /*
   * Aphid.UI.ListView#_didOpenItem(item) -> null
   *
   * Performs any internal actions after an item has been opened before
   * calling the `didOpenItem` callback and the `listViewDidOpenItem`
   * delegate method.
  **/
  _didOpenItem: function(item)
  {
    if (this.didOpenItem)
      this.didOpenItem(item);

    if (this.delegate && this.delegate.listViewDidOpenItem)
      this.delegate.listViewDidOpenItem(this, item);
  },


  /*
   * Aphid.UI.ListView#_validateContainer() -> Boolean
   *
   * Evaluates the element for this instance to ensure that the element meets
   * all requirements to be used with this class.
  **/
  _validateContainer: function()
  {
    if (this.element.tagName != 'UL')
    {
      $L.error('Container (' + this.element.inspect() + ') is not an Unordered List (<ul>).', 'Aphid.UI.ListView');
      return false;
    }
    return true;
  },

  _validateItem: function(item)
  {
    return (item instanceof Aphid.UI.ListViewItem);
  }

});


Aphid.UI.ListView.prototype.initialize.displayName = "Aphid.UI.ListView.initialize";
Aphid.UI.ListView.prototype.setItems.displayName = "Aphid.UI.ListView.setItems";
Aphid.UI.ListView.prototype.addItem.displayName = "Aphid.UI.ListView.addItem";
Aphid.UI.ListView.prototype.selectItem.displayName = "Aphid.UI.ListView.selectItem";
Aphid.UI.ListView.prototype.selectItemAtIndex.displayName = "Aphid.UI.ListView.selectItemAtIndex";
Aphid.UI.ListView.prototype.deselectItem.displayName = "Aphid.UI.ListView.deselectItem";
Aphid.UI.ListView.prototype.deselectItemAtIndex.displayName = "Aphid.UI.ListView.deselectItemAtIndex";
Aphid.UI.ListView.prototype.clearSelection.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype.openItem.displayName = "Aphid.UI.ListView.clearSelection";
Aphid.UI.ListView.prototype._initializeItems.displayName = "Aphid.UI.ListView._initializeItems";
Aphid.UI.ListView.prototype._initializeItem.displayName = "Aphid.UI.ListView._initializeItem";
Aphid.UI.ListView.prototype._setupSorting.displayName = "Aphid.UI.ListView._setupSorting";
Aphid.UI.ListView.prototype._addOrderedIdentitiesToItems.displayName = "Aphid.UI.ListView._addOrderedIdentitiesToItems";
Aphid.UI.ListView.prototype._addDragHandlesToItems.displayName = "Aphid.UI.ListView._addDragHandlesToItems";
Aphid.UI.ListView.prototype._addDragHandleToItem.displayName = "Aphid.UI.ListView._addDragHandleToItem";
Aphid.UI.ListView.prototype._listViewOrderDidChange.displayName = "Aphid.UI.ListView._listViewOrderDidChange";
Aphid.UI.ListView.prototype._listViewOrderDidUpdate.displayName = "Aphid.UI.ListView._listViewOrderDidUpdate";
Aphid.UI.ListView.prototype._handleClickEvent.displayName = "Aphid.UI.ListView._handleClickEvent";
Aphid.UI.ListView.prototype._handleDoubleClickEvent.displayName = "Aphid.UI.ListView.prototype._handleDoubleClickEvent"
Aphid.UI.ListView.prototype._shouldSelectItem.displayName = "Aphid.UI.ListView._shouldSelectItem";
Aphid.UI.ListView.prototype._didSelectItem.displayName = "Aphid.UI.ListView._didSelectItem";
Aphid.UI.ListView.prototype._shouldDeselectItem.displayName = "Aphid.UI.ListView._shouldDeselectItem";
Aphid.UI.ListView.prototype._didDeselectItem.displayName = "Aphid.UI.ListView._didDeselectItem";
Aphid.UI.ListView.prototype._shouldClearSelection.displayName = "Aphid.UI.ListView._shouldClearSelection"
Aphid.UI.ListView.prototype._shouldOpenItem.displayName = "Aphid.UI.ListView._shouldOpenItem";
Aphid.UI.ListView.prototype._didOpenItem.displayName = "Aphid.UI.ListView._didOpenItem";
Aphid.UI.ListView.prototype._validateContainer.displayName = "Aphid.UI.ListView._validateContainer";
Aphid.UI.ListView.prototype._validateItem.displayName = "Aphid.UI.ListView._validateItem";

Aphid.UI.ListViewItem = Class.create(Aphid.UI.View, {

  displayName: "ListViewItem",

  isSelected: false,

  listView: false,


  initialize: function($super, options)
  {
    $super(options);
    if (!this.element)
    {
      $L.debug("Initializing default element...", this.displayName)
      this.element = new Element('li').addClassName("ListViewItem");
      this.isLoaded = true;
    }
  },

  viewDidLoad: function($super)
  {
    this.element.addClassName("ListViewItem");
  },


  select: function()
  {
    $L.debug("Selected...", this.displayName);
    this.element.addClassName('selected');
    this.isSelected = true;
    return this;
  },

  deselect: function()
  {
    $L.debug("Deselected...", this.displayName);
    this.element.removeClassName('selected');
    this.isSelected = false;
    return this;
  }

});


Aphid.UI.ListViewItem.prototype.select.displayName = "Aphid.UI.ListViewItem.select";
Aphid.UI.ListViewItem.prototype.deselect.displayName = "Aphid.UI.ListViewItem.deselect";
