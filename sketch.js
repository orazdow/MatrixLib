let m, t;

function setup(){

	createCanvas(500,500);
	background(200);

	v1 = new Vector(0,0);
	v2 = new Vector(10, 0);
	v3 = new Vector(10, 10);
	v4 = new Vector(0, 10);

	m = new Matrix(v1,v2,v3,v4)
	t = new Matrix([[1,0,0,5],[0,1,0,5],[0,0,1,5],[0,0,0,1]]);

	m.getColVectors().forEach((v)=>{
		ellipse(v.x, v.y, 2, 2);
	});

}

function mousePressed(){
	background(200);
	//m.transformation([[1,0,0,0.2*(mouseX-250)],[0,1,0,0.2*(mouseY-250)],[0,0,1,1],[0,0,0,1]]);
	m.transformation(t);
	m.getColVectors().forEach((v)=>{
		ellipse(v.x, v.y, 2, 2);
	});
}

function draw(){
	// background(200);
	// m.transformation([[1,0,0,0.02*(mouseX-250)],[0,1,0,0.02*(mouseY-250)],[0,0,1,1],[0,0,0,1]]);
	// //m.transformation(t);
	// m.getColVectors().forEach((v)=>{
	// 	ellipse(v.x, v.y, 2, 2);
	// });
}

// always creates a vector in R4:
// good link: https://math.stackexchange.com/questions/336/why-are-3d-transformation-matrices-4-times-4-instead-of-3-times-3
function Vector(x, y, z, w){
	this.list = [0,0,0,1]; // w component = 1 (needed to shift origin)
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


function Matrix(){

	this.cols = [];
	this.rows = []; 
	this.colVectors = [];
	this.r = 0;
	this.c = 0;

	this.getColMatrix = function(){
		return this.cols;
	}

	this.getRowMatrix = function(){
		return this.rows;
	}

	this.getColVectors = function(){
		if(this.colVectors.length === 0){
			this.cols.forEach((el)=>{
				this.colVectors.push(new Vector(el));
			});
		}
		return this.colVectors;
	}

	this.fromRowArray = function(m){
		this.reset();
		m.forEach((el)=>{
			this.addRowVector(el);
		});
	}

	this.fromColArray = function(m){
		this.reset();
		m.forEach((el)=>{ 
			this.addColVector(el);
		});
	}

	this.reset = function(){
		this.cols = [];
		this.rows = []; 
		this.colVectors = [];
		this.r = 0;
		this.c = 0;
	}

	this.initMatrix = function(r,c){
		let n = [];
		for (var i = 0; i < r; i++) {
			n.push(Array(c).fill(0));
		}
		return n;
	}

	this.dot = function(a1,a2){
		let p = 0;
		a1.forEach((el,i)=>{
			p += el * a2[i];
		});
		return p;
	}

	// alias: multiply
	this.rightMultiply = function(m){
		if(m instanceof Array){return this._rightMultiply(m);} // << maybe get rid of option...
		if(this.c != m.r){console.log('incorrect dimensions:', this.c, '!=', m.r); return null;}
		let n = this.initMatrix(this.r, m.c);

		for (let i = 0; i < this.r; i++) {
			for (let j = 0; j < m.c; j++) {
				n[i][j] = this.dot(this.rows[i], m.cols[j]);
			}
		}
		return n;
	}
	this.multiply = this.rightMultiply;
	// if argument is array matrix: (slower since transpose isn't precomputed)
	this._rightMultiply = function(a){
		if(this.c != a.length){console.log('incorrect dimensions:', this.c, '!=', a.length); return null;}
		let n = this.initMatrix(this.r, a[0].length);

		let cols = [];
        // transpose rows to columns
		for (let i = 0; i < a[0].length; i++) {
				cols.push([]);
			  for (let j = 0; j < a.length; j++) {
			  	cols[i].push(a[j][i]);
			  }
		}

		for (let i = 0; i < this.r; i++) {
			for (let j = 0; j < a[0].length; j++) {
				n[i][j] = this.dot(this.rows[i], cols[j]);
			}
		}		
		return n;
	}

	this.leftMultiply = function(m){ 
		if(m instanceof Array){return this._leftMultiply(m);}
		if(m.c != this.r){console.log('incorrect dimensions:', m.c, '!=', this.r); return null;}

		let n = this.initMatrix(m.r, this.c);

		for (let i = 0; i < m.r; i++) {
			for (let j = 0; j < this.c; j++) {
				n[i][j] = this.dot(m.rows[i], this.cols[j]);
			}
		}		
		return n;
	};
	// if argument is array matrix:
	this._leftMultiply = function(a){
		if(a[0].length != this.r){console.log('incorrect dimensions:', a[0].length, '!=', this.r); return null;}
		let n = this.initMatrix(a.length, this.c);

		for (let i = 0; i < a.length; i++) {
			for (let j = 0; j < this.c; j++) {
				n[i][j] = this.dot(a[i], this.cols[j]);
			}
		}		
		return n;
	}

	// sets matrix as left multiply product with row matrix
	this.transformation = function(m){
		this.fromRowArray(this.leftMultiply(m));
	}

	// alias: addVector
	this.addColVector = function(v){ 

			if(v instanceof Vector){
				var vec = v.list;
			}else if(v instanceof Array){
				var vec = v;
			}else{ console.log('invalid type: must be Vector or Array'); return;}


			if(this.r === 0){
				this.cols.push(vec);
				this.c++;
				this.r = vec.length;
				for (let i = 0; i < this.r; i++) {
					this.rows.push([]);
				}
			}else{
				if(vec.length != this.r){ console.log('column length mismatch', this.r, '!=', vec.length); return;}
				this.cols.push(vec);
				this.c++;
			}

			for (var i = 0; i < this.rows.length; i++) {
				this.rows[i].push(this.cols[this.c-1][i]);
			}	
	}
	this.addVector = this.addColVector;


	this.addRowVector = function(v){

		if(v instanceof Vector){
			var vec = v.list;
		}else if(v instanceof Array){
			var vec = v;
		}else{ console.log('invalid type: must be Vector or Array'); return;}

		if(this.c === 0){
			this.rows.push(vec);
			this.r++;
			this.c = vec.length;
			for (let i = 0; i < this.c; i++) {
				this.cols.push([]);
			}			
		}else{
			if(vec.length != this.c){ console.log('row length mismatch', this.c, '!=', vec.length); return;}	
			this.rows.push(vec);
			this.r++;					
		}

		for(let i = 0; i < this.cols.length; i++){
			this.cols[i].push(this.rows[this.r-1][i]);
		}

	}

	// init
	if(arguments.length > 1){
		Array.from(arguments).forEach((v)=>{
			this.addVector(v);
		});		
	}else if(arguments.length === 1){
		if(arguments[0][0] instanceof Vector){
			this.fromColArray(arguments[0])
		}else{
			this.fromRowArray(arguments[0]); 
		}
	}

}

// {(1,0,0,2),(0,1,0,2),(0,0,1,2),(0,0,0,1)}.{(0,0,10,10),(0,10,10,0),(0,0,0,0),(1,1,1,1)}