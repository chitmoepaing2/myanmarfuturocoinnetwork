var url_to_use   = 'off';
var images       = [];
var linkOnly     = 'off';
var smallMenu    = 'off';
var profileCover = 'ON';
var checkNewPost = 5;//Seconds

//DON'T Edit this part
checkNewPost     = checkNewPost*1000;

var auto_url 	 = $(location).attr('hostname');
var pathname 	 = $(location).attr('pathname');
var pathnameArray = pathname.split('/');
var auto_user = pathnameArray[1];

$.fn.appendLink = function(link) {
	/////////////ADD LINK//////////////////////
	var appendToThis = $('#post-holder');
	$.get('processing/url.grabber.php?url=' + encodeURI(link), function(res) {
		appendToThis.append(res);
	});
	//////////////////////////////////////////
}
$.fn.loadComments = function(){
	$('.comment-holder').each(function() {//comment_px
			var commentHolder 	= $(this);
			var post         	= commentHolder.attr('data-post');
			
			var last_comment 	= commentHolder.children().last().attr('id');
			
			if(last_comment){
				last_comment = last_comment;
			}else{
				last_comment = 'comment-0';
			}
			
			last_comment = last_comment.replace(/comment-/, '');
			
			if ($(this).is(":in-viewport()")) {
				
				$.get('processing/latest.comments.php?post=' + encodeURI(post) + '&c=' +last_comment, function(data) {
					commentHolder.append(data);
				});
								
			} else {
				////
				
			}
		});
}
////////UPDATE POSTS FUNCTION
$.fn.updatePosts = function(auto_url,auto_user){
	if($(".main-container > .post-entry").first().attr('id')){
		
			var topPost = $(".main-container > .post-entry").first().attr('id');
			
			$.get('processing/latest.posts.php?post=' + encodeURI(topPost) + '&url=' + auto_url + '&user=' + auto_user, function(res) {
				$('.main-container').prepend(res);
				if ($(".main-container > .post-entry").filter(":hidden").length >= 1) {
					$('#new-posts,#new-posts-mini').html($(".main-container > .post-entry").filter(":hidden").length + ' <i class="fa fa-comments-o" aria-hidden="true"></i> new posts');
				}
			});
		}
}

$.fn.postIt = function() {
	/////////////NEW POST//////////////////////
	$('#new_post .textarea').css({'background':'url(public/images/spinner.gif) center center no-repeat'});
	var link = $('#post-holder').html();
	var text = $('#new_post .textarea').val();
	text     = $.trim(text);
	if(text.length ===0){
		alert('Please write something or attach a link or photo to post.');
		$('#new_post .textarea').css("background","");
		return false;
	}
	
	if(text.split(' ').length >= 1 && text.split(' ').length <= 45){
		
		var uploaded_img = $("#pic_iframe").contents().find("#place_h_img").html();
		var uploaded_video = $("#video_iframe").contents().find("#place_h_video").html();
		$("#form-images").val(uploaded_img);
		$("#form-videos").val(uploaded_video);
		if (link.length > 2) {
			$('#new_post #form-token').val('<div class="shared-link">' + link + "</div>");
			$('#new_post .textarea').val(text);
		} else {
			$('#new_post .textarea').val(text);
		}
		$("#post-btn").hide();//hide post button
		$.post("processing/new.post.php", $("#new_post").serialize(), function(data) {
			//alert(data);
			if (uploaded_img.length >= 1) {
				for (i = 0; i < uploaded_img.length; i++) {
					$.post("processing/new.photo.php", $("#new_photo").serialize(), function(data) {});
				}
			}
			$("form").trigger("reset");
			$("iframe").contents().find("form").trigger("reset");
			$('#post-holder').html('');
			$("#pic_iframe").contents().find("#place_h_img").html('');
			
			$("#video_iframe").contents().find("#place_h_video").html('');
			$('#pic-btn').html('<i aria-hidden="true" class="fa fa-camera"></i> Photos').show();
			$("#video-btn").load('<i aria-hidden="true" class="fa fa-video-camera"></i> Video').show();
			$("#post-btn").show();
			alert('Thank you, Post submitted');
			
		});
	}else{
		alert('Please write something or attach a link or photo to post.');
	}
	$('#new_post .textarea').css("background","");
	//////////////////////////////////////////
}
$.fn.searchFor = function() {
	var searchText = $('#srch').val();
	window.location.replace('search/' + searchText);
}
$(document).ready(function() {
	var widowHeight = $(window).height() - 120;
	$('.shared-link img').css({
		'max-height': widowHeight + 'px'
	});
	$('.user-data video').css({
		'max-height': widowHeight + 'px'
	});
	$('#new_post .textarea').keyup(function() {
		var str = $('#new_post .textarea').val();
		str = $.trim(str);
		var myArray = str.split(" ");
		$('#post_message').html(str.split(' ').length);
		if (str.split(' ').length > 45) {
			$("#post-btn").css({'background':'#d3d3d3','cursor':'default'}).off('click');
			$('#post_message').css({'color':'red'});
		} else {
			$('#post_message').css({'color':'#d3d3d3'});
			$("#post-btn").css({'background':'#13b5ea','cursor':'pointer'}).on('click');
		}
		$.each(myArray, function(index, value) {
			//alert( index + ": " + value );
			/////////////////////////////
			var re = /(?![^<]*>|[^<>]*<\/(?!(?:p|pre)>))((https?:)\/\/[a-z0-9&#=.\/\-?_]+)/gi;
			var urlPattern = new RegExp(re);
			if (url_to_use === 'off') {
				if (urlPattern.test(value)) {
					//do something about it
					$(this).appendLink(value);
					url_to_use = 'on';
					$('#pic-btn').hide();
					$('#link-btn').hide();
					$('#video-btn').hide();
					if (linkOnly === 'on') {
						$('#new_post .textarea').val('');
						$('#new_post .textarea').hide();
					}
				}
			}
		});
	});
	$('#new_post .textarea').keypress(function(e) {
	    if(e.which == 13) {
		    clearInterval(getLatest);
	        $(this).postIt();
	        getLatest = setInterval(function(){$(this).updatePosts(auto_url,auto_user)}, checkNewPost);
	    }
	});
	
	$("#post-btn").click(function() {
		clearInterval(getLatest);
		$(this).postIt();
		getLatest = setInterval(function(){$(this).updatePosts(auto_url,auto_user)}, checkNewPost);
	});
	$(".fa-search").click(function() {
		if ($('#srch').val().length > 3) {
			$(this).searchFor();
		}
	});
	$('#srch').keypress(function(e) {
		var key = e.which;
		if (key == 13) // the enter key code
		{
			if ($('#srch').val().length > 3) {
				$(this).searchFor();
			}
		}
	});
	$('.com textarea').click(function() {
		$(this).height(60);
	});
	$('#link-btn').click(function() {
		$('.textarea').css({
			'height': '40px',
			'border': '2px solid #13b5ea'
		}).focus();
		linkOnly = 'on';
	});
	/////////////
	$('#pic-btn').click(function() {
		$("#pic_iframe").contents().find("#post_pic").trigger("click").change(function() {
			$("#pic_iframe").contents().find("#pic_form").submit();
			$('#pic-btn').html('<i class="fa fa-cog fa-spin fa-fw"></i> Uploading...');
			$("#pic_iframe").on('load', function() {
				var uploaded_img = $("#pic_iframe").contents().find("#place_h_img").html();
				uploaded_img = uploaded_img.split('|');
				for (i = 0; i < uploaded_img.length; i++) {
					$("#post-holder").append('<div class="img_holders"><img data-remove="' + uploaded_img[i] + '" class="remove" src="public/images/shared/' + uploaded_img[i] + '"/></div>');
				}
				$('#pic-btn').hide();
				$('#video-btn').hide();
				url_to_use = 'on';
			});
		});
	});
	/////////////////
	/////////////
	$('#video-btn').click(function() {
		var username = $(this).attr('data-username');
		$("#video_iframe").contents().find("#post_video").trigger("click").change(function() {
			$("#video_iframe").contents().find("#video_form").submit();
			$('#pic-btn').hide();
			
			var v = 0;
var progress = window.setInterval(function() { 
				        
			           $("#video-btn").load('processing/video.progress.php?username='+username);
			           
			    	},800);
			
			$("#video_iframe").on('load', function() {
				var uploaded_video = $("#video_iframe").contents().find("#place_h_video").html();
				$('#form-videos').val(uploaded_video);
				clearInterval(progress);
				$('#video-btn').html('Video uploaded, now processing').css({'background':'#d3d3d3','cursor':'default'}).off('click');
				
			});
		});
	});
	/////////////////
	$('.user_profile_pic').click(function() {
		//alert('click');
		$("#profile_pic_iframe").contents().find("#profile_pic").trigger("click").change(function() {
			$("#profile_pic_iframe").contents().find("#profile_pic_form").submit();
			$("#profile_pic_iframe").on('load', function() {
				var uploaded_img = $("#profile_pic_iframe").contents().find("#profile-pic-holder").html();
				$('.user_profile_pic .user_avatar').attr('src', 'public/images/avatar/' + uploaded_img);
			});
		});
	});
	$('.network_avatar').click(function() {
		//alert('click');
		$("#network_pic_iframe").contents().find("#network_pic").trigger("click").change(function() {
			$("#network_pic_iframe").contents().find("#network_pic_form").submit();
			$("#network_pic_iframe").on('load', function() {
				var uploaded_img = $("#network_pic_iframe").contents().find("#network-pic-holder").html();
				$('.network_avatar .net_avatar').attr('src', 'public/images/avatar/' + uploaded_img);
			});
		});
	});
	//////////////  COVER  ///////////////
	$('#cover-btn').click(function() {
		//alert('click');
		if ($("#network_cover_iframe").length) {
			$("#network_cover_iframe").contents().find("#cover_pic").trigger("click").change(function() {
				$("#network_cover_iframe").contents().find("#network_cover_form").submit();
				$("#network_cover_iframe").on('load', function() {
					var uploaded_img = $("#network_cover_iframe").contents().find("#network-cover-holder").html();
					$('#profile-cover:before').css({
						'background': 'url(public/images/covers/' + uploaded_img+')'
					});
				});
			});
			
		} else {
			$("#profile_cover_iframe").contents().find("#cover_pic").trigger("click").change(function() {
				$("#profile_cover_iframe").contents().find("#profile_cover_form").submit();
				$("#profile_cover_iframe").on('load', function() {
					var uploaded_img = $("#profile_cover_iframe").contents().find("#profile-cover-holder").html();
					$('#profile-cover:before').css({
						'background': 'url(public/images/covers/' + uploaded_img+')'
					});
				});
			});
		}
	});
	////////////////
	$("body").on("click", ".stack-pic .fa-trash-o", function() {
		var data_remove = $(this).attr('data-remove');
		$('#' + data_remove).remove();
	});
	//////////// 
	$(".form-label").click(function() {
		$(this).attr("class", "form-label-active");
		$('#response').html('');
	});
	$("body").on("focusout", ".form-label-active", function() {
		if ($(this).closest('input').val() === '') {
			$(this).attr("class", "form-label");
		}
	});
	$('.more').click(function() {
		var comments = $(this).attr('data-post');
		$('#comments' + comments + ' .hide_comment').show();
	});
	$('.comment-btn').click(function() {
		$(this).closest('form textarea').css({'background':'url(public/images/spinner.gif) center center no-repeat'});
		$.post("processing/new.comment.php", $(this).closest('form').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'saved') {
				$('.com textarea').val('');
				
			} else {
				alert(data); 
				//$('#lightbox,#lightbox form').show();
			}
		$(this).closest('form textarea').css("background","");	
		});
	});
	//comment-reply
	$('.comment-reply').click(function() {
		var com = $(this).attr('data-comment');
		var pos = $(this).attr('data-post');
		var cite = $(this).attr('data-user');
		var post = $('#comment-text'+com).html();
		$('#com'+pos+' textarea').val('[reply]'+post+'[user]@'+cite+'[enduser][endreply]').focus();
	});
	
	
	$("#new-user-btn").click(function() {
		$.post("processing/new.user.php", $('#signupForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				$('#response').html('<div class="success info"><i class="fa fa-check"></i> Account created - Please login to start using jungonet</div>');
			} else if (data.replace(/\s+/g, '') === 'new_network') {
				window.location.replace('new_network');
			} else {
				$('#response').html('<div class="is_an_error info"><i class="fa fa-warning"></i> ' + data + '</div>');
			}
		});
	});
	$("#new-network-btn").click(function() {
		$.post("processing/new.network.php", $('#networkForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				var newSubDomain = $('#new-subdomain').val();
				    newSubDomain = newSubDomain+'.jungonet.com';
				
				$('#response').html('<div class="success info"><i class="fa fa-check"></i> Network created: <a href="http://'+newSubDomain+'">'+newSubDomain+'</a> </div>');
			} else {
				$('#response').html('<div class="is_an_error info"><i class="fa fa-warning"></i> ' + data + '</div>');
			}
		});
	});
	$("#login-btn").click(function() {
		$.post("processing/login.php", $('#loginForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				var url = window.location.href;
				window.location.replace(url);
			} else {
				$('#response').html('<div class="is_an_error info"><i class="fa fa-warning"></i> ' + data + '</div>');
			}
		});
	});
	
	$("#loginForm input").keypress(function(e) {
	    if(e.which == 13) {
	        $("#login-btn").click();
	    }
	});
	
	
	$("#reset-btn").click(function() {
		$.post("processing/update.password.php", $('#passwordRest').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				var url = '/login/new_password';
				window.location.replace(url);
			} else {
				$('#response').html('<div class="is_an_error info"><i class="fa fa-warning"></i> ' + data + '</div>');
			}
		});
	});
	
	$("#forgot-btn").click(function() {
		$.post("processing/forgot.password.php", $('#passwordForgot').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				var email = $('#email-r').val();
				var response_message ='<div class="title-text" style="color: #72c808">We sent a link to <strong style="color: #72c808">'+email+'</strong>. If you still haven’t received it after 5 minutes, please try again.</div>';
				$('#passwordForgot').html(response_message);
				
			} else {
				$('#response').html('<div class="is_an_error info"><i class="fa fa-warning"></i> ' + data + '</div>');
			}
		});
	});
	
	//
	$("#country_code").change(function() {
		var country_code = $("select option:selected").html();
		$('#location').html(country_code);
	});
	$('.join_network,.follow_btn').click(function() {
		var network = $(this).attr('data-network');
		$.get('processing/join.network.php?id=' + network, function(data) {
			
			if (data.replace(/\s+/g, '') === 'success') {
				//location.reload();
				window.location.replace(window.location.href);
			}else{
				alert(data);
			}
			
		});
	});
	$('.delete_post').click(function() {
		var post = $(this).attr('data-post');
		$('#post_dl').val(post);
		$.post("processing/delete.post.php", $('#deleteForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'deleted') {
				$('#post-' + post).css({
					'color': '#D8000C',
					'background-color': '#FFBABA'
				}).fadeOut(300, function() {
					$(this).remove();
				});
			} else {
				alert(data);
			}
		});
	});
	$('.delete_comment').click(function() {
		var post = $(this).attr('data-comment');
		$('#post_dl').val(post);
		$.post("processing/delete.comment.php", $('#deleteForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'deleted') {
				$('#comment-' + post).css({
					'color': '#D8000C',
					'background-color': '#FFBABA'
				}).fadeOut(300, function() {
					$(this).remove();
				});
			} else {
				alert(data);
			}
		});
	});
	$('.broadcast_post').click(function() {
		var post = $(this).attr('data-post');
		var owner = $(this).attr('data-user');
		
		$('#broadcast_post').val(post);
		$('#broadcast_post_owner').val(owner);
		$.post("processing/broadcast.post.php", $('#broadcastForm').serialize(), function(data) {
			alert(data);
		});
	});
	
	$('.flag_post').click(function() {
		var post = $(this).attr('data-post');
		$('#flag_post').val(post);
		$.post("processing/flag.post.php", $('#flagForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'flagged') {
				$('#post-' + post).css({
					'color': '#D8000C',
					'background-color': '#ffffcc'
				}).fadeOut(300, function() {
					$(this).remove();
				});
			} else {
				alert(data);
			}
		});
	});
	
	$('.like_it').click(function() {
		var post = $(this).attr('data-post');
		var likes = $('#likes_' + post).html();
		$('#like_post').val(post);
		$.post("processing/new.like.php", $('#likeForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				$('#likes_' + post).html(parseInt(likes) + 1);
				//location.reload();
			} else {
				$('#lightbox,#lightbox form').show();
			}
		});
	});
	
	//comments
	
	//Like comment
	$('.comment-like i').click(function() {
		var com  = $(this).attr('data-comment');
		var likes = $('#likes_comment_' + com).html();
		
		$('#like_comment').val(com);
		$.post("processing/new.like.com.php", $('#likeComForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				$('#likes_comment_' + com).html(parseInt(likes) + 1);
				//location.reload();
			} else {
				$('#lightbox,#lightbox form').show();
			}
		}); 
	});
	
	//Flag comment
	
	$('.flag_comment').click(function() {
		var comment = $(this).attr('data-comment');
		$('#flag_post').val(comment);
		$.post("processing/flag.comment.php", $('#flagForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'flagged') {
				$('#comment-' + comment).css({
					'color': '#D8000C',
					'background-color': '#ffffcc'
				}).fadeOut(300, function() {
					$(this).remove();
				});
			} else {
				alert(data);
			}
		});
	});
	
	/////
	
	$('#about-btn').click(function() {
		
		$('#lightbox, #about-info').show();
		$('#network-info').html($("#about-this-network").html());
		$('#lightbox form').hide();
	});
	$('#themes').click(function() {
		$('#lightbox, #about-info').show();
		$('#network-info').html($("#theme-this-network").html());
		$("#theme-this-network").html('');
	});
	
	$('#net_privacy').click(function() {
		
		$.get('processing/update.network.privacy.php', function(data) {
			alert(data);
/*
			if (data.replace(/\s+/g, '') === 'private') {
				$('#net_privacy').html('<i class="fa fa-lock" aria-hidden="true"></i> Privacy');
			}else if(data.replace(/\s+/g, '') === 'notprivate'){
				$('#net_privacy').html('<i class="fa fa-unlock" aria-hidden="true"></i> Privacy');
			}else{
				alert(data);
			}
*/
			
		});

	});
	
	
	$('.dislike_it').click(function() {
		var post = $(this).attr('data-post');
		var dislikes = $('#likes_' + post).html();
		$('#like_post').val(post);
		$.post("processing/new.dislike.php", $('#likeForm').serialize(), function(data) {
			if (data.replace(/\s+/g, '') === 'success') {
				$('#dislikes_' + post).html(parseInt(dislikes) + 1);
				//location.reload();
			} else {
				//alert(data); 
				$('#lightbox,#lightbox form').show();
			}
		});
	});
	
	
	$('#invite-btn').click(function() {
		$('#invite-btn').html('<i class="fa fa-cog fa-spin fa-fw"></i> Sending...');
		$.post("processing/invite.php", $("#send_invite").serialize(), function(data) {
			$('#invite-btn-holder').html(data);
		});
	});
	$('#lightbox').click(function(e) {
		if ($('#lightbox *').is(e.target)) {} else {
			$('#lightbox,#lightbox form,#about-info').hide();
		}
	});
	var leftSide = $('.side-left').width();
	$(window).scroll(function() {
		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			var page = $('body').attr('data-page');
			var user = $('body').attr('data-user');
			var network = $('body').attr('data-network');
			if (user !== '' && network !== '') {
				var url = page + "&u=" + user + "&n=" + network;
			} else if (user === '' && network !== '') {
				var url = page + "&n=" + network;
			} else {
				var url = page;
			}
			if (user !== 'users') {
				$.get('processing/posts.updates.php?p=' + url, function(data) {
					if (data.replace(/\s+/g, '') !== '') {
						$('.main-container').append(data);
						$("#newPost").prependTo('.main-container');
						page = parseInt(page) + 1;
						$('body').attr('data-page', page);
					}
				});
			}
		}
		if(!$('.info-container').length){
		if ($(window).scrollTop() > 270 && $(window).width() > 1024) {
			$('.side-left').css({
				'position': 'fixed',
				'width': leftSide + 'px',
				'top': '60px'
			});
			$('.main-container').css({
				'margin-left': leftSide + 'px'
			});
			if ($('#profile-cover').is(':visible')) {
				//$('#profile-cover').slideUp(2000);
				profileCover = 'OFF';
			}
		} else {
			$('.side-left').css('position', '');
			$('.main-container').css('margin-left', '');
			$('.main-container').css('top', '');
			if (profileCover === 'OFF') {
				//$('#profile-cover').slideDown(2000); 
			}
		}
	}
	});
	$('#small-screen-menu-btn').click(function() {
		if (smallMenu == 'off') {
			smallMenu = 'on';
			
			$('#small-screen-menu').show();
		} else {
			smallMenu = 'off';
			$('#small-screen-menu').hide();
		}
	});
	
	//////////UPDATE Latest
	
	if ($('body').attr('data-user') !== 'users'|| !auto_user.startsWith('hashtag')) {
		///Check for latest posts
		var getLatest = setInterval(function(){$(this).updatePosts(auto_url,auto_user)}, checkNewPost);
	}
	
	
	/////////////
	
	
	
	$('#new-posts,#new-posts-mini').on("click", function() {
		$(".main-container > .post-entry").filter(":hidden").fadeIn('2000');
		$('#new-posts,#new-posts-mini').html('');
		$("#newPost").prependTo('.main-container');
		$('html,body').animate({
		   scrollTop: $('.main-container').offset().top - 60
		}, 600);
		location.reload();
		
	});
	
	$('.share-post').on( "click", function() {
		
		var post = $(this).attr('data-post');
		var postHeight    = $('#post-'+post).height();
		var postWidth     = $('#post-'+post).width();
		var commentHeight = $('#comments'+post).height();
		
		postHeight = postHeight - commentHeight;
		
	    var iframe = '<iframe width="'+postWidth+'" height="'+postHeight+'" src="http://'+window.location.hostname+'/embed/post/'+post+'" frameborder="0" allowfullscreen></iframe>';
	    var input =  '<h2>Get Embed</h2><input type="text" value=\''+iframe+'\' style="margin-bottom:20px;width:100%;padding:5px">';
	    $('#lightbox, #about-info').show();
		$('#network-info').html(input);
		$('#lightbox form').hide();
	});
	

/*
$( ".user-data" ).each(function() {
  var totalImages = $(this).find('.img_holders').length;
  //$(this).append(totalImages);
});
*/


//////////////////////


window.setInterval(function() {
		$(this).loadComments();
	}, 3000);



});