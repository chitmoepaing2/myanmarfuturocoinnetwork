var playerVolume = 'OFF';
$.fn.progressBar = function(vid,videoPlayer,progresBar,fill) {
	/////////////ADD LINK//////////////////////
	$(vid).bind('timeupdate', function() {
		//Gets the whole duration of the track.
		//No idea kung saan ko ilalagay sa UI**IMPLEMENT LATER**
		var track_length = videoPlayer.duration;
		var secs = videoPlayer.currentTime;
		var progress = (secs / track_length) * 100;
		var proContainer = $(progresBar).width() / 100;
		
		if (progress === 100) 
		     {
			  $('.play').show();
		     }
		$(fill).css({
			'width': progress * proContainer
		});
		var tcMins = parseInt(secs / 60);
		//Track Seconds
		var tcSecs = parseInt(secs - (tcMins * 60));
		if (tcSecs < 10) {
			tcSecs = '0' + tcSecs;
		}
		// Display the time. REMEMBER
		$('.time').html(tcMins + ':' + tcSecs+' / '+parseInt(track_length/60)+':'+parseInt(track_length - parseInt(track_length/60)*60));

		
	});
	}


$(document).ready(function() {
     
       
	$('.play').on( "click", function() {
		var pauseBtn = $(this).closest('.html5video').find('.pause');
		var vidContainer = $(this).closest('.html5video').find('video');
		var progressContainer = $(this).closest('.html5video').find('.progressbar');
		var progressFill = $(this).closest('.html5video').find('.progress');
		var video = $(this).closest('.html5video').find('video')[0];
	    video.play();
	    //////Volume ON
	    $(this).closest('.html5video').find('.volume-off').hide();
		$(this).closest('.html5video').find('.volume-up').show();
		video.muted = false;
		playerVolume = 'ON';
			
	    //////
	    $(this).hide();
	    $(pauseBtn).show();
	    $(this).progressBar(vidContainer,video,progressContainer,progressFill);
	    
	});
	
	$('.pause').on( "click", function() {
		var playBtn = $(this).closest('.html5video').find('.play');
		var video = $(this).closest('.html5video').find('video')[0];
	    video.pause();
	    $(playBtn).show();
	    $(this).hide();
	});
	
	$('.share_video').on( "click", function() {
		
		var video    = $(this).attr('data-v');
		var video_height = $(this).closest('.html5video').height()+10;
		var video_width  = $(this).closest('.html5video').width();
	    var iframe = '<iframe width="'+video_width+'" height="'+video_height+'" src="http://jungonet.com/embed/v/'+video+'" frameborder="0" allowfullscreen></iframe>';
	    var input =  '<h2>Get Embed</h2><input type="text" value=\''+iframe+'\' style="margin-bottom:20px;width:100%;padding:5px">';
	    $('#lightbox, #about-info').show();
		$('#network-info').html(input);
		$('#lightbox form').hide();
	});
	
	$('.volume-off, .volume-up').on( "click", function() {	
	var video = $(this).closest('.html5video').find('video')[0];	
	if(playerVolume ==='OFF'){
		$(this).closest('.html5video').find('.volume-off').show();
		$(this).closest('.html5video').find('.volume-up').hide();
		video.muted = true;
		playerVolume = 'ON';
	}else{
		$(this).closest('.html5video').find('.volume-off').hide();
		$(this).closest('.html5video').find('.volume-up').show();
		video.muted = false;
		playerVolume = 'OFF';
	}
	});//
	

$('.fullscreen').bind("click", function() {
	var video = $(this).closest('.html5video').get(0);//$(this).closest('.html5video').find('video')[0];
	$(this).closest('.html5video').find('.cancel-fullscreen').show();
	$(this).closest('.html5video').find('.controls,.share_video').css({'z-index': '2147483647'});//max-width:100%;
	$(this).closest('.html5video').find('.videos').css({'width': '100%','height':'100%','max-height':''});
	
	$(this).hide();
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen(); // Firefox
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen(); // Chrome and Safari
  }else{
	  video.mozCancelFullScreen();
  }
  
  	var playBtnHeight = $(this).closest('.html5video').find('.fa-play-circle-o').height();
	var playerHeight = $(this).closest('.html5video').height();
	var playerWidth = $(this).closest('.html5video').width();
	
	var h       = playerHeight/2;
	var w       = playerWidth/2;
	var btnHalf = playBtnHeight/2;
	
	var btnTop = h - btnHalf;
	var btnLeft = w - btnHalf;
	
	$(this)[0].pause();
	$(this).closest('.html5video').find('.fa-play-circle-o').show().css({'top':btnTop+'px','left':btnLeft+'px'});
	$(this).closest('.html5video').find('.play').show();
	$(this).closest('.html5video').find('.pause').hide();
  
});

$('.cancel-fullscreen').bind("click", function() {
	var video = $(this).closest('.html5video').get(0);//$(this).closest('.html5video').find('video')[0];
    
    if (document.exitFullscreen) {
      document.exitFullscreen();
     } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
     } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
     } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
     }
    $(this).closest('.html5video').find('.videos').css({'max-width': '100%'}); 
    $(this).closest('.html5video').find('.controls,.share_video').css({'z-index': '222221'});
    $(this).closest('.html5video').find('.fullscreen').show();
    $(this).hide();
});




$(window).scroll(function() {
		$('.main-container video').each(function() {
			var pauseBtn = $(this).closest('.html5video').find('.pause');
			var vidContainer = $(this).closest('.html5video').find('video');
			var progressContainer = $(this).closest('.html5video').find('.progressbar');
			var progressFill = $(this).closest('.html5video').find('.progress');
			var video = $(this).closest('.html5video').find('video')[0];
			
			if ($(this).is(":in-viewport(400)")) {
				$(this)[0].play();
				$(this)[0].muted = true;
				playerVolume = 'OFF';
				$(this).closest('.html5video').find('.fa-play-circle-o').hide();
				$(this).closest('.html5video').find('.play').hide();
				$(this).closest('.html5video').find('.pause').show();
				$(this).progressBar(vidContainer,video,progressContainer,progressFill);
				
			} else {
				
				var playBtnHeight = $(this).closest('.html5video').find('.fa-play-circle-o').height();
				var playerHeight = $(this).closest('.html5video').height();
				var playerWidth = $(this).closest('.html5video').width();
				
				var h       = playerHeight/2;
				var w       = playerWidth/2;
				var btnHalf = playBtnHeight/2;
				
				var btnTop = h - btnHalf;
				var btnLeft = w - btnHalf;
				
				$(this)[0].pause();
				$(this).closest('.html5video').find('.fa-play-circle-o').show().css({'top':btnTop+'px','left':btnLeft+'px'});
				$(this).closest('.html5video').find('.play').show();
				$(this).closest('.html5video').find('.pause').hide();
				
			}
		});
	});
	
	$(".progressbar").click(function(e) {
			var offset = $(this).offset();
			var x = e.pageX - offset.left;
			var video = $(this).closest('.html5video').find('video')[0];
			
			$(this).closest('.html5video').find('.progress').css({'width': x});
			var progressPosition = x / $('.html5video').width();
			var startFrom = video.duration * progressPosition;
			video.currentTime = startFrom;
			
			
	});
	
	$(".html5video").mouseover(function(e) {
			$(this).closest('.html5video').find('.controls,.share_video').show();
	});
	
	$(".html5video").mouseout(function(e) {
			$(this).closest('.html5video').find('.controls,.share_video').hide();
	});
	
	$('.html5video .fa-play-circle-o').on( "click", function() {
		
		var pauseBtn = $(this).closest('.html5video').find('.pause');
		var vidContainer = $(this).closest('.html5video').find('video');
		var progressContainer = $(this).closest('.html5video').find('.progressbar');
		var progressFill = $(this).closest('.html5video').find('.progress');
		var video = $(this).closest('.html5video').find('video')[0];
		
	    video.play();
		//////Volume ON
	    $(this).closest('.html5video').find('.volume-off').hide();
		$(this).closest('.html5video').find('.volume-up').show();
		video.muted = false;
		playerVolume = 'ON';
		$(this).closest('.html5video').find('.fa-play-circle-o').hide();
		$(this).closest('.html5video').find('.play').hide();
		$(this).closest('.html5video').find('.pause').show();
		$(this).progressBar(vidContainer,video,progressContainer,progressFill);
	    $(this).hide();
	});

   $('video').bind('contextmenu',function() { return false; }); 

});
//////END PLAYER