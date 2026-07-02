/* ============================================================
   玄机黄历 - 命理核心算法库（公用）
   包含：农历公历互转、干支纪日、廿四节气、八字排盘、
   五行/十神计算、十二值神建除、生肖配对关系判断
   本文件不含任何UI逻辑，仅提供纯计算函数，供各工具页调用。
============================================================= */
(function(global){
"use strict";

var Gan=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
var Zhi=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
var Animals=["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
var GanWuxing={甲:"木",乙:"木",丙:"火",丁:"火",戊:"土",己:"土",庚:"金",辛:"金",壬:"水",癸:"水"};
var ZhiWuxing={子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土",申:"金",酉:"金",戌:"土",亥:"水"};
var ZhiHidden={ // 地支藏干
  子:["癸"],丑:["己","癸","辛"],寅:["甲","丙","戊"],卯:["乙"],
  辰:["戊","乙","癸"],巳:["丙","庚","戊"],午:["丁","己"],未:["己","丁","乙"],
  申:["庚","壬","戊"],酉:["辛"],戌:["戊","辛","丁"],亥:["壬","甲"]
};
var GanYang={甲:1,丙:1,戊:1,庚:1,壬:1,乙:0,丁:0,己:0,辛:0,癸:0};
var nStr1=["日","一","二","三","四","五","六","七","八","九","十"];
var nStr2=["初","十","廿","卅"];

/* ---------- 农历数据表（1900-2100） ---------- */
var lunarInfo=[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
0x0d520];

function lYearDays(y){var i,sum=348;for(i=0x8000;i>0x8;i>>=1){sum+=(lunarInfo[y-1900]&i)?1:0;}return sum+leapDays(y);}
function leapMonth(y){return lunarInfo[y-1900]&0xf;}
function leapDays(y){if(leapMonth(y)){return (lunarInfo[y-1900]&0x10000)?30:29;}return 0;}
function monthDays(y,m){if(m>12||m<1)return -1;return (lunarInfo[y-1900]&(0x10000>>m))?30:29;}
function toChinaMonth(m){var s=nStr1[m]+"月";if(m===1)s="正月";if(m===11)s="冬月";if(m===12)s="腊月";return s;}
function toChinaDay(d){var s;if(d===10)s="初十";else if(d===20)s="二十";else if(d===30)s="三十";else s=nStr2[Math.floor(d/10)]+nStr1[d%10];return s;}

function solar2lunar(y,m,d){
  if(y<1900||y>2100)return null;
  var objDate=new Date(y,m-1,d);
  var baseDate=new Date(1900,0,31);
  var offset=Math.floor((objDate-baseDate)/86400000);
  var temp=0,i;
  for(i=1900;i<2101&&offset>0;i++){temp=lYearDays(i);offset-=temp;}
  if(offset<0){offset+=temp;i--;}
  var isLeap=false,lYear=i,leap=leapMonth(i),lMonth=1,lDay;
  for(i=1;i<13&&offset>0;i++){
    if(leap>0&&i===(leap+1)&&!isLeap){--i;isLeap=true;temp=leapDays(lYear);}
    else{temp=monthDays(lYear,i);}
    if(isLeap&&i===(leap+1))isLeap=false;
    offset-=temp;
  }
  if(offset===0&&leap>0&&i===leap+1){
    if(isLeap){isLeap=false;}else{isLeap=true;--i;}
  }
  if(offset<0){offset+=temp;--i;}
  lMonth=i;lDay=offset+1;
  var gzY=(lYear-4)%60;if(gzY<0)gzY+=60;
  var animalIdx=(lYear-4)%12;if(animalIdx<0)animalIdx+=12;
  return{lYear:lYear,lMonth:lMonth,lDay:lDay,isLeap:isLeap,
    ganZhiYear:Gan[gzY%10]+Zhi[gzY%12],animal:Animals[animalIdx],
    lMonthCn:(isLeap?"闰":"")+toChinaMonth(lMonth),lDayCn:toChinaDay(lDay)};
}

function lunar2solar(y,m,isLeap,d){
  if(y<1900||y>2100)return null;
  var offset=0,i;
  for(i=1900;i<y;i++){offset+=lYearDays(i);}
  var leap=leapMonth(y),isAdd=false;
  for(i=1;i<m;i++){
    if(!isAdd){ if(leap<=i&&leap>0){offset+=leapDays(y);isAdd=true;} }
    offset+=monthDays(y,i);
  }
  if(isLeap){offset+=monthDays(y,m);}
  var stmap=Date.UTC(1900,0,31,0,0,0);
  var calObj=new Date((offset+d-1)*86400000+stmap);
  return{y:calObj.getUTCFullYear(),m:calObj.getUTCMonth()+1,d:calObj.getUTCDate()};
}

/* ---------- 儒略日 与 干支纪日 ---------- */
function toJDN(y,m,d){
  var a=Math.floor((14-m)/12);
  var y2=y+4800-a;
  var m2=m+12*a-3;
  return d+Math.floor((153*m2+2)/5)+365*y2+Math.floor(y2/4)-Math.floor(y2/100)+Math.floor(y2/400)-32045;
}
function getDayGanZhi(y,m,d){
  var jdn=toJDN(y,m,d);
  var ganIdx=((jdn+9)%10+10)%10;
  var zhiIdx=((jdn+1)%12+12)%12;
  return{gan:Gan[ganIdx],zhi:Zhi[zhiIdx],ganIdx:ganIdx,zhiIdx:zhiIdx};
}

/* ---------- 廿四节气（1900-2100，分钟级近似精度） ---------- */
var sTermInfo=[0,21208,42467,63836,85337,107014,128867,150921,173149,195551,
218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,
440795,462224,483532,504758];
var TERM_NAMES=["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满",
"芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降",
"立冬","小雪","大雪","冬至"];
function getTermDate(y,n){
  // 返回 UTC 时刻的 Date 对象
  var offMs=31556925974.7*(y-1900)+sTermInfo[n]*60000;
  return new Date(Date.UTC(1900,0,6,2,5,0)+offMs);
}
function getTermBeijing(y,n){
  // 返回换算为北京时间(UTC+8)的 {y,m,d,hh,mm} 挂钟时间
  var t=getTermDate(y,n).getTime()+8*3600*1000;
  var dt=new Date(t);
  return{y:dt.getUTCFullYear(),m:dt.getUTCMonth()+1,d:dt.getUTCDate(),hh:dt.getUTCHours(),mm:dt.getUTCMinutes()};
}
function getYearTerms(y){
  // 返回该公历年全部24节气（北京时间）
  var list=[];
  for(var n=0;n<24;n++){
    var bj=getTermBeijing(y,n);
    list.push({name:TERM_NAMES[n],idx:n,y:bj.y,m:bj.m,d:bj.d,hh:bj.hh,mm:bj.mm});
  }
  return list;
}

/* ---------- 月支边界（节气定月，用于八字月柱/年柱） ----------
   12个"节"对应的月支起点：小寒->丑 立春->寅 惊蛰->卯 清明->辰
   立夏->巳 芒种->午 小暑->未 立秋->申 白露->酉 寒露->戌 立冬->亥 大雪->子
*/
var JIE_ZHI_SEQ=[
  {idx:0,zhi:"丑"},{idx:2,zhi:"寅"},{idx:4,zhi:"卯"},{idx:6,zhi:"辰"},
  {idx:8,zhi:"巳"},{idx:10,zhi:"午"},{idx:12,zhi:"未"},{idx:14,zhi:"申"},
  {idx:16,zhi:"酉"},{idx:18,zhi:"戌"},{idx:20,zhi:"亥"},{idx:22,zhi:"子"}
];
function beijingWallToUTCms(y,m,d,hh,mm){
  return Date.UTC(y,m-1,d,hh,mm,0)-8*3600*1000;
}
function getMonthZhiAndYearBoundary(y,m,d,hh,mm){
  var targetUTC=beijingWallToUTCms(y,m,d,hh,mm);
  // 构造从上一年"大雪"到本年"大雪"的13个边界点
  var bounds=[];
  var prevDaxue=getTermBeijing(y-1,22);
  bounds.push({t:beijingWallToUTCms(prevDaxue.y,prevDaxue.m,prevDaxue.d,prevDaxue.hh,prevDaxue.mm),zhi:"子"});
  for(var i=0;i<JIE_ZHI_SEQ.length;i++){
    var tb=getTermBeijing(y,JIE_ZHI_SEQ[i].idx);
    bounds.push({t:beijingWallToUTCms(tb.y,tb.m,tb.d,tb.hh,tb.mm),zhi:JIE_ZHI_SEQ[i].zhi});
  }
  var monthZhi="子";
  for(var j=0;j<bounds.length;j++){
    if(targetUTC>=bounds[j].t)monthZhi=bounds[j].zhi;
  }
  // 立春时刻决定八字年（年柱以立春为界，而非农历正月初一/公历1月1日）
  var lichun=getTermBeijing(y,2);
  var lichunUTC=beijingWallToUTCms(lichun.y,lichun.m,lichun.d,lichun.hh,lichun.mm);
  var baziYear=(targetUTC>=lichunUTC)?y:y-1;
  return{monthZhi:monthZhi,baziYear:baziYear};
}

/* ---------- 八字排盘 ---------- */
function yearGanZhiByYear(y){
  var idx=(y-4)%60;if(idx<0)idx+=60;
  return{gan:Gan[idx%10],zhi:Zhi[idx%12],ganIdx:idx%10,zhiIdx:idx%12};
}
var WU_HU_DUN={ // 年干起月干（五虎遁）：寅月天干
  "甲":"丙","己":"丙","乙":"戊","庚":"戊","丙":"庚","辛":"庚","丁":"壬","壬":"壬","戊":"甲","癸":"甲"
};
var WU_SHU_DUN={ // 日干起时干（五鼠遁）：子时天干
  "甲":"甲","己":"甲","乙":"丙","庚":"丙","丙":"戊","辛":"戊","丁":"庚","壬":"庚","戊":"壬","癸":"壬"
};
var MONTH_ZHI_ORDER=["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"];
var HOUR_ZHI_ORDER=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

function getHourZhi(hh){
  var h=((hh%24)+24)%24;
  if(h===23||h===0)return"子";
  var idx=Math.floor((h+1)/2);
  return HOUR_ZHI_ORDER[idx];
}

function getBazi(y,m,d,hh,mm){
  hh=(hh===undefined||hh===null||isNaN(hh))?-1:hh; // -1 表示时辰未知
  mm=mm||0;
  var mzInfo=getMonthZhiAndYearBoundary(y,m,d,hh<0?12:hh,mm); // 时辰未知时用正午估算月/年边界，误差可忽略
  var yGZ=yearGanZhiByYear(mzInfo.baziYear);
  var monthZhi=mzInfo.monthZhi;
  var monthZhiPos=MONTH_ZHI_ORDER.indexOf(monthZhi); // 0=寅
  var yinGan=WU_HU_DUN[yGZ.gan];
  var yinGanIdx=Gan.indexOf(yinGan);
  var monthGanIdx=(yinGanIdx+monthZhiPos)%10;
  var monthGan=Gan[monthGanIdx];

  var dGZ=getDayGanZhi(y,m,d);

  var hourInfo=null;
  if(hh>=0){
    var hourZhi=getHourZhi(hh);
    var hourZhiPos=HOUR_ZHI_ORDER.indexOf(hourZhi); // 0=子
    var ziGan=WU_SHU_DUN[dGZ.gan];
    var ziGanIdx=Gan.indexOf(ziGan);
    var hourGanIdx=(ziGanIdx+hourZhiPos)%10;
    hourInfo={gan:Gan[hourGanIdx],zhi:hourZhi};
  }

  // 五行统计（含地支藏干，简易权重：本气1分，中气0.6分，余气0.3分）
  var wuxingCount={木:0,火:0,土:0,金:0,水:0};
  function addGan(g){wuxingCount[GanWuxing[g]]+=1;}
  function addZhi(z){
    var hidden=ZhiHidden[z];
    var weights=[1,0.6,0.3];
    for(var i=0;i<hidden.length;i++){
      wuxingCount[GanWuxing[hidden[i]]]+=weights[i]||0.3;
    }
  }
  addGan(yGZ.gan);addZhi(yGZ.zhi);
  addGan(monthGan);addZhi(monthZhi);
  addGan(dGZ.gan);addZhi(dGZ.zhi);
  if(hourInfo){addGan(hourInfo.gan);addZhi(hourInfo.zhi);}

  // 十神（相对日干）
  var dayEl=GanWuxing[dGZ.gan],dayYang=GanYang[dGZ.gan];
  function tenGod(g){
    var el=GanWuxing[g],yang=GanYang[g];
    var same=(yang===dayYang);
    if(el===dayEl)return same?"比肩":"劫财";
    if(isGenerating(el,dayEl))return same?"偏印":"正印";
    if(isGenerating(dayEl,el))return same?"食神":"伤官";
    if(isControlling(dayEl,el))return same?"偏财":"正财";
    if(isControlling(el,dayEl))return same?"七杀":"正官";
    return"-";
  }
  function isGenerating(a,b){ // a生b
    var map={木:"火",火:"土",土:"金",金:"水",水:"木"};
    return map[a]===b;
  }
  function isControlling(a,b){ // a克b
    var map={木:"土",土:"水",水:"火",火:"金",金:"木"};
    return map[a]===b;
  }

  var animalIdx=(mzInfo.baziYear-4)%12;if(animalIdx<0)animalIdx+=12;

  return{
    baziYear:mzInfo.baziYear,
    year:{gan:yGZ.gan,zhi:yGZ.zhi,tenGod:tenGod(yGZ.gan)},
    month:{gan:monthGan,zhi:monthZhi,tenGod:tenGod(monthGan)},
    day:{gan:dGZ.gan,zhi:dGZ.zhi,tenGod:"日主"},
    hour:hourInfo?{gan:hourInfo.gan,zhi:hourInfo.zhi,tenGod:tenGod(hourInfo.gan)}:null,
    dayMasterEl:dayEl,
    animal:Animals[animalIdx],
    wuxingCount:wuxingCount
  };
}

/* ---------- 十二值神（建除十二值）---------- */
var TWELVE_OFFICERS=["建","除","满","平","定","执","破","危","成","收","开","闭"];
var OFFICER_INFO={
  建:{good:["祭祀","祈福","出行","上任"],bad:["动土","开仓","嫁娶"],note:"月建之日，诸事宜守成开创，忌大兴土木。"},
  除:{good:["除服","疗病","破屋坏垣","扫舍"],bad:["嫁娶","开业","搬家"],note:"除旧布新之日，宜清理整顿，不宜订立大事。"},
  满:{good:["祈福","开市","立券","纳财"],bad:["安葬","服药"],note:"丰满之日，宜求财纳福，忌服药治病。"},
  平:{good:["修造","平治道路","修饰垣墙"],bad:["开市","诉讼"],note:"平顺之日，宜稳中求进，忌争讼是非。"},
  定:{good:["订盟","立券","嫁娶","入学"],bad:["诉讼","出行远门"],note:"安定之日，宜签约定亲，忌变动奔走。"},
  执:{good:["捕捉","畋猎","结网"],bad:["搬迁","开市"],note:"执守之日，宜按部就班，不宜变更计划。"},
  破:{good:["破屋坏垣","治病"],bad:["嫁娶","开市","动土","远行"],note:"冲破之日，诸事不顺，宜守静少动。"},
  危:{good:["祭祀","祈福"],bad:["登高","乘船","冒险之事"],note:"危险之日，宜谨慎行事，忌涉险冒进。"},
  成:{good:["嫁娶","开市","立券","入宅","开业"],bad:["诉讼"],note:"成就之日，诸事皆宜，是黄道吉日之一。"},
  收:{good:["纳财","嫁娶","入学","收养"],bad:["安葬","出行"],note:"收成之日，宜收获聚财，忌破财远行。"},
  开:{good:["开市","出行","嫁娶","入宅","动土"],bad:["安葬"],note:"开创之日，诸事大吉，宜开创新局。"},
  闭:{good:["筑堤","埋池","收藏"],bad:["嫁娶","开市","出行","上任"],note:"闭藏之日，宜守成收敛，不宜开创远行。"}
};
function getDayOfficer(y,m,d){
  var mz=getMonthZhiAndYearBoundary(y,m,d,12,0);
  var monthZhiIdx=Zhi.indexOf(mz.monthZhi);
  var dGZ=getDayGanZhi(y,m,d);
  var offset=((dGZ.zhiIdx-monthZhiIdx)%12+12)%12;
  var officer=TWELVE_OFFICERS[offset];
  return{officer:officer,info:OFFICER_INFO[officer]};
}

/* ---------- 生肖相合/相冲关系 ---------- */
var SANHE_GROUPS=[["鼠","龙","猴"],["牛","蛇","鸡"],["虎","马","狗"],["兔","羊","猪"]];
var LIUHE_PAIRS={鼠:"牛",牛:"鼠",虎:"猪",猪:"虎",兔:"狗",狗:"兔",龙:"鸡",鸡:"龙",蛇:"猴",猴:"蛇",马:"羊",羊:"马"};
var XIANGCHONG_PAIRS={鼠:"马",马:"鼠",牛:"羊",羊:"牛",虎:"猴",猴:"虎",兔:"鸡",鸡:"兔",龙:"狗",狗:"龙",蛇:"猪",猪:"蛇"};
var XIANGXING={ // 相刑（简化标注组）
  鼠:["兔"],兔:["鼠"],
  虎:["蛇","猴"],蛇:["虎","猴"],猴:["虎","蛇"],
  牛:["狗","羊"],狗:["牛","羊"],羊:["牛","狗"],
  龙:["龙"],马:["马"],鸡:["鸡"],猪:["猪"]
};
var XIANGHAI_PAIRS={鼠:"羊",羊:"鼠",牛:"马",马:"牛",虎:"蛇",蛇:"虎",兔:"龙",龙:"兔",猴:"猪",猪:"猴",鸡:"狗",狗:"鸡"};

function getZodiacRelation(a,b){
  if(a===b)return{level:"neutral",label:"本命相同",score:70,desc:"同属相，性格相近，需要多一些新鲜感与包容来维持长久关系。"};
  for(var i=0;i<SANHE_GROUPS.length;i++){
    if(SANHE_GROUPS[i].indexOf(a)>=0&&SANHE_GROUPS[i].indexOf(b)>=0){
      return{level:"great",label:"三合",score:95,desc:"三合属相，彼此气场相合，配合默契，是传统认为很理想的搭配。"};
    }
  }
  if(LIUHE_PAIRS[a]===b){
    return{level:"great",label:"六合",score:92,desc:"六合属相，情投意合、互补性强，相处融洽度很高。"};
  }
  if(XIANGCHONG_PAIRS[a]===b){
    return{level:"bad",label:"相冲",score:35,desc:"相冲属相，性格与节奏容易产生摩擦，需要更多沟通与让步。"};
  }
  if(XIANGHAI_PAIRS[a]===b){
    return{level:"caution",label:"相害",score:50,desc:"相害属相，日常小摩擦可能较多，重大事情上仍需彼此体谅。"};
  }
  if(XIANGXING[a]&&XIANGXING[a].indexOf(b)>=0){
    return{level:"caution",label:"相刑",score:55,desc:"相刑属相，合作共事时容易意见相左，建议多换位思考。"};
  }
  return{level:"normal",label:"平和",score:75,desc:"关系平和，没有明显的相合或相冲，相处如何更多取决于双方性格与经营。"};
}

/* ---------- 导出 ---------- */
global.MingliCore={
  Gan:Gan,Zhi:Zhi,Animals:Animals,GanWuxing:GanWuxing,ZhiWuxing:ZhiWuxing,
  solar2lunar:solar2lunar,lunar2solar:lunar2solar,
  leapMonth:leapMonth,leapDays:leapDays,monthDays:monthDays,
  toChinaMonth:toChinaMonth,toChinaDay:toChinaDay,
  toJDN:toJDN,getDayGanZhi:getDayGanZhi,
  getYearTerms:getYearTerms,getTermBeijing:getTermBeijing,TERM_NAMES:TERM_NAMES,
  getBazi:getBazi,yearGanZhiByYear:yearGanZhiByYear,
  getDayOfficer:getDayOfficer,TWELVE_OFFICERS:TWELVE_OFFICERS,OFFICER_INFO:OFFICER_INFO,
  getZodiacRelation:getZodiacRelation,
  getMonthZhiAndYearBoundary:getMonthZhiAndYearBoundary
};

})(window);
