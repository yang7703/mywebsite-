/* ============================================================
   全站共享导航栏 + 页脚
   用法：页面中放 <header id="site-header"></header> 和
   <footer id="site-footer"></footer> 两个空标签，此脚本自动填充内容。
   在 <body data-page="xxx"> 设置当前页面标识，用于导航高亮。
   新增工具页面时，只需要在 NAV_ITEMS 里加一行即可全站同步。
============================================================= */
(function(){
"use strict";

var NAV_ITEMS=[
  {key:"home",  name:"首页",       href:"/"},
  {key:"bazi",  name:"八字排盘",   href:"/bazi/"},
  {key:"wuxing",name:"五行查询",   href:"/wuxing/"},
  {key:"huangli",name:"老黄历",    href:"/huangli/"},
  {key:"zeri",  name:"择吉日",     href:"/zeri/"},
  {key:"shengxiao",name:"生肖运势",href:"/shengxiao/"},
  {key:"peidui",name:"属相配对",   href:"/peidui/"},
  {key:"jieqi", name:"二十四节气", href:"/jieqi/"},
  {key:"qiming",name:"起名字",     href:"/qiming/"},
  {key:"rili",  name:"农历公历互转",href:"/rili-zhuanhuan/"},
  {key:"blog",  name:"博客",       href:"/blog/"}
];

var currentPage=document.body.getAttribute("data-page")||"";

function buildHeader(){
  var linksHtml=NAV_ITEMS.map(function(item){
    var activeCls=(item.key===currentPage)?" active":"";
    return '<a href="'+item.href+'" class="'+activeCls.trim()+'">'+item.name+'</a>';
  }).join("");

  var el=document.getElementById("site-header");
  if(!el)return;
  el.innerHTML=
    '<div class="nav-wrap">'+
      '<a href="/" class="nav-logo"><span class="dot">玄</span>玄机黄历</a>'+
      '<nav><ul class="nav-links" id="nav-links-list">'+linksHtml+'</ul></nav>'+
      '<button class="nav-toggle" id="nav-toggle" aria-label="菜单">&#9776;</button>'+
    '</div>';

  var toggle=document.getElementById("nav-toggle");
  var list=document.getElementById("nav-links-list");
  if(toggle&&list){
    toggle.addEventListener("click",function(){
      list.classList.toggle("open");
    });
  }
}

function buildFooter(){
  var el=document.getElementById("site-footer");
  if(!el)return;
  el.innerHTML=
    '<div class="footer-wrap">'+
      '<div class="footer-col">'+
        '<h4>命理工具</h4>'+
        '<a href="/bazi/">八字排盘</a>'+
        '<a href="/wuxing/">五行查询</a>'+
        '<a href="/huangli/">老黄历</a>'+
        '<a href="/zeri/">择吉日查询</a>'+
      '</div>'+
      '<div class="footer-col">'+
        '<h4>生肖工具</h4>'+
        '<a href="/shengxiao/">生肖运势</a>'+
        '<a href="/peidui/">属相配对</a>'+
        '<a href="/jieqi/">二十四节气</a>'+
        '<a href="/rili-zhuanhuan/">农历公历互转</a>'+
      '</div>'+
      '<div class="footer-col">'+
        '<h4>更多</h4>'+
        '<a href="/qiming/">起名字</a>'+
        '<a href="/blog/">命理博客</a>'+
      '</div>'+
    '</div>'+
    '<div class="footer-disclaimer">本站所有命理、运势、择日相关内容均基于中国传统文化整理，仅供文化了解与娱乐参考，不构成任何决策依据，请理性看待。</div>'+
    '<div class="footer-copyright">© '+new Date().getFullYear()+' 玄机黄历 · 保留所有权利</div>';
}

buildHeader();
buildFooter();

})();
