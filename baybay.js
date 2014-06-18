( function( root, factory )
{
  if ( typeof define === "function" && define.amd )
  {
    // AMD
    define( ["exports"], factory );
  }
  else if ( typeof exports === "object" )
  {
    // CommonJS
    factory( exports );
  }
  else
  {
    // Browser
    factory( ( root.baybay = {} ) );
  }
}
( this, function( exports )
{
  function BBCodeParseError( message )
  {
    this.message = message;
  }

  function BBTagInstance( tag, close, arguments )
  {
    this.tag = tag;
    this.close = close;
    this.args = arguments;
  }

  BBTagInstance.prototype.render = function( capture )
  {
    return this.tag.render( this.close, capture, this.args );
  };

  function BBSimpleTag( bb, tag )
  {
    this._bb = bb;
    this.tag = tag;
    this.capture = false;
    this.render = function( close, capture, arguments )
    {
      return "<" + ( close ? "/" : "" ) + this.tag + ">";
    };
  }

  function BBImageTag( bb )
  {
    this._bb = bb;
    this.tag = "img";
    this.capture = true;
    this.render = function( close, capture, arguments )
    {
      if ( !close )
        return "";
      capture = this._bb.sanitizeURLArgument( capture );
      if ( !capture )
        return "";
      return "<img src=\"" + capture + "\">";
    };
  }

  function BBColorTag( bb )
  {
    this._bb = bb;
    this.tag = "color";
    this.capture = false;
    this.render = function( close, capture, arguments )
    {
      if ( close )
        return "</span>";
      if ( !arguments[0] || !arguments[0][1] )
        return "<span>";
      var color = this._bb.sanitizeColorArgument( arguments[0][1] );
      if ( !color )
        return "<span>";
      return "<span style=\"color: " + color + ";\">";
    }
  }

  function BBCode()
  {
    this._stack = [];
    this._capture = null;
    this._tags = [
      // Enables the [b] tag for bolding
      new BBSimpleTag( this, "b" ),
      // Enables the [i] tag for italics
      new BBSimpleTag( this, "i" ),
      // Enables the [u] tag for underlining
      new BBSimpleTag( this, "u" ),
      // Enables the [img] tag for image linking
      new BBImageTag( this ),
      // Enables the [color] tag for text coloring
      new BBColorTag( this )
    ];
  }

  BBCode.prototype.sanitizeColorArgument = function( color )
  {
    color = color.trim().toLowerCase();
    if ( /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test( color ) )
      return color;
    // http://www.w3.org/TR/CSS21/syndata.html#color-units
    var colors = [
      "white", "silver", "gray", "black", "red", "maroon",
      "yellow", "olive", "lime", "green", "aqua", "teal",
      "blue", "navy", "fuchsia", "purple", "orange"
    ];
    if ( colors.indexOf( color ) != -1 )
      return color;
    return null;
  };

  BBCode.prototype.sanitizeURLArgument = function( url )
  {
    try {
      url = encodeURI( url.trim() );
      url = url.replace( /%5B/g, "[" ).replace( /%5D/g, "]" );
      return url;
    } catch ( e ) {
      return null;
    }
  };

  BBCode.prototype.parseTag = function( content )
  {
    if ( !content )
      return null;
    content = content.trim();
    var close = ( content[0] == "/" );
    if ( close )
      content = content.substr( 1 );
    content = content.split( " " );
    for ( var i = 0; i < content.length; i++ )
      content[i] = ( content[i].trim() ).split( "=" );
    if ( !content[0] || !content[0][0] )
      return null;
    for ( var i = 0; i < this._tags.length; i++ )
    {
      if ( this._tags[i].tag == content[0][0] )
      {
        var tag = new BBTagInstance( this._tags[i], close, content );
        return tag;
      }
    }
    return null;
  };

  BBCode.prototype.parse = function( content )
  {
    var parsed = "";
    var i = 0;
    var len = content.length;
    while ( i < len )
    {
      if ( content[i] == "[" )
      {
        var close = content.indexOf( "]", i + 1 );
        var next  = content.indexOf( "[", i + 1 );
        if ( close < 0 || ( next >= 0 && next < close ) )
        {
          // You don't often wish for goto in a language, but I guess this is one of those times
          if ( this._capture !== null )
            this._capture += content[i];
          else
            parsed += content[i];
          i++;
          continue;
        }
        if ( close > 0 )
        {
          var sub = content.substr( i + 1, close - i - 1 );
          var instance = this.parseTag( sub );
          if ( instance !== null )
          {
            if ( !instance.close && this._capture === null )
            {
              this._stack.push( instance );
              if ( instance.tag.capture )
                this._capture = "";
            }
            else
            {
              var match = ( this._stack.length < 1 || this._stack[this._stack.length-1].tag.tag == instance.tag.tag );
              if ( !match )
              {
                if ( this._capture !== null )
                  this._capture += content[i];
                else
                {
                  if ( this._stack.length > 0 )
                    throw new BBCodeParseError( "Mismatched tags" );
                  parsed += content[i];
                }
                i++;
                continue;
              }
              this._stack.pop();
            }
            var rendered = instance.render( this._capture );
            if ( rendered )
              parsed += rendered;
            if ( instance.close )
              this._capture = null;
            i += sub.length + 2;
            continue;
          }
        }
      }
      if ( this._capture !== null )
        this._capture += content[i];
      else
        parsed += content[i];
      i++;
    }
    while ( this._stack.length > 0 )
    {
      var instance = this._stack.pop();
      instance.close = true;
      parsed += instance.render( this._capture );
      this._capture = null;
    }
    return parsed;
  };

  var simpleInstance;

  exports.create = function()
  {
    return new BBCode();
  };
  exports.parse = function( str )
  {
    simpleInstance = simpleInstance || new BBCode();
    return simpleInstance.parse( str );
  };
}));
