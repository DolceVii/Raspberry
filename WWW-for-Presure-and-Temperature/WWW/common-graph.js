function getContext(canvasId) {
	var canvas = document.getElementById(canvasId), context = canvas
			.getContext("2d");
	return context;
}

function round(num, decs) {
	var qty = parseFloat(num);
	var decimals = parseFloat(decs);
	decimals = decs;
	return Math.round(qty * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function toRadian(angle) {
	return angle * Math.PI / 180;
}

function toAngle(rad) {
	return rad * 180 / Math.PI;
}

function isFirefox() {
	var moz = new RegExp("(Firefox)");
	return moz.test(navigator.userAgent);
}

function hexToDec(hex) {
	return parseInt(hex, 16);
}

function decToHex(dec) {
	var hex = "0123456789ABCDEF";
	var low = dec % 16;
	var high = (dec - low) / 16;
	hex = "" + hex.charAt(high) + hex.charAt(low);
	return hex;
}

function sectionPath(ctx, x, y, radius, radius1, startAngle, endAngle) {
	var start = (startAngle) * Math.PI / 180;
	var end = (endAngle) * Math.PI / 180;

	var x1 = x + radius1 * Math.cos(start);
	var y1 = y + radius1 * Math.sin(start);
	var x2 = x + radius * Math.cos(start);
	var y2 = y + radius * Math.sin(start);

	var x4 = x + radius * Math.cos(end);
	var y4 = y + radius * Math.sin(end);

	if (radius1 > 0) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.moveTo(x1, y1);
		ctx.arc(x, y, radius, start, end, false);
		ctx.moveTo(x4, y4);
		ctx.arc(x, y, radius1, end, start, true);
	} else {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, radius, start, end, false);
		ctx.closePath();
	}
}

function donutPath(ctx, x, y, radius, radius1) {

	var start = 0;
	var end = 360;

	sectionPath(ctx, x, y, radius, radius1, start, end);

}

function fillDonut(ctx, x, y, radius, radius1, fillStyle, shadow) {
	fillSection(ctx, x, y, radius, radius1, 0, 359.9, fillStyle, shadow);
}

function drawSection(ctx, x, y, radius, radius1, startAngle, endAngle,
		lineWidth, color) {

	ctx.beginPath();

	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;

	sectionPath(ctx, x, y, radius, radius1, startAngle, endAngle);

	ctx.stroke();
	ctx.closePath();
}

function fillSection(ctx, x, y, radius, radius1, startAngle, endAngle,
		fillStyle, shadow) {

	ctx.save();
	ctx.beginPath();
	if (shadow) {
		setShadow(ctx, shadow.offsetX, shadow.offsetY, shadow.blur);
	}
	sectionPath(ctx, x, y, radius, radius1, startAngle, endAngle);
	ctx.fill();
	ctx.restore();
	ctx.fillStyle = fillStyle;
	ctx.fill();
	ctx.closePath();

}


function circlePath(ctx, x, y, radius) {
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
}

function drawCircle(ctx, x, y, radius, lineWidth, color) {

	if (lineWidth)
		ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;

	ctx.beginPath();
	circlePath(ctx, x, y, radius);
	ctx.stroke();
	ctx.closePath();

}

function fillCircle(ctx, x, y, radius, fillStyle, shadow) {

	ctx.save();
	ctx.beginPath();
	if (shadow) {
		setShadow(ctx, shadow.offsetX, shadow.offsetY, shadow.blur);
	}
	circlePath(ctx, x, y, radius);
	ctx.fill();
	ctx.restore();
	ctx.fillStyle = fillStyle;
	ctx.fill();
	ctx.closePath();
}

function rectPath(ctx, left, top, width, height) {
	ctx.rect(left, top, width, height);
}

function fillRect(ctx, left, top, width, height, fillStyle, shadow) {

	ctx.beginPath();
	ctx.save();
	if (shadow) {
		setShadow(ctx, shadow.offsetX, shadow.offsetY, shadow.blur);
	}

	rectPath(ctx, left, top, width, height);
	ctx.fill();
	ctx.restore();
	ctx.fillStyle = fillStyle;
	ctx.fillRect(left, top, width, height);
	ctx.closePath();
}

function drawRect(ctx, x, y, width, height, lineWidth, color) {

	if (lineWidth)
		ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;

	ctx.beginPath();
	rectPath(ctx, x, y, width, height);
	ctx.strokeRect(x, y, width, height);
	ctx.stroke();

}

function clearRect(ctx, x, y, width, height) {
	ctx.clearRect(x, y, width, height);
}

function roundRectPath(ctx, left, top, width, height, radius) {

	ctx.beginPath();
	var x = left;
	var y = top;
	ctx.moveTo(x + radius, y - .5);
	ctx.lineTo(x + width - radius, y - .5);
	ctx.quadraticCurveTo(x + width, y - .5, x + width + .5, y + radius + .5);
	ctx.lineTo(x + width + .5, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height + .5, x + width - radius, y
			+ height + .5);
	ctx.lineTo(x + radius, y + height + .5);
	ctx.quadraticCurveTo(x - .5, y + height - .5, x - .5, y + height - radius
			- .5);
	ctx.lineTo(x - .5, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);

	ctx.closePath();
}

function fillRoundRect(ctx, left, top, width, height, radius, fillStyle, shadow) {

	ctx.save();
	if (shadow) {
		setShadow(ctx, shadow.offsetX, shadow.offsetY, shadow.blur);
	}
	roundRectPath(ctx, left, top, width, height, radius);
	ctx.fillStyle = fillStyle;
	ctx.fill();
	ctx.restore();

}

function drawRoundRect(ctx, x, y, width, height, radius, lineWidth, color) {

	ctx.save();
	if (lineWidth)
		ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	roundRectPath(ctx, x, y, width, height, radius);
	ctx.stroke();
	ctx.restore();

}

function drawPoly(ctx, points, lineWidth, color, shadow, lineStyle) {

	ctx.save();
	ctx.beginPath();

	if (shadow) {
		setShadow(ctx, shadow.offsetX, shadow.offsetY, shadow.blur);
	}

	polyPath(ctx, points);

	ctx.lineWidth = lineWidth;

	ctx.lineCap = lineStyle;
	ctx.lineJoin = lineStyle;

	ctx.strokeStyle = color;
	ctx.stroke();

	ctx.restore();
}

function fillPoly(ctx, points, fillStyle, shadow, lineStyle) {

	ctx.save();
	ctx.beginPath();

	if (shadow) {
		setShadow(ctx, shadow.offsetX, shadow.offsetY, shadow.blur);
	}

	polyPath(ctx, points);
	ctx.lineCap = lineStyle;
	ctx.lineJoin = lineStyle;

	ctx.fill();

	ctx.restore();

	ctx.save();

	ctx.fillStyle = fillStyle;
	ctx.closePath();
	ctx.fill();

	ctx.restore();

}

function polyPath(ctx, points) {

	var n = 0;
	ctx.moveTo(points[0].x, points[0].y);
	for (n = 1; n < points.length; n++) {
		var x = points[n].x;
		var y = points[n].y;
		ctx.lineTo(x, y);
	}

}

function drawLine(ctx, x, y, x1, y1, lineWidth, color) {

	var nx = Math.floor(x) + .5;
	var ny = Math.floor(y) + .5;
	var nx1 = Math.floor(x1) + .5;
	var ny1 = Math.floor(y1) + .5;

	ctx.save();
	ctx.beginPath();
	ctx.globalAlpha = 1;
	ctx.lineWidth = lineWidth;
	ctx.moveTo(nx, ny);
	ctx.lineTo(nx1, ny1);
	ctx.strokeStyle = color;
	ctx.stroke();
	ctx.restore();

}

function drawDottedLine(ctx, x, y, x1, y1, lineWidth, color) {

	ctx.lineWidth = lineWidth;
	if (lineWidth)
		ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	ctx.beginPath();

	ctx.dashedLine(x, y, x1, y1, [ 1, 2 ]);
	ctx.stroke();

}

function drawRadialIndicator(canvasId, x, y, radius, angle, style, factor) {

	var cir = new Circle();
	cir.left = x;
	cir.top = y;
	cir.radius = radius / 10;
	cir.color = '#F4F201';
	cir.endColor = '#E4C700';
	if (style == '3D')
		cir.fillStyle = 'linear';
	else
		cir.fillStyle = 'solid';

	cir.borderStyle = 'solid';
	cir.borderColor = 'grey';
	cir.shadow = new Shadow( {
		offsetX : 0,
		offsetY : 0,
		blur : 10
	});
	var fac = 0.45;

	if (factor)
		fac = factor;

	var r1 = radius / 12;
	var r2 = radius * fac;
	var ang = angle - 90;

	var x1 = x + Math.cos(toRadian(ang)) * r1;
	var y1 = y + Math.sin(toRadian(ang)) * r1;

	var x11 = r2 * Math.cos(toRadian(angle)) + x1;
	var y11 = r2 * Math.sin(toRadian(angle)) + y1;

	var x2 = x + Math.cos(toRadian(ang + 180)) * r1;
	var y2 = y + Math.sin(toRadian(ang + 180)) * r1;

	var x21 = Math.cos(toRadian(ang + 180)) * r1 + x11;
	var y21 = Math.sin(toRadian(ang + 180)) * r1 + y11;

	var ctx = getContext(canvasId);
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x21, y21);
	ctx.lineTo(x21, y21);
	ctx.lineTo(x2, y2);

	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 10;
	ctx.shadowColor = "#6F6F6F";
	ctx.fill();

	ctx.restore();
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x21, y21);
	ctx.lineTo(x21, y21);
	ctx.lineTo(x2, y2);

	ctx.save();

	if (style == '3D')
		ctx.fillStyle = getCilinderGradient1(ctx, x1, y1, x2, y2, cir.color,
				cir.endColor);
	else
		ctx.fillStyle = cir.color;

	ctx.fill();

	ctx.restore();

	ctx.strokeStyle = "grey";
	ctx.stroke();
	ctx.restore();

	cir.draw(canvasId);

}

function clearRadialIndicator(canvasId, x, y, radius, angle, style, factor) {

	var ctx = getContext(canvasId);
	fillCircle(ctx, x, y, radius * factor, 'white');

}


function rand(min, max) {
	var num = max - min;
	var r = Math.random() * num;
	r = Math.floor(r);
	return parseInt(min) + r;
}

function getRandomColor(start, end) {
	var hex = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A",
			"B", "C", "D", "E", "F");
	var color = "#";
	var i = 0;
	for (i = 0; i < 3; i++) {
		var index = rand(0, hex.length);
		var index1 = rand(start, end);
		color += hex[index1] + hex[index];
	}
	return color;
}

function getLinearGradient(ctx, start, end, color, endColor, vertical) {

	var lingrad = ctx.createLinearGradient(0, start, 0, end);
	if (!vertical) {
		lingrad = ctx.createLinearGradient(start, 0, end, 0);
	}

	lingrad.addColorStop(0, color);
	lingrad.addColorStop(1, endColor);

	return lingrad;
}

function getCilinderGradient1(ctx, x1, y1, x2, y2, color, endColor) {

	var lingrad = ctx.createLinearGradient(x1, y1, x2, y2);
	var s = color;
	var e = endColor;

	lingrad.addColorStop(0, s);
	lingrad.addColorStop(0.5, e);
	lingrad.addColorStop(0.5, e);
	lingrad.addColorStop(1, s);
	return lingrad;
}

function getCilinderGradient(ctx, start, end, color, endColor, vertical) {

	var lingrad = ctx.createLinearGradient(0, start, 0, end);
	if (!vertical) {
		lingrad = ctx.createLinearGradient(start, 0, end, 0);
	}

	var s = color;
	var e = endColor;

	lingrad.addColorStop(0, s);
	lingrad.addColorStop(0.5, e);
	lingrad.addColorStop(0.5, e);
	lingrad.addColorStop(1, s);
	return lingrad;
}

function getRadialLinearGradient(ctx, x, y, radius, radius1, color, endColor) {
	var radgrad = ctx.createRadialGradient(x, y, radius, x, y, radius1);
	radgrad.addColorStop(0, color);
	radgrad.addColorStop(1, endColor);
	return radgrad;
}

function getRadialLinearGradient1(ctx, x, y, angle, radius, radius1, color,
		endColor) {

	var rangle = (angle) * Math.PI / 180;
	var radgrad = ctx.createRadialGradient(x - radius1 / 4.5,
			y - radius1 / 4.5, radius, x - radius1 / 4.5, y - radius1 / 4.5,
			radius1 * 1.4);
	radgrad.addColorStop(0, color);
	radgrad.addColorStop(1, endColor);
	return radgrad;
}

function getRadialCilinderGradient(ctx, x, y, radius, radius1, color, endColor) {

	var radgrad = ctx.createRadialGradient(x, y, radius, x, y, radius1);
	radgrad.addColorStop(0, endColor);
	radgrad.addColorStop(0.5, color);
	radgrad.addColorStop(1, endColor);

	return radgrad;
}

function entoneColor(color, div) {

	var s = "#";
	var n = 0;
	for (n = 0; n < 3; n++) {
		var col = color.substring(2 * n + 1, 2 * n + 3);
		var d = hexToDec(col);
		var d1 = Math.floor(d * div);
		if (d1 > 255)
			d1 = 255;
		s += decToHex(d1);
	}

	return s;
}


function setShadow(ctx, offsetX, offsetY, blur) {
	ctx.shadowOffsetX = offsetX;
	ctx.shadowOffsetY = offsetY;
	ctx.shadowBlur = blur;
	ctx.shadowColor = "#6F6F6F"; 
}

var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (CP && CP.lineTo) {
	CP.dashedLine = function(x, y, x2, y2, da) {
		if (!da)
			da = [ 1, 2 ];
		this.save();
		var ang = Math.atan2((y2 - y), (x2 - x));
		var di = 0, draw = true;
		var x1 = x, y1 = y;
		this.moveTo(x1, y1);
		while (x1 < x2 || y1 < y2) {
			x1 += Math.floor(da[di] * Math.cos(ang));
			y1 += Math.floor(da[di] * Math.sin(ang));
			if (x1 > x2)
				x1 = x2;
			if (y1 > y2)
				y1 = y2;
			draw ? this.lineTo(x1 + .5, y1 + .5) : this
					.moveTo(x1 + .5, y1 + .5);
			draw = !draw;
			di++;
			if (di == da.length)
				di = 0;
		}
		this.restore();
	};
}

function drawTick(ctx, left, top, ruleOffset, ruleOrientation, tickSize,
		offset, borderWidth, borderColor) {

	if (ruleOrientation == 'vertical') {
		drawLine(ctx, left - (tickSize * offset), top + ruleOffset, left
				- (tickSize * offset) - tickSize, top + ruleOffset,
				borderWidth, borderColor);
	} else {
		drawLine(ctx, left + ruleOffset, top - (tickSize * offset), left
				+ ruleOffset, top - (tickSize * offset) - tickSize,
				borderWidth, borderColor);
	}

}

function drawRadialTick(ctx, left, top, radius, angle, ruleOrientation,
		tickSize, offset, borderWidth, borderColor) {

	var rangle = (angle) * Math.PI / 180;

	var x1 = left + radius * Math.cos(rangle);
	var y1 = top + radius * Math.sin(rangle);

	var x2 = left + (radius + tickSize * offset) * Math.cos(rangle);
	var y2 = top + (radius + tickSize * offset) * Math.sin(rangle);

	if (offset == 0.5) {
		x1 = left + (radius - tickSize * offset) * Math.cos(rangle);
		y1 = top + (radius - tickSize * offset) * Math.sin(rangle);
		x2 = left + (radius + tickSize * offset) * Math.cos(rangle);
		y2 = top + (radius + tickSize * offset) * Math.sin(rangle);
	}

	drawLine(ctx, x1, y1, x2, y2, borderWidth, borderColor);

}

function getTextWidth(ctx, font, text) {
	ctx.save();
	ctx.font = font;
	var textWidth = ctx.measureText(text);
	ctx.restore();
	return textWidth.width;
}

function getTextHeight(font) {
	var numb = font.match(/\d+/g);
	return parseInt(numb);
}

function getTextArray(ctx, text, font, width) {
	var aux = '';
	var result = new ArrayList();
	result.init();
	var m = 0;
	for ( var n = 0; n <= text.length; n++) {
		aux = text.substring(m, n);
		var waux = getTextWidth(ctx, font, aux);
		if (waux > width) {
			var s = aux.substring(0, aux.length - 2);
			result.add(s);
			aux = '';
			m = n - 2;
		}
	}

	if (aux != '')
		result.add(aux);

	return result;
}

function getPalette() {
	var a = [ '#F8DE6E', '#B594A1', '#AED5E1', '#FDC480', '#C1AEF5', '#B3DEDB',
			'#C1E4A8', '#BAB0DF', '#C3E9D1', '#C2B2B5', '#89A8E0', '#DCEEA4',
			'#e37222', '#8c6cd0', '#33c2cb', '#b88454', '#796cbf', '#19b271',
			'#cc0033', '#4060af', '#93ab05', '#EAAB00', '#8F6678', '#3892ab',
			'#a17700', '#56364d', '#004165', '#bd4f19', '#4f2d7f', '#007ab7',
			'#803d0d', '#473b63', '#008452', '#990033', '#162274', '#6180e02'

	];

	if (arguments.length > 0) {
		var a1 = new Array();
		var num = arguments[0];
		var m = 0;
		for ( var n = num; n < a.length; n++) {
			a1[m] = a[n];
			m++;
		}
		for ( var n = 0; n < num; n++) {
			a1[m] = a[n];
			m++;
		}
		return a1;
	} else {
		return a;
	}
}

function getPalette255() {
	var c = new Array('FF', 'CC', '99', '66', '33', '00');
	var a = new Array();
	var n=0;
	for (i = 0; i < 6; i++) {
		for (j = 0; j < 6; j++) {
			for (k = 0; k < 6; k++) {
				l = c[i] + c[j] + c[k];
				a[n] = l;
				n++;
			}
		}
	}
}

function doTooltip(uid,dimension,mouseX,mouseY){
	var canvas=document.createElement('canvas');
	canvas.setAttribute("id","ttip_"+uid);
	canvas.style.zIndex=999;
	canvas.style.left=0;
	canvas.style.top=0;
	canvas.setAttribute("width",dimension.width+10);
	canvas.setAttribute("height",dimension.height+10);
	
	var tooltip=document.createElement("div");
	tooltip.style.position="absolute";
	tooltip.style.zIndex="999";
	tooltip.style.width=dimension.width+10;
	tooltip.style.height=dimension.height+10;
	
	
	var x=(mouseX+15);
	var y=mouseY-5;
	tooltip.style.left=x+"px";
	tooltip.style.top=y+"px";
	
	
	
	tooltip.setAttribute("id","ttipdiv_"+uid)
	
	var body=document.getElementsByTagName("body");
	body[0].appendChild(tooltip);
	tooltip.appendChild(canvas);
	tooltip.bodyId=canvas.id;
	return tooltip;
}

function removeTooltip(obj){
	if(obj){
		var ele=document.getElementsByTagName("body");
		ele[0].removeChild(obj);
		return null;
	}
}
