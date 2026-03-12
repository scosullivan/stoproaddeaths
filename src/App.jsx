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
  {date:"8 Mar",loc:"Dunmurry, Belfast",desc:"James Kilpatrick (55), motorcyclist, killed in single-vehicle collision on Queensway at 7:30am. From Dunmurry/Finaghy area.",type:"motorcyclist",lat:54.55,lng:-5.98},
  {date:"8 Mar",loc:"Tyrrelstown, Dublin",desc:"Man (30s), passenger, killed in single-vehicle collision on Powerstown Road. Two others injured. 30th ROI death of 2026.",type:"driver",lat:53.41,lng:-6.38},
  {date:"1 Mar",loc:"Ballina, Co Mayo",desc:"Fatal single-vehicle collision shortly after 4:15am.",type:"driver",lat:53.76,lng:-9.15},
  {date:"24 Feb",loc:"St Johnston, Co Donegal",desc:"Daniel Cullen (18) and Caoimhín Porter-McLoone (18), both from Derry, killed when car collided with lorry on R236. Third passenger critically injured, transferred to Belfast.",type:"driver",lat:54.93,lng:-7.45},
  {date:"24 Feb",loc:"Rusheen, Riverstown, Co Sligo",desc:"Motorcyclist in his 50s killed in collision with lorry on L1303.",type:"motorcyclist",lat:54.05,lng:-8.43},
  {date:"22 Feb",loc:"Navan, Co Meath",desc:"Mia Lily Keogh O'Keeffe (16) killed in hit-and-run while walking her dog on Slane Road. Driver arrested.",type:"pedestrian",lat:53.65,lng:-6.68},
  {date:"22 Feb",loc:"Tramore Road, Co Waterford",desc:"Brian and Grace Frisby, couple in their 40s, parents of two young sons, killed in two-car collision at Robin Hill.",type:"driver",lat:52.23,lng:-7.12},
  {date:"22 Feb",loc:"Armagh Road, Moy",desc:"Three killed — Conor Quinn (31), father of four; Laura Hoy (23), mother of one; John Guy (48), father of six.",type:"driver",lat:54.40,lng:-6.70},
  {date:"22 Feb",loc:"Eyrecourt, Co Galway",desc:"Woman in her 80s killed in single-vehicle crash.",type:"driver",lat:53.20,lng:-8.22},
  {date:"11 Feb",loc:"Newtownards, Co Down",desc:"Man (50s), pedestrian, struck by car on Kempe Stones Road. Pronounced dead at scene.",type:"pedestrian",lat:54.59,lng:-5.69},
  {date:"4 Jan",loc:"N4, Edgeworthstown, Co Longford",desc:"Francis 'Franco' Kelly (30s), first ROI road death of 2026. Two-car and van collision.",type:"driver",lat:53.70,lng:-7.60},
  {date:"4 Jan",loc:"Knockdooragh, Headford, Co Kerry",desc:"Man (30s) killed when car struck a tree on L3013 at 11:20pm.",type:"driver",lat:51.99,lng:-9.34},
  {date:"4 Jan",loc:"Bushmills, Co Antrim",desc:"Man (80s) killed in single-vehicle crash on Carnbore Road. First NI death of 2026.",type:"driver",lat:55.20,lng:-6.52},
];
const MO=[{m:"Jan",d:13},{m:"Feb",d:11},{m:"Mar",d:16},{m:"Apr",d:14},{m:"May",d:17},{m:"Jun",d:11},{m:"Jul",d:15},{m:"Aug",d:16},{m:"Sep",d:13},{m:"Oct",d:14},{m:"Nov",d:21},{m:"Dec",d:24}];
const YR=[{y:"2019",r:141,n:55,t:196},{y:"2020",r:149,n:50,t:199},{y:"2021",r:137,n:50,t:187},{y:"2022",r:155,n:62,t:217},{y:"2023",r:184,n:71,t:255},{y:"2024",r:175,n:69,t:244},{y:"2025",r:190,n:57,t:247},{y:"2026*",r:30,n:16,t:46,proj:true,pace:234}];

// ===== CAMPAIGN TRACKER =====
// UPDATE THIS: date you sent emails to all TDs/MLAs
const CAMPAIGN_SENT_DATE = "2026-03-01";
// UPDATE THIS: bump as people report emailing their TDs
const ACTION_COUNT = 99;
// UPDATE THIS: add responses as they come in
// status: "meaningful" | "generic" | "none"
// summary: one-line description of response (or null)
// responded: date string or null
const TRACKER = [
  // MEANINGFUL — 101 TDs/MLAs (SF 65 + SD 11 + Lab 10 + FF 7 + FG 5 + SDLP 2 + Ind 1). Three party-wide positions: SF, SD, Lab.
  {n:"Claire Kerrane",p:"SF",con:"Roscommon–Galway",j:"ROI",status:"meaningful",responded:"2026-02-25",summary:"First TD to respond. Committed to all five demands. SF has since adopted party-wide position."},
  {n:"Joe Cooney",p:"FG",con:"Clare",j:"ROI",status:"meaningful",responded:"2026-02-26",summary:"Committed to all five demands."},
  {n:"Mark Wall",p:"Lab",con:"Kildare South",j:"ROI",status:"meaningful",responded:"2026-02-26",summary:"Committed to all five demands. Labour has since adopted party-wide position."},
  {n:"Liam Quaide",p:"SD",con:"Cork East",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Committed to all five demands as part of SD party-wide position."},
  {n:"Pádraig Rice",p:"SD",con:"Cork South-Central",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Tabled PQs on red-light cameras. Engaged Cork City Council on Albert Road junction."},
  {n:"Holly Cairns",p:"SD",con:"Cork South-West",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"SD leader. Tabled PQs on Cork road deaths and Cork South-West accident data. Minister referred both to RSA instead of answering."},
  {n:"Cian O'Callaghan",p:"SD",con:"Dublin Bay North",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Committed to all five demands as part of SD party-wide position."},
  {n:"Eoin Hayes",p:"SD",con:"Dublin Bay South",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Committed to all five demands as part of SD party-wide position."},
  {n:"Gary Gannon",p:"SD",con:"Dublin Central",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Committed to all five demands as part of SD party-wide position."},
  {n:"Rory Hearne",p:"SD",con:"Dublin North-West",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Committed to all five demands as part of SD party-wide position."},
  {n:"Sinéad Gibney",p:"SD",con:"Dublin Rathdown",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Committed to all five demands as part of SD party-wide position."},
  {n:"Jen Cummins",p:"SD",con:"Dublin South-Central",j:"ROI",status:"meaningful",responded:"2026-03-02",summary:"Committed to all five demands. Tabling PQs. Avid cyclist. Spoke in Dáil road safety debate 5 Feb. Active on Dublin cycling safety."},
  {n:"Ciarán Ahern",p:"Lab",con:"Dublin South-West",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Labour Transport spokesperson. Tabled PQ on TII road classification. Labour party-wide position confirmed."},
  {n:"Barry Ward",p:"FG",con:"Dún Laoghaire",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Tabled 6+ PQs — RSA reform, speed cameras, cycling infrastructure, driving for work, enforcement. Got Canney on record confirming RSA split abandoned."},
  {n:"Michael Cahill",p:"FF",con:"Kerry",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Tabled PQ. Committed to follow up."},
  {n:"Aidan Farrelly",p:"SD",con:"Kildare North",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"Committed to all five demands as part of SD party-wide position."},
  {n:"Jennifer Whitmore",p:"SD",con:"Wicklow",j:"ROI",status:"meaningful",responded:"2026-02-27",summary:"SD Transport spokesperson. PQ on Vision Zero targets. Raised N81 and enforcement collapse."},
  {n:"George Lawlor",p:"Lab",con:"Wexford",j:"ROI",status:"meaningful",responded:"2026-03-01",summary:"Offered to table PQ with campaign wording. Labour party-wide position confirmed."},
  // LABOUR PARTY-WIDE POSITION — confirmed by Bacik 2026-03-06
  {n:"Conor Sheehan",p:"Lab",con:"Limerick City",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour party-wide position. All five demands adopted as party policy."},
  {n:"Duncan Smith",p:"Lab",con:"Dublin Fingal East",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour party whip. Party-wide position. All five demands adopted as party policy."},
  {n:"Eoghan Kenny",p:"Lab",con:"Cork North-Central",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour party-wide position. All five demands adopted as party policy."},
  {n:"Marie Sherlock",p:"Lab",con:"Dublin Central",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour party-wide position. All five demands adopted as party policy."},
  {n:"Robert O'Donoghue",p:"Lab",con:"Dublin Fingal West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour party-wide position. All five demands adopted as party policy."},
  {n:"Pat Buckley",p:"SF",con:"Cork East",j:"ROI",status:"meaningful",responded:"2026-03-02",summary:"Tabled PQ on NVDF Bill delay and collision data access. Extracted collision data tables from Minister — fatal crashes on local roads up 50% since 2019."},
  // SF PARTY-WIDE POSITION — adopted 2026-03-06
  {n:"Pa Daly",p:"SF",con:"Kerry",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF Transport spokesperson. Drove party-wide adoption of all five demands."},
  {n:"Kathleen Funchion",p:"SF",con:"Carlow–Kilkenny",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Matt Carthy",p:"SF",con:"Cavan–Monaghan",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Cathy Bennett",p:"SF",con:"Cavan–Monaghan",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Donna McGettigan",p:"SF",con:"Clare",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Thomas Gould",p:"SF",con:"Cork North-Central",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Donnchadh Ó Laoghaire",p:"SF",con:"Cork South-Central",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Pearse Doherty",p:"SF",con:"Donegal",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Pádraig Mac Lochlainn",p:"SF",con:"Donegal",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Denise Mitchell",p:"SF",con:"Dublin Bay North",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Ann Graves",p:"SF",con:"Dublin Fingal East",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Louise O'Reilly",p:"SF",con:"Dublin Fingal West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Eoin Ó Broin",p:"SF",con:"Dublin Mid-West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Mark Ward",p:"SF",con:"Dublin Mid-West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Dessie Ellis",p:"SF",con:"Dublin North-West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Aengus Ó Snodaigh",p:"SF",con:"Dublin South-Central",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Seán Crowe",p:"SF",con:"Dublin South-West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Paul Donnelly",p:"SF",con:"Dublin West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Louis O'Hara",p:"SF",con:"Galway East",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Mairéad Farrell",p:"SF",con:"Galway West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Réada Cronin",p:"SF",con:"Kildare North",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Shónagh Ní Raghallaigh",p:"SF",con:"Kildare South",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Maurice Quinlivan",p:"SF",con:"Limerick City",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Sorca Clarke",p:"SF",con:"Longford–Westmeath",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Imelda Munster",p:"SF",con:"Louth",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Ruairí Ó Murchú",p:"SF",con:"Louth",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Rose Conway-Walsh",p:"SF",con:"Mayo",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Darren O'Rourke",p:"SF",con:"Meath East",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Johnny Guirke",p:"SF",con:"Meath West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Martin Kenny",p:"SF",con:"Sligo–Leitrim",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"David Cullinane",p:"SF",con:"Waterford",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Conor D. McGuinness",p:"SF",con:"Waterford",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Johnny Mythen",p:"SF",con:"Wexford",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"John Brady",p:"SF",con:"Wicklow",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Fionntan Ó Súillebháin",p:"SF",con:"Wicklow–Wexford",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  // SF NI — PARTY-WIDE POSITION CONFIRMED 2026-03-06
  {n:"Gerry Kelly",p:"SF",con:"Belfast North",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted. Road safety added to NSMC Transport sectoral."},
  {n:"Carál Ní Chuilín",p:"SF",con:"Belfast North",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Deirdre Hargey",p:"SF",con:"Belfast South",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Órlaithí Flynn",p:"SF",con:"Belfast West",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Pat Sheehan",p:"SF",con:"Belfast West",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Danny Baker",p:"SF",con:"Belfast West",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Aisling Reilly",p:"SF",con:"Belfast West",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Declan Kearney",p:"SF",con:"South Antrim",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Philip McGuigan",p:"SF",con:"North Antrim",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Sinéad Ennis",p:"SF",con:"South Down",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Cathy Mason",p:"SF",con:"South Down",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Conor Murphy",p:"SF",con:"Newry & Armagh",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Liz Kimmins",p:"SF",con:"Newry & Armagh",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"Infrastructure Minister. SF party-wide position (all-island). All five demands adopted. Road safety added to NSMC Transport sectoral."},
  {n:"Cathal Boylan",p:"SF",con:"Newry & Armagh",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"John O'Dowd",p:"SF",con:"Upper Bann",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Jemma Dolan",p:"SF",con:"Fermanagh & South Tyrone",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Colm Gildernew",p:"SF",con:"Fermanagh & South Tyrone",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Áine Murphy",p:"SF",con:"Fermanagh & South Tyrone",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Maolíosa McHugh",p:"SF",con:"West Tyrone",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Nicola Brogan",p:"SF",con:"West Tyrone",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Declan McAleer",p:"SF",con:"West Tyrone",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Michelle O'Neill",p:"SF",con:"Mid Ulster",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"First Minister. SF party-wide position (all-island). All five demands adopted."},
  {n:"Emma Sheerin",p:"SF",con:"Mid Ulster",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Linda Dillon",p:"SF",con:"Mid Ulster",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Pádraig Delargy",p:"SF",con:"Foyle",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Ciara Ferguson",p:"SF",con:"Foyle",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Caoimhe Archibald",p:"SF",con:"East Londonderry",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position (all-island). All five demands adopted."},
  {n:"Emer Currie",p:"FG",con:"Dublin West",j:"ROI",status:"meaningful",responded:"2026-03-02",summary:"Transport Committee member. Tabled 3 PQs: Garda licence photo access (6-year delay), learner permit holder fatalities. Minister referred data questions to RSA."},
  {n:"Grace Boland",p:"FG",con:"Dublin Fingal West",j:"ROI",status:"meaningful",responded:"2026-03-05",summary:"Committed to tabling series of PQs. Called briefing material extremely helpful."},
  {n:"Shay Brennan",p:"FF",con:"Dublin Rathdown",j:"ROI",status:"meaningful",responded:"2026-03-05",summary:"FF Finance spokesperson. Broadly supports five demands. Committed to tabling PQ."},
  {n:"Pat the Cope Gallagher",p:"FF",con:"Donegal",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Detailed response. Tabled two PQs on Commissioner and strategy accountability. Referenced Grace's Law, e-scooters, speed cameras. Committed to raising issues with Minister O'Brien."},
  {n:"Shane Moynihan",p:"FF",con:"Dublin Mid-West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"FF Transport Spokesperson. Addressed all five demands. Tabled PQ on road safety governance coordination. Supports black spot redesign, enforcement. Hedged on Commissioner."},
  {n:"Ivana Bacik",p:"Lab",con:"Dublin Bay South",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour Party leader. Formally signed up Labour as party-wide position backing all five demands."},
  {n:"Cathal Crowe",p:"FF",con:"Clare",j:"ROI",status:"meaningful",responded:"2026-03-03",summary:"Transport Committee member. Lost mother-in-law to road crash Nov 2024. Offered to table PQs. FF Spokesperson on Aviation & Logistics."},
  {n:"Michael Murphy",p:"FG",con:"Tipperary South",j:"ROI",status:"meaningful",responded:"2026-03-03",summary:"Transport Committee Chair. Confirmed submission will be circulated to all members. Oral evidence request on agenda."},
  {n:"Brendan Smith",p:"FF",con:"Cavan–Monaghan",j:"ROI",status:"meaningful",responded:"2026-03-03",summary:"Substantive policy engagement. Supports enforcement, raised concerns on Commissioner model. Forwarded to Minister. Ref: TTAS-MO-01256-2026."},
  {n:"Alan Kelly",p:"Lab",con:"Tipperary North",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour party-wide position. All five demands adopted as party policy."},
  {n:"Darragh O'Brien",p:"FF",con:"Dublin Fingal East",j:"ROI",status:"generic",responded:"2026-03-02",summary:"Minister for Transport. Constituency office referred to ministerial office, which referred to Minister of State Canney. Ref: TTAS-MO-01247-2026."},
  {n:"Carol Nolan",p:"Ind",con:"Offaly",j:"ROI",status:"generic",responded:"2026-03-02",summary:"PA asked detailed policy questions on Commissioner role and speed cameras. Indicated TD will engage constructively with some proposals."},
  {n:"Mark H. Durkan",p:"SDLP",con:"Foyle",j:"NI",status:"meaningful",responded:"2026-03-02",summary:"First NI response. PA committed to tabling Assembly Questions on road safety governance."},
  {n:"Hildegarde Naughton",p:"FG",con:"Galway West",j:"ROI",status:"generic",responded:"2026-03-03",summary:"Cabinet Minister. Former MoS at Transport 2020–2025. Redirected to Minister for Transport. Road deaths rose 32% during her tenure."},
  {n:"Mary Lou McDonald",p:"SF",con:"Dublin Central",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF leader. Office routed to Pa Daly (transport spokesperson). SF has adopted all five demands as party policy."},
  {n:"Jennifer Carroll MacNeill",p:"FG",con:"Dún Laoghaire",j:"ROI",status:"generic",responded:"2026-03-03",summary:"Minister for Health. Office sent Programme for Government copy-paste to constituent. No personal position on five demands."},
  {n:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",j:"ROI",status:"meaningful",responded:"2026-03-12",summary:"Govt-supporting Independent. Supports Road Safety Commissioner. Committed to tabling multiple PQs."},
  {n:"James Geoghegan",p:"FG",con:"Dublin Bay South",j:"ROI",status:"generic",responded:"2026-03-12",summary:"Detailed response listing government actions. No personal position on five demands. No PQ commitment. Vague on parliamentary action."},
  {n:"Colin McGrath",p:"SDLP",con:"South Down",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"Tabled Assembly Questions to Infrastructure Minister. SDLP council motion on roads emergency blocked by DUP and SF."},
  {n:"Séamus McGrath",p:"FF",con:"Cork South-Central",j:"ROI",status:"meaningful",responded:"2026-03-11",summary:"Supports all five demands. Committed to tabling PQs."},
];

const F={m:"'JetBrains Mono',monospace",h:"'Bebas Neue',sans-serif",b:"'IBM Plex Sans',sans-serif"};
const X={l:"#aaa",t:"#ccc",d:"#666",bg:"#111",br:"#2a2a2a",r:"#ff1a1a",o:"#ff6b35",g:"#ffd700",c:"#4ecdc4"};

// ===== PARLIAMENTARY QUESTIONS TRACKER =====
const PQS = [
  // === ANSWERED ===
  {td:"Jennifer Whitmore",p:"SD",con:"Wicklow",date:"2026-02-26",type:"Priority Oral",
   q:"To ask the Minister for Transport if he intends to set a road deaths reduction target for Phase 2 of Vision Zero; and if he will make a statement on the matter.",
   status:"answered",answered:"2026-02-26",minister:"Seán Canney",
   response:"The Government remains committed to Vision Zero and the target of no more than 72 deaths by 2030. Deaths in 2024 had to be no higher than 122; there were 171. 'I do not believe it would be helpful to set a specific 2027 target when we already have a clear objective for 2030.' NVDF Bill targeted for enactment by summer 2026.",
   assessment:"Declined to set interim targets despite being 164% off trajectory. Confirmed 171 deaths in 2024 against a target of 122. NVDF Bill delayed again — previously promised by end of 2025."},
  {td:"Claire Kerrane",p:"SF",con:"Roscommon–Galway",date:"2026-03-03",type:"Written",
   q:"To ask the Minister for Transport to outline what actions he is taking to reduce fatalities on our roads; the specific actions he is taking; and if he will make a statement on the matter.",
   status:"repeat",answered:"2026-03-03",minister:"Ceann Comhairle",
   response:"Ruled a repeat of Question No. 93 of 26 February 2026 (Whitmore). Referred to that reply.",
   assessment:"Ruled repeat — confirms the Oireachtas recognises these PQs as part of a coordinated line of questioning."},
  {td:"Barry Ward",p:"FG",con:"Dún Laoghaire",date:"2026-03-04",type:"Written",
   q:"[Q64] Road safety initiatives for people who drive for work; [Q65-66] National policy on protected cycling and pedestrian infrastructure and how communicated to local authorities; [Q67-68] Basis for decision not to split the RSA into two agencies as recommended by Indecon review; effectiveness review of RSA.",
   status:"answered",answered:"2026-03-04",minister:"Seán Canney",
   response:"On driving for work: RSA developing radio campaign; €18m ringfenced for road safety public interest work in 2026; RSA hosts seminars. On cycling infrastructure: listed design manuals, CycleConnects plan. On RSA split: 'I have decided not to pursue this recommendation as I believe that reform can be delivered more efficiently and effectively within the existing RSA organisational structure.' Listed reforms: fee increases, €18m ringfenced, Road Safety Communications Steering Group established Dec 2024, Department took over strategy coordination, new RSA board members appointed.",
   assessment:"Five PQs in a single sitting. The RSA answer is the key one: Canney confirms on the record that he abandoned the Cabinet-approved reform. His listed 'reforms' are fee increases, a steering group, and new board members — none of which address the accountability gap. No Commissioner. No lead agency. No answer to who delivers the 2030 target."},
  {td:"Pat Buckley",p:"SF",con:"Cork East",date:"2026-03-05",type:"Written",
   q:"To ask the Minister for Transport when the NVDF Bill 2025 will be published, given the Minister stated in May 2025 it would be enacted by year-end; the interim measures to provide local authority road engineers with access to collision location data, given it has not been shared since 2020 and the DPC stated in April 2024 that GDPR should not prevent sharing; and to provide the number of fatal and serious injury collisions on regional and local roads managed by local authorities each year from 2019 to 2025.",
   status:"answered",answered:"2026-03-05",minister:"Seán Canney",
   response:"NVDF Bill 'will be published in the coming weeks with enactment targeted for the first half of 2026.' Confirms collision data not shared with local authorities since November 2023. Interim measure: Department undertaking collision analysis and notifying local authorities of 'locations of interest.' Fatal collisions on local roads: 30 (2019), 33 (2020), 27 (2021), 41 (2022), 40 (2023), 38 (2024), 45 (2025). Regional roads: 50, 41, 46, 46, 65, 56, 63. Serious injuries on local roads: 427, 375, 449, 487, 458, 442, 406. Regional: 665, 495, 589, 691, 648, 615, 662.",
   assessment:"Produced actual data — fatal collisions on local roads rose 50% (30→45) and regional roads rose 26% (50→63) from 2019 to 2025. Confirms the data blackout since Nov 2023. 'Coming weeks' is the third deadline — previously end-2025, then summer 2026. The interim measure (Department does analysis centrally) proves the system is broken: instead of giving engineers the data, the Department became the middleman."},
  {td:"Holly Cairns",p:"SD",con:"Cork South-West",date:"2026-03-05",type:"Written",
   q:"[Q278] Number of road deaths in Cork, by road, from 2020 to date in 2026. [Q279] Number of road accidents in Cork South-West, by road, from 2024 to date in 2026, in tabular form.",
   status:"answered",answered:"2026-03-05",minister:"Seán Canney",
   response:"Referred to the RSA for direct, detailed reply. 'I would ask the Deputy to contact my office if a response has not been received within ten days.'",
   assessment:"The Minister for Road Safety was asked how many people died on Cork's roads. He did not answer. He sent it to the RSA — the body he refused to reform. This is the accountability gap in a single exchange."},
  {td:"Emer Currie",p:"FG",con:"Dublin West",date:"2026-03-05",type:"Written",
   q:"Progress on Garda access to driving licence photographs from the National Driver File database; the reason for the six-year delay in making a decision whether to grant access.",
   status:"answered",answered:"2026-03-05",minister:"Seán Canney",
   response:"NVDF Bill General Scheme approved by Government, at Office of Parliamentary Counsel. Gardaí wrote to Department in September 2025 requesting licence photo access. Department 'is in the process of seeking legal advice.' Process hoped to conclude by summer, coinciding with NVDF Bill enactment.",
   assessment:"Six years. Gardaí have been asking since 2019 for access to licence photos at checkpoints. The Department is still 'seeking legal advice.' Another data-sharing failure alongside the collision data scandal."},
  {td:"Emer Currie",p:"FG",con:"Dublin West",date:"2026-03-03",type:"Written",
   q:"[Q305-306] Number of learner permit holders in fatal and serious injury collisions each year from 2020; fatalities in each; number driving unaccompanied.",
   status:"answered",answered:"2026-03-03",minister:"Seán Canney",
   response:"Referred to the RSA for direct, detailed reply.",
   assessment:"Same pattern as Cairns: asked for data, Minister refers to the RSA instead of answering."},
  {td:"Shane Moynihan",p:"FF",con:"Dublin Mid-West",date:"2026-03-05",type:"Written",
   q:"To ask the Minister for Transport if his Department plans to introduce regulation of sulkies, including protection of other road users; and if he will make a statement on the matter.",
   status:"answered",answered:"2026-03-05",minister:"Seán Canney",
   response:"Enforcement of illegal sulky racing is a matter for An Garda Síochána under section 74 of the Roads Act 1993. Animal welfare issues are a matter for the Minister for Agriculture.",
   assessment:"Not from our campaign, but illustrates the same pattern: Minister points to existing law and other bodies rather than taking ownership. Enforcement is always someone else's problem."},
  // === TABLED — AWAITING ANSWER ===
  {td:"Ciarán Ahern",p:"Lab",con:"Dublin South-West",date:"2026-03-01",type:"Written",
   q:"To ask the Minister for Transport regarding TII road classification and whether local authorities must self-fund safety fixes on non-national roads.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting written answer."},
  {td:"Barry Ward",p:"FG",con:"Dún Laoghaire",date:"2026-03-04",type:"Written",
   q:"To ask the Minister for Transport the current number of fixed automated speed cameras operational in Ireland; the timeline for deploying the 100 additional cameras announced in May 2024; how this compares with the 1,164 fixed camera points in Finland and 2,487 in Sweden; whether the Government has examined income-based speeding fines as used in Finland and Norway; and if he will make a statement on the matter.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer. Forces Minister to put Ireland's camera count on record alongside peer countries."},
  {td:"Cathal Crowe",p:"FF",con:"Clare",date:"2026-03-06",type:"Written",
   q:"To ask the Minister for Transport, following the decision in December 2025 to abandon the planned restructuring of the Road Safety Authority, to state which body or individual is now responsible for delivering the Government's target of halving road deaths by 2030; whether the Government has examined the Road Safety Commissioner model or equivalent statutory accountability mechanisms used in Sweden, Norway, and Finland; and if not, the reasons for same.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer. The accountability question — forces Minister to name who holds the target."},
  {td:"George Lawlor",p:"Lab",con:"Wexford",date:"2026-03-04",type:"Written",
   q:"PQ on road safety governance.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer."},
  {td:"Grace Boland",p:"FG",con:"Dublin Fingal West",date:"2026-03-06",type:"Written",
   q:"Series of PQs on road safety.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer."},
  {td:"Shay Brennan",p:"FF",con:"Dublin Rathdown",date:"2026-03-06",type:"Written",
   q:"PQ on road safety expenditure and cost-effectiveness of speed camera deployment.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer. FF Finance spokesperson — targets the economics of enforcement."},
  {td:"Pat the Cope Gallagher",p:"FF",con:"Donegal",date:"2026-03-06",type:"Written",
   q:"(1) To ask the Minister for Transport if he would support the establishment of a position of Road Safety Commissioner to oversee the implementation of our Road Safety Strategy, in particular, the aim of achieving a 50% reduction in road deaths in Ireland by 2030, and if he will make a statement on the matter. (2) To ask the Minister for Transport what body is responsible for overseeing the implementation of the Road Safety Strategy, and if he will make a statement on the matter.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer. Two PQs directly targeting the accountability gap — forces Minister to state a position on the Commissioner and name who holds the target."},
  {td:"Shane Moynihan",p:"FF",con:"Dublin Mid-West",date:"2026-03-06",type:"Written",
   q:"To ask the Minister for Transport for an update on any reforms being considered to the coordination structures for road safety governance to further strengthen implementation of the Road Safety Strategy 2021–2030; and if he will make a statement on the matter.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer. FF Transport Spokesperson — asks about governance coordination reforms."},
];

const EMAIL_SUBJECT = "Road Safety Crisis — I Need Your Response";
const DEMANDS = [
  {id:1,short:"Single Accountable Officeholder",detail:"Support the creation of a statutory Road Safety Commissioner (or equivalent) with the authority, budget and legal mandate to deliver the 2030 target — ending the current system where responsibility is diffused across the RSA, Department of Transport, local authorities, An Garda Síochána/PSNI and TII/DfI with no single point of ownership.",ni_note:"In NI, this means a dedicated Road Safety Commissioner within the Department for Infrastructure, with cross-departmental enforcement powers."},
  {id:2,short:"Automated Speed Cameras",detail:"Support the deployment of average-speed (point-to-point) cameras on high-risk routes within 12 months. Ireland remains one of the only developed countries without a functioning automated speed camera network. These are proven, low-cost tools that reduce fatalities.",ni_note:"NI has some average speed cameras but coverage remains limited to a handful of routes."},
  {id:3,short:"Mandatory Black Spot Redesign",detail:"Support a funded national programme — with published timelines — to redesign the 50 highest-risk road sections identified by crash data. No more leaving known death traps unchanged for decades while local authorities lack budgets or oversight.",ni_note:"In NI, this applies to roads managed by DfI Roads and requires ring-fenced capital funding."},
  {id:4,short:"Reverse the Enforcement Collapse",detail:"Support dedicated road policing units and reverse the 43% decline in speeding detections over the past decade. Commit to restoring enforcement to at least 2014 levels within two years.",ni_note:"In NI, this means restoring PSNI roads policing capacity, which has been cut significantly."},
  {id:5,short:"Raise This in Parliament",detail:"Personally table a Parliamentary Question (in the Dáil) or Question for Written Answer (in the Assembly) on road safety governance within 30 days of receiving this letter. We will track and publish whether you do.",ni_note:""},
];

const EMAIL_BODY_ROI = `Dear [TD name],

I am writing as your constituent about the road safety crisis in Ireland. In 2025, 190 people were killed on our roads in the Republic alone — 247 across the island. This is the worst year in over a decade, an 8% increase on 2024, and a 31% increase since 2019.

Ireland is now one of the only EU countries where road deaths are rising. The Government's own target — no more than 72 deaths by 2030 — is 164% above trajectory. This is not a target being narrowly missed. It is a target being abandoned in practice while being maintained in rhetoric.

As your constituent, I am asking you to commit to five specific actions:

1. ACCOUNTABLE OFFICEHOLDER: Will you support the creation of a statutory Road Safety Commissioner with the legal authority, budget and mandate to deliver the 2030 target? Currently, responsibility is diffused across the RSA, Department of Transport, local authorities, An Garda Síochána and TII — with no single person accountable for outcomes.

2. AUTOMATED SPEED CAMERAS: Will you support the deployment of average-speed cameras on high-risk routes within 12 months? Ireland is one of the only developed countries without a functioning network, despite overwhelming evidence that they reduce fatalities.

3. BLACK SPOT REDESIGN: Will you support a funded national programme to redesign the 50 highest-risk road sections — with published timelines? Known death traps sit unchanged for years while communities bury their neighbours.

4. REVERSE THE ENFORCEMENT COLLAPSE: Will you support restoring road policing to at least 2014 levels? Speeding detections have fallen 43% in a decade. Fewer people are being caught because fewer people are being checked.

5. PARLIAMENTARY QUESTION: Will you personally table a Dáil question on road safety governance within 30 days? I will be checking the Oireachtas record.

I am not asking for sympathy or awareness campaigns. I am asking whether you will take five concrete, trackable actions. Your response — or your silence — will be published at stoproaddeaths.ie.

Yours sincerely,
[Your name]
[Your address]`;

const EMAIL_BODY_NI = `Dear [MLA name],

I am writing as your constituent about the road safety crisis across the island of Ireland. In 2025, 57 people were killed on Northern Ireland's roads and 247 across the island — the worst year in over a decade.

Northern Ireland shares the same structural problem as the Republic: responsibility for road safety is diffused across the PSNI, the Department for Infrastructure, and local agencies — with no single person accountable for outcomes.

As your constituent, I am asking you to commit to five specific actions:

1. ACCOUNTABLE OFFICEHOLDER: Will you support the creation of a dedicated Road Safety Commissioner within the Department for Infrastructure, with cross-departmental authority and a statutory mandate to deliver casualty reduction targets?

2. AUTOMATED SPEED CAMERAS: Will you support expanding the average-speed camera network to cover the highest-risk routes in Northern Ireland within 12 months?

3. BLACK SPOT REDESIGN: Will you support a funded programme — with published timelines — to redesign the highest-risk road sections managed by DfI Roads?

4. REVERSE THE ENFORCEMENT COLLAPSE: Will you support restoring PSNI roads policing capacity, which has been significantly cut in recent years?

5. ASSEMBLY QUESTION: Will you personally table a Question for Written Answer on road safety governance within 30 days? I will be checking the Assembly record.

I am not asking for sympathy or awareness campaigns. I am asking whether you will take five concrete, trackable actions. Your response — or your silence — will be published at stoproaddeaths.ie.

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

export default function App(){
  const[sel,setSel]=useState(null);const[tab,setTab]=useState("map");const[filt,setFilt]=useState("all");const[pledged,setPledged]=useState(false);const[lookupCounty,setLookupCounty]=useState(null);const[expandedPQ,setExpandedPQ]=useState(null);
  const filtered=Object.entries(COUNTIES).filter(([_,d])=>filt==="all"||d.j===filt);
  const ranking=filtered.map(([n,d])=>({name:n,...d,pc:(d.d/d.pop)*1e5})).sort((a,b)=>b.pc-a.pc);
  const tabs=[{id:"map",l:"WHERE"},{id:"when",l:"WHEN"},{id:"trend",l:"TREND"},{id:"who",l:"WHO"},{id:"latest",l:"2026"},{id:"tracker",l:"TD TRACKER"},{id:"pqs",l:"PQ TRACKER"},{id:"demands",l:"DEMANDS"},{id:"act",l:"TAKE ACTION"}];
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
        background:tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"||t.id==="pqs"?X.c:X.r):X.bg,border:`1px solid ${tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"||t.id==="pqs"?X.c:X.r):X.br}`,
        color:tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"||t.id==="pqs"?"#000":"#fff"):"#aaa",padding:"9px 16px",borderRadius:4,cursor:"pointer",
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
          <div style={{fontFamily:F.m,fontSize:11,letterSpacing:"0.18em",color:X.l,marginBottom:8}}>ALL-ISLAND DEATHS · 2019–2026</div>
          {(()=>{
            const mx=380,chartH=200,chartW=620,barW=48,gap=16,padL=40,padB=25,padT=20;
            const totalW=YR.length*(barW+gap)-gap;
            const startX=padL+(chartW-padL-totalW)/2;
            const yScale=(v)=>padT+(chartH-padT-padB)*(1-v/mx);
            // Government 2030 target for ROI = 72, scaled all-island ~120
            const vz=120;
            // EU average: road deaths fell ~3%/year. Applied to Ireland's 2019 baseline of 196:
            const eu=[196,190,184,179,174,169,164,159];
            return(<svg viewBox={`0 0 ${chartW} ${chartH+10}`} style={{width:"100%"}}>
              <defs><pattern id="proj-r" patternUnits="userSpaceOnUse" width="4" height="4"><line x1="0" y1="4" x2="4" y2="0" stroke="#ff1a1a" strokeWidth="1" opacity="0.6"/></pattern><pattern id="proj-o" patternUnits="userSpaceOnUse" width="4" height="4"><line x1="0" y1="4" x2="4" y2="0" stroke="#ff6b35" strokeWidth="1" opacity="0.6"/></pattern></defs>
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
              <text x={startX+7*(barW+gap)+barW/2+8} y={yScale(eu[7])+1} fill={X.g} fontSize="9" fontFamily={F.m} dominantBaseline="middle">←159</text>
              <text x={startX+7*(barW+gap)+barW/2+8} y={yScale(eu[7])+11} fill={X.g} fontSize="7" fontFamily={F.m} opacity="0.7">EU AVERAGE</text>
              {/* Bars */}
              {YR.map((y,i)=>{
                const x=startX+i*(barW+gap);
                const hR=(y.r/mx)*(chartH-padT-padB);
                const hN=(y.n/mx)*(chartH-padT-padB);
                const is2025=i===6;
                const isProj=y.proj;
                const baseY=chartH-padB;
                return(<g key={i}>
                  {isProj?(<>
                    {/* Dashed outline showing annualised pace */}
                    {(()=>{const paceH=(y.pace/mx)*(chartH-padT-padB);return <rect x={x} y={baseY-paceH} width={barW} height={paceH} fill="none" stroke={X.r} strokeWidth="2" strokeDasharray="6 3" rx="1" opacity="0.7"/>})()}
                    {/* Pace label above */}
                    {(()=>{const paceH=(y.pace/mx)*(chartH-padT-padB);return <><text x={x+barW/2} y={baseY-paceH-16} textAnchor="middle" fill={X.c} fontSize="8" fontFamily={F.m} opacity="0.9">PACE</text><text x={x+barW/2} y={baseY-paceH-5} textAnchor="middle" fill={X.c} fontSize="11" fontFamily={F.m} fontWeight="600">~{y.pace}</text></>})()}
                    {/* Solid bars showing actual YTD */}
                    <rect x={x} y={baseY-hR} width={barW} height={hR} fill={X.r} rx="1"/>
                    <rect x={x} y={baseY-hR-hN-1} width={barW} height={hN} fill={X.o} rx="1"/>
                    <text x={x+barW/2} y={baseY-hR+hR/2+4} textAnchor="middle" fill="#fff" fontSize="11" fontFamily={F.h} fontWeight="600">{y.t}</text>
                  </>):(<>
                    <rect x={x} y={baseY-hR} width={barW} height={hR} fill={is2025?X.r:"#cc2222"} rx="1"/>
                    <rect x={x} y={baseY-hR-hN-1} width={barW} height={hN} fill={is2025?X.o:"#cc6622"} rx="1"/>
                  </>)}
                  {!isProj&&<text x={x+barW/2} y={baseY-hR-hN-6} textAnchor="middle" fill={is2025?X.r:"#ccc"} fontSize="10" fontFamily={F.m} fontWeight={is2025?"600":"400"}>{y.t}</text>}
                  <text x={x+barW/2} y={baseY+14} textAnchor="middle" fill={isProj?"#888":is2025?X.r:"#999"} fontSize="9" fontFamily={F.m}>{y.y}</text>
                </g>);
              })}
              })}
            </svg>);
          })()}
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:4,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,background:X.r,borderRadius:2}}/><span style={{fontFamily:F.m,fontSize:10,color:"#bbb"}}>REPUBLIC</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,background:X.o,borderRadius:2}}/><span style={{fontFamily:F.m,fontSize:10,color:"#bbb"}}>NI</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:20,height:0,borderTop:`2px dashed ${X.g}`}}/><span style={{fontFamily:F.m,fontSize:10,color:X.g}}>EU AVERAGE</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:20,height:0,borderTop:`2px dashed ${X.c}`}}/><span style={{fontFamily:F.m,fontSize:10,color:X.c}}>GOVT 2030 TARGET</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,border:`1px dashed ${X.r}`,borderRadius:2}}/><span style={{fontFamily:F.m,fontSize:10,color:"#bbb"}}>2026 PROJECTED</span></div>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.7,marginTop:14}}>The yellow line shows where Ireland would be if it had matched the EU average decline in road deaths (~3% per year). By 2025, that would mean 164 deaths — not 247. That gap is <strong style={{color:X.r}}>83 extra people killed</strong> because Ireland went backwards while the rest of Europe improved. The teal line is the government's own 2030 target (~120 all-island). Ireland is more than double it. The hatched 2026 bar shows 54 people killed in the first 8 weeks — annualised, that's a pace of <strong style={{color:X.r}}>~352 deaths</strong>, which would be the worst year since the early 2000s.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}><Stat label="VS GOVT TARGET" value="+127" sub="Above ~120 target" accent={X.c}/><Stat label="ACTUAL" value="247" sub="All-island 2025"/><Stat label="VS EU AVERAGE" value="+83" sub="Extra deaths" accent={X.g}/><Stat label="2026 PACE" value="~352" sub="54 killed in 8 weeks" accent={X.o}/></div>
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
          <div style={{fontFamily:F.h,fontSize:56,color:X.r}}>46+</div>
          <div style={{fontFamily:F.h,fontSize:20,color:"#fff"}}>KILLED ACROSS THE ISLAND · 10 WEEKS</div>
          <div style={{display:"flex",justifyContent:"center",gap:28,marginTop:14}}>
            <div style={{textAlign:"center"}}><div style={{fontFamily:F.h,fontSize:36,color:X.r}}>30</div><div style={{fontFamily:F.m,fontSize:11,color:X.t}}>REPUBLIC</div></div>
            <div style={{width:1,background:"#444"}}/>
            <div style={{textAlign:"center"}}><div style={{fontFamily:F.h,fontSize:36,color:X.o}}>16</div><div style={{fontFamily:F.m,fontSize:11,color:X.t}}>NORTHERN IRELAND</div></div>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,marginTop:12}}>At this pace, 2026 will exceed 2025. The government's 2030 target requires 72 deaths. We are annualising above 150 in the Republic alone.</div>
        </div>
        {/* Deadliest weekend banner */}
        <div style={{background:"#1a0a0a",border:"1px solid rgba(255,26,26,0.3)",borderRadius:4,padding:"16px 20px",marginBottom:16}}>
          <div style={{fontFamily:F.h,fontSize:18,color:X.r,marginBottom:4}}>DEADLIEST WEEKEND — 22–25 FEB 2026</div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.6}}>Eleven killed in four days across the island. Mia Lily Keogh O'Keeffe (16), hit-and-run, Navan. Brian and Grace Frisby (40s), parents of two, Waterford. Conor Quinn (31), Laura Hoy (23), John Guy (48) — three parents in a single crash, Armagh. Daniel Cullen (18) and Caoimhín Porter-McLoone (18), St Johnston, Donegal. A motorcyclist in Sligo. A woman in Galway. At least 11 children left without a parent.</div>
        </div>
        {/* Incidents */}
        {INCIDENTS.map((inc,i)=>(<div key={i} style={{padding:"14px 16px",background:X.bg,border:`1px solid ${X.br}`,borderLeft:`3px solid ${inc.type==="pedestrian"?X.o:inc.type==="motorcyclist"?X.g:X.r}`,borderRadius:3,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontFamily:F.m,fontSize:10,color:"#bbb"}}>{inc.date} 2026</span>
            <span style={{fontFamily:F.m,fontSize:10,color:inc.type==="pedestrian"?X.o:inc.type==="motorcyclist"?X.g:"#aaa",textTransform:"uppercase"}}>{inc.type}</span></div>
          <div style={{fontFamily:F.b,fontSize:14,color:"#eee"}}>{inc.loc}</div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#bbb",marginTop:4}}>{inc.desc}</div>
        </div>))}
        <div style={{fontFamily:F.m,fontSize:10,color:"#666",textAlign:"center",margin:"8px 0"}}>Selected incidents from media reports. This is not a complete list. Full data from An Garda Síochána and PSNI.</div>
        <div style={{background:X.bg,border:`1px solid ${X.br}`,borderRadius:4,padding:"16px 20px",marginTop:8}}>
          <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginBottom:4}}>CONTEXT</div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.6}}>In 2018, Ireland ranked second safest in Europe for road deaths. By 2024, we had dropped to seventh — with the worst percentage increase of any EU country. Road deaths rose 31% while the EU average fell 12%. Norway has 16 deaths per million. Ireland has 32–34. The difference is not drivers. It is institutional choices.</div>
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
            {/* CHECK YOUR TDs */}
            {(()=>{
              const counties=Object.keys(C2C).sort();
              const getStatusColor=(s)=>s==="meaningful"?X.c:s==="generic"?X.g:X.r;
              const getStatusLabel=(s)=>s==="meaningful"?"COMMITTED":s==="generic"?"ACKNOWLEDGED":"NO RESPONSE";
              const getStatusIcon=(s)=>s==="meaningful"?"✓":s==="generic"?"~":"✗";
              return(<div style={{background:"#111",border:`1px solid ${X.c}`,borderRadius:6,padding:"18px 22px",marginBottom:16}}>
                <div style={{fontFamily:F.h,fontSize:22,color:X.c,marginBottom:4}}>CHECK YOUR TDs</div>
                <div style={{fontFamily:F.b,fontSize:13,color:X.t,marginBottom:12}}>Select your county to see which representatives have committed to road safety reform — and which haven't.</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:lookupCounty?14:0}}>
                  {counties.map(c=>{
                    const isNI=COUNTIES[c]?.j==="NI";
                    return(<button key={c} onClick={()=>setLookupCounty(lookupCounty===c?null:c)} style={{
                      background:lookupCounty===c?X.c:"#1a1a1a",color:lookupCounty===c?"#000":isNI?X.o:"#ccc",
                      border:`1px solid ${lookupCounty===c?X.c:"#333"}`,borderRadius:3,padding:"4px 10px",cursor:"pointer",
                      fontFamily:F.m,fontSize:10,fontWeight:lookupCounty===c?600:400
                    }}>{c}</button>);
                  })}
                </div>
                {lookupCounty&&(()=>{
                  const cons=C2C[lookupCounty]||[];
                  const isNI=COUNTIES[lookupCounty]?.j==="NI";
                  const deaths=COUNTIES[lookupCounty]?.d||0;
                  return(<div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10,marginTop:4}}>
                      <div style={{fontFamily:F.h,fontSize:20,color:"#fff"}}>{lookupCounty.toUpperCase()}</div>
                      <div style={{fontFamily:F.m,fontSize:11,color:X.r}}>{deaths} DEATHS IN 2025</div>
                    </div>
                    {cons.map(con=>{
                      const reps=isNI?MLAS[con]:TDS[con];
                      if(!reps)return null;
                      return(<div key={con} style={{marginBottom:10}}>
                        <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginBottom:4,letterSpacing:"0.1em"}}>{con.toUpperCase()}</div>
                        {reps.map((rep,i)=>{
                          const t=tracked.get(rep.n);
                          const status=t?t.status:"none";
                          const sc=getStatusColor(status);
                          const sl=getStatusLabel(status);
                          const email=makeEmail(rep.n,isNI);
                          const mailto=`mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(isNI?EMAIL_BODY_NI:EMAIL_BODY_ROI)}`;
                          return(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:status==="none"?"rgba(255,26,26,0.04)":"#0a0a0a",border:`1px solid ${status==="none"?"rgba(255,26,26,0.15)":"#222"}`,borderLeft:`3px solid ${sc}`,borderRadius:3,marginBottom:3}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontFamily:F.h,fontSize:16,color:sc,width:16,textAlign:"center"}}>{getStatusIcon(status)}</span>
                              <div>
                                <div style={{fontFamily:F.b,fontSize:13,color:"#fff",fontWeight:500}}>{rep.n}</div>
                                <div style={{fontFamily:F.m,fontSize:10,color:X.l}}>{rep.p} · {isNI?"MLA":"TD"}</div>
                              </div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontFamily:F.m,fontSize:9,padding:"2px 8px",borderRadius:3,background:sc+"18",color:sc,border:`1px solid ${sc}33`}}>{sl}</span>
                              {status==="none"&&<a href={mailto} style={{fontFamily:F.h,fontSize:12,color:X.c,textDecoration:"none",whiteSpace:"nowrap"}}>EMAIL →</a>}
                            </div>
                          </div>);
                        })}
                      </div>);
                    })}
                  </div>);
                })()}
              </div>);
            })()}
            {/* Party breakdown */}
            {meaningful.length>0&&(()=>{
              const parties={};meaningful.forEach(r=>{parties[r.p]=(parties[r.p]||0)+1});
              const partyList=Object.entries(parties).sort((a,b)=>b[1]-a[1]);
              return(<div style={{background:"#0d1a0d",border:`1px solid ${X.g}`,borderRadius:4,padding:"14px 18px",marginBottom:12}}>
                <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:X.g,marginBottom:8}}>{partyList.length} PARTIES BACKING DEMANDS</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {partyList.map(([p,c])=>(<div key={p} style={{fontFamily:F.b,fontSize:13,color:"#fff"}}><strong style={{color:X.g}}>{c}</strong> <span style={{color:X.t}}>{p}</span></div>))}
                </div>
              </div>);
            })()}
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
      {tab==="pqs"&&(()=>{
        const answered=PQS.filter(p=>p.status==="answered"||p.status==="repeat");
        const tabled=PQS.filter(p=>p.status==="tabled");
        return(<div style={{maxWidth:800,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontFamily:F.h,fontSize:44,color:"#fff"}}>PARLIAMENTARY QUESTIONS TRACKER</div>
          <div style={{fontFamily:F.b,fontSize:15,color:X.t,lineHeight:1.6,maxWidth:600,margin:"8px auto 0"}}>
            We asked TDs to table questions. They did. Here's what the Minister revealed — and what he refused to answer.
          </div>
        </div>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:20}}>
          <Stat label="PQs TABLED" value={String(PQS.length)} sub="From campaign" accent={X.c}/>
          <Stat label="ANSWERED" value={String(answered.length)} sub="Responses received" accent={X.g}/>
          <Stat label="AWAITING" value={String(tabled.length)} sub="On the record" accent={X.o}/>
          <Stat label="PARTIES" value={String(new Set(PQS.map(p=>p.p)).size)} sub="Cross-party" accent={X.c}/>
        </div>
        {/* === PATTERN CARDS === */}
        <div style={{fontFamily:F.m,fontSize:11,letterSpacing:"0.15em",color:X.r,marginBottom:10}}>WHAT THE MINISTER'S ANSWERS REVEAL</div>
        {/* Pattern 1: Reform abandoned */}
        <div style={{background:"#1a0a0a",border:"1px solid rgba(255,26,26,0.3)",borderRadius:6,padding:"18px 22px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:20,color:X.r}}>RSA REFORM ABANDONED — NOTHING REPLACED IT</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Ward Q67-68 · 4 Mar</span>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.6,marginBottom:10}}>
            Barry Ward asked why the Minister abandoned the Cabinet-approved plan to split the RSA. Canney's answer, now on the Dáil record:
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:"#fff",lineHeight:1.5,padding:"12px 16px",background:"rgba(255,26,26,0.08)",border:"1px solid rgba(255,26,26,0.2)",borderRadius:4,borderLeft:`3px solid ${X.r}`,marginBottom:8}}>
            "I have decided not to pursue this recommendation as I believe that reform can be delivered more efficiently and effectively within the existing RSA organisational structure."
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5}}>
            His "reforms" so far: fee increases, a communications steering group, new board members. No Commissioner. No lead agency. <strong style={{color:X.r}}>No one accountable for the 2030 target.</strong>
          </div>
        </div>
        {/* Pattern 2: Data referred to RSA */}
        <div style={{background:"#1a0f0a",border:"1px solid rgba(255,107,53,0.3)",borderRadius:6,padding:"18px 22px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:20,color:X.o}}>"ASK THE RSA" — MINISTER WON'T ANSWER HIS OWN BRIEF</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Cairns · Currie · 3–5 Mar</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <div style={{padding:"10px 14px",background:"#0a0a0a",border:"1px solid #222",borderRadius:4}}>
              <div style={{fontFamily:F.b,fontSize:12,color:"#fff"}}>Holly Cairns (SD)</div>
              <div style={{fontFamily:F.b,fontSize:12,color:X.t,marginTop:2}}>Asked: How many died on Cork's roads?</div>
              <div style={{fontFamily:F.h,fontSize:14,color:X.o,marginTop:4}}>→ "REFERRED TO THE RSA"</div>
            </div>
            <div style={{padding:"10px 14px",background:"#0a0a0a",border:"1px solid #222",borderRadius:4}}>
              <div style={{fontFamily:F.b,fontSize:12,color:"#fff"}}>Emer Currie (FG)</div>
              <div style={{fontFamily:F.b,fontSize:12,color:X.t,marginTop:2}}>Asked: How many learner drivers in fatal crashes?</div>
              <div style={{fontFamily:F.h,fontSize:14,color:X.o,marginTop:4}}>→ "REFERRED TO THE RSA"</div>
            </div>
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5}}>
            The Minister for Road Safety was asked basic factual questions about road deaths. He did not answer. He sent them to the body he refused to reform.
          </div>
        </div>
        {/* Pattern 3: NVDF Bill sliding deadlines */}
        <div style={{background:"#0a1a1a",border:"1px solid rgba(78,205,196,0.3)",borderRadius:6,padding:"18px 22px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:20,color:X.c}}>NVDF BILL — THREE DEADLINES AND COUNTING</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Buckley · Whitmore · Currie</span>
          </div>
          <div style={{display:"flex",gap:0,marginBottom:12,position:"relative"}}>
            {[{date:"MAY 2025",promise:"'Enacted by year-end'",who:"Canney to JOC",missed:true},
              {date:"FEB 2026",promise:"'Summer 2026'",who:"Canney to Whitmore",missed:true},
              {date:"MAR 2026",promise:"'Coming weeks'",who:"Canney to Buckley",missed:false},
            ].map((d,i)=>(<div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
              {i>0&&<div style={{position:"absolute",left:0,top:12,width:"50%",height:2,background:d.missed?X.r:"#444"}}/>}
              {i<2&&<div style={{position:"absolute",right:0,top:12,width:"50%",height:2,background:X.r}}/>}
              <div style={{width:24,height:24,borderRadius:"50%",background:d.missed?X.r:"#444",border:`2px solid ${d.missed?X.r:X.c}`,margin:"0 auto",position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {d.missed&&<span style={{color:"#fff",fontSize:12,fontFamily:F.h}}>✗</span>}
              </div>
              <div style={{fontFamily:F.m,fontSize:9,color:d.missed?X.r:X.c,marginTop:6}}>{d.date}</div>
              <div style={{fontFamily:F.b,fontSize:11,color:"#fff",marginTop:2}}>{d.promise}</div>
              <div style={{fontFamily:F.m,fontSize:9,color:"#666",marginTop:1}}>{d.who}</div>
            </div>))}
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5}}>
            Local authority road engineers have been unable to see where crashes are happening on their roads since November 2023. The Data Protection Commission said in April 2024 that GDPR should not prevent sharing this data. The Bill to fix it has missed every deadline.
          </div>
        </div>
        {/* Pattern 4: The data that came out */}
        <div style={{background:"#0a0d1a",border:"1px solid rgba(255,215,0,0.3)",borderRadius:6,padding:"18px 22px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:20,color:X.g}}>FATAL CRASHES ON LOCAL ROADS — UP 50%</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Buckley Q309 · 5 Mar</span>
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,marginBottom:10}}>Pat Buckley extracted collision data the Minister was forced to provide. Fatal crashes on the roads with no safety oversight:</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:80,marginBottom:8}}>
            {[{y:"2019",v:30},{y:"2020",v:33},{y:"2021",v:27},{y:"2022",v:41},{y:"2023",v:40},{y:"2024",v:38},{y:"2025",v:45}].map((d,i)=>{
              const h=(d.v/45)*70;const last=i===6;
              return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span style={{fontFamily:F.m,fontSize:10,color:last?X.r:"#bbb"}}>{d.v}</span>
                <div style={{width:"100%",height:h,background:last?X.r:"#cc2222",borderRadius:2,minHeight:4}}/>
                <span style={{fontFamily:F.m,fontSize:8,color:last?X.r:"#888"}}>{d.y}</span>
              </div>);
            })}
          </div>
          <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginBottom:8}}>FATAL COLLISIONS · LOCAL ROADS · SOURCE: MINISTER'S PQ REPLY</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:3,height:80,marginBottom:8}}>
            {[{y:"2019",v:50},{y:"2020",v:41},{y:"2021",v:46},{y:"2022",v:46},{y:"2023",v:65},{y:"2024",v:56},{y:"2025",v:63}].map((d,i)=>{
              const h=(d.v/65)*70;const last=i===6;
              return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span style={{fontFamily:F.m,fontSize:10,color:last?X.o:"#bbb"}}>{d.v}</span>
                <div style={{width:"100%",height:h,background:last?X.o:"#cc6622",borderRadius:2,minHeight:4}}/>
                <span style={{fontFamily:F.m,fontSize:8,color:last?X.o:"#888"}}>{d.y}</span>
              </div>);
            })}
          </div>
          <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginBottom:8}}>FATAL COLLISIONS · REGIONAL ROADS · SOURCE: MINISTER'S PQ REPLY</div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5}}>
            These are the 94% of Ireland's roads with <strong style={{color:"#fff"}}>no national safety inspection</strong>, no mandatory crash investigation, and — until the NVDF Bill passes — <strong style={{color:"#fff"}}>no access to collision data</strong>.
          </div>
        </div>
        {/* Pattern 5: No interim targets */}
        <div style={{background:"#1a0a0a",border:"1px solid rgba(255,26,26,0.2)",borderRadius:6,padding:"18px 22px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:20,color:X.r}}>164% OFF TARGET — BUT NO INTERIM MILESTONES</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Whitmore Q93 · 26 Feb</span>
          </div>
          <div style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{flex:1,textAlign:"center",padding:"12px",background:"rgba(255,26,26,0.08)",border:"1px solid rgba(255,26,26,0.2)",borderRadius:4}}>
              <div style={{fontFamily:F.h,fontSize:32,color:X.r}}>171</div>
              <div style={{fontFamily:F.m,fontSize:9,color:X.t}}>ACTUAL DEATHS 2024</div>
            </div>
            <div style={{flex:1,textAlign:"center",padding:"12px",background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.2)",borderRadius:4}}>
              <div style={{fontFamily:F.h,fontSize:32,color:X.c}}>122</div>
              <div style={{fontFamily:F.m,fontSize:9,color:X.t}}>TARGET FOR 2024</div>
            </div>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:"#fff",lineHeight:1.5,padding:"10px 14px",background:"rgba(255,26,26,0.05)",border:"1px solid rgba(255,26,26,0.15)",borderRadius:4,borderLeft:`3px solid ${X.r}`}}>
            "I do not believe it would be helpful to set a specific 2027 target when we already have a clear objective for 2030."
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5,marginTop:8}}>
            The 2030 target requires 72 deaths. Actual deaths in 2024 were 171. The Minister will not set waypoints to measure progress. A target without milestones is a wish.
          </div>
        </div>
        {/* === FULL PQ LIST (expandable) === */}
        <div style={{fontFamily:F.m,fontSize:11,letterSpacing:"0.15em",color:X.g,marginBottom:10}}>ALL {PQS.length} PARLIAMENTARY QUESTIONS — CLICK TO EXPAND</div>
        {PQS.map((pq,i)=>{
          const isOpen=expandedPQ===i;
          const sc=pq.status==="answered"?X.g:pq.status==="repeat"?"#888":X.o;
          const sl=pq.status==="answered"?"ANSWERED":pq.status==="repeat"?"REPEAT":"AWAITING";
          return(<div key={`pq${i}`} style={{marginBottom:4}}>
            <div onClick={()=>setExpandedPQ(isOpen?null:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:isOpen?"#1a1a1a":"#0d0d0d",border:`1px solid ${isOpen?"#444":"#222"}`,borderLeft:`3px solid ${sc}`,borderRadius:isOpen?"4px 4px 0 0":4,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                <span style={{fontFamily:F.b,fontSize:13,color:"#fff",fontWeight:500}}>{pq.td}</span>
                <span style={{fontFamily:F.m,fontSize:10,color:X.l}}>{pq.p}</span>
                {pq.status==="answered"&&pq.assessment&&<span style={{fontFamily:F.b,fontSize:11,color:"#888",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pq.assessment.split('.')[0]}</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:F.m,fontSize:9,color:"#666"}}>{pq.date}</span>
                <span style={{fontFamily:F.m,fontSize:9,padding:"2px 8px",borderRadius:3,background:sc+"18",color:sc,border:`1px solid ${sc}33`}}>{sl}</span>
                <span style={{color:"#666",fontSize:12}}>{isOpen?"▾":"▸"}</span>
              </div>
            </div>
            {isOpen&&<div style={{padding:"14px",background:"#0d0d0d",border:"1px solid #444",borderTop:"none",borderRadius:"0 0 4px 4px"}}>
              <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.5,marginBottom:8,padding:"10px 14px",background:"#0a0a0a",border:"1px solid #222",borderRadius:3}}>
                <div style={{fontFamily:F.m,fontSize:9,color:X.c,marginBottom:4}}>QUESTION</div>
                {pq.q}
              </div>
              {pq.response&&<div style={{fontFamily:F.b,fontSize:13,color:"#bbb",lineHeight:1.5,marginBottom:8,padding:"10px 14px",background:"#0a0a0a",border:"1px solid #222",borderRadius:3}}>
                <div style={{fontFamily:F.m,fontSize:9,color:X.o,marginBottom:4}}>MINISTER'S RESPONSE — {pq.minister}</div>
                {pq.response}
              </div>}
              {pq.assessment&&<div style={{fontFamily:F.b,fontSize:12,color:X.r,lineHeight:1.4,padding:"8px 14px",background:"rgba(255,26,26,0.05)",border:"1px solid rgba(255,26,26,0.15)",borderRadius:3}}>
                <span style={{fontFamily:F.m,fontSize:9,color:X.r,marginRight:6}}>ASSESSMENT:</span>{pq.assessment}
              </div>}
            </div>}
          </div>);
        })}
        {/* CTA */}
        <div style={{textAlign:"center",margin:"20px 0"}}>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,marginBottom:8}}>Know a TD who tabled a road safety PQ? Send us the answer.</div>
          <a href="mailto:campaign@stoproaddeaths.ie?subject=PQ%20Answer" style={{fontFamily:F.m,fontSize:12,color:X.c,textDecoration:"none"}}>campaign@stoproaddeaths.ie</a>
        </div>
      </div>);
      })()}
      {tab==="demands"&&(<div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{fontFamily:F.h,fontSize:44,color:"#fff",textAlign:"center",margin:"30px 0 8px"}}>FIVE DEMANDS</div>
        <div style={{fontFamily:F.b,fontSize:15,color:X.t,textAlign:"center",lineHeight:1.6,maxWidth:560,margin:"0 auto 8px"}}>
          Ireland doesn't need more awareness campaigns. It needs structural change with clear ownership. These are five concrete, trackable actions we are asking every TD and MLA to commit to — yes or no.
        </div>
        <div style={{fontFamily:F.m,fontSize:11,color:X.l,textAlign:"center",marginBottom:28}}>
          Based on <a href="https://www.irishtimes.com/opinion/2025/12/03/sinead-osullivan-pr-safety-campaigns-ireland-road-deaths-what-we-must-do/" target="_blank" rel="noopener" style={{color:X.c}}>analysis published in The Irish Times, 3 Dec 2025</a>
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
