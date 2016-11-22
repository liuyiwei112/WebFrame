
var bootPATH = getRootPath();

$(function(){
	$('input[type="text"],textarea').blur(function(){
		var value = '';
		if($(this).val()){
			value = clearTextArea($(this).val());
			$(this).val(value);
		}
		if($(this).html()){
			value = clearTextArea($(this).html());
			$(this).html(value);
		}
		//清除Miniui控件值
		var id = $(this).attr('id');
		if(id){
			var control = mini.get(id.substring(0,id.indexOf('$')));
			if(control){
				control.setValue(value);
			}
		}
	})
})

// 获取工程根路径
function getRootPath() {
	var pathName = window.document.location.pathname;
	return pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
}

// 千分符金额（保留2位）
function formatNumber2(s) {
	s = parseFloat(s);
	var flag = false;
	if (s < 0) {
		s = -s;
		flag = true;
	}
	s = s + '';
	s = s.replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s)) {
		s = s.replace(re, "$1,$2");
	}
	s = s.replace(/,(\d\d)$/, ".$1");
	s = s.replace(/^\./, "0.").replace('.0000', '');
	if (flag) {
		return '-' + s;
	} else {
		return s;
	}
}

function formatNumber0(s){
	s = parseFloat(s).toFixed(0)*1.0;
	var flag = false;
	if(s<0){
		s = -s;
		flag = true;
	}
	s = s + '';
	s = s.replace(/^(\d*)$/, "$1.");
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s)) {
		s = s.replace(re, "$1,$2");
	}
	s = s.replace(/,(\d\d)$/, "");
	s = s.replace(/^\./, "0.").replace('.0000','');
	if(flag){
		return '-'+s;
	}else{
		return s;
	}
}

// 去掉千分符
function clearFormat(s) {
	return s.replace(/\,/g, '');
}

//清除日期格式后的T00:00:00
function clearDateT(date){
	return date.substring(0,date.indexOf('T'));
}

/**Parses string formatted as YYYY-MM-DD to a Date object.
  * If the supplied string does not match the format, an
  * invalid Date (value NaN) is returned.
  * @param {string} dateStringInRange format YYYY-MM-DD, with year in
  * range of 0000-9999, inclusive.
  * @return {Date} Date object representing the string.
  */
 function parseDate(dateStringInRange) {
   var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
       date = new Date(NaN), month,
       parts = isoExp.exec(dateStringInRange);

   if(parts) {
     month = +parts[2];
     date.setFullYear(parts[1], month - 1, parts[3]);
     if(month != date.getMonth() + 1) {
       date.setTime(NaN);
     }
   }
   return date;
 }
 
function delHtmlTag(str){
  return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
} 


// Array查询元素位置
function indexOfArray(v, array) {
	for ( var i = 0; i < array.length; i++) {
		if (array[i] == v) {
			return i;
		}
	}
	return -1;
}


//计算包含英文与汉字的字符串长度
function countCharacters(str){
    var totalCount = 0; 
    for (var i=0; i<str.length; i++) { 
        var c = str.charCodeAt(i); 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
             totalCount++; 
         }else {     
             totalCount+=2; 
         } 
     }
    return totalCount;
}

function checkUploadFile(){
	var flag = true;
	$("input[type='file']").each(function(){
		//校验格式
	    if($(this).val()!="" && !(/^.*?\.(doc|docx|zip|rar)$/.test($(this).val().toLowerCase()))){
	    	var itemInfo = $.trim(($(this).parent().parent().prev()).children(0).text());
	    	alert("【"+itemInfo+"】只能上传doc、docx、zip或rar格式的附件！");
	    	$(this).focus();
	    	flag = false;
	    	return false;
	    }
	});
	return flag;
}

//计算长度，汉字算2个字符
function getCharLength(str){
    var totalCount = 0; 
    for (var i=0; i<str.length; i++) { 
        var c = str.charCodeAt(i); 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
             totalCount++; 
         }else {     
             totalCount+=2; 
         } 
     }
    return totalCount;
}

//TextArea换行转换
function convertTextArea(s){
	var reg=new RegExp("\n","g");
	return $.trim(s).replace(/<[^>]+>/g,"").replace(reg,'<br/>');
}

function clearTextArea(s){
	s = $.trim(s).replace(/<[^>]+>/g,"");
	if(s.indexOf('<img')>-1||s.indexOf('<input')>-1||s.indexOf('<text')>-1||s.indexOf('<a')>-1||s.indexOf('<div')>-1){
		s = "";
	}
	return s;
}

function goToLogin(){
	alert('当前登录已超期，请重新登录!');
//暂定不跳转，仅提示，防止信息丢失	
//	if(window.parent.frames.length>0){
//		window.parent.location.href = getRootPath()+"/Login.jsp";
//	}else{
//		window.location.href = getRootPath()+"/Login.jsp";
//	}
}

function checkAjaxPost(d){
	var msg = '';
	if(d){
		msg = d;
	}
	if(d.text){
		msg = d.text;
	}
	if(msg=='ParamException'){
		alert('提交参数异常，请不要使用单引号等特殊字符');
		return false;
	}
	if(msg=='SessionOverTime'){
		alert('出于安全保证，您的登录Session时间已失效，请重新登录！\n【友情提醒：】如想保留当前页面信息，请勿刷新或关闭！\n新开一个Tab页，重新登录后在回到此页面即可');
		return false;
	}
	return true;
}

function doAjaxCallBack(d,beforeCheck,afterCheck){
	if(beforeCheck){
		beforeCheck(d);
	}
	var msg = '';
	if(d){
		msg = d;
	}
	if(d.text){
		msg = d.text;
	}
	alert('----now check------');
	if(msg=='ParamException'){
		alert('提交参数异常，请不要使用单引号等特殊字符');
		return false;
	}
	if(msg=='SessionOverTime'){
		alert('出于安全保证，您的登录Session时间已失效，请重新登录！\n【友情提醒：】如想保留当前页面信息，请勿刷新或关闭！\n新开一个Tab页，重新登录后在回到此页面即可');
		return false;
	}
	//执行回调
	if(beforeCheck){
		afterCheck(d);
	}
	return true;
}

function checkGridQuery(d){
	if(d.text=='ParamException'){
		alert('此次查询的条件异常，请不要使用单引号等特殊字符');
	}
	if(d.text=='SessionOverTime'){
		alert('出于安全保证，您的登录Session时间已失效，请重新登录！\n【友情提醒：】如想保留当前页面信息，请勿刷新或关闭！\n新开一个Tab页，重新登录后在回到此页面即可');
	}
}

function enterQuery(fn){
	$('body').keyup(function(e){
		if(e.keyCode == '13'){
			fn();
		}
	});
}

var browser={
   	versions:function(){
           var u = navigator.userAgent, app = navigator.appVersion;
           return {         //移动终端浏览器版本信息
               trident: u.indexOf('Trident') > -1, //IE内核
               presto: u.indexOf('Presto') > -1, //opera内核
               webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
               gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
               mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
               ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
               android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
               iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
               iPad: u.indexOf('iPad') > -1, //是否iPad
               webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
           };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
};

//比较日期1和日期2的差值
function compareDate(d1,d2){
	var date1= new Date(Date.parse(d1.replace("-","/")));   
	var date2= new Date(Date.parse(d2.replace("-","/")));
	if(date1&&date2){
		return date1.getTime()-date2.getTime(); 
	}else{
		return -1;
	}  
}


function getEmptyValue(str){
	if(str==null||str=="null"||str=="NULL"){
		return "";
	}else{
		return str;
	}
}