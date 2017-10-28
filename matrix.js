
let m, t;
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


	v1 = new Vector(0,0);
	v2 = new Vector(10, 0);
	v3 = new Vector(10, 10);
	v4 = new Vector(0, 10);

	m = new Matrix(v1,v2,v3,v4)
	t = new Matrix([[1,0,0,5],[0,1,0,5],[0,0,1,5],[0,0,0,1]]);

}

function mousePressed(){
	// background(200);
	// //m.transformation([[1,0,0,0.2*(mouseX-250)],[0,1,0,0.2*(mouseY-250)],[0,0,1,1],[0,0,0,1]]);
	// m.transformation(t);
	// for (var i = 0; i < m.c; i++) {
	// 	ellipse(m.x(i), m.y(i), 2, 2);
	// }
}

function keyPressed(){
	if(key === ' '){
    	average = avg(perf);
    	console.log(average);
    	//console.log(t2)
	}
}

function draw(){
	background(200);
	let t1 = performance.now();
	m.transformation([[1,0,0,0.02*(mouseX-250)],[0,1,0,0.02*(mouseY-250)],[0,0,1,1],[0,0,0,1]]);
	t2 = performance.now()-t1;
	perf.push(t2);
	for (var i = 0; i < m.c; i++) {
		ellipse(m.x(i), m.y(i), 2, 2);
	}
}

// always creates a vector in R4:
function Vector(x, y, z, w){
	this.list = [0,0,0,1]; // w component = 1 
	let fromArray = false;
	if(x instanceof Array){ 
		fromArray = true;
		this.list = x; 
		while(this.list.length < 4){
			this.list.push(0);
			if(this.list.length === 4){
				this.list[3] = 1;
			}
		}	
	}

	if(x != undefined && !fromArray){ this.list[0] = x; }
	this.x = this.list[0];

	if(y != undefined && !fromArray){ this.list[1] = y; }
	this.y = this.list[1];	

	if(z != undefined && !fromArray){ this.list[2] = z; }
	this.z = this.list[2];

	if(w != undefined && !fromArray){ this.list[3] = w; }
	this.w = this.list[3];

	this.dot = function(v){
	 	let d = null;
	 	for(let i = 0; i < this.list.length; i++){
	 		d += this.list[i] * v.list[i];
	 	}
	 	return d;
	}
	
}

class Matrix{

	constructor(m){
		this.rows = [];
		this.cols = [];
		this.r = 0;
		this.c = 0;
		if(arguments.length > 1){
			Array.from(arguments).forEach((v)=>{
				this.addVector(v);
			});		
		}else if(arguments.length === 1){
			this.fromRowArray(arguments[0]); 	
		}
	}

	fromRowArray(m){
		this.rows = [];
		this.cols = [];
		this.r = m.length;
		this.c = m[0].length;
		for(let i = 0; i < this.c; i++){
			this.cols.push([]);
		}
		m.forEach((el)=>{
			this.rows.push(el);
			for(let i = 0; i < this.c; i++){
				this.cols[i].push(el[i]);
			}
		})
	}

	getRowMatrix(){
		return this.rows;
	}

	getColMatrix(){
		return this.cols;
	}

	x(i){
		return this.cols[i][0];
	}
	y(i){
		return this.cols[i][1];
	}
	z(i){
		return this.cols[i][2];
	}

	multiply(m){
		let n = [];
		if(m instanceof Array){ // columns not precomputed
			if(this.c != m.length){console.log('incorrect dimensions:', this.c, '!=', m.length); return null;}

			let cols = [];	
			for(let i = 0; i < m[0].length; i++){cols.push([]);}

			for (let i = 0; i < this.r; i++) {
				n.push([]);
				for (let j = 0; j < m[0].length; j++) {
					cols[j][i] = m[i][j];
					n[i][j] = this.dot(this.rows[i], cols[j]);
				}
			}		
			return n;
		}
		// if Matrix obj
		if(this.c != m.r){console.log('incorrect dimensions:', this.c, '!=', m.r); return null;}

		for (let i = 0; i < this.r; i++) {
				n.push([]);
			for (let j = 0; j < m.c; j++) {
				n[i][j] = this.dot(this.rows[i], m.cols[j]);
			}
		}
		return n;
	}

	leftMultiply(m){ 
		let n = [];
		if(m instanceof Array){ 
			if(m[0].length != this.r){console.log('incorrect dimensions:', m[0].length, '!=', this.r); return null;}
			for (let i = 0; i < m.length; i++) {
					n.push([]);
				for (let j = 0; j < this.c; j++) {
					n[i][j] = this.dot(m[i], this.cols[j]);
				}
			}	
			return n;
		}
		// if Matrix obj
		if(m.c != this.r){console.log('incorrect dimensions:', m.c, '!=', this.r); return null;}

		for (let i = 0; i < m.r; i++) {
				n.push([]);
			for (let j = 0; j < this.c; j++) {
				n[i][j] = this.dot(m.rows[i], this.cols[j]);
			}
		}		
		return n;
	};

	transformation(m){  
		if(m instanceof Array){
			if(m[0].length != this.r){
				console.log('incorrect dimensions:', m[0].length, '!=', this.r); 
				return null;
			}
			// match row length
			if(this.rows.length != m.length){
				while(this.rows.length < m.length){this.rows.push([]);}
				while(this.rows.length > m.length){this.rows.pop();}
			}
			// replace elements
			for (let i = 0; i < m.length; i++) {
				for (let j = 0; j < this.c; j++) {
					let d = this.dot(m[i], this.cols[j]);
					this.rows[i][j] = d;
					this.cols[j][i] = d;
				}
			}
                return;
		}
		// if Matrix obj
		if(m.c != this.r){
			console.log('incorrect dimensions:', m.c, '!=', this.r); 
			return null;
		}
		// match row length
		if(this.rows.length != m.rows.length){
			while(this.rows.length < m.rows.length){this.rows.push([]);}
			while(this.rows.length > m.rows.length){this.rows.pop();}
		}		
		// replace elements
		for (let i = 0; i < m.r; i++) {
			for (let j = 0; j < this.c; j++) {
				let d = this.dot(m.rows[i], this.cols[j]);
				this.rows[i][j] = d;
				this.cols[j][i] = d;
			}
		}		
	};

	transform(m){
		m.transformation(this.rows);
	}

	addVector(v){
		if(v.list){v = v.list;}

		if(this.r === 0){
			this.cols.push(v);
			this.r = v.length;
			this.c++;
			for (let i = 0; i < this.r; i++) {
				this.rows.push([]);
			}
		}else if(v.length === this.r){
			this.cols.push(v);
			this.c++;
		}

		for (var i = 0; i < this.r; i++) {
			this.rows[i].push(this.cols[this.c-1][i]);
		}			
	}

	dot(a1,a2){
		let p = 0;
		a1.forEach((el,i)=>{
			p += el * a2[i];
		});
		return p;
	}

}

