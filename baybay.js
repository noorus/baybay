define(function()
{
  function BBCodeParseError( message )
  {
    this.message = message;
  }
  function BBTagInstance( tag, close )
  {
    this.tag = tag;
    this.close = close;
  }
  BBTagInstance.prototype.render = function( capture )
  {
    return this.tag.render( this.close, capture );
  };
  function BBSimpleTag( tag )
  {
    this.tag = tag;
    this.capture = false;
    this.render = function( close, capture )
    {
      return "<" + ( close ? "/" : "" ) + this.tag + ">";
    };
  }
  function BBImageTag()
  {
    this.tag = "img";
    this.capture = true;
    this.render = function( close, capture )
    {
      if ( !close )
        return "";
      // TODO: Clean up in case of nasties
      return "<img src=\"" + capture + "\">";
    };
  }
  function BBCode()
  {
    this._stack = [];
    this._capture = null;
    this._tags = [
      new BBSimpleTag( "b" ),
      new BBSimpleTag( "i" ),
      new BBSimpleTag( "u" ),
      new BBImageTag()
    ];
  }
  BBCode.prototype.parseTag = function( content )
  {
    if ( !content )
      return null;
    var close = ( content[0] == "/" );
    if ( close )
      content = content.substr( 1 );
    content = content.split( "=" );
    for ( var i = 0; i < this._tags.length; i++ )
    {
      if ( this._tags[i].tag == content[0] )
      {
        var tag = new BBTagInstance( this._tags[i], close );
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
            parsed += instance.render( this._capture );
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
    if ( this._stack.length > 0 )
    {
      for ( i = this._stack.length - 1; i >= 0; i-- )
      {
        var instance = this._stack[i];
        instance.close = true;
        parsed += instance.render( this._capture );
        this._capture = null;
      }
    }
    return parsed;
  };
  return BBCode;
});
