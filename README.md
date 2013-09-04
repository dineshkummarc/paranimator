paranimator v0.1.1
=====

**parallax animation** JavaScript library

Paranimator provide easy procedures for parallax animation.
future, I'll implement HTML level interface for this module(DataAttribute).

Demo Page
-----
* http://www.norikiru.com/info/stories/paranimator/        (paginate mode)
* http://www.norikiru.com/info/stories/paranimator/#nounit (not paginate mode)
* http://www.norikiru.com/paranimator/demo/index.html      (for smartphone compatibility)

Key Futures
-----
* Animate with mouse scrolling.
* Pagination (unit mode)
* on keyframe beginning animation.
* layerd background scrolling.
* background auto scrolling.

Dependencies
-----
* jQuery
* mousewheel.js
* Hammer.js
* jQuery Color (optional)

Browser compatibility (tested)
-----
* Internet Explorer >=8
* Google Chrome
* Apple Safari
* Mozilla Firefox

Syntax
-----
HTML
```html
<div class="title" >WHAT IS "NORIKIRU"?</div>
```

JavaScript
```js
// Set Target Element
$.AswParanimator.init( "body" );

// Define Animation
var story = [{
           name  : "1-msg",  // definition name what you prefered
           block : 'div#page1 div.title', // target dom, (html string ok)
           s     : 0, // start key frame
           e     : 4, // end key frame
           css   : { zIndex:2000 }, // basement style definition 
           start : { top : 240, left:45 , rotate : 0  }, // style of object starting
           end   : { top : 160, left:120, rotate : 2 },  // style of object ending
           fadeOut : 330, // fadeout speed
         }];

// Start Animation
$.AswParanimator.set({
    options : { speed : 50 },
    story   : story
  });
```

