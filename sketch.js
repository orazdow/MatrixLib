let m, r, translation, theta, rotation;

let t2 = 0;

var perf = [];
var average = 0;
function avg(arr){
	return arr.reduce((a,b)=>{
		return a + b;
	}) / arr.length;
}

function setup(){

	createCanvas(500,500);
	background(200);

	v1 = new Vector(0,0,0);
	v2 = new Vector(1,0,0);
	v3 = new Vector(1,1,0);
	v4 = new Vector(0,1,0);
	// v5 = new Vector(0,0,1);
	// v6 = new Vector(1,0,1);
	// v7 = new Vector(1,1,1);
	// v8 = new Vector(0,1,1);

	theta = 0.1;
	m = new Matrix(v1,v2,v3,v4)
	let size = 30;
	m.transformation([[size,0,0,0],[0,size,0,0],[0,0,size,0],[0,0,0,1]]);

	zrotation = [[Math.cos(theta), -Math.sin(theta), 0, 0],
				[Math.sin(theta), Math.cos(theta), 0, 0],
				[0, 0, 1, 0],
				[0,0,0,1]];
	xrotation = [[1,0,0,0],
				[0,Math.cos(theta), -Math.sin(theta), 0],
				[0, Math.sin(theta), Math.cos(theta), 0],
				[0,0,0,1]];
	yrotation = [[Math.cos(theta), 0, Math.sin(theta), 0],
				[0, 1, 0, 0],
				[-Math.sin(theta), 0, Math.cos(theta), 0],
				[0,0,0,1]];

}

function draw(){
	let t1 = performance.now();
	m.transformation(zrotation);
    m.leftMultiply([[1,0,0,mouseX],[0,1,0,mouseY],[0,0,1,0],[0,0,0,1]]); 
	t2 = performance.now()-t1;
	perf.push(t2);
	background(200);
	for (var i = 0; i < m.c; i++){
		ellipse(m.x(i), m.y(i), 2, 2);
	}
		
}

function mousePressed(){

}

function keyPressed(){
	if(key === ' '){
    	average = avg(perf);
    	console.log(average);
    	//console.log(t2)
	}
}


