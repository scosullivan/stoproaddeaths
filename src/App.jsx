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
  "Carlow–Kilkenny":[{n:"John McGuinness",p:"FF"},{n:"Kathleen Funchion",p:"SF"},{n:"John Paul Phelan",p:"FG"},{n:"Peter Cleere",p:"FF"},{n:"Catherine Callaghan",p:"FG"}],
  "Cavan–Monaghan":[{n:"Matt Carthy",p:"SF"},{n:"Cathy Bennett",p:"SF"},{n:"Niamh Smyth",p:"FF"},{n:"Brendan Smith",p:"FF"},{n:"David Maxwell",p:"FG"}],
  "Clare":[{n:"Timmy Dooley",p:"FF"},{n:"Cathal Crowe",p:"FF"},{n:"Joe Cooney",p:"FG"},{n:"Donna McGettigan",p:"SF"}],
  "Cork East":[{n:"Noel McCarthy",p:"FG"},{n:"Pat Buckley",p:"SF"},{n:"James O'Connor",p:"FF"},{n:"Liam Quaide",p:"SD"}],
  "Cork North-Central":[{n:"Padraig O'Sullivan",p:"FF"},{n:"Thomas Gould",p:"SF"},{n:"Colm Burke",p:"FG"},{n:"Eoghan Kenny",p:"Lab"},{n:"Ken O'Flynn",p:"II"}],
  "Cork North-West":[{n:"Aindrias Moynihan",p:"FF"},{n:"Michael Moynihan",p:"FF"},{n:"John Paul O'Shea",p:"FG"}],
  "Cork South-Central":[{n:"Micheál Martin",p:"FF"},{n:"Séamus McGrath",p:"FF"},{n:"Donnchadh Ó Laoghaire",p:"SF"},{n:"Jerry Buttimer",p:"FG"},{n:"Pádraig Rice",p:"SD"}],
  "Cork South-West":[{n:"Michael Collins",p:"II"},{n:"Holly Cairns",p:"SD"},{n:"Christopher O'Sullivan",p:"FF"}],
  "Donegal":[{n:"Pearse Doherty",p:"SF"},{n:"Pat the Cope Gallagher",p:"FF"},{n:"Charlie McConalogue",p:"FF"},{n:"Pádraig Mac Lochlainn",p:"SF"},{n:"Charles Ward",p:"100%R"}],
  "Dublin Bay North":[{n:"Cian O'Callaghan",p:"SD"},{n:"Naoise Ó Muirí",p:"FG"},{n:"Barry Heneghan",p:"Ind"},{n:"Denise Mitchell",p:"SF"},{n:"Tom Brabazon",p:"FF"}],
  "Dublin Bay South":[{n:"Jim O'Callaghan",p:"FF"},{n:"Eoin Hayes",p:"SD"},{n:"James Geoghegan",p:"FG"},{n:"Ivana Bacik",p:"Lab"}],
  "Dublin Central":[{n:"Mary Lou McDonald",p:"SF"},{n:"Gary Gannon",p:"SD"},{n:"Marie Sherlock",p:"Lab"},{n:"Vacant (by-election May 2026)",p:""}],
  "Dublin Fingal East":[{n:"Darragh O'Brien",p:"FF"},{n:"Ann Graves",p:"SF"},{n:"Duncan Smith",p:"Lab"}],
  "Dublin Fingal West":[{n:"Louise O'Reilly",p:"SF"},{n:"Robert O'Donoghue",p:"Lab"},{n:"Grace Boland",p:"FG"}],
  "Dublin Mid-West":[{n:"Eoin Ó Broin",p:"SF"},{n:"Shane Moynihan",p:"FF"},{n:"Mark Ward",p:"SF"},{n:"Emer Higgins",p:"FG"},{n:"John Lahart",p:"FF"}],
  "Dublin North-West":[{n:"Dessie Ellis",p:"SF"},{n:"Rory Hearne",p:"SD"},{n:"Paul McAuliffe",p:"FF"}],
  "Dublin Rathdown":[{n:"Neale Richmond",p:"FG"},{n:"Shay Brennan",p:"FF"},{n:"Sinéad Gibney",p:"SD"},{n:"Maeve O'Connell",p:"FG"}],
  "Dublin South-Central":[{n:"Catherine Ardagh",p:"FF"},{n:"Bríd Smith",p:"PBP"},{n:"Jen Cummins",p:"SD"},{n:"Aengus Ó Snodaigh",p:"SF"}],
  "Dublin South-West":[{n:"Seán Crowe",p:"SF"},{n:"John Lahart",p:"FF"},{n:"Ciarán Ahern",p:"Lab"},{n:"Colm Brophy",p:"FG"},{n:"Paul Murphy",p:"PBP"}],
  "Dublin West":[{n:"Jack Chambers",p:"FF"},{n:"Paul Donnelly",p:"SF"},{n:"Emer Currie",p:"FG"},{n:"Ruth Coppinger",p:"PBP"},{n:"Roderic O'Gorman",p:"GP"}],
  "Dún Laoghaire":[{n:"Jennifer Carroll MacNeill",p:"FG"},{n:"Cormac Devlin",p:"FF"},{n:"Richard Boyd Barrett",p:"PBP"},{n:"Barry Ward",p:"FG"}],
  "Galway East":[{n:"Seán Canney",p:"Ind"},{n:"Pete Roche",p:"FG"},{n:"Albert Dolan",p:"FF"},{n:"Louis O'Hara",p:"SF"}],
  "Galway West":[{n:"Noel Grealish",p:"Ind"},{n:"John Connolly",p:"FF"},{n:"Mairéad Farrell",p:"SF"},{n:"Hildegarde Naughton",p:"FG"},{n:"Vacant (by-election May 2026)",p:""}],
  "Kerry":[{n:"Pa Daly",p:"SF"},{n:"Michael Healy-Rae",p:"Ind"},{n:"Norma Foley",p:"FF"},{n:"Michael Cahill",p:"FF"},{n:"Danny Healy-Rae",p:"Ind"}],
  "Kildare North":[{n:"James Lawless",p:"FF"},{n:"Aidan Farrelly",p:"SD"},{n:"Réada Cronin",p:"SF"},{n:"Naoise Ó Cearúil",p:"FF"},{n:"Joe Neville",p:"FG"}],
  "Kildare South":[{n:"Seán Ó Fearghaíl",p:"FF"},{n:"Martin Heydon",p:"FG"},{n:"Shónagh Ní Raghallaigh",p:"SF"},{n:"Mark Wall",p:"Lab"}],
  "Laois":[{n:"Brian Stanley",p:"Ind"},{n:"Seán Fleming",p:"FF"},{n:"William Aird",p:"FG"}],
  "Limerick City":[{n:"Willie O'Dea",p:"FF"},{n:"Kieran O'Donnell",p:"FG"},{n:"Maurice Quinlivan",p:"SF"},{n:"Conor Sheehan",p:"Lab"}],
  "Limerick County":[{n:"Niall Collins",p:"FF"},{n:"Patrick O'Donovan",p:"FG"},{n:"Richard O'Donoghue",p:"Ind"}],
  "Longford–Westmeath":[{n:"Peter Burke",p:"FG"},{n:"Kevin 'Boxer' Moran",p:"Ind"},{n:"Robert Troy",p:"FF"},{n:"Sorca Clarke",p:"SF"},{n:"Micheál Carrigy",p:"FG"}],
  "Louth":[{n:"Imelda Munster",p:"SF"},{n:"Erin McGreehan",p:"FF"},{n:"Ruairí Ó Murchú",p:"SF"},{n:"Paula Butterly",p:"FG"},{n:"Gillian Toole",p:"Ind"}],
  "Mayo":[{n:"Dara Calleary",p:"FF"},{n:"Alan Dillon",p:"FG"},{n:"Rose Conway-Walsh",p:"SF"},{n:"Keira Keogh",p:"FG"},{n:"Paul Lawless",p:"Aontú"}],
  "Meath East":[{n:"Thomas Byrne",p:"FF"},{n:"Darren O'Rourke",p:"SF"},{n:"Helen McEntee",p:"FG"},{n:"Gillian Toole",p:"Ind"}],
  "Meath West":[{n:"Peadar Tóibín",p:"Aontú"},{n:"Johnny Guirke",p:"SF"},{n:"Aisling Dempsey",p:"FF"}],
  "Offaly":[{n:"Carol Nolan",p:"Ind"},{n:"Tony McCormack",p:"FF"},{n:"John Clendennen",p:"FG"}],
  "Roscommon–Galway":[{n:"Michael Fitzmaurice",p:"II"},{n:"Claire Kerrane",p:"SF"},{n:"Martin Daly",p:"FF"}],
  "Sligo–Leitrim":[{n:"Martin Kenny",p:"SF"},{n:"Frank Feighan",p:"FG"},{n:"Eamon Scanlon",p:"FF"},{n:"Marian Harkin",p:"Ind"}],
  "Tipperary North":[{n:"Michael Lowry",p:"Ind"},{n:"Alan Kelly",p:"Lab"},{n:"Ryan O'Meara",p:"FF"}],
  "Tipperary South":[{n:"Mattie McGrath",p:"Ind"},{n:"Séamus Healy",p:"Ind"},{n:"Michael Murphy",p:"FG"}],
  "Waterford":[{n:"David Cullinane",p:"SF"},{n:"Mary Butler",p:"FF"},{n:"John Cummins",p:"FG"},{n:"Conor D. McGuinness",p:"SF"}],
  "Wexford":[{n:"James Browne",p:"FF"},{n:"Johnny Mythen",p:"SF"},{n:"George Lawlor",p:"Lab"},{n:"Verona Murphy",p:"Ind"}],
  "Wicklow":[{n:"Simon Harris",p:"FG"},{n:"John Brady",p:"SF"},{n:"Jennifer Whitmore",p:"SD"},{n:"Edward Timmins",p:"FG"}],
  "Wicklow–Wexford":[{n:"Brian Brennan",p:"FG"},{n:"Malcolm Byrne",p:"FF"},{n:"Fionntan Ó Súillebháin",p:"SF"}],
};

// MLAs by constituency (NI Assembly, elected May 2022)
const MLAS = {
  "Belfast North":[{n:"Gerry Kelly",p:"SF"},{n:"Carál Ní Chuilín",p:"SF"},{n:"Phillip Brett",p:"DUP"},{n:"Brian Kingston",p:"DUP"},{n:"Nuala McAllister",p:"All"}],
  "Belfast South":[{n:"Kate Nicholl",p:"All"},{n:"Paula Bradshaw",p:"All"},{n:"Deirdre Hargey",p:"SF"},{n:"Matthew O'Toole",p:"SDLP"},{n:"Edwin Poots",p:"DUP"}],
  "Belfast East":[{n:"Naomi Long",p:"All"},{n:"Peter McReynolds",p:"All"},{n:"Joanne Bunting",p:"DUP"},{n:"David Brooks",p:"DUP"},{n:"Andy Allen",p:"UUP"}],
  "Belfast West":[{n:"Órlaithí Flynn",p:"SF"},{n:"Pat Sheehan",p:"SF"},{n:"Danny Baker",p:"SF"},{n:"Aisling Reilly",p:"SF"},{n:"Gerry Carroll",p:"PBP"}],
  "South Antrim":[{n:"Pam Cameron",p:"DUP"},{n:"Trevor Clarke",p:"DUP"},{n:"Declan Kearney",p:"SF"},{n:"Steve Aiken",p:"UUP"},{n:"John Blair",p:"All"}],
  "East Antrim":[{n:"Stewart Dickson",p:"All"},{n:"Danny Donnelly",p:"All"},{n:"Gordon Lyons",p:"DUP"},{n:"Cheryl Brownlee",p:"DUP"},{n:"John Stewart",p:"UUP"}],
  "North Antrim":[{n:"Timothy Gaston",p:"TUV"},{n:"Philip McGuigan",p:"SF"},{n:"Paul Frew",p:"DUP"},{n:"Sian Mulholland",p:"All"},{n:"Jon Burrows",p:"UUP"}],
  "Lagan Valley":[{n:"Emma Little-Pengelly",p:"DUP"},{n:"Paul Givan",p:"DUP"},{n:"Michelle Guy",p:"All"},{n:"David Honeyford",p:"All"},{n:"Robbie Butler",p:"UUP"}],
  "South Down":[{n:"Sinéad Ennis",p:"SF"},{n:"Cathy Mason",p:"SF"},{n:"Colin McGrath",p:"SDLP"},{n:"Diane Forsythe",p:"DUP"},{n:"Andrew McMurray",p:"All"}],
  "Strangford":[{n:"Michelle McIlveen",p:"DUP"},{n:"Harry Harvey",p:"DUP"},{n:"Kellie Armstrong",p:"All"},{n:"Nick Mathison",p:"All"},{n:"Mike Nesbitt",p:"UUP"}],
  "North Down":[{n:"Andrew Muir",p:"All"},{n:"Connie Egan",p:"All"},{n:"Stephen Dunne",p:"DUP"},{n:"Gordon Dunne",p:"DUP"},{n:"Alan Chambers",p:"UUP"}],
  "Newry & Armagh":[{n:"Conor Murphy",p:"SF"},{n:"Liz Kimmins",p:"SF"},{n:"Cathal Boylan",p:"SF"},{n:"William Irwin",p:"DUP"},{n:"Justin McNulty",p:"SDLP"}],
  "Upper Bann":[{n:"John O'Dowd",p:"SF"},{n:"Jonathan Buckley",p:"DUP"},{n:"Diane Dodds",p:"DUP"},{n:"Doug Beattie",p:"UUP"},{n:"Eóin Tennyson",p:"All"}],
  "Fermanagh & South Tyrone":[{n:"Jemma Dolan",p:"SF"},{n:"Colm Gildernew",p:"SF"},{n:"Áine Murphy",p:"SF"},{n:"Deborah Erskine",p:"DUP"},{n:"Diana Armstrong",p:"UUP"}],
  "West Tyrone":[{n:"Maolíosa McHugh",p:"SF"},{n:"Nicola Brogan",p:"SF"},{n:"Declan McAleer",p:"SF"},{n:"Tom Buchanan",p:"DUP"},{n:"Daniel McCrossan",p:"SDLP"}],
  "Mid Ulster":[{n:"Michelle O'Neill",p:"SF"},{n:"Emma Sheerin",p:"SF"},{n:"Linda Dillon",p:"SF"},{n:"Keith Buchanan",p:"DUP"},{n:"Patsy McGlone",p:"SDLP"}],
  "Foyle":[{n:"Pádraig Delargy",p:"SF"},{n:"Ciara Ferguson",p:"SF"},{n:"Sinéad McLaughlin",p:"SDLP"},{n:"Mark H. Durkan",p:"SDLP"},{n:"Gary Middleton",p:"DUP"}],
  "East Londonderry":[{n:"Caoimhe Archibald",p:"SF"},{n:"Claire Sugden",p:"Ind"},{n:"Maurice Bradley",p:"DUP"},{n:"Alan Robinson",p:"DUP"},{n:"Cara Hunter",p:"SDLP"}],
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
const CAMPAIGN_SENT_DATE = "2026-02-25";
// UPDATE THIS: bump as people report emailing their TDs
const ACTION_COUNT = 0;
// UPDATE THIS: add responses as they come in
// status: "meaningful" | "generic" | "none"
// summary: one-line description of response (or null)
// responded: date string or null
const TRACKER = [
  {n:"Claire Kerrane",p:"SF",con:"Roscommon–Galway",j:"ROI",status:"meaningful",responded:"2026-02-25",summary:"Strong on enforcement collapse — cited 400 fewer Gardaí, Crowe report, published SF policing plan, met local Superintendent."},
  {n:"Seán Canney",p:"Ind",con:"Galway East",j:"ROI",status:"generic",responded:"2026-02-25",summary:"Minister for Road Safety. Listed actions taken: speed limit reductions, tech investment, RSA reform. General overview, no specific commitments."},
  {n:"Ivana Bacik",p:"Lab",con:"Dublin Bay South",j:"ROI",status:"generic",responded:"2026-02-25",summary:"Acknowledged concern, linked to Labour manifesto on cycling and active travel. No specific commitments."},
  {n:"Cathal Crowe",p:"FF",con:"Clare",j:"ROI",status:"generic",responded:"2026-02-25",summary:"Engaged but asked to prioritise Clare constituents. Referred to local TD."},
  {n:"Michael Healy-Rae",p:"Ind",con:"Kerry",j:"ROI",status:"generic",responded:"2026-02-26",summary:"Minister of State (Agriculture). Acknowledged crisis, cited road resurfacing investment. No response to any of the five demands."},
  {n:"Timmy Dooley",p:"FF",con:"Clare",j:"ROI",status:"generic",responded:"2026-02-26",summary:"Minister of State (Agriculture & Environment). Staffer acknowledgment — will pass to Timmy. Asked for address (constituency check)."},
];

// ===== BLACKSPOT REPORTS =====
// UPDATE THIS: add blackspot reports as they come in
// Each entry: {id, lat, lng, county, road, desc, reportedBy (optional), date, source_type: "official"|"community", reports, source}
const BLACKSPOTS = [
  // === TOP 20 TII COLLISION RATE BLACKSPOTS (Gamma/TII analysis, 2015-2017 data) ===
  // Collision rate = injury collisions per 100M vehicle-km. National roads only.
  {id:1, lat:53.4912, lng:-9.8876, county:"Galway", road:"N59, east of Kylemore Lough (Clifden–Leenaun)", desc:"Collision rate 1,131 — the highest of any road in Ireland, more than double the next worst. Narrow, winding single carriageway through Connemara mountains. Blind crests, no hard shoulder, tourist traffic mixing with locals at 100km/h. Eight of the top 20 national blackspots are on this road.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:15, source:"TII collision rates via Gamma Location Intelligence"},
  {id:2, lat:52.5012, lng:-6.5678, county:"Wexford", road:"N11/N30 Enniscorthy — Abbey Square to Seamus Rafter Bridge", desc:"Collision rate 588. Urban stretch with heavy through-traffic on a road not designed for it. Multiple junctions, pedestrian crossings, and turning traffic. Second most dangerous stretch of national road in Ireland.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:12, source:"TII collision rates"},
  {id:3, lat:53.7278, lng:-7.7967, county:"Longford", road:"N63 Longford town — Killashee St/Ballymahon St/New St junction", desc:"Collision rate 281. Complex multi-arm junction in town centre. Conflicting traffic movements, poor sightlines, pedestrians crossing between shops. Third highest collision rate nationally.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:8, source:"TII collision rates"},
  {id:4, lat:53.4534, lng:-10.0123, county:"Galway", road:"N59, 1.3km west of Letterfrack", desc:"Collision rate 259. Winding coastal road near Connemara National Park. Mixing of tourist coaches, cyclists and local traffic on narrow carriageway with no margin for error.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:7, source:"TII collision rates"},
  {id:5, lat:52.9712, lng:-7.8934, county:"Tipperary", road:"N62 southeast of Roscrea, near R445 junction", desc:"Collision rate 251. Major junction on national secondary with poor visibility on approach. High-speed rural road meeting busy regional road. Fifth highest collision rate in the country.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:6, source:"TII collision rates"},
  {id:6, lat:52.8123, lng:-8.9456, county:"Clare", road:"N67, 1.3km north of R484 junction", desc:"Collision rate 235. Coastal road in the Burren with deceptive bends and poor surface. Highest collision rate in Clare. Tourists unfamiliar with road conditions add to the danger.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:5, source:"TII collision rates"},
  // === MOST DANGEROUS ROADS BY FATALITY COUNT ===
  {id:7, lat:52.1534, lng:-7.6234, county:"Waterford", road:"N25 Cork–Rosslare (through Waterford)", desc:"22 people killed on this road between 2017–2022 — the deadliest road in Ireland by fatality count. 185km of mixed single/dual carriageway through three counties. Multiple accident blackspots along the route, particularly at junctions.", reportedBy:"Irish Mirror/RSA data", date:"2022-09-28", source_type:"official", reports:22, source:"RSA fatality data 2017-2022"},
  {id:8, lat:53.9823, lng:-6.8934, county:"Meath", road:"N2 Dublin–Derry (Meath/Monaghan sections)", desc:"16 people killed between 2017–2022 — second deadliest road in Ireland. Long stretches of single carriageway with 100km/h limit. Head-on collisions account for the majority of fatalities. Upgrade long promised but repeatedly delayed.", reportedBy:"RSA data", date:"2022-09-28", source_type:"official", reports:16, source:"RSA fatality data 2017-2022"},
  {id:9, lat:54.5234, lng:-7.9823, county:"Donegal", road:"N15 Sligo–Lifford", desc:"13 people killed between 2017–2022. Winding road through hilly terrain with limited overtaking opportunities. Frustration-driven overtaking into oncoming traffic is a known factor.", reportedBy:"RSA data", date:"2022-09-28", source_type:"official", reports:13, source:"RSA fatality data"},
  {id:10, lat:52.4534, lng:-9.2345, county:"Kerry", road:"N21 Tralee–Limerick (Newcastle West section)", desc:"13 people killed between 2017–2022. Single carriageway national primary with 100km/h limit carrying heavy HGV and commuter traffic. Multiple junction conflicts.", reportedBy:"RSA data", date:"2022-09-28", source_type:"official", reports:13, source:"RSA fatality data"},
  {id:11, lat:52.4123, lng:-7.5678, county:"Waterford", road:"N24 Waterford–Limerick (Clonmel section)", desc:"12 people killed between 2017–2022. Narrow single carriageway through multiple towns. Speed limit transitions poorly signed. Known for head-on collisions on straight sections that invite overtaking.", reportedBy:"RSA data", date:"2022-09-28", source_type:"official", reports:12, source:"RSA fatality data"},
  // === WORST PER COUNTY (from TII data, where not already covered) ===
  {id:12, lat:51.8978, lng:-8.4734, county:"Cork", road:"N22/Washington Street to Merchant's Quay, Cork city", desc:"Collision rate 197. Major urban arterial with heavy traffic mixing with pedestrians and cyclists. One of Cork's busiest routes and the county's worst blackspot on the national road network.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:6, source:"TII collision rates"},
  {id:13, lat:52.9534, lng:-7.4923, county:"Kilkenny", road:"N78 through Castlecomer", desc:"Collision rate 110. National secondary through a town that was never designed for through-traffic. Narrow street, parked cars reducing visibility, pedestrians stepping out. The worst blackspot in Kilkenny.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:4, source:"TII collision rates"},
  {id:14, lat:52.8534, lng:-6.8723, county:"Kildare", road:"N78/Duke Street and Leinster Street junction, Athy", desc:"Collision rate 115. Dangerous urban junction in Athy town centre. Conflicting traffic flows with poor geometry. The worst blackspot on Kildare's national road network.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:5, source:"TII collision rates"},
  {id:15, lat:53.8423, lng:-6.5312, county:"Louth", road:"N2 through Ardee (R170 to N33 junction)", desc:"Collision rate 73. National primary funnelling through a town centre. Heavy traffic, multiple junctions, pedestrian activity, and a road layout that hasn't kept up with traffic volumes.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:4, source:"TII collision rates"},
  // === NORTHERN IRELAND — A5 ===
  {id:16, lat:54.5823, lng:-7.3045, county:"Tyrone", road:"A5 Derry–Aughnacloy (full route)", desc:"Called 'the most dangerous road on the island of Ireland' by elected representatives. Narrow single carriageway carrying cross-border traffic at 60mph. The planned dual carriageway upgrade — which would prevent an estimated 36 fatalities and 442 serious injuries — has been delayed repeatedly since 2007. Communities along the route have lost multiple members.", reportedBy:"Derry & Strabane Council / multiple campaigns", date:"2023-03-10", source_type:"official", reports:20, source:"Derry Journal / DfI statistics"},
  // === NI COLLISION CLUSTERS (from DfI 2025 data) ===
  {id:17, lat:54.5967, lng:-5.9301, county:"Antrim", road:"Belfast city centre — Fisherwick Place/Wellington Street", desc:"20 fatal and serious collisions in a single year in a 1km radius. The highest concentration of serious collisions anywhere in Northern Ireland. Pedestrians, cyclists, buses and cars competing for space in a layout designed for through-traffic, not people.", reportedBy:"PSNI collision data", date:"2019-06-21", source_type:"official", reports:10, source:"PSNI Detailed Trends 2018"},
  {id:18, lat:54.1756, lng:-6.3378, county:"Down", road:"Newry — Buttercrane Quay/Monaghan Street area", desc:"9 fatal and serious collisions in 1km radius — second highest concentration in Northern Ireland. Border town handling heavy cross-border traffic on roads not built for the volume.", reportedBy:"PSNI collision data", date:"2019-06-21", source_type:"official", reports:8, source:"PSNI Detailed Trends 2018"},
  {id:19, lat:54.8312, lng:-7.4534, county:"Derry", road:"Clooney Road roundabout, Waterside", desc:"9 collisions within 50m of this single roundabout in one year. Fourth highest collision point in Northern Ireland. Geometry of the roundabout confuses drivers and creates conflict points.", reportedBy:"PSNI collision data", date:"2019-06-21", source_type:"official", reports:6, source:"PSNI Detailed Trends 2018"},
  {id:20, lat:54.1234, lng:-8.0912, county:"Fermanagh", road:"A4 Enniskillen–Dungannon", desc:"Key cross-border route carrying traffic between Dublin and Donegal via NI. Single carriageway with 60mph limit. Multiple fatal collisions at junctions with poor visibility. Part of DfI's 330 identified collision clusters.", reportedBy:"DfI collision cluster analysis", date:"2025-11-17", source_type:"official", reports:5, source:"DfI/Irish News Nov 2025"},
  // === DATA SUPPRESSION NOTE ===
  {id:21, lat:53.3498, lng:-6.2603, county:"Dublin", road:"M50 Exit 5 (Finglas/N2 interchange)", desc:"Collision rate 51 — highest on Dublin's national road network. Ireland's busiest motorway junction with complex merging movements. Despite being a motorway, the collision rate here exceeds many rural national roads.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:7, source:"TII collision rates"},
  {id:22, lat:54.0534, lng:-6.6912, county:"Armagh", road:"A28 Armagh–Markethill road", desc:"Straight road encourages excessive speed. 60mph limit with no enforcement. Known overtaking zone where dips hide oncoming traffic. Part of DfI's Southern Division collision clusters — 103 clusters identified.", reportedBy:"DfI collision cluster analysis", date:"2025-11-17", source_type:"official", reports:6, source:"DfI Southern Division review"},
  {id:23, lat:53.5167, lng:-7.3456, county:"Westmeath", road:"N52 between Delvin and Mullingar", desc:"Collision rate 77 — worst national road section in Westmeath. Narrow single carriageway with 100km/h limit through rolling countryside. Blind crests and bends make overtaking extremely dangerous.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:3, source:"TII collision rates"},
  {id:24, lat:54.0034, lng:-8.2912, county:"Roscommon", road:"N61/Bridge Street and Shop Street junction, Boyle", desc:"Collision rate 107. Town-centre junction handling national road traffic. Tight geometry, poor visibility, pedestrians at risk. Worst blackspot in Roscommon.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:4, source:"TII collision rates"},
  {id:25, lat:54.2712, lng:-8.4734, county:"Sligo", road:"N4/Duck Street, Sligo town centre", desc:"Collision rate 164. National primary road forced through narrow town-centre street. Pedestrians, turning traffic, and through-traffic in a space designed for horse and cart. Sligo's worst blackspot.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:5, source:"TII collision rates"},
  {id:26, lat:54.0723, lng:-7.1534, county:"Monaghan", road:"N54 through Clones (near NI border)", desc:"Collision rate 97. Border town on national route with cross-border traffic. Road geometry dates from a time when traffic volumes were a fraction of current levels.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:3, source:"TII collision rates"},
  {id:27, lat:54.2912, lng:-7.6234, county:"Cavan", road:"N55, 1.5km south of Ballinagh", desc:"Collision rate 161. Rural national secondary with high collision rate. Narrow road, poor surface, and agricultural traffic mixing with commuters.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:4, source:"TII collision rates"},
  {id:28, lat:54.2823, lng:-8.1534, county:"Leitrim", road:"N16, bridge over Glenfarne River (near R281 junction)", desc:"Collision rate 184. A bridge and junction combination on a national secondary route with a history of serious collisions. Featured in the top 20 nationally.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:5, source:"TII collision rates"},
  {id:29, lat:52.1412, lng:-7.7234, county:"Waterford", road:"N72 north of Tallowbridge (near R634 junction)", desc:"Collision rate 184. Junction on national secondary near the Cork border. Poor sightlines and high approach speeds combine to make this one of the top 20 nationally.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:4, source:"TII collision rates"},
  {id:30, lat:52.1423, lng:-8.2734, county:"Cork", road:"N72 junction with R630, north of Fermoy", desc:"Collision rate 167. Junction on the N72 near Fermoy with a history of collisions. Features in the national top 20. Approach speeds too high for the junction geometry.", reportedBy:"TII/Gamma data", date:"2019-09-25", source_type:"official", reports:4, source:"TII collision rates"},
];

// ===== GOOGLE FORM CONFIG =====
// To connect: create a Google Form with fields for location, description, contact
// Then paste your form ID and field entry IDs here
const GOOGLE_FORM_CONFIG = {
  enabled: false, // Set to true once you've created the form
  formId: "YOUR_GOOGLE_FORM_ID", // e.g. "1FAIpQLSe..."
  fields: {
    lat: "entry.XXXXXXX",
    lng: "entry.XXXXXXX",
    county: "entry.XXXXXXX",
    road: "entry.XXXXXXX",
    description: "entry.XXXXXXX",
    name: "entry.XXXXXXX",
    email: "entry.XXXXXXX",
  }
};

function nearestCounty(lat, lng) {
  let best = null, bestDist = Infinity;
  Object.entries(COUNTIES).forEach(([name, data]) => {
    const d = Math.pow(lat - data.lat, 2) + Math.pow(lng - data.lng, 2);
    if (d < bestDist) { bestDist = d; best = name; }
  });
  return best;
}

function getConstituenciesForCounty(county) {
  const cons = C2C[county] || [];
  const isNI = COUNTIES[county]?.j === "NI";
  return cons.map(con => ({
    name: con,
    reps: isNI ? (MLAS[con] || []) : (TDS[con] || []),
    isNI
  }));
}

const BLACKSPOT_EMAIL_SUBJECT = "Dangerous Road Location in Your Constituency — Action Needed";

function blackspotEmailBody(rep, isNI, road, desc, lat, lng, county) {
  return `Dear ${rep.n},

I am writing to you about a dangerous road location in your constituency that needs urgent engineering intervention.

LOCATION: ${road || "See coordinates below"}
COUNTY: ${county}
GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}
Google Maps: https://www.google.com/maps?q=${lat},${lng}
Street View: https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}

DESCRIPTION OF THE HAZARD:
${desc || "[Please describe the hazard]"}

This location has been reported to stoproaddeaths.ie as a known danger spot. ${isNI
  ? "I am asking you to raise this with the Department for Infrastructure and request that DfI Roads conduct a safety assessment of this location, with a published timeline for any remedial works."
  : "I am asking you to raise this with the Department of Transport and the local authority, and request that a safety assessment be conducted at this location with a published timeline for any remedial works."}

Every community knows where their dangerous roads are. The question is whether anyone in a position of power will act before someone else is killed.

I look forward to your response. Your reply — or your silence — will be noted at stoproaddeaths.ie.

Yours sincerely,
[Your name]
[Your address]`;
}

const F={m:"'JetBrains Mono',monospace",h:"'Bebas Neue',sans-serif",b:"'IBM Plex Sans',sans-serif"};
const X={l:"#aaa",t:"#ccc",d:"#666",bg:"#111",br:"#2a2a2a",r:"#ff1a1a",o:"#ff6b35",g:"#ffd700",c:"#4ecdc4"};

const EMAIL_SUBJECT = "Road Safety Crisis — I Need Your Response";
const DEMANDS = [
  {id:1,short:"Single Accountable Officeholder",detail:"Support the creation of a statutory Road Safety Commissioner (or equivalent) with the authority, budget and legal mandate to deliver the 2030 target — ending the current system where responsibility is diffused across the RSA, Department of Transport, local authorities, An Garda Síochána/PSNI and TII/DfI with no single point of ownership.",ni_note:"In NI, this means a dedicated Road Safety Commissioner within the Department for Infrastructure, with cross-departmental enforcement powers."},
  {id:2,short:"Automated Speed Cameras",detail:"Support the deployment of average-speed (point-to-point) cameras on high-risk routes within 12 months. Ireland remains one of the only developed countries without a functioning automated speed camera network. These are proven, low-cost tools that reduce fatalities.",ni_note:"NI has some average speed cameras but coverage remains limited to a handful of routes."},
  {id:3,short:"Mandatory Black Spot Redesign",detail:"Support a funded national programme — with published timelines — to redesign the 50 highest-risk road sections identified by crash data. No more leaving known death traps unchanged for decades while local authorities lack budgets or oversight.",ni_note:"In NI, this applies to roads managed by DfI Roads and requires ring-fenced capital funding."},
  {id:4,short:"Reverse the Enforcement Collapse",detail:"Support dedicated road policing units and reverse the 43% decline in speeding detections over the past decade. Commit to restoring enforcement to at least 2014 levels within two years.",ni_note:"In NI, this means restoring PSNI roads policing capacity, which has been cut significantly."},
  {id:5,short:"Raise This in Parliament",detail:"Personally table a Parliamentary Question (in the Dáil) or Question for Written Answer (in the Assembly) on road safety governance within 30 days of receiving this letter. We will track and publish whether you do.",ni_note:""},
];

const EMAIL_BODY_ROI = `Dear [TD name],

I am writing to you about the road safety crisis in Ireland. In 2025, 190 people were killed on our roads in the Republic alone — 247 across the island. This is the worst year in over a decade, an 8% increase on 2024, and a 31% increase since 2019.

Ireland is now one of the only EU countries where road deaths are rising. The Government's own target — no more than 72 deaths by 2030 — is 164% above trajectory. This is not a target being narrowly missed. It is a target being abandoned in practice while being maintained in rhetoric.

I am asking you to commit to five specific actions:

1. ACCOUNTABLE OFFICEHOLDER: Will you support the creation of a statutory Road Safety Commissioner with the legal authority, budget and mandate to deliver the 2030 target? Currently, responsibility is diffused across the RSA, Department of Transport, local authorities, An Garda Síochána and TII — with no single person accountable for outcomes.

2. AUTOMATED SPEED CAMERAS: Will you support the deployment of average-speed cameras on high-risk routes within 12 months? Ireland is one of the only developed countries without a functioning network, despite overwhelming evidence that they reduce fatalities.

3. BLACK SPOT REDESIGN: Will you support a funded national programme to redesign the 50 highest-risk road sections — with published timelines? Known death traps sit unchanged for years while communities bury their neighbours.

4. REVERSE THE ENFORCEMENT COLLAPSE: Will you support restoring road policing to at least 2014 levels? Speeding detections have fallen 43% in a decade. Fewer people are being caught because fewer people are being checked.

5. PARLIAMENTARY QUESTION: Will you personally table a Dáil question on road safety governance within 30 days? I will be checking the Oireachtas record.

These are five concrete actions that could save lives. I would welcome a response on each — even if the answer is no, knowing where you stand matters. I am tracking all responses at stoproaddeaths.ie.

Yours sincerely,
[Your name]
[Your address — include if this TD represents your constituency]`;

const EMAIL_BODY_NI = `Dear [MLA name],

I am writing to you about the road safety crisis across the island of Ireland. In 2025, 57 people were killed on Northern Ireland's roads and 247 across the island — the worst year in over a decade.

Northern Ireland shares the same structural problem as the Republic: responsibility for road safety is diffused across the PSNI, the Department for Infrastructure, and local agencies — with no single person accountable for outcomes.

I am asking you to commit to five specific actions:

1. ACCOUNTABLE OFFICEHOLDER: Will you support the creation of a dedicated Road Safety Commissioner within the Department for Infrastructure, with cross-departmental authority and a statutory mandate to deliver casualty reduction targets?

2. AUTOMATED SPEED CAMERAS: Will you support expanding the average-speed camera network to cover the highest-risk routes in Northern Ireland within 12 months?

3. BLACK SPOT REDESIGN: Will you support a funded programme — with published timelines — to redesign the highest-risk road sections managed by DfI Roads?

4. REVERSE THE ENFORCEMENT COLLAPSE: Will you support restoring PSNI roads policing capacity, which has been significantly cut in recent years?

5. ASSEMBLY QUESTION: Will you personally table a Question for Written Answer on road safety governance within 30 days? I will be checking the Assembly record.

These are five concrete actions that could save lives. I would welcome a response on each — even if the answer is no, knowing where you stand matters. I am tracking all responses at stoproaddeaths.ie.

Yours sincerely,
[Your name]
[Your address — include if this MLA represents your constituency]`;

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
              const mailto=`mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(isNI?EMAIL_BODY_NI:EMAIL_BODY_ROI)}`;
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

function ActPage(){const[cp,setCp]=useState(null);const[tpl,setTpl]=useState("roi");
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
      <div style={txt}>The email asks politicians to say <strong style={{color:"#fff"}}>yes or no</strong> to our five structural demands (see the <strong style={{color:X.c}}>DEMANDS</strong> tab). The right version (ROI or NI) is used automatically when you click a name on the map. You can also copy it:</div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <button onClick={()=>setTpl("roi")} style={{background:tpl==="roi"?X.c:"#222",color:tpl==="roi"?"#000":"#999",border:"none",padding:"6px 14px",borderRadius:3,cursor:"pointer",fontFamily:F.h,fontSize:12}}>REPUBLIC</button>
        <button onClick={()=>setTpl("ni")} style={{background:tpl==="ni"?X.o:"#222",color:tpl==="ni"?"#000":"#999",border:"none",padding:"6px 14px",borderRadius:3,cursor:"pointer",fontFamily:F.h,fontSize:12}}>NORTHERN IRELAND</button>
      </div>
      <div style={{background:"#0a0a0a",border:"1px solid #333",borderRadius:4,padding:"16px 20px",marginTop:4,fontFamily:F.b,fontSize:13,color:"#ddd",lineHeight:1.7,whiteSpace:"pre-wrap",maxHeight:260,overflowY:"auto"}}>{tpl==="ni"?EMAIL_BODY_NI:EMAIL_BODY_ROI}</div>
      <button onClick={()=>copy(tpl==="ni"?EMAIL_BODY_NI:EMAIL_BODY_ROI,"tpl")} style={{marginTop:8,background:X.c,color:"#000",border:"none",padding:"8px 16px",borderRadius:4,cursor:"pointer",fontFamily:F.h,fontSize:14}}>{cp==="tpl"?"COPIED ✓":"COPY TEMPLATE"}</button>
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

function BlackspotPage({ onTabChange }) {
  const [step, setStep] = useState(BLACKSPOTS.length > 0 ? "browse" : "intro"); // browse | intro | locate | details | submitted
  const [loc, setLoc] = useState({ lat: null, lng: null, accuracy: null });
  const [locMethod, setLocMethod] = useState(null); // "gps" | "manual"
  const [locError, setLocError] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [road, setRoad] = useState("");
  const [desc, setDesc] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [detectedCounty, setDetectedCounty] = useState(null);
  const [constituencies, setConstituencies] = useState([]);
  const [openCon, setOpenCon] = useState(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedBs, setExpandedBs] = useState(null);
  const [sortBy, setSortBy] = useState("reports"); // "reports" | "date" | "county"
  const [filterJ, setFilterJ] = useState("all"); // "all" | "ROI" | "NI"

  const sec = { background: X.bg, border: `1px solid ${X.br}`, borderRadius: 6, padding: "24px 28px", marginBottom: 16 };
  const txt = { fontFamily: F.b, fontSize: 14, color: X.t, lineHeight: 1.7 };
  const inp = { width: "100%", padding: "10px 14px", background: "#0a0a0a", border: "1px solid #333", borderRadius: 4, color: "#fff", fontFamily: F.b, fontSize: 14, outline: "none" };

  const totalReports = BLACKSPOTS.reduce((s, b) => s + (b.reports || 1), 0);
  const officialCount = BLACKSPOTS.filter(b => b.source_type === "official").length;
  const communityCount = BLACKSPOTS.filter(b => b.source_type === "community").length;
  const countiesAffected = [...new Set(BLACKSPOTS.map(b => b.county))].length;

  const sorted = [...BLACKSPOTS]
    .filter(b => filterJ === "all" || COUNTIES[b.county]?.j === filterJ)
    .sort((a, b) => {
      if (sortBy === "reports") return (b.reports || 1) - (a.reports || 1);
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "county") return a.county.localeCompare(b.county);
      return 0;
    });

  function getLocation() {
    setLocLoading(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported. Use manual entry below.");
      setLocLoading(false);
      setShowManual(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLoc({ lat, lng, accuracy: pos.coords.accuracy });
        setLocMethod("gps");
        const county = nearestCounty(lat, lng);
        setDetectedCounty(county);
        setConstituencies(getConstituenciesForCounty(county));
        setLocLoading(false);
        setStep("details");
      },
      (err) => {
        setLocError(err.code === 1 ? "Location permission denied. Use manual entry below." : "Could not get location. Use manual entry below.");
        setLocLoading(false);
        setShowManual(true);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  function useManualLocation() {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng) || lat < 51 || lat > 56 || lng < -11 || lng > -5) {
      setLocError("Enter valid Irish coordinates (lat 51–56, lng -11 to -5)");
      return;
    }
    setLoc({ lat, lng, accuracy: null });
    setLocMethod("manual");
    const county = nearestCounty(lat, lng);
    setDetectedCounty(county);
    setConstituencies(getConstituenciesForCounty(county));
    setLocError(null);
    setStep("details");
  }

  function handleSubmit() {
    if (!desc.trim()) return;
    if (GOOGLE_FORM_CONFIG.enabled) {
      const f = GOOGLE_FORM_CONFIG.fields;
      const params = new URLSearchParams({
        [f.lat]: loc.lat, [f.lng]: loc.lng, [f.county]: detectedCounty || "",
        [f.road]: road, [f.description]: desc, [f.name]: contactName, [f.email]: contactEmail,
      });
      window.open(`https://docs.google.com/forms/d/e/${GOOGLE_FORM_CONFIG.formId}/formResponse?${params.toString()}&submit=Submit`, "_blank");
    } else {
      const body = `BLACKSPOT REPORT\n\nLocation: ${road}\nCounty: ${detectedCounty}\nGPS: ${loc.lat}, ${loc.lng}\nMap: https://www.google.com/maps?q=${loc.lat},${loc.lng}\n\nDescription:\n${desc}\n\nReported by: ${contactName || "Anonymous"}\nEmail: ${contactEmail || "Not provided"}`;
      window.open(`mailto:campaign@stoproaddeaths.ie?subject=${encodeURIComponent("Blackspot Report: " + (road || detectedCounty))}&body=${encodeURIComponent(body)}`, "_blank");
    }
    setSubmitted(true);
    setStep("submitted");
  }

  const isNI = detectedCounty ? COUNTIES[detectedCounty]?.j === "NI" : false;

  // Blackspot card component
  function BsCard({ bs, expanded, onToggle }) {
    const bsCons = getConstituenciesForCounty(bs.county);
    const bsIsNI = COUNTIES[bs.county]?.j === "NI";
    const allReps = bsCons.flatMap(c => c.reps.map(r => ({ ...r, con: c.name, isNI: c.isNI })));
    const urgency = (bs.reports || 1) >= 8 ? "CRITICAL" : (bs.reports || 1) >= 4 ? "HIGH" : "REPORTED";
    const urgencyColor = urgency === "CRITICAL" ? X.r : urgency === "HIGH" ? X.o : X.g;

    return (
      <div id={`bs-card-${bs.id}`} style={{
        background: "#0a0a0a", border: `1px solid ${expanded ? urgencyColor : "#222"}`,
        borderLeft: `3px solid ${urgencyColor}`, borderRadius: 4, marginBottom: 8,
        transition: "border-color 0.2s"
      }}>
        <div onClick={onToggle} style={{ padding: "14px 16px", cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F.b, fontSize: 15, color: "#fff", fontWeight: 600 }}>{bs.road}</span>
                {bs.source_type === "official" && <span style={{ fontFamily: F.m, fontSize: 8, color: X.c, border: `1px solid ${X.c}`, padding: "1px 5px", borderRadius: 2 }}>OFFICIAL DATA</span>}
                {bs.source_type === "community" && <span style={{ fontFamily: F.m, fontSize: 8, color: X.g, border: `1px solid ${X.g}`, padding: "1px 5px", borderRadius: 2 }}>COMMUNITY REPORT</span>}
                <span style={{ fontFamily: F.m, fontSize: 8, color: urgencyColor, border: `1px solid ${urgencyColor}`, padding: "1px 5px", borderRadius: 2 }}>{urgency}</span>
              </div>
              <div style={{ fontFamily: F.m, fontSize: 10, color: X.l }}>
                {bs.county} · {bsIsNI ? "NI" : "ROI"} · Reported {bs.date}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: F.h, fontSize: 28, color: urgencyColor, lineHeight: 1 }}>{bs.reports || 1}</div>
              <div style={{ fontFamily: F.m, fontSize: 8, color: X.l }}>REPORTS</div>
            </div>
          </div>
          <div style={{ fontFamily: F.b, fontSize: 13, color: "#bbb", lineHeight: 1.5, marginTop: 8 }}>
            {expanded ? bs.desc : bs.desc.length > 120 ? bs.desc.slice(0, 120) + "..." : bs.desc}
          </div>
        </div>

        {expanded && (
          <div style={{ borderTop: `1px solid #222`, padding: "12px 16px" }}>
            {/* Map + Street View + details */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <a href={`https://www.google.com/maps?q=${bs.lat},${bs.lng}`} target="_blank" rel="noopener"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
                  background: "#111", border: "1px solid #333", borderRadius: 4, textDecoration: "none",
                  fontFamily: F.m, fontSize: 11, color: X.c
                }}>
                📍 MAP →
              </a>
              <a href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${bs.lat},${bs.lng}&heading=0&pitch=0&fov=90`} target="_blank" rel="noopener"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
                  background: "#111", border: `1px solid ${X.g}`, borderRadius: 4, textDecoration: "none",
                  fontFamily: F.m, fontSize: 11, color: X.g
                }}>
                👁 STREET VIEW →
              </a>
              <div style={{ fontFamily: F.m, fontSize: 10, color: "#666", alignSelf: "center" }}>
                GPS: {bs.lat.toFixed(4)}, {bs.lng.toFixed(4)}
              </div>
            </div>

            {/* Responsible reps */}
            <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: "0.12em", color: X.c, marginBottom: 8 }}>
              RESPONSIBLE {bsIsNI ? "MLAs" : "TDs"} — EMAIL THEM ABOUT THIS LOCATION
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {allReps.slice(0, 6).map((rep, i) => {
                const email = makeEmail(rep.n, rep.isNI);
                const body = blackspotEmailBody(rep, rep.isNI, bs.road, bs.desc, bs.lat, bs.lng, bs.county);
                const mailto = `mailto:${email}?subject=${encodeURIComponent(BLACKSPOT_EMAIL_SUBJECT)}&body=${encodeURIComponent(body)}`;
                return (
                  <a key={i} href={mailto} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "6px 10px", background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 3,
                    textDecoration: "none",
                  }}>
                    <div>
                      <span style={{ fontFamily: F.b, fontSize: 13, color: "#ddd" }}>{rep.n}</span>
                      <span style={{ fontFamily: F.m, fontSize: 9, color: X.l, marginLeft: 6 }}>{rep.p} · {rep.con}</span>
                    </div>
                    <span style={{ fontFamily: F.h, fontSize: 12, color: X.c }}>EMAIL →</span>
                  </a>
                );
              })}
              {allReps.length > 6 && (
                <div style={{ fontFamily: F.m, fontSize: 10, color: "#666", padding: "4px 10px" }}>
                  + {allReps.length - 6} more representatives
                </div>
              )}
            </div>
            {bs.reportedBy && (
              <div style={{ fontFamily: F.m, fontSize: 10, color: "#555", marginTop: 8 }}>
                First reported by: {bs.reportedBy}
              </div>
            )}
            {bs.source && (
              <div style={{ fontFamily: F.m, fontSize: 10, color: "#555", marginTop: 4 }}>
                Source: {bs.source}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: F.h, fontSize: 44, color: "#fff" }}>BLACKSPOT MAP</div>
        <div style={{ ...txt, fontSize: 15, marginTop: 8, maxWidth: 580, margin: "8px auto 0" }}>
          Every community knows where their dangerous roads are. These are the ones identified by official collision data and reported by people who live beside them. Click any location to see the responsible politicians and email them directly.
        </div>
      </div>

      {/* RSA data suppression callout */}
      <div style={{ padding: "16px 20px", background: "#1a1a0a", border: `1px solid ${X.g}`, borderRadius: 6, marginBottom: 16, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontFamily: F.h, fontSize: 28, color: X.g, lineHeight: 1, flexShrink: 0 }}>⚠</div>
          <div>
            <div style={{ fontFamily: F.h, fontSize: 18, color: X.g, marginBottom: 4 }}>THE RSA STOPPED PUBLISHING BLACKSPOT DATA IN 2016</div>
            <div style={{ fontFamily: F.b, fontSize: 13, color: X.t, lineHeight: 1.6 }}>
              The Road Safety Authority used to publish data on accident blackspots so the public could see where dangerous roads were. <strong style={{ color: "#fff" }}>They stopped doing this in 2016.</strong> The Department of Transport still identifies "locations of interest" internally and shares them with local authorities, but the public is kept in the dark. In 2024, Labour's Duncan Smith called on the Taoiseach to force the RSA to resume publication. Nothing has changed. This map exists because the public has a right to know where people are dying — and to hold politicians accountable for roads that remain unfixed.
            </div>
          </div>
        </div>
      </div>

      {/* Browse mode — stats + list */}
      {(step === "browse" || step === "intro") && BLACKSPOTS.length > 0 && (<>
        {/* Stats */}
        <div className="bs-stats">
          <Stat label="BLACKSPOTS" value={String(BLACKSPOTS.length)} sub="Locations reported" accent={X.r} />
          <Stat label="REPORTS" value={String(totalReports)} sub="Total submissions" accent={X.o} />
          <Stat label="OFFICIAL DATA" value={String(officialCount)} sub="From TII / PSNI / DfI" accent={X.c} />
          <Stat label="COUNTIES" value={String(countiesAffected)} sub="Affected" accent={X.g} />
        </div>

        {/* Mini map */}
        <div style={{ ...sec, padding: "16px 20px" }}>
          <div style={{ fontFamily: F.m, fontSize: 10, color: "#999", marginBottom: 8 }}>
            ▲ GOLD TRIANGLES = KNOWN BLACKSPOTS (official data + community reports) · ● WHITE PULSES = THIS WEEK'S FATALITIES · ● RED CIRCLES = COUNTY DEATHS
          </div>
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <svg viewBox="0 0 500 540" style={{ width: "100%", height: "auto" }}>
              <path d="M404.8,44.2 L419.8,51.9 L429.6,67.1 L434,92.4 L453.5,117.8 L466.7,136.8 L457.9,155.9 L457.9,174.9 L426.9,193.9 L422.5,206.6 L418.1,219.3 L419.8,235.8 L419.8,257.3 L413.7,276.3 L409.2,282.7 L422.5,308 L419.8,333.4 L409.2,352.4 L404.8,371.5 L402.2,390.5 L398.6,409.5 L387.1,431.1 L369.4,441.2 L338.5,447.6 L316.3,460.2 L285.4,472.9 L258.8,485.6 L232.3,492 L214.6,498.3 L196.9,500.8 L179.2,511 L152.7,517.3 L117.3,523.7 L104,517.3 L90.8,498.3 L68.7,485.6 L51,479.3 L37.7,460.2 L33.3,441.2 L51,428.5 L68.7,434.9 L81.9,422.2 L68.7,409.5 L73.1,390.5 L90.8,384.1 L73.1,377.8 L68.7,365.1 L81.9,346.1 L90.8,327.1 L95.2,314.4 L77.5,308 L59.8,295.4 L55.4,289 L51,276.3 L55.4,263.7 L46.5,257.3 L55.4,248.4 L64.2,238.3 L55.4,232 L59.8,219.3 L51,206.6 L59.8,193.9 L68.7,181.2 L77.5,168.5 L104,162.2 L135,162.2 L161.5,168.5 L192.5,162.2 L188.1,155.9 L201.3,149.5 L205.8,143.2 L201.3,136.8 L210.2,130.5 L223.5,124.1 L205.8,111.5 L201.3,98.8 L214.6,79.8 L232.3,67.1 L236.7,54.4 L254.4,41.7 L281,25.2 L298.7,25.2 L316.3,35.4 L334,41.7 L356.2,48 L373.8,41.7 L404.8,44.2Z" fill="none" stroke="#444" strokeWidth="1" opacity="0.6"/>
              {BLACKSPOTS.map((bs, i) => {
                const x = ((bs.lng + 10.5) / 5.2) * 460 + 20;
                const y = ((55.5 - bs.lat) / 4.1) * 520 + 10;
                const urgency = (bs.reports || 1) >= 8 ? X.r : (bs.reports || 1) >= 4 ? X.o : X.g;
                const r = Math.max(6, Math.sqrt(bs.reports || 1) * 3.5);
                return (
                  <g key={`bsm${i}`} style={{ cursor: "pointer" }} onClick={() => {
                    setExpandedBs(bs.id === expandedBs ? null : bs.id);
                    setTimeout(() => {
                      const el = document.getElementById(`bs-card-${bs.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }}>
                    {/* Invisible larger click target */}
                    <circle cx={x} cy={y} r={18} fill="transparent" />
                    <circle cx={x} cy={y} r={r + 6} fill={urgency} opacity={0.15}>
                      <animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="3s" repeatCount="indefinite" />
                    </circle>
                    <polygon points={`${x},${y - 8} ${x + 7},${y + 5} ${x - 7},${y + 5}`} fill={urgency} stroke="#000" strokeWidth="0.5" opacity={expandedBs === bs.id ? 1 : 0.85} />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill="#000" fontSize="7" fontFamily={F.m} fontWeight="700" style={{ pointerEvents: "none" }}>!</text>
                    <text x={x} y={y + 16} textAnchor="middle" fill="#999" fontSize="7" fontFamily={F.m} style={{ pointerEvents: "none" }}>{bs.county}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Report button */}
        <button onClick={() => setStep("locate")} style={{
          width: "100%", padding: "14px", background: X.r, color: "#fff", border: "none",
          borderRadius: 4, fontFamily: F.h, fontSize: 20, cursor: "pointer", letterSpacing: "0.04em",
          marginBottom: 16
        }}>
          ⚠ REPORT A NEW BLACKSPOT
        </button>

        {/* Filters + sort */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginRight: 4 }}>FILTER:</div>
          {[{ id: "all", l: "ALL" }, { id: "ROI", l: "REPUBLIC" }, { id: "NI", l: "NI" }].map(f => (
            <button key={f.id} onClick={() => setFilterJ(f.id)} style={{
              background: filterJ === f.id ? "#222" : "transparent", border: `1px solid ${filterJ === f.id ? "#555" : X.br}`,
              color: filterJ === f.id ? "#fff" : "#888", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontFamily: F.m, fontSize: 9
            }}>{f.l}</button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginRight: 4 }}>SORT:</div>
          {[{ id: "reports", l: "MOST REPORTED" }, { id: "date", l: "NEWEST" }, { id: "county", l: "COUNTY" }].map(s => (
            <button key={s.id} onClick={() => setSortBy(s.id)} style={{
              background: sortBy === s.id ? "#222" : "transparent", border: `1px solid ${sortBy === s.id ? "#555" : X.br}`,
              color: sortBy === s.id ? "#fff" : "#888", padding: "4px 10px", borderRadius: 3, cursor: "pointer", fontFamily: F.m, fontSize: 9
            }}>{s.l}</button>
          ))}
        </div>

        {/* Blackspot list */}
        {sorted.map(bs => (
          <BsCard key={bs.id} bs={bs} expanded={expandedBs === bs.id} onToggle={() => {
            const newId = expandedBs === bs.id ? null : bs.id;
            setExpandedBs(newId);
            if (newId) setTimeout(() => {
              const el = document.getElementById(`bs-card-${bs.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 100);
          }} />
        ))}

        <div style={{ fontFamily: F.m, fontSize: 10, color: "#555", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
          OFFICIAL DATA: TII COLLISION RATES VIA GAMMA LOCATION INTELLIGENCE (2015–2017) · RSA FATALITY DATA (2017–2022) · PSNI COLLISION TRENDS (2018) · DfI COLLISION CLUSTER ANALYSIS (2025)<br/>
          "OFFICIAL DATA" = sourced from published government/agency datasets. "COMMUNITY REPORT" = submitted by the public, reviewed before publishing.<br/>
          THE RSA STOPPED PUBLISHING BLACKSPOT DATA IN 2016. THIS MAP EXISTS BECAUSE THE PUBLIC HAS A RIGHT TO KNOW.<br/>
          Urgency levels: CRITICAL (8+ reports) · HIGH (4+ reports) · REPORTED (1–3 reports)
        </div>
      </>)}

      {/* Empty state / intro when no blackspots */}
      {step === "intro" && BLACKSPOTS.length === 0 && (
        <div style={sec}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 4, height: 28, background: X.r, borderRadius: 2 }} />
            <div style={{ fontFamily: F.h, fontSize: 28, color: "#fff" }}>HOW THIS WORKS</div>
          </div>
          {[
            { n: "1", t: "SHARE YOUR LOCATION", d: "Use GPS or enter coordinates manually. We detect the county and constituency automatically." },
            { n: "2", t: "DESCRIBE THE HAZARD", d: "Road name, what makes it dangerous, how long it's been like this. We'll add Street View automatically." },
            { n: "3", t: "WE LINK IT TO YOUR TD/MLA", d: "The site auto-identifies the politicians responsible for your area. Email them about this specific location with one click." },
            { n: "4", t: "WE TRACK AND PUBLISH", d: "Every report is logged. Every blackspot gets a public record. Politicians can't claim they didn't know." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${X.br}` : "none" }}>
              <div style={{ fontFamily: F.h, fontSize: 32, color: X.r, lineHeight: 1, minWidth: 30 }}>{s.n}</div>
              <div>
                <div style={{ fontFamily: F.h, fontSize: 16, color: X.c, marginBottom: 2 }}>{s.t}</div>
                <div style={{ fontFamily: F.b, fontSize: 13, color: X.t, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
          <button onClick={() => setStep("locate")} style={{
            marginTop: 20, width: "100%", padding: "14px", background: X.r, color: "#fff", border: "none",
            borderRadius: 4, fontFamily: F.h, fontSize: 20, cursor: "pointer", letterSpacing: "0.04em"
          }}>
            REPORT A BLACKSPOT →
          </button>
          <div style={{ fontFamily: F.m, fontSize: 10, color: "#666", marginTop: 8, textAlign: "center" }}>
            Reports are reviewed before publishing. Your contact details are optional and never shared publicly.
          </div>
        </div>
      )}

      {/* Step: Location */}
      {step === "locate" && (
        <div style={sec}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 4, height: 28, background: X.c, borderRadius: 2 }} />
            <div style={{ fontFamily: F.h, fontSize: 28, color: "#fff" }}>STEP 1: WHERE IS THE BLACKSPOT?</div>
          </div>
          <div style={{ ...txt, marginBottom: 16 }}>
            For best results, go to the location and use GPS. If you're not there now, enter coordinates manually — you can get them from Google Maps (right-click → "What's here?").
          </div>

          <button onClick={getLocation} disabled={locLoading} style={{
            width: "100%", padding: "16px", background: locLoading ? "#333" : X.c, color: "#000",
            border: "none", borderRadius: 4, fontFamily: F.h, fontSize: 20, cursor: locLoading ? "wait" : "pointer",
            marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10
          }}>
            {locLoading ? (
              <><span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #000", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> GETTING LOCATION...</>
            ) : (
              "📍 USE MY GPS LOCATION"
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

          {locError && (
            <div style={{ padding: "10px 14px", background: "#2a1a1a", border: "1px solid #ff1a1a40", borderRadius: 4, marginBottom: 12 }}>
              <div style={{ fontFamily: F.b, fontSize: 13, color: X.r }}>{locError}</div>
            </div>
          )}

          <div onClick={() => setShowManual(!showManual)} style={{
            fontFamily: F.m, fontSize: 11, color: X.c, cursor: "pointer", textAlign: "center", padding: "8px 0",
            textDecoration: "underline", textUnderlineOffset: 3
          }}>
            {showManual ? "HIDE MANUAL ENTRY ▾" : "OR ENTER COORDINATES MANUALLY ▸"}
          </div>

          {showManual && (
            <div style={{ padding: "16px", background: "#0a0a0a", border: "1px solid #222", borderRadius: 4, marginTop: 8 }}>
              <div style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginBottom: 10 }}>
                GET COORDINATES: Open <a href="https://www.google.com/maps" target="_blank" rel="noopener" style={{ color: X.c }}>Google Maps</a> → right-click the location → click the coordinates to copy
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div>
                  <label style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginBottom: 4, display: "block" }}>LATITUDE</label>
                  <input value={manualLat} onChange={e => setManualLat(e.target.value)} placeholder="e.g. 53.3498" style={inp} />
                </div>
                <div>
                  <label style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginBottom: 4, display: "block" }}>LONGITUDE</label>
                  <input value={manualLng} onChange={e => setManualLng(e.target.value)} placeholder="e.g. -6.2603" style={inp} />
                </div>
              </div>
              <button onClick={useManualLocation} style={{
                width: "100%", padding: "10px", background: "#222", color: X.c, border: `1px solid ${X.c}`,
                borderRadius: 4, fontFamily: F.h, fontSize: 14, cursor: "pointer"
              }}>
                USE THESE COORDINATES
              </button>
            </div>
          )}

          <button onClick={() => setStep(BLACKSPOTS.length > 0 ? "browse" : "intro")} style={{
            marginTop: 12, background: "none", border: "none", color: "#888", cursor: "pointer",
            fontFamily: F.m, fontSize: 10, padding: 4
          }}>
            ← BACK
          </button>
        </div>
      )}

      {/* Step: Details */}
      {step === "details" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Location confirmed */}
          <div style={{ padding: "16px 20px", background: "#0a2a1a", border: `1px solid ${X.c}`, borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontFamily: F.h, fontSize: 20, color: X.c }}>📍 LOCATION SET — {detectedCounty?.toUpperCase()}</div>
                <div style={{ fontFamily: F.m, fontSize: 11, color: X.t }}>
                  {loc.lat?.toFixed(5)}, {loc.lng?.toFixed(5)}
                  {loc.accuracy && ` · ±${Math.round(loc.accuracy)}m`}
                  {locMethod === "gps" && " · GPS"}
                  {locMethod === "manual" && " · Manual"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <a href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`} target="_blank" rel="noopener"
                  style={{ fontFamily: F.m, fontSize: 10, color: X.c, textDecoration: "underline" }}>
                  MAP
                </a>
                <span style={{ color: "#555" }}>·</span>
                <a href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${loc.lat},${loc.lng}`} target="_blank" rel="noopener"
                  style={{ fontFamily: F.m, fontSize: 10, color: X.g, textDecoration: "underline" }}>
                  STREET VIEW
                </a>
                <span style={{ color: "#555" }}>·</span>
                <span onClick={() => { setStep("locate"); setLoc({ lat: null, lng: null, accuracy: null }); setDetectedCounty(null); }}
                  style={{ fontFamily: F.m, fontSize: 10, color: "#888", cursor: "pointer", textDecoration: "underline" }}>
                  CHANGE
                </span>
              </div>
            </div>
          </div>

          {/* Description form */}
          <div style={sec}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 4, height: 28, background: X.g, borderRadius: 2 }} />
              <div style={{ fontFamily: F.h, fontSize: 28, color: "#fff" }}>STEP 2: DESCRIBE THE HAZARD</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginBottom: 4, display: "block" }}>ROAD NAME / LOCATION DESCRIPTION *</label>
              <input value={road} onChange={e => setRoad(e.target.value)} placeholder="e.g. R153 bend near Navan, sharp left after the bridge" style={inp} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginBottom: 4, display: "block" }}>WHAT MAKES THIS LOCATION DANGEROUS? *</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={5} placeholder="Describe what you see: blind bends, missing barriers, poor visibility, flooding, narrow road, no footpath, history of crashes..." style={{ ...inp, resize: "vertical", minHeight: 100 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              <div>
                <label style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginBottom: 4, display: "block" }}>YOUR NAME (OPTIONAL)</label>
                <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Never shown publicly" style={inp} />
              </div>
              <div>
                <label style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginBottom: 4, display: "block" }}>YOUR EMAIL (OPTIONAL)</label>
                <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="For updates only" style={inp} />
              </div>
            </div>

            <button onClick={handleSubmit} disabled={!desc.trim()} style={{
              width: "100%", padding: "14px", background: desc.trim() ? X.r : "#333",
              color: desc.trim() ? "#fff" : "#666", border: "none", borderRadius: 4,
              fontFamily: F.h, fontSize: 20, cursor: desc.trim() ? "pointer" : "not-allowed"
            }}>
              SUBMIT REPORT →
            </button>
            <div style={{ fontFamily: F.m, fontSize: 10, color: "#666", marginTop: 6, textAlign: "center" }}>
              {GOOGLE_FORM_CONFIG.enabled
                ? "Opens a Google Form to confirm your submission."
                : "Opens an email to campaign@stoproaddeaths.ie with your report."}
            </div>
          </div>
        </div>
      )}

      {/* Step: Submitted — now email your reps */}
      {step === "submitted" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "24px", background: "#0a2a1a", border: `1px solid ${X.c}`, borderRadius: 6, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: F.h, fontSize: 28, color: X.c }}>REPORT SUBMITTED</div>
            <div style={{ fontFamily: F.b, fontSize: 14, color: X.t, marginTop: 6, lineHeight: 1.6 }}>
              Your blackspot report for <strong style={{ color: "#fff" }}>{road || detectedCounty}</strong> has been sent.
              Now take the next step — email the politicians responsible for this area.
            </div>
          </div>

          {/* TD/MLA email section */}
          <div style={{ ...sec, borderLeft: `3px solid ${X.c}` }}>
            <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: "0.15em", color: X.c, marginBottom: 6 }}>
              NOW EMAIL YOUR {isNI ? "MLAs" : "TDs"} ABOUT THIS SPECIFIC BLACKSPOT
            </div>
            <div style={{ fontFamily: F.b, fontSize: 13, color: X.t, marginBottom: 14, lineHeight: 1.5 }}>
              Each link opens an email pre-filled with the location details and GPS coordinates you just reported. The politician can click the Google Maps link and see exactly where the hazard is.
            </div>

            {constituencies.map(con => (
              <div key={con.name} style={{ marginBottom: 6 }}>
                <button onClick={() => setOpenCon(openCon === con.name ? null : con.name)} style={{
                  display: "block", width: "100%", textAlign: "left", background: openCon === con.name ? "#1a2a2a" : "#0d1a1a",
                  border: `1px solid ${openCon === con.name ? X.c : "#1a2a2a"}`, borderRadius: 4, padding: "8px 12px", cursor: "pointer",
                  fontFamily: F.h, fontSize: 16, color: openCon === con.name ? "#fff" : X.c, letterSpacing: "0.03em",
                }}>
                  {con.name.toUpperCase()} {openCon === con.name ? "▾" : "▸"}
                  <span style={{ fontFamily: F.m, fontSize: 10, color: X.l, marginLeft: 6 }}>
                    {con.reps.length} {con.isNI ? "MLAs" : "TDs"}
                  </span>
                </button>
                {openCon === con.name && (
                  <div style={{ padding: "8px 0 4px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {con.reps.map((rep, i) => {
                      const email = makeEmail(rep.n, con.isNI);
                      const body = blackspotEmailBody(rep, con.isNI, road, desc, loc.lat, loc.lng, detectedCounty);
                      const mailto = `mailto:${email}?subject=${encodeURIComponent(BLACKSPOT_EMAIL_SUBJECT)}&body=${encodeURIComponent(body)}`;
                      return (
                        <a key={i} href={mailto} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "8px 12px", background: "#0a0a0a", border: "1px solid #222", borderRadius: 3,
                          textDecoration: "none", cursor: "pointer",
                        }}>
                          <div>
                            <div style={{ fontFamily: F.b, fontSize: 14, color: "#fff", fontWeight: 500 }}>{rep.n}</div>
                            <div style={{ fontFamily: F.m, fontSize: 10, color: X.l }}>{rep.p} · {email}</div>
                          </div>
                          <div style={{ fontFamily: F.h, fontSize: 14, color: X.c, whiteSpace: "nowrap" }}>EMAIL ABOUT THIS BLACKSPOT →</div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Share */}
          <div style={{ ...sec, textAlign: "center" }}>
            <div style={{ fontFamily: F.h, fontSize: 22, color: "#fff", marginBottom: 8 }}>TELL OTHERS</div>
            <div style={{ fontFamily: F.b, fontSize: 13, color: X.t, marginBottom: 14 }}>
              Know someone else who lives near a dangerous road? Share this page.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`https://twitter.com/intent/tweet?text=I%20just%20reported%20a%20dangerous%20road%20in%20${encodeURIComponent(detectedCounty || "Ireland")}%20at%20stoproaddeaths.ie.%20Every%20community%20knows%20where%20the%20blackspots%20are.%20%23NotAStatistic`}
                target="_blank" rel="noopener" style={{ background: X.c, color: "#000", padding: "8px 16px", borderRadius: 4, fontFamily: F.h, fontSize: 14, textDecoration: "none" }}>
                SHARE ON X
              </a>
              <button onClick={() => { setStep(BLACKSPOTS.length > 0 ? "browse" : "intro"); setSubmitted(false); setLoc({ lat: null, lng: null, accuracy: null }); setRoad(""); setDesc(""); setDetectedCounty(null); }}
                style={{ background: "#222", color: X.c, padding: "8px 16px", borderRadius: 4, fontFamily: F.h, fontSize: 14, border: `1px solid ${X.c}`, cursor: "pointer" }}>
                REPORT ANOTHER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App(){
  const[sel,setSel]=useState(null);const[tab,setTab]=useState("map");const[filt,setFilt]=useState("all");const[pledged,setPledged]=useState(false);
  const filtered=Object.entries(COUNTIES).filter(([_,d])=>filt==="all"||d.j===filt);
  const ranking=filtered.map(([n,d])=>({name:n,...d,pc:(d.d/d.pop)*1e5})).sort((a,b)=>b.pc-a.pc);
  const tabs=[{id:"map",l:"WHERE"},{id:"when",l:"WHEN"},{id:"trend",l:"TREND"},{id:"who",l:"WHO"},{id:"latest",l:"THIS WEEK"},{id:"blackspots",l:"BLACKSPOTS"},{id:"tracker",l:"TD TRACKER"},{id:"demands",l:"DEMANDS"},{id:"act",l:"TAKE ACTION"}];
  return(<div style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:F.b}}>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
    <style>{`
      .map-grid{display:grid;grid-template-columns:1fr 380px;gap:18px;min-height:520px}
      .map-sidebar{display:flex;flex-direction:column;gap:10px;overflow-y:auto;max-height:600px}
      .tracker-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px}
      .bs-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px}
      @media(max-width:800px){
        .map-grid{grid-template-columns:1fr;min-height:auto}
        .map-sidebar{max-height:none}
        .tracker-stats{grid-template-columns:1fr 1fr}
        .bs-stats{grid-template-columns:1fr 1fr}
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
        background:tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"?X.c:t.id==="blackspots"?X.g:X.r):X.bg,border:`1px solid ${tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"?X.c:t.id==="blackspots"?X.g:X.r):X.br}`,
        color:tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"||t.id==="blackspots"?"#000":"#fff"):"#aaa",padding:"9px 16px",borderRadius:4,cursor:"pointer",
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
      {tab==="blackspots"&&<BlackspotPage onTabChange={setTab}/>}
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
        const daysSince=null;
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
                We will write to all 174 TDs and 90 MLAs with five structural demands on road safety. Every response — or silence — will be published here.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,maxWidth:500,margin:"0 auto",marginBottom:24}}>
                <Stat label="TDs" value="174" sub="Republic" accent={X.r}/>
                <Stat label="MLAs" value="90" sub="Northern Ireland" accent={X.o}/>
                <Stat label="TOTAL" value="264" sub="To be contacted" accent={X.c}/>
              </div>
              <div style={{background:"#0a0a0a",border:`1px solid ${X.br}`,borderRadius:6,padding:"20px 24px",maxWidth:560,margin:"0 auto",textAlign:"left"}}>
                <div style={{fontFamily:F.h,fontSize:22,color:X.g,marginBottom:8}}>FIVE DEMANDS</div>
                <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.7}}>
                  {DEMANDS.map(d=><div key={d.id} style={{marginBottom:6}}><span style={{color:X.r,fontFamily:F.h}}>{d.id}.</span> {d.short}</div>)}
                </div>
                <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginTop:12}}>YES OR NO. 14 DAYS TO RESPOND. THEN WE PUBLISH. <span onClick={()=>setTab("demands")} style={{color:X.c,cursor:"pointer",textDecoration:"underline"}}>READ THE FULL DEMANDS →</span></div>
              </div>
              {ACTION_COUNT>0&&<div style={{fontFamily:F.b,fontSize:14,color:X.c,marginTop:20}}>{ACTION_COUNT}+ people have already emailed their TDs through this site.</div>}
              <button onClick={()=>setTab("map")} style={{marginTop:16,background:X.r,color:"#fff",border:"none",padding:"12px 24px",borderRadius:4,fontFamily:F.h,fontSize:16,cursor:"pointer"}}>EMAIL YOUR TD NOW →</button>
            </div>
          </>)}
        </div>);
      })()}
      {tab==="demands"&&(<div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{fontFamily:F.h,fontSize:44,color:"#fff",textAlign:"center",margin:"30px 0 8px"}}>FIVE DEMANDS</div>
        <div style={{fontFamily:F.b,fontSize:15,color:X.t,textAlign:"center",lineHeight:1.6,maxWidth:560,margin:"0 auto 8px"}}>
          Ireland doesn't need more awareness campaigns. It needs structural change with clear ownership. These are five concrete, trackable actions we are asking every TD and MLA to commit to — yes or no.
        </div>
        <div style={{fontFamily:F.m,fontSize:11,color:X.l,textAlign:"center",marginBottom:28}}>
          Based on <a href="https://www.irishtimes.com/opinion/2025/12/03/pr-campaigns-are-not-enough-to-stop-people-dying-on-our-roads-here-is-what-we-need-to-do/" target="_blank" rel="noopener" style={{color:X.c}}>analysis published in The Irish Times, 3 Dec 2025</a>
        </div>
        {DEMANDS.map(d=><div key={d.id} style={{background:"#0a0a0a",border:"1px solid #222",borderRadius:6,padding:"20px 24px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:36,color:X.r,lineHeight:1}}>{d.id}</div>
            <div style={{fontFamily:F.h,fontSize:22,color:"#fff",letterSpacing:"0.02em"}}>{d.short.toUpperCase()}</div>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.65,marginBottom:d.ni_note?8:0}}>{d.detail}</div>
          {d.ni_note&&<div style={{fontFamily:F.b,fontSize:13,color:X.l,lineHeight:1.5,borderLeft:`2px solid ${X.o}`,paddingLeft:12,marginTop:8}}><strong style={{color:X.o}}>Northern Ireland:</strong> {d.ni_note}</div>}
        </div>)}
        <div style={{background:"#0d1a0d",border:`1px solid ${X.g}`,borderRadius:6,padding:"20px 24px",marginTop:20,marginBottom:12}}>
          <div style={{fontFamily:F.h,fontSize:18,color:X.g,marginBottom:8}}>WHY THESE FIVE?</div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.65}}>
            Ireland's road deaths have risen 31% since 2019 while the EU average fell 12%. The Government's target of 72 deaths by 2030 is now 164% off trajectory. The reason is not mysterious: responsibility for road safety is spread across so many bodies that <em style={{color:"#fff"}}>nobody is accountable for outcomes</em>. The RSA was recently weakened further. Enforcement has collapsed — speeding detections down 43% in a decade. Known death traps sit unchanged for years. We set targets without giving anyone the tools or budget to hit them.<br/><br/>
            These five demands target the five structural failures. They are binary — a politician can say yes or no. We will publish every response.
          </div>
        </div>
        <div style={{textAlign:"center",margin:"24px 0"}}>
          <button onClick={()=>setTab("act")} style={{background:X.c,color:"#000",border:"none",padding:"14px 28px",borderRadius:4,fontFamily:F.h,fontSize:16,cursor:"pointer",letterSpacing:"0.04em"}}>EMAIL YOUR TD/MLA NOW →</button>
        </div>
      </div>)}
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
