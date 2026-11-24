/* 자취방 멀티탭 현실형 가상 데이터 생성기
   실행: node make_realistic_data.js  →  powerstrip_realistic.csv 생성 (seed가 같으면 결과도 같음)

   [출처가 있는 값]
   - 기기 소비전력: 프로그램 HTML의 DEVICE_DB (공단 값·추정값)
   - 단자 온도 상승 한도 45K: KC 60884-1
   - 온도는 전류의 제곱에 비례, 약 2.4분에 63% 도달: 전기안전연구원 2015 실험의 20A·30A 온도표에서 계산
   - 멀티탭 정격은 보통 16A: 한국화재보험협회

   [팀이 정한 가정]  ※ 공식 통계를 찾지 못함
   - 기기 보유 비율, 사용 횟수·시간대, 16A:10A = 8:2, 사용 연수·먼지·손상·발열·연속 연결 비율

   [정답 등급]
   - 프로그램의 점수를 쓰지 않고, 28일 모의 사용의 최고 온도 상승으로 정함 (assignLabel)
   - 가장 나쁜 합격품을 가정: 정격전류에서 정확히 45K 상승 */
const fs = require("fs"), path = require("path");
const ROWS = 1000, DAYS = 28, SEED = +process.argv[4] || 20261124, LIMIT_K = 45, TAU_MIN = 2.4;

/* 난수 (seed 고정) */
let s = SEED;
const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1)), chance = p => rnd() < p, pick = a => a[Math.floor(rnd() * a.length)];
const pickW = l => { let r = rnd() * l.reduce((x, y) => x + y[1], 0); for (const [v, w] of l) if ((r -= w) < 0) return v; return l[0][0]; };

/* 소비전력은 프로그램과 같은 값을 사용 */
const program = ["멀티탭위험도판정기.html", "powerstrip-risk.html"].map(f => path.join(__dirname, f)).find(f => fs.existsSync(f));
const html = fs.readFileSync(process.argv[2] || program, "utf8");
const WATTS = {};
for (const m of html.matchAll(/id:"(\w+)",\s*cat:"[^"]+",\s*name:"[^"]+",\s*watts:(\d+)/g)) WATTS[m[1]] = +m[2];

/* 사용 습관 가정: [하루에 쓸 확률, 횟수 최소, 최대, 1회 분 최소, 최대, 시작 시각 후보] */
const M = [7, 8], L = [12, 13], N = [18, 19, 20], E = [21, 22, 23];
const HABIT = {
  laptop:[.95,1,1,180,480,[10,14,18,19]], mon24:[.9,1,1,180,420,[10,14,18,19]], mon27:[.9,1,1,180,420,[10,14,18,19]],
  phone:[1,1,1,90,180,[22,23,0]], stand:[.8,1,1,120,360,[18,19,20]], tv43:[.7,1,1,60,240,[19,20,21]], beam:[.2,1,1,60,150,E],
  airclean:[.8,1,1,300,900,[9,18,21]], ledbulb:[.9,1,1,180,360,[18,19]], laser:[.1,1,1,3,10,[14,19]],
  humid_u:[.6,1,1,300,540,[21,22,23]], humid_h:[.6,1,1,240,540,[21,22,23]], blanket:[.7,1,1,300,540,[22,23,0]],
  fanheater:[.6,1,2,30,180,[7,18,19,21,22]], stove:[.6,1,2,30,180,[7,18,19,21,22]], fridge:[1,1,1,1440,1440,[0]],
  dryer:[.95,1,1,5,12,[...M,...E]], straight:[.5,1,1,5,15,M], iron:[.1,1,1,8,20,[7,21]], vacuum:[.25,1,1,8,20,[11,15]],
  kettle:[.7,1,3,3,6,[...M,...L,...N,21]], microwave:[.8,1,2,2,6,[...M,...L,...N]], airfryer:[.35,1,1,12,25,N], rice6:[.5,1,1,25,45,[7,17,18]],
  ramen:[.35,1,1,7,12,[...L,...N]], induction:[.5,1,1,10,30,N], toaster:[.25,1,1,3,5,M], coffee:[.7,1,2,1,3,[...M,...L,15]],
};
/* 멀티탭 위치 가정: [위치, 가중치, [[기기, 꽂혀 있을 확률]...]] */
const PLACE = [
  ["책상", 35, [["laptop",.95],["mon24",.3],["mon27",.3],["phone",.9],["stand",.6],["ledbulb",.1],["laser",.05],["humid_u",.15],["airclean",.1]]],
  ["침대 옆", 20, [["phone",.95],["stand",.5],["humid_u",.35],["humid_h",.15],["blanket",.5],["laptop",.3],["airclean",.2],["tv43",.2],["beam",.1],["fanheater",.08],["stove",.08]]],
  ["주방", 20, [["fridge",.6],["microwave",.75],["kettle",.7],["rice6",.5],["airfryer",.35],["induction",.15],["ramen",.2],["toaster",.15],["coffee",.2]]],
  ["화장대", 12, [["dryer",.95],["straight",.6],["phone",.6],["stand",.4],["iron",.1],["vacuum",.15]]],
  ["몰아 쓰기", 13, [["laptop",.8],["phone",.9],["stand",.4],["tv43",.3],["dryer",.6],["kettle",.45],["microwave",.35],["fridge",.3],["blanket",.35],["fanheater",.25],["humid_u",.2],["airfryer",.15]]],
];

/* 28일 동안 1분 간격으로 켜고 끄며 부하와 온도 상승을 계산 */
function simulate(ids, capacity){
  const total = DAYS * 1440, load = new Float32Array(total), use = {};
  for (const id of ids){
    const on = new Uint8Array(total);
    if (id === "fridge") on.fill(1);
    else {
      const [p, n0, n1, a, b, hs] = HABIT[id];
      for (let d = 0; d < DAYS; d++) if (chance(p)) for (let k = ri(n0, n1); k > 0; k--){
        const st = d * 1440 + pick(hs) * 60 + ri(0, 59), end = Math.min(st + ri(a, b), total);
        for (let t = st; t < end; t++) on[t] = 1;
      }
    }
    use[id] = 0;
    for (let t = 0; t < total; t++) if (on[t]){ load[t] += WATTS[id]; use[id]++; }
  }
  let T = 0, maxT = 0, peak = 0, over80 = 0, over100 = 0; const k = 1 - Math.exp(-1 / TAU_MIN);
  for (let t = 0; t < total; t++){
    const r = load[t] / capacity;
    T += (LIMIT_K * r * r - T) * k;
    maxT = Math.max(maxT, T); peak = Math.max(peak, load[t]);
    if (r >= .8) over80++; if (r > 1) over100++;
  }
  return { maxT, peak, over80: over80 / DAYS, over100: over100 / DAYS, hours: ids.map(i => use[i] / DAYS / 60) };
}

/* 정답 등급: 0 안전, 1 주의, 2 위험, 3 매우 위험 */
function assignLabel(r, sim){
  let g = sim.maxT > LIMIT_K * 1.25 ** 2 ? 3      // 정격의 125%를 계속 쓴 온도 초과
        : sim.maxT > LIMIT_K ? 2                  // KC 한도 45K 초과
        : sim.maxT > LIMIT_K * .8 ** 2 ? 1 : 0;   // 정격의 80%를 계속 쓴 온도 초과
  if (r.damage || r.overheat || r.daisy) g = Math.max(g, 2);
  if (r.dust || r.years >= 5) g = Math.max(g, 1);
  return g;
}

const out = ["id,place,amps,capacity_w,sockets,age_years,dust,damage,overheat,daisy_chain,devices,hours,total_w,peak_w,peak_load_ratio,min_over80_per_day,min_over100_per_day,max_rise_k,label,source_type"];
for (let i = 1; i <= ROWS; i++){
  const [name, , devs] = pickW(PLACE.map(p => [p, p[1]]));
  let ids = [];
  while (ids.length < 2) ids = devs.filter(([, p]) => chance(p)).map(x => x[0]);
  const r = {
    amps: chance(.8) ? 16 : 10,
    sockets: chance(.08) ? Math.max(1, ids.length - 1) : Math.max(ids.length, pickW([[2,1],[3,3],[4,5],[5,2],[6,2]])),
    years: pickW([[0,12],[1,20],[2,20],[3,16],[4,11],[5,9],[6,5],[7,4],[8,3]]),
    dust: +chance(.12), damage: +chance(.02), overheat: +chance(.015), daisy: +chance(.05),
  };
  const cap = 220 * r.amps, sim = simulate(ids, cap);
  out.push([i, name, r.amps, cap, r.sockets, r.years, r.dust, r.damage, r.overheat, r.daisy, ids.join("|"), sim.hours.map(h => h.toFixed(1)).join("|"),
    ids.reduce((a, x) => a + WATTS[x], 0), Math.round(sim.peak), (sim.peak / cap).toFixed(3), sim.over80.toFixed(2), sim.over100.toFixed(2), sim.maxT.toFixed(1), assignLabel(r, sim), "synthetic_simulation"].join(","));
}
fs.writeFileSync(process.argv[3] || path.join(__dirname, "powerstrip_realistic.csv"), "﻿" + out.join("\n") + "\n");
console.log("생성 완료:", ROWS, "행");
