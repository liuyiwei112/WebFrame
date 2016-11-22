(function($) {
	
	var container

	$.fn.extend({
		'initTab': function(options) {
			var me = $(this);
			var defaults = {
				tabs: [], //初始化tab内容
				container:'',
				onChanged: function() {}
			};
			var _opt = $.extend({}, defaults, options);
			container = _opt.container;
			initTab(_opt, me)
		},
		'addTab': function(tab) {
			var me = $(this);
			var id = addTab(tab, me);
			showTab(id, me);
		},
		'showTab': function(id) {

		}

	});

	function initTab(_opt, me) {
		if(!_opt.tabs || _opt.tabs.length == 0) {
			return;
		}
		for(var i = 0; i < _opt.tabs.length; i++) {
			var _tab = _opt.tabs[i];
			addTab(_tab, me ,container);
		}
		me.find('.tab:first').addClass('active');
		me.find('.tab:first').find('i').hide();
		container.find('.' + me.find('.tab:first').attr('id')).show();
		
		var btnFrame = me.parent().next();
		var back = btnFrame.find('.back');
		var forward = btnFrame.find('.forward');
		
		//设置tab外框的滚动时间，控制左右箭头的disabled
		me.parent().scroll(function(){
			var wrapWidth = $(this).width();
			var scrollLeft = $(this).scrollLeft();
			var tabWidth = me.width();
			if(tabWidth<=wrapWidth){
				back.addClass('disabled');
				forward.addClass('disabled');
			}else{
				if(scrollLeft==0){
					back.addClass('disabled');
					forward.removeClass('disabled');
				}else if(scrollLeft+wrapWidth<tabWidth){
					back.removeClass('disabled');
					forward.removeClass('disabled');
				}else{
					back.removeClass('disabled');
					forward.addClass('disabled');
				}
			}
		})
		
		//左右箭头点击事件，点击可滚动tab标签
		back.mousedown(function(){
			a = setInterval(function(){
				if(!back.hasClass('disabled')){
					changeScroll(-5,me);
				}
			},15)
		}).mouseup(function(){
			clearInterval(a);
		})
		
		forward.mousedown(function(){
			a = setInterval(function(){
				if(!forward.hasClass('disabled')){
					changeScroll(5,me);
				}
			},15)
		}).mouseup(function(){
			clearInterval(a);
		})
	}

	function addTab(_tab, me) {
		var id = 'tab_' + parseInt(Math.random() * 1000000);
		if(_tab.id) {
			id = _tab.id;
		}
		var wrapWidth = parseInt(me.parent().width());
		if(me.find('#'+id).html()){
			var left = me.find('#' + id).position().left;
			var width = me.find('#' + id).width();
			me.parent().animate({scrollLeft:(width+left+42-wrapWidth)+'px'});
			$('.bottom-panel').html(left+'@@'+width+'@@'+wrapWidth);
			showTab(id,me);
		}else{
			me.find('.tab-last-space').before('<td class="tab" id="' + id + '">' + _tab.text + ' <i class="glyphicon glyphicon-remove"></i> </td><td class="tab-space"><div></div></td>');
			container.append('<div class="' + id + '" style="display:none"><iframe src="' + bs.getRootPath() + _tab.url + '" scrolling="yes"></iframe></div>');
	
			me.find('.tab:last').on('click', function() {
				showTab(id, me );
			})
	
			me.find('.tab:last i').on('click', function() {
				var _id = $(this).parent().attr('id');
				closeTab(_id, me );
			})
			me.parent().animate({scrollLeft:(me.width()-wrapWidth)+'px'},200);
		}
		return id;
	}
	
	function changeScroll(speed,me){
		var scrolLeft = me.parent().scrollLeft();
		var wrapWidth = parseInt(me.parent().width());
		var meWidth = me.width();
		var btnFrame = me.parent().next();
		var back = btnFrame.find('.back');
		var forward = btnFrame.find('.forward');
		me.parent().scrollLeft(scrolLeft+speed);
	}

	function showTab(id, me ) {
		me.find('.active').removeClass('active');
		me.find('#' + id).addClass('active');
		container.find('div').hide();
		container.find('.' + id).show();
	}

	function closeTab(id, me ) {
		if($('#' + id).hasClass('active')){
			var pre = $('#' + id).prev().prev();
			var preId = pre.attr('id');
			//如果当前tab为激活状态，则寻找上一个tab
			showTab(preId, me);
		}
		$('#' + id).next().remove();//同时删除间隔的空表格
		$('#' + id).remove();
		$('.' + id).remove();
	}

})(jQuery);
