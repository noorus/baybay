baybay
======

BBCode parser in JS. Yeah, it's a stupid name.

### Why..?

Well, honestly, because all the other parsers I looked at were.. bad.  
You just *don't* need 1500 lines for a BBCode parser. You *don't*.  
And neither do you need regexp. That's bloat, and probably insecure.

So here we are. A couple loops, one stack and some string utils.

### Usage

Baybay is an [AMD](http://en.wikipedia.org/wiki/Asynchronous_module_definition) module and does not depend on anything.  
Baybay does its best to be idiot-proof, and will never generate invalid HTML.

    var bb = require( "baybay" );
    var str = "[b][[i]dumb []t[b]e[/b]xt[x]";
    console.log( bb.parse( str ) );

This example would give you `<b>[<i>dumb []t<b>e</b>xt[x]</i></b>`

### License

Baybay is licensed under the MIT license.  
For full license text, see the LICENSE file.
