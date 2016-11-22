/**
 * 多级菜单插件
 * 默认显示第一级和第二级菜单，从第三级至最末级右侧弹出显示
 * @param {Object} $
 */

(function($) {
	$.fn.extend({
		'initMenu': function(options) {
			var me = $(this);
			var defaults = {
				url:'',
				data: [], //菜单内容
				leafClick:function(){},//叶子节点点击事件
				lv1Temp:'<li class="slider-item"><div class="icon"></div><div class="menu-text"></div><div class="array-right"><i class="glyphicon glyphicon-chevron-right"></i></div></li>',
				lv2Temp:'<li><div class="menu-text"></div><div class="array-right"><i class="glyphicon glyphicon-chevron-right"></i></div><div class="blank1"></div></li>',
					//				onChanged: function() {}
			};
			if($(this).find('li').length>0){
				return;
			}
			var _opt = $.extend({}, defaults, options ,$(this).data());
			initMenu(_opt, me);
		},
		'getText':function(me){
			getText(me);
		},
		'getUrl':function(me){
			getUrl(me);
		}
	})

	function initMenu(_opt, me) {
		if(!_opt.url&&!_opt.data){
			return;
		}
		if(_opt.url){
			$.get(_opt.url,function(d){
				addItem(_opt,d,me);
			})
		}else{
			addItem(_opt,_opt.data,me);
		}
	}
	
	function addItem(_opt,_data,me){
		var menuData = _data;
		var menuLv1 = analysisMenu(menuData, 0);
		//初始化一级菜单
		for(var i = 0; i < menuLv1.length; i++) {
			var childMenu = analysisMenu(menuData, menuLv1[i].id);
			me.append(_opt.lv1Temp);
			//赋值
			var slider = me.find('.slider-item:last');
			slider.attr('iden',menuLv1[i].id);
			slider.attr('url',menuLv1[i].url);
			if(menuLv1[i].icon){
				slider.find('.icon').css('backgroundImage','url('+menuLv1[i].icon+')');
			}else{
				slider.find('.icon').hide();
			}
//			slider.find('.icon i').addClass('glyph'+iconObj[menuLv1[i].id]);
			slider.find('.menu-text').html(menuLv1[i].text);
			
			if(childMenu.length == 0) {
				me.find('.slider-item:last').find('.array-right').hide();
				slider.on('click',function(){
					_opt.leafClick($(this),getText($(this)),getUrl($(this)));
				})
				slider.hover(function(){
					$('.popup-menu').hide();
				})
			}else{
				slider.find('.menu-text').on('click',function(){
					$(this).parent().children('.array-right').find('i').toggleClass('glyphicon-chevron-down');
					$(this).parent().find('.more-menu').slideToggle(200);
				})
			}
			//初始化二级菜单
			for(var j = 0; j < childMenu.length; j++) {
				var childMenu2 = analysisMenu(menuData, childMenu[j].id);
				if(j == 0) {
					$('#slider-nav').find('li:last').append('<ul class="more-menu" style="display:none"></ul>');
				}
//				var mli = '<li iden="' + childMenu[j].id + '" pId="' + menuLv1[i].id + '"><div class="menu-text">'+childMenu[j].text+'</div><div class="array-right"><i class="glyphicon glyphicon-chevron-right"></i></div><div class="blank1"></div></li>';
				me.find('.more-menu:last').append(_opt.lv2Temp);
				var _li = me.find('.more-menu:last').find('li:last');
				_li.attr('iden',childMenu[j].id);
				_li.attr('url',childMenu[j].url);
				_li.find('.menu-text').html(childMenu[j].text);
				if(childMenu2.length>0){
					bindChildHover(_li,_opt.lv2Temp,_opt.leafClick,menuData);
				}else{
					_li.find('.array-right').hide();
					_li.on('click',function(e){
						_opt.leafClick($(this),getText($(this)),getUrl($(this)));
					}).hover(function(){
						$('.popup-menu').hide();
					})
				}
			}
		}
	}
	
	function bindChildHover(_li,temp,callback,menuData){
		
		//移入显示下级子菜单，支持多级菜单显示
		_li.mouseover(function(){
			//填出菜单ID,若已经生成则直接显示，否则重新生成
			var id = 'parent_'+$(this).attr('iden');
//			$('.popup-menu').hide();
			if($('#'+id).html()){
				$('#'+id).show();
			}else{
				$('body').append('<div class="popup-menu" id="'+id+'"><ul class="more-menu"></ul></div>');
				
				var childMenu = analysisMenu(menuData, $(this).attr('iden'));
				for(var j = 0; j < childMenu.length; j++) {
					var childMenu2 = analysisMenu(menuData, childMenu[j].id);
					if(j == 0) {
						$('#slider-nav').find('li:last').append('<ul class="more-menu" style="display:none"></ul>');
					}
					$('#'+id).find('.more-menu').append(temp);
					var _mli = $('#'+id).find('.more-menu').find('li:last');
					_mli.attr('iden',childMenu[j].id);
					_mli.attr('url',childMenu[j].url);
					_mli.find('.menu-text').html(childMenu[j].text);
					
					if(childMenu2.length>0){
						//循环添加下级菜单弹出
						bindChildHover(_mli,temp,callback,menuData);
					}else{
						_mli.find('.array-right').hide();
						_mli.on('click',function(e){
							callback($(this),getText($(this)),getUrl($(this)));
							$('.popup-menu').hide();
						})
					}
				}
			}
//			$('#'+id).append('top:'+$(this).position().top+'@@left:'+$(this).position().left+'@@width:'+parseInt($(this).css('width')));
			$('#'+id).css('top',$(this).offset().top);
			$('#'+id).css('left',$(this).offset().left+parseInt($(this).css('width'))+1);
			
//			$('.popup-menu').html($(this).position().top+'@'+parseInt($(this).css('width')));
		})
		
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
	
	function getText(me){
		return me.find('.menu-text').html();
	}
	
	function getUrl(me){
		return me.attr('url');
	}
	
	$(function(){
		$('[data-toggle="slider"]').each(function(k,v){
			$(v).initMenu();
		})
	})
	
})(jQuery);