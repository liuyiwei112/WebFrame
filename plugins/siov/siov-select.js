/**
 * siov 下拉选择框，可支持单选和多选操作，支持本地数据，以及外部Url数据
 * http请求只支持get，请勿使用post
 * @param {Object} $
 */

(function($) {
	var buttonTemp = '<button class="btn btn-default  dropdown-toggle" type="button" data-toggle="dropdown" value=""><label></label> <span class="caret"></span></button>';
	var ulWrap = '<ul class="dropdown-menu" role="menu" aria-labelledby="">';
	var liTemp = '<li role="presentation"><a role="menuitem" tabindex="-1" href="###"></a></li>';
	var multiLiTemp = '<li role="presentation"><span><a role="menuitem" tabindex="-1" href="#"></a></span><span><i class="glyphicon glyphicon-ok"></i><span></li>';
	var defaults = {
		data: [],
		url: '',
		idField: 'id', //id字段的名称
		textField: 'text', //text字段的名称
		showNullItem: false,
		emptyText: '',
		defaultValue: '',
		multiSelect: false,
		onChange: function(id,text) {}
	};


	$.fn.extend({
		"initSelect": function(options) {
			if($(this).find('button').length>0){
				return;
			}
			var _opt = $.extend({}, defaults, options , $(this).data());
			var me = $(this);
			initSelect(_opt, me);
			me.show();
		},
		"getSelectValue": function() {
			return $(this).find('.btn').attr('value');
		},
		"getSelectText": function() {
			return $(this).find('.btn').find('label').html();
		},
		"getSelectAllData":function(){
			return $(this).data('selectData').data;
		},
		"destorySelect":function(){
			destory($(this));
		},
		"reloadSelect":function(options){
			debugger;
			destory($(this));
			var _opt = $.extend({}, defaults, options , $(this).data());
			var me = $(this);
			initSelect(_opt, me);
			me.show();
		},
		//后台指定选择
		"select": function(v) {
			var vArr = [];
			if(typeof v == 'number' || typeof v == 'string') {
				vArr.push(v);
			} else if(typeof v == 'object' && v.length > 0) {
				vArr = v;
			} else {
				return;
			}
			var me = $(this);
			var btn = me.find('.btn');
			var _li, _value = '',
				_text = '';
			for(var i = 0; i < vArr.length; i++) {
				var _li = me.find('li[value="' + vArr[i] + '"]')
				if(!_li.html()) {
					return;
				}
				if(_li.find('span').length > 0) {
					_li.addClass('selected');
				}
				_value += _li.attr('value') + ',';
				_text += _li.find('a').html() + ','
			}
			//如果选择的值不为空
			if(_value) {
				_value = _value.substring(0, _value.length - 1);
				_text = _text.substring(0, _text.length - 1);
			}
			btn.attr('value', _value);
			btn.find('label').html(_text);
		}
	});
	
	function getStorage(me){
		return me.data('selectData');
	}
	
	function updateStorage(_opt,me){
		me.data('selectData',_opt);
	}
	
	function destory(me){
		me.html('');
		me.removeData('selectData');
		me.hide();
	}

	function initSelect(_opt, me) {
		me.addClass('dropdown');
		var url = _opt.url;
		var ldata = _opt.data;
		if(!url && ldata.length == 0) {
			return;
		}
		if(ldata.length > 0) {
			addItem(ldata, me, _opt);
			updateStorage(_opt,me);
			return;
		} else if(url) {
			$.get(url, function(d) {
				if(!d || d.length == 0) {
					return;
				} else {
					addItem(d, me, _opt);
					_opt.data = d;
					updateStorage(_opt,me);
				}
			})

		}
	};

	/**
	 * 添加下拉选项
	 * @param {Object} _itemArrary 下拉选项数据，必须为数组且元素为固定格式对象
	 * @param {Object} me select对象
	 * @param {Object} _opt 参数
	 */
	function addItem(_itemArrary, me, _opt) {
		//生成框架
		//生成button
		var id = me.attr('id');
		if(!id) {
			id = 'combox_' + parseInt(Math.random() * 1000000);
			me.attr('id', id);
		}
		me.append(buttonTemp);
		var btn = me.find('.btn');
		//生成ul框
		me.append(ulWrap);
		var ul = me.find('ul');
		ul.attr('aria-labelledby', id);
		var _liTemp = liTemp;
		if(_opt.multiSelect) {
			_liTemp = multiLiTemp;
			ul.addClass('multiselect');
		}
		//是否显示空选项
		if(_opt.showNullItem) {
			ul.append(_liTemp);
			ul.find('li:last').attr('value', '');
			ul.find('li:last a').html(_opt.emptyText);
			if(_opt.emptyText) {
				btn.find('label').html(_opt.emptyText);
			}
		}
		//循环数据初始化下拉选项
		for(i = 0; i < _itemArrary.length; i++) {
			var _item = _itemArrary[i];
			if(_item[_opt.idField] == _opt.defaultValue) {
				btn.attr('value', _item[_opt.idField]);
				btn.find('label').html(_item[_opt.textField]);
			}
			ul.append(_liTemp);
			ul.find('li:last').attr('value', _item[_opt.idField]);
			ul.find('li:last a').html(_item[_opt.textField]);
		}
		//对弹出框绑定click事件
		ul.find('li').on('click', function(e) {
			//多选点击事件
			if(_opt.multiSelect) {
				e.stopPropagation(); //防止弹出框点击后会消失
				multiSelect($(this), btn, _opt.onChange);
			} else {
				var selectedId = btn.attr('value');
				var nowId = $(this).attr('value');
				var nowText = $(this).find('a').html();
				//如果id相同，则不触发change事件
				if(nowId == selectedId) {
					return;
				} else {
					btn.attr('value', nowId);
					btn.find('label').html(nowText);
					_opt.onChange(nowId, nowText);
				}
			}
		})
	}

	//多选操作控制
	function multiSelect(_li, btn, onchange) {
		var v = '',
			t = '';
		_li.toggleClass('selected');
		var liAll = _li.parent().find('li');
		btn.attr('value', '');
		btn.find('label').html('');
		for(var i = 0; i < liAll.length; i++) {
			if($(liAll[i]).hasClass('selected')) {
				v += $(liAll[i]).attr('value') + ',';
				t += $(liAll[i]).find('a').html() + ','
			}
		}
		//如果选择的值不为空
		if(v) {
			v = v.substring(0, v.length - 1);
			t = t.substring(0, t.length - 1);
		}
		btn.attr('value', v);
		btn.find('label').html(t);
		onchange(v, t);
	}
	
	$(function(){
		$('[data-toggle="select"]').each(function(k,v){
			$(v).initSelect();
		})
	})
	
})(jQuery);