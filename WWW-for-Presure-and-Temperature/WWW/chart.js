function onThermometer(){
	
	var l=new Thermometer();
	
	l.set( {
		left : 			10,
		top  : 			10,
		width: 			100,
		height: 		150,
		min  :			-10,
		max  :			40,
		intervals:		10,
		current: 		(temperature),
		uid: 				getCanvasObjectUid("c"),
		animate:		true
		});
	
	l.setLabelStyle({
		mask : 			function (val){ return val;} ,
		font : 			'11px Arial',
		color: 			'grey'
	});
	
	l.setCurrentStyle({
		mask : 			function (val){ return val+"\xB0C";} ,
		font : 			'bold 14px Arial',
		color: 			'grey'
	});
	
	
	l.onclick=function(){ console.log('click');};
	l.onmousedown=function(){ console.log('down');};
	l.onmousemove=function(){ console.log('move');};
	l.onmouseup=function(){ console.log('up');};
	
	l.draw("c");
	l.setCurrent(temperature);
	
}