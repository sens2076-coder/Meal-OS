const MILPREP_POOL = [
  { id:1, name:"소고기 두부완자", type:"다짐육", cube:true },
  { id:2, name:"소고기 채소완자", type:"다짐육", cube:true },
  { id:3, name:"소고기 시금치완자", type:"다짐육", cube:true },
  { id:4, name:"소고기 감자조림", type:"다짐육", cube:false },
  { id:5, name:"소고기 무조림", type:"다짐육", cube:false },
  { id:6, name:"소고기 두부조림", type:"다짐육", cube:false },
  { id:7, name:"소고기 애호박볶음", type:"다짐육", cube:true },
  { id:8, name:"소고기 뭇국", type:"국거리", cube:false },
  { id:9, name:"소고기 미역국", type:"국거리", cube:false },
  { id:10, name:"소고기 감자국", type:"국거리", cube:false },
  { id:11, name:"소고기 무찜", type:"국거리", cube:false },
  { id:12, name:"소고기 양배추찜", type:"국거리", cube:false },
  { id:13, name:"소고기 브로콜리찜", type:"국거리", cube:false },
  { id:14, name:"소불고기", type:"슬라이스", cube:false },
  { id:15, name:"소고기 숙주볶음", type:"슬라이스", cube:false },
  { id:16, name:"소고기 파프리카볶음", type:"슬라이스", cube:false },
  { id:17, name:"소고기 버섯볶음", type:"슬라이스", cube:false },
  { id:18, name:"소고기 라구소스", type:"라구", cube:false }
];
const SIDE_POOL = {
  leaf: ["시금치나물","청경채볶음","오이무침","깻잎나물","양배추볶음"],
  stick: ["브로콜리찜","파프리카(생)","당근(생)","오이(생)","비트찜"],
  other: ["애호박볶음","애호박구이","연근조림","감자조림","멸치볶음"]
};
const NUTRITION_TARGETS = {
  protein: { target:105, unit:"g", label:"단백질" },
  calcium: { target:700, unit:"mg", label:"칼슘" },
  iron: { target:8, unit:"mg", label:"철분" },
  zinc: { target:3, unit:"mg", label:"아연" },
  vitaminA: { target:400, unit:"μg", label:"비타민A" },
  vitaminC: { target:100, unit:"mg", label:"비타민C" },
  omega3: { target:1.5, unit:"g", label:"오메가3" }
};
const THAW_SCHEDULE = {
  "토": { thaw_day:"금", time:"22:00" },
  "일": { thaw_day:"토", time:"22:00" },
  "월": { thaw_day:"일", time:"22:00" },
  "화": { thaw_day:"월", time:"22:00" },
  "수": { thaw_day:"화", time:"22:00" },
  "목": { thaw_day:"수", time:"22:00" },
  "금": { thaw_day:"목", time:"22:00" }
};