const fs=require('fs');
const SITE='https://isola-arch.github.io/suzhou-trip-2026';
const PAGES={
 'hub.html':            {t:'蘇州·烏鎮 11/19–23 · 文件總表',d:'香港出發 5 日｜蘇州 3 晚 + 烏鎮西柵 1 晚——行程表、拖放 Builder、學習筆記總入口'},
 'functional.html':     {t:'苏州·乌镇·杭州 5 日 · 操作版',d:'逐時段行程＋住宿＋交通＋預約清單｜D1 方案切換、D4 三版上午、備選標記'},
 'builder.html':        {t:'行程 Builder · 資料驅動版',d:'61 個候選地點拖放排程｜自動計時、腿段、費用，自由重組'},
 'index.html':          {t:'苏州·乌镇 4 日 — 香港出发',d:'行程總覽＋互動地圖'},
 'wuzhen-guide.html':   {t:'乌镇西栅 · 万无一失攻略',d:'西柵吃住玩全指南'},
 'shanghai-reader.html':{t:'Day 1 上海快闪 · 图解',d:'外灘／南京路／豫園 圖解學習頁'},
};
for(const [f,m] of Object.entries(PAGES)){
  let s=fs.readFileSync(f,'utf8');
  if(s.includes('og:title')){console.log(f,'already has meta — skip');continue;}
  s=s.replace('<link rel="icon" href="data:,">\n','').replace('<link rel="icon" href="data:,">','');
  const block=[
   `<meta name="description" content="${m.d}">`,
   `<meta name="theme-color" content="#0f0f10">`,
   `<link rel="manifest" href="manifest.webmanifest">`,
   `<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">`,
   `<link rel="apple-touch-icon" href="icon-512.png">`,
   `<meta name="apple-mobile-web-app-capable" content="yes">`,
   `<meta name="apple-mobile-web-app-title" content="蘇州行程">`,
   `<meta property="og:type" content="website">`,
   `<meta property="og:title" content="${m.t}">`,
   `<meta property="og:description" content="${m.d}">`,
   `<meta property="og:url" content="${SITE}/${f}">`,
   `<meta property="og:image" content="${SITE}/og-card.png">`,
   `<meta name="twitter:card" content="summary_large_image">`,
  ].join('\n');
  if(!/<\/title>/.test(s)){console.log(f,'NO </title> — skip');continue;}
  s=s.replace(/(<\/title>)/,`$1\n${block}`);
  fs.writeFileSync(f,s);console.log(f,'meta injected');
}
