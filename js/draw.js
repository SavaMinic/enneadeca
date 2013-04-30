var draw = (function() {
	var tthis = {
		defFillColor : "#FF0000",
		defLineColor : "#FFFFFF",
		defLineWidth : 3,
		defFont : "Helvetica",
		defFontSize : "120px",
		defFontColor : "#FFFFFF"
	}, ctx, canvas;
	
	tthis.init = function(c) {
		canvas = c;
		ctx = canvas.getContext("2d");
	};
	
	tthis.text = function(text,x,y,size,color,font) {
		ctx.beginPath();
		ctx.font = (size || tthis.defFontSize) + " " +(font || tthis.defFont);
		ctx.fillStyle = color || tthis.defFontColor;
		ctx.fillText(text,x,y);
	}
	
	tthis.rect = function(x,y,w,h,color) {
		ctx.beginPath();
		ctx.fillStyle = color || tthis.defFillColor;
		ctx.fillRect(x,y,w,h);
	};
	
	tthis.line = function(x1,y1,x2,y2,width,color) {
		ctx.beginPath();
		ctx.lineWidth = width || tthis.defLineWidth;
		ctx.strokeStyle = color || tthis.defLineColor;
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	};
	
	tthis.circle = function(x,y,r,width,color,borderColor) {
		ctx.beginPath();
		ctx.strokeStyle = borderColor || tthis.defLineColor;
		ctx.fillStyle = color || tthis.defFillColor;
		ctx.arc(x,y,r,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	};
	
	tthis.clearScreen = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};
	
	return tthis;
})();