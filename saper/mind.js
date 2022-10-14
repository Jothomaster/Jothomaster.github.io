let map = [];
let n = 0;
let m = 0;
let k = 0;
let remaining = k;
let timeBeg = null;
let timeEnd = null;
let time = -1;
let timerRunning = false;

class Field{
    x;
    y;
    state=0;
    value=0;
    elem;
    constructor(i,j){
		this.click = function(){par.show()};
		this.contextmenu = function(){par.mark();}
        this.state=0;
        this.value=0;
        this.elem = document.createElement("div");
        this.elem.classList.add("cell");
        this.elem.style.backgroundImage="url(img/closed.svg)";
        this.x = i;
        this.y = j;
        const par = this;
        this.elem.addEventListener("click",this.click);
        this.elem.addEventListener("contextmenu",this.contextmenu);
        this.elem.oncontextmenu=function(){return false;};
        this.elem.onmouseup=function(){if(!timeBeg){timeBeg = Date.now(); if(!timerRunning){timer(); timerRunning=true};}}
    }
    show(){
        if(this.state==0){
            this.state=1;
            if(this.value==-1){
                this.elem.style.backgroundImage="url(img/mine_red.svg)"
                for(let i=0; i<n; ++i){
                    for(let j=0; j<m; ++j){
						map[i][j].elem.removeEventListener("click",map[i][j].click);
						map[i][j].elem.removeEventListener("contextmenu",map[i][j].contextmenu);
                        if(map[i][j].state==2&&map[i][j].value!=-1){
                            map[i][j].elem.style.backgroundImage="url(img/mine_wrong.svg)";
                        }
                        if(map[i][j].state==0&&map[i][j].value==-1){
                            map[i][j].elem.style.backgroundImage="url(img/mine.svg)";
                        }
                    }
                }
				end(false);
            }
            else{
                this.elem.style.backgroundImage=`url(img/type${this.value}.svg)`;
            }
            if(this.value==0){
                for(let g=0; g<9; ++g){
                    try{
                        map[this.x-1+(g%3)][this.y-1+Math.floor(g/3)].show();
                    }
                    catch{
                        continue;
                    }
                }
            }
        }
    }
    calcDeg(){
        if(this.value!=-1){
            for(let g=0; g<9; ++g){
                try{
                    this.value+=(map[this.x-1+(g%3)][this.y-1+Math.floor(g/3)].value==-1?1:0);
                }
                catch{

                }
            }
        }
    }
    mark(){
		let cnt = document.querySelector("#remaining");
        if(this.state==0){
            this.elem.style.backgroundImage="url(img/flag.svg)";
            this.state=2;
            if(this.value==-1){
                remaining--;
            }
            if(remaining==0&&cnt.innerText=="1"){
				end(true);
            }
			cnt.innerText = Number(cnt.innerText) - 1;
			return;
        }
        if(this.state==2){
            this.state=0;
            this.elem.style.backgroundImage="url(img/closed.svg)";
            if(this.value==-1){
                remaining++;
            }
        }
			cnt.innerText = Number(cnt.innerText) + 1;
			return;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=Strict";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function generate()
{
	timeBeg = null;
	timeEnd = null;
	time = -1;
    let timer = document.getElementById("timer");
	timer.innerText=0;
    const board = document.querySelector(".game");
    n = document.querySelector("#n").value;
    m = document.querySelector("#m").value;
    k = document.querySelector("#bombs").value;
	if(k>=n*m){
		return;
	}
    remaining = k;
    let rem = document.querySelector("#remaining");
	rem.innerText = remaining;
    board.innerHTML = ""
	board.appendChild(timer);
	board.appendChild(rem);
    for(let i=0; i<n; ++i){
        let row = document.createElement("div");
        row.classList.add("row");
        map[i]=[];
        for(let j=0; j<m; ++j){
            let cell = new Field(i,j);
            row.appendChild(cell.elem);
            map[i][j]=cell;
        }
        board.appendChild(row);
    }
    //console.log(map);
    for(let i=0; i<k; ++i){
		let x,y;
		do{
        x = getRandomInt(0,n-1);
        y = getRandomInt(0,m-1);
		}while(map[x][y].value==-1);
		map[x][y].value=-1;
    }
    //console.table(map);
    for(let i=0; i<n; ++i){
        for(let j=0; j<m; ++j){
            map[i][j].calcDeg();
        }
    }
}

function end(win){
	timeEnd = Date.now();
	for(let i=0; i<n; ++i){
		for(let j=0; j<m; ++j){
			map[i][j].elem.removeEventListener("click",map[i][j].click);
			map[i][j].elem.removeEventListener("contextmenu",map[i][j].contextmenu);
			map[i][j].elem.onmouseup=null;
		}
	}
	time = -1;
	if(win){
		let winningTime = timeEnd - timeBeg;
		let cname = `${n}x${m}x${k}`;
		alert(`wygrales w czasie: ${winningTime}`)
		let record = getCookie(cname);
		const arr = ((record=="") ? [] : record.split("|"));
		console.log(arr);
		arr.push(winningTime);
		arr.sort((a,b)=>(Number(a)>Number(b)));
		setCookie(cname, arr.slice(0,10).join("|"), 365);
	}
	timeBeg = null;
	timeEnd = null;
}

function timer(){
    if(timeBeg){
    time++;
    document.getElementById("timer").innerText=time;
    setTimeout(timer,1000);
    }
	else{
	timerRunning = false;
	return;
	}
}
