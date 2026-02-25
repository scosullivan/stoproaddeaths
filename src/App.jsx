import { useState, useEffect } from "react";

// County data
const COUNTIES = {
  "Dublin":{d:22,p24:23,pop:1458154,lat:53.35,lng:-6.26,j:"ROI"},
  "Cork":{d:21,p24:19,pop:584156,lat:51.90,lng:-8.47,j:"ROI"},
  "Galway":{d:13,p24:10,pop:277440,lat:53.27,lng:-8.86,j:"ROI"},
  "Donegal":{d:12,p24:17,pop:166321,lat:54.83,lng:-7.95,j:"ROI"},
  "Mayo":{d:11,p24:19,pop:137231,lat:53.76,lng:-9.53,j:"ROI"},
  "Tipperary":{d:10,p24:10,pop:167895,lat:52.67,lng:-7.83,j:"ROI"},
  "Kerry":{d:9,p24:7,pop:155258,lat:52.06,lng:-9.85,j:"ROI"},
  "Limerick":{d:8,p24:5,pop:204564,lat:52.66,lng:-8.63,j:"ROI"},
  "Wexford":{d:7,p24:5,pop:163919,lat:52.48,lng:-6.58,j:"ROI"},
  "Meath":{d:7,p24:4,pop:210990,lat:53.61,lng:-6.66,j:"ROI"},
  "Kildare":{d:7,p24:6,pop:247328,lat:53.21,lng:-6.77,j:"ROI"},
  "Waterford":{d:7,p24:4,pop:127085,lat:52.26,lng:-7.12,j:"ROI"},
  "Clare":{d:6,p24:3,pop:127938,lat:52.84,lng:-8.98,j:"ROI"},
  "Wicklow":{d:5,p24:4,pop:155851,lat:52.97,lng:-6.37,j:"ROI"},
  "Laois":{d:5,p24:3,pop:91657,lat:53.03,lng:-7.56,j:"ROI"},
  "Offaly":{d:4,p24:2,pop:82668,lat:53.24,lng:-7.60,j:"ROI"},
  "Kilkenny":{d:4,p24:3,pop:103685,lat:52.65,lng:-7.25,j:"ROI"},
  "Roscommon":{d:4,p24:3,pop:69995,lat:53.76,lng:-8.27,j:"ROI"},
  "Westmeath":{d:3,p24:2,pop:95840,lat:53.53,lng:-7.40,j:"ROI"},
  "Sligo":{d:3,p24:2,pop:70198,lat:54.27,lng:-8.47,j:"ROI"},
  "Cavan":{d:3,p24:3,pop:81704,lat:53.99,lng:-7.36,j:"ROI"},
  "Louth":{d:3,p24:2,pop:139703,lat:53.92,lng:-6.49,j:"ROI"},
  "Monaghan":{d:3,p24:2,pop:64832,lat:54.25,lng:-6.97,j:"ROI"},
  "Carlow":{d:3,p24:2,pop:61931,lat:52.84,lng:-6.93,j:"ROI"},
  "Leitrim":{d:2,p24:1,pop:35199,lat:54.12,lng:-8.00,j:"ROI"},
  "Longford":{d:0,p24:1,pop:46634,lat:53.73,lng:-7.79,j:"ROI"},
  "Antrim":{d:16,p24:20,pop:618108,lat:54.72,lng:-6.21,j:"NI"},
  "Down":{d:12,p24:15,pop:361710,lat:54.33,lng:-5.87,j:"NI"},
  "Armagh":{d:12,p24:14,pop:216205,lat:54.35,lng:-6.65,j:"NI"},
  "Tyrone":{d:9,p24:11,pop:189860,lat:54.58,lng:-7.30,j:"NI"},
  "Fermanagh":{d:6,p24:5,pop:64414,lat:54.34,lng:-7.64,j:"NI"},
  "Derry":{d:2,p24:4,pop:253668,lat:55.00,lng:-7.31,j:"NI"},
};

// TDs by constituency (34th Dáil, elected Nov 2024)
const TDS = {
  "Carlow–Kilkenny":[{n:"John McGuinness",p:"FF"},{n:"Kathleen Funchion",p:"SF"},{n:"John Paul Phelan",p:"FG"},{n:"Peter Cleere",p:"FF"},{n:"Malcolm Noonan",p:"GP"}],
  "Cavan–Monaghan":[{n:"Matt Carthy",p:"SF"},{n:"Cathy Bennett",p:"SF"},{n:"Niamh Smyth",p:"FF"},{n:"Brendan Smith",p:"FF"},{n:"Pauline Tully",p:"SF"}],
  "Clare":[{n:"Cathal Crowe",p:"FF"},{n:"Donna McGettigan",p:"SF"},{n:"Michael McNamara",p:"Ind"},{n:"Violet-Anne Wynne",p:"Ind"}],
  "Cork East":[{n:"David Stanton",p:"FG"},{n:"Pat Buckley",p:"SF"},{n:"James O'Connor",p:"FF"},{n:"Liam Quaide",p:"SD"}],
  "Cork North-Central":[{n:"Padraig O'Sullivan",p:"FF"},{n:"Thomas Gould",p:"SF"},{n:"Colm Burke",p:"FG"},{n:"Eoghan Kenny",p:"Lab"},{n:"Ken O'Flynn",p:"II"}],
  "Cork North-West":[{n:"Aindrias Moynihan",p:"FF"},{n:"Michael Moynihan",p:"FF"},{n:"John Paul O'Shea",p:"FG"}],
  "Cork South-Central":[{n:"Micheál Martin",p:"FF"},{n:"Simon Coveney",p:"FG"},{n:"Donnchadh Ó Laoghaire",p:"SF"},{n:"Pádraig Rice",p:"SD"},{n:"Mick Barry",p:"PBP"}],
  "Cork South-West":[{n:"Holly Cairns",p:"SD"},{n:"Christopher O'Sullivan",p:"FF"},{n:"Tim Lombard",p:"FG"}],
  "Donegal":[{n:"Pearse Doherty",p:"SF"},{n:"Pat the Cope Gallagher",p:"FF"},{n:"Charlie McConalogue",p:"FF"},{n:"Pádraig Mac Lochlainn",p:"SF"},{n:"Charles Ward",p:"100%R"}],
  "Dublin Bay North":[{n:"Cian O'Callaghan",p:"SD"},{n:"Richard Bruton",p:"FG"},{n:"Aodhán Ó Ríordáin",p:"Lab"},{n:"Denise Mitchell",p:"SF"},{n:"Tom Brabazon",p:"FF"}],
  "Dublin Bay South":[{n:"Jim O'Callaghan",p:"FF"},{n:"Eoin Hayes",p:"SD"},{n:"Kate O'Connell",p:"FG"},{n:"Chris Andrews",p:"SF"}],
  "Dublin Central":[{n:"Mary Lou McDonald",p:"SF"},{n:"Paschal Donohoe",p:"FG"},{n:"Gary Gannon",p:"SD"},{n:"Marie Sherlock",p:"Lab"}],
  "Dublin Fingal East":[{n:"Alan Farrell",p:"FG"},{n:"Joe O'Brien",p:"FG"},{n:"Darragh O'Brien",p:"FF"}],
  "Dublin Fingal West":[{n:"Louise O'Reilly",p:"SF"},{n:"Robert O'Donoghue",p:"Lab"},{n:"Lorraine Clifford-Lee",p:"FF"}],
  "Dublin Mid-West":[{n:"Eoin Ó Broin",p:"SF"},{n:"Shane Moynihan",p:"FF"},{n:"Mark Ward",p:"SF"},{n:"Emer Currie",p:"FG"},{n:"John Curran",p:"FF"}],
  "Dublin North-West":[{n:"Dessie Ellis",p:"SF"},{n:"Rory Hearne",p:"SD"},{n:"Paul McAuliffe",p:"FF"},{n:"Noel Rock",p:"FG"},{n:"Roderic O'Gorman",p:"GP"}],
  "Dublin Rathdown":[{n:"Neale Richmond",p:"FG"},{n:"Shay Brennan",p:"FF"},{n:"Sinéad Gibney",p:"SD"},{n:"Shane Cassells",p:"FF"}],
  "Dublin South-Central":[{n:"Catherine Ardagh",p:"FF"},{n:"Máire Devine",p:"SF"},{n:"Jen Cummins",p:"SD"},{n:"Bríd Smith",p:"PBP"}],
  "Dublin South-West":[{n:"Seán Crowe",p:"SF"},{n:"John Lahart",p:"FF"},{n:"Ciarán Ahern",p:"Lab"},{n:"Colm Brophy",p:"FG"},{n:"Paul Murphy",p:"PBP"}],
  "Dublin West":[{n:"Jack Chambers",p:"FF"},{n:"Joan Collins",p:"Ind"},{n:"Emer Currie",p:"FG"},{n:"Mark Ward",p:"SF"},{n:"Roderic O'Gorman",p:"GP"}],
  "Dún Laoghaire":[{n:"Jennifer Carroll MacNeill",p:"FG"},{n:"Cormac Devlin",p:"FF"},{n:"Richard Boyd Barrett",p:"PBP"},{n:"Barry Ward",p:"FG"}],
  "Galway East":[{n:"Seán Canney",p:"Ind"},{n:"Ciaran Cannon",p:"FG"},{n:"Albert Dolan",p:"FF"},{n:"Louis O'Hara",p:"SF"}],
  "Galway West":[{n:"Noel Grealish",p:"Ind"},{n:"John Connolly",p:"FF"},{n:"Mairéad Farrell",p:"SF"},{n:"Hildegarde Naughton",p:"FG"},{n:"Catherine Connolly",p:"Ind"}],
  "Kerry":[{n:"Pa Daly",p:"SF"},{n:"Brendan Griffin",p:"FG"},{n:"Norma Foley",p:"FF"},{n:"Michael Cahill",p:"FF"},{n:"Danny Healy-Rae",p:"Ind"}],
  "Kildare North":[{n:"James Lawless",p:"FF"},{n:"Catherine Murphy",p:"SD"},{n:"Réada Cronin",p:"SF"},{n:"Naoise Ó Cearúil",p:"FF"},{n:"Joe Neville",p:"FG"}],
  "Kildare South":[{n:"Seán Ó Fearghaíl",p:"FF"},{n:"Martin Heydon",p:"FG"},{n:"Shónagh Ní Raghallaigh",p:"SF"},{n:"Mark Wall",p:"Lab"}],
  "Laois":[{n:"Brian Stanley",p:"Ind"},{n:"Seán Fleming",p:"FF"},{n:"William Aird",p:"FG"}],
  "Limerick City":[{n:"Willie O'Dea",p:"FF"},{n:"Brian Leddin",p:"GP"},{n:"Maurice Quinlivan",p:"SF"},{n:"Conor Sheehan",p:"Lab"}],
  "Limerick County":[{n:"Niall Collins",p:"FF"},{n:"Patrick O'Donovan",p:"FG"},{n:"Richard O'Donoghue",p:"Ind"}],
  "Longford–Westmeath":[{n:"Peter Burke",p:"FG"},{n:"Kevin 'Boxer' Moran",p:"Ind"},{n:"Joe Flaherty",p:"FF"},{n:"Sorca Clarke",p:"SF"},{n:"Marian Harkin",p:"Ind"}],
  "Louth":[{n:"Imelda Munster",p:"SF"},{n:"Erin McGreehan",p:"FF"},{n:"Ruairí Ó Murchú",p:"SF"},{n:"Fergus O'Dowd",p:"FG"},{n:"Gillian Toole",p:"Ind"}],
  "Mayo":[{n:"Dara Calleary",p:"FF"},{n:"Alan Dillon",p:"FG"},{n:"Rose Conway-Walsh",p:"SF"},{n:"Michael Ring",p:"FG"},{n:"Paul Lawless",p:"Aontú"}],
  "Meath East":[{n:"Thomas Byrne",p:"FF"},{n:"Darren O'Rourke",p:"SF"},{n:"Helen McEntee",p:"FG"},{n:"Barry Heneghan",p:"Ind"}],
  "Meath West":[{n:"Shane Cassells",p:"FF"},{n:"Johnny Guirke",p:"SF"},{n:"Aisling Dempsey",p:"FF"}],
  "Offaly":[{n:"Carol Nolan",p:"Ind"},{n:"Tony McCormack",p:"FF"},{n:"Barry Cowen",p:"FF"}],
  "Roscommon–Galway":[{n:"Michael Fitzmaurice",p:"II"},{n:"Claire Kerrane",p:"SF"},{n:"Martin Daly",p:"FF"}],
  "Sligo–Leitrim":[{n:"Martin Kenny",p:"SF"},{n:"Frank Feighan",p:"FG"},{n:"Marc MacSharry",p:"FF"},{n:"Michael Lowry",p:"Ind"}],
  "Tipperary North":[{n:"Michael Lowry",p:"Ind"},{n:"Ryan O'Meara",p:"FF"},{n:"Jackie Cahill",p:"FF"}],
  "Tipperary South":[{n:"Mattie McGrath",p:"Ind"},{n:"Séamus Healy",p:"Ind"},{n:"Imelda Goldsboro",p:"FG"}],
  "Waterford":[{n:"David Cullinane",p:"SF"},{n:"Mary Butler",p:"FF"},{n:"John Cummins",p:"FG"},{n:"Conor D. McGuinness",p:"SF"}],
  "Wexford":[{n:"James Browne",p:"FF"},{n:"Johnny Mythen",p:"SF"},{n:"George Lawlor",p:"Lab"},{n:"Verona Murphy",p:"Ind"}],
  "Wicklow":[{n:"Simon Harris",p:"FG"},{n:"John Brady",p:"SF"},{n:"Jennifer Whitmore",p:"SD"},{n:"Edward Timmins",p:"FG"}],
  "Wicklow–Wexford":[{n:"Brian Brennan",p:"FG"},{n:"Michael D'Arcy",p:"FF"},{n:"Conor McGuinness",p:"SF"}],
};

// MLAs by constituency (NI Assembly, elected May 2022)
const MLAS = {
  "Belfast North":[{n:"Gerry Kelly",p:"SF"},{n:"Phillip Brett",p:"DUP"},{n:"Nuala McAllister",p:"All"},{n:"Nichola Mallon",p:"SDLP"},{n:"Brian Kingston",p:"DUP"}],
  "Belfast South":[{n:"Kate Nicholl",p:"All"},{n:"Edwin Poots",p:"DUP"},{n:"Deirdre Hargey",p:"SF"},{n:"Matthew O'Toole",p:"SDLP"},{n:"Paula Bradshaw",p:"All"}],
  "Belfast East":[{n:"Naomi Long",p:"All"},{n:"David Brooks",p:"DUP"},{n:"Joanne Bunting",p:"DUP"},{n:"Andrew Muir",p:"All"},{n:"Mairéad Maguire",p:"SF"}],
  "Belfast West":[{n:"Órlaithí Flynn",p:"SF"},{n:"Pat Sheehan",p:"SF"},{n:"Ciara Ferguson",p:"SF"},{n:"Danny Baker",p:"PBPA"},{n:"Frank McCoubrey",p:"DUP"}],
  "South Antrim":[{n:"Steve Aiken",p:"UUP"},{n:"Danny Donnelly",p:"All"},{n:"Pam Cameron",p:"DUP"},{n:"Declan Kearney",p:"SF"},{n:"Trevor Clarke",p:"DUP"}],
  "East Antrim":[{n:"Stewart Dickson",p:"All"},{n:"Gordon Lyons",p:"DUP"},{n:"Cheryl Brownlee",p:"DUP"},{n:"John Stewart",p:"UUP"},{n:"Donncha Ó Laoghaire",p:"SF"}],
  "North Antrim":[{n:"Jim Allister",p:"TUV"},{n:"Philip McGuigan",p:"SF"},{n:"Paul Frew",p:"DUP"},{n:"Cara Hunter",p:"SDLP"},{n:"Robin Swann",p:"UUP"}],
  "Lagan Valley":[{n:"Sorcha Eastwood",p:"All"},{n:"Paul Givan",p:"DUP"},{n:"Jonathan Buckley",p:"DUP"},{n:"Robbie Butler",p:"UUP"},{n:"Eóin Tennyson",p:"All"}],
  "South Down":[{n:"Sinéad Ennis",p:"SF"},{n:"Cathy Mason",p:"SF"},{n:"Colin McGrath",p:"SDLP"},{n:"Diane Forsythe",p:"DUP"},{n:"Patrick Brown",p:"All"}],
  "Strangford":[{n:"Jonathan Bell",p:"DUP"},{n:"Michelle McIlveen",p:"DUP"},{n:"Mike Nesbitt",p:"UUP"},{n:"Nick Mathison",p:"All"},{n:"Connie Maybin",p:"SF"}],
  "North Down":[{n:"Stephen Farry",p:"All"},{n:"Rachel Woods",p:"All"},{n:"Gordon Dunne",p:"DUP"},{n:"Alan Chambers",p:"UUP"},{n:"Alex Easton",p:"DUP"}],
  "Newry & Armagh":[{n:"Conor Murphy",p:"SF"},{n:"Liz Kimmins",p:"SF"},{n:"Cathal Boylan",p:"SF"},{n:"William Irwin",p:"DUP"},{n:"Justin McNulty",p:"SDLP"}],
  "Upper Bann":[{n:"John O'Dowd",p:"SF"},{n:"Jonathan Buckley",p:"DUP"},{n:"Diane Dodds",p:"DUP"},{n:"Dolores Kelly",p:"SDLP"},{n:"Eóin Tennyson",p:"All"}],
  "Fermanagh & South Tyrone":[{n:"Michelle Gildernew",p:"SF"},{n:"Arlene Foster",p:"DUP"},{n:"Deborah Erskine",p:"DUP"},{n:"Diana Armstrong",p:"UUP"},{n:"John Coyle",p:"SDLP"}],
  "West Tyrone":[{n:"Maolíosa McHugh",p:"SF"},{n:"Nicola Brogan",p:"SF"},{n:"Tom Buchanan",p:"DUP"},{n:"Daniel McCrossan",p:"SDLP"},{n:"Stephen Donnelly",p:"All"}],
  "Mid Ulster":[{n:"Michelle O'Neill",p:"SF"},{n:"Emma Sheerin",p:"SF"},{n:"Patsy McGlone",p:"SDLP"},{n:"Keith Buchanan",p:"DUP"},{n:"Sandra Sheridan",p:"SF"}],
  "Foyle":[{n:"Sinéad McLaughlin",p:"SDLP"},{n:"Ciara Ferguson",p:"SF"},{n:"Pádraig Delargy",p:"SF"},{n:"Mark H. Durkan",p:"SDLP"},{n:"Gary Middleton",p:"DUP"}],
  "East Londonderry":[{n:"Cara Hunter",p:"SDLP"},{n:"Caoimhe Archibald",p:"SF"},{n:"Claire Sugden",p:"Ind"},{n:"Maurice Bradley",p:"DUP"},{n:"Alan Robinson",p:"DUP"}],
};

// Which constituencies map to which counties
const C2C = {
  "Dublin":["Dublin Bay North","Dublin Bay South","Dublin Central","Dublin Fingal East","Dublin Fingal West","Dublin Mid-West","Dublin North-West","Dublin Rathdown","Dublin South-Central","Dublin South-West","Dublin West","Dún Laoghaire"],
  "Cork":["Cork East","Cork North-Central","Cork North-West","Cork South-Central","Cork South-West"],
  "Galway":["Galway East","Galway West","Roscommon–Galway"],
  "Donegal":["Donegal"],"Mayo":["Mayo"],"Kerry":["Kerry"],
  "Tipperary":["Tipperary North","Tipperary South"],
  "Limerick":["Limerick City","Limerick County"],
  "Wexford":["Wexford","Wicklow–Wexford"],"Meath":["Meath East","Meath West"],
  "Kildare":["Kildare North","Kildare South"],"Waterford":["Waterford"],
  "Clare":["Clare"],"Wicklow":["Wicklow","Wicklow–Wexford"],
  "Laois":["Laois"],"Offaly":["Offaly"],
  "Kilkenny":["Carlow–Kilkenny"],"Roscommon":["Roscommon–Galway"],
  "Westmeath":["Longford–Westmeath"],"Sligo":["Sligo–Leitrim"],
  "Cavan":["Cavan–Monaghan"],"Louth":["Louth"],
  "Monaghan":["Cavan–Monaghan"],"Carlow":["Carlow–Kilkenny"],
  "Leitrim":["Sligo–Leitrim"],"Longford":["Longford–Westmeath"],
  "Antrim":["Belfast North","Belfast South","Belfast East","Belfast West","South Antrim","East Antrim","North Antrim","Lagan Valley"],
  "Down":["South Down","Strangford","North Down","Newry & Armagh"],
  "Armagh":["Newry & Armagh","Upper Bann","Fermanagh & South Tyrone"],
  "Tyrone":["West Tyrone","Mid Ulster","Fermanagh & South Tyrone"],
  "Fermanagh":["Fermanagh & South Tyrone"],
  "Derry":["Foyle","East Londonderry","Mid Ulster"],
};

const INCIDENTS = [
  {date:"22 Feb",loc:"Navan, Co Meath",desc:"16-year-old girl killed in hit-and-run while walking her dog. Driver arrested.",type:"pedestrian",lat:53.65,lng:-6.68},
  {date:"22 Feb",loc:"Armagh Road, Moy",desc:"Three killed — Conor Quinn (31), father of four; Laura Hoy (23), mother of one; John Guy (48), father of six.",type:"driver",lat:54.40,lng:-6.70},
  {date:"22 Feb",loc:"Co Donegal",desc:"Fatal collision — details emerging.",type:"driver",lat:54.65,lng:-8.11},
  {date:"22 Feb",loc:"South-East",desc:"Fatal collision — details emerging.",type:"driver",lat:52.35,lng:-7.05},
  {date:"22 Feb",loc:"Cork/Waterford",desc:"Fatal collision — details emerging.",type:"driver",lat:52.15,lng:-7.85},
  {date:"24 Feb",loc:"Rusheen, Riverstown, Co Sligo",desc:"Motorcyclist in his 50s killed in collision with lorry on L1303.",type:"motorcyclist",lat:54.05,lng:-8.43},
  {date:"24 Feb",loc:"St Johnston, Co Donegal",desc:"Two young men (late teens) killed when car collided with lorry on R236. Third passenger critically injured, transferred to Belfast.",type:"driver",lat:54.93,lng:-7.45},
];
const MO=[{m:"Jan",d:13},{m:"Feb",d:11},{m:"Mar",d:16},{m:"Apr",d:14},{m:"May",d:17},{m:"Jun",d:11},{m:"Jul",d:15},{m:"Aug",d:16},{m:"Sep",d:13},{m:"Oct",d:14},{m:"Nov",d:21},{m:"Dec",d:24}];
const YR=[{y:"2019",r:141,n:55,t:196},{y:"2020",r:149,n:50,t:199},{y:"2021",r:137,n:50,t:187},{y:"2022",r:155,n:62,t:217},{y:"2023",r:184,n:71,t:255},{y:"2024",r:175,n:69,t:244},{y:"2025",r:190,n:57,t:247}];

// ===== CAMPAIGN TRACKER =====
// UPDATE THIS: date you sent emails to all TDs/MLAs
const CAMPAIGN_SENT_DATE = "2026-03-01";
// UPDATE THIS: bump as people report emailing their TDs
const ACTION_COUNT = 0;
// UPDATE THIS: add responses as they come in
// status: "meaningful" | "generic" | "none"
// summary: one-line description of response (or null)
// responded: date string or null
const TRACKER = [
  // Example entries — replace/add as responses come in:
  // {n:"Micheál Martin",p:"FF",con:"Cork South-Central",j:"ROI",status:"generic",responded:"2026-03-05",summary:"Acknowledged concern, referred to RSA strategy."},
  // {n:"Mary Lou McDonald",p:"SF",con:"Dublin Central",j:"ROI",status:"meaningful",responded:"2026-03-04",summary:"Committed to raising PQs on speed limits and road safety targets."},
  // {n:"Simon Harris",p:"FG",con:"Wicklow",j:"ROI",status:"none",responded:null,summary:null},
];

const F={m:"'JetBrains Mono',monospace",h:"'Bebas Neue',sans-serif",b:"'IBM Plex Sans',sans-serif"};
const X={l:"#aaa",t:"#ccc",d:"#666",bg:"#111",br:"#2a2a2a",r:"#ff1a1a",o:"#ff6b35",g:"#ffd700",c:"#4ecdc4"};

const EMAIL_SUBJECT = "Road Safety Crisis — I Need Your Response";
const EMAIL_BODY = `Dear [TD/MLA name],

I am writing as your constituent. I am deeply concerned about the road safety crisis across the island of Ireland. In 2025, 247 people were killed on our roads — 190 in the Republic and 57 in Northern Ireland. This is the worst year in over a decade, and an 8% increase on 2024.

Last weekend alone (22 Feb 2026), seven people were killed, including a 16-year-old girl walking her dog and three parents in a single crash in Co Armagh. By Tuesday, three more were dead — two teenagers in Donegal and a motorcyclist in Sligo. Ten killed in one week.

Ireland's government's own target of no more than 72 road deaths by 2030 is now 164% above target. While the rest of the EU reduces road deaths, Ireland's have risen 31% since 2019.

I would like to know:
1. What specific actions will you take to reduce road deaths in our area?
2. Will you support mandatory lower speed limits, not optional guidelines?
3. Will you push for protected cycling and pedestrian infrastructure?
4. Will you raise this in the Dáil/Assembly through formal questions?

I look forward to your response and a specific commitment to action.

Yours sincerely,
[Your name]
[Your address]`;

function makeEmail(name, isNI) {
  const clean = name.replace(/['']/g, "'").replace(/\s+/g, " ").trim();
  const parts = clean.split(" ");
  const first = parts[0].toLowerCase().replace(/[áàâä]/g,"a").replace(/[éèêë]/g,"e").replace(/[íìîï]/g,"i").replace(/[óòôö]/g,"o").replace(/[úùûü]/g,"u").replace(/[ñ]/g,"n").replace(/[^a-z]/g,"");
  const last = parts[parts.length-1].toLowerCase().replace(/[áàâä]/g,"a").replace(/[éèêë]/g,"e").replace(/[íìîï]/g,"i").replace(/[óòôö]/g,"o").replace(/[úùûü]/g,"u").replace(/[ñ]/g,"n").replace(/[^a-z'-]/g,"");
  if (isNI) return `${first}.${last}@mla.niassembly.gov.uk`;
  return `${first}.${last}@oireachtas.ie`;
}

function deathColor(d,mx){if(!d)return"#1a2a1a";const i=Math.pow(d/mx,0.6);return`rgb(${Math.round(40+i*215)},${Math.round(20+i*6)},${Math.round(20+i*6)})`}

function CMap({sel,onSel,filt}){
  const items=Object.entries(COUNTIES).filter(([_,v])=>filt==="all"||v.j===filt);
  const mx=Math.max(...items.map(([_,c])=>c.d));
  const proj=(lat,lng)=>[((lng+10.5)/5.2)*460+20,((55.5-lat)/4.1)*520+10];
  return(<svg viewBox="0 0 500 540" style={{width:"100%",height:"100%"}}>
    <defs><filter id="gl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="dp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ff1a1a" stopOpacity="0.8"/><stop offset="100%" stopColor="#ff1a1a" stopOpacity="0"/></radialGradient></defs>
    {/* Ireland outline */}
    <path d="M404.8,44.2 L419.8,51.9 L429.6,67.1 L434,92.4 L453.5,117.8 L466.7,136.8 L457.9,155.9 L457.9,174.9 L426.9,193.9 L422.5,206.6 L418.1,219.3 L419.8,235.8 L419.8,257.3 L413.7,276.3 L409.2,282.7 L422.5,308 L419.8,333.4 L409.2,352.4 L404.8,371.5 L402.2,390.5 L398.6,409.5 L387.1,431.1 L369.4,441.2 L338.5,447.6 L316.3,460.2 L285.4,472.9 L258.8,485.6 L232.3,492 L214.6,498.3 L196.9,500.8 L179.2,511 L152.7,517.3 L117.3,523.7 L104,517.3 L90.8,498.3 L68.7,485.6 L51,479.3 L37.7,460.2 L33.3,441.2 L51,428.5 L68.7,434.9 L81.9,422.2 L68.7,409.5 L73.1,390.5 L90.8,384.1 L73.1,377.8 L68.7,365.1 L81.9,346.1 L90.8,327.1 L95.2,314.4 L77.5,308 L59.8,295.4 L55.4,289 L51,276.3 L55.4,263.7 L46.5,257.3 L55.4,248.4 L64.2,238.3 L55.4,232 L59.8,219.3 L51,206.6 L59.8,193.9 L68.7,181.2 L77.5,168.5 L104,162.2 L135,162.2 L161.5,168.5 L192.5,162.2 L188.1,155.9 L201.3,149.5 L205.8,143.2 L201.3,136.8 L210.2,130.5 L223.5,124.1 L205.8,111.5 L201.3,98.8 L214.6,79.8 L232.3,67.1 L236.7,54.4 L254.4,41.7 L281,25.2 L298.7,25.2 L316.3,35.4 L334,41.7 L356.2,48 L373.8,41.7 L404.8,44.2Z" fill="none" stroke="#666" strokeWidth="1.5" opacity="0.8"/>
    {filt==="all"&&<><line x1="60" y1="165" x2="440" y2="165" stroke="#555" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.5"/><text x="452" y="148" fill="#999" fontSize="9" fontFamily={F.m}>NI</text><text x="452" y="182" fill="#999" fontSize="9" fontFamily={F.m}>ROI</text></>}
    {items.map(([name,data])=>{const[x,y]=proj(data.lat,data.lng);const r=Math.max(13,Math.sqrt(data.d)*8.5);const s=sel===name;const c=deathColor(data.d,mx);const ni=data.j==="NI";
    return(<g key={name} onClick={()=>onSel(name)} style={{cursor:"pointer"}}>
      {data.d>=10&&<circle cx={x} cy={y} r={r+8} fill="url(#dp)" opacity={0.4}><animate attributeName="r" values={`${r+5};${r+15};${r+5}`} dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite"/></circle>}
      <circle cx={x} cy={y} r={r} fill={c} stroke={s?"#fff":ni?"#777":"#444"} strokeWidth={s?2.5:ni?1.2:0.8} strokeDasharray={ni&&!s?"3 2":"none"} opacity={0.9} filter={s?"url(#gl)":undefined}/>
      {data.d>0&&<text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={data.d>=10?14:11} fontFamily={F.h} style={{pointerEvents:"none"}}>{data.d}</text>}
      <text x={x} y={y+r+12} textAnchor="middle" fill={s?"#fff":"#999"} fontSize={8} fontFamily={F.m} fontWeight="500" style={{pointerEvents:"none",textTransform:"uppercase"}}>{name}</text>
    </g>)})}
    {INCIDENTS.map((inc,i)=>{const[x,y]=proj(inc.lat,inc.lng);if(x<0||x>500||y<0||y>540)return null;return(<g key={`i${i}`}><circle cx={x} cy={y} r={4} fill="#fff" opacity={0.9}><animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/></circle><circle cx={x} cy={y} r={2} fill="#fff"/></g>)})}
  </svg>);
}

function Stat({label,value,sub,accent=X.r}){return(
  <div style={{background:X.bg,border:`1px solid ${X.br}`,padding:"14px 16px",borderRadius:4,borderTop:`2px solid ${accent}`}}>
    <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.18em",color:X.l,marginBottom:6}}>{label}</div>
    <div style={{fontFamily:F.h,fontSize:32,color:accent,lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontFamily:F.b,fontSize:12,color:"#bbb",marginTop:4}}>{sub}</div>}
  </div>
)}

function RepPanel({name}){
  const v=COUNTIES[name];if(!v)return null;
  const isNI=v.j==="NI";
  const cons=C2C[name]||[];
  const[openCon,setOpenCon]=useState(null);
  const pc=((v.d/v.pop)*1e5).toFixed(1);const ch=v.d-v.p24;

  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    {/* Stats */}
    <div style={{padding:"16px 20px",background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,borderTop:`2px solid ${X.r}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
        <div><div style={{fontFamily:F.h,fontSize:26,color:"#fff"}}>{name.toUpperCase()}</div><div style={{fontFamily:F.m,fontSize:11,color:isNI?X.o:X.l}}>{isNI?"NORTHERN IRELAND · PSNI":"REPUBLIC · RSA"}</div></div>
        <div style={{fontFamily:F.h,fontSize:44,color:X.r}}>{v.d}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:12}}>
        <div><div style={{fontFamily:F.m,fontSize:10,color:X.l}}>VS 2024</div><div style={{fontFamily:F.h,fontSize:20,color:ch>0?X.r:ch<0?X.c:X.t}}>{ch>0?`+${ch}`:ch}</div></div>
        <div><div style={{fontFamily:F.m,fontSize:10,color:X.l}}>PER 100K</div><div style={{fontFamily:F.h,fontSize:20,color:X.g}}>{pc}</div></div>
        <div><div style={{fontFamily:F.m,fontSize:10,color:X.l}}>POP</div><div style={{fontFamily:F.h,fontSize:20,color:X.t}}>{(v.pop/1000).toFixed(0)}K</div></div>
      </div>
    </div>
    {/* Constituencies */}
    {(()=>{
      // Compute rank and context
      const allCounties=Object.entries(COUNTIES).map(([n,d])=>({name:n,...d,pc:(d.d/d.pop)*1e5}));
      const ranked=allCounties.sort((a,b)=>b.pc-a.pc);
      const rank=ranked.findIndex(c=>c.name===name)+1;
      const jurCounts=allCounties.filter(c=>c.j===(isNI?"NI":"ROI"));
      const jurDeaths=jurCounts.reduce((s,c)=>s+c.d,0);
      const jurPop=jurCounts.reduce((s,c)=>s+c.pop,0);
      const natAvg=(jurDeaths/jurPop)*1e5;
      const ratio=(pc/natAvg).toFixed(1);
      const pctOfTotal=jurDeaths>0?((v.d/jurDeaths)*100).toFixed(1):"0.0";
      const freqDays=v.d>0?Math.round(365/v.d):null;
      return(<div style={{padding:"12px 16px",background:"#0d0d0d",border:`1px solid ${X.br}`,borderRadius:4,marginBottom:0}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
          <div><div style={{fontFamily:F.m,fontSize:9,color:X.l}}>RANK (PER CAPITA)</div><div style={{fontFamily:F.h,fontSize:22,color:X.g}}>#{rank}<span style={{fontFamily:F.m,fontSize:9,color:"#888"}}> / 32</span></div></div>
          <div><div style={{fontFamily:F.m,fontSize:9,color:X.l}}>VS {isNI?"NI":"ROI"} AVG</div><div style={{fontFamily:F.h,fontSize:22,color:parseFloat(ratio)>1.2?X.r:parseFloat(ratio)<0.8?X.c:X.t}}>{ratio}×</div></div>
          <div><div style={{fontFamily:F.m,fontSize:9,color:X.l}}>% OF {isNI?"NI":"ROI"}</div><div style={{fontFamily:F.h,fontSize:22,color:X.t}}>{pctOfTotal}%</div></div>
        </div>
        {freqDays&&<div style={{fontFamily:F.b,fontSize:12,color:X.t,lineHeight:1.5}}>
          {freqDays<=30?`One death roughly every ${freqDays} days in ${name}.`:freqDays<=90?`About one death every ${freqDays} days in ${name}.`:`${v.d} ${v.d===1?"death":"deaths"} recorded in ${name} in 2025.`}
          {v.d>v.p24?` That's ${v.d-v.p24} more than 2024.`:v.d<v.p24?` Down ${v.p24-v.d} from 2024.`:` Same as 2024.`}
          {parseFloat(ratio)>1.5?` ${name}'s per-capita rate is well above the ${isNI?"NI":"national"} average.`:""}
        </div>}
      </div>);
    })()}
    <div style={{padding:"14px 18px",background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,borderLeft:`3px solid ${X.c}`}}>
      <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:X.c,marginBottom:10}}>
        {isNI?"EMAIL YOUR MLAs":"EMAIL YOUR TDs"} — CLICK YOUR CONSTITUENCY
      </div>
      {cons.map(con=>{
        const reps=isNI?MLAS[con]:TDS[con];
        const isOpen=openCon===con;
        return(<div key={con} style={{marginBottom:6}}>
          <button onClick={()=>setOpenCon(isOpen?null:con)} style={{
            display:"block",width:"100%",textAlign:"left",background:isOpen?"#1a2a2a":"#0d1a1a",
            border:`1px solid ${isOpen?X.c:"#1a2a2a"}`,borderRadius:4,padding:"8px 12px",cursor:"pointer",
            fontFamily:F.h,fontSize:16,color:isOpen?"#fff":X.c,letterSpacing:"0.03em",
          }}>
            {con.toUpperCase()} {isOpen?"▾":"▸"} {reps&&<span style={{fontFamily:F.m,fontSize:10,color:X.l,marginLeft:6}}>{reps.length} {isNI?"MLAs":"TDs"}</span>}
          </button>
          {isOpen&&reps&&(<div style={{padding:"8px 0 4px",display:"flex",flexDirection:"column",gap:4}}>
            {reps.map((rep,i)=>{
              const email=makeEmail(rep.n,isNI);
              const mailto=`mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
              return(<a key={i} href={mailto} style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 12px",background:"#0a0a0a",border:"1px solid #222",borderRadius:3,
                textDecoration:"none",cursor:"pointer",
              }}>
                <div>
                  <div style={{fontFamily:F.b,fontSize:14,color:"#fff",fontWeight:500}}>{rep.n}</div>
                  <div style={{fontFamily:F.m,fontSize:10,color:X.l}}>{rep.p} · {email}</div>
                </div>
                <div style={{fontFamily:F.h,fontSize:14,color:X.c,whiteSpace:"nowrap"}}>EMAIL →</div>
              </a>);
            })}
            {!isNI&&<div style={{fontFamily:F.m,fontSize:9,color:"#666",padding:"4px 12px"}}>
              Verify at <a href="https://www.oireachtas.ie/en/members/tds/" target="_blank" rel="noopener" style={{color:X.c}}>oireachtas.ie</a> · Email format: firstname.surname@oireachtas.ie
            </div>}
            {isNI&&<div style={{fontFamily:F.m,fontSize:9,color:"#666",padding:"4px 12px"}}>
              Verify at <a href="https://www.niassembly.gov.uk/your-mlas/" target="_blank" rel="noopener" style={{color:X.c}}>niassembly.gov.uk</a>
            </div>}
          </div>)}
          {isOpen&&!reps&&(<div style={{padding:"8px 12px",fontFamily:F.b,fontSize:13,color:X.t}}>
            <a href={isNI?"https://www.niassembly.gov.uk/your-mlas/locate-your-mla2/":"https://www.oireachtas.ie/en/members/tds/"} target="_blank" rel="noopener"
              style={{color:X.c,textDecoration:"underline"}}>Find your representatives here →</a>
          </div>)}
        </div>);
      })}
    </div>
  </div>);
}

function Counter(){const[c,setC]=useState(0);useEffect(()=>{let n=0;const t=setInterval(()=>{n+=4;if(n>=247){setC(247);clearInterval(t)}else setC(Math.floor(n))},40);return()=>clearInterval(t)},[]);return(
  <div style={{textAlign:"center",padding:"40px 20px 28px"}}>
    <div style={{fontFamily:F.m,fontSize:12,letterSpacing:"0.25em",color:X.l,marginBottom:12}}>KILLED ON THE ISLAND OF IRELAND · 2025</div>
    <div style={{fontFamily:F.h,fontSize:120,lineHeight:0.85,color:X.r}}>{c}</div>
    <div style={{fontFamily:F.h,fontSize:26,color:"#fff",letterSpacing:"0.08em",marginTop:8}}>PEOPLE</div>
    <div style={{display:"flex",justifyContent:"center",gap:28,marginTop:18}}>
      <div style={{textAlign:"center"}}><div style={{fontFamily:F.h,fontSize:36,color:X.r}}>190</div><div style={{fontFamily:F.m,fontSize:11,color:X.t}}>REPUBLIC · GARDAÍ</div></div>
      <div style={{width:1,background:"#444"}}/>
      <div style={{textAlign:"center"}}><div style={{fontFamily:F.h,fontSize:36,color:X.o}}>57</div><div style={{fontFamily:F.m,fontSize:11,color:X.t}}>NORTHERN IRELAND · PSNI</div></div>
    </div>
    <div style={{fontFamily:F.b,fontSize:15,color:X.t,marginTop:16,lineHeight:1.7,maxWidth:520,margin:"16px auto 0"}}>One person killed every 35 hours. Ten killed this week alone.<br/>Roads don't recognise the border. Neither should the response.</div>
  </div>
)}

function ActPage(){const[cp,setCp]=useState(null);
  const sec={background:X.bg,border:`1px solid ${X.br}`,borderRadius:6,padding:"24px 28px",marginBottom:16};
  const lnk={color:X.c,textDecoration:"underline",textUnderlineOffset:3};
  const txt={fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.7};
  function copy(t,id){navigator.clipboard.writeText(t).then(()=>{setCp(id);setTimeout(()=>setCp(null),2000)})}
  return(<div style={{maxWidth:720,margin:"0 auto"}}>
    <div style={{textAlign:"center",marginBottom:28}}>
      <div style={{fontFamily:F.h,fontSize:44,color:"#fff"}}>HOW TO MAKE A DIFFERENCE</div>
      <div style={{...txt,fontSize:15,marginTop:8}}>Politicians respond to pressure. Use the map to find your county, click your constituency, and email your representatives directly.</div>
    </div>
    <div style={sec}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:4,height:28,background:X.r,borderRadius:2}}/><div style={{fontFamily:F.h,fontSize:28,color:"#fff"}}>IF YOU LIVE IN THE REPUBLIC</div></div>
      <div style={txt}>Your representatives are <strong style={{color:"#fff"}}>TDs (Teachtaí Dála)</strong>. Use the <strong style={{color:X.c}}>WHERE tab</strong> above — click your county, then your constituency, then click any TD name to open an email with the template pre-filled.</div>
      <div style={{...txt,marginTop:12}}>Alternatively: <a href="https://www.oireachtas.ie/en/members/tds/" target="_blank" rel="noopener" style={lnk}>oireachtas.ie/en/members/tds</a> or <a href="https://www.contactyourtd.ie/" target="_blank" rel="noopener" style={lnk}>contactyourtd.ie</a></div>
      <div style={{...txt,marginTop:12}}>Email format: <strong style={{color:"#fff"}}>firstname.surname@oireachtas.ie</strong>. Email each TD individually — mass emails get flagged as spam.</div>
      <div style={{...txt,marginTop:12}}>Key person: <strong style={{color:"#fff"}}>Minister of State for Road Safety — Seán Canney TD</strong></div>
    </div>
    <div style={sec}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:4,height:28,background:X.o,borderRadius:2}}/><div style={{fontFamily:F.h,fontSize:28,color:"#fff"}}>IF YOU LIVE IN NORTHERN IRELAND</div></div>
      <div style={txt}>Your representatives are <strong style={{color:"#fff"}}>MLAs (Members of the Legislative Assembly)</strong>. You have 5 MLAs per constituency. Use the <strong style={{color:X.c}}>WHERE tab</strong> — click your county, then constituency, then click any MLA to email them.</div>
      <div style={{...txt,marginTop:12}}>Alternatively: <a href="https://www.niassembly.gov.uk/your-mlas/locate-your-mla2/" target="_blank" rel="noopener" style={lnk}>niassembly.gov.uk/your-mlas</a></div>
      <div style={{...txt,marginTop:12}}>Key person: <strong style={{color:"#fff"}}>Minister for Infrastructure — Liz Kimmins MLA</strong></div>
    </div>
    <div style={sec}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:4,height:28,background:X.g,borderRadius:2}}/><div style={{fontFamily:F.h,fontSize:28,color:"#fff"}}>EMAIL TEMPLATE</div></div>
      <div style={txt}>This template is pre-filled when you click a TD/MLA name on the map. You can also copy it:</div>
      <div style={{background:"#0a0a0a",border:"1px solid #333",borderRadius:4,padding:"16px 20px",marginTop:12,fontFamily:F.b,fontSize:13,color:"#ddd",lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:200,overflowY:"auto"}}>{EMAIL_BODY}</div>
      <button onClick={()=>copy(EMAIL_BODY,"tpl")} style={{marginTop:8,background:X.c,color:"#000",border:"none",padding:"8px 16px",borderRadius:4,cursor:"pointer",fontFamily:F.h,fontSize:14}}>{cp==="tpl"?"COPIED ✓":"COPY TEMPLATE"}</button>
    </div>
    <div style={sec}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:4,height:28,background:X.c,borderRadius:2}}/><div style={{fontFamily:F.h,fontSize:28,color:"#fff"}}>OTHER WAYS TO ACT</div></div>
      {[{t:"SHARE THIS SITE",d:"Send stoproaddeaths.ie to friends and on social media. Use #NotAStatistic."},{t:"REGISTER TO VOTE",d:"checktheregister.ie (ROI) or eoni.org.uk (NI). Politicians check if you're registered."},{t:"ATTEND A CLINIC",d:"Most TDs hold weekly constituency clinics. MLAs have constituency offices. Face-to-face is harder to ignore."},{t:"THEY WORK FOR YOU",d:"If they don't act on road safety — remember that at the next election."}].map((item,i)=>(
        <div key={i} style={{padding:"12px 16px",background:"#0a0a0a",border:"1px solid #222",borderRadius:4,marginBottom:6}}>
          <div style={{fontFamily:F.h,fontSize:16,color:X.c,marginBottom:2}}>{item.t}</div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.5}}>{item.d}</div>
        </div>))}
    </div>
  </div>);
}

export default function App(){
  const[sel,setSel]=useState(null);const[tab,setTab]=useState("map");const[filt,setFilt]=useState("all");const[pledged,setPledged]=useState(false);
  const filtered=Object.entries(COUNTIES).filter(([_,d])=>filt==="all"||d.j===filt);
  const ranking=filtered.map(([n,d])=>({name:n,...d,pc:(d.d/d.pop)*1e5})).sort((a,b)=>b.pc-a.pc);
  const tabs=[{id:"map",l:"WHERE"},{id:"when",l:"WHEN"},{id:"trend",l:"TREND"},{id:"who",l:"WHO"},{id:"latest",l:"THIS WEEK"},{id:"tracker",l:"TD TRACKER"},{id:"act",l:"TAKE ACTION"}];
  return(<div style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:F.b}}>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
    <style>{`
      .map-grid{display:grid;grid-template-columns:1fr 380px;gap:18px;min-height:520px}
      .map-sidebar{display:flex;flex-direction:column;gap:10px;overflow-y:auto;max-height:600px}
      .tracker-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px}
      @media(max-width:800px){
        .map-grid{grid-template-columns:1fr;min-height:auto}
        .map-sidebar{max-height:none}
        .tracker-stats{grid-template-columns:1fr 1fr}
      }
    `}</style>
    <div style={{borderBottom:"1px solid #282828",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:X.r,boxShadow:`0 0 8px ${X.r}`}}/><span style={{fontFamily:F.h,fontSize:20,letterSpacing:"0.1em"}}>#NotAStatistic</span></div>
      <div style={{fontFamily:F.m,fontSize:10,color:"#999"}}>ALL-ISLAND · RSA + PSNI · FEB 2026</div>
    </div>
    <Counter/>
    <div style={{height:2,background:`linear-gradient(90deg,transparent,${X.r},transparent)`,margin:"0 40px"}}/>
    {/* Pledge banner */}
    <div style={{margin:"14px 20px 0",padding:"12px 20px",background:pledged?"#0a2a1a":"#1a1a1a",border:`1px solid ${pledged?X.c:"#333"}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,maxWidth:700,marginLeft:"auto",marginRight:"auto"}}>
      {pledged?(<>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>✓</span>
          <div><div style={{fontFamily:F.h,fontSize:18,color:X.c}}>YOU'VE TAKEN ACTION</div>
          <div style={{fontFamily:F.b,fontSize:12,color:X.t}}>{ACTION_COUNT>0?`Join ${ACTION_COUNT}+ people who've emailed their TDs`:"Now tell others — public pressure works"}</div></div>
        </div>
        <a href="https://twitter.com/intent/tweet?text=I%20just%20emailed%20my%20TD%20about%20Ireland%27s%20road%20safety%20crisis.%20247%20killed%20in%202025.%20Have%20you%3F%20%E2%86%92%20stoproaddeaths.ie%20%23NotAStatistic" target="_blank" rel="noopener" style={{background:X.c,color:"#000",padding:"8px 16px",borderRadius:4,fontFamily:F.h,fontSize:14,textDecoration:"none",whiteSpace:"nowrap"}}>SHARE ON X →</a>
      </>):(<>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>✉</span>
          <div><div style={{fontFamily:F.h,fontSize:18,color:"#fff"}}>HAVE YOU EMAILED YOUR TD OR MLA?</div>
          <div style={{fontFamily:F.b,fontSize:12,color:X.t}}>{ACTION_COUNT>0?`${ACTION_COUNT}+ people already have. `:""}Click a county below → pick your constituency → click a name</div></div>
        </div>
        <button onClick={()=>setPledged(true)} style={{background:X.r,color:"#fff",border:"none",padding:"8px 16px",borderRadius:4,fontFamily:F.h,fontSize:14,cursor:"pointer",whiteSpace:"nowrap"}}>I'VE EMAILED THEM ✓</button>
      </>)}
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:4,padding:"18px 12px 0",flexWrap:"wrap"}}>
      {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{
        background:tab===t.id?(t.id==="act"||t.id==="tracker"?X.c:X.r):X.bg,border:`1px solid ${tab===t.id?(t.id==="act"||t.id==="tracker"?X.c:X.r):X.br}`,
        color:tab===t.id?(t.id==="act"||t.id==="tracker"?"#000":"#fff"):"#aaa",padding:"9px 16px",borderRadius:4,cursor:"pointer",
        fontFamily:F.m,fontSize:11,letterSpacing:"0.12em",fontWeight:tab===t.id?600:400}}>{t.l}</button>))}
    </div>
    <div style={{maxWidth:1100,margin:"0 auto",padding:"20px"}}>
      {tab==="map"&&(<>
        <div style={{display:"flex",gap:4,marginBottom:14,justifyContent:"center"}}>
          {[{id:"all",l:"ALL ISLAND"},{id:"ROI",l:"REPUBLIC"},{id:"NI",l:"NI"}].map(f=>(<button key={f.id} onClick={()=>{setFilt(f.id);setSel(null)}} style={{
            background:filt===f.id?"#222":"transparent",border:`1px solid ${filt===f.id?"#555":X.br}`,
            color:filt===f.id?"#fff":"#aaa",padding:"6px 14px",borderRadius:3,cursor:"pointer",fontFamily:F.m,fontSize:10}}>{f.l}</button>))}
        </div>
        <div className="map-grid">
          <div style={{background:"#0d0d0d",border:"1px solid #222",borderRadius:4,padding:"12px"}}>
            <div style={{fontFamily:F.m,fontSize:10,color:"#999",marginBottom:6}}>CLICK COUNTY → CONSTITUENCY → TD/MLA NAME → EMAIL OPENS</div>
            <CMap sel={sel} onSel={setSel} filt={filt}/>
          </div>
          <div className="map-sidebar">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <Stat label="ALL ISLAND" value="247" sub="2025 total"/><Stat label="REPUBLIC" value="190" sub="Garda total"/>
              <Stat label="NORTH" value="57" sub="PSNI total" accent={X.o}/><Stat label="VULNERABLE" value="88+" sub="Peds, cyclists, bikes" accent={X.g}/>
            </div>
            {sel?(<>
              <RepPanel name={sel}/>
              <button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:"#999",cursor:"pointer",fontFamily:F.m,fontSize:10,padding:4}}>← BACK TO RANKING</button>
            </>):(
            <div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"14px 18px",flex:1,overflowY:"auto"}}>
              <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginBottom:10}}>DEADLIEST PER CAPITA · CLICK TO TAKE ACTION</div>
              {ranking.slice(0,14).map((c,i)=>(<div key={c.name} onClick={()=>setSel(c.name)} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${X.br}`,cursor:"pointer"}}>
                <span style={{fontFamily:F.m,fontSize:10,color:"#888",width:16}}>{i+1}</span>
                <span style={{fontFamily:F.b,fontSize:13,color:"#ddd",flex:1}}>{c.name} {c.j==="NI"&&<span style={{fontSize:10,color:X.o}}>NI</span>}</span>
                <span style={{fontFamily:F.h,fontSize:17,color:X.r,width:24,textAlign:"right"}}>{c.d}</span>
                <span style={{fontFamily:F.m,fontSize:10,color:X.g,width:52,textAlign:"right"}}>{c.pc.toFixed(1)}/100k</span>
              </div>))}
            </div>)}
          </div>
        </div></>)}
      {tab==="when"&&(<div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"22px 26px",marginBottom:16}}>
          <div style={{fontFamily:F.m,fontSize:11,letterSpacing:"0.18em",color:X.l,marginBottom:8}}>DEATHS BY MONTH · ROI · 2025</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:120}}>{MO.map((m,i)=>{const h=(m.d/24)*100;const t=m.d/24;return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{fontFamily:F.m,fontSize:10,color:X.t}}>{m.d}</span>
            <div style={{width:"100%",height:h,background:`rgb(${Math.round(80+t*175)},${Math.round(26-t*10)},${Math.round(26-t*10)})`,borderRadius:2,minHeight:4}}/>
            <span style={{fontFamily:F.m,fontSize:9,color:"#999"}}>{m.m}</span></div>)})}</div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.7,marginTop:14}}>November and December were the deadliest — 21 and 24 killed. Over half of fatal collisions happened on weekends. 54% on roads with speed limits of 80km/h+.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Stat label="DEADLIEST" value="DEC" sub="24 killed"/><Stat label="WEEKENDS" value="55%" sub="Fri–Sun" accent={X.g}/><Stat label="HIGH SPEED" value="54%" sub="80km/h+" accent={X.o}/></div>
      </div>)}
      {tab==="trend"&&(<div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"22px 26px",marginBottom:16}}>
          <div style={{fontFamily:F.m,fontSize:11,letterSpacing:"0.18em",color:X.l,marginBottom:8}}>ALL-ISLAND DEATHS · 2019–2025</div>
          {(()=>{
            const mx=270,chartH=160,chartW=560,barW=50,gap=20,padL=40,padB=25,padT=20;
            const totalW=YR.length*(barW+gap)-gap;
            const startX=padL+(chartW-padL-totalW)/2;
            const yScale=(v)=>padT+(chartH-padT-padB)*(1-v/mx);
            // Government 2030 target for ROI = 72, scaled all-island ~120
            const vz=120;
            // EU average: road deaths fell ~3%/year. Applied to Ireland's 2019 baseline of 196:
            const eu=[196,190,184,179,174,169,164];
            return(<svg viewBox={`0 0 ${chartW} ${chartH+10}`} style={{width:"100%"}}>
              {/* Government 2030 target line (flat) */}
              <line x1={padL-5} y1={yScale(vz)} x2={chartW-10} y2={yScale(vz)} stroke={X.c} strokeWidth="1" strokeDasharray="6 3" opacity="0.5"/>
              <text x={padL-8} y={yScale(vz)-4} fill={X.c} fontSize="8" fontFamily={F.m} textAnchor="end">2030</text>
              <text x={padL-8} y={yScale(vz)+8} fill={X.c} fontSize="8" fontFamily={F.m} textAnchor="end">~120</text>
              {/* EU average decline line + dots */}
              {eu.map((v,i)=>{
                if(i===0)return null;
                const x1=startX+((i-1)*(barW+gap))+barW/2;
                const x2=startX+(i*(barW+gap))+barW/2;
                return <line key={`eu${i}`} x1={x1} y1={yScale(eu[i-1])} x2={x2} y2={yScale(v)} stroke={X.g} strokeWidth="2" strokeDasharray="6 4"/>;
              })}
              {eu.map((v,i)=>{
                const cx=startX+(i*(barW+gap))+barW/2;
                return <circle key={`eud${i}`} cx={cx} cy={yScale(v)} r="3" fill={X.g}/>;
              })}
              <text x={startX+6*(barW+gap)+barW/2+8} y={yScale(eu[6])+1} fill={X.g} fontSize="9" fontFamily={F.m} dominantBaseline="middle">←164</text>
              <text x={startX+6*(barW+gap)+barW/2+8} y={yScale(eu[6])+11} fill={X.g} fontSize="7" fontFamily={F.m} opacity="0.7">EU AVERAGE</text>
              {/* Bars */}
              {YR.map((y,i)=>{
                const x=startX+i*(barW+gap);
                const hR=(y.r/mx)*(chartH-padT-padB);
                const hN=(y.n/mx)*(chartH-padT-padB);
                const last=i===6;
                const baseY=chartH-padB;
                return(<g key={i}>
                  <rect x={x} y={baseY-hR} width={barW} height={hR} fill={last?X.r:"#cc2222"} rx="1"/>
                  <rect x={x} y={baseY-hR-hN-1} width={barW} height={hN} fill={last?X.o:"#cc6622"} rx="1"/>
                  <text x={x+barW/2} y={baseY-hR-hN-6} textAnchor="middle" fill={last?X.r:"#ccc"} fontSize="10" fontFamily={F.m} fontWeight={last?"600":"400"}>{y.t}</text>
                  <text x={x+barW/2} y={baseY+14} textAnchor="middle" fill={last?X.r:"#999"} fontSize="9" fontFamily={F.m}>{y.y}</text>
                </g>);
              })}
            </svg>);
          })()}
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:4,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,background:X.r,borderRadius:2}}/><span style={{fontFamily:F.m,fontSize:10,color:"#bbb"}}>REPUBLIC</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,background:X.o,borderRadius:2}}/><span style={{fontFamily:F.m,fontSize:10,color:"#bbb"}}>NI</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:20,height:0,borderTop:`2px dashed ${X.g}`}}/><span style={{fontFamily:F.m,fontSize:10,color:X.g}}>EU AVERAGE</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:20,height:0,borderTop:`2px dashed ${X.c}`}}/><span style={{fontFamily:F.m,fontSize:10,color:X.c}}>GOVT 2030 TARGET</span></div>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.7,marginTop:14}}>The yellow line shows where Ireland would be if it had matched the EU average decline in road deaths (~3% per year). By 2025, that would mean 164 deaths — not 247. That gap is <strong style={{color:X.r}}>83 extra people killed</strong> because Ireland went backwards while the rest of Europe improved. The teal line is the government's own 2030 target (~120 all-island). Ireland is more than double it.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Stat label="VS GOVT TARGET" value="+127" sub="Above ~120 target" accent={X.c}/><Stat label="ACTUAL" value="247" sub="All-island 2025"/><Stat label="VS EU AVERAGE" value="+83" sub="Extra deaths" accent={X.g}/></div>
      </div>)}
      {tab==="who"&&(<div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"22px 26px",marginBottom:16}}>
          <div style={{fontFamily:F.m,fontSize:11,letterSpacing:"0.18em",color:X.l,marginBottom:8}}>WHO IS DYING · ROI 2025</div>
          {[{l:"DRIVERS",v:76,c:X.r,p:"41%"},{l:"PEDESTRIANS",v:41,c:X.o,p:"22%"},{l:"MOTORCYCLISTS",v:30,c:X.g,p:"16%"},{l:"PASSENGERS",v:21,c:"#e0e0e0",p:"11%"},{l:"CYCLISTS",v:14,c:X.c,p:"8%"},{l:"E-SCOOTERS",v:3,c:"#a0a0a0",p:"2%"}].map((d,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                <span style={{fontFamily:F.m,fontSize:11,color:X.t}}>{d.l}</span>
                <div style={{display:"flex",gap:10,alignItems:"baseline"}}><span style={{fontFamily:F.m,fontSize:10,color:"#999"}}>{d.p}</span><span style={{fontFamily:F.h,fontSize:26,color:d.c}}>{d.v}</span></div>
              </div>
              <div style={{height:5,background:"#1a1a1a",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(d.v/76)*100}%`,background:d.c,borderRadius:2}}/></div>
            </div>))}
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.7,marginTop:16}}>Nearly half were vulnerable road users. Cyclist deaths highest since 2017. Motorcyclist deaths highest since 2007. In NI, 16 of 57 were pedestrians — 9 over 65.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Stat label="AGED 16–25" value="38" sub="21% of ROI deaths" accent={X.g}/><Stat label="MALE" value="~75%" sub="All island"/><Stat label="NI PEDS" value="16" sub="9 aged 65+" accent={X.o}/></div>
      </div>)}
      {tab==="latest"&&(<div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{background:"#ff1a1a10",border:"1px solid #ff1a1a30",borderRadius:4,padding:"20px 24px",marginBottom:16,textAlign:"center"}}>
          <div style={{fontFamily:F.h,fontSize:56,color:X.r}}>10</div>
          <div style={{fontFamily:F.h,fontSize:20,color:"#fff"}}>KILLED ACROSS THE ISLAND · ONE WEEK</div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,marginTop:8}}>22–25 Feb 2026. Seven killed last weekend. Three more by Tuesday.<br/>Two teenagers. Three parents. A motorcyclist. At least 11 children left without a parent.</div>
        </div>
        {INCIDENTS.map((inc,i)=>(<div key={i} style={{padding:"14px 16px",background:X.bg,border:`1px solid ${X.br}`,borderLeft:`3px solid ${inc.type==="pedestrian"?X.o:X.r}`,borderRadius:3,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontFamily:F.m,fontSize:10,color:"#bbb"}}>{inc.date} 2026</span>
            <span style={{fontFamily:F.m,fontSize:10,color:inc.type==="pedestrian"?X.o:"#aaa",textTransform:"uppercase"}}>{inc.type}</span></div>
          <div style={{fontFamily:F.b,fontSize:14,color:"#eee"}}>{inc.loc}</div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#bbb",marginTop:4}}>{inc.desc}</div>
        </div>))}
        <div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"16px 20px",marginTop:8}}>
          <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginBottom:4}}>2026 YEAR TO DATE · REPUBLIC</div>
          <span style={{fontFamily:F.h,fontSize:34,color:X.r}}>25+</span>
          <span style={{fontFamily:F.b,fontSize:13,color:X.t,marginLeft:10}}>dead in 8 weeks. At this rate, 2026 will exceed 2025.</span>
        </div>
      </div>)}
      {tab==="tracker"&&(()=>{
        // Build full list from TDS + MLAS, merge with TRACKER responses
        const allReps=[];
        Object.entries(TDS).forEach(([con,reps])=>reps.forEach(r=>allReps.push({...r,con,j:"ROI",type:"TD"})));
        Object.entries(MLAS).forEach(([con,reps])=>reps.forEach(r=>allReps.push({...r,con,j:"NI",type:"MLA"})));
        // Merge tracker data
        const tracked=new Map(TRACKER.map(t=>[t.n,t]));
        const merged=allReps.map(r=>{const t=tracked.get(r.n);return{...r,status:t?t.status:"none",responded:t?t.responded:null,summary:t?t.summary:null}});
        const meaningful=merged.filter(r=>r.status==="meaningful");
        const generic=merged.filter(r=>r.status==="generic");
        const noResponse=merged.filter(r=>r.status==="none");
        const daysSince=CAMPAIGN_SENT_DATE?Math.floor((Date.now()-new Date(CAMPAIGN_SENT_DATE).getTime())/86400000):null;
        const totalContacted=TRACKER.length>0?allReps.length:0;
        const totalResponded=meaningful.length+generic.length;
        const responseRate=totalContacted>0?((totalResponded/totalContacted)*100).toFixed(0):"0";
        const repCard=(r,i)=>(<div key={`${r.n}-${r.con}-${i}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0a0a0a",border:"1px solid #222",borderRadius:3,marginBottom:4}}>
          <div>
            <div style={{fontFamily:F.b,fontSize:13,color:"#fff"}}>{r.n}</div>
            <div style={{fontFamily:F.m,fontSize:10,color:X.l}}>{r.p} · {r.con} · {r.type}</div>
            {r.summary&&<div style={{fontFamily:F.b,fontSize:11,color:X.t,marginTop:2,fontStyle:"italic"}}>"{r.summary}"</div>}
          </div>
          <div style={{textAlign:"right"}}>
            {r.responded&&<div style={{fontFamily:F.m,fontSize:9,color:"#888"}}>{r.responded}</div>}
          </div>
        </div>);
        return(<div style={{maxWidth:800,margin:"0 auto"}}>
          {/* Hero stats */}
          {TRACKER.length>0?(<>
            <div className="tracker-stats">
              <Stat label="CONTACTED" value={String(totalContacted)} sub={`TDs + MLAs`} accent={X.c}/>
              <Stat label="RESPONDED" value={String(totalResponded)} sub={`${responseRate}% rate`} accent={meaningful.length>0?X.c:"#888"}/>
              <Stat label="MEANINGFUL" value={String(meaningful.length)} sub="Real commitments" accent={X.g}/>
              <Stat label="SILENT" value={String(noResponse.length)} sub={daysSince?`${daysSince} days`:""} accent={X.r}/>
            </div>
            {/* Meaningful responses */}
            {meaningful.length>0&&<div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"14px 18px",marginBottom:12,borderLeft:`3px solid ${X.c}`}}>
              <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:X.c,marginBottom:10}}>MEANINGFUL RESPONSES — {meaningful.length}</div>
              {meaningful.map((r,i)=>repCard(r,i))}
            </div>}
            {/* Generic responses */}
            {generic.length>0&&<div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"14px 18px",marginBottom:12,borderLeft:`3px solid ${X.g}`}}>
              <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:X.g,marginBottom:10}}>GENERIC / VAGUE — {generic.length}</div>
              {generic.map((r,i)=>repCard(r,i))}
            </div>}
            {/* No response */}
            <div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"14px 18px",marginBottom:12,borderLeft:`3px solid ${X.r}`}}>
              <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:X.r,marginBottom:10}}>NO RESPONSE — {noResponse.length} {daysSince?`(${daysSince} DAYS AND COUNTING)`:""}</div>
              <div style={{fontFamily:F.b,fontSize:12,color:X.t,marginBottom:10}}>These TDs and MLAs have not responded to questions about road safety.</div>
              <div style={{maxHeight:400,overflowY:"auto"}}>
                {noResponse.map((r,i)=>(<div key={`nr-${i}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 12px",borderBottom:`1px solid ${X.br}`}}>
                  <div>
                    <span style={{fontFamily:F.b,fontSize:12,color:"#ddd"}}>{r.n}</span>
                    <span style={{fontFamily:F.m,fontSize:10,color:X.l,marginLeft:8}}>{r.p} · {r.con}</span>
                  </div>
                  <span style={{fontFamily:F.h,fontSize:14,color:X.r}}>NO REPLY</span>
                </div>))}
              </div>
            </div>
          </>):(<>
            {/* Pre-launch state */}
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontFamily:F.h,fontSize:44,color:"#fff",marginBottom:8}}>TD & MLA ACCOUNTABILITY TRACKER</div>
              <div style={{fontFamily:F.b,fontSize:15,color:X.t,lineHeight:1.6,maxWidth:560,margin:"0 auto",marginBottom:24}}>
                We will write to all 174 TDs and 90 MLAs asking four questions about road safety. Every response — or silence — will be published here.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,maxWidth:500,margin:"0 auto",marginBottom:24}}>
                <Stat label="TDs" value="174" sub="Republic" accent={X.r}/>
                <Stat label="MLAs" value="90" sub="Northern Ireland" accent={X.o}/>
                <Stat label="TOTAL" value="264" sub="To be contacted" accent={X.c}/>
              </div>
              <div style={{background:"#0a0a0a",border:`1px solid ${X.br}`,borderRadius:6,padding:"20px 24px",maxWidth:560,margin:"0 auto",textAlign:"left"}}>
                <div style={{fontFamily:F.h,fontSize:22,color:X.g,marginBottom:8}}>WHAT WE'LL ASK</div>
                <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.7}}>
                  1. What specific actions will you take to reduce road deaths?<br/>
                  2. Will you support mandatory lower speed limits?<br/>
                  3. Will you push for protected cycling and pedestrian infrastructure?<br/>
                  4. Will you raise this in the Dáil/Assembly through formal questions?
                </div>
                <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginTop:12}}>14 DAYS TO RESPOND. THEN WE PUBLISH.</div>
              </div>
              {ACTION_COUNT>0&&<div style={{fontFamily:F.b,fontSize:14,color:X.c,marginTop:20}}>{ACTION_COUNT}+ people have already emailed their TDs through this site.</div>}
              <button onClick={()=>setTab("map")} style={{marginTop:16,background:X.r,color:"#fff",border:"none",padding:"12px 24px",borderRadius:4,fontFamily:F.h,fontSize:16,cursor:"pointer"}}>EMAIL YOUR TD NOW →</button>
            </div>
          </>)}
        </div>);
      })()}
      {tab==="act"&&<ActPage/>}
    </div>
    <div style={{background:X.r,padding:"26px 20px",textAlign:"center",marginTop:28}}>
      <div style={{fontFamily:F.h,fontSize:30,color:"#fff"}}>EVERY CIRCLE IS A COMMUNITY IN MOURNING. DEMAND YOUR TD AND MLA ACT NOW.</div>
      <div style={{fontFamily:F.b,fontSize:14,color:"#ffffffdd",marginTop:8,maxWidth:580,margin:"8px auto 0",lineHeight:1.5}}>Mandatory lower speed limits. Protected infrastructure. Enforce existing laws. All-island coordination. Meet the targets or resign.</div>
      <div style={{fontFamily:F.m,fontSize:11,color:"#ffffffaa",marginTop:12,display:"flex",justifyContent:"center",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <span>#NotAStatistic</span>
        <span>·</span>
        <a href="https://twitter.com/intent/tweet?text=247%20people%20killed%20on%20Irish%20roads%20in%202025.%20190%20in%20the%20Republic.%2057%20in%20NI.%20One%20every%2035%20hours.%20Find%20your%20TD%20or%20MLA%20and%20demand%20action%20%E2%86%92%20stoproaddeaths.ie%20%23NotAStatistic" target="_blank" rel="noopener" style={{color:"#fff",textDecoration:"underline",fontWeight:600}}>SHARE ON X</a>
        <span>·</span>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://stoproaddeaths.ie" target="_blank" rel="noopener" style={{color:"#fff",textDecoration:"underline",fontWeight:600}}>FACEBOOK</a>
        <span>·</span>
        <a href="#" onClick={(e)=>{e.preventDefault();setTab("act");window.scrollTo(0,0)}} style={{color:"#fff",textDecoration:"underline",fontWeight:600}}>TAKE ACTION NOW</a>
      </div>
    </div>
    <div style={{padding:"16px 20px",borderTop:"1px solid #282828",textAlign:"center"}}>
      <div style={{fontFamily:F.m,fontSize:10,color:"#888",lineHeight:1.8}}>DATA: AN GARDA SÍOCHÁNA (190 TOTAL) · RSA PROVISIONAL REVIEW 2025 (185 PUBLIC ROADS) · PSNI · EC/ETSC<br/>SITE USES GARDA TOTAL (190) WHICH INCLUDES CAR PARKS AND NON-PUBLIC ROADS. RSA OFFICIAL FIGURE IS 185.<br/>TD/MLA DATA FROM OIREACHTAS.IE AND NIASSEMBLY.GOV.UK · EMAIL ADDRESSES AUTO-GENERATED — VERIFY BEFORE SENDING<br/>2026 INCIDENTS FROM MEDIA REPORTS. THIS IS A CAMPAIGN TOOL, NOT AN OFFICIAL DATA SOURCE.</div>
      <div style={{fontFamily:F.b,fontSize:12,color:X.t,marginTop:10}}>An independent campaign by concerned citizens. Media enquiries welcome.</div>
      <a href="mailto:campaign@stoproaddeaths.ie" style={{fontFamily:F.m,fontSize:12,color:X.c,textDecoration:"none",marginTop:4,display:"inline-block"}}>campaign@stoproaddeaths.ie</a>
    </div>
  </div>);
}
