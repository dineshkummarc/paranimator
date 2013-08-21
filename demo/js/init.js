$(document).ready(function(){
  
  var ua = navigator.userAgent;
  
  $("div.background").css({
    width : "100%",
    height : ua.search(/Android/) != -1 ? $(document).height() : $("body").height(),
    overflow : "hidden"
  });
  
  $(window).scrollTop(1);
  
  var bg = [
            { s:0 , color  : "#F7BBFC" },
            { s:1 , bg     : ["img/bg4.png","img/shine1.png"], auto:[false,true], infinite:[false,true], speed:[0,3] },
            { s:2 , color  : "#A0E8B7" },
            { s:3 , bg     : ["img/bg4.png","img/shine1.png","img/shine2.png"], auto:[false,false,false], infinite:[false,true,true], speed:[0,18,-0.5] },
            ];
  $.AswParanimator.setBG( bg );
  
  $.AswParanimator.init( "body" );
  
  var story = [];
  
  story = story.concat([
    {
       name  : "1-msg",
       block : 'div#page1 div.msg1',
       s     : 0,
       e     : 1,
       css   : { zIndex:2000 },
       start : { top : 240, left:45 },
       end   : { top : 160, left:45 },
       fadeIn : 400,
       fadeOut : 400
     },{
        name  : "2-msg",
        block : 'div#page2 div.msg1',
        s     : 1,
        e     : 2,
        css   : { zIndex:2000 },
        start : { top : 240, left:45 },
        end   : { top : 320, left:45 },
        fadeIn : 400,
        fadeOut : 400
     },{
       name  : "3-msg",
       block : 'div#page3 div.msg1',
       s     : 2,
       e     : 3,
       css   : { zIndex:2000 },
       start : { top : 240, left:45 , rotate : 0  },
       end   : { top : 160, left:45 , rotate : 720 },
       ae    : 2.4,
       fadeIn : 400,
       fadeOut : 400
     },{
       name  : "4-msg",
       block : 'div#page4 div.msg1',
       s     : 3,
       e     : 4,
       css   : { zIndex:2000 },
       start : { top : 240, left:45 },
       end   : { top : 160, left:45 },
       fadeIn : 400,
       fadeOut : 400
      }
  ]);
  
  var options;
  options = { speed : 50 };
                        
  $.AswParanimator.set({
    options : options,
    story   : story
  });
  
});
