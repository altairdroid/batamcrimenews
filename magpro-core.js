/*! Theia Sticky Sidebar | v1.7.0 - https://github.com/WeCodePixels/theia-sticky-sidebar */
(function($){$.fn.theiaStickySidebar=function(options){var defaults={'containerSelector':'','additionalMarginTop':0,'additionalMarginBottom':0,'updateSidebarHeight':true,'minWidth':0,'disableOnResponsiveLayouts':true,'sidebarBehavior':'modern','defaultPosition':'relative','namespace':'TSS'};options=$.extend(defaults,options);options.additionalMarginTop=parseInt(options.additionalMarginTop)||0;options.additionalMarginBottom=parseInt(options.additionalMarginBottom)||0;tryInitOrHookIntoEvents(options,this);function tryInitOrHookIntoEvents(options,$that){var success=tryInit(options,$that);if(!success){console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');$(document).on('scroll.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that));$(window).on('resize.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that))}}function tryInit(options,$that){if(options.initialized===true){return true}if($('body').width()<options.minWidth){return false}init(options,$that);return true}function init(options,$that){options.initialized=true;var existingStylesheet=$('#theia-sticky-sidebar-stylesheet-'+options.namespace);if(existingStylesheet.length===0){$('head').append($('<style id="theia-sticky-sidebar-stylesheet-'+options.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'))}$that.each(function(){var o={};o.sidebar=$(this);o.options=options||{};o.container=$(o.options.containerSelector);if(o.container.length==0){o.container=o.sidebar.parent()}o.sidebar.parents().css('-webkit-transform','none');o.sidebar.css({'position':o.options.defaultPosition,'overflow':'visible','-webkit-box-sizing':'border-box','-moz-box-sizing':'border-box','box-sizing':'border-box'});o.stickySidebar=o.sidebar.find('.theiaStickySidebar');if(o.stickySidebar.length==0){var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;o.sidebar.find('script').filter(function(index,script){return script.type.length===0||script.type.match(javaScriptMIMETypes)}).remove();o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());o.sidebar.append(o.stickySidebar)}o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));o.paddingTop=parseInt(o.sidebar.css('padding-top'));o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));var collapsedTopHeight=o.stickySidebar.offset().top;var collapsedBottomHeight=o.stickySidebar.outerHeight();o.stickySidebar.css('padding-top',1);o.stickySidebar.css('padding-bottom',1);collapsedTopHeight-=o.stickySidebar.offset().top;collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0}else{o.stickySidebarPaddingTop=1}if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0}else{o.stickySidebarPaddingBottom=1}o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();o.onScroll=function(o){if(!o.stickySidebar.is(":visible")){return}if($('body').width()<o.options.minWidth){resetSidebar();return}if(o.options.disableOnResponsiveLayouts){var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');if(sidebarWidth+50>o.container.width()){resetSidebar();return}}var scrollTop=$(document).scrollTop();var position='static';if(scrollTop>=o.sidebar.offset().top+(o.paddingTop-o.options.additionalMarginTop)){var offsetTop=o.paddingTop+options.additionalMarginTop;var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;var containerTop=o.sidebar.offset().top;var containerBottom=o.sidebar.offset().top+getClearedHeight(o.container);var windowOffsetTop=0+options.additionalMarginTop;var windowOffsetBottom;var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();if(sidebarSmallerThanWindow){windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight()}else{windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom}var staticLimitTop=containerTop-scrollTop+o.paddingTop;var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;var top=o.stickySidebar.offset().top-scrollTop;var scrollTopDiff=o.previousScrollTop-scrollTop;if(o.stickySidebar.css('position')=='fixed'){if(o.options.sidebarBehavior=='modern'){top+=scrollTopDiff}}if(o.options.sidebarBehavior=='stick-to-top'){top=options.additionalMarginTop}if(o.options.sidebarBehavior=='stick-to-bottom'){top=windowOffsetBottom-o.stickySidebar.outerHeight()}if(scrollTopDiff>0){top=Math.min(top,windowOffsetTop)}else{top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight())}top=Math.max(top,staticLimitTop);top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed'}else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed'}else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static'}else{position='absolute'}}if(position=='fixed'){var scrollLeft=$(document).scrollLeft();o.stickySidebar.css({'position':'fixed','width':getWidthForObject(o.stickySidebar)+'px','transform':'translateY('+top+'px)','left':(o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))-scrollLeft)+'px','top':'0px'})}else if(position=='absolute'){var css={};if(o.stickySidebar.css('position')!='absolute'){css.position='absolute';css.transform='translateY('+(scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom)+'px)';css.top='0px'}css.width=getWidthForObject(o.stickySidebar)+'px';css.left='';o.stickySidebar.css(css)}else if(position=='static'){resetSidebar()}if(position!='static'){if(o.options.updateSidebarHeight==true){o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom})}}o.previousScrollTop=scrollTop};o.onScroll(o);$(document).on('scroll.'+o.options.namespace,function(o){return function(){o.onScroll(o)}}(o));$(window).on('resize.'+o.options.namespace,function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o)}}(o));if(typeof ResizeSensor!=='undefined'){new ResizeSensor(o.stickySidebar[0],function(o){return function(){o.onScroll(o)}}(o))}function resetSidebar(){o.fixedScrollTop=0;o.sidebar.css({'min-height':'1px'});o.stickySidebar.css({'position':'static','width':'','transform':'none'})}function getClearedHeight(e){var height=e.height();e.children().each(function(){height=Math.max(height,$(this).height())});return height}})}function getWidthForObject(object){var width;try{width=object[0].getBoundingClientRect().width}catch(err){}if(typeof width==="undefined"){width=object.width()}return width}return this}})(jQuery);

/*! MenuIfy by Templateify | v1.0.0 - https://www.templateify.com */
!function(a){a.fn.menuify=function(){return this.each(function(){var $t=a(this),b=$t.find('.LinkList ul > li').children('a'),c=b.length;for(var i=0;i<c;i++){var d=b.eq(i),h=d.text();if(h.charAt(0)!=='_'){var e=b.eq(i+1),j=e.text();if(j.charAt(0)==='_'){var m=d.parent();m.append('<ul class="sub-menu m-sub"/>');}}if(h.charAt(0)==='_'){d.text(h.replace('_',''));d.parent().appendTo(m.children('.sub-menu'));}}for(var i=0;i<c;i++){var f=b.eq(i),k=f.text();if(k.charAt(0)!=='_'){var g=b.eq(i+1),l=g.text();if(l.charAt(0)==='_'){var n=f.parent();n.append('<ul class="sub-menu2 m-sub"/>');}}if(k.charAt(0)==='_'){f.text(k.replace('_',''));f.parent().appendTo(n.children('.sub-menu2'));}}$t.find('.LinkList ul li ul').parent('li').addClass('has-sub');});}}(jQuery);

/*! Tabify by Templateify | v1.0.0 - https://www.templateify.com */
!function(a){a.fn.tabify=function(b){b=jQuery.extend({onHover:false,animated:true,transition:'fadeInUp'},b);return this.each(function(){var e=a(this),c=e.children('[tab-ify]'),d=0,n='tab-animated',k='tab-active';if(b.onHover==true){var event='mouseenter'}else{var event='click'}e.prepend('<ul class="select-tab"></ul>');c.each(function(){if(b.animated==true){a(this).addClass(n)}e.find('.select-tab').append('<li><a href="javascript:;">'+a(this).attr('tab-ify')+'</a></li>')}).eq(d).addClass(k).addClass('tab-'+b.transition);e.find('.select-tab a').on(event,function(){var f=a(this).parent().index();a(this).closest('.select-tab').find('.active').removeClass('active');a(this).parent().addClass('active');c.removeClass(k).removeClass('tab-'+b.transition).eq(f).addClass(k).addClass('tab-'+b.transition);return false}).eq(d).parent().addClass('active')})}}(jQuery);

/*! ResizeIfy - LazyIfy on Scroll by Templateify | v1.2.0 - https://www.templateify.com */
!function(a){a.fn.lazyify=function(){return this.each(function(){var t=a(this),dImg=t.attr('data-image'),iWid=Math.round(t.width()),iHei=Math.round(t.height()),iSiz='w'+iWid+'-h'+iHei+'-p-k-no-nu-rw',img='';if(dImg.match('/s72-c')){img=dImg.replace('/s72-c','/'+iSiz);}else if(dImg.match('/w72-h')){img=dImg.replace('/w72-h72-p-k-no-nu','/'+iSiz);}else if(dImg.match('=w72-h')){img=dImg.replace('=w72-h72-p-k-no-nu','='+iSiz);}else{img=dImg;}
a(window).on('load resize scroll',lazyOnScroll);function lazyOnScroll(){var wHeight=a(window).height(),scrTop=a(window).scrollTop(),offTop=t.offset().top;if(scrTop+wHeight>offTop){var n=new Image();n.onload=function(){t.attr('style','background-image:url('+this.src+')').addClass('lazy-ify');},n.src=img;}}
lazyOnScroll();});}}(jQuery);

/*! jQuery replaceText by "Cowboy" Ben Alman | v1.1.0 - http://benalman.com/projects/jquery-replacetext-plugin/ */
(function($){$.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})}})(jQuery);
//]]>
</script>
<!-- Templateify Scripts -->
<script type='text/javascript'>
//<![CDATA[
var _$_obify2 = ["\x6D\x65\x6E\x75\x69\x66\x79", "\x23\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x61\x69\x6E\x2D\x6D\x65\x6E\x75", "\x74\x72\x69\x6D", "\x74\x6F\x4C\x6F\x77\x65\x72\x43\x61\x73\x65", "\x68\x72\x65\x66", "\x61\x74\x74\x72", "\x68\x6F\x6D\x65\x2D\x69\x63\x6F\x6E", "", "\x74\x65\x78\x74", "\x2F", "\x68\x6F\x6D\x65\x70\x61\x67\x65\x20\x68\x6F\x6D\x65\x2D\x69\x63\x6F\x6E", "\x61\x64\x64\x43\x6C\x61\x73\x73", "\x68\x6F\x6D\x65\x2D\x74\x65\x78\x74", "\x68\x6F\x6D\x65\x70\x61\x67\x65", "\x65\x61\x63\x68", "\x23\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x61\x69\x6E\x2D\x6D\x65\x6E\x75\x2D\x6E\x61\x76\x20\x3E\x20\x6C\x69\x20\x3E\x20\x61", "\x73\x68\x6F\x77\x2D\x6D\x65\x6E\x75", "\x23\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x61\x69\x6E\x2D\x6D\x65\x6E\x75\x20\x2E\x77\x69\x64\x67\x65\x74", "\x63\x6C\x69\x63\x6B", "\x73\x65\x61\x72\x63\x68\x2D\x61\x63\x74\x69\x76\x65", "\x74\x6F\x67\x67\x6C\x65\x43\x6C\x61\x73\x73", "\x62\x6F\x64\x79", "\x6F\x6E", "\x2E\x73\x65\x61\x72\x63\x68\x2D\x74\x6F\x67\x67\x6C\x65", "\x2E\x62\x6C\x6F\x67\x2D\x70\x6F\x73\x74\x73\x2D\x74\x69\x74\x6C\x65\x20\x61\x2E\x6D\x6F\x72\x65\x2C\x2E\x72\x65\x6C\x61\x74\x65\x64\x2D\x74\x69\x74\x6C\x65\x20\x61\x2E\x6D\x6F\x72\x65", "\x2E\x66\x6F\x6C\x6C\x6F\x77\x2D\x62\x79\x2D\x65\x6D\x61\x69\x6C\x2D\x74\x65\x78\x74", "\x2E\x77\x69\x64\x67\x65\x74", "\x66\x69\x6E\x64", "\x6C\x65\x6E\x67\x74\x68", "\x73\x74\x79\x6C\x65\x2D", "\x74\x61\x62\x69\x66\x79", "\x23\x73\x69\x64\x65\x62\x61\x72\x2D\x74\x61\x62\x73", "\x73\x70\x6C\x69\x74", "\x70\x6F\x70", "\x62\x75\x74\x74\x6F\x6E", "\x6D\x61\x74\x63\x68", "\x63\x73\x73", "\x63\x6F\x6C\x6F\x72\x65\x64\x2D\x62\x75\x74\x74\x6F\x6E", "\x2E\x70\x6F\x73\x74\x2D\x62\x6F\x64\x79\x20\x61", "\x68\x74\x6D\x6C", "\x63\x6F\x6E\x74\x61\x63\x74\x2D\x66\x6F\x72\x6D", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x63\x6F\x6E\x74\x61\x63\x74\x2D\x66\x6F\x72\x6D\x22\x2F\x3E", "\x72\x65\x70\x6C\x61\x63\x65\x57\x69\x74\x68", "\x23\x43\x6F\x6E\x74\x61\x63\x74\x46\x6F\x72\x6D\x31", "\x61\x70\x70\x65\x6E\x64", "\x2E\x63\x6F\x6E\x74\x61\x63\x74\x2D\x66\x6F\x72\x6D", "\x61\x6C\x65\x72\x74\x2D\x73\x75\x63\x63\x65\x73\x73", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x61\x6C\x65\x72\x74\x2D\x6D\x65\x73\x73\x61\x67\x65\x20\x61\x6C\x65\x72\x74\x2D\x73\x75\x63\x63\x65\x73\x73\x20\x73\x68\x6F\x72\x74\x2D\x62\x22\x3E", "\x3C\x2F\x64\x69\x76\x3E", "\x61\x6C\x65\x72\x74\x2D\x69\x6E\x66\x6F", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x61\x6C\x65\x72\x74\x2D\x6D\x65\x73\x73\x61\x67\x65\x20\x61\x6C\x65\x72\x74\x2D\x69\x6E\x66\x6F\x20\x73\x68\x6F\x72\x74\x2D\x62\x22\x3E", "\x61\x6C\x65\x72\x74\x2D\x77\x61\x72\x6E\x69\x6E\x67", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x61\x6C\x65\x72\x74\x2D\x6D\x65\x73\x73\x61\x67\x65\x20\x61\x6C\x65\x72\x74\x2D\x77\x61\x72\x6E\x69\x6E\x67\x20\x73\x68\x6F\x72\x74\x2D\x62\x22\x3E", "\x61\x6C\x65\x72\x74\x2D\x65\x72\x72\x6F\x72", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x61\x6C\x65\x72\x74\x2D\x6D\x65\x73\x73\x61\x67\x65\x20\x61\x6C\x65\x72\x74\x2D\x65\x72\x72\x6F\x72\x20\x73\x68\x6F\x72\x74\x2D\x62\x22\x3E", "\x6C\x65\x66\x74\x2D\x73\x69\x64\x65\x62\x61\x72", "\x3C\x73\x74\x79\x6C\x65\x3E\x2E\x69\x73\x2D\x73\x69\x6E\x67\x6C\x65\x20\x23\x6D\x61\x69\x6E\x2D\x77\x72\x61\x70\x70\x65\x72\x7B\x66\x6C\x6F\x61\x74\x3A\x72\x69\x67\x68\x74\x7D\x2E\x69\x73\x2D\x73\x69\x6E\x67\x6C\x65\x20\x23\x73\x69\x64\x65\x62\x61\x72\x2D\x77\x72\x61\x70\x70\x65\x72\x7B\x66\x6C\x6F\x61\x74\x3A\x6C\x65\x66\x74\x7D\x3C\x2F\x73\x74\x79\x6C\x65\x3E", "\x72\x69\x67\x68\x74\x2D\x73\x69\x64\x65\x62\x61\x72", "\x3C\x73\x74\x79\x6C\x65\x3E\x2E\x69\x73\x2D\x73\x69\x6E\x67\x6C\x65\x20\x23\x6D\x61\x69\x6E\x2D\x77\x72\x61\x70\x70\x65\x72\x7B\x66\x6C\x6F\x61\x74\x3A\x6C\x65\x66\x74\x7D\x2E\x69\x73\x2D\x73\x69\x6E\x67\x6C\x65\x20\x23\x73\x69\x64\x65\x62\x61\x72\x2D\x77\x72\x61\x70\x70\x65\x72\x7B\x66\x6C\x6F\x61\x74\x3A\x72\x69\x67\x68\x74\x7D\x3C\x2F\x73\x74\x79\x6C\x65\x3E", "\x66\x75\x6C\x6C\x2D\x77\x69\x64\x74\x68", "\x3C\x73\x74\x79\x6C\x65\x3E\x2E\x69\x73\x2D\x73\x69\x6E\x67\x6C\x65\x20\x23\x6D\x61\x69\x6E\x2D\x77\x72\x61\x70\x70\x65\x72\x7B\x77\x69\x64\x74\x68\x3A\x31\x30\x30\x25\x7D\x2E\x69\x73\x2D\x73\x69\x6E\x67\x6C\x65\x20\x23\x73\x69\x64\x65\x62\x61\x72\x2D\x77\x72\x61\x70\x70\x65\x72\x7B\x64\x69\x73\x70\x6C\x61\x79\x3A\x6E\x6F\x6E\x65\x7D\x3C\x2F\x73\x74\x79\x6C\x65\x3E", "\x63\x6F\x64\x65\x2D\x62\x6F\x78", "\x3C\x70\x72\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x63\x6F\x64\x65\x2D\x62\x6F\x78\x20\x73\x68\x6F\x72\x74\x2D\x62\x22\x3E", "\x3C\x2F\x70\x72\x65\x3E", "\x62", "\x2E\x70\x6F\x73\x74\x2D\x62\x6F\x64\x79\x20\x2E\x73\x68\x6F\x72\x74\x2D\x62", "\x2E\x70\x6F\x73\x74\x2D\x62\x6F\x64\x79\x20\x73\x74\x72\x69\x6B\x65", "\x75\x72\x6C", "\x64\x61\x74\x61", "\x77\x69\x64\x74\x68", "\x68\x65\x69\x67\x68\x74", "\x73\x63\x72\x65\x65\x6E", "\x72\x6F\x75\x6E\x64", "\x5F\x62\x6C\x61\x6E\x6B", "\x73\x63\x72\x6F\x6C\x6C\x62\x61\x72\x73\x3D\x79\x65\x73\x2C\x72\x65\x73\x69\x7A\x61\x62\x6C\x65\x3D\x79\x65\x73\x2C\x74\x6F\x6F\x6C\x62\x61\x72\x3D\x6E\x6F\x2C\x6C\x6F\x63\x61\x74\x69\x6F\x6E\x3D\x79\x65\x73\x2C\x77\x69\x64\x74\x68\x3D", "\x2C\x68\x65\x69\x67\x68\x74\x3D", "\x2C\x6C\x65\x66\x74\x3D", "\x2C\x74\x6F\x70\x3D", "\x6F\x70\x65\x6E", "\x66\x6F\x63\x75\x73", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x73\x68\x61\x72\x65\x2D\x6C\x69\x6E\x6B\x73\x20\x2E\x77\x69\x6E\x64\x6F\x77\x2D\x69\x66\x79", "\x2E\x73\x68\x6F\x77\x2D\x68\x69\x64\x20\x61", "\x73\x68\x6F\x77\x2D\x68\x69\x64\x64\x65\x6E", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x73\x68\x61\x72\x65\x2D\x6C\x69\x6E\x6B\x73", "\x3C\x6C\x69\x20\x63\x6C\x61\x73\x73\x3D\x22", "\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x22\x20\x74\x69\x74\x6C\x65\x3D\x22", "\x22\x20\x74\x61\x72\x67\x65\x74\x3D\x22\x5F\x62\x6C\x61\x6E\x6B\x22\x2F\x3E\x3C\x2F\x6C\x69\x3E", "\x2E\x61\x75\x74\x68\x6F\x72\x2D\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6F\x6E\x20\x73\x70\x61\x6E\x20\x6C\x69", "\x2E\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6F\x6E\x2D\x6C\x69\x6E\x6B\x73", "\x73\x68\x6F\x77", "\x2E\x61\x62\x6F\x75\x74\x2D\x61\x75\x74\x68\x6F\x72\x20\x2E\x61\x75\x74\x68\x6F\x72\x2D\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6F\x6E\x20\x73\x70\x61\x6E\x20\x61", "\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x72\x72\x6F\x72\x2D\x6D\x73\x67\x22\x3E\x3C\x62\x3E\x45\x72\x72\x6F\x72\x3A\x3C\x2F\x62\x3E\x20\x4E\x6F\x20\x52\x65\x73\x75\x6C\x74\x73\x20\x46\x6F\x75\x6E\x64\x3C\x2F\x73\x70\x61\x6E\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x6C\x6F\x61\x64\x65\x72\x22\x2F\x3E", "\x2F\x66\x65\x65\x64\x73\x2F\x70\x6F\x73\x74\x73\x2F\x64\x65\x66\x61\x75\x6C\x74\x3F\x61\x6C\x74\x3D\x6A\x73\x6F\x6E\x26\x6D\x61\x78\x2D\x72\x65\x73\x75\x6C\x74\x73\x3D", "\x72\x65\x63\x65\x6E\x74", "\x6C\x69\x73\x74\x31", "\x2F\x66\x65\x65\x64\x73\x2F\x63\x6F\x6D\x6D\x65\x6E\x74\x73\x2F\x64\x65\x66\x61\x75\x6C\x74\x3F\x61\x6C\x74\x3D\x6A\x73\x6F\x6E\x26\x6D\x61\x78\x2D\x72\x65\x73\x75\x6C\x74\x73\x3D", "\x2F\x66\x65\x65\x64\x73\x2F\x70\x6F\x73\x74\x73\x2F\x64\x65\x66\x61\x75\x6C\x74\x2F\x2D\x2F", "\x3F\x61\x6C\x74\x3D\x6A\x73\x6F\x6E\x26\x6D\x61\x78\x2D\x72\x65\x73\x75\x6C\x74\x73\x3D", "\x63\x6F\x6D\x6D\x65\x6E\x74\x73", "\x6C\x69\x6E\x6B", "\x72\x65\x6C", "\x61\x6C\x74\x65\x72\x6E\x61\x74\x65", "\x24\x74", "\x74\x69\x74\x6C\x65", "\x3C\x64\x69\x76\x3E", "\x73\x72\x63", "\x69\x6D\x67\x3A\x66\x69\x72\x73\x74", "\x6C\x61\x73\x74\x49\x6E\x64\x65\x78\x4F\x66", "\x73\x75\x62\x73\x74\x72\x69\x6E\x67", "\x2F\x64", "\x2F\x77\x37\x32\x2D\x68\x37\x32\x2D\x70\x2D\x6B\x2D\x6E\x6F\x2D\x6E\x75", "\x63\x6F\x6E\x74\x65\x6E\x74", "\x6D\x65\x64\x69\x61\x24\x74\x68\x75\x6D\x62\x6E\x61\x69\x6C", "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x34\x2E\x62\x70\x2E\x62\x6C\x6F\x67\x73\x70\x6F\x74\x2E\x63\x6F\x6D\x2F\x2D\x65\x41\x4C\x58\x74\x66\x2D\x4C\x6A\x74\x73\x2F\x57\x72\x51\x59\x41\x62\x7A\x63\x50\x55\x49\x2F\x41\x41\x41\x41\x41\x41\x41\x41\x42\x6A\x59\x2F\x76\x70\x74\x78\x2D\x4E\x32\x48\x34\x36\x6F\x46\x62\x69\x43\x71\x62\x53\x65\x32\x4A\x67\x56\x53\x6C\x48\x68\x79\x6C\x30\x4D\x77\x51\x43\x4B\x34\x42\x47\x41\x59\x59\x43\x77\x2F\x73\x37\x32\x2D\x63\x2F\x6E\x74\x68\x2D\x69\x66\x79\x2E\x70\x6E\x67", "\x69\x6E\x64\x65\x78\x4F\x66", "\x3C\x69\x6D\x67", "\x2F\x64\x65\x66\x61\x75\x6C\x74\x2E", "\x2F\x30\x2E", "\x72\x65\x70\x6C\x61\x63\x65", "\x6E\x61\x6D\x65", "\x61\x75\x74\x68\x6F\x72", "\x70\x6F\x73\x74\x41\x75\x74\x68\x6F\x72", "\x74\x72\x75\x65", "\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x61\x75\x74\x68\x6F\x72\x22\x3E\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x61\x75\x74\x68\x6F\x72\x22\x3E", "\x3C\x2F\x73\x70\x61\x6E\x3E\x3C\x2F\x73\x70\x61\x6E\x3E", "\x70\x75\x62\x6C\x69\x73\x68\x65\x64", "\x20", "\x2C\x20", "\x70\x6F\x73\x74\x44\x61\x74\x65", "\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x6D\x65\x22\x3E\x3C\x74\x69\x6D\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x70\x75\x62\x6C\x69\x73\x68\x65\x64\x22\x20\x64\x61\x74\x65\x74\x69\x6D\x65\x3D\x22", "\x22\x3E", "\x3C\x2F\x74\x69\x6D\x65\x3E\x3C\x2F\x73\x70\x61\x6E\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x6D\x65\x74\x61\x22\x3E", "\x66\x65\x61\x74\x75\x72\x65\x64\x31", "\x66\x65\x61\x74\x75\x72\x65\x64\x32", "\x66\x65\x61\x74\x75\x72\x65\x64\x33", "\x63\x61\x74\x65\x67\x6F\x72\x79", "\x74\x65\x72\x6D", "\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x63\x61\x74\x65\x67\x6F\x72\x79\x22\x3E", "\x3C\x2F\x73\x70\x61\x6E\x3E", "\x2F\x73\x32\x32\x30", "\x2F\x77\x35\x35\x2D\x68\x35\x35\x2D\x70\x2D\x6B\x2D\x6E\x6F\x2D\x6E\x75", "\x67\x64\x24\x69\x6D\x61\x67\x65", "\x2F\x2F\x69\x6D\x67\x31\x2E\x62\x6C\x6F\x67\x62\x6C\x6F\x67\x2E\x63\x6F\x6D\x2F\x69\x6D\x67\x2F\x62\x6C\x61\x6E\x6B\x2E\x67\x69\x66", "\x2F\x2F\x69\x6D\x67\x31\x2E\x62\x6C\x6F\x67\x62\x6C\x6F\x67\x2E\x63\x6F\x6D\x2F\x69\x6D\x67\x2F\x62\x31\x36\x2D\x72\x6F\x75\x6E\x64\x65\x64\x2E\x67\x69\x66", "\x2F\x2F\x34\x2E\x62\x70\x2E\x62\x6C\x6F\x67\x73\x70\x6F\x74\x2E\x63\x6F\x6D\x2F\x2D\x6F\x53\x6A\x50\x38\x46\x30\x39\x71\x78\x6F\x2F\x57\x79\x31\x4A\x39\x64\x70\x37\x62\x30\x49\x2F\x41\x41\x41\x41\x41\x41\x41\x41\x43\x46\x30\x2F\x67\x67\x63\x52\x66\x4C\x43\x46\x51\x39\x73\x32\x53\x53\x61\x65\x4C\x39\x42\x46\x53\x45\x32\x77\x79\x54\x59\x7A\x51\x61\x54\x79\x51\x43\x4B\x34\x42\x47\x41\x59\x59\x43\x77\x2F\x77\x35\x35\x2D\x68\x35\x35\x2D\x70\x2D\x6B\x2D\x6E\x6F\x2D\x6E\x75\x2F\x61\x76\x61\x74\x61\x72\x2E\x6A\x70\x67", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x6C\x69\x73\x74\x31\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x20\x63\x6D\x6D\x2D\x61\x76\x61\x74\x61\x72\x22\x20\x68\x72\x65\x66\x3D\x22", "\x22\x3E\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x68\x75\x6D\x62\x22\x20\x64\x61\x74\x61\x2D\x69\x6D\x61\x67\x65\x3D\x22", "\x22\x2F\x3E\x3C\x2F\x61\x3E\x3C\x68\x32\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x3C\x2F\x61\x3E\x3C\x2F\x68\x32\x3E\x3C\x70\x20\x63\x6C\x61\x73\x73\x3D\x22\x63\x6D\x6D\x2D\x73\x6E\x69\x70\x70\x65\x74\x20\x65\x78\x63\x65\x72\x70\x74\x22\x3E", "\x3C\x2F\x70\x3E\x3C\x2F\x61\x72\x74\x69\x63\x6C\x65\x3E", "\x66\x65\x61\x74\x75\x72\x65\x64", "\x2E\x69\x64\x2D", "\x2D", "\x20\x2E\x65\x6E\x74\x72\x79\x2D\x63\x61\x74\x65\x67\x6F\x72\x79\x7B\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72\x3A", "\x3B\x63\x6F\x6C\x6F\x72\x3A\x23\x66\x66\x66\x7D\x2E\x69\x64\x2D", "\x20\x2E\x6C\x6F\x61\x64\x65\x72\x3A\x61\x66\x74\x65\x72\x7B\x62\x6F\x72\x64\x65\x72\x2D\x63\x6F\x6C\x6F\x72\x3A", "\x3B\x62\x6F\x72\x64\x65\x72\x2D\x72\x69\x67\x68\x74\x2D\x63\x6F\x6C\x6F\x72\x3A\x72\x67\x62\x61\x28\x31\x35\x35\x2C\x31\x35\x35\x2C\x31\x35\x35\x2C\x30\x2E\x32\x29\x7D", "\x20\x2E\x74\x69\x74\x6C\x65\x2D\x77\x72\x61\x70\x7B\x62\x6F\x72\x64\x65\x72\x2D\x62\x6F\x74\x74\x6F\x6D\x2D\x63\x6F\x6C\x6F\x72\x3A", "\x7D\x2E\x69\x64\x2D", "\x20\x2E\x74\x69\x74\x6C\x65\x2D\x77\x72\x61\x70\x20\x3E\x20\x68\x33\x2C\x2E\x69\x64\x2D", "\x20\x2E\x74\x69\x74\x6C\x65\x2D\x77\x72\x61\x70\x20\x3E\x20\x68\x33\x7B\x63\x6F\x6C\x6F\x72\x3A\x23\x66\x66\x66\x7D\x2E\x69\x64\x2D", "\x20\x2E\x74\x69\x74\x6C\x65\x2D\x77\x72\x61\x70\x20\x3E\x20\x61\x2E\x6D\x6F\x72\x65\x3A\x68\x6F\x76\x65\x72\x2C\x2E\x69\x64\x2D", "\x20\x2E\x65\x6E\x74\x72\x79\x2D\x68\x65\x61\x64\x65\x72\x3A\x6E\x6F\x74\x28\x2E\x65\x6E\x74\x72\x79\x2D\x69\x6E\x66\x6F\x29\x20\x2E\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x20\x61\x3A\x68\x6F\x76\x65\x72\x7B\x63\x6F\x6C\x6F\x72\x3A", "\x20\x2E\x74\x69\x74\x6C\x65\x2D\x77\x72\x61\x70\x20\x3E\x20\x68\x33\x3A\x61\x66\x74\x65\x72\x7B\x62\x6F\x72\x64\x65\x72\x2D\x6C\x65\x66\x74\x2D\x63\x6F\x6C\x6F\x72\x3A", "\x7D\x2E\x72\x74\x6C\x20\x2E\x69\x64\x2D", "\x20\x2E\x74\x69\x74\x6C\x65\x2D\x77\x72\x61\x70\x20\x3E\x20\x68\x33\x3A\x61\x66\x74\x65\x72\x7B\x62\x6F\x72\x64\x65\x72\x2D\x72\x69\x67\x68\x74\x2D\x63\x6F\x6C\x6F\x72\x3A", "\x6D\x73\x69\x6D\x70\x6C\x65", "\x62\x6C\x6F\x63\x6B\x31", "\x62\x6C\x6F\x63\x6B\x32", "\x63\x6F\x6C\x2D\x6C\x65\x66\x74", "\x63\x6F\x6C\x2D\x72\x69\x67\x68\x74", "\x67\x72\x69\x64\x31", "\x67\x72\x69\x64\x32", "\x76\x69\x64\x65\x6F\x73", "\x67\x65\x74\x65\x72\x72\x6F\x72\x34\x30\x34", "\x47\x45\x54", "\x6A\x73\x6F\x6E", "\x69\x64", "\x70\x61\x72\x65\x6E\x74", "\x66\x65\x61\x74\x75\x72\x65\x64\x34", "\x70\x72\x65\x70\x65\x6E\x64", "\x23\x70\x61\x67\x65\x2D\x73\x6B\x69\x6E\x2D\x32", "\x74\x79\x70\x65\x2D", "\x20\x69\x64\x2D", "\x20\x73\x68\x6F\x77\x2D\x69\x66\x79", "\x66\x65\x61\x74\x75\x72\x65\x64\x35", "\x20\x63\x6F\x6C\x75\x6D\x6E\x2D\x77\x69\x64\x67\x65\x74\x20\x69\x64\x2D", "\x73\x69\x64\x65\x31", "\x6C\x69\x73\x74\x32", "\x73\x68\x6F\x77\x2D\x69\x66\x79", "\x72\x65\x6C\x61\x74\x65\x64", "\x3C\x75\x6C\x20\x63\x6C\x61\x73\x73\x3D\x22\x6D\x65\x67\x61\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x6D\x65\x67\x61\x74\x61\x62\x73", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x65\x61\x74\x75\x72\x65\x64\x2D\x69\x74\x65\x6D\x73\x20", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x62\x6C\x6F\x63\x6B\x31\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x62\x6C\x6F\x63\x6B\x32\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x63\x6F\x6C\x75\x6D\x6E\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x67\x72\x69\x64\x31\x2D\x69\x74\x65\x6D\x73\x20\x74\x6F\x74\x61\x6C\x2D", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x67\x72\x69\x64\x32\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x76\x69\x64\x65\x6F\x73\x2D\x69\x74\x65\x6D\x73\x20\x74\x6F\x74\x61\x6C\x2D", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x73\x69\x64\x65\x31\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x6C\x69\x73\x74\x31\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x6C\x69\x73\x74\x32\x2D\x69\x74\x65\x6D\x73\x22\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x6C\x61\x74\x65\x64\x2D\x70\x6F\x73\x74\x73\x20\x74\x6F\x74\x61\x6C\x2D", "\x65\x6E\x74\x72\x79", "\x66\x65\x65\x64", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x6D\x65\x67\x61\x2D\x69\x74\x65\x6D\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x6D\x65\x67\x61\x2D\x63\x6F\x6E\x74\x65\x6E\x74\x22\x3E\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x22\x20\x68\x72\x65\x66\x3D\x22", "\x3C\x2F\x61\x3E\x3C\x2F\x68\x32\x3E", "\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x61\x72\x74\x69\x63\x6C\x65\x3E", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x65\x61\x74\x75\x72\x65\x64\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x65\x61\x74\x75\x72\x65\x64\x2D\x69\x74\x65\x6D\x2D\x69\x6E\x6E\x65\x72\x22\x3E\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x20\x62\x65\x66\x6F\x72\x65\x2D\x6D\x61\x73\x6B\x22\x20\x68\x72\x65\x66\x3D\x22", "\x22\x2F\x3E\x3C\x2F\x61\x3E", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x68\x65\x61\x64\x65\x72\x20\x65\x6E\x74\x72\x79\x2D\x69\x6E\x66\x6F\x22\x3E\x3C\x68\x32\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x61\x72\x74\x69\x63\x6C\x65\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x66\x65\x61\x74\x75\x72\x65\x64\x2D\x73\x63\x72\x6F\x6C\x6C\x22\x3E", "\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x61\x72\x74\x69\x63\x6C\x65\x3E", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x62\x6C\x6F\x63\x6B\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x62\x6C\x6F\x63\x6B\x2D\x69\x6E\x6E\x65\x72\x22\x3E", "\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x20\x62\x65\x66\x6F\x72\x65\x2D\x6D\x61\x73\x6B\x22\x20\x68\x72\x65\x66\x3D\x22", "\x22\x2F\x3E\x3C\x2F\x61\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x68\x65\x61\x64\x65\x72\x20\x65\x6E\x74\x72\x79\x2D\x69\x6E\x66\x6F\x22\x3E\x3C\x68\x32\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x22\x3E\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x22\x20\x68\x72\x65\x66\x3D\x22", "\x22\x2F\x3E\x3C\x2F\x61\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x68\x65\x61\x64\x65\x72\x22\x3E\x3C\x68\x32\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x22\x3E\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x22\x20\x68\x72\x65\x66\x3D\x22", "\x22\x2F\x3E\x3C\x2F\x61\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x68\x65\x61\x64\x65\x72\x22\x3E\x3C\x68\x32\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x63\x6F\x6C\x75\x6D\x6E\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x63\x6F\x6C\x75\x6D\x6E\x2D\x69\x6E\x6E\x65\x72\x22\x3E", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x67\x72\x69\x64\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x22\x3E", "\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x22\x20\x68\x72\x65\x66\x3D\x22", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x76\x69\x64\x65\x6F\x73\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x76\x69\x64\x65\x6F\x73\x2D\x69\x6E\x6E\x65\x72\x22\x3E", "\x22\x2F\x3E\x3C\x73\x70\x61\x6E\x20\x63\x6C\x61\x73\x73\x3D\x22\x76\x69\x64\x65\x6F\x2D\x69\x63\x6F\x6E\x22\x2F\x3E\x3C\x2F\x61\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x68\x65\x61\x64\x65\x72\x20\x65\x6E\x74\x72\x79\x2D\x69\x6E\x66\x6F\x22\x3E\x3C\x68\x32\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x73\x69\x64\x65\x31\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x73\x69\x64\x65\x31\x2D\x69\x6E\x6E\x65\x72\x22\x3E", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x6C\x69\x73\x74\x32\x2D\x69\x74\x65\x6D\x20\x69\x74\x65\x6D\x2D", "\x22\x3E\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x68\x65\x61\x64\x65\x72\x22\x3E", "\x3C\x68\x32\x20\x63\x6C\x61\x73\x73\x3D\x22\x65\x6E\x74\x72\x79\x2D\x74\x69\x74\x6C\x65\x22\x3E\x3C\x61\x20\x68\x72\x65\x66\x3D\x22", "\x3C\x2F\x61\x3E\x3C\x2F\x68\x32\x3E\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x61\x72\x74\x69\x63\x6C\x65\x3E", "\x3C\x61\x72\x74\x69\x63\x6C\x65\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x6C\x61\x74\x65\x64\x2D\x69\x74\x65\x6D\x20\x70\x6F\x73\x74\x20\x69\x74\x65\x6D\x2D", "\x3C\x2F\x75\x6C\x3E", "\x2F\x73\x65\x61\x72\x63\x68", "\x2F\x73\x65\x61\x72\x63\x68\x2F\x6C\x61\x62\x65\x6C\x2F", "\x61\x3A\x66\x69\x72\x73\x74", "\x3C\x2F\x64\x69\x76\x3E\x3C\x2F\x64\x69\x76\x3E", "\x6C\x61\x7A\x79\x69\x66\x79", "\x73\x70\x61\x6E\x2E\x65\x6E\x74\x72\x79\x2D\x74\x68\x75\x6D\x62", "\x3C\x75\x6C\x3E", "\x61\x6A\x61\x78", "\x67\x65\x74\x6D\x65\x67\x61", "\x67\x65\x74\x66\x65\x61\x74\x75\x72\x65\x64", "\x67\x65\x74\x62\x6C\x6F\x63\x6B", "\x76\x69\x65\x77\x41\x6C\x6C", "\x3C\x61\x20\x63\x6C\x61\x73\x73\x3D\x22\x6D\x6F\x72\x65\x22\x20\x68\x72\x65\x66\x3D\x22\x2F\x73\x65\x61\x72\x63\x68\x2F\x6C\x61\x62\x65\x6C\x2F", "\x3C\x2F\x61\x3E", "\x2E\x77\x69\x64\x67\x65\x74\x2D\x74\x69\x74\x6C\x65", "\x67\x65\x74\x77\x69\x64\x67\x65\x74", "\x67\x65\x74\x72\x65\x6C\x61\x74\x65\x64", "\x24", "\x3D", "\x61", "\x74\x79\x70\x65", "\x6C\x61\x62\x65\x6C", "\x68\x61\x73\x2D\x73\x75\x62\x20\x6D\x65\x67\x61\x2D\x6D\x65\x6E\x75", "\x23\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x61\x69\x6E\x2D\x6D\x65\x6E\x75\x20\x6C\x69", "\x63\x6F\x6C\x6F\x72", "\x23\x66\x65\x61\x74\x75\x72\x65\x64\x20\x2E\x48\x54\x4D\x4C\x20\x2E\x77\x69\x64\x67\x65\x74\x2D\x63\x6F\x6E\x74\x65\x6E\x74", "\x72\x65\x73\x75\x6C\x74\x73", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x63\x6F\x6E\x74\x65\x6E\x74\x2D\x62\x6C\x6F\x63\x6B\x73\x20\x2E\x48\x54\x4D\x4C\x20\x2E\x77\x69\x64\x67\x65\x74\x2D\x63\x6F\x6E\x74\x65\x6E\x74", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x77\x69\x64\x67\x65\x74\x2D\x72\x65\x61\x64\x79\x20\x2E\x48\x54\x4D\x4C\x20\x2E\x77\x69\x64\x67\x65\x74\x2D\x63\x6F\x6E\x74\x65\x6E\x74", "\x64\x61\x74\x61\x2D\x6C\x61\x62\x65\x6C", "\x2E\x72\x65\x6C\x61\x74\x65\x64\x2D\x74\x61\x67", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x72\x65\x6C\x61\x74\x65\x64\x2D\x63\x6F\x6E\x74\x65\x6E\x74", "\x2F\x2F\x72\x65\x73\x6F\x75\x72\x63\x65\x73\x2E\x62\x6C\x6F\x67\x62\x6C\x6F\x67\x2E\x63\x6F\x6D\x2F\x69\x6D\x67\x2F\x62\x6C\x61\x6E\x6B\x2E\x67\x69\x66", "\x2F\x2F\x34\x2E\x62\x70\x2E\x62\x6C\x6F\x67\x73\x70\x6F\x74\x2E\x63\x6F\x6D\x2F\x2D\x6F\x53\x6A\x50\x38\x46\x30\x39\x71\x78\x6F\x2F\x57\x79\x31\x4A\x39\x64\x70\x37\x62\x30\x49\x2F\x41\x41\x41\x41\x41\x41\x41\x41\x43\x46\x30\x2F\x67\x67\x63\x52\x66\x4C\x43\x46\x51\x39\x73\x32\x53\x53\x61\x65\x4C\x39\x42\x46\x53\x45\x32\x77\x79\x54\x59\x7A\x51\x61\x54\x79\x51\x43\x4B\x34\x42\x47\x41\x59\x59\x43\x77\x2F\x73\x33\x35\x2D\x72\x2F\x61\x76\x61\x74\x61\x72\x2E\x6A\x70\x67", "\x62\x6C\x6F\x67\x67\x65\x72", "\x64\x69\x73\x71\x75\x73", "\x63\x6F\x6D\x6D\x65\x6E\x74\x73\x2D\x73\x79\x73\x74\x65\x6D\x2D\x62\x6C\x6F\x67\x67\x65\x72", "\x2E\x65\x6E\x74\x72\x79\x2D\x6D\x65\x74\x61\x20\x2E\x65\x6E\x74\x72\x79\x2D\x63\x6F\x6D\x6D\x65\x6E\x74\x73\x2D\x6C\x69\x6E\x6B", "\x2E\x61\x76\x61\x74\x61\x72\x2D\x69\x6D\x61\x67\x65\x2D\x63\x6F\x6E\x74\x61\x69\x6E\x65\x72\x20\x69\x6D\x67", "\x66\x61\x63\x65\x62\x6F\x6F\x6B", "\x68\x69\x64\x65", "\x2E\x63\x6F\x6D\x6D\x65\x6E\x74\x73\x20\x2E\x74\x6F\x70\x6C\x65\x76\x65\x6C\x2D\x74\x68\x72\x65\x61\x64\x20\x3E\x20\x6F\x6C\x20\x3E\x20\x2E\x63\x6F\x6D\x6D\x65\x6E\x74\x20\x2E\x63\x6F\x6D\x6D\x65\x6E\x74\x2D\x61\x63\x74\x69\x6F\x6E\x73\x20\x2E\x63\x6F\x6D\x6D\x65\x6E\x74\x2D\x72\x65\x70\x6C\x79", "\x2E\x63\x6F\x6D\x6D\x65\x6E\x74\x73\x20\x2E\x74\x6F\x70\x6C\x65\x76\x65\x6C\x2D\x74\x68\x72\x65\x61\x64\x20\x3E\x20\x23\x74\x6F\x70\x2D\x63\x6F\x6E\x74\x69\x6E\x75\x65", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x62\x6C\x6F\x67\x2D\x70\x6F\x73\x74\x2D\x63\x6F\x6D\x6D\x65\x6E\x74\x73", "\x2E\x69\x6E\x64\x65\x78\x2D\x70\x6F\x73\x74\x20\x2E\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x20\x2E\x65\x6E\x74\x72\x79\x2D\x74\x68\x75\x6D\x62\x2C\x20\x2E\x50\x6F\x70\x75\x6C\x61\x72\x50\x6F\x73\x74\x73\x20\x2E\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x20\x2E\x65\x6E\x74\x72\x79\x2D\x74\x68\x75\x6D\x62\x2C\x20\x2E\x46\x65\x61\x74\x75\x72\x65\x64\x50\x6F\x73\x74\x20\x2E\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x20\x2E\x65\x6E\x74\x72\x79\x2D\x74\x68\x75\x6D\x62\x2C\x2E\x61\x62\x6F\x75\x74\x2D\x61\x75\x74\x68\x6F\x72\x20\x2E\x61\x75\x74\x68\x6F\x72\x2D\x61\x76\x61\x74\x61\x72", "\x63\x6C\x6F\x6E\x65", "\x23\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x61\x69\x6E\x2D\x6D\x65\x6E\x75\x2D\x6E\x61\x76", "\x6D\x61\x69\x6E\x2D\x6D\x6F\x62\x69\x6C\x65\x2D\x6E\x61\x76", "\x72\x65\x6D\x6F\x76\x65", "\x2E\x6D\x65\x67\x61\x2D\x69\x74\x65\x6D\x73\x2C\x20\x2E\x6D\x65\x67\x61\x2D\x74\x61\x62", "\x64\x61\x74\x61\x2D\x74\x65\x78\x74", "\x61\x2E\x68\x6F\x6D\x65\x2D\x69\x63\x6F\x6E", "\x63\x6C\x61\x73\x73", "\x73\x75\x62\x2D\x6D\x65\x6E\x75\x20\x6D\x2D\x73\x75\x62", "\x3E\x20\x75\x6C\x2E\x73\x65\x6C\x65\x63\x74\x2D\x74\x61\x62", "\x6C\x69\x2E\x6D\x65\x67\x61\x2D\x74\x61\x62\x73\x20\x2E\x63\x6F\x6D\x70\x6C\x65\x78\x2D\x74\x61\x62\x73", "\x2E\x6D\x65\x67\x61\x2D\x6D\x65\x6E\x75\x3A\x6E\x6F\x74\x28\x2E\x6D\x65\x67\x61\x2D\x74\x61\x62\x73\x29\x20\x3E\x20\x61", "\x2E\x6D\x65\x67\x61\x2D\x74\x61\x62\x73\x20\x75\x6C\x20\x6C\x69\x20\x3E\x20\x61", "\x61\x70\x70\x65\x6E\x64\x54\x6F", "\x6E\x61\x76\x2D\x61\x63\x74\x69\x76\x65", "\x2E\x6D\x6F\x62\x69\x6C\x65\x2D\x6D\x65\x6E\x75\x2D\x74\x6F\x67\x67\x6C\x65\x2C\x20\x2E\x68\x69\x64\x65\x2D\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x6F\x62\x69\x6C\x65\x2D\x6D\x65\x6E\x75\x2C\x20\x2E\x6F\x76\x65\x72\x6C\x61\x79", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x73\x75\x62\x6D\x65\x6E\x75\x2D\x74\x6F\x67\x67\x6C\x65\x22\x2F\x3E", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x6F\x62\x69\x6C\x65\x2D\x6D\x65\x6E\x75\x20\x2E\x68\x61\x73\x2D\x73\x75\x62", "\x2E\x73\x75\x62\x6D\x65\x6E\x75\x2D\x74\x6F\x67\x67\x6C\x65", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x6F\x62\x69\x6C\x65\x2D\x6D\x65\x6E\x75\x20\x2E\x6D\x65\x67\x61\x2D\x6D\x65\x6E\x75", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x6F\x62\x69\x6C\x65\x2D\x6D\x65\x6E\x75\x20\x2E\x6D\x65\x67\x61\x2D\x74\x61\x62\x73", "\x68\x61\x73\x2D\x73\x75\x62", "\x68\x61\x73\x43\x6C\x61\x73\x73", "\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74", "\x73\x6C\x69\x64\x65\x54\x6F\x67\x67\x6C\x65", "\x2E\x6D\x2D\x73\x75\x62", "\x63\x68\x69\x6C\x64\x72\x65\x6E", "\x3E\x20\x2E\x6D\x2D\x73\x75\x62", "\x72\x65\x6D\x6F\x76\x65\x43\x6C\x61\x73\x73", "\x2E\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x6F\x62\x69\x6C\x65\x2D\x6D\x65\x6E\x75\x20\x75\x6C\x20\x6C\x69\x20\x2E\x73\x75\x62\x6D\x65\x6E\x75\x2D\x74\x6F\x67\x67\x6C\x65", "\x23\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6D\x6F\x62\x69\x6C\x65\x2D\x6D\x65\x6E\x75", "\x23\x6D\x61\x69\x6E\x2D\x6E\x61\x76\x62\x61\x72\x2D\x6D\x65\x6E\x75\x20\x75\x6C\x2E\x6D\x65\x6E\x75", "\x2E\x6D\x6F\x62\x69\x6C\x65\x2D\x6E\x61\x76\x62\x61\x72\x2D\x6D\x65\x6E\x75", "\x23\x6D\x61\x69\x6E\x2D\x6E\x61\x76\x62\x61\x72\x2D\x73\x6F\x63\x69\x61\x6C\x20\x75\x6C\x2E\x73\x6F\x63\x69\x61\x6C", "\x2E\x6D\x6F\x62\x69\x6C\x65\x2D\x6E\x61\x76\x62\x61\x72\x2D\x73\x6F\x63\x69\x61\x6C", "\x73\x63\x72\x6F\x6C\x6C\x54\x6F\x70", "\x74\x6F\x70", "\x6F\x66\x66\x73\x65\x74", "\x23\x66\x6F\x6F\x74\x65\x72\x2D\x77\x72\x61\x70\x70\x65\x72", "\x69\x73\x2D\x66\x69\x78\x65\x64", "\x73\x63\x72\x6F\x6C\x6C", "\x2E\x6D\x61\x69\x6E\x2D\x6D\x65\x6E\x75\x2D\x77\x72\x61\x70\x20\x2E\x6D\x61\x69\x6E\x2D\x6D\x65\x6E\x75", "\x23\x6D\x61\x69\x6E\x2D\x6C\x6F\x67\x6F", "\x74\x68\x65\x69\x61\x53\x74\x69\x63\x6B\x79\x53\x69\x64\x65\x62\x61\x72", "\x23\x6D\x61\x69\x6E\x2D\x77\x72\x61\x70\x70\x65\x72\x2C\x23\x73\x69\x64\x65\x62\x61\x72\x2D\x77\x72\x61\x70\x70\x65\x72", "\x77\x77\x77\x2E\x79\x6F\x75\x74\x75\x62\x65\x2E\x63\x6F\x6D", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x73\x70\x6F\x6E\x73\x69\x76\x65\x2D\x76\x69\x64\x65\x6F\x2D\x77\x72\x61\x70\x22\x2F\x3E", "\x77\x72\x61\x70", "\x23\x70\x6F\x73\x74\x2D\x62\x6F\x64\x79\x20\x69\x66\x72\x61\x6D\x65", "\x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22\x24\x31\x22\x2F\x3E", "\x72\x65\x70\x6C\x61\x63\x65\x54\x65\x78\x74", "\x3C\x64\x69\x76\x20\x63\x6C\x61\x73\x73\x3D\x22\x72\x65\x73\x70\x6F\x6E\x73\x69\x76\x65\x2D\x76\x69\x64\x65\x6F\x2D\x77\x72\x61\x70\x22\x3E\x3C\x69\x66\x72\x61\x6D\x65\x20\x69\x64\x3D\x22\x79\x6F\x75\x74\x75\x62\x65\x22\x20\x77\x69\x64\x74\x68\x3D\x22\x31\x30\x30\x25\x22\x20\x68\x65\x69\x67\x68\x74\x3D\x22\x33\x35\x38\x22\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x73\x3A\x2F\x2F\x77\x77\x77\x2E\x79\x6F\x75\x74\x75\x62\x65\x2E\x63\x6F\x6D\x2F\x65\x6D\x62\x65\x64\x2F\x24\x31\x22\x20\x66\x72\x61\x6D\x65\x62\x6F\x72\x64\x65\x72\x3D\x22\x30\x22\x20\x61\x6C\x6C\x6F\x77\x3D\x22\x61\x63\x63\x65\x6C\x65\x72\x6F\x6D\x65\x74\x65\x72\x3B\x20\x61\x75\x74\x6F\x70\x6C\x61\x79\x3B\x20\x65\x6E\x63\x72\x79\x70\x74\x65\x64\x2D\x6D\x65\x64\x69\x61\x3B\x20\x67\x79\x72\x6F\x73\x63\x6F\x70\x65\x3B\x20\x70\x69\x63\x74\x75\x72\x65\x2D\x69\x6E\x2D\x70\x69\x63\x74\x75\x72\x65\x22\x20\x61\x6C\x6C\x6F\x77\x66\x75\x6C\x6C\x73\x63\x72\x65\x65\x6E\x3E\x3C\x2F\x69\x66\x72\x61\x6D\x65\x3E\x3C\x2F\x64\x69\x76\x3E", "\x70\x2E\x63\x6F\x6D\x6D\x65\x6E\x74\x2D\x63\x6F\x6E\x74\x65\x6E\x74", "\x73\x74\x79\x6C\x65", "\x76\x69\x73\x69\x62\x69\x6C\x69\x74\x79\x3A\x76\x69\x73\x69\x62\x6C\x65\x21\x69\x6D\x70\x6F\x72\x74\x61\x6E\x74\x3B\x6F\x70\x61\x63\x69\x74\x79\x3A\x31\x21\x69\x6D\x70\x6F\x72\x74\x61\x6E\x74\x3B\x70\x6F\x73\x69\x74\x69\x6F\x6E\x3A\x72\x65\x6C\x61\x74\x69\x76\x65\x21\x69\x6D\x70\x6F\x72\x74\x61\x6E\x74\x3B\x7A\x2D\x69\x6E\x64\x65\x78\x3A\x31\x21\x69\x6D\x70\x6F\x72\x74\x61\x6E\x74\x3B\x66\x6F\x6E\x74\x2D\x73\x69\x7A\x65\x3A\x31\x33\x70\x78\x21\x69\x6D\x70\x6F\x72\x74\x61\x6E\x74\x3B\x63\x6F\x6C\x6F\x72\x3A\x23\x64\x62\x64\x62\x64\x62\x21\x69\x6D\x70\x6F\x72\x74\x61\x6E\x74\x3B", "\x42\x6C\x6F\x67\x67\x65\x72\x20\x54\x65\x6D\x70\x6C\x61\x74\x65\x73", "\x68\x74\x74\x70\x73\x3A\x2F\x2F\x77\x77\x77\x2E\x74\x65\x6D\x70\x6C\x61\x74\x65\x69\x66\x79\x2E\x63\x6F\x6D\x2F", "\x61\x23\x74\x65\x6D\x70\x6C\x61\x74\x65\x69\x66\x79", "\x61\x23\x74\x65\x6D\x70\x6C\x61\x74\x65\x69\x66\x79\x3A\x76\x69\x73\x69\x62\x6C\x65", "\x6C\x6F\x63\x61\x74\x69\x6F\x6E", "\x6C\x6F\x61\x64", "\x23\x6D\x61\x67\x70\x72\x6F\x2D\x66\x72\x65\x65\x2D\x6C\x6F\x61\x64\x2D\x6D\x6F\x72\x65\x2D\x6C\x69\x6E\x6B", "\x2E\x62\x6C\x6F\x67\x2D\x70\x6F\x73\x74\x73", "\x70\x6F\x73\x74\x2D\x61\x6E\x69\x6D\x61\x74\x65\x64\x20\x70\x6F\x73\x74\x2D\x66\x61\x64\x65\x49\x6E\x55\x70", "\x2E\x69\x6E\x64\x65\x78\x2D\x70\x6F\x73\x74", "\x23\x62\x6C\x6F\x67\x2D\x70\x61\x67\x65\x72\x20\x2E\x6E\x6F\x2D\x6D\x6F\x72\x65", "\x2E\x69\x6E\x64\x65\x78\x2D\x70\x6F\x73\x74\x20\x2E\x65\x6E\x74\x72\x79\x2D\x69\x6D\x61\x67\x65\x2D\x6C\x69\x6E\x6B\x20\x2E\x65\x6E\x74\x72\x79\x2D\x74\x68\x75\x6D\x62", "\x23\x6D\x61\x69\x6E\x2D\x77\x72\x61\x70\x70\x65\x72", "\x23\x62\x6C\x6F\x67\x2D\x70\x61\x67\x65\x72\x20\x2E\x6C\x6F\x61\x64\x69\x6E\x67", "\x66\x61\x64\x65\x49\x6E", "\x66\x61\x64\x65\x4F\x75\x74", "\x6F\x6E\x2D\x66\x6F\x6F\x74\x65\x72", "\x61\x6E\x69\x6D\x61\x74\x65", "\x68\x74\x6D\x6C\x2C\x20\x62\x6F\x64\x79", "\x2E\x62\x61\x63\x6B\x2D\x74\x6F\x70"];
var _$_obify1 = [_$_obify2[0], _$_obify2[1], _$_obify2[2], _$_obify2[3], _$_obify2[4], _$_obify2[5], _$_obify2[6], _$_obify2[7], _$_obify2[8], _$_obify2[9], _$_obify2[10], _$_obify2[11], _$_obify2[12], _$_obify2[13], _$_obify2[14], _$_obify2[15], _$_obify2[16], _$_obify2[17], _$_obify2[18], _$_obify2[19], _$_obify2[20], _$_obify2[21], _$_obify2[22], _$_obify2[23], _$_obify2[24], _$_obify2[25], _$_obify2[26], _$_obify2[27], _$_obify2[28], _$_obify2[29], _$_obify2[30], _$_obify2[31], _$_obify2[32], _$_obify2[33], _$_obify2[34], _$_obify2[35], _$_obify2[36], _$_obify2[37], _$_obify2[38], _$_obify2[39], _$_obify2[40], _$_obify2[41], _$_obify2[42], _$_obify2[43], _$_obify2[44], _$_obify2[45], _$_obify2[46], _$_obify2[47], _$_obify2[48], _$_obify2[49], _$_obify2[50], _$_obify2[51], _$_obify2[52], _$_obify2[53], _$_obify2[54], _$_obify2[55], _$_obify2[56], _$_obify2[57], _$_obify2[58], _$_obify2[59], _$_obify2[60], _$_obify2[61], _$_obify2[62], _$_obify2[63], _$_obify2[64], _$_obify2[65], _$_obify2[66], _$_obify2[67], _$_obify2[68], _$_obify2[69], _$_obify2[70], _$_obify2[71], _$_obify2[72], _$_obify2[73], _$_obify2[74], _$_obify2[75], _$_obify2[76], _$_obify2[77], _$_obify2[78], _$_obify2[79], _$_obify2[80], _$_obify2[81], _$_obify2[82], _$_obify2[83], _$_obify2[84], _$_obify2[85], _$_obify2[86], _$_obify2[87], _$_obify2[88], _$_obify2[89], _$_obify2[90], _$_obify2[91], _$_obify2[92], _$_obify2[93], _$_obify2[94], _$_obify2[95], _$_obify2[96], _$_obify2[97], _$_obify2[98], _$_obify2[99], _$_obify2[100], _$_obify2[101], _$_obify2[102], _$_obify2[103], _$_obify2[104], _$_obify2[105], _$_obify2[106], _$_obify2[107], _$_obify2[108], _$_obify2[109], _$_obify2[110], _$_obify2[111], _$_obify2[112], _$_obify2[113], _$_obify2[114], _$_obify2[115], _$_obify2[116], _$_obify2[117], _$_obify2[118], _$_obify2[119], _$_obify2[120], _$_obify2[121], _$_obify2[122], _$_obify2[123], _$_obify2[124], _$_obify2[125], _$_obify2[126], _$_obify2[127], _$_obify2[128], _$_obify2[129], _$_obify2[130], _$_obify2[131], _$_obify2[132], _$_obify2[133], _$_obify2[134], _$_obify2[135], _$_obify2[136], _$_obify2[137], _$_obify2[138], _$_obify2[139], _$_obify2[140], _$_obify2[141], _$_obify2[142], _$_obify2[143], _$_obify2[144], _$_obify2[145], _$_obify2[146], _$_obify2[147], _$_obify2[148], _$_obify2[149], _$_obify2[150], _$_obify2[151], _$_obify2[152], _$_obify2[153], _$_obify2[154], _$_obify2[155], _$_obify2[156], _$_obify2[157], _$_obify2[158], _$_obify2[159], _$_obify2[160], _$_obify2[161], _$_obify2[162], _$_obify2[163], _$_obify2[164], _$_obify2[165], _$_obify2[166], _$_obify2[167], _$_obify2[168], _$_obify2[169], _$_obify2[170], _$_obify2[171], _$_obify2[172], _$_obify2[173], _$_obify2[174], _$_obify2[175], _$_obify2[176], _$_obify2[177], _$_obify2[178], _$_obify2[179], _$_obify2[180], _$_obify2[181], _$_obify2[182], _$_obify2[183], _$_obify2[184], _$_obify2[185], _$_obify2[186], _$_obify2[187], _$_obify2[188], _$_obify2[189], _$_obify2[190], _$_obify2[191], _$_obify2[192], _$_obify2[193], _$_obify2[194], _$_obify2[195], _$_obify2[196], _$_obify2[197], _$_obify2[198], _$_obify2[199], _$_obify2[200], _$_obify2[201], _$_obify2[202], _$_obify2[203], _$_obify2[204], _$_obify2[205], _$_obify2[206], _$_obify2[207], _$_obify2[208], _$_obify2[209], _$_obify2[210], _$_obify2[211], _$_obify2[212], _$_obify2[213], _$_obify2[214], _$_obify2[215], _$_obify2[216], _$_obify2[217], _$_obify2[218], _$_obify2[219], _$_obify2[220], _$_obify2[221], _$_obify2[222], _$_obify2[223], _$_obify2[224], _$_obify2[225], _$_obify2[226], _$_obify2[227], _$_obify2[228], _$_obify2[229], _$_obify2[230], _$_obify2[231], _$_obify2[232], _$_obify2[233], _$_obify2[234], _$_obify2[235], _$_obify2[236], _$_obify2[237], _$_obify2[238], _$_obify2[239], _$_obify2[240], _$_obify2[241], _$_obify2[242], _$_obify2[243], _$_obify2[244], _$_obify2[245], _$_obify2[246], _$_obify2[247], _$_obify2[248], _$_obify2[249], _$_obify2[250], _$_obify2[251], _$_obify2[252], _$_obify2[253], _$_obify2[254], _$_obify2[255], _$_obify2[256], _$_obify2[257], _$_obify2[258], _$_obify2[259], _$_obify2[260], _$_obify2[261], _$_obify2[262], _$_obify2[263], _$_obify2[264], _$_obify2[265], _$_obify2[266], _$_obify2[267], _$_obify2[268], _$_obify2[269], _$_obify2[270], _$_obify2[271], _$_obify2[272], _$_obify2[273], _$_obify2[274], _$_obify2[275], _$_obify2[276], _$_obify2[277], _$_obify2[278], _$_obify2[279], _$_obify2[280], _$_obify2[281], _$_obify2[282], _$_obify2[283], _$_obify2[284], _$_obify2[285], _$_obify2[286], _$_obify2[287], _$_obify2[288], _$_obify2[289], _$_obify2[290], _$_obify2[291], _$_obify2[292], _$_obify2[293], _$_obify2[294], _$_obify2[295], _$_obify2[296], _$_obify2[297], _$_obify2[298], _$_obify2[299], _$_obify2[300], _$_obify2[301], _$_obify2[302], _$_obify2[303], _$_obify2[304], _$_obify2[305], _$_obify2[306], _$_obify2[307], _$_obify2[308], _$_obify2[309], _$_obify2[310], _$_obify2[311], _$_obify2[312], _$_obify2[313], _$_obify2[314], _$_obify2[315], _$_obify2[316], _$_obify2[317], _$_obify2[318], _$_obify2[319], _$_obify2[320], _$_obify2[321], _$_obify2[322], _$_obify2[323], _$_obify2[324], _$_obify2[325], _$_obify2[326], _$_obify2[327], _$_obify2[328], _$_obify2[329], _$_obify2[330], _$_obify2[331], _$_obify2[332], _$_obify2[333], _$_obify2[334], _$_obify2[335], _$_obify2[336], _$_obify2[337], _$_obify2[338], _$_obify2[339], _$_obify2[340], _$_obify2[341], _$_obify2[342], _$_obify2[343], _$_obify2[344], _$_obify2[345], _$_obify2[346], _$_obify2[347], _$_obify2[348], _$_obify2[349], _$_obify2[350], _$_obify2[351], _$_obify2[352], _$_obify2[353], _$_obify2[354], _$_obify2[355], _$_obify2[356], _$_obify2[357], _$_obify2[358], _$_obify2[359], _$_obify2[360], _$_obify2[361], _$_obify2[362]];
$(_$_obify1[1])[_$_obify1[0]]();
$(_$_obify1[15])[_$_obify1[14]](function() {
    var _0xe0f5x2 = $(this),
        _0xe0f5x3 = _0xe0f5x2[_$_obify1[5]](_$_obify1[4])[_$_obify1[3]]()[_$_obify1[2]]();
    if (_0xe0f5x3 == _$_obify1[6]) {
        _0xe0f5x2[_$_obify1[11]](_$_obify1[10])[_$_obify1[5]](_$_obify1[4], _$_obify1[9])[_$_obify1[8]](_$_obify1[7])
    } else {
        if (_0xe0f5x3 == _$_obify1[12]) {
            _0xe0f5x2[_$_obify1[11]](_$_obify1[13])[_$_obify1[5]](_$_obify1[4], _$_obify1[9])
        }
    }
});
$(_$_obify1[17])[_$_obify1[11]](_$_obify1[16]);
$(_$_obify1[23])[_$_obify1[22]](_$_obify1[18], function() {
    $(_$_obify1[21])[_$_obify1[20]](_$_obify1[19])
});
$(_$_obify1[24])[_$_obify1[14]](function() {
    var _0xe0f5x2 = $(this),
        _0xe0f5x4 = viewAllText;
    if (_0xe0f5x4 != _$_obify1[7]) {
        _0xe0f5x2[_$_obify1[8]](_0xe0f5x4)
    }
});
$(_$_obify1[25])[_$_obify1[14]](function() {
    var _0xe0f5x2 = $(this),
        _0xe0f5x5 = followByEmailText;
    if (_0xe0f5x5 != _$_obify1[7]) {
        _0xe0f5x2[_$_obify1[8]](_0xe0f5x5)
    }
});
$(_$_obify1[31])[_$_obify1[14]](function() {
    var _0xe0f5x2 = $(this),
        _0xe0f5x6 = _0xe0f5x2[_$_obify1[27]](_$_obify1[26]),
        _0xe0f5x7 = _0xe0f5x6[_$_obify1[28]];
    _0xe0f5x2[_$_obify1[11]](_$_obify1[29] + _0xe0f5x7 + _$_obify1[7]);
    _0xe0f5x2[_$_obify1[30]]()
});
$(_$_obify1[38])[_$_obify1[14]](function() {
    var _0xe0f5x8 = $(this),
        _0xe0f5x9 = _0xe0f5x8[_$_obify1[8]]()[_$_obify1[2]](),
        _0xe0f5xa = _0xe0f5x9[_$_obify1[32]](_$_obify1[9]),
        _0xe0f5xb = _0xe0f5xa[0],
        _0xe0f5xc = _0xe0f5xa[1],
        _0xe0f5xd = _0xe0f5xa[_$_obify1[33]]();
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[34])) {
        _0xe0f5x8[_$_obify1[11]](_$_obify1[34])[_$_obify1[8]](_0xe0f5xb);
        if (_0xe0f5xc != _$_obify1[34]) {
            _0xe0f5x8[_$_obify1[11]](_0xe0f5xc)
        };
        if (_0xe0f5xd != _$_obify1[34]) {
            _0xe0f5x8[_$_obify1[11]](_$_obify1[37])[_$_obify1[36]]({
                '\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x63\x6F\x6C\x6F\x72': _0xe0f5xd
            })
        }
    }
});
$(_$_obify1[66])[_$_obify1[14]](function() {
    var _0xe0f5x8 = $(this),
        _0xe0f5x9 = _0xe0f5x8[_$_obify1[8]]()[_$_obify1[2]](),
        _0xe0f5xe = _0xe0f5x8[_$_obify1[39]]();
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[40])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[41]);
        $(_$_obify1[45])[_$_obify1[44]]($(_$_obify1[43]))
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[46])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[47] + _0xe0f5xe + _$_obify1[48])
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[49])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[50] + _0xe0f5xe + _$_obify1[48])
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[51])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[52] + _0xe0f5xe + _$_obify1[48])
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[53])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[54] + _0xe0f5xe + _$_obify1[48])
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[55])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[56])
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[57])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[58])
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[59])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[60])
    };
    if (_0xe0f5x9[_$_obify1[35]](_$_obify1[61])) {
        _0xe0f5x8[_$_obify1[42]](_$_obify1[62] + _0xe0f5xe + _$_obify1[63])
    };
    var _0xe0f5xf = $(_$_obify1[65])[_$_obify1[27]](_$_obify1[64]);
    _0xe0f5xf[_$_obify1[14]](function() {
        var _0xe0f5x10 = $(this),
            _0xe0f5x2 = _0xe0f5x10[_$_obify1[8]]()[_$_obify1[2]]();
        if (_0xe0f5x2[_$_obify1[35]](_$_obify1[46]) || _0xe0f5x2[_$_obify1[35]](_$_obify1[49]) || _0xe0f5x2[_$_obify1[35]](_$_obify1[51]) || _0xe0f5x2[_$_obify1[35]](_$_obify1[53]) || _0xe0f5x2[_$_obify1[35]](_$_obify1[61])) {
            _0xe0f5x10[_$_obify1[42]](_$_obify1[7])
        }
    })
});
$(_$_obify1[80])[_$_obify1[22]](_$_obify1[18], function() {
    var _0xe0f5x8 = $(this),
        _0xe0f5x11 = _0xe0f5x8[_$_obify1[68]](_$_obify1[67]),
        _0xe0f5x12 = _0xe0f5x8[_$_obify1[68]](_$_obify1[69]),
        _0xe0f5x13 = _0xe0f5x8[_$_obify1[68]](_$_obify1[70]),
        _0xe0f5x14 = window[_$_obify1[71]][_$_obify1[69]],
        _0xe0f5x15 = window[_$_obify1[71]][_$_obify1[70]],
        _0xe0f5x16 = Math[_$_obify1[72]](_0xe0f5x14 / 2 - _0xe0f5x12 / 2),
        _0xe0f5x17 = Math[_$_obify1[72]](_0xe0f5x15 / 2 - _0xe0f5x13 / 2),
        _0xe0f5x18 = window[_$_obify1[78]](_0xe0f5x11, _$_obify1[73], _$_obify1[74] + _0xe0f5x12 + _$_obify1[75] + _0xe0f5x13 + _$_obify1[76] + _0xe0f5x16 + _$_obify1[77] + _0xe0f5x17);
    _0xe0f5x18[_$_obify1[79]]()
});
$(_$_obify1[83])[_$_obify1[14]](function() {
    var _0xe0f5x2 = $(this),
        _0xe0f5x10 = _0xe0f5x2[_$_obify1[27]](_$_obify1[81]);
    _0xe0f5x10[_$_obify1[22]](_$_obify1[18], function() {
        _0xe0f5x2[_$_obify1[20]](_$_obify1[82])
    })
});
$(_$_obify1[91])[_$_obify1[14]](function() {
    var _0xe0f5x8 = $(this),
        _0xe0f5x19 = _0xe0f5x8[_$_obify1[8]]()[_$_obify1[2]](),
        _0xe0f5x11 = _0xe0f5x8[_$_obify1[5]](_$_obify1[4]);
    _0xe0f5x8[_$_obify1[42]](_$_obify1[84] + _0xe0f5x19 + _$_obify1[85] + _0xe0f5x11 + _$_obify1[86] + _0xe0f5x19 + _$_obify1[87]);
    $(_$_obify1[89])[_$_obify1[44]]($(_$_obify1[88]));
    $(_$_obify1[89])[_$_obify1[11]](_$_obify1[90])
});

function msgError() {
    return _$_obify1[92]
}

function beforeLoader() {
    return _$_obify1[93]
}

function getFeedUrl(_0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e) {
    var _0xe0f5x1f = _$_obify1[7];
    switch (_0xe0f5x1e) {
        case _$_obify1[95]:
            _0xe0f5x1f = _$_obify1[94] + _0xe0f5x1d;
            break;
        case _$_obify1[100]:
            if (_0xe0f5x9 == _$_obify1[96]) {
                _0xe0f5x1f = _$_obify1[97] + _0xe0f5x1d
            } else {
                _0xe0f5x1f = _$_obify1[98] + _0xe0f5x1e + _$_obify1[99] + _0xe0f5x1d
            };
            break;
        default:
            _0xe0f5x1f = _$_obify1[98] + _0xe0f5x1e + _$_obify1[99] + _0xe0f5x1d;
            break
    };
    return _0xe0f5x1f
}

function getPostLink(_0xe0f5x21, _0xe0f5x22) {
    for (var _0xe0f5x23 = 0; _0xe0f5x23 < _0xe0f5x21[_0xe0f5x22][_$_obify1[101]][_$_obify1[28]]; _0xe0f5x23++) {
        if (_0xe0f5x21[_0xe0f5x22][_$_obify1[101]][_0xe0f5x23][_$_obify1[102]] == _$_obify1[103]) {
            var _0xe0f5x24 = _0xe0f5x21[_0xe0f5x22][_$_obify1[101]][_0xe0f5x23][_$_obify1[4]];
            break
        }
    };
    return _0xe0f5x24
}

function getPostTitle(_0xe0f5x21, _0xe0f5x22) {
    var _0xe0f5x26 = _0xe0f5x21[_0xe0f5x22][_$_obify1[105]][_$_obify1[104]];
    return _0xe0f5x26
}

function getFirstImage(_0xe0f5x7, _0xe0f5x28) {
    var _0xe0f5x29 = $(_$_obify1[106])[_$_obify1[39]](_0xe0f5x7),
        _0xe0f5x2 = _0xe0f5x29[_$_obify1[27]](_$_obify1[108])[_$_obify1[5]](_$_obify1[107]),
        _0xe0f5x2a = _0xe0f5x2[_$_obify1[109]](_$_obify1[9]) || 0,
        _0xe0f5x10 = _0xe0f5x2[_$_obify1[109]](_$_obify1[9], _0xe0f5x2a - 1) || 0,
        _0xe0f5x2b = _0xe0f5x2[_$_obify1[110]](0, _0xe0f5x10),
        _0xe0f5x2c = _0xe0f5x2[_$_obify1[110]](_0xe0f5x10, _0xe0f5x2a),
        _0xe0f5x2d = _0xe0f5x2[_$_obify1[110]](_0xe0f5x2a);
    if (_0xe0f5x2c[_$_obify1[35]](/\/s[0-9]+/g) || _0xe0f5x2c[_$_obify1[35]](/\/w[0-9]+/g) || _0xe0f5x2c == _$_obify1[111]) {
        _0xe0f5x2c = _$_obify1[112]
    };
    _0xe0f5x28 = _0xe0f5x2b + _0xe0f5x2c + _0xe0f5x2d;
    return _0xe0f5x28
}

function getPostImage(_0xe0f5x21, _0xe0f5x22, _0xe0f5x28) {
    var _0xe0f5x7 = _0xe0f5x21[_0xe0f5x22][_$_obify1[113]][_$_obify1[104]];
    if (_0xe0f5x21[_0xe0f5x22][_$_obify1[114]]) {
        var _0xe0f5x2f = _0xe0f5x21[_0xe0f5x22][_$_obify1[114]][_$_obify1[67]]
    } else {
        _0xe0f5x2f = _$_obify1[115]
    };
    if (_0xe0f5x7[_$_obify1[116]](_0xe0f5x7[_$_obify1[35]](/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) > -1) {
        if (_0xe0f5x7[_$_obify1[116]](_$_obify1[117]) > -1) {
            if (_0xe0f5x7[_$_obify1[116]](_0xe0f5x7[_$_obify1[35]](/<iframe(?:.+)?src=(?:.+)?(?:www.youtube.com)/g)) < _0xe0f5x7[_$_obify1[116]](_$_obify1[117])) {
                _0xe0f5x28 = _0xe0f5x2f[_$_obify1[120]](_$_obify1[118], _$_obify1[119])
            } else {
                _0xe0f5x28 = getFirstImage(_0xe0f5x7)
            }
        } else {
            _0xe0f5x28 = _0xe0f5x2f[_$_obify1[120]](_$_obify1[118], _$_obify1[119])
        }
    } else {
        if (_0xe0f5x7[_$_obify1[116]](_$_obify1[117]) > -1) {
            _0xe0f5x28 = getFirstImage(_0xe0f5x7)
        } else {
            _0xe0f5x28 = _$_obify1[115]
        }
    };
    return _0xe0f5x28
}

function getPostAuthor(_0xe0f5x21, _0xe0f5x22) {
    var _0xe0f5x26 = _0xe0f5x21[_0xe0f5x22][_$_obify1[122]][0][_$_obify1[121]][_$_obify1[104]];
    if (messages[_$_obify1[123]] == _$_obify1[124]) {
        var _0xe0f5x31 = _$_obify1[125] + _0xe0f5x26 + _$_obify1[126]
    } else {
        var _0xe0f5x31 = _$_obify1[7]
    };
    return _0xe0f5x31
}

function getPostDate(_0xe0f5x21, _0xe0f5x22) {
    var _0xe0f5x33 = _0xe0f5x21[_0xe0f5x22][_$_obify1[127]][_$_obify1[104]],
        _0xe0f5x34 = _0xe0f5x33[_$_obify1[110]](0, 4),
        _0xe0f5x35 = _0xe0f5x33[_$_obify1[110]](5, 7),
        _0xe0f5x36 = _0xe0f5x33[_$_obify1[110]](8, 10),
        _0xe0f5x37 = monthFormat[parseInt(_0xe0f5x35, 10) - 1] + _$_obify1[128] + _0xe0f5x36 + _$_obify1[129] + _0xe0f5x34;
    if (messages[_$_obify1[130]] == _$_obify1[124]) {
        var _0xe0f5x31 = _$_obify1[131] + _0xe0f5x33 + _$_obify1[132] + _0xe0f5x37 + _$_obify1[133]
    } else {
        _0xe0f5x31 = _$_obify1[7]
    };
    return _0xe0f5x31
}

function getPostMeta(_0xe0f5x39, _0xe0f5x3a) {
    if (messages[_$_obify1[123]] == _$_obify1[124] && messages[_$_obify1[130]] == _$_obify1[124]) {
        var _0xe0f5x3b = _$_obify1[134] + _0xe0f5x39 + _0xe0f5x3a + _$_obify1[48]
    } else {
        if (messages[_$_obify1[123]] == _$_obify1[124]) {
            _0xe0f5x3b = _$_obify1[134] + _0xe0f5x39 + _$_obify1[48]
        } else {
            if (messages[_$_obify1[130]] == _$_obify1[124]) {
                _0xe0f5x3b = _$_obify1[134] + _0xe0f5x3a + _$_obify1[48]
            } else {
                _0xe0f5x3b = _$_obify1[7]
            }
        }
    };
    if (messages[_$_obify1[130]] == _$_obify1[124]) {
        var _0xe0f5x3c = _$_obify1[134] + _0xe0f5x3a + _$_obify1[48]
    } else {
        _0xe0f5x3c = _$_obify1[7]
    };
    var _0xe0f5x31 = [_0xe0f5x3b, _0xe0f5x3c];
    return _0xe0f5x31
}

function getFeatMeta(_0xe0f5x9, _0xe0f5x22, _0xe0f5x3e) {
    var _0xe0f5x31;
    switch (_0xe0f5x9) {
        case _$_obify1[135]:
            ;
        case _$_obify1[136]:
            ;
        case _$_obify1[137]:
            switch (_0xe0f5x22) {
                case 0:
                    _0xe0f5x31 = _0xe0f5x3e[0];
                    break;
                default:
                    _0xe0f5x31 = _0xe0f5x3e[1];
                    break
            };
            break;
        default:
            _0xe0f5x31 = _0xe0f5x3e[0];
            break
    };
    return _0xe0f5x31
}

function getPostLabel(_0xe0f5x21, _0xe0f5x22) {
    if (_0xe0f5x21[_0xe0f5x22][_$_obify1[138]] != undefined) {
        var _0xe0f5x40 = _0xe0f5x21[_0xe0f5x22][_$_obify1[138]][0][_$_obify1[139]],
            _0xe0f5x31 = _$_obify1[140] + _0xe0f5x40 + _$_obify1[141]
    } else {
        _0xe0f5x31 = _$_obify1[7]
    };
    return _0xe0f5x31
}

function getPostComments(_0xe0f5x21, _0xe0f5x22, _0xe0f5x24) {
    var _0xe0f5x26 = _0xe0f5x21[_0xe0f5x22][_$_obify1[122]][0][_$_obify1[121]][_$_obify1[104]],
        _0xe0f5x42 = _0xe0f5x21[_0xe0f5x22][_$_obify1[122]][0][_$_obify1[144]][_$_obify1[107]][_$_obify1[120]](_$_obify1[142], _$_obify1[143]),
        _0xe0f5x37 = _0xe0f5x21[_0xe0f5x22][_$_obify1[105]][_$_obify1[104]];
    if (_0xe0f5x42[_$_obify1[35]](_$_obify1[145]) || _0xe0f5x42[_$_obify1[35]](_$_obify1[146])) {
        var _0xe0f5x28 = _$_obify1[147]
    } else {
        var _0xe0f5x28 = _0xe0f5x42
    };
    var _0xe0f5x31 = _$_obify1[148] + _0xe0f5x22 + _$_obify1[149] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x28 + _$_obify1[151] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x26 + _$_obify1[152] + _0xe0f5x37 + _$_obify1[153];
    return _0xe0f5x31
}

function getCustomStyle(_0xe0f5x44, _0xe0f5x9, _0xe0f5xd) {
    if (_0xe0f5xd != false) {
        if (_0xe0f5x9 == _$_obify1[154]) {
            var _0xe0f5x31 = _$_obify1[155] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[157] + _0xe0f5xd + _$_obify1[158] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[159] + _0xe0f5xd + _$_obify1[160]
        } else {
            _0xe0f5x31 = _$_obify1[155] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[161] + _0xe0f5xd + _$_obify1[162] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[163] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[157] + _0xe0f5xd + _$_obify1[158] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[164] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[165] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[166] + _0xe0f5xd + _$_obify1[162] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[167] + _0xe0f5xd + _$_obify1[168] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[169] + _0xe0f5xd + _$_obify1[162] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[159] + _0xe0f5xd + _$_obify1[160]
        }
    } else {
        _0xe0f5x31 = _$_obify1[7]
    };
    return _0xe0f5x31
}

function getAjax(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5xd) {
    switch (_0xe0f5x9) {
        case _$_obify1[170]:
            ;
        case _$_obify1[135]:
            ;
        case _$_obify1[171]:
            ;
        case _$_obify1[172]:
            ;
        case _$_obify1[173]:
            ;
        case _$_obify1[174]:
            ;
        case _$_obify1[175]:
            ;
        case _$_obify1[176]:
            ;
        case _$_obify1[177]:
            ;
        case _$_obify1[96]:
            ;
        case _$_obify1[194]:
            if (_0xe0f5x1e == false) {
                _0xe0f5x1e = _$_obify1[178]
            };
            var _0xe0f5x1f = getFeedUrl(_0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e);
            $[_$_obify1[250]]({
                url: _0xe0f5x1f,
                type: _$_obify1[179],
                dataType: _$_obify1[180],
                cache: true,
                beforeSend: function(_0xe0f5x46) {
                    var _0xe0f5x44 = _0xe0f5x8[_$_obify1[182]]()[_$_obify1[5]](_$_obify1[181]),
                        _0xe0f5x47 = getCustomStyle(_0xe0f5x44, _0xe0f5x9, _0xe0f5xd);
                    switch (_0xe0f5x9) {
                        case _$_obify1[135]:
                            ;
                        case _$_obify1[136]:
                            ;
                        case _$_obify1[137]:
                            ;
                        case _$_obify1[183]:
                            ;
                        case _$_obify1[189]:
                            $(_$_obify1[185])[_$_obify1[184]](_0xe0f5x47);
                            _0xe0f5x8[_$_obify1[39]](beforeLoader())[_$_obify1[182]]()[_$_obify1[11]](_$_obify1[186] + _0xe0f5x9 + _$_obify1[187] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[188]);
                            break;
                        case _$_obify1[171]:
                            ;
                        case _$_obify1[172]:
                            ;
                        case _$_obify1[175]:
                            ;
                        case _$_obify1[176]:
                            ;
                        case _$_obify1[177]:
                            $(_$_obify1[185])[_$_obify1[184]](_0xe0f5x47);
                            _0xe0f5x8[_$_obify1[39]](beforeLoader())[_$_obify1[182]]()[_$_obify1[11]](_$_obify1[186] + _0xe0f5x9 + _$_obify1[187] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[188]);
                            break;
                        case _$_obify1[173]:
                            ;
                        case _$_obify1[174]:
                            $(_$_obify1[185])[_$_obify1[184]](_0xe0f5x47);
                            _0xe0f5x8[_$_obify1[39]](beforeLoader())[_$_obify1[182]]()[_$_obify1[11]](_$_obify1[186] + _0xe0f5x9 + _$_obify1[190] + _0xe0f5x44 + _$_obify1[156] + _0xe0f5x9 + _$_obify1[188]);
                            break;
                        case _$_obify1[191]:
                            ;
                        case _$_obify1[96]:
                            ;
                        case _$_obify1[192]:
                            _0xe0f5x8[_$_obify1[39]](beforeLoader());
                            break;
                        case _$_obify1[194]:
                            _0xe0f5x8[_$_obify1[39]](beforeLoader())[_$_obify1[182]]()[_$_obify1[11]](_$_obify1[193]);
                            break
                    }
                },
                success: function(_0xe0f5x46) {
                    var _0xe0f5xe = _$_obify1[7];
                    switch (_0xe0f5x9) {
                        case _$_obify1[170]:
                            ;
                        case _$_obify1[196]:
                            _0xe0f5xe = _$_obify1[195];
                            break;
                        case _$_obify1[135]:
                            ;
                        case _$_obify1[136]:
                            ;
                        case _$_obify1[137]:
                            ;
                        case _$_obify1[183]:
                            ;
                        case _$_obify1[189]:
                            _0xe0f5xe = _$_obify1[197] + _0xe0f5x9 + _$_obify1[132];
                            break;
                        case _$_obify1[171]:
                            _0xe0f5xe = _$_obify1[198];
                            break;
                        case _$_obify1[172]:
                            _0xe0f5xe = _$_obify1[199];
                            break;
                        case _$_obify1[173]:
                            ;
                        case _$_obify1[174]:
                            _0xe0f5xe = _$_obify1[200];
                            break;
                        case _$_obify1[175]:
                            _0xe0f5xe = _$_obify1[201] + _0xe0f5x1d + _$_obify1[132];
                            break;
                        case _$_obify1[176]:
                            _0xe0f5xe = _$_obify1[202];
                            break;
                        case _$_obify1[177]:
                            _0xe0f5xe = _$_obify1[203] + _0xe0f5x1d + _$_obify1[132];
                            break;
                        case _$_obify1[191]:
                            _0xe0f5xe = _$_obify1[204];
                            break;
                        case _$_obify1[96]:
                            _0xe0f5xe = _$_obify1[205];
                            break;
                        case _$_obify1[192]:
                            _0xe0f5xe = _$_obify1[206];
                            break;
                        case _$_obify1[194]:
                            _0xe0f5xe = _$_obify1[207] + _0xe0f5x1d + _$_obify1[132];
                            break
                    };
                    var _0xe0f5x48 = _0xe0f5x46[_$_obify1[209]][_$_obify1[208]];
                    if (_0xe0f5x48 != undefined) {
                        for (var _0xe0f5x22 = 0, _0xe0f5x21 = _0xe0f5x48; _0xe0f5x22 < _0xe0f5x21[_$_obify1[28]]; _0xe0f5x22++) {
                            var _0xe0f5x24 = getPostLink(_0xe0f5x21, _0xe0f5x22),
                                _0xe0f5x49 = getPostTitle(_0xe0f5x21, _0xe0f5x22, _0xe0f5x24),
                                _0xe0f5x4a = getPostImage(_0xe0f5x21, _0xe0f5x22, _0xe0f5x24),
                                _0xe0f5x39 = getPostAuthor(_0xe0f5x21, _0xe0f5x22),
                                _0xe0f5x3a = getPostDate(_0xe0f5x21, _0xe0f5x22),
                                _0xe0f5x3e = getPostMeta(_0xe0f5x39, _0xe0f5x3a),
                                _0xe0f5x4b = getFeatMeta(_0xe0f5x9, _0xe0f5x22, _0xe0f5x3e),
                                _0xe0f5x40 = getPostLabel(_0xe0f5x21, _0xe0f5x22);
                            var _0xe0f5x4c = _$_obify1[7];
                            switch (_0xe0f5x9) {
                                case _$_obify1[170]:
                                    ;
                                case _$_obify1[196]:
                                    _0xe0f5x4c += _$_obify1[210] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[151] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                    break;
                                case _$_obify1[135]:
                                    ;
                                case _$_obify1[136]:
                                    ;
                                case _$_obify1[137]:
                                    ;
                                case _$_obify1[183]:
                                    ;
                                case _$_obify1[189]:
                                    switch (_0xe0f5x22) {
                                        case 0:
                                            _0xe0f5x4c += _$_obify1[213] + _0xe0f5x22 + _$_obify1[214] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[215] + _0xe0f5x40 + _$_obify1[216] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x4b + _$_obify1[217];
                                            break;
                                        default:
                                            _0xe0f5x4c += _$_obify1[213] + _0xe0f5x22 + _$_obify1[214] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[215] + _0xe0f5x40 + _$_obify1[216] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x4b + _$_obify1[218];
                                            break
                                    };
                                    break;
                                case _$_obify1[171]:
                                    switch (_0xe0f5x22) {
                                        case 0:
                                            _0xe0f5x4c += _$_obify1[219] + _0xe0f5x22 + _$_obify1[220] + _0xe0f5x40 + _$_obify1[221] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[222] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[0] + _$_obify1[218];
                                            break;
                                        default:
                                            _0xe0f5x4c += _$_obify1[219] + _0xe0f5x22 + _$_obify1[223] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[224] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                            break
                                    };
                                    break;
                                case _$_obify1[172]:
                                    switch (_0xe0f5x22) {
                                        case 0:
                                            _0xe0f5x4c += _$_obify1[219] + _0xe0f5x22 + _$_obify1[220] + _0xe0f5x40 + _$_obify1[221] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[222] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[0] + _$_obify1[218];
                                            break;
                                        default:
                                            _0xe0f5x4c += _$_obify1[219] + _0xe0f5x22 + _$_obify1[225] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[226] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                            break
                                    };
                                    break;
                                case _$_obify1[173]:
                                    ;
                                case _$_obify1[174]:
                                    switch (_0xe0f5x22) {
                                        case 0:
                                            _0xe0f5x4c += _$_obify1[227] + _0xe0f5x22 + _$_obify1[228] + _0xe0f5x40 + _$_obify1[221] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[222] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[0] + _$_obify1[218];
                                            break;
                                        default:
                                            _0xe0f5x4c += _$_obify1[227] + _0xe0f5x22 + _$_obify1[223] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[224] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                            break
                                    };
                                    break;
                                case _$_obify1[175]:
                                    _0xe0f5x4c += _$_obify1[229] + _0xe0f5x22 + _$_obify1[225] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[226] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                    break;
                                case _$_obify1[176]:
                                    _0xe0f5x4c += _$_obify1[229] + _0xe0f5x22 + _$_obify1[230] + _0xe0f5x40 + _$_obify1[231] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[226] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[0] + _$_obify1[212];
                                    break;
                                case _$_obify1[177]:
                                    _0xe0f5x4c += _$_obify1[232] + _0xe0f5x22 + _$_obify1[233] + _0xe0f5x40 + _$_obify1[221] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[234] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[0] + _$_obify1[218];
                                    break;
                                case _$_obify1[191]:
                                    switch (_0xe0f5x22) {
                                        case 0:
                                            _0xe0f5x4c += _$_obify1[235] + _0xe0f5x22 + _$_obify1[236] + _0xe0f5x40 + _$_obify1[221] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[222] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[0] + _$_obify1[218];
                                            break;
                                        default:
                                            _0xe0f5x4c += _$_obify1[235] + _0xe0f5x22 + _$_obify1[223] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[224] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                            break
                                    };
                                    break;
                                case _$_obify1[96]:
                                    switch (_0xe0f5x1e) {
                                        case _$_obify1[100]:
                                            var _0xe0f5x31 = getPostComments(_0xe0f5x21, _0xe0f5x22, _0xe0f5x24);
                                            _0xe0f5x4c += _0xe0f5x31;
                                            break;
                                        default:
                                            _0xe0f5x4c += _$_obify1[148] + _0xe0f5x22 + _$_obify1[223] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[224] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                            break
                                    };
                                    break;
                                case _$_obify1[192]:
                                    _0xe0f5x4c += _$_obify1[237] + _0xe0f5x22 + _$_obify1[238] + _0xe0f5x3e[1] + _$_obify1[239] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[240];
                                    break;
                                case _$_obify1[194]:
                                    _0xe0f5x4c += _$_obify1[241] + _0xe0f5x22 + _$_obify1[225] + _0xe0f5x24 + _$_obify1[150] + _0xe0f5x4a + _$_obify1[226] + _0xe0f5x24 + _$_obify1[132] + _0xe0f5x49 + _$_obify1[211] + _0xe0f5x3e[1] + _$_obify1[212];
                                    break
                            };
                            _0xe0f5xe += _0xe0f5x4c
                        }
                    } else {
                        switch (_0xe0f5x9) {
                            case _$_obify1[170]:
                                ;
                            case _$_obify1[196]:
                                _0xe0f5xe = _$_obify1[195] + msgError() + _$_obify1[242];
                                break;
                            default:
                                _0xe0f5xe = msgError();
                                break
                        }
                    };
                    switch (_0xe0f5x9) {
                        case _$_obify1[170]:
                            _0xe0f5xe += _$_obify1[242];
                            _0xe0f5x8[_$_obify1[44]](_0xe0f5xe)[_$_obify1[11]](_$_obify1[170]);
                            _0xe0f5x8[_$_obify1[27]](_$_obify1[245])[_$_obify1[5]](_$_obify1[4], function(_0xe0f5x8, _0xe0f5x4d) {
                                switch (_0xe0f5x1e) {
                                    case _$_obify1[95]:
                                        _0xe0f5x4d = _0xe0f5x4d[_$_obify1[120]](_0xe0f5x4d, _$_obify1[243]);
                                        break;
                                    default:
                                        _0xe0f5x4d = _0xe0f5x4d[_$_obify1[120]](_0xe0f5x4d, _$_obify1[244] + _0xe0f5x1e);
                                        break
                                };
                                return _0xe0f5x4d
                            });
                            break;
                        case _$_obify1[135]:
                            ;
                        case _$_obify1[136]:
                            ;
                        case _$_obify1[137]:
                            ;
                        case _$_obify1[183]:
                            ;
                        case _$_obify1[189]:
                            _0xe0f5xe += _$_obify1[246];
                            _0xe0f5x8[_$_obify1[39]](_0xe0f5xe);
                            break;
                        default:
                            _0xe0f5xe += _$_obify1[48];
                            _0xe0f5x8[_$_obify1[39]](_0xe0f5xe);
                            break
                    };
                    _0xe0f5x8[_$_obify1[27]](_$_obify1[248])[_$_obify1[247]]()
                },
                error: function() {
                    switch (_0xe0f5x9) {
                        case _$_obify1[170]:
                            ;
                        case _$_obify1[196]:
                            _0xe0f5x8[_$_obify1[44]](_$_obify1[249] + msgError() + _$_obify1[242]);
                            break;
                        default:
                            _0xe0f5x8[_$_obify1[39]](msgError());
                            break
                    }
                }
            })
    }
}

function ajaxMega(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f) {
    if (_0xe0f5x4f[_$_obify1[35]](_$_obify1[251])) {
        if (_0xe0f5x9 == _$_obify1[170]) {
            return getAjax(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e)
        } else {
            _0xe0f5x8[_$_obify1[44]](_$_obify1[195] + msgError() + _$_obify1[242])
        }
    }
}

function ajaxFeatured(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f, _0xe0f5xd) {
    if (_0xe0f5x4f[_$_obify1[35]](_$_obify1[252])) {
        if (_0xe0f5x9 == _$_obify1[135]) {
            return getAjax(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5xd)
        } else {
            _0xe0f5x8[_$_obify1[39]](beforeLoader())[_$_obify1[182]]()[_$_obify1[11]](_$_obify1[193]);
            setTimeout(function() {
                _0xe0f5x8[_$_obify1[39]](msgError())
            }, 500)
        }
    }
}

function ajaxBlock(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f, _0xe0f5xd) {
    if (_0xe0f5x4f[_$_obify1[35]](_$_obify1[253])) {
        if (_0xe0f5x9 == _$_obify1[171] || _0xe0f5x9 == _$_obify1[172] || _0xe0f5x9 == _$_obify1[173] || _0xe0f5x9 == _$_obify1[174] || _0xe0f5x9 == _$_obify1[175] || _0xe0f5x9 == _$_obify1[176] || _0xe0f5x9 == _$_obify1[177]) {
            var _0xe0f5x52 = viewAllText,
                _0xe0f5x53 = _$_obify1[7];
            if (_0xe0f5x52 != _$_obify1[7]) {
                _0xe0f5x53 = _0xe0f5x52
            } else {
                _0xe0f5x53 = messages[_$_obify1[254]]
            };
            _0xe0f5x8[_$_obify1[182]]()[_$_obify1[27]](_$_obify1[257])[_$_obify1[44]](_$_obify1[255] + _0xe0f5x1e + _$_obify1[132] + _0xe0f5x53 + _$_obify1[256]);
            return getAjax(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5xd)
        } else {
            _0xe0f5x8[_$_obify1[39]](msgError())[_$_obify1[182]]()[_$_obify1[11]](_$_obify1[193])
        }
    }
}

function ajaxWidget(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f) {
    if (_0xe0f5x4f[_$_obify1[35]](_$_obify1[258])) {
        if (_0xe0f5x9 == _$_obify1[96]) {
            return getAjax(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e)
        } else {
            _0xe0f5x8[_$_obify1[39]](msgError())
        }
    }
}

function ajaxRelated(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f) {
    if (_0xe0f5x4f[_$_obify1[35]](_$_obify1[259])) {
        return getAjax(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e)
    }
}

function shortCodeIfy(_0xe0f5x57, _0xe0f5x58, _0xe0f5x33) {
    var _0xe0f5x34 = _0xe0f5x57[_$_obify1[32]](_$_obify1[260]),
        _0xe0f5x42 = /[^{\}]+(?=})/g;
    for (var _0xe0f5x22 = 0; _0xe0f5x22 < _0xe0f5x34[_$_obify1[28]]; _0xe0f5x22++) {
        var _0xe0f5x35 = _0xe0f5x34[_0xe0f5x22][_$_obify1[32]](_$_obify1[261]);
        if (_0xe0f5x35[0][_$_obify1[2]]() == _0xe0f5x58) {
            _0xe0f5x33 = _0xe0f5x35[1];
            if (_0xe0f5x33[_$_obify1[35]](_0xe0f5x42) != null) {
                return String(_0xe0f5x33[_$_obify1[35]](_0xe0f5x42))[_$_obify1[2]]()
            } else {
                return false
            }
        }
    };
    return false
}
$(_$_obify1[266])[_$_obify1[14]](function(_0xe0f5x9, _0xe0f5x1e) {
    var _0xe0f5x59 = $(this),
        _0xe0f5x8 = _0xe0f5x59,
        _0xe0f5x5a = _0xe0f5x59[_$_obify1[27]](_$_obify1[262]),
        _0xe0f5xb = _0xe0f5x5a[_$_obify1[5]](_$_obify1[4])[_$_obify1[2]](),
        _0xe0f5x4f = _0xe0f5xb[_$_obify1[3]]();
    _0xe0f5x9 = shortCodeIfy(_0xe0f5xb, _$_obify1[263]);
    _0xe0f5x1e = shortCodeIfy(_0xe0f5xb, _$_obify1[264]);
    if (_0xe0f5x4f[_$_obify1[35]](_$_obify1[251])) {
        _0xe0f5x8[_$_obify1[11]](_$_obify1[265])
    };
    ajaxMega(_0xe0f5x8, _0xe0f5x9, 5, _0xe0f5x1e, _0xe0f5x4f)
});
$(_$_obify1[268])[_$_obify1[14]](function(_0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5xd) {
    var _0xe0f5x8 = $(this),
        _0xe0f5xb = _0xe0f5x8[_$_obify1[8]]()[_$_obify1[2]](),
        _0xe0f5x4f = _0xe0f5xb[_$_obify1[3]]();
    _0xe0f5x9 = shortCodeIfy(_0xe0f5xb, _$_obify1[263]);
    _0xe0f5x1e = shortCodeIfy(_0xe0f5xb, _$_obify1[264]);
    _0xe0f5xd = shortCodeIfy(_0xe0f5xb, _$_obify1[267]);
    switch (_0xe0f5x9) {
        case _$_obify1[136]:
            _0xe0f5x1d = 4;
            break;
        case _$_obify1[137]:
            _0xe0f5x1d = 5;
            break;
        case _$_obify1[189]:
            _0xe0f5x1d = 2;
            break;
        default:
            _0xe0f5x1d = 3;
            break
    };
    ajaxFeatured(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f, _0xe0f5xd)
});
$(_$_obify1[270])[_$_obify1[14]](function(_0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5xd) {
    var _0xe0f5x8 = $(this),
        _0xe0f5xb = _0xe0f5x8[_$_obify1[8]]()[_$_obify1[2]](),
        _0xe0f5x4f = _0xe0f5xb[_$_obify1[3]]();
    _0xe0f5x9 = shortCodeIfy(_0xe0f5xb, _$_obify1[263]);
    _0xe0f5x1d = shortCodeIfy(_0xe0f5xb, _$_obify1[269]);
    _0xe0f5x1e = shortCodeIfy(_0xe0f5xb, _$_obify1[264]);
    _0xe0f5xd = shortCodeIfy(_0xe0f5xb, _$_obify1[267]);
    ajaxBlock(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f, _0xe0f5xd)
});
$(_$_obify1[271])[_$_obify1[14]](function(_0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e) {
    var _0xe0f5x8 = $(this),
        _0xe0f5xb = _0xe0f5x8[_$_obify1[8]]()[_$_obify1[2]](),
        _0xe0f5x4f = _0xe0f5xb[_$_obify1[3]]();
    _0xe0f5x9 = shortCodeIfy(_0xe0f5xb, _$_obify1[263]);
    _0xe0f5x1d = shortCodeIfy(_0xe0f5xb, _$_obify1[269]);
    _0xe0f5x1e = shortCodeIfy(_0xe0f5xb, _$_obify1[264]);
    ajaxWidget(_0xe0f5x8, _0xe0f5x9, _0xe0f5x1d, _0xe0f5x1e, _0xe0f5x4f)
});
$(_$_obify1[274])[_$_obify1[14]](function() {
    var _0xe0f5x8 = $(this),
        _0xe0f5x1e = _0xe0f5x8[_$_obify1[27]](_$_obify1[273])[_$_obify1[5]](_$_obify1[272]),
        _0xe0f5x1d = relatedPostsNum;
    ajaxRelated(_0xe0f5x8, _$_obify1[194], _0xe0f5x1d, _0xe0f5x1e, _$_obify1[259])
});

function beautiAvatar(_0xe0f5x57) {
    $(_0xe0f5x57)[_$_obify1[5]](_$_obify1[107], function(_0xe0f5x8, _0xe0f5x22) {
        _0xe0f5x22 = _0xe0f5x22[_$_obify1[120]](_$_obify1[275], _$_obify1[276]);
        _0xe0f5x22 = _0xe0f5x22[_$_obify1[120]](_$_obify1[145], _$_obify1[276]);
        return _0xe0f5x22
    })
}
$(_$_obify1[286])[_$_obify1[14]](function() {
    var _0xe0f5x8 = $(this),
        _0xe0f5x5c = commentsSystem;
    switch (_0xe0f5x5c) {
        case _$_obify1[277]:
            ;
        case _$_obify1[278]:
            ;
        case _$_obify1[282]:
            _0xe0f5x8[_$_obify1[11]](_$_obify1[279])[_$_obify1[90]]();
            $(_$_obify1[280])[_$_obify1[11]](_$_obify1[90]);
            beautiAvatar(_$_obify1[281]);
            break;
        case _$_obify1[283]:
            _0xe0f5x8[_$_obify1[283]]();
            break;
        default:
            _0xe0f5x8[_$_obify1[11]](_$_obify1[279])[_$_obify1[90]]();
            $(_$_obify1[280])[_$_obify1[11]](_$_obify1[90]);
            beautiAvatar(_$_obify1[281]);
            break
    };
    var _0xe0f5x5d = _0xe0f5x8[_$_obify1[27]](_$_obify1[284]),
        _0xe0f5x7 = _0xe0f5x8[_$_obify1[27]](_$_obify1[285]);
    _0xe0f5x5d[_$_obify1[22]](_$_obify1[18], function() {
        _0xe0f5x7[_$_obify1[90]]()
    });
    _0xe0f5x7[_$_obify1[22]](_$_obify1[18], function() {
        _0xe0f5x7[_$_obify1[283]]()
    })
});
$(function() {
    $(_$_obify1[287])[_$_obify1[247]]();
    $(_$_obify1[318])[_$_obify1[14]](function() {
        var _0xe0f5x2 = $(this),
            _0xe0f5x3 = $(_$_obify1[289])[_$_obify1[288]]();
        _0xe0f5x3[_$_obify1[5]](_$_obify1[181], _$_obify1[290]);
        _0xe0f5x3[_$_obify1[27]](_$_obify1[292])[_$_obify1[291]]();
        _0xe0f5x3[_$_obify1[27]](_$_obify1[294])[_$_obify1[14]](function() {
            var _0xe0f5x2a = $(this),
                _0xe0f5x29 = _0xe0f5x2a[_$_obify1[5]](_$_obify1[293])[_$_obify1[2]]();
            _0xe0f5x2a[_$_obify1[8]](_0xe0f5x29)
        });
        _0xe0f5x3[_$_obify1[27]](_$_obify1[298])[_$_obify1[14]](function() {
            var _0xe0f5x5e = $(this);
            _0xe0f5x5e[_$_obify1[42]](_0xe0f5x5e[_$_obify1[27]](_$_obify1[297])[_$_obify1[5]](_$_obify1[295], _$_obify1[296]))
        });
        _0xe0f5x3[_$_obify1[27]](_$_obify1[299])[_$_obify1[14]](function(_0xe0f5x5f, _0xe0f5x60) {
            var _0xe0f5x2a = $(this),
                _0xe0f5x29 = _0xe0f5x2a[_$_obify1[5]](_$_obify1[4])[_$_obify1[2]](),
                _0xe0f5x3 = _0xe0f5x29[_$_obify1[3]]();
            if (_0xe0f5x3[_$_obify1[35]](_$_obify1[251])) {
                _0xe0f5x5f = shortCodeIfy(_0xe0f5x29, _$_obify1[264]);
                _0xe0f5x5f == _$_obify1[95] ? _0xe0f5x60 = _$_obify1[243] : _0xe0f5x60 = _$_obify1[244] + _0xe0f5x5f;
                _0xe0f5x2a[_$_obify1[5]](_$_obify1[4], _0xe0f5x60)
            }
        });
        _0xe0f5x3[_$_obify1[27]](_$_obify1[300])[_$_obify1[14]](function() {
            var _0xe0f5x2a = $(this),
                _0xe0f5x5f = _0xe0f5x2a[_$_obify1[8]]()[_$_obify1[2]]();
            _0xe0f5x2a[_$_obify1[5]](_$_obify1[4], _$_obify1[244] + _0xe0f5x5f)
        });
        _0xe0f5x3[_$_obify1[301]](_0xe0f5x2);
        $(_$_obify1[303])[_$_obify1[22]](_$_obify1[18], function() {
            $(_$_obify1[21])[_$_obify1[20]](_$_obify1[302])
        });
        $(_$_obify1[305])[_$_obify1[44]](_$_obify1[304]);
        $(_$_obify1[307])[_$_obify1[27]](_$_obify1[306])[_$_obify1[291]]();
        $(_$_obify1[308])[_$_obify1[44]](_$_obify1[304]);
        $(_$_obify1[317])[_$_obify1[22]](_$_obify1[18], function(_0xe0f5x8) {
            if ($(this)[_$_obify1[182]]()[_$_obify1[310]](_$_obify1[309])) {
                _0xe0f5x8[_$_obify1[311]]();
                if (!$(this)[_$_obify1[182]]()[_$_obify1[310]](_$_obify1[90])) {
                    $(this)[_$_obify1[182]]()[_$_obify1[11]](_$_obify1[90])[_$_obify1[314]](_$_obify1[313])[_$_obify1[312]](170)
                } else {
                    $(this)[_$_obify1[182]]()[_$_obify1[316]](_$_obify1[90])[_$_obify1[27]](_$_obify1[315])[_$_obify1[312]](170)
                }
            }
        })
    });
    $(_$_obify1[320])[_$_obify1[14]](function() {
        var _0xe0f5x2 = $(this),
            _0xe0f5x5f = $(_$_obify1[319])[_$_obify1[288]]();
        _0xe0f5x5f[_$_obify1[301]](_0xe0f5x2)
    });
    $(_$_obify1[322])[_$_obify1[14]](function() {
        var _0xe0f5x2 = $(this),
            _0xe0f5x5f = $(_$_obify1[321])[_$_obify1[288]]();
        _0xe0f5x5f[_$_obify1[301]](_0xe0f5x2)
    });
    $(_$_obify1[329])[_$_obify1[14]](function() {
        var _0xe0f5x8 = $(this);
        if (fixedMenu == true) {
            if (_0xe0f5x8[_$_obify1[28]] > 0) {
                var _0xe0f5x61 = $(document)[_$_obify1[323]](),
                    _0xe0f5x62 = _0xe0f5x8[_$_obify1[325]]()[_$_obify1[324]],
                    _0xe0f5x63 = _0xe0f5x8[_$_obify1[70]](),
                    _0xe0f5x37 = (_0xe0f5x62 + _0xe0f5x63) + 50;
                $(window)[_$_obify1[328]](function() {
                    var _0xe0f5x26 = $(document)[_$_obify1[323]](),
                        _0xe0f5x35 = $(_$_obify1[326])[_$_obify1[325]]()[_$_obify1[324]],
                        _0xe0f5x36 = (_0xe0f5x35 - _0xe0f5x63);
                    if (_0xe0f5x26 < _0xe0f5x36) {
                        if (_0xe0f5x26 > _0xe0f5x37) {
                            _0xe0f5x8[_$_obify1[11]](_$_obify1[327])
                        } else {
                            if (_0xe0f5x26 < _0xe0f5x62) {
                                _0xe0f5x8[_$_obify1[316]](_$_obify1[327])
                            }
                        };
                        if (_0xe0f5x26 > _0xe0f5x61) {
                            _0xe0f5x8[_$_obify1[316]](_$_obify1[90])
                        } else {
                            _0xe0f5x8[_$_obify1[11]](_$_obify1[90])
                        };
                        _0xe0f5x61 = $(document)[_$_obify1[323]]()
                    }
                })
            }
        }
    });
    $(_$_obify1[330])[_$_obify1[14]](function() {
        var _0xe0f5x8 = $(this);
        if (fixedMenu == true) {
            if (_0xe0f5x8[_$_obify1[28]] > 0) {
                var _0xe0f5x61 = $(document)[_$_obify1[323]](),
                    _0xe0f5x62 = _0xe0f5x8[_$_obify1[325]]()[_$_obify1[324]],
                    _0xe0f5x63 = _0xe0f5x8[_$_obify1[70]](),
                    _0xe0f5x37 = (_0xe0f5x62 + _0xe0f5x63);
                $(window)[_$_obify1[328]](function() {
                    var _0xe0f5x26 = $(document)[_$_obify1[323]](),
                        _0xe0f5x35 = $(_$_obify1[326])[_$_obify1[325]]()[_$_obify1[324]],
                        _0xe0f5x36 = (_0xe0f5x35 - _0xe0f5x63);
                    if (_0xe0f5x26 < _0xe0f5x36) {
                        if (_0xe0f5x26 > _0xe0f5x37) {
                            _0xe0f5x8[_$_obify1[11]](_$_obify1[327])
                        } else {
                            if (_0xe0f5x26 <= 0) {
                                _0xe0f5x8[_$_obify1[316]](_$_obify1[327])
                            }
                        };
                        if (_0xe0f5x26 > _0xe0f5x61) {
                            _0xe0f5x8[_$_obify1[316]](_$_obify1[90])
                        } else {
                            _0xe0f5x8[_$_obify1[11]](_$_obify1[90])
                        };
                        _0xe0f5x61 = $(document)[_$_obify1[323]]()
                    }
                })
            }
        }
    });
    $(_$_obify1[332])[_$_obify1[14]](function(_0xe0f5x64) {
        if (fixedSidebar == true) {
            fixedMenu == true ? _0xe0f5x64 = 75 : _0xe0f5x64 = 25;
            $(this)[_$_obify1[331]]({
                additionalMarginTop: _0xe0f5x64,
                additionalMarginBottom: 25
            })
        }
    });
    $(_$_obify1[336])[_$_obify1[14]](function() {
        var _0xe0f5x2 = $(this),
            _0xe0f5x65 = _0xe0f5x2[_$_obify1[5]](_$_obify1[107]);
        if (_0xe0f5x65[_$_obify1[35]](_$_obify1[333])) {
            _0xe0f5x2[_$_obify1[335]](_$_obify1[334])
        }
    });
    $(_$_obify1[340])[_$_obify1[14]](function() {
        var _0xe0f5x2 = $(this);
        _0xe0f5x2[_$_obify1[338]](/(https:\/\/\S+(\.png|\.jpeg|\.jpg|\.gif))/g, _$_obify1[337]);
        _0xe0f5x2[_$_obify1[338]](/(?:https:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)?(.+)/g, _$_obify1[339])
    });
    $(_$_obify1[345])[_$_obify1[5]](_$_obify1[4], _$_obify1[344])[_$_obify1[8]](_$_obify1[343])[_$_obify1[5]](_$_obify1[341], _$_obify1[342]);
   
    $(_$_obify1[349])[_$_obify1[14]](function() {
        var _0xe0f5x8 = $(this),
            _0xe0f5x66 = _0xe0f5x8[_$_obify1[68]](_$_obify1[348]);
        if (_0xe0f5x66) {
            $(_$_obify1[349])[_$_obify1[90]]()
        };
        $(_$_obify1[349])[_$_obify1[22]](_$_obify1[18], function(_0xe0f5x57) {
            $(_$_obify1[349])[_$_obify1[283]]();
            $[_$_obify1[250]]({
                url: _0xe0f5x66,
                success: function(_0xe0f5x46) {
                    var _0xe0f5x67 = $(_0xe0f5x46)[_$_obify1[27]](_$_obify1[350]);
                    _0xe0f5x67[_$_obify1[27]](_$_obify1[352])[_$_obify1[11]](_$_obify1[351]);
                    $(_$_obify1[350])[_$_obify1[44]](_0xe0f5x67[_$_obify1[39]]());
                    _0xe0f5x66 = $(_0xe0f5x46)[_$_obify1[27]](_$_obify1[349])[_$_obify1[68]](_$_obify1[348]);
                    if (_0xe0f5x66) {
                        $(_$_obify1[349])[_$_obify1[90]]()
                    } else {
                        $(_$_obify1[349])[_$_obify1[283]]();
                        $(_$_obify1[353])[_$_obify1[11]](_$_obify1[90])
                    };
                    $(_$_obify1[354])[_$_obify1[247]]();
                    $(_$_obify1[355])[_$_obify1[14]](function() {
                        if (fixedSidebar == true) {
                            $(this)[_$_obify1[331]]()
                        }
                    })
                },
                beforeSend: function() {
                    $(_$_obify1[356])[_$_obify1[90]]()
                },
                complete: function() {
                    $(_$_obify1[356])[_$_obify1[283]]()
                }
            });
            _0xe0f5x57[_$_obify1[311]]()
        })
    });
    $(_$_obify1[362])[_$_obify1[14]](function() {
        var _0xe0f5x2 = $(this);
        $(window)[_$_obify1[22]](_$_obify1[328], function() {
            $(this)[_$_obify1[323]]() >= 100 ? _0xe0f5x2[_$_obify1[357]](250) : _0xe0f5x2[_$_obify1[358]](250);
            _0xe0f5x2[_$_obify1[325]]()[_$_obify1[324]] >= $(_$_obify1[326])[_$_obify1[325]]()[_$_obify1[324]] - 32 ? _0xe0f5x2[_$_obify1[11]](_$_obify1[359]) : _0xe0f5x2[_$_obify1[316]](_$_obify1[359])
        }), _0xe0f5x2[_$_obify1[22]](_$_obify1[18], function() {
            $(_$_obify1[361])[_$_obify1[360]]({
                scrollTop: 0
            }, 500)
        })
    })
})
