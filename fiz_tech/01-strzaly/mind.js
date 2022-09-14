const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let angle;
let ball;
let force;
let t;
let g;
let H;

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(ball.x, -ball.y+400, 5, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
}

function update(){
	if(ball.y>=0){
		ball.x = t*force*Math.cos(angle)*10;
		ball.y = t*force*Math.sin(angle)-0.5*t*t*g+H*10;
		draw();
		t+=(1/60);
		setTimeout(update,1000/60);
	}
}

function start(){
	ball = {
		x: 0,
		y: 0
	}

	angle = document.getElementById("angle").value/180*Math.PI;
	force = document.getElementById("force").value;
	t = 0;
	g = document.getElementById("gravity").value;
	H = Number(document.getElementById("height").value);
	ball.y = H;
	update();
}
