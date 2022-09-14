let map =[];
let n = 0;
let m = 0;
let k = 0;
let time = -1;
let doCount = false;
let remaining = k;
let started = false;

class Field{
    x;
    y;
    state=0;
    value=0;
    elem;
    constructor(i,j){
        this.state=0;
        this.value=0;
        this.elem = document.createElement("div");
        this.elem.classList.add("cell");
        this.elem.style.backgroundImage="url(img/closed.svg)";
        this.x = i;
        this.y = j;
        const par = this;
        this.elem.addEventListener("click",function(){par.show()});
        this.elem.addEventListener("contextmenu",function(){par.mark();});
        this.elem.oncontextmenu=function(){return false;};
        this.elem.onmouseup=function(){if(!doCount&&started){doCount=true; timer();}}
    }
    show(){
        if(this.state==0){
            this.state=1;
            if(this.value==-1){
                doCount=false;
                this.elem.style.backgroundImage="url(img/mine_red.svg)"
                started=false;
                for(let i=0; i<n; ++i){
                    for(let j=0; j<m; ++j){
                        if(map[i][j].state==2&&map[i][j].value!=-1){
                            map[i][j].elem.style.backgroundImage="url(img/mine_wrong.svg)";
                        }
                        if(map[i][j].state==0&&map[i][j].value==-1){
                            map[i][j].elem.style.backgroundImage="url(img/mine.svg)";
                        }
                    }
                }
                alert("przegrałeś");
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
        if(this.state==0){
            this.elem.style.backgroundImage="url(img/flag.svg)";
            this.state=2;
            if(this.value==-1){
                remaining--;
            }
            if(remaining==0){
                alert("Wygrałeś");
                doCount=false;
                started=false;
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate()
{
    started = true;
    time = -1;
    document.getElementById("timer").innerText=0;
    const board = document.querySelector(".game");
    n = document.querySelector("#n").value;
    m = document.querySelector("#m").value;
    k = document.querySelector("#bombs").value;
    remaining = k;
    board.innerHTML = "";
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
        const x = getRandomInt(0,n-1);
        const y = getRandomInt(0,m-1);
        map[x][y].value=-1;
    }
    //console.table(map);
    for(let i=0; i<n; ++i){
        for(let j=0; j<m; ++j){
            map[i][j].calcDeg();
        }
    }
    console.table(map);
}
function timer(){
    if(doCount){
    time++;
    document.getElementById("timer").innerText=time;
    setTimeout(timer,1000);
    }
}
