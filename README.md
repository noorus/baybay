# baybay(ˈbeɪbeɪ)

[![NPM version](https://badge.fury.io/js/baybay.png)](http://badge.fury.io/js/baybay)  
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

### Installation

Through Node Package Manager: `npm install baybay`  
Or directly through Git: `git clone https://github.com/noorus/baybay.git`

### Building

When using baybay in the browser, you might want to build the minified version `baybay.min.js`.  
To do this, call `grunt uglify`.

### License

Baybay is licensed under the MIT license.  
For full license text, see the LICENSE file.
