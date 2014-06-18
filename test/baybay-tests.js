var assert = require( "assert" );

module.exports = function( bb )
{
  describe( "Parsing", function()
  {
    it( "Should parse the [b] tag correctly", function()
    {
      var src = "some [b]bold text  [/b] and stuff";
      var expected = "some <b>bold text  </b> and stuff";
      assert.equal( bb.parse( src ), expected );
    });
    it( "Should parse the [i] tag correctly", function()
    {
      var src = "some [i] italic text[/i] and stuff";
      var expected = "some <i> italic text</i> and stuff";
      assert.equal( bb.parse( src ), expected );
    });
    it( "Should parse the [u] tag correctly", function()
    {
      var src = "[u]underlined text[/u]";
      var expected = "<u>underlined text</u>";
      assert.equal( bb.parse( src ), expected );
    });
    it( "Should parse the [img] tag correctly", function()
    {
      var src = "[img]http://lorempixel.com/g/20/20/[/img]";
      var expected = "<img src=\"http://lorempixel.com/g/20/20/\">";
      assert.equal( bb.parse( src ), expected );
    });
    it( "Should parse the [color] tag with html color name arguments correctly", function()
    {
      var args = ["white", "silver", "gray", "black", "red", "maroon",
        "yellow", "olive", "lime", "green", "aqua", "teal",
        "blue", "navy", "fuchsia", "purple", "orange"];
      for ( var i = 0; i < args.length; i++ )
      {
        var src = "[color=\"" + args[i] + "\"]colored text[/color]";
        var expected = "<span style=\"color: " + args[i] + ";\">colored text</span>";
        assert.equal( bb.parse( src ), expected );
      }
    });
    it( "Should parse the [color] tag with hex color code arguments correctly", function()
    {
      var args = ["#fff","#ffffff","#0b0a0d"];
      for ( var i = 0; i < args.length; i++ )
      {
        var src = "[color=\"" + args[i] + "\"]colored text[/color]";
        var expected = "<span style=\"color: " + args[i] + ";\">colored text</span>";
        assert.equal( bb.parse( src ), expected );
      }
    });
    it( "Should ignore bad [color] tag arguments", function()
    {
      var args = ["#f","#ff","unknown","#xff","rainbow"];
      for ( var i = 0; i < args.length; i++ )
      {
        var src = "[color=\"" + args[i] + "\"]colored text[/color]";
        var expected = "<span>colored text</span>";
        assert.equal( bb.parse( src ), expected );
      }
    });
    it( "Should ignore unknown tags", function()
    {
      var unknown = ["[x]","[y]","[unknown]","[/nonmatching]","[/shouldn't]","[matter]"];
      var src = unknown.join( "" );
      assert.equal( bb.parse( src ), src );
    });
    it( "Should survive a nasty string, dropping malformed tags", function()
    {
      var src = "[b][[i]dumb []t[b]e[/b]xt[x] [color=#00f\"<scriptfff]and an[/color] [img]http://paha\uDFFF.cc?dummy=\"><script>alert('ohnoes');";
      var expected = "<b>[<i>dumb []t<b>e</b>xt[x] <span>and an</span> </i></b>";
      assert.equal( bb.parse( src ), expected );
    });
  });
}
