// JavaScript Document
// 
/**
 * @requires jquery.min.js
 * @requires slider.js
 */

bs.loadScript('../', ['tab', 'boot-tree']);
bs.loadStyle('../', ['boot-tree'])

var iconObj = {
	'1000': 'icon-home',
	'2000': 'icon-user',
	'3000': 'icon-calendar',
	'4000': 'icon-gift',
	'5000': 'icon-book',
	'6000': 'icon-list',
	'7000': 'icon-lock',
	'8000': 'icon-briefcase',
	'9000': 'icon-inbox',
	'10000': 'icon-globe',
};

$(function() {
	$.cookie('skin', 'skin-lightblue.css');
	//	loadPage("demo/home.html?stmt="+Math.random());
	$('.body-content,.left-nav').css('height', document.documentElement.clientHeight - 105 + 'px');
	$('.page-container').css('height', document.documentElement.clientHeight - 135 + 'px');
	setTimeout(function() {
			$('.tab-frame').css('width', $('.right-side').width() - 50 + 'px');
		}, 10)

	$('.tab-all').initTab({
		tabs: [
		{
			'id': 'tab_1000',
			'text': 'datagrid',
			'url': 'demo/demo_of_table.html'
		}
//		,
//		{
//			id:'tab_2011',
//			'text': 'Form表单',
//			'url': 'demo/input.html'
//		}
		],
		container: $('.page-container')
	})
	
	$.getJSON('../data/menu.json',function(d){
    		$('#slider-nav').treeview({
    			data: d.toTreeData(0),
    			showTags:true,
    			expandIcon:'glyphicon glyphicon-chevron-right',
    			collapseIcon:'glyphicon glyphicon-chevron-down',
    			onNodeSelected: function(event, data){
    				openTab(data.id,data.text,data.url);
    			}
    		});
    })

//	/*加载菜单*/
//	$.getJSON('../data/menu.json', function(d) {
//		$('#slider-nav').initMenu({
//			data: d,
//			leafClick: function(me, text, url) {
//				$('.tab-all').addTab({
//					id: 'tab_' + me.attr('iden'),
//					'text': text,
//					'url': url
//				})
//			}
//		})
//
//		$('.page-container').hover(function() {
//			$('.popup-menu').hide();
//		})
//
//	});
//
	/*点击隐藏\显示左侧菜单*/
	$('.collspan-menu').click(function() {
		var that = $(this);
		$('.left-nav').slideToggle(50, function() {
			if($('.left-nav').is(':hidden')) {
				$('.right-side').css('padding-left', '10px');
			} else {
				$('.right-side').css('padding-left', '230px');
			}
			that.toggleClass('glyphicon-arrow-right');
			that.toggleClass('glyphicon-arrow-left');
			$(window).trigger('resize');
		});
	});

	$('.changeSkin').click(function() {
		var skin = $(this).attr('skin');
		document.getElementById('changecss').href = bs.getRootPath() + '/css/skin/' + skin + '?stmt=' + Math.random();
		$.cookie('skin', skin);
	});

	$(window).resize(function() {
		$('.body-content,.left-nav').css('height', document.documentElement.clientHeight - 105 + 'px');
		$('.page-container').css('height', document.documentElement.clientHeight - 135 + 'px');
		setTimeout(function() {
			$('.tab-frame').css('width', $('.right-side').width() - 50 + 'px');
		}, 10)
	})
});

function openTab(id,text,url){
	if(!id){
		id = parseInt(Math.random()*100000);
	}
	$('.tab-all').addTab({
		id: 'tab_' + id,
		'text': text,
		'url': url
	})
}
