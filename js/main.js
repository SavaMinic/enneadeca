$(function() {

	engine.start();
	
	// music loop
	var snd = new Audio("loop.ogg");
	snd.loop = true;
	snd.play();
	
	$("#musicToggle").click( function() {
		$(this).toggleClass('active');
		if( $(this).is('.active') ) {
			snd.play();
		} else {
			snd.pause();
		}
	});
	
	$(window).focus( function() {
		if($("#musicToggle").is('.active')) {
			snd.play();
		}
	}).blur( function() {
		snd.pause();
	});
});

// request animation frame
window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
})();
