const boardEl=document.getElementById("board"),statusEl=document.getElementById("status");
const backRank=["♜","♞","♝","♛","♚","♝","♞","♜"];
const pawns=["♟","♟","♟","♟","♟","♟","♟","♟"];
const whiteBack=["♖","♘","♗","♕","♔","♗","♘","♖"];
let board=[],turn="white",selected=null,flipped=false,gameOver=false;

function newGame(){
 board=Array.from({length:8},()=>Array(8).fill(null));
 board[0]=backRank.map(p=>({p,c:"black"})); board[1]=pawns.map(p=>({p,c:"black"}));
 board[6]=pawns.map(p=>({p:p.replace("♟","♙"),c:"white"})); board[7]=whiteBack.map(p=>({p,c:"white"}));
 turn="white";selected=null;gameOver=false;render();
}
function colorAt(r,c){return board[r]?.[c]?.c}
function inside(r,c){return r>=0&&r<8&&c>=0&&c<8}
function pawnMoves(r,c,p){
 let out=[],d=p.c==="white"?-1:1,start=p.c==="white"?6:1;
 if(inside(r+d,c)&&!board[r+d][c]){out.push([r+d,c]);if(r===start&&!board[r+2*d][c])out.push([r+2*d,c])}
 for(const dc of[-1,1])if(inside(r+d,c+dc)&&board[r+d][c+dc]&&board[r+d][c+dc].c!==p.c)out.push([r+d,c+dc]);
 return out;
}
function moves(r,c){
 const p=board[r][c];if(!p)return[];
 if(p.p==="♙"||p.p==="♟")return pawnMoves(r,c,p);
 const knight=p.p==="♘"||p.p==="♞",king=p.p==="♔"||p.p==="♚";
 const dirs=king||knight?[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
 const out=[];
 if(knight){for(const [dr,dc] of[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]])if(inside(r+dr,c+dc)&&colorAt(r+dr,c+dc)!==p.c)out.push([r+dr,c+dc]);return out}
 for(const [dr,dc] of dirs){let rr=r+dr,cc=c+dc;while(inside(rr,cc)){if(!board[rr][cc])out.push([rr,cc]);else{if(board[rr][cc].c!==p.c)out.push([rr,cc]);break}if(king)break;rr+=dr;cc+=dc}}
 if(p.p==="♗"||p.p==="♝")return out.filter(([rr,cc])=>Math.abs(rr-r)===Math.abs(cc-c));
 if(p.p==="♜"||p.p==="♖")return out.filter(([rr,cc])=>rr===r||cc===c);
 return out;
}
function render(){
 boardEl.innerHTML="";
 for(let vr=0;vr<8;vr++)for(let vc=0;vc<8;vc++){
  const r=flipped?7-vr:vr,c=flipped?7-vc:vc,s=document.createElement("div");
  s.className="square "+((r+c)%2?"dark":"light");
  if(selected&&selected[0]===r&&selected[1]===c)s.classList.add("selected");
  if(selected&&moves(...selected).some(x=>x[0]===r&&x[1]===c))s.classList.add(board[r][c]?"capture":"move");
  if(board[r][c])s.textContent=board[r][c].p;
  s.onclick=()=>clickSquare(r,c);boardEl.appendChild(s);
 }
 statusEl.textContent=gameOver?"Game Over — Restart to play":`${turn==="white"?"White":"Black"}'s turn`;
}
function clickSquare(r,c){
 if(gameOver)return;
 const p=board[r][c];
 if(selected){
  if(moves(...selected).some(x=>x[0]===r&&x[1]===c)){
   const target=board[r][c];board[r][c]=board[selected[0]][selected[1]];board[selected[0]][selected[1]]=null;
   if(target?.p==="♔"||target?.p==="♚")gameOver=true;
   const moved=board[r][c];
   if(moved.p==="♙"&&r===0)moved.p="♕";
   if(moved.p==="♟"&&r===7)moved.p="♛";
   turn=turn==="white"?"black":"white";selected=null;render();return;
  }
  if(p&&p.c===turn){selected=[r,c];render();return}
  selected=null;render();return;
 }
 if(p&&p.c===turn){selected=[r,c];render()}
}
document.getElementById("restart").onclick=newGame;
document.getElementById("flip").onclick=()=>{flipped=!flipped;render()};
newGame();
