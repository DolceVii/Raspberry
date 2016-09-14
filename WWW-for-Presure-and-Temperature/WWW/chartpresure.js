function testRM7(canvasId){
	
	var l=new RadialMeter();
	l.setCurrentStyle({
		mask : 			function (val){ return "Current "+val} ,
		font : 			' 12px Arial ',
		color: 			'white'
	});
	
	
	l.set( {
		left : 			0,
		top  : 			0,
		width: 			180,
		height: 		180,
		ringStyle:		true,
		indicatorColor:	'#B0B040',
		startAngle: 	800,
		endAngle: 		1100,
		min: 			800,
		max: 			1100,
		intervals: 		5,
		current: 		(presure),
		rulePosition : 	'in',
		ruleInterval:	2,
		fillStyle:		'cilinder',
		capacity:		true,
		style:			'3D',
		uid: 			getCanvasObjectUid("c"),
		animate:		true});
	l.serie=null;
	
	l.setCurrentStyle({
		mask : 			function (val){ return val+" atm"} ,
		font : 			'bold 12px Arial ',
		color: 			'red'
	});
	setLabelStyle(l);
	l.draw(canvasId);
}

function setSerie(l){
	l.serie=null;
	l.serie=new Serie();
	l.serie.init();
	l.serie.add({value:140,color:"#800000"});
	l.serie.add({value:180,color:"#808000"});
	l.serie.add({value:200,color:"#008000"});
}

function setLabelStyle(l){
	l.setLabelStyle({
		mask : 			function (val){ return val+ ""} ,
		font : 			'11px Arial',
		color: 			'grey'
	});
}

function testRadialMeter(){
	
	var l=new RadialMeter();
	
	
	l.setCurrentStyle({
		mask : 			function (val){ return "Current "+val} ,
		font : 			' 12px Arial ',
		color: 			'white'
	});
	
	setSerie(l);
	
	
	testRM7("c");

	return l;
}