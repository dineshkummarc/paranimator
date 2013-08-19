paranimator v0.1.0 beta
=====

**parallax animation** JavaScript library

Now programmer friendly(so easy). JavaScript skills needed(so easy).
but in the future, I will create Designer friendly wrapper module.
and make compativility for smart devices.

Demo Page
-----
* http://www.norikiru.com/info/stories/paranimator/

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
           name  : "1-msg",
           block : 'div#page1 div.title',
           s     : 0,
           e     : 4,
           css   : { zIndex:2000 },
           start : { top : 240, left:45 , rotate : 0  },
           end   : { top : 160, left:120, rotate : 2 },
           fadeOut : 0.9,
         }];

// Start Animation
$.AswParanimator.set({
    options : { speed : 50 },
    story   : story
  });
```

