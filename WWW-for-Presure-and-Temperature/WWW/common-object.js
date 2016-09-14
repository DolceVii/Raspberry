function setProperties(o,props){
	if(props)
		for (var z in props) {o[z]=props[z]; }
}


function Shape(){
	
	this.ctx;
	this.left=0;
	this.top=0;
	this.borderWidth=1;
	this.borderColor='#000';
	this.borderStyle='solid'; 		
	this.fillStyle='none'; 			
	this.color=0;					
	this.endColor='#fff';
	this.shadow;				y
	
	setProperties(this,arguments[0]);
	
	this.set = function () { 
		var arg=arguments[0];
		setProperties(this,arg);
	};
	
	this.setShadow = function(){ this.shadow=new Shadow(arguments[0]); }
}

function Bounds(){
	this.left;
	this.top;
	this.width;
	this.height;
	
	setProperties(this,arguments[0]);
	
	this.set = function () { 
		var arg=arguments[0];
		setProperties(this,arg);
	}
}

function Position(){
	this.x0;
	this.y0;
	this.x1;
	this.y1;
	
	this.height=function(){return y1-y0;};
	this.width=function(){return x1-x0};
	
	setProperties(this,arguments[0]);
	
	this.set = function () { 
		var arg=arguments[0];
		setProperties(this,arg);
	}
	
}

function Shadow(){
	
	this.offsetX=0;
	this.offsetY=0;
	this.blur=5;
	
	setProperties(this,arguments[0]);
	
	this.set = function () { 
		var arg=arguments[0];
		setProperties(this,arg);
	};
	
}

function Point(x0,y0){
	this.x=x0;
	this.y=y0;
}

function Rectangle(){
	this.width=0;
	this.height=0;
	this.radius=0;
	
	this.collision= function (x,y) {
		var p=this.position();
		var l=p.x0-1;
		var t=p.y0-1;
		var l1=p.x1+1;
		var t1=p.y1+1;
	
		if(x>t && x<l1 && y>t && y<t1)
			return true;
			
		return false;
	};
		
	this.draw = function (canvasId) {
		
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
		this.ctx.beginPath();
		
		var col;
		
		if(this.fillStyle=='solid'){
			col=this.color;
		} else if(this.fillStyle=='h-linear') {
			col=getLinearGradient(this.ctx,this.left,this.left+this.width,this.color,this.endColor,false);
		} else if(this.fillStyle=='v-linear') {
			col=getLinearGradient(this.ctx,this.top,this.top+this.height,this.color,this.endColor,true);
		} else if(this.fillStyle=='v-cilinder') {
			col=getCilinderGradient(this.ctx,this.left,this.left+this.width,this.color,this.endColor,false);
		} else if(this.fillStyle=='h-cilinder') {
			col=getCilinderGradient(this.ctx,this.top,this.top+this.height,this.color,this.endColor,true);
		} 	
		
		if(this.fillStyle!='none'){
			if(this.radius<=0)
				fillRect(this.ctx,this.left,this.top,this.width,this.height,col,this.shadow);
			else
				fillRoundRect(this.ctx,this.left,this.top,this.width,this.height,this.radius,col,this.shadow);
		}
		
		if(this.borderStyle=='solid') {
			if(this.radius<=0)
				drawRect(this.ctx,this.left,this.top,this.width,this.height,this.borderWidth,this.borderColor);
			else
				drawRoundRect(this.ctx,this.left,this.top,this.width,this.height,this.radius,this.borderWidth,this.borderColor);
			
		} else if (this.borderStyle=='dotted'){
			drawDottedLine(this.ctx,this.left,this.top,this.left+this.width,this.top,this.boderWidth,this.borderColor);
			drawDottedLine(this.ctx,this.left,this.top,this.left,this.top+this.height,this.boderWidth,this.borderColor);
			drawDottedLine(this.ctx,this.left,this.top+this.height,this.left+this.width,this.top+this.height,this.boderWidth,this.borderColor);
			drawDottedLine(this.ctx,this.left+this.width,this.top,this.left+this.width,this.top+this.height,this.boderWidth,this.borderColor);
		}
		
		
		this.ctx.closePath();
	
		this.ctx.restore();
		document.getElementById(canvasId).updateImage();
		
	};
	
}

Rectangle.prototype=new Shape();

function Circle(){
	
	this.radius;
		
	this.draw = function (canvasId){
		
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
			
		var col;
			
		if(this.fillStyle=='solid'){
			col=this.color;
		} else if(this.fillStyle=='linear') {
			col=getRadialLinearGradient(this.ctx,this.left,this.top,0,this.radius,this.color,this.endColor);
		} else if(this.fillStyle=='light') {
			col=getRadialLinearGradient1(this.ctx,this.left,this.top,225,0,this.radius,this.color,this.endColor);
		}
		
		if(this.fillStyle!='none'){
			fillCircle(this.ctx,this.left,this.top,this.radius,col,this.shadow);
		}
		
		if(this.borderStyle=='solid') {
			drawCircle(this.ctx,this.left,this.top,this.radius,this.borderWidth,this.borderColor);
			
		} else if (this.borderStyle=='dotted'){
			
		}
		
		this.ctx.fill();
		
		this.ctx.restore();
		
	};
	
}

Circle.prototype=new Shape();

function Donut(){

	this.radius1;
	
	this.draw = function (canvasId){
		
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
		
		var col;
			
		if(this.fillStyle=='solid'){
			col=this.color;
		} else if(this.fillStyle=='linear') {
			col=getRadialLinearGradient(this.ctx,this.left,this.top,0,this.radius,this.color,this.endColor);
		} else if(this.fillStyle=='cilinder') {
			col=getRadialCilinderGradient(this.ctx,this.left,this.top,this.radius,this.radius1,this.color,this.endColor);
		}
		
		if(this.fillStyle!='none'){
			fillDonut(this.ctx,this.left,this.top,this.radius,this.radius1,col,this.shadow);
		}
		
		this.ctx.fill();
		
		if(this.borderStyle=='solid') {
			drawCircle(this.ctx,this.left,this.top,this.radius,this.borderWidth,this.borderColor);
			drawCircle(this.ctx,this.left,this.top,this.radius1,this.borderWidth,this.borderColor);
			
		} else if (this.borderStyle=='dotted'){
			
		}
		
		this.ctx.restore();
		
	};
}

Donut.prototype=new Circle();

function CircleSection(){
	this.radius1;
	this.startAngle;
	this.endAngle;
	
	this.draw = function (canvasId,alpha){
		
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
	
		var col;
		if(alpha!=null)
			this.ctx.globalAlpha = alpha;
		else
			this.ctx.globalAlpha = 1;
		
		if(this.fillStyle=='solid'){
			col=this.color;
		} else if(this.fillStyle=='linear') {
			col=getRadialLinearGradient(this.ctx,this.left,this.top,0,this.radius,this.color,this.endColor);
		} else if(this.fillStyle=='cilinder'){
			col=getRadialCilinderGradient(this.ctx,this.left,this.top,this.radius,this.radius1,this.color,this.endColor);
		}
		
		if(this.fillStyle!='none'){
		
			fillSection(this.ctx,this.left,this.top,this.radius,this.radius1,this.startAngle,this.endAngle,col,this.shadow);
		}
		
		if(this.borderStyle=='solid') {
			drawSection(this.ctx,this.left,this.top,this.radius,this.radius1,this.startAngle,this.endAngle,this.borderWidth,this.borderColor);
		} else if (this.borderStyle=='dotted'){
			
		}
		
		this.ctx.fill();
		
		this.ctx.restore();
		
	};
	
	this.getSection=function(canvasId){
		this.ctx=getContext(canvasId);
		sectionPath(this.ctx,this.left,this.top,this.radius,this.radius1,this.startAngle,this.endAngle); 
	};
}

CircleSection.prototype=new Circle();

function Area(){
	this.points;
	this.lineStyle='round';

	this.draw = function(canvasId,alpha){
		
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.globalAlpha=alpha;
		
		var col;
		
		if(this.fillStyle=='solid'){
			col=this.color;
		} else if(this.fillStyle=='h-linear') {
			col=getLinearGradient(this.ctx,this.left,this.left+this.width,this.color,this.endColor,false);
		} else if(this.fillStyle=='v-linear') {
			col=getLinearGradient(this.ctx,this.top,this.top+this.height,this.color,this.endColor,true);
		} else if(this.fillStyle=='v-cilinder') {
			col=getCilinderGradient(this.ctx,this.left,this.left+this.width,this.color,this.endColor,false);
		} else if(this.fillStyle=='h-cilinder') {
			col=getCilinderGradient(this.ctx,this.top,this.top+this.height,this.color,this.endColor,true);
		}  	
		
		if(this.fillStyle!='none'){
			fillPoly(this.ctx,this.points,col,this.shadow,this.lineStyle);
		}
		
		if(this.borderStyle=='solid') {
			drawPoly(this.ctx,this.points,this.borderWidth,this.borderColor,null,this.lineStyle);
		} else if (this.borderStyle=='dotted'){
			
		}
		
		var goop=this.ctx.globalCompositeOperation;
		this.ctx.globalCompositeOperation='source-over';
		this.ctx.closePath();
		this.ctx.globalCompositeOperation=goop;
		this.ctx.restore();
		
	
	};
	
	this.getSection=function(canvasId){
		this.ctx=getContext(canvasId);
		polyPath(ctx, this.points);
	};
}

Area.prototype=new Shape();
	
function Text(){
	this.text;
	this.bounds;
	this.color='black';
	this.font='30px Sans-Serif';
	this.align='center'; 
	this.style='fill'; 'stroke / fill'
	this.shadow;
	this.angle=0;
	this.baseline='alphabetic';
	this.maxWidth=0;
	
	setProperties(this,arguments[0]);
	
	this.setBounds = function(){ this.bounds=new Bounds(arguments[0]); };	
	
	this.getHeight = function(){
		var numb = this.font.match(/\d+/g);
		return parseInt(numb);
	};
	
	this.drawText=function (canvasId,text,x,y){
		var ctx=getContext(canvasId);
		
		ctx.save();
		
		if(this.angle!=0){
			x=0;y=0;
			ctx.translate(this.bounds.left, this.bounds.top);
			ctx.moveTo(this.bounds.left, this.bounds.top);
			ctx.rotate(toRadian(this.angle));
		}
		ctx.textAlign = this.align;
		ctx.fillStyle=this.color;
		ctx.font=this.font;
		
		ctx.textBaseline=this.baseline;
		ctx.beginPath();
		
		if(this.shadow)
			setShadow(ctx,this.shadow.offsetX,this.shadow.offsetY,this.shadow.blur);
		
		if(this.style=='fill')
			ctx.fillText(text,x,y);
		else
			ctx.strokeText(text, x, y);
		
		ctx.closePath();
		ctx.restore();
	};
	
	this.draw = function draw(canvasId){
		var ctx=getContext(canvasId);
		var a;
		if(this.maxWidth>0)
			a = getTextArray(ctx, this.text, this.font, this.maxWidth);
		else {
			a = new ArrayList();
			a.init();
			a.add(this.text);
		}
		
		var x=this.bounds.left;
		var y=this.bounds.top;
		var bx=x;
		var by=y;
		var fh=getTextHeight(this.font);
		var ofx=fh*Math.cos(toRadian(this.angle+90));
		
		var ofy=fh*Math.sin(toRadian(this.angle+90));
				
		for(var m=0;m<a.length();m++){
			this.drawText(canvasId, a.get(m), bx, by);
			bx=bx+ofx;
			by=by+ofy;
			this.setBounds({left : bx,top : by });
		}
		
		this.setBounds({left : x,top : y });
		document.getElementById(canvasId).updateImage();
		
	};
}	

Text.prototype=new Shape();

function drawText(canvasId,x,y,label,ang,col,font,align,baseline){
	var bas=baseline;
	if(!bas) bas='alphabetic';
	var text=new Text({text: label,angle : ang, color : col , font: font, align : align, baseline : bas});
	
	text.setBounds({left : x,top : y });
	text.draw(canvasId);
}

function Rule(left,top,length,intervals,orientation,showLabels,valueStyle,min,max,baseline){
	this.ctx;
	this.left=left;
	this.top=top;
	this.length=length;
	this.intervals=intervals;
	this.tickMode='max';
	this.tickOrientation='over';
	this.maxTickSize=10;
	this.ruleOrientation=orientation;
	this.lineWidth=1;
	this.color='black';
	this.valueStyle=valueStyle;
	this.min=min;
	this.max=max;
	this.baseline=baseline;
	this.intervals=intervals;
	this.draw = function(canvasId){
				
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
		this.ctx.beginPath();
		
		
		if(this.ruleOrientation=='vertical'){
			drawLine(this.ctx,this.left,this.top,this.left,this.top+this.length,this.lineWidth,this.color);
		} else if(this.ruleOrientation=='horizontal'){
			drawLine(this.ctx,this.left,this.top,this.left+this.length,this.top,this.lineWidth,this.color);
		}
		
		
		var offset=0;
				
		if(this.tickOrientation=='over'){
			offset=0;
		} else if(this.tickOrientation=='center'){
			offset=-.5;
		} else if(this.tickOrientation=='under'){
			offset=-1;
		}
		
		
		
		var minTick=this.length/this.intervals/10;
		var medSize=this.maxTickSize/1.5;
		var minSize=this.maxTickSize/2;
				
		var num=0;
		var m=0;
		
		
		var xf=0;
		var yf=0;
		
		if(this.ruleOrientation=='horizontal')  xf=1;
		if(this.ruleOrientation=='vertical') yf=1;

		var ll=this.left;
		var lt=this.top;
		var count=0;
		for(n=0;n<this.length+1;n+=minTick){
			
			if((this.tickMode=='max' || this.tickMode=='med' || this.tickMode=='min') &&  count%10==0 ){
				drawTick(this.ctx,this.left,this.top,n,this.ruleOrientation,this.maxTickSize,offset,this.lineWidth,this.color);
				
				if(showLabels && showLabels==true){
					if(m%2==0)
						if(this.ruleOrientation=='horizontal')
							drawText(canvasId,ll+yf*this.maxTickSize+n*xf,lt+xf*this.maxTickSize+n*yf,this.valueStyle.mask(num+this.min),0,this.valueStyle.color,this.valueStyle.font,"left",baseline);
						else
							drawText(canvasId,ll+yf*this.maxTickSize+n*xf,lt+xf*this.maxTickSize+n*yf,this.valueStyle.mask(this.max-num),0,this.valueStyle.color,this.valueStyle.font,"left",baseline);
				}
				m++;
				num+=(this.max-this.min)/this.intervals;	
			} else if((this.tickMode=='max' || this.tickMode=='med') &&  count%5==0 ){
				drawTick(this.ctx,this.left,this.top,n,this.ruleOrientation,medSize,offset,this.lineWidth,this.color);
			} else if((this.tickMode=='max') ){
				drawTick(this.ctx,this.left,this.top,n,this.ruleOrientation,minSize,offset,this.lineWidth,this.color);
			}
			count++;
			
			
		}
			
		this.ctx.restore();
		
		
	};
	
}

function RadialRule(left,top,radius,startAngle,endAngle,intervals,valueStyle,showLabels,min,max,ruleInterval,radialRule){
	this.ctx;
	this.left=left;
	this.top=top;
	this.startAngle=startAngle;
	this.endAngle=endAngle;
	this.intervals=intervals;
	this.tickMode='max';
	this.tickOrientation='over';
	this.maxTickSize=7;
	this.radius=radius;
	this.lineWidth=1;
	this.color='black';
	this.valueStyle=valueStyle;
	this.min=min;
	this.max=max;
	this.ruleInterval=ruleInterval;
	this.radialRule=radialRule;
	
	this.draw = function(canvasId){
				
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
		this.ctx.beginPath();
		
		var end=(this.endAngle) * Math.PI / 180;
		var start=(this.startAngle) * Math.PI / 180;
		
		this.ctx.arc(this.left,this.top,this.radius,start,end,false);
		this.ctx.strokeStyle=this.color;
		this.ctx.stroke();
		
		var offset=0;
				
		if(this.tickOrientation=='over'){
			offset=1;
		} else if(this.tickOrientation=='center'){
			offset=.5;
		} else if(this.tickOrientation=='under'){
			offset=-1;
		}
		
		var len=this.endAngle-this.startAngle;
		var minTick=len/this.intervals/10;
		var medSize=this.maxTickSize/1.5;
		var minSize=this.maxTickSize/2;
				
		var num=0;
		var m=0;
		var of=2;
		var pos=this.valueStyle.fontSize()/2;
		
		if(this.tickOrientation=='over'){
			of=-1.2;
			pos=0;
		}
				
		var count=0;
		for(n=this.startAngle;n<=this.endAngle+1;n+=minTick){
			
			if((this.tickMode=='max' || this.tickMode=='med' || this.tickMode=='min') &&  count%10==0 ){
				
				if(this.radialRule){
					drawLine(this.ctx, this.left+radius*Math.cos(toRadian(n)), this.top+radius*Math.sin(toRadian(n)), this.left, this.top, 0.5, "grey");
				}
					
				drawRadialTick(this.ctx,this.left,this.top,this.radius,n,this.ruleOrientation,this.maxTickSize,offset,this.lineWidth*2,this.color);
				
				
				var ll=this.left+(this.radius-of*this.maxTickSize-pos)*Math.cos(toRadian(n));
				var lt=this.top+(this.radius-of*this.maxTickSize-pos)*Math.sin(toRadian(n));
				if(showLabels && showLabels==true){
					if(m%this.ruleInterval==0)
						if(this.startAngle+360!=this.endAngle || (this.startAngle+360==this.endAngle && n!=this.startAngle))
							drawText(canvasId,ll,lt,this.valueStyle.mask(min+num),n+90,this.valueStyle.color,this.valueStyle.font,"center");
				}
				m++;
				num+=(this.max-this.min)/this.intervals;	
			} else if((this.tickMode=='max' || this.tickMode=='med') &&  count%5==0 ){
				drawRadialTick(this.ctx,this.left,this.top,this.radius,n,this.ruleOrientation,medSize,offset,this.lineWidth,this.color);
			} else if((this.tickMode=='max') ){
				drawRadialTick(this.ctx,this.left,this.top,this.radius,n,this.ruleOrientation,minSize,offset,this.lineWidth,this.color);
			}
			
			count++;
			
		
		}
			
		this.ctx.restore();
		
		
	};
}

function Grid(x,y,w,h,intervalsX,intervalsY,type,axes){
	this.left=x;
	this.top=y;
	this.width=w;
	this.height=h;
	this.intervalsY=intervalsY;
	this.intervalsX=intervalsX;
	this.type=type; 
	this.axes=axes; 
	this.borderWidth=0.5;
	this.borderColor='grey';
	this.draw = function(canvasId){
		
		this.ctx=getContext(canvasId);
		
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.shadowBlur=0;
		this.ctx.shadowOffsetX=0;
		
		if(this.type=='rect'){
		
			var n=0;
			
			if(this.axes=='v-grid' || this.axes=='both'){
				var xaux=this.width/this.intervalsX;
				for(n=0;n<=this.intervalsX;n++){
					if(this.borderStyle=='solid') {
						drawLine(this.ctx,this.left+(n*xaux),this.top,this.left+(n*xaux),this.top+this.height,this.borderWidth,this.borderColor);
					} else if (this.borderStyle=='dotted'){
						drawDottedLine(this.ctx,this.left+(n*xaux),this.top,this.left+(n*xaux),this.top+this.height,this.borderWidth,this.borderColor);
					}
				}
			}
		
			if(this.axes=='h-grid' || this.axes=='both'){
				var yaux=this.height/this.intervalsY;
				for(n=0;n<=this.intervalsY;n++){
					if(this.borderStyle=='solid') {
						drawLine(this.ctx,this.left,this.top+(n*yaux),this.left+this.width,this.top+(n*yaux),this.borderWidth,this.borderColor);
					} else if (this.borderStyle=='dotted'){
						drawDottedLine(this.ctx,this.left,this.top+(n*yaux),this.left+this.width,this.top+(n*yaux),this.borderWidth,this.borderColor);
					}
				}
			}
		
		
		
		}
			
		this.ctx.restore();
			
	};
	
}

function h5Image(){
	
	this.imageData;
	
	this.src;
	
	this.imageId;
	
	this.sourceType;
	
	this.left;
	this.top;
	this.width;
	this.height;

	this.toDataUrl = function(canvasId){
		var canvas =document.getElementById(canvasId); 
		return canvas.toDataURL();
	};
	
	this.drawFromUrl=function(canvasId,x,y,width,height){
		
		var ctx=getContext(canvasId);
        var imageObj = new Image();
	    imageObj.ctx=ctx;
	    imageObj._x=x;
	    imageObj._y=y;
	    imageObj._w=width;
	    imageObj._h=height;
	    imageObj.onload = function(){
	    		if(this._w && this._h)
	    			this.ctx.drawImage(this,this._x,this._y,this._w,this._h);
	    		else
	    			this.ctx.drawImage(this,this._x,this._y);
	    		document.getElementById(canvasId).updateImage();
	    };
	    imageObj.src = this.src;
        
	};
	
	this.drawFromImage=function(canvasId,x,y,width,height){
		var ctx=getContext(canvasId);
		var imageObj = document.getElementById(this.imageId);
		imageObj.ctx=ctx;
	    imageObj._x=x;
	    imageObj._y=y;
	    imageObj._w=width;
	    imageObj._h=height;
	    imageObj.onload = function(){
	    		if(this._w && this._h)
	    			this.ctx.drawImage(this,this._x,this._y,this._w,this._h);
	    		else
	    			this.ctx.drawImage(this,this._x,this._y);
	    		
	    		document.getElementById(canvasId).updateImage();
	    };
			
	};
		
	this.getImageData=function (canvasId,x,y,width,height){
		var ctx=getContext(canvasId);
		this.imageData=ctx.getImageData(x,y,width,height);
	};
	
	this.putImageData= function (canvasId,x,y){
		if(this.imageData){
			var ctx=getContext(canvasId);
			ctx.putImageData(this.imageData,x,y);
		}
	};
		
	this.draw=function(canvasId){
		
		if(this.sourceType=='url'){
			this.drawFromUrl(canvasId,this.left,this.top,this.width,this.height);
		} else  {
			this.drawFromImage(canvasId,this.left,this.top,this.width,this.height);
		}
		
	};
	
}
