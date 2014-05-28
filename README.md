baybay(ˈbeɪbeɪ)
===============

...is a BBCode parser in JS, returning HTML output.

### Why..?

Well, honestly, because all the other parsers I looked at were kinda bad.  
You don't need 1500 lines for a BBCode parser. You just *don't*.

So here we are. One loop, a stack and a couple string utils.

### Usage

Baybay is a small [UMD](https://github.com/umdjs/umd) module and does not depend on anything.  
Baybay does its best to be *idiot-proof*, and will never generate invalid HTML.

    var bb = require( "baybay" );
    var str = "[b][[i]dumb []t[b]e[/b]xt[x] [color=red]and an[/color] \
      [img]http://localhost/image.png";
    console.log( bb.parse( str ) );

This example gives you:

    <b>[<i>dumb []t<b>e</b>xt[x] <span style="color: red;">and an</span>
    <img src="http://localhost/image.png"></i></b>

### License

Baybay is licensed under the MIT license.  
For full license text, see the LICENSE file.
