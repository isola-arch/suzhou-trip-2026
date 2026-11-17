// PNG icon/OG-card generator — pure Node (zlib), no deps.
const zlib=require('zlib'),fs=require('fs');
const T=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;T[n]=c>>>0;}
const crc=b=>{let c=~0;for(const x of b)c=T[(c^x)&255]^(c>>>8);return(~c)>>>0;};
const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const ty=Buffer.from(t);const c=Buffer.alloc(4);c.writeUInt32BE(crc(Buffer.concat([ty,d])));return Buffer.concat([l,ty,d,c]);};
function png(w,h,px){const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;
  const raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;Buffer.from(px.buffer,y*w*4,w*4).copy(raw,y*(w*4+1)+1);}
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);}

// palette (matches site dark theme + orange accent)
const BG=[15,15,16,255],OR=[232,118,79,255],CR=[232,230,225,255],DIM=[90,88,82,255];
const put=(px,w,x,y,c)=>{const i=(y*w+x)*4;px[i]=c[0];px[i+1]=c[1];px[i+2]=c[2];px[i+3]=c[3];};

function draw(w,h,px){
  const s=Math.min(w,h);
  const cx=w*0.5,cy=h*0.55,R=s*0.27,th=s*0.035;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    let c=BG;
    // subtle vignette
    const dx=x/w-0.5,dy=y/h-0.5,vig=1-(dx*dx+dy*dy)*0.55;
    c=[BG[0]*vig|0,BG[1]*vig|0,BG[2]*vig|0,255];
    // moon disc
    const mx=w*0.74,my=h*0.24,mr=s*0.055;
    if((x-mx)**2+(y-my)**2<mr*mr)c=CR;
    // moon-bridge ring (full circle = arch + reflection)
    const d=Math.hypot(x-cx,y-cy);
    if(Math.abs(d-R)<th)c=OR;
    // water line through bridge centre
    if(Math.abs(y-cy)<s*0.008&&Math.abs(x-cx)<R*1.5)c=[OR[0],OR[1],OR[2],255];
    // wave dashes below
    for(const [wy,wl] of [[0.68,0.10],[0.74,0.16],[0.80,0.09]]){
      const yy=h*wy;
      if(Math.abs(y-yy)<s*0.004&&Math.abs(x-cx)<s*wl)c=DIM;
    }
    put(px,w,x,y,c);
  }
}
function gen(w,h,file,ss=2){
  const W=w*ss,H=h*ss,big=new Uint8Array(W*H*4);draw(W,H,big);
  const px=new Uint8Array(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){let r=0,g=0,b=0,a=0;
    for(let j=0;j<ss;j++)for(let i=0;i<ss;i++){const k=((y*ss+j)*W+x*ss+i)*4;r+=big[k];g+=big[k+1];b+=big[k+2];a+=big[k+3];}
    const o=(y*w+x)*4,n=ss*ss;px[o]=r/n;px[o+1]=g/n;px[o+2]=b/n;px[o+3]=a/n;}
  fs.writeFileSync(file,png(w,h,px));console.log(file,w+'x'+h,fs.statSync(file).size+'B');
}
gen(512,512,'icon-512.png',4);
gen(192,192,'icon-192.png',4);
gen(1200,630,'og-card.png',2);
