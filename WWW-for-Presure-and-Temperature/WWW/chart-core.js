function addProperties(obj, properties) {
	var props = properties;
	for ( var z in props) {
		if (z == 'values') {
			var values = props[z];
			var n = 0;
			for (n = 0; n < values.length; n++) {
				obj.add({
					value : values[n]
				});
			}
		} else {
			obj[z] = props[z];
		}
	}
}

function h5Chart() {
	this.animate = false;
	this.left;
	this.top;
	this.width;
	this.height;
	this.title;
	this.border;
	this.style = '3D';
	this.shadow;
	this.palette;
	this.uid;

	this.tooltip=null;
	this.tooltipStyle=null;
	
	this.showTooltip = true;

	this.selection='none';
		
	this.regionManager;
	
	this.posfunction;
	
	this.onclick;
	this.onmousemove;
	this.onmouseup;
	this.onmousedown;
	this.onselection;

	setProperties(this, arguments[0]);

	this.setTooltipStyle = function() {
		this.tooltipStyle = new Style();
		this.tooltipStyle.set(arguments[0]);
	};
	
	this.hideTooltip = function() {
		this.tooltip = removeTooltip(this.tooltip);
	};

	this.set = function() {
		setProperties(this, arguments[0]);
	};

	this.randomPalette = function(size) {
		var palette = new Array();
		for ( var n = 0; n < size; n++) {
			palette[n] = getRandomColor(0, 15);
		}
		return palette;
	};

}

function ArrayList() {

	this.list;

	this.init = function() {
		this.list = new Array;
	};

	this.add = function(obj) {
		this.list[this.list.length] = obj;
	};

	this.set = function(index, obj) {
		this.list[index] = obj;
	};

	this.remove = function(index){
		this.list.splice(index, 1);
	};
	
	this.get = function(index) {
		return this.list[index];
	};

	this.length = function() {
		return this.list.length;
	};

	this.concat = function() {
		this.list.concat(arguments);
	};

}

function GenericSerie() {

	this.color;

	this.title;

	this.valueStyle;
	
	this.tooltipStyle;
	
	this.setValueStyle = function() {
		this.valueStyle = new Style();
		setProperties(this.valueStyle, arguments[0]);
	};
	
	this.setTooltipStyle = function() {
		this.tooltipStyle = new Style();
		setProperties(this.tooltipStyle, arguments[0]);
	};

	this.setTitle = function() {
		this.title = new Title();
		setProperties(this.title, arguments[0]);
	};

}

GenericSerie.prototype = new ArrayList();

function Serie() {

	this.borderWidth = 4;
	
	this.pointRadius = 4;
	
	this.fillStyle = 'v-cilinder';
	
	this.shadow=true;
	

	this.axis = 0;


	this.type='line';

	this.stackedOn;

	this.init();


	this.sum = function() {
		var n = 0;
		var sum = 0;

		for (n = 0; n < this.list.length; n++) {
			var r = this.list[n];
			sum += r.value;
		}

		return sum;
	};


	this.max = function() {
		var m;
		var n = 0;
		for (n = 0; n < this.list.length; n++) {
			var r = this.list[n];
			if (!m) {
				m = r.value;
			} else if (m < r.value) {
				m = r.value;
			}
		}

		return m;
	};


	this.min = function() {
		var m;
		var n = 0;
		for (n = 0; n < this.list.length; n++) {
			var r = this.list[n];
			if (!m) {
				m = r.value;
			} else if (m > r.value) {
				m = r.value;
			}
		}

		return m;
	};

	this.clone = function(){
		var np=new Serie();
		np.init();
		cloneProperties(this,np,['borderWidth',
		                         'pointRadius',
		                         'fillStyle',
		                         'shadow',
		                         'type',
		                         'color',
		                         'title',
		                         'valueStyle',
		                         'tooltipStyle']);
		return np;
	};
	
}

Serie.prototype = new GenericSerie();

function Style() {
	this.font = 'bold 11.5 px Arial';
	this.mask = function(value) {
		return value;
	};
	this.color = 'grey';
	this.align;
	this.orientation; // angle
	this.borderWidth;

	setProperties(arguments[0]);


	this.set = function() {
		setProperties(this, arguments[0]);
	};

	this.fontSize = function() {
		var patt1 = new RegExp();
		patt1.compile("[0-9]+");
		var size = patt1.exec(this.font);
		return parseInt(size);
	};

}


function Title() {
	this.text="";
	
	setProperties(this,arguments[0]);
	
}

Title.prototype = new Style();

function Limits() {
	this.min;
	this.max;
	this.intervals;

	this.scale = function(value, size) {
		return value * size / (this.max - this.min);
	};


	this.set = function() {
		setProperties(this, arguments[0]);
	};

};

function RadialLimits() {

	this.startAngle;
	this.endAngle;

	this.angle = function(value) {
		return value * (this.endAngle - this.startAngle)
				/ (this.max - this.min);
	}

};

RadialLimits.prototype = new Limits();

function defaultLabelStyle(obj){
	if(!obj.labelStyle)
		obj.setLabelStyle({
			mask : 			function (val){ return val;} ,
			font : 			'11px Arial',
			color: 			'grey'
		});
};

function defaultTooltipStyle(obj){
	if(!obj.tooltipStyle)
		obj.setTooltipStyle({
			mask : 			function (val){ return val;} ,
			font : 			'11px Arial',
			color: 			'grey'
		});
};

function defaultCurrentStyle(obj){
	if(!obj.currentStyle)
		obj.setCurrentStyle({
			mask : 			function (val){ return val;} ,
			font : 			'11px Arial',
			color: 			'grey'
		});
};


function OneDimensionGraph() {
	this.showValue = true;
	this.min;
	this.max;
	this.serie;

	this.intervals;
	this.current;
	this.indicatorColor = '#B0B040';
	this.currentStyle;
	this.labelStyle;

	this.setCurrentStyle = function() {
		this.currentStyle = new Style();
		this.currentStyle.set(arguments[0]);
	};

	this.setLabelStyle = function() {
		this.labelStyle = new Style();
		this.labelStyle.set(arguments[0]);
	};

	this.init = function() {
		this.serie = new Serie();
		this.serie.init();

		defaultCurrentStyle(this);
		defaultLabelStyle(this);
		defaultTooltipStyle(this);

	};

	this.init();
	
	this.drawLabel = function(canvasId, dimension) {

		defaultLabelStyle(this);
		
		var val = this.current;
		if (this.tooltipStyle)
			val = this.tooltipStyle.mask(val);

		var ctx = getContext(canvasId);
		ctx.font = this.tooltipStyle.font;
		var fs = this.tooltipStyle.fontSize();

		var tw = ctx.measureText(val).width;

		var x, y, h;

		var m = 1;
		var th = m * fs;
		var y = 3 + fs;

		fillRoundRect(ctx, 1, 1, tw + 12, th + 6, 5, "#FFFAC9", new Shadow({
			offsetX : 2,
			offsetY : 2,
			blur : 7
		}));
		drawRoundRect(ctx, 1, 1, tw + 12, th + 6, 5, 1, "grey");
		drawText(canvasId, 5, y + 0 * fs, val, 0, this.tooltipStyle.color,
				this.tooltipStyle.font, "left");
		
	};

	this.getLabelDimension = function(canvasId, dim) {

		defaultLabelStyle(this);
		
		var val = this.current;
		if (this.tooltipStyle)
			val = this.tooltipStyle.mask(val);

		var ctx = getContext(canvasId);
		ctx.font = this.tooltipStyle.font;
		var fs = this.tooltipStyle.fontSize();

		var tw = ctx.measureText(val).width;

		var m = 1;
		var th = m * fs;

		return {
			width : tw + 12,
			height : th + 6
		};

	};

	this.isPointInPath = function(canvasId, x, y) {
		
		var dimension = this.getDimension();
		var ret = null;
		
		var ctx = getContext(canvasId);
		ctx.save();
		ctx.beginPath();
		this.getSection(canvasId, dimension);
		ctx.closePath();
		var b = ctx.isPointInPath(x, y);
		ctx.restore();
			
		if (b) 
			ret = { current: this.current };
		
		return ret;

	};

	this.getDimension = function() {
		return {
			left : this.left,
			top : this.top,
			width : this.width,
			height : this.height
		};
	};

	this.getPoints = function(dim){
		var points = new Array();
		points[0]=new Point(dim.left,dim.top);
		points[1]=new Point(dim.left+dim.width,dim.top);
		points[2]=new Point(dim.left+dim.width,dim.top+dim.height);
		points[3]=new Point(dim.left,dim.top+dim.height);
		points[4]=points[0];
		return points;
	};
	
	this._onmousemove = function() {
		var result = arguments[0];
		this.highlight(this.canvasId, this.current);
		
		if(this.onmousemove)
			setTimeout(this.onmousemove(arguments[0]),10);
		
	};
	
	this._onclick = function() {
		var result = arguments[0];
		this.highlight(this.canvasId, this.current);
		
		if(this.onclick)
			setTimeout(this.onclick(result),10);
	};
	
	this._onmouseup = function() {
		if(this.onmouseup)
			setTimeout(this.onmouseup(arguments[0]),10);
	};
	
	this._onmousedown = function() {
		if(this.onmousedown)
			setTimeout(this.onmousedown(arguments[0]),10);
	};
	
	this._onselection = function() {
		if(this.onselection)
			setTimeout(this.onselection(arguments[0]),10);
	};
	
	this.getSection = function(canvasId,dim,serieNum,seriePos){
		var ctx = getContext(canvasId);
		polyPath(ctx, this.getPoints(dim));
	};
	
	this.highlight = function(canvasId) {
		var dimension = this.getDimension();
		if (this.showTooltip) {
			var dl = this.getLabelDimension(canvasId, dimension);
			this.tooltip = doTooltip(this.uid, dl, this.mouseX, this.mouseY);
			this.drawLabel(this.tooltip.bodyId, dimension);
		}
	};
	
}

OneDimensionGraph.prototype = new h5Chart();

function MultiDimensionGraph() {

	this.series;
	this.labels;

	this.init = function() {
		this.labels = new GenericSerie();
		this.series = new ArrayList();
		this.series.init();
		this.labels.init();
		
		
		defaultTooltipStyle(this);
	};

	this.setLabels = function() {
		addProperties(this.labels, arguments[0]);
	};

	this.labelsLength = function() {
		return this.labels.length();
	};

	this.getLabel = function(index) {
		return this.labels.get(index);
	};

	this.setSerie = function() {
		var s = new Serie();
		s.init();
		this.series.add(s);
		addProperties(s, arguments[0]);
	};
	
	this.getSerie = function(index) {
		return this.series.get(index);
	};
	this.seriesLength = function() {
		return this.series.length();
	};

	this.setValueStyle = function() {
		this.labels.valueStyle = new Style();
		this.labels.valueStyle.set(arguments[0]);
	};

	this.setSerieValueStyle = function(index, valueStyle) {
		this.series.get(index).setValueStyle(valueStyle);
	};
	
	this.getSerieValueStyle = function(index){
		return this.series.get(index).valueStyle;	
	};

	this.setSerieTooltipStyle = function(index, tooltipStyle){
		this.series.get(index).setTooltipStyle(tooltipStyle);
	};
	
	this.getSerieTooltipStyle = function(index){
		return this.series.get(index).tooltipStyle;
	};
	
	this.drawLabel = function(canvasId, dimension, serieNum, seriePos) {

		var values = this.getSerie(serieNum);
		var val = values.get(seriePos).value;
		
		var style;
		if (values.tooltipStyle){
			style=values.tooltipStyle;
		} else if (values.valueStyle){
			style=values.valueStyle;
		} else {
			style=this.labels.valueStyle;
		}

		val = style.mask(values.get(seriePos).value);

		var labl = this.labels.get(seriePos).value;
		var tit = "";
		if (values.title)
			tit = values.title.text;

		var ctx = getContext(canvasId);

		var obj = this.labels;
		ctx.font = style.font;
		var fs = style.fontSize();

		var tw = Math.max(ctx.measureText(tit).width, Math.max(ctx
				.measureText(val).width, ctx.measureText(labl).width));

		var x, y, h;

		var m = 2;
		if (tit != "")
			m = 3;

		var th = m * fs;
		var y = 3 + fs;

		fillRoundRect(ctx, 1, 1, tw + 12, th + 6, 5, "#FFFAC9", new Shadow({
			offsetX : 2,
			offsetY : 2,
			blur : 7
		}));
		drawRoundRect(ctx, 1, 1, tw + 12, th + 6, 5, 1, "grey");

		var n = 0;

		drawText(canvasId, 5, y + n * fs, labl, 0, style.color,
				style.font, "left");
		n++;

		if (tit != "") {
			drawText(canvasId, 5, y + n * fs, tit, 0, style.color,
					style.font, "left");
			n++;
		}

		drawText(canvasId, 5, y + n * fs, val, 0, style.color,
				style.font, "left");

	};

	this.getLabelDimension = function(canvasId, dim, serieNum, seriePos) {

		var values = this.getSerie(serieNum);
		var val = values.get(seriePos).value;
		var style;
		if (values.tooltipStyle){
			val = values.tooltipStyle.mask(values.get(seriePos).value);
			style=values.tooltipStyle;
		} else if (values.valueStyle){
			val = values.valueStyle.mask(values.get(seriePos).value);
			style=values.valueStyle;
		} else {
			style=this.labels.valueStyle;
		}
		
		var labl = this.labels.get(seriePos).value;
		var tit = "";
		if (values.title)
			tit = values.title.text;

		var ctx = getContext(canvasId);
		ctx.font = style.font;
		var fs = style.fontSize();

		var tw = Math.max(ctx.measureText(tit).width, Math.max(ctx
				.measureText(val).width, ctx.measureText(labl).width));

		var m = 2;
		if (tit != "")
			m = 3;
		var th = m * fs;

		return {
			width : tw + 12,
			height : th + 6
		};

	};

	this.isPointInPath = function(canvasId, x, y) {
		
		var dimension = this.getDimension();
		var ret = null;
		
		for ( var serieNum = 0; serieNum < this.series.length(); serieNum++) {
			for ( var seriePos = 0; seriePos < this.labelsLength(); seriePos++) {
				var ctx = getContext(canvasId);
				ctx.save();
				ctx.beginPath();
				this.getSection(canvasId, dimension, serieNum, seriePos );
				ctx.closePath();
				var b = ctx.isPointInPath(x, y);
				ctx.restore();
				
				if (b) 
					ret = { serie:serieNum,position:seriePos,serieNum: serieNum, seriePos: seriePos };
			}
		}
		return ret;

	};

	this._onclick = function() {
		var result = arguments[0];
		if(this.onclick)
			setTimeout(this.onclick(result),10);
	};
	
	this._onmousemove = function() {
		var result = arguments[0];
		this.highlight(this.canvasId, result.selection.serieNum,result.selection.seriePos);
		
		if(this.onmousemove)
			setTimeout(this.onmousemove(arguments[0]),10);
		
	};
	
	this._onmouseup = function() {
		if(this.onmouseup)
			setTimeout(this.onmouseup(arguments[0]),10);
	};
	
	this._onmousedown = function() {
		if(this.onmousedown)
			setTimeout(this.onmousedown(arguments[0]),10);
	};
	
	this._onselection = function() {
		if(this.onselection)
			setTimeout(this.onselection(arguments[0]),10);
	};
	
	
}

MultiDimensionGraph.prototype = new h5Chart();

function RegionManager() {
	this.regions;

	this.init = function() {
		this.regions = new ArrayList();
		this.regions.init();
	};

	this.init();

	this.add = function(obj) {
		this.regions.add(obj);
	};

	this.set = function(obj) {
		
		if(!obj.uid || obj.uid==null){
			if(obj.canvasId){
				var c=document.getElementById(obj.canvasId);
				obj.uid=c.getUid();
			}
		}
		
		for ( var i = 0; i < this.regions.length(); i++) {
			var reg = this.regions.get(i);
			if (reg.uid == obj.uid) {
				if(reg.hideTooltip)
					reg.hideTooltip();
				this.regions.set(i, obj);
				return;
			}
		}
		this.regions.add(obj);
	};

	this.clear = function(){
		for ( var i=this.regions.length()-1;i>=0; i--) {
			var reg = this.regions.get(i);
			if(reg.hideTooltip)
				reg.hideTooltip();
			this.regions.remove(i);
		}
	};
	
	this.remove = function(obj){
		for ( var i=this.regions.length()-1;i>=0; i--) {
			var reg = this.regions.get(i);
			if (reg.uid == obj.uid) {
				if(reg.hideTooltip)
					reg.hideTooltip();
				this.regions.remove(i);
				return;
			}
		}
	};

	this.removeById = function(uid){
		for ( var i=this.regions.length()-1;i>=0; i--) {
			var reg = this.regions.get(i);
			if (reg.uid == uid) {
				if(reg.hideTooltip)
					reg.hideTooltip();
				this.regions.remove(i);
				return;
			}
		}
	};
	
	
	this.hideTooltip= function(){
		for(var n=0;n<this.regions.length();n++){
			var reg=this.regions.get(n);
			if(reg.hideTooltip)
				reg.hideTooltip();
		}
	};
	
};

function updateImage(){
	
	var ctx= this.getContext("2d");
	this.lastImg = ctx.getImageData(0, 0, this.width, this.height);
}

HTMLCanvasElement.prototype.updateImage=updateImage;

function onClick(event) {

	var coords = relMouseCoords(event);
	var canvasX = parseFloat(coords.x);
	var canvasY = parseFloat(coords.y);

	var canvas = event.target;
	var ctx = getContext(canvas.id);
	if (this.lastImg) {
		ctx.putImageData(this.lastImg, 0, 0);
	}
	this.lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);

	for ( var n = 0; n < this.regions.length(); n++) {
		var obj = this.regions.get(n);

		if (obj.hideTooltip)
			obj.hideTooltip();

		var m = obj.isPointInPath(event.target.id, canvasX, canvasY);
		obj.mouseX = event.pageX;
		obj.mouseY = event.pageY;
		if (m && obj._onclick)
			obj._onclick({event:event,x:canvasX,y:canvasY,region:obj,selection:m});
	}
};

function onMouseMove(event) {

	
	if(this.isAnimationInProgress()) return;
	
	var coords = relMouseCoords(event);
	var canvasX = parseFloat(coords.x);
	var canvasY = parseFloat(coords.y);
	var points=new Array();
	var canvas = event.target;
	var ctx = getContext(canvas.id);
	if (this.lastImg) {
		ctx.putImageData(this.lastImg, 0, 0);
	}
	this.lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var al=ctx.globalAlpha;
	if(!(!this.from || (this.from && this.from.selection=='none'))){
		ctx.globalAlpha=0.3;	
		var x=canvasX;
		if(this.from.selection=='wide'){
			if(x<this.from.left) x=this.from.left;
			if(x>this.from.left+this.from.width) x=this.from.left+this.from.width;
			points[0]=new Point(this.from.x,this.from.top);
			points[1]=new Point(x,this.from.top);
			points[2]=new Point(x,this.from.top+this.from.height);
			points[3]=new Point(this.from.x,this.from.top+this.from.height);
			points[4]=new Point(this.from.x,this.from.top);
		} else {
			points[0]=new Point(this.from.x,this.from.y);
			points[1]=new Point(canvasX,this.from.y);
			points[2]=new Point(canvasX,canvasY);
			points[3]=new Point(this.from.x,canvasY);
			points[4]=new Point(this.from.x,this.from.y);
		}
	} else {
		
		if(this.from){
			ctx.globalAlpha=0.3;
			points[0]=new Point(this.from.x,this.from.y);
			points[1]=new Point(canvasX,this.from.y);
			points[2]=new Point(canvasX,canvasY);
			points[3]=new Point(this.from.x,canvasY);
			points[4]=new Point(this.from.x,this.from.y);
		}
	}
		
	if(points && points.length>0){
		fillPoly(ctx, points, "#FFFA80", null, "round");
		drawPoly(ctx, points, 1, "grey", null, "round");
		ctx.globalAlpha=al;
		return;
	}
	
	canvas.style.cursor='default';
	
	for ( var n = 0; n < this.regions.length(); n++) {
		var obj = this.regions.get(n);

		if (obj.hideTooltip)
			obj.hideTooltip();
		
		var m = obj.isPointInPath(event.target.id, canvasX, canvasY);
		if (m){
			canvas.style.cursor='pointer';
			obj.mouseX = event.pageX;
			obj.mouseY = event.pageY;
			if (m && obj._onmousemove){
				obj._onmousemove({event:event,x:canvasX,y:canvasY,region:obj,selection:m});
			}
		}
	}
	
};

function onMouseDown(event) {
	
	if(this.isAnimationInProgress()) return;
	
	var coords = relMouseCoords(event);
	var canvasX = parseFloat(coords.x);
	var canvasY = parseFloat(coords.y);
	
	var canvas = event.target;
	canvas.style.cursor='pointer';
	var ctx = getContext(canvas.id);
	if (this.lastImg) {
		ctx.putImageData(this.lastImg, 0, 0);
	}
	this.lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	var top=0;
	var height=0;
	var width=0;
	var left=0;
	var reg=-1;
	var sel='none';
	
	this.from = {event:event,x:canvasX,y:canvasY,top:top ,height:height,width:width,left:left,selection:sel,region:reg};
	
	for ( var n = 0; n < this.regions.length(); n++) {
		var obj = this.regions.get(n);

		if(obj.top<=canvasY && obj.top+obj.height>canvasY &&
				obj.left<=canvasX && obj.left+obj.width>canvasX ){
			var dim=obj.getDimension();
			top=dim.top;
			height=dim.height;
			left=dim.left;
			width=dim.width;
			sel=obj.selection;
			reg=n;
			this.from = {x:canvasX,y:canvasY,top:top ,height:height,width:width,left:left,selection:sel,region:reg};
			
			if (obj._onmousedown){
				obj._onmousedown({event:event,x:canvasX,y:canvasY,region:obj});
			}
			break;
		}
				
	}
	
};
	
function onMouseUp(event) { 

	if(this.isAnimationInProgress()) return;
	
	var coords = relMouseCoords(event);
	var canvasX = parseFloat(coords.x);
	var canvasY = parseFloat(coords.y);
	var canvas = event.target;
	canvas.style.cursor='default';
	
	var points=new Array();
	
	if(this.from.selection=='wide'){
		points[0]=new Point(this.from.x,this.from.top);
		points[1]=new Point(canvasX,this.from.top);
		points[2]=new Point(canvasX,this.from.top+this.from.height);
		points[3]=new Point(this.from.x,this.from.top+this.from.height);
		points[4]=new Point(this.from.x,this.from.top);
	} else {
		points[0]=new Point(this.from.x,this.from.y);
		points[1]=new Point(canvasX,this.from.y);
		points[2]=new Point(canvasX,canvasY);
		points[3]=new Point(this.from.x,canvasY);
		points[4]=new Point(this.from.x,this.from.y);
	}
	
	var a=new Array();
	var co=0;
	
	
	for ( var n = 0; n < this.regions.length(); n++) {
		var obj = this.regions.get(n);
		if(obj.isSerieIn){		
			var m = obj.isSerieIn(points);
			if (m){
				m.object=obj;
				a[co]=m;
				co++;
				if (obj._onmouseup){
					obj._onmouseup({event:event,x:canvasX,y:canvasY,region:obj,selection:m});
				}
				if (obj._onselection){
					obj._onselection({event:event,x:canvasX,y:canvasY,region:obj,selection:m});
				}
			}
		} else {
			var m = obj.isPointInPath(event.target.id, canvasX, canvasY);
			if (m){
				if (obj._onmouseup){
					obj._onmouseup({event:event,x:canvasX,y:canvasY,region:obj,selection:m});
				}
			}
		}
	}
	
	this.from=null;
	
}

function getLimits(points){

	var maxX=0;
	var maxY=0;
	var minX=10000;
	var minY=10000;	
	for(var n=0;n<points.length;n++){
		maxX=Math.max(maxX,points[n].x);
		maxY=Math.max(maxY,points[n].y);
		minX=Math.min(minX,points[n].x);
		minY=Math.min(minY,points[n].y);
	}	
	
	return {maxX:maxX,maxY:maxY,minX:minX,minY:minY};
	
}

function initRegionManager() {
	var rm = new RegionManager();
	rm.init();
	this.regions = rm.regions;
	this.regionManager = rm;
	this.onclick = onClick;
	this.onmousemove= onMouseMove;
	this.onmousedown= onMouseDown;
	this.onmouseup= onMouseUp;
	
	this.startAnimationInProgress=startAnimationInProgress;
	this.isAnimationInProgress=isAnimationInProgress;
	this.stopAnimationInProgress=stopAnimationInProgress;
	
	if(!this.animations){ 
		this.animations=new ArrayList();
		this.animations.init();
	}
	
};

HTMLCanvasElement.prototype.initRegionManager = initRegionManager;

function getRegionManager() {
	return this.regionManager;
};

HTMLCanvasElement.prototype.getRegionManager = getRegionManager;

function getUid() {
	if (!this.uid)
		this.uid = 0;
	this.uid++;
	return 'h5' + this.uid;
}

HTMLCanvasElement.prototype.getUid = getUid;

function relMouseCoords(event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = event.target;

	do {
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	} while (currentElement = currentElement.offsetParent);

	canvasX = event.pageX - totalOffsetX;
	canvasY = event.pageY - totalOffsetY;
 	
	return {
		x : canvasX,
		y : canvasY,
		mouseX : event.pageX,
		mouseY : event.pageY
	};
}

function getCanvasObjectUid(canvasId) {
	var canvas = document.getElementById(canvasId);
	var uid = canvas.getUid();
	return uid;
}

function isAnimationInProgress(){

	if(!this.animations) return false;
	
	if(this.animations.length()>0)return true;
	return false;
}

HTMLCanvasElement.prototype.isAnimationInProgress=isAnimationInProgress;

function startAnimationInProgress(object){
	if(!this.animations){ 
		this.animations=new ArrayList();
		this.animations.init();
	}
	this.animations.add(object.uid);
}

HTMLCanvasElement.prototype.startAnimationInProgress=startAnimationInProgress;

function stopAnimationInProgress(object){			
	for(var n=this.animations.length();n>=0;n--){
		if(this.animations.get(n)==object.uid)
			this.animations.remove(n);
	}
}

HTMLCanvasElement.prototype.stopAnimationInProgress=stopAnimationInProgress;

function cloneProperties(obj,newObj,propsArray){
	
	for(var n=0;n<propsArray.length;n++){
		var p=propsArray[n];
		newObj[p]=obj[p];
	}
	
	return newObj;
	
}

function setSeriesFromSelection(obj,newObj,arg){
	if(arg){
		var selection = arg.selection;
		var arrl=new Array();
		var arrv=new Array();
		var arrc=new Array();
		for(var n=0;n<selection.labels.length;n++){
			var lbl= obj.labels.get(selection.labels[n]);
			arrl[n]= lbl.value;
			var s=obj.series.get(0);
			arrv[n]= s.get(selection.series[n].position).value;
			arrc[n]=obj.palette[selection.labels[n]];
		}
		newObj.setLabels({values : arrl});
		newObj.setSerie({values : arrv});	
		newObj.palette=arrc;
	}	
}

function setSeriesFromSelectionMulti(obj,newObj,arg){
	if(arg){
		var selection = arg.selection;
		var arrl=new Array();
		var arrv=new Array();
		var arrc=new Array();
		var arrSeries= new Array();
		
		for(var n=0;n<selection.labels.length;n++){
			var lbl= obj.labels.get(selection.labels[n]);
			arrl[n]= lbl.value;
		}
		
		newObj.setLabels({values : arrl});
		
		var ccount=0;
		for(var series=0;series<selection.series.length;series++){
			var selected=selection.series[series];
			console.log(selected);
			if(!arrSeries[selected.serie]){
				var serie=obj.series.get(selected.serie);
				var newSerie=serie.clone();
				arrSeries[selected.serie]=newSerie;
				arrc[ccount]=obj.palette[selected.serie];
				ccount++;
			}
			arrSeries[selected.serie].add({value:selected.value});
		}
		
		newObj.palette=arrc;
		
		for(var series=0;series<arrSeries.length;series++){
			if(arrSeries[series]){
				newObj.series.add(arrSeries[series]);
			}
		}
		
	}	
}