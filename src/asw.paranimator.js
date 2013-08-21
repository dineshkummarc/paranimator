/*! Paranimator.js - v0.1.0 - 2013-07-18
 * https://github.com/YosukeZusa/paranimator
 *
 * Copyright (c) 2013 Yosuke Zusa;
 * Licensed under the MIT license */

(function($){
    
    /**
     * モジュール内で使用するプロパティ
     */
    var props = {
            name : "AswParanimator",
            version : "0.1"
        };

    /**
     * 変更しない : not modify section
     * ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
     */
    // 拡張用の定型メソッド(変更不可)
    eval( "var define_your_method_here = function( fnc ){ $." + props.name +" = {}; $.extend( $."+props.name+", fnc ); };" );
    /**
     * ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
     * 変更しない : not modify section
     */
    
    // 内部クラスの定義
    // function Example() はこの初期化スコープでしか使えない(他のプロダクトと競合しない、名前が自由につけられる)
    eval( "function "+ props.name+"() { return this; };" );
    
    // 内部クラス変数、メソッドの定義
    var innerProps = {
        target : "body",
        stopper : false,
        pos : 0,
        p   : 0, // progress 0 to 1
        pw  : 0.01,
        defaults : {
            length : 6500,
            speed  : 100,
            unit   : undefined,
            duration : 3000,
            frequency : 4,
            umargin : 0
        },
        maxframe : 15 / 100,
        frame : {
          prev : undefined,
          curr : 0,
          next : 0,
          first: 0,
          last : 0,
        },
        definstanceS : {},
        definstanceE : {},
        defBG : { curr:0 },
        defBGSeq : {},
        keyframes : [],
        prevframes : [],
        currElems : [],
        noframe   : false, // true の場合はこれ以上アニメーションしない
        o : {},
        erase : function(){
          x.target = "body";
          x.pos = 0;
          x.p = 0;
          frame = { prev: undefined, curr:0, next:0, first:0, last:0 };
          x.definstanceS = {};
          x.definstanceE = {};
          keyframes = [];
          prevframes = [];
          
          for( var i in x.currElems ){
            if( typeof x.currElems[i] == "function" )continue;
            x.currElems[i].remove();
          }
          currElems = [];
          o = {};
        },
        setCurr: function( delta ){
          x.p -= delta * x.o.speed / x.o.length;
          x.p = x.p < 0 ? 0 : x.p;
          x.p = x.p > x.maxframe ? x.maxframe : x.p;
          if( x.p == 0 ){
            if( x.noframe == false ){
              x.noframe = true;
              x.prev(0);
              x.finish(0);
            }
            x.noframe = true;
          } else if ( x.p == x.maxframe ){
            x.noframe = true;
          } else {
            x.noframe = false;
          }
        },
        enabler : function(){
          var p = x.p * 100;
          
          if( p > x.frame.next ){
            x.next( p );
          } else if( p < x.frame.curr ){
            x.prev( p );
          }
        },
        next : function( p ){
          
          if( x.frame.prev != undefined ){
            x.prevframes.push( x.frame.prev );
          }
          x.frame.prev = x.frame.curr;
          x.frame.curr = x.frame.next;
          var curr = x.frame.curr;
          x.frame.next = x.keyframes.shift();
          x.instantinate( x.frame.curr, "next" );
          if( p > x.frame.next ){
            x.next( p );
          }
        },
        colorFade : function mix(color1, color2) 
        {
            var r = Math.round((color1[0] + color2[0])/2);
            var g = Math.round((color1[1] + color2[1])/2);
            var b = Math.round((color1[2] + color2[2])/2);
        
            return [r, g, b];
        },
        prev : function( p ){
          
          if( x.frame.next != undefined ){
            x.keyframes.unshift( x.frame.next );
          }
          x.frame.next = x.frame.curr;
          x.frame.curr = x.frame.prev;
          var curr = x.frame.curr;
          x.frame.prev = x.prevframes.pop();
          x.instantinate( x.frame.next, "prev" );
          if( p < x.frame.curr ){
            x.prev( p );
          }
        },
        instantinate : function( k, mode ){
          if( x.definstanceS[k] == undefined ){
            x.definstanceS[k] = [];
          }
          if( x.definstanceE[k] == undefined ){
            x.definstanceE[k] = [];
          }
          var initElem = function( k, $elem, $def, direction ){
            
            $elem.css( $.extend( { position : "absolute", "zIndex" : 1000 }, direction=="next" ? $def.start: $.extend({}, $def.start, $def.end), $def.css ) );
            $elem.hide();
            $elem.nounit = $def.nounit;
            if( x.currElems[$def.name] == undefined ){
              x.currElems[$def.name]= $elem ;
              $(x.target).append( $elem );
            }
            if( typeof $def.anim == "function" ){
              var guard = true;
              var fadeOut = false;
              setTimeout( function(){guard=false}, x.o.duration / 2 );
              $elem.fnAswParanimator = function( p, anim ){
                var progress =  ( p - $def.s ) / ( $def.e - $def.s );
                if( fadeOut == false && $def.fadeOut != undefined && $def.fadeOut < progress){
                  fadeOut = true;
                  $elem.fadeOut(500);
                }
                if( guard ) return;
                if( p >= $def.e || p <= $def.s ){
                  $elem.remove();
                  delete x.currElems[$def.name];
                }
              };
              setTimeout( function(){
                $elem.show();
                $def.anim( $elem, $def );
              }, $def.ad || 0 );
              return;
            }
            
            var inOsAnim = false;
            if( x.o.unit != undefined && typeof $def.osanim == "function" && direction=="next" ){
              inOsAnim = true;
              setTimeout( function(){
                $def.osanim( $elem, $def, function(){ inOsAnim=false; } );
              },0);
            } else if( x.o.unit != undefined && typeof $def.osanim_prev == "function" && direction=="prev" ){
                inOsAnim = true;
                setTimeout( function(){
                  $def.osanim_prev( $elem, $def, function(){ inOsAnim=false; } );
                },0);
            } else {
              if( $def.fadeIn > 1 ){
                $elem.fadeIn( $def.fadeIn );
              }else {
                $elem.show();
              }
            }
            
            $elem.fnAswParanimator = function( p, anim, direction ){
              if( inOsAnim ) return;
              anim = false;
              var props = {};
              var progress =  ( p - $def.s ) / ( $def.e - $def.s );
              var _progress = Math.min( ( p - $def.s ) / ( ( $def.ae || $def.e ) - $def.s ), 1 );
              for(var key in $def.end ){
                if( typeof $def.end[key] !== "function" ){
                  if( typeof $def.end[key] == "string" && $def.end[key].lastIndexOf("#",0) === 0 ){
                    props[key] = $.Color($def.start[key]).transition( $.Color($def.end[key]), _progress ).toHexString();
                  } else {
                    props[key] = $def.start[key] + ( ( $def.end[key] - $def.start[key] ) * _progress );
                  }
                }
              }
              if( $def.fadeIn != undefined && $def.fadeIn <= 1 && $def.fadeIn > progress ){
                props.opacity = ( 1 - ( $def.fadeIn - progress ) * 12 );
              } else if( $def.fadeOut != undefined && $def.fadeOut < 1 && $def.fadeOut < progress){
                props.opacity = ( 1 - ( progress - $def.fadeOut ) * 12 );
              } else {
//                props.opacity = props.opacity || 1;
              }
              var fnDelete = function(){
                if( $def.fadeOut > 1 ){
                  if( $elem.fadeOutFlg == true ) return;
                  $elem.fadeOutFlg = true;
                  $elem.stop(true, true).fadeOut($def.fadeOut, function(){
                    $elem.fadeOutFlg = false;
                    if( x.p*100 >= $def.e || x.p*100 <= $def.s ){
                      $elem.remove();
                      delete x.currElems[$def.name];
                    } else {
                      $elem.show();
                    }
                  });
                } else {
                  $elem.remove();
                  delete x.currElems[$def.name];
                }
              };
              if( false ){
                $elem.animate( props, 400 , function() {
                  if( p > 0 && ( p >= $def.e || p <= $def.s ) ){
                    $elem.remove();
                    delete x.currElems[$def.name];
                  }
                });
              } else {
                if( x.o.unit != undefined && $def.nounit != true ){
                  if( direction == "next" && p > $def.e-0.5 ){
                    fnDelete();
                  } else if( direction == "prev" && p < $def.s ){
                    fnDelete();
                  } else {
                    $elem.css(props);
                  }
                } else if( p > 0 && ( p >= $def.e || p <= $def.s ) ){
                  fnDelete();
                } else {
                  $elem.css(props);
                }
              }
            };
          };
          if( mode == "next" ){
            for( var i in x.definstanceS[k] ){
              if( typeof x.definstanceS[k][i] == "function" ){
                continue;
              }
              initElem( k, $(x.definstanceS[k][i].block ), x.definstanceS[k][i], "next" );
            }
          } else if ( mode == "prev" ){
            for( var i in x.definstanceE[k] ){
              if( typeof x.definstanceE[k][i] == "function" ){
                continue;
              }
              initElem( k, $(x.definstanceE[k][i].block ), x.definstanceE[k][i], "prev" );
            }
          }
        },
        finish  : function( p ){
          for( var i in x.currElems ){
            if( typeof x.currElems[i] == "function" ){
              continue;
            }
            x.currElems[i].fnAswParanimator( p, true )
          }
        },
        animNoUnit : function( p, direction ){
          x.animAll(p,true,direction);
        },
        animUnit : function( p, direction ){
          x.animAll(p,false,direction);
        },
        animAll : function( p, nounit, direction ){
          for( var i in x.currElems ){
            if( typeof x.currElems[i] == "function" ){
              continue;
            }
            if( typeof x.currElems[i].fnAswParanimator == "function" ){
              if( nounit == undefined ){
                x.currElems[i].fnAswParanimator( p, false, direction );
                continue;
              }
              if( ( nounit == true && x.currElems[i].nounit == true ) ){
                x.currElems[i].fnAswParanimator( p, false, direction );
              }
              if( ( nounit == false && x.currElems[i].nounit == undefined ) ){
                x.currElems[i].fnAswParanimator( p, false, direction );
              }
            }
          }
        },
        parse : function( s ){
          x.o = $.extend( {}, x.defaults );
          $.extend( x.o, s.options );
          
          for ( var i in s.story ){
            
            if( s.story[i] == undefined ) continue;
            
            if( typeof s.story[i].anim == "function" ){
              s.story[i].nounit = true; // アニメーション指定の場合は、nounitにする
            }
            
            if( s.story[i].block!=undefined && s.story[i].block.lastIndexOf("<",0) !== 0 ){
              var p = $(s.story[i].block);
              p.hide();
              s.story[i].block = p[0].outerHTML;
              p.remove();
            }
            
            var _s = Math.floor( s.story[i].s );
            var _e = Math.floor( s.story[i].e );
            x.keyframes.push( _s );
            x.keyframes.push( _e );
            x.definstanceS[_s] = x.definstanceS[_s] || [];
            x.definstanceS[_s].push( s.story[i] );
            x.definstanceE[_e] = x.definstanceE[_e] || [];
            x.definstanceE[_e].push( s.story[i] );
          }
          x.keyframes = x.keyframes.filter(function(elem, pos) {
              return x.keyframes.indexOf(elem) == pos;
          });
          x.keyframes.sort(function(a, b) { return (parseInt(a) > parseInt(b)) ? 1 : -1; });
          x.frame.last = x.keyframes[ x.keyframes.length-1 ] ;
          x.keyframes.shift(); // 0削除
          x.frame.next = x.keyframes.shift();
        },
        parseBG : function( b ){
          for( var i in b ){
            x.defBG[b[i].s] = b[i];
            x.defBGSeq[b[i].s] = i;
            (function(def){
              
              if( def.img == undefined && def.color == undefined && def.bg == undefined ){
                return;
              }
              var $scr = $('<div class="screen" id="screen'+i+'"></div>');
              var $bg, $box;
              $box= $('<div class="box"></div>');
              $box.append('<div style="height:'+((def.length||window.screen.height)+'px')+'"></div>');
              $box.css({
                height : window.screen.height+'px',
                position : "relative",
                overflow : "hidden"
              });
              if( def.img != undefined ){
                $bg = $('<img src="'+def.img+'"></img>');
                $bg.css({
                  height   : ( def.length || window.screen.height )+'px',
                  position : "absolute",
                  top      : 0,
                  left     : ((1920*window.screen.height/1200) - $("body").width())/-2 
                });
              }
             
              if( def.bg != undefined ){
                $bg = $('<div>');
                for( var bgi in def.bg ){
                  if( typeof def.bg[bgi] != "string" ) continue;
                  var $bgs = $('<div></div>');
                  (function(i, bgi, $_bgs){
                    var _h = $(window).height();
                    var bgposition = 0;
                    $_bgs.css({
                      "background-image" : 'url('+def.bg[bgi]+')',
                      width  : window.screen.width+'px',
                      height : ( def.length || window.screen.height )+'px',
                      position : "absolute",
                      top    : 0,
                    });
                    $bg.append( $bgs );
                    if( def.auto[bgi] == true ){
                      setInterval(function(){
                        if( i != x.defBG.curr ){
                          return;
                        }
                        $_bgs.css({
                          "background-position" :  "0px "+ (bgposition+=(def.speed[bgi]*-1))+"px"
                        });
                      }, 60 );
                    } else {
                      $(document).bind('paranimator.bgscroll', function(event, d){
                        var delta = d.delta;
//                      });
//                      $box.mousewheel(function(event, delta){
                        if( def.infinite[bgi] == false && bgposition >= 0 && delta > 0 ){
                          bgposition = 0;
                          delta = 0;
                        }
                        if( def.infinite[bgi] == false && bgposition <= def.length*-1+_h && delta < 0 ){
                          bgposition = def.length*-1 + _h;
                          delta = 0;
                        }
                        $_bgs.css({
                          "background-position" :  "0px "+ (bgposition+=(def.speed[bgi]*delta))+"px"
                        });
                      });
                    }
                  }(i, bgi, $bgs));
                }
              }
              
              if( def.color != undefined ){
                $bg = $('<div>');
                $bg.css({
                  width  : window.screen.width+'px',
                  height : ( def.length || window.screen.height )+'px',
                  backgroundColor:def.color,
                  position : "absolute",
                  top    : 0
                });
              }
              $box.append( $bg );
              $scr.append( $box );
              $scr.css({
                width  : $("body").width(),
                height : $("body").height(),
                position : "relative",
                overflow : "hidden"
              });
              $("div.background").append( $scr );
            }(b[i]));
          }
        },
        start : function(){
          x.instantinate( 0, "next" );
        },
        fnAnimate   : function( p, delta, xp ){},
        fnAnimateBG : function( p, delta, xp ){},
        animate : function( delta ){
          var xp = x.p;
          if( x.stopper ){
            x.animNoUnit(x.p*100);
            return;
          }
          x.setCurr( delta );
          
          if( x.noframe == true){
            return;
          }
          
          x.enabler();
          x.fnAnimate(x.p*100, delta, xp);
          x.fnAnimateBG(x.p*100, delta, xp);
        }
    };
    
    // jQueryに独自の関数を追加する
    define_your_method_here({
      init : function( selector ){
        x.target = selector;
        $(x.target+" div.paranimator div").hide();
        $(x.target).css({
          "overflow" : "hidden"
        });
        var ua = navigator.userAgent;
        if( ua.match(/Mac|PPC/) ){
          x.pw = 0.025
        }
        
        if(ua.search(/iPhone/) != -1 || ua.search(/iPad/) != -1 || ua.search(/iPod/) != -1 || ua.search(/Android/) != -1){
          var prevDelta = 0;
          var prevDeltaT = 0;
          var minDeltaT  = 1000;
          var speed = 8.8;
          $(x.target).height( $(document).height() );
          $(x.target).hammer().on('drag', function( e ) {
//          Hammer(window).on('drag', function( e, data ) {
              event.preventDefault();                     // ページが動くのを止める
              
              if( minDeltaT < 100 && minDeltaT > 45 ){
//                $("div#_main").append( "o" );
                speed = 3.7;
              } else {
                speed = 8.8;
              }
              
              $(document).trigger('paranimator.bgscroll',{ delta:parseInt( e.gesture.deltaY - prevDelta ) / speed } );
              x.animate( parseInt( e.gesture.deltaY - prevDelta )*x.pw / speed );
//              $("div#_main").append( e.gesture.deltaTime + "<br />" );
//              $("div#_main").append( minDeltaT + "<br />" );
              prevDelta = e.gesture.deltaY;
              if( e.gesture.deltaTime - prevDeltaT < minDeltaT ){
                minDeltaT = e.gesture.deltaTime - prevDeltaT;
              }
              prevDeltaT = e.gesture.deltaTime;
          });
          $(x.target).hammer({}).on('dragend', function( e ){
            prevDelta = 0;
            prevDeltaT = 0;
            minDeltaT = 1000;
          });
          
        } else {
          jQuery( selector ).mousewheel(function(event, delta) {
            x.wheeldelta = Math.abs( delta );
            if (navigator.appVersion.indexOf("Win")!=-1){
              delta *= 10;
            }
            $(document).trigger('paranimator.bgscroll',{ delta:delta } );
            x.animate( delta*x.pw );
            return false;
          });
        }
        
      },
      setBG : function( arBG ){
        x.parseBG( arBG );
      },
      set  : function( story ){
        x.parse( story );
        
        if( x.o.unit != undefined ){

          x.fnAnimateBG = ( function( p, delta, xp ){
            
            if( typeof x.defBG.currDef == "object" ){
              if( x.defBG.currDef.bg != undefined ){
                
              } else {
                $("div#screen"+x.defBG.curr+ " div.box" ).scrollTop( ( p - x.defBG.currDef.s ) * x.defBG.currDef.length );
              }
            }
            
            if( delta < 0 ){
              if( ( (xp*100) % x.o.unit - p % x.o.unit ) > 0 ){
                if( ( typeof x.defBG[Math.floor(p)] ) == "object" ){
                  (function(p){
                    var timer;
                    var s=( x.o.duration / (x.o.frequency*4) );
                    var c=( x.o.duration / (x.o.frequency*4) );
                    x.defBG.currDef = x.defBG[p];
                    $("div.background").animate({
                      scrollTop : (++x.defBG.curr)*$("div#screen"+x.defBG.curr).height()
                    }, x.o.duration/5 );
                  }(Math.floor(p)));
                }
              }
            } else {
              if( ( p % x.o.unit - (xp*100) % x.o.unit ) > 0 ){
                if( ( typeof x.defBG[Math.floor(p+x.o.unit)] ) == "object" ){
                  (function(p){
                    var timer;
                    var s=( x.o.duration / (x.o.frequency*4) );
                    var c=( x.o.duration / (x.o.frequency*4) );
                    $("div.background").animate({
                      scrollTop : (--x.defBG.curr)*$("div#screen"+x.defBG.curr).height()
                    }, x.o.duration/5 );
                    x.defBG.currDef = x.defBG[p];
                  }(Math.floor(p)));
                }
              }
            }
          });
          x.fnAnimate = ( function( p, delta, xp ){
            if( delta < 0 ){
              if( ( (xp*100) % x.o.unit - p % x.o.unit ) > 0 ){
                x.stopper = true;
                x.animNoUnit(p);
                (function(p){
                  var timer;
                  var s=( x.o.duration / (x.o.frequency*4) );
                  var c=( x.o.duration / (x.o.frequency*4) );
                  timer = setInterval( function(){
                    c--;
                    x.animUnit( ( p - x.o.unit ) + ( ( x.o.unit - x.o.umargin ) / s * ( s-c ) ), "next" );
                    if( c < 1 ){
                      x.animUnit( p+0.1, "next" );
                      clearInterval( timer );
                      setTimeout(function(){
                        x.stopper = false;
                      }, 100 );
                    }
                  }, x.o.frequency );
                }(Math.floor(p)));
              } else {
                x.animNoUnit( p );
              }
            } else {
              if( ( p % x.o.unit - (xp*100) % x.o.unit ) > 0 ){
                x.stopper = true;
                x.animNoUnit(Math.ceil(p)-0.000000001);
                (function(p){
                  var timer;
                  var s=( x.o.duration / (x.o.frequency*4) );
                  var c=( x.o.duration / (x.o.frequency*4) );
                  timer = setInterval( function(){
                    c--;
                    var _p = Math.max( ( p+x.o.unit ) - ( ( x.o.unit ) / s * ( s-c ) ), 0 );
                    if( _p > 0 ){
                      x.animUnit( _p, "prev" );
                    }
                    if( c < 1 ){
                      clearInterval( timer );
                      setTimeout(function(){
                        x.stopper = false;
                      }, 100 );
                    }
                  }, x.o.frequency );
                }(Math.ceil(p)-x.o.unit));
              } else {
                x.animNoUnit( p );
              }
            }
          });
        } else { // nounit
          x.fnAnimateBG = ( function( p, delta, xp ){
            if( p > 0.5 && typeof x.defBG[Math.round(p)] == "object" ){
              var f = p%1;
              if( f > 1-0.2 ){ // 進む　
                $("div.background").scrollTop( $("div#screen"+x.defBG.curr).height() * ( x.defBGSeq[Math.round(p)] - (( 1 - f ) * 5) ) );
              } else if( f < 0.5 ){
                $("div.background").scrollTop( $("div#screen"+x.defBG.curr).height() * ( x.defBGSeq[Math.round(p)] ) );
                x.defBG.curr = x.defBGSeq[Math.round(p)];
              } else if( f > 0.5 ){
                $("div.background").scrollTop( $("div#screen"+x.defBG.curr).height() * ( x.defBGSeq[Math.round(p)]-1 ) );
                x.defBG.curr = x.defBGSeq[Math.round(p)]-1;
              }
            }
          });
          x.fnAnimate = ( function( p, delta, xp ){
            x.animAll( p );
          });
        }
        
        x.start();
      },
      erase : function(){
        x.erase();
      }
    });
    
    eval( props.name + ".prototype = innerProps;" );
    eval( "var x = new " + props.name + "();" );
})(jQuery);

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun /*, thisp*/) {
    'use strict';

    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this),
        len = t.length >>> 0,
        res, thisp, i, val;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    res = [];
    thisp = arguments[1];
    for (i = 0; i < len; i++) {
      if (i in t) {
        val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}