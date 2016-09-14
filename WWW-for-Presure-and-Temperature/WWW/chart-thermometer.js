function Thermometer() {
	this.min;
	this.max;

	this.getDimension1 = function() {

		var rad = this.width / 6;
		var metw = this.width / 6;
		var ang2 = 1.5 * Math.PI - Math.asin(metw / 2 / rad);
		var ang1 = 1.5 * Math.PI + Math.asin(metw / 2 / rad);

		var meth = this.height - (Math.abs(rad * Math.sin(ang1)) + rad);
		var cirleft = this.left + rad;
		var cirtop = this.top + this.height - rad;
		var mettop = this.top;
		var metleft = this.left + metw * .5;

		return {
			left : this.left,
			top : this.top,
			mettop : mettop,
			metleft : metleft,
			metwidth : metw,
			metheight : meth,
			cirleft : cirleft,
			cirtop : cirtop,
			cirrad : rad,
			cirang1 : ang1,
			cirang2 : ang2
		};

	};

	this.drawBackGround = function(canvasId) {
		var dim = this.getDimension1();

		var ctx = getContext(canvasId);

		ctx.beginPath();
		thermometerPath(ctx, dim);
		ctx.lineWith = .5;
		ctx.strokeStyle = "grey";

		ctx.stroke();
		ctx.save();
		ctx.fillStyle = "#FFFFDD";

		setShadow(ctx, 0, 0, 6);
		ctx.strokeStyle = "#FFFFDD";
		ctx.stroke();
		ctx.fill();
		ctx.restore();

	};

	this.scale = function() {
		var dimension = this.getDimension1();
		var cur = this.current;
		if (cur < this.min)
			cur = this.min;
		if (cur > this.max)
			cur = this.max;
		var val = (dimension.metheight - 15) * (cur - this.min)
				/ (this.max - this.min);
		return val;
	};

	this.indicator = function(canvasId) {
		var ctx = getContext(canvasId);
		var dim1 = this.getDimension1();
		var sc = this.scale();
		dim1.cirrad -= 4;
		dim1.metleft += 4;
		dim1.metwidth -= 8;

		var ant = dim1.mettop + dim1.metheight;
		dim1.mettop = ant - sc - 9;
		dim1.metheight = sc + 9;
		ctx.beginPath();
		thermometerPath(ctx, dim1);
		ctx.fillStyle = "red";
		ctx.strokeStyle = "#8F0000";
		ctx.stroke();
		ctx.fill();
	};

	this.drawIndicator = function(canvasId) {
		if (this.animate) {
			var cur = this.min;
			var current = this.current;
			var inc = (current - this.min) / 10;
			var obj = this;

			var f = setInterval(function() {
				obj.current = cur;
				obj.indicator(canvasId);
				if (cur > current - inc) {
					clearInterval(f);
					obj.current = current;
					obj.indicator(canvasId);
					
					if(obj.regionManager)
						obj.regionManager.set(obj);
					obj.hideTooltip();
					document.getElementById(canvasId).updateImage();
					document.getElementById(canvasId).stopAnimationInProgress(obj);
					
				} else
					cur += inc;

			}, 50);
		} else {
			this.indicator(canvasId);
			if(this.regionManager)
				this.regionManager.set(this);
			this.hideTooltip();
			document.getElementById(canvasId).updateImage();
			document.getElementById(canvasId).stopAnimationInProgress(this);
		}
	};

	this.drawRule = function(canvasId) {
		var rule = new Rule();
		var dimension = this.getDimension1();

		rule = new Rule(dimension.metleft + dimension.metwidth + 6,
				dimension.top + 6, dimension.metheight - 15, this.intervals,
				'vertical', true, this.labelStyle, this.min, this.max);

		rule.tickOrientation = "under";
		rule.tickMode = "med";
		rule.color = "grey";
		rule.borderColor = "grey";
		rule.draw(canvasId);
	};

	this.draw = function(canvasId) {
		
		this.canvasId=canvasId;
		if (!this.regionManager)
			this.regionManager = document.getElementById(canvasId)
					.getRegionManager();
		
		var canvas=document.getElementById(canvasId);
		canvas.startAnimationInProgress(this);
		
		this.drawBackGround(canvasId);
		this.drawRule(canvasId);
		this.drawCurrentLabel(canvasId);
		this.drawIndicator(canvasId);

	};

	this.drawCurrentLabel = function(canvasId) {
		var labl = this.current;
		var dim = this.getDimension1();
		var arr = (this.currentStyle.mask(labl)+"").split("\n");
		for ( var n = 0; n < arr.length; n++) {
			
			drawText(canvasId, dim.cirleft + dim.cirrad + 5, dim.cirtop-dim.cirrad+n*this.currentStyle.fontSize(), arr[n], 0,
					this.currentStyle.color, this.currentStyle.font, "left",
					"hanging");
		};
	};

	this.setCurrent = function(current) {
		this.current = current;
		var dim=this.getDimension1();
		clearRect(getContext(this.canvasId), dim.left, dim.top, dim.width, dim.height);
		this.draw(this.canvasId);
	};
	
};

function thermometerPath(ctx, dim) {
	ctx.moveTo(dim.metleft, dim.mettop + dim.metheight);
	ctx.lineTo(dim.metleft, dim.mettop);
	ctx.lineTo(dim.metleft + dim.metwidth, dim.mettop);
	ctx.lineTo(dim.metleft + dim.metwidth, dim.mettop + dim.metheight);
	ctx.arc(dim.cirleft, dim.cirtop, dim.cirrad, dim.cirang1, dim.cirang2,
			false);
};

Thermometer.prototype = new OneDimensionGraph();
