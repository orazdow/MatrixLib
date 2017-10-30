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
	v5 = new Vector(0,0,1);
	v6 = new Vector(1,0,1);
	v7 = new Vector(1,1,1);
	v8 = new Vector(0,1,1);

	thetaz = 0.016; thetax = 0.018; thetay = 0.008;
	m = new Matrix(v1,v2,v3,v4,v5,v6,v7,v8)
	let size = 100;
	m.transformation([[size,0,0,0],[0,size,0,0],[0,0,size,0],[0,0,0,1]]);
	m.transformation([[1,0,0,-size/2],[0,1,0,-size/2],[0,0,1,-size/2],[0,0,0,1]]); 

	zrotation = [[Math.cos(thetaz), -Math.sin(thetaz), 0, 0],
				[Math.sin(thetaz), Math.cos(thetaz), 0, 0],
				[0, 0, 1, 0],
				[0,0,0,1]];
	xrotation = [[1,0,0,0],
				[0,Math.cos(thetax), -Math.sin(thetax), 0],
				[0, Math.sin(thetax), Math.cos(thetax), 0],
				[0,0,0,1]];
	yrotation = [[Math.cos(thetay), 0, Math.sin(thetay), 0],
				[0, 1, 0, 0],
				[-Math.sin(thetay), 0, Math.cos(thetay), 0],
				[0,0,0,1]];


	projection = new Matrix([[Math.sqrt(3), 0, -Math.sqrt(3), 0],[1,2,1,0],[Math.sqrt(2), -Math.sqrt(2), Math.sqrt(2), 0],[0,0,0,1]]);
	rotation = new Matrix(zrotation);
	rotation.transformation(xrotation);
	rotation.transformation(yrotation);

}

function draw(){
	//let t1 = performance.now();
	m.transformation(rotation);
	m.startChain();
  //  m.leftMultiply(projection); 
     m.leftMultiply([[1,0,0,mouseX],[0,1,0,mouseY],[0,0,1,0],[0,0,0,1]]); 
    m.stopChain();
	// t2 = performance.now()-t1;
	// perf.push(t2);
	background(200);
	for (var i = 0; i < m.c; i++){
		ellipse(m.x(i), m.y(i), 2, 2);
	}
		
}

function mousePressed(){

}

function keyPressed(){
	// if(key === ' '){
 //    	average = avg(perf);
 //    	console.log(average);
 //    	//console.log(t2)
	// }
}


