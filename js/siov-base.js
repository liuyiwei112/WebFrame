/**
 *基本工具类及原型方法
 *require 
 *author liuyw
 */

function bs(){
	
	this.jsLib = {
		'boot':'plugins/bootstrap/js/bootstrap.min.js',
		'cookie':'js/jquery.cookie.js',
		'tab':'plugins/siov/siov-tab.js',
		'slider':'plugins/siov/siov-slider.js',
		'select':'plugins/siov/siov-select.js',
		'complete':'plugins/siov/siov-autocomplete.js',
		'boot-date':'plugins/bootstrap-datepicker/js/bootstrap-datetimepicker.js',
		'dt':'plugins/siov/siov-date.js',
		'boot-table':'plugins/bootstrap-table/bootstrap-table.js',
		'boot-table-fixed':'plugins/bootstrap-table/extensions/fixed-column/bootstrap-table-fixed-columns.js',
		'boot-tree':'plugins/bootstrap-treeview/bootstrap-treeview.js',
//		'jroll':'js/common/jroll/jroll.js',
//		'jroll-infinite':'js/common/jroll/jroll-infinite.js',
//		'jroll-pull':'js/common/jroll/jroll-pulldown.js',
//		'picker':'js/mui/mui.picker.min.js',
//		'indexedlist':'js/mui/mui.indexedlist.js'
	},
	this.cssLib = {
		'siov':'plugins/siov/css/common.css',
		'demo':'demo/demo.css',
		'boot':'plugins/bootstrap/css/bootstrap.min.css',
		'boot-theme':'plugins/bootstrap/css/bootstrap-theme.min.css',
		'boot-date':'plugins/bootstrap-datepicker/css/bootstrap-datetimepicker.min.css',
		'boot-table':'plugins/bootstrap-table/bootstrap-table.css',
		'boot-table-fixed':'plugins/bootstrap-table/extensions/fixed-column/bootstrap-table-fixed-columns.css',
		'boot-tree':'plugins/bootstrap-treeview/bootstrap-treeview.css',
	}
}
//此处需要跨域的支持，一是设置浏览器默认可跨域，二是使用nginx处理
bs.apiUrl = 'http://115.28.22.146:9090/ytcrm/rest/';
bs.baseScript = ['boot','cookie','dt'];
bs.baseStyle = ['siov','demo','boot','boot-theme'];

/**
 * 自动加载JS脚本，抽取共用部分，减少界面多次调用
 * @param {Object} _base 基本路径
 * @param {Object} extra 需要额外调用的JS
 */
bs.loadScript = function(_base,extra){
	var _bs = new bs();
	var scriptArray = bs.baseScript.merge(extra);
	for(var i=0;i<scriptArray.length;i++){
		$.ajax({type:'GET',url:_base+_bs.jsLib[scriptArray[i]],async:false,dataType:'script'});
	}
}

/**
 * 自动加载CSS脚本，抽取共用部分，减少界面多次书写
 * @param {Object} _base 基本路径
 * @param {Object} extra 需要额外调用的JS
 */
bs.loadStyle = function (_base,extra){
	var _bs = new bs();
	var styleArray = bs.baseStyle.merge(extra);
	for(var i=0;i<styleArray.length;i++){
		var link = document.createElement('link');
	    link.type = 'text/css';
	    link.rel = 'stylesheet';
	    link.href = _base+_bs.cssLib[styleArray[i]];
	    document.getElementsByTagName("head")[0].appendChild(link);
//		$.ajax({type:'GET',url:_base+_bs.cssLib[styleArray[i]],async:false,dataType:'script'});
	}
}

/**
 * 获取系统根目录
 */
bs.getRootPath = function(){
	var pathName = window.document.location.pathname;
	return pathName.substring(0, pathName.substr(1).indexOf('/') + 1)+'/';
}

Array.prototype.merge = function(_barr){
	for(var i=0;i<_barr.length;i++){
		this.push(_barr[i]);
	}
	return this;
}

Array.prototype.indexOf = function(_target){
	var _a = this;
	for(var i=0;i<_a.length;i++){
		if(_target == _a[i]) return i;
	}
	return -1;
}

//数组克隆,防止地址引用
Array.prototype.clone = function(){
	var _a = [];
	var _t = this;
	for(var i=0;i<_t.length;i++){
		_a.push(_t[i]);
	}
	return _a;
}

Array.prototype.clear = function(){
	this.length = 0;
}
/**
 * 根据Id，parentId转换为tree使用的数据结构
 */
Array.prototype.toTreeData = function(pId){
	var _tempArray = this.clone();
	var _resultArray = [];
//	_tempArray.sort(function(x, y) {
//		if(x.parentId > y.parentId) {
//			return 1;
//		}
//		return -1;
//	});
	var lv0 = analysisMenu(_tempArray,pId);
	for(var i=0;i<lv0.length;i++){
		var _node = lv0[i];
		_node.nodes = [];
		scanArray(_node,lv0[i].id,_tempArray);
		_resultArray.push(_node);
	}
	return _resultArray;
}

function scanArray(pobj,pId,arr){
	var i=0;
	for(var j=0;j<arr.length;j++){
		if(arr[j].parentId == pId){
			i++;
			pobj['selectable'] = false;
			var nobj = arr[j];
			nobj.nodes = [];
			pobj.nodes.push(nobj);
			scanArray(nobj,arr[j].id,arr);
		}
	}
	if(i==0){
		delete pobj.nodes;
	}
}



//根据父ID查询所有子菜单节点
function analysisMenu(menuArray, parentId) {
	var fitArray = [];
	for(var iii = 0; iii < menuArray.length; iii++) {
		if(menuArray[iii].parentId == parentId) {
			fitArray.push(menuArray[iii]);
		}
	}
	return fitArray;
}

Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i]!=this[dx]) 
        { 
            this[n++]=this[i] 
        } 
    } 
    this.length-=1 
} 

$(function(){
//	alert(document.body.offsetWidth);
//	$('html').css('font-size',document.body.offsetWidth/10+'px')
})

