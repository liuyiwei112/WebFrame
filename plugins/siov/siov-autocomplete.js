(function($) {
	var loadingTemp = '<div class="siov-loading"></div>';
	var tipTemp = '<div class="tips">没有数据</div>';
	var inputTemp = '<input class="form-control auto-input" data-toggle="dropdown"/>';
	var ulWrap = '<ul class="dropdown-menu" role="menu" aria-labelledby="">'+tipTemp+'</ul>';
	var liTemp = '<li role="presentation"><a role="menuitem" tabindex="-1" href="#"></a></li>';
	var multiLiTemp = '<li role="presentation"><span><a role="menuitem" tabindex="-1" href="#"></a></span><span><i class="glyphicon glyphicon-ok"></i><span></li>';
	$.fn.extend({
		"complete": function(options) {
			var defaults = {
				url: '',
				support: null,
				idField: 'id',
				textField: 'text',
				multiSelect: false,
				onChange: function(id,text) {}
			};
			if($(this).find('input').length>0){
				return;
			}
			var _opt = $.extend({}, defaults, options ,$(this).data());
			var me = $(this);
			initWidget(_opt, me);
		},
		"getCompValue": function() {
			return $(this).find('.auto-input').attr('values');
		},
		"getCompText": function() {
			return $(this).find('.auto-input').val();
		}
	});

	function initWidget(_opt, me) {
		me.addClass('dropdown');
		var url = _opt.url;
		var ldata = _opt.data;
		if(!url && !_opt.support) {
			return;
		}
		//生成input
		var id = me.attr('id');
		if(!id) {
			id = 'complete_' + parseInt(Math.random() * 1000000);
			me.attr('id', id);
		}
		me.append(inputTemp);
		var _input = me.find('.auto-input');

		//生成ul框
		me.append(ulWrap);
		var ul = me.find('ul');
		ul.attr('aria-labelledby', id);

		//初始化text change事件
		_input.keyup(function() {
			var _ul = $(this).next();
			_ul.html(loadingTemp);
			var key = $.trim($(this).val());
			if(key!=''){
				$('.bottom-panel').html(url);
				//自定义数据回传提供方式
				if(_opt.support){
					_opt.support(key, function(_data) {
						_ul.find('.siov-loading').remove();
						if(_data.length==0){
							_ul.html(tipTemp);
						}else{
							addItem(_data, _opt, me);
						}
					})
				}
				//纯url方式,要求必须是数组返回
				else if(url){
					var _url = url;
					if(url.indexOf('key')>-1){
						_url = url.substring(0,url.indexOf('key')-1);
					}
					if(_url.indexOf('?')>-1){
						_url+='&key='+key;
					}else{
						_url+='?key='+key;
					}
					$.get(_url,function(d){
						_ul.find('.siov-loading').remove();
						if(!d||d.length==0){
							_ul.html(tipTemp);
						}else{
							addItem(d, _opt, me);
						}
					})
				}
			}else{
				var ul = me.find('ul');
				ul.html(tipTemp);
			}
		})
	}

	function addItem(_data, _opt, me) {
		var ul = me.find('ul');
		var _input = me.find('.auto-input');
		ul.html('');
		var _liTemp = liTemp;
		if(_opt.multiSelect) {
			_liTemp = multiLiTemp;
			ul.addClass('multiselect');
		}
		//循环数据初始化下拉选项
		for(i = 0; i < _data.length; i++) {
			var _item = _data[i];
			if(_item[_opt.idField] == _opt.defaultValue) {
				_input.attr('values',_item[_opt.idField]);
				_input.val(_item[_opt.textField]);
			}
			ul.append(_liTemp);
			ul.find('li:last').attr('value',_item[_opt.idField]);
			ul.find('li:last a').html(_item[_opt.textField]);
		}
		//对弹出框绑定click事件
		ul.find('li').on('click',function(e){
			//多选点击事件
			if(_opt.multiSelect){
				e.stopPropagation();//防止弹出框点击后会消失
				multiSelect($(this),_input,_opt.onChange);
			}else{
				var selectedId = _input.attr('values');
				var nowId = $(this).attr('value');
				var nowText = $(this).find('a').html();
				//如果id相同，则不触发change事件
				if(nowId==selectedId){
					return;
				}else{
					_input.attr('values',nowId);
					_input.val(nowText);
					_opt.onChange(nowId,nowText);
				}
			}
		})
		
	}
	
	//多选操作控制
	function multiSelect(_li, _input, onchange) {
		var v = '',
			t = '';
		_li.toggleClass('selected');
		var liAll = _li.parent().find('li');
		_input.attr('values', '');
		_input.val('');
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
		_input.attr('values', v);
		_input.val(t);
		onchange(v, t);
	}
	
	$(function(){
		$('[data-toggle="complete"]').each(function(k,v){
			$(v).complete();
		})
	})

})(jQuery);