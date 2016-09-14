function RadialMeter() {

	this.ruleInterval = 2;

	this.radialRule = false;

	this.canvasId;

	this.img;

	this.capacity = true;

	this.fillStyle = 'cilinder';

	this.ringStyle = true;

	this.startAngle = 800;

	this.endAngle = 1100;

	this.rulePosition = 'in';

	this.init();

	this.getDimension1 = function() {
		var f = this.labelStyle.fontSize();
		var offset = 1;
		var v = (10 + parseInt(f));
		var shad = 0;
		if (this.rulePosition == 'in') {
			offset = 0;
			shad = 1;
		}

		var radius = (this.width) / 2 - v * offset - 10 * shad;
		var left = this.left + radius + v * offset + 10 * shad;
		var radius1 = radius * 3 / 4;
		if (this.ringStyle == false)
			radius1 = 0;

		var top = this.top + radius + v * offset + 10 * shad;
		return {
			left : left,
			top : top,
			radius : radius,
			radius1 : radius1,
			width: 2*radius,
			height: 2*radius
		};
	};

	this.drawBackGround = function(canvasId, dimension) {

		var cir = new CircleSection();

		cir.left = dimension.left;
		cir.top = dimension.top;
		cir.radius = dimension.radius;
		cir.radius1 = dimension.radius1;
		cir.startAngle = this.startAngle;
		cir.endAngle = this.endAngle;
		cir.shadow = new Shadow({
			offsetX : 0,
			offsetY : 0,
			blur : 10
		});
		cir.color = 'white';
		cir.fillStyle = 'solid';
		cir.borderStyle = 'none';
		cir.borderColor = 'grey';
		cir.draw(canvasId);
	};

	this.drawSeries = function(canvasId, dimension) {

		if (this.serie && this.serie.length() > 0) {

			var st = this.startAngle;
			var values = this.serie;
			var fac = 1;
			if (this.ringStyle == false && this.rulePosition == 'in')
				fac = 0.7;

			for ( var n = 0; n < values.length(); n++) {
				var val = values.get(n);
				var color = val.color;
				var a = this.startAngle + (val.value - this.min)
						* (this.endAngle - this.startAngle)
						/ (this.max - this.min);

				a = Math.floor(a);

				var cir = new CircleSection();
				cir.left = dimension.left;
				cir.top = dimension.top;

				cir.radius = dimension.radius * fac;
				cir.radius1 = dimension.radius1;
				cir.startAngle = st;
				cir.endAngle = a;

				if (this.style == 'flat') {
					cir.color = color;
					cir.fillStyle = 'solid';
				} else {
					if (this.capacity) {
						cir.fillStyle = 'solid';
					} else {
						if (this.ringStyle == true)
							cir.fillStyle = 'cilinder';
						else
							cir.fillStyle = 'linear';
					}
					cir.color = entoneColor(color, 2);
				}

				cir.endColor = color;
				cir.borderStyle = 'solid';
				cir.borderColor = 'grey';

				cir.draw(canvasId);
				last = a;
				st = a;

			}
		}

	};

	this.drawIndicator = function(canvasId, dimension) {

		var val = this.current;
		var color = this.indicatorColor;

		var a = (val - this.min) * (this.endAngle - this.startAngle)
				/ (this.max - this.min);
		a = Math.floor(a);

		var cir = new CircleSection();
		cir.left = dimension.left;
		cir.top = dimension.top;

		var factor = .82;
		if (this.serie && this.serie.length() > 0)
			factor = .82;

		var r1 = dimension.radius * factor;
		var dif = (dimension.radius - r1) / 3;

		cir.radius = dimension.radius - dif;
		cir.radius1 = r1;
		cir.startAngle = this.startAngle;
		cir.endAngle = this.startAngle + a;

		if (cir.endAngle > this.endAngle)
			cir.endAngle = this.endAngle;
		if (cir.startAngle < this.startAngle)
			cir.startAngle = this.startAngle;

		if (this.style == 'flat') {
			cir.color = color;
			cir.fillStyle = 'solid';
		} else {
			cir.color = entoneColor(color, 2);
			cir.fillStyle = 'cilinder';
		}

		cir.endColor = color;
		cir.borderStyle = 'solid';
		cir.borderColor = 'grey';

		var currentAngle = this.startAngle + a;

		drawText(canvasId, dimension.left, dimension.top + 30,
				this.currentStyle.mask(this.current), 0,
				this.currentStyle.color, this.currentStyle.font, "center");

		if (currentAngle < this.startAngle)
			currentAngle = this.startAngle;
		if (currentAngle > this.endAngle)
			currentAngle = this.endAngle;

		var style = this.style;
		var counter = 0;
		var font = this.currentStyle.font;
		var col = this.currentStyle.color;
		var curval = this.currentStyle.mask(this.current);
		var angCount = (currentAngle - this.startAngle);
		var start = this.startAngle;

		if (this.animate)
			angCount = (currentAngle - this.startAngle) / 30;

		var left = this.left;
		var top = this.top;
		var fac;

		var inc = a / 30;
		// var end = this.startAngle + a;
		cir.endAngle = cir.startAngle;
		var capacity = this.capacity;
		var img = this.img;
		var obj=this;
		if (this.rulePosition == 'in') {
			if (this.ringStyle == false)
				fac = 0.7;
			if (this.animate) {
				var id1 = setInterval(function() {
					if (counter <= 30) {

						img.putImageData(canvasId, left, top);

						if (capacity) {
							cir.draw(canvasId);
							cir.endAngle += inc;
						}

						drawRadialIndicator(canvasId, dimension.left,
								dimension.top, dimension.radius, start
										+ counter * angCount, style, fac);
						drawText(canvasId, dimension.left, dimension.top + 30,
								curval, 0, col, font, "center");
					} else {
						clearInterval(id1);
						
						if(obj.regionManager)
							obj.regionManager.set(obj);
						
						obj.hideTooltip();
						document.getElementById(canvasId).updateImage();
						document.getElementById(canvasId).stopAnimationInProgress(obj);
						
					}
					counter++;
				}, 10);
			} else {

				if (capacity) {
					cir.endAngle = this.startAngle + a;
					cir.draw(canvasId);
				}

				drawRadialIndicator(canvasId, dimension.left, dimension.top,
						dimension.radius, start + angCount, style, fac);
				drawText(canvasId, dimension.left, dimension.top + 30, curval,
						0, col, font, "center");
				
				if(this.regionManager)
					this.regionManager.set(this);
				
				document.getElementById(canvasId).updateImage();
				document.getElementById(canvasId).stopAnimationInProgress(this);
				
			}
		} else {
			fac = 0.65;
			if (this.ringStyle == false)
				fac = .9;
			if (this.animate) {
				var id2 = setInterval(function() {

					if (counter <= 30) {

						img.putImageData(canvasId, left, top);

						if (capacity) {
							cir.draw(canvasId);
							cir.endAngle += inc;
						}

						drawRadialIndicator(canvasId, dimension.left,
								dimension.top, dimension.radius, start
										+ counter * angCount, style, fac);
						drawText(canvasId, dimension.left, dimension.top + 30,
								curval, 0, col, font, "center");
					} else {
						clearInterval(id2);
						
						if(obj.regionManager)
							obj.regionManager.set(obj);
						
						obj.hideTooltip();
						document.getElementById(canvasId).updateImage();
						document.getElementById(canvasId).stopAnimationInProgress(obj);
						
					}
					counter++;
				}, 10);

			} else {

				img.putImageData(canvasId, left, top);

				if (capacity) {
					cir.endAngle = this.startAngle + a;
					cir.draw(canvasId);
				}
				drawRadialIndicator(canvasId, dimension.left, dimension.top,
						dimension.radius, start + angCount, style, fac);
				drawText(canvasId, dimension.left, dimension.top + 30, curval,
						0, col, font, "center");
				
				if(this.regionManager)
					this.regionManager.set(this);
				
				document.getElementById(canvasId).updateImage();
				document.getElementById(canvasId).stopAnimationInProgress(this);
				
			}
		}
	};

	this.drawRules = function(canvasId, dimension) {
		var f;

		if (this.rulePosition == 'in') {
			var fac = 3 / 4;
			bor = 5;
			if (!this.ringStyle) {
				fac = 1;
				bor = 0;
			}
			f = new RadialRule(dimension.left, dimension.top,
					(dimension.radius - bor) * fac, this.startAngle,
					this.endAngle, this.intervals, this.labelStyle, true,
					this.min, this.max, this.ruleInterval, this.radialRule);
			f.tickOrientation = "under";
		} else {
			f = new RadialRule(dimension.left, dimension.top, dimension.radius,
					this.startAngle, this.endAngle, this.intervals,
					this.labelStyle, true, this.min, this.max,
					this.ruleInterval, this.radialRule);

			f.tickOrientation = "over";
		}

		f.tickMode = "med";
		f.color = "grey";
		f.borderColor = "grey";
		f.draw(canvasId);
	};

	this.draw = function(canvasId) {
		this.canvasId = canvasId;

		if (!this.regionManager)
			this.regionManager = document.getElementById(canvasId)
					.getRegionManager();
				
		var canvas=document.getElementById(canvasId);
		canvas.startAnimationInProgress(this);
		
		var ctx = getContext(canvasId);
		ctx.globalAlpha = 1;

		var dimension = this.getDimension1();

		this.drawBackGround(canvasId, dimension);

		this.drawRules(canvasId, dimension);

		this.drawSeries(canvasId, dimension);

		this.img = new h5Image();

		this.img.getImageData(canvasId, this.left, this.top, this.width,
				this.height);

		this.drawIndicator(canvasId, dimension);
				
		this.hideTooltip();
	};

	this.setCurrent = function(current) {
		this.current = current;
		this.drawIndicator(this.canvasId, this.getDimension1());
	};

}

RadialMeter.prototype = new OneDimensionGraph();

