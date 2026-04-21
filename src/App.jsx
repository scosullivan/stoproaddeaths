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
  "Carlow–Kilkenny":[{n:"John McGuinness",p:"FF"},{n:"Natasha Newsome Drennan",p:"SF"},{n:"Peter Cleere",p:"FF"},{n:"Catherine Callaghan",p:"FG"},{n:"Jennifer Murnane O'Connor",p:"FF"}],
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
  "Dublin South-Central":[{n:"Catherine Ardagh",p:"FF"},{n:"Máire Devine",p:"SF"},{n:"Jen Cummins",p:"SD"},{n:"Aengus Ó Snodaigh",p:"SF"}],
  "Dublin South-West":[{n:"Seán Crowe",p:"SF"},{n:"John Lahart",p:"FF"},{n:"Ciarán Ahern",p:"Lab"},{n:"Colm Brophy",p:"FG"},{n:"Paul Murphy",p:"PBP"}],
  "Dublin West":[{n:"Jack Chambers",p:"FF"},{n:"Paul Donnelly",p:"SF"},{n:"Emer Currie",p:"FG"},{n:"Ruth Coppinger",p:"PBP"},{n:"Roderic O'Gorman",p:"GP"}],
  "Dún Laoghaire":[{n:"Jennifer Carroll MacNeill",p:"FG"},{n:"Cormac Devlin",p:"FF"},{n:"Richard Boyd Barrett",p:"PBP"},{n:"Barry Ward",p:"FG"}],
  "Galway East":[{n:"Seán Canney",p:"Ind"},{n:"Peter Roche",p:"FG"},{n:"Albert Dolan",p:"FF"},{n:"Louis O'Hara",p:"SF"}],
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
  {date:"15 Mar",loc:"N4, Ballinafid, Co Westmeath",desc:"Man (20s), driver, killed in single-vehicle collision at 12:50am. Pronounced dead at scene.",type:"driver",lat:53.58,lng:-7.42},
  {date:"12 Mar",loc:"N51, Boyerstown, Navan, Co Meath",desc:"Woman (40s), passenger, killed in two-car collision at 7:45am. Teenage girl airlifted to Temple Street with serious injuries. Two other women seriously injured.",type:"passenger",lat:53.68,lng:-6.72},
  {date:"12 Mar",loc:"M3, Dunshaughlin, Co Meath",desc:"Man (40s), van driver, killed in collision with truck at 2am. Pronounced dead at scene.",type:"driver",lat:53.51,lng:-6.54},
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
  {date:"6 Apr",loc:"N53, Rassan, Dundalk, Co Louth",desc:"Man in his 60s killed in two-vehicle collision at 10:15pm. Woman in her 20s also injured. Gardaí appealing for witnesses.",type:"driver",lat:54.04,lng:-6.56},
  {date:"5 Apr",loc:"Castlecat Road, Dervock, Co Antrim",desc:"Man (20), driver, killed in single-vehicle collision (grey BMW) shortly before 1am Easter Sunday. Taken to hospital where he later died.",type:"driver",lat:55.15,lng:-6.37},
  {date:"28 Mar",loc:"R458, Rathfolan, Newmarket on Fergus, Co Clare",desc:"Woman in her 60s, driver, seriously injured in single-vehicle collision at 10:50pm Friday. Taken to University Hospital Limerick. Died Tuesday. Second woman (70s) also injured. Gardaí appealing for witnesses.",type:"driver",lat:52.76,lng:-8.90},
  {date:"30 Mar",loc:"Newry Road, Armagh",desc:"Woman in her 90s killed in two-vehicle collision at 10:30am. Taken to hospital where she later died. PSNI appealing for witnesses and dashcam footage.",type:"driver",lat:54.35,lng:-6.65},
  {date:"17 Mar",loc:"Marble Arch Road, Florencecourt, Co Fermanagh",desc:"Woman (30s) killed in two-vehicle collision (Toyota Yaris and VW Amarok) at 9:55pm. Pronounced dead at scene.",type:"driver",lat:54.27,lng:-7.81},
];
const MO=[{m:"Jan",d:13},{m:"Feb",d:11},{m:"Mar",d:16},{m:"Apr",d:14},{m:"May",d:17},{m:"Jun",d:11},{m:"Jul",d:15},{m:"Aug",d:16},{m:"Sep",d:13},{m:"Oct",d:14},{m:"Nov",d:21},{m:"Dec",d:24}];
const YR=[{y:"2019",r:141,n:55,t:196},{y:"2020",r:149,n:50,t:199},{y:"2021",r:137,n:50,t:187},{y:"2022",r:155,n:62,t:217},{y:"2023",r:184,n:71,t:255},{y:"2024",r:175,n:69,t:244},{y:"2025",r:190,n:57,t:247},{y:"2026*",r:35,n:19,t:54,proj:true,pace:248}];

// TII HD15 High Collision Locations 2022-2024 (CC BY 4.0). Format: [lat,lng,route,county,injuries,riskLevel]
const COLLISIONS=[[53.8601,-6.5415,"N02","Louth",6,1],[53.5655,-6.4451,"N02","Meath",3,1],[53.8836,-6.57,"N02","Louth",2,2],[54.0352,-6.7064,"N02","Monaghan",2,2],[53.6661,-6.5299,"N02","Meath",2,2],[54.2365,-6.8761,"N02","Monaghan",3,1],[53.7728,-6.4893,"N02","Louth",1,2],[53.5713,-6.4485,"N02","Meath",5,1],[53.7958,-6.4886,"N02","Louth",3,1],[53.6383,-6.4965,"N02","Meath",2,2],[54.2834,-6.9658,"N02","Monaghan",3,1],[54.2448,-6.9452,"N02","Monaghan",1,2],[54.0294,-6.7058,"N02","Monaghan",2,2],[53.6211,-6.4858,"N02","Meath",2,2],[54.2574,-6.9526,"N02","Monaghan",1,2],[53.9874,-7.3027,"N03","Cavan",3,1],[54.0489,-7.3824,"N03","Cavan",3,1],[53.7867,-7.0197,"N03","Cavan",2,2],[54.4843,-8.1238,"N03","Donegal",1,2],[54.0553,-7.3863,"N03","Cavan",2,2],[53.9831,-7.2533,"N03","Cavan",2,2],[54.0746,-7.4171,"N03","Cavan",3,1],[53.7764,-7.0038,"N03","Cavan",4,1],[54.4811,-8.1076,"N03","Donegal",2,2],[53.8495,-7.1007,"N03","Cavan",4,1],[53.8076,-7.0409,"N03","Cavan",3,1],[53.8881,-7.1514,"N03","Cavan",4,1],[54.4875,-8.1392,"N03","Donegal",3,1],[53.9842,-7.3334,"N03","Cavan",4,1],[53.7418,-7.7922,"N04","Longford",3,1],[53.9986,-8.2779,"N04","Roscommon",1,2],[54.0517,-8.3405,"N04","Sligo",1,2],[54.0167,-8.3018,"N04","Roscommon",1,2],[53.9848,-8.2802,"N04","Roscommon",1,2],[53.9059,-7.9608,"N04","Leitrim",1,2],[54.0077,-8.2815,"N04","Roscommon",1,2],[53.6741,-7.5551,"N04","Longford",4,1],[54.0564,-8.3443,"N04","Sligo",1,2],[53.7023,-7.6493,"N04","Longford",3,1],[53.9432,-8.0922,"N04","Leitrim",2,2],[53.9886,-8.2815,"N04","Roscommon",2,2],[53.7883,-7.8504,"N04","Longford",2,2],[53.8851,-9.2003,"N05","Mayo",2,2],[53.9284,-8.9558,"N05","Mayo",3,1],[53.7251,-7.8283,"N05","Longford",1,2],[53.8163,-8.3458,"N05","Roscommon",1,2],[53.8518,-8.3903,"N05","Roscommon",1,2],[53.9404,-8.9343,"N05","Mayo",2,2],[53.9527,-8.7169,"N05","Mayo",1,2],[53.9535,-8.7931,"N05","Mayo",3,1],[53.888,-8.4822,"N05","Roscommon",1,2],[53.9509,-8.9106,"N05","Mayo",2,2],[53.8826,-8.4542,"N05","Roscommon",1,2],[53.8621,-8.4012,"N05","Roscommon",2,2],[53.7998,-8.2963,"N05","Roscommon",2,2],[53.9557,-8.7626,"N05","Mayo",1,2],[53.9434,-8.6792,"N05","Mayo",1,2],[53.9332,-8.9448,"N05","Mayo",5,1],[53.9132,-9.0088,"N05","Mayo",2,2],[53.7736,-8.1249,"N05","Roscommon",2,2],[53.8136,-8.3366,"N05","Roscommon",1,2],[53.7899,-8.2741,"N05","Roscommon",1,2],[51.8998,-8.4659,"N08","Cork",4,1],[51.9005,-8.4654,"N08","Cork",4,1],[52.6258,-7.2508,"N10","Kilkenny",3,1],[52.6358,-7.2444,"N10","Kilkenny",4,1],[52.5949,-7.2418,"N10","Kilkenny",2,2],[52.6457,-7.2305,"N10","Kilkenny",1,2],[52.4138,-6.5246,"N11","Wexford",4,1],[52.4092,-6.5215,"N11","Wexford",3,1],[52.3784,-6.5199,"N11","Wexford",3,1],[54.2664,-6.9357,"N12","Monaghan",1,2],[54.2736,-6.8735,"N12","Monaghan",1,2],[54.2644,-6.8986,"N12","Monaghan",1,2],[54.2678,-6.923,"N12","Monaghan",1,2],[54.2713,-6.8819,"N12","Monaghan",1,2],[54.2613,-6.9506,"N12","Monaghan",2,2],[54.2679,-6.9097,"N12","Monaghan",2,2],[55.0426,-7.3835,"N13","Donegal",6,1],[54.8648,-7.7517,"N13","Donegal",3,1],[54.8476,-7.7513,"N13","Donegal",3,1],[54.8079,-7.7678,"N13","Donegal",5,1],[54.9832,-7.5592,"N13","Donegal",5,1],[54.9424,-7.6959,"N13","Donegal",1,2],[54.919,-7.6967,"N13","Donegal",2,2],[54.854,-7.5061,"N14","Donegal",1,2],[54.8687,-7.526,"N14","Donegal",2,2],[54.937,-7.614,"N14","Donegal",2,2],[54.9195,-7.5832,"N14","Donegal",2,2],[54.8699,-7.514,"N14","Donegal",1,2],[54.9123,-7.5781,"N14","Donegal",4,1],[54.8006,-7.5801,"N15","Donegal",1,2],[54.4355,-8.4423,"N15","Sligo",6,1],[54.8021,-7.7742,"N15","Donegal",4,1],[54.5783,-8.1293,"N15","Donegal",2,2],[54.4204,-8.4751,"N15","Sligo",2,2],[54.7896,-7.8162,"N15","Donegal",2,2],[54.5915,-8.1408,"N15","Donegal",2,2],[54.6616,-8.0801,"N15","Donegal",1,2],[54.497,-8.1839,"N15","Donegal",2,2],[54.6689,-8.0609,"N15","Donegal",3,1],[54.8166,-7.5108,"N15","Donegal",1,2],[54.487,-8.2227,"N15","Donegal",1,2],[54.5828,-8.1325,"N15","Donegal",2,2],[54.6154,-8.0904,"N15","Donegal",4,1],[54.7982,-7.5431,"N15","Donegal",2,2],[54.4531,-8.4034,"N15","Sligo",2,2],[54.3228,-8.3332,"N16","Leitrim",3,1],[54.3023,-8.1546,"N16","Leitrim",1,2],[54.2778,-8.4744,"N16","Sligo",3,1],[54.3229,-8.3136,"N16","Leitrim",1,2],[54.3266,-8.344,"N16","Leitrim",1,2],[54.283,-7.9745,"N16","Leitrim",1,2],[54.2936,-8.4401,"N16","Sligo",1,2],[54.3024,-8.1664,"N16","Leitrim",1,2],[54.2869,-7.9237,"N16","Cavan",1,2],[54.2773,-8.458,"N16","Sligo",2,2],[54.071,-8.7072,"N17","Sligo",2,2],[53.8709,-8.8471,"N17","Mayo",2,2],[53.6219,-8.9151,"N17","Galway",2,2],[53.7985,-8.9222,"N17","Mayo",3,1],[54.0198,-8.7555,"N17","Sligo",2,2],[53.699,-8.9776,"N17","Mayo",3,1],[54.0516,-8.7355,"N17","Sligo",5,1],[53.9619,-8.7937,"N17","Mayo",4,1],[54.0921,-8.6728,"N17","Sligo",2,2],[53.8621,-8.855,"N17","Mayo",4,1],[53.7549,-8.9649,"N17","Mayo",5,1],[53.8865,-8.8022,"N17","Mayo",1,2],[54.0464,-8.7381,"N17","Sligo",2,2],[53.7376,-8.9721,"N17","Mayo",2,2],[54.1283,-8.5737,"N17","Sligo",2,2],[52.3832,-8.6824,"N20","Limerick",2,2],[52.5853,-8.721,"N20","Limerick",1,2],[52.2156,-8.67,"N20","Cork",4,1],[52.2567,-8.6645,"N20","Cork",2,2],[52.3693,-8.6826,"N20","Cork",2,2],[52.3266,-8.6706,"N20","Cork",4,1],[51.9879,-8.5876,"N20","Cork",7,1],[52.3489,-8.6766,"N20","Cork",6,1],[52.4284,-8.6911,"N20","Limerick",2,2],[52.4707,-8.6977,"N20","Limerick",1,2],[52.2421,-9.5106,"N21","Kerry",2,2],[52.315,-9.3604,"N21","Kerry",2,2],[52.5266,-8.9434,"N21","Limerick",2,2],[52.4509,-9.0471,"N21","Limerick",9,1],[52.2165,-9.4828,"N23","Kerry",2,2],[52.6471,-8.5635,"N24","Limerick",2,2],[52.4563,-8.1223,"N24","Tipperary",2,2],[52.3634,-7.5605,"N24","Tipperary",3,1],[52.4926,-8.1976,"N24","Tipperary",3,1],[52.2903,-7.2406,"N24","Kilkenny",1,2],[52.5053,-8.2195,"N24","Tipperary",3,1],[52.453,-8.0704,"N24","Tipperary",1,2],[52.3737,-7.8073,"N24","Tipperary",2,2],[52.4524,-8.0966,"N24","Tipperary",2,2],[52.29,-7.2308,"N24","Kilkenny",3,1],[52.4118,-7.9759,"N24","Tipperary",4,1],[52.3493,-7.3987,"N24","Tipperary",4,1],[52.4738,-8.1557,"N24","Tipperary",5,1],[52.0941,-7.6146,"N25","Waterford",4,1],[52.0088,-7.7056,"N25","Waterford",2,2],[51.9374,-7.9525,"N25","Cork",7,1],[52.2585,-6.4332,"N25","Wexford",1,2],[52.3375,-6.5216,"N25","Wexford",4,1],[51.9394,-7.9052,"N25","Cork",1,2],[52.2432,-6.3887,"N25","Wexford",2,2],[52.2382,-7.281,"N25","Waterford",2,2],[52.0877,-7.641,"N25","Waterford",1,2],[51.9155,-8.0955,"N25","Cork",3,1],[52.362,-6.7652,"N25","Wexford",2,2],[52.1205,-7.5636,"N25","Waterford",2,2],[51.9741,-7.7805,"N25","Waterford",2,2],[52.3328,-6.511,"N25","Wexford",3,1],[52.2341,-7.3075,"N25","Waterford",2,2],[52.0538,-7.6654,"N25","Waterford",2,2],[51.987,-7.7474,"N25","Waterford",4,1],[52.2535,-6.418,"N25","Wexford",1,2],[51.9779,-7.8598,"N25","Waterford",2,2],[52.2265,-7.3391,"N25","Waterford",2,2],[51.9425,-7.8944,"N25","Cork",3,1],[52.0932,-7.6306,"N25","Waterford",3,1],[52.1898,-7.4597,"N25","Waterford",2,2],[52.3659,-6.8181,"N25","Wexford",2,2],[52.324,-6.5022,"N25","Wexford",3,1],[51.9129,-8.151,"N25","Cork",8,1],[53.9667,-9.0309,"N26","Mayo",1,2],[53.944,-8.9401,"N26","Mayo",2,2],[53.984,-9.1038,"N26","Mayo",2,2],[53.9868,-9.0752,"N26","Mayo",1,2],[54.0913,-9.1665,"N26","Mayo",2,2],[53.9582,-8.9931,"N26","Mayo",1,2],[51.8322,-8.3889,"N28","Cork",2,2],[51.8333,-8.3415,"N28","Cork",1,2],[51.835,-8.3735,"N28","Cork",3,1],[52.28,-7.0594,"N29","Kilkenny",1,2],[52.4814,-6.6512,"N30","Wexford",1,2],[52.4545,-6.7044,"N30","Wexford",1,2],[52.4367,-6.7388,"N30","Wexford",6,1],[52.4925,-6.6254,"N30","Wexford",1,2],[52.5294,-6.5784,"N30","Wexford",2,2],[52.4583,-6.6938,"N30","Wexford",3,1],[52.442,-6.7322,"N30","Wexford",2,2],[53.8593,-6.4341,"N33","Louth",3,1],[53.8643,-6.5403,"N33","Louth",3,1],[53.6074,-6.9748,"N51","Meath",4,1],[53.7256,-6.4052,"N51","Louth",1,2],[53.6553,-6.6926,"N51","Meath",2,2],[53.6374,-6.8935,"N51","Meath",1,2],[53.7123,-6.565,"N51","Meath",1,2],[53.6876,-6.6231,"N51","Meath",2,2],[53.7261,-6.4209,"N51","Louth",1,2],[53.6305,-6.7505,"N51","Meath",2,2],[53.7125,-6.4866,"N51","Meath",1,2],[53.6465,-6.8626,"N51","Meath",1,2],[53.7179,-6.46,"N51","Louth",1,2],[53.6323,-6.8979,"N51","Meath",2,2],[53.6402,-6.8344,"N51","Meath",1,2],[53.6577,-6.6862,"N51","Meath",2,2],[53.6132,-7.0713,"N51","Westmeath",1,2],[53.7229,-6.4313,"N51","Louth",2,2],[53.6067,-6.9987,"N51","Westmeath",1,2],[53.6706,-6.9673,"N52","Meath",1,2],[53.1682,-7.7608,"N52","Offaly",1,2],[53.6997,-6.9296,"N52","Meath",2,2],[53.7235,-6.8976,"N52","Meath",1,2],[53.2396,-7.5827,"N52","Offaly",2,2],[52.8553,-8.2356,"N52","Tipperary",1,2],[53.8459,-6.6012,"N52","Meath",6,1],[53.484,-7.3455,"N52","Westmeath",1,2],[52.8835,-8.1959,"N52","Tipperary",2,2],[53.1821,-7.7082,"N52","Offaly",1,2],[53.0097,-8.0479,"N52","Tipperary",1,2],[53.6202,-7.0855,"N52","Westmeath",1,2],[53.5865,-7.1322,"N52","Westmeath",2,2],[53.5354,-7.3103,"N52","Westmeath",2,2],[53.227,-7.6201,"N52","Offaly",1,2],[53.6427,-7.0359,"N52","Westmeath",2,2],[53.2104,-7.6566,"N52","Offaly",2,2],[53.0944,-7.9084,"N52","Offaly",3,1],[53.7872,-6.734,"N52","Meath",4,1],[53.6248,-7.0636,"N52","Westmeath",1,2],[53.4749,-7.3559,"N52","Westmeath",1,2],[52.8778,-8.2077,"N52","Tipperary",2,2],[53.2649,-7.4637,"N52","Offaly",2,2],[53.7317,-6.8922,"N52","Meath",2,2],[53.8206,-6.6444,"N52","Meath",2,2],[53.6657,-6.9979,"N52","Westmeath",1,2],[53.6879,-6.9516,"N52","Meath",1,2],[53.771,-6.8174,"N52","Meath",1,2],[53.1878,-7.6997,"N52","Offaly",1,2],[52.9702,-8.135,"N52","Tipperary",2,2],[53.3888,-7.3632,"N52","Westmeath",2,2],[54.146,-7.316,"N54","Monaghan",1,2],[54.1786,-7.2328,"N54","Monaghan",3,1],[54.0555,-7.3753,"N54","Cavan",3,1],[54.0966,-7.3694,"N54","Cavan",2,2],[54.1899,-7.2017,"N54","Monaghan",1,2],[54.1855,-7.2143,"N54","Monaghan",1,2],[54.1948,-7.1888,"N54","Monaghan",1,2],[53.5722,-7.7553,"N55","Longford",2,2],[53.4589,-7.8779,"N55","Westmeath",4,1],[53.5832,-7.7302,"N55","Longford",1,2],[53.8117,-7.4562,"N55","Cavan",1,2],[53.8973,-7.4451,"N55","Cavan",1,2],[53.9648,-7.3566,"N55","Cavan",2,2],[53.5745,-7.744,"N55","Longford",1,2],[53.51,-7.8267,"N55","Westmeath",3,1],[53.6868,-7.6288,"N55","Longford",1,2],[53.7521,-7.526,"N55","Longford",1,2],[53.824,-7.4457,"N55","Cavan",1,2],[53.7987,-7.4623,"N55","Longford",2,2],[53.506,-7.8351,"N55","Westmeath",2,2],[53.7109,-7.5851,"N55","Longford",3,1],[53.8539,-7.4451,"N55","Cavan",1,2],[53.7571,-7.5179,"N55","Longford",1,2],[53.6368,-7.6773,"N55","Longford",1,2],[53.6683,-7.638,"N55","Longford",1,2],[53.9439,-7.3841,"N55","Cavan",2,2],[53.6128,-7.7069,"N55","Longford",1,2],[53.9817,-7.3391,"N55","Cavan",4,1],[53.7184,-7.5741,"N55","Longford",1,2],[55.1347,-8.1248,"N56","Donegal",1,2],[54.9656,-7.7306,"N56","Donegal",3,1],[55.0906,-7.881,"N56","Donegal",1,2],[54.9703,-8.3386,"N56","Donegal",2,2],[54.8686,-8.307,"N56","Donegal",1,2],[55.0493,-8.2265,"N56","Donegal",1,2],[55.0725,-7.861,"N56","Donegal",1,2],[54.699,-8.4039,"N56","Donegal",1,2],[54.9488,-7.7155,"N56","Donegal",6,1],[54.6333,-8.3845,"N56","Donegal",1,2],[55.1825,-7.9743,"N56","Donegal",1,2],[54.6839,-8.4046,"N56","Donegal",1,2],[55.0535,-7.823,"N56","Donegal",1,2],[55.1369,-7.9147,"N56","Donegal",2,2],[54.964,-7.7192,"N56","Donegal",1,2],[54.9776,-8.324,"N56","Donegal",1,2],[55.0132,-8.2726,"N56","Donegal",1,2],[55.0041,-8.2828,"N56","Donegal",1,2],[54.7865,-8.302,"N56","Donegal",2,2],[55.1374,-8.0977,"N56","Donegal",1,2],[55.136,-8.1118,"N56","Donegal",2,2],[54.6549,-8.2828,"N56","Donegal",3,1],[54.6539,-8.1356,"N56","Donegal",3,1],[54.7663,-8.3683,"N56","Donegal",3,1],[54.6405,-8.3893,"N56","Donegal",1,2],[55.1777,-7.9458,"N56","Donegal",1,2],[54.6409,-8.3273,"N56","Donegal",1,2],[54.6465,-8.1858,"N56","Donegal",2,2],[55.1709,-7.9223,"N56","Donegal",2,2],[55.0904,-8.148,"N56","Donegal",1,2],[55.0796,-7.8659,"N56","Donegal",1,2],[55.044,-7.8081,"N56","Donegal",4,1],[54.936,-8.3266,"N56","Donegal",1,2],[55.1514,-8.0432,"N56","Donegal",1,2],[54.8341,-8.338,"N56","Donegal",1,2],[54.6311,-8.3685,"N56","Donegal",1,2],[55.1088,-7.9086,"N56","Donegal",1,2],[54.9604,-7.7119,"N56","Donegal",1,2],[54.9577,-7.709,"N56","Donegal",3,1],[54.6516,-8.2267,"N56","Donegal",1,2],[55.1437,-8.0855,"N56","Donegal",2,2],[54.9504,-8.3581,"N56","Donegal",2,2],[55.1226,-8.1322,"N56","Donegal",2,2],[53.897,-9.1488,"N58","Mayo",2,2],[53.9233,-9.1294,"N58","Mayo",1,2],[53.9043,-9.1358,"N58","Mayo",2,2],[54.1189,-9.1801,"N59","Mayo",2,2],[53.5235,-10.0483,"N59","Galway",1,2],[53.5439,-9.9974,"N59","Galway",1,2],[53.4208,-9.3932,"N59","Galway",1,2],[53.4699,-9.8396,"N59","Galway",1,2],[53.5669,-9.8235,"N59","Galway",1,2],[54.2205,-8.973,"N59","Sligo",1,2],[53.3792,-9.2498,"N59","Galway",4,1],[54.1441,-9.7429,"N59","Mayo",1,2],[54.1102,-9.7592,"N59","Mayo",1,2],[53.4854,-9.9816,"N59","Galway",1,2],[53.5944,-9.7017,"N59","Galway",1,2],[53.4407,-9.4552,"N59","Galway",1,2],[53.4532,-9.5243,"N59","Galway",1,2],[54.2388,-8.7626,"N59","Sligo",1,2],[54.1169,-9.1548,"N59","Mayo",5,1],[53.4256,-9.4172,"N59","Galway",2,2],[54.2408,-8.6872,"N59","Sligo",1,2],[53.5471,-9.9718,"N59","Galway",1,2],[53.4138,-9.2873,"N59","Galway",2,2],[53.4624,-9.8001,"N59","Galway",1,2],[53.907,-9.6675,"N59","Mayo",1,2],[54.0172,-9.825,"N59","Mayo",1,2],[54.2314,-8.9449,"N59","Sligo",1,2],[54.2186,-8.5033,"N59","Sligo",2,2],[53.4812,-9.941,"N59","Galway",1,2],[53.3036,-9.1074,"N59","Galway",3,1],[53.8952,-9.5529,"N59","Mayo",1,2],[53.5632,-9.8388,"N59","Galway",1,2],[53.4285,-9.3196,"N59","Galway",4,1],[53.4669,-9.825,"N59","Galway",1,2],[53.5163,-10.0408,"N59","Galway",1,2],[54.2436,-8.8088,"N59","Sligo",1,2],[53.9022,-9.62,"N59","Mayo",1,2],[54.1837,-9.0411,"N59","Sligo",1,2],[53.4986,-10.0261,"N59","Galway",2,2],[53.8036,-9.521,"N59","Mayo",2,2],[53.452,-9.5813,"N59","Galway",1,2],[53.9055,-9.7534,"N59","Mayo",3,1],[54.113,-9.1592,"N59","Mayo",3,1],[53.5727,-9.8067,"N59","Galway",1,2],[53.5603,-9.8791,"N59","Galway",1,2],[53.4572,-9.6637,"N59","Galway",1,2],[53.4705,-9.8538,"N59","Galway",1,2],[53.4669,-9.7286,"N59","Galway",1,2],[53.5436,-9.9803,"N59","Galway",2,2],[54.202,-8.5734,"N59","Sligo",2,2],[54.1202,-9.2801,"N59","Mayo",1,2],[54.0968,-9.3425,"N59","Mayo",1,2],[53.9843,-9.7996,"N59","Mayo",1,2],[54.2253,-8.6314,"N59","Sligo",1,2],[53.4249,-9.3653,"N59","Galway",1,2],[54.1221,-9.5943,"N59","Mayo",1,2],[53.465,-9.8158,"N59","Galway",2,2],[53.4236,-9.307,"N59","Galway",1,2],[54.2367,-8.6719,"N59","Sligo",1,2],[54.1801,-9.0477,"N59","Sligo",1,2],[53.4913,-10.0197,"N59","Galway",2,2],[53.9619,-9.796,"N59","Mayo",1,2],[54.1208,-9.2523,"N59","Mayo",1,2],[54.2065,-8.5442,"N59","Sligo",1,2],[53.5994,-9.7288,"N59","Galway",1,2],[53.3154,-9.1509,"N59","Galway",4,1],[53.7457,-8.4756,"N60","Roscommon",1,2],[53.6387,-8.1955,"N60","Roscommon",2,2],[53.7623,-8.5381,"N60","Roscommon",1,2],[53.69,-8.4191,"N60","Roscommon",1,2],[53.7698,-9.0573,"N60","Mayo",2,2],[53.7373,-9.008,"N60","Mayo",1,2],[53.6643,-8.296,"N60","Roscommon",1,2],[53.7237,-8.9661,"N60","Mayo",1,2],[53.85,-9.2894,"N60","Mayo",1,2],[53.7579,-8.6974,"N60","Mayo",1,2],[53.8145,-9.1577,"N60","Mayo",2,2],[53.7199,-8.9361,"N60","Mayo",1,2],[53.7412,-8.8479,"N60","Mayo",1,2],[53.755,-8.4816,"N60","Roscommon",1,2],[53.6611,-8.2789,"N60","Roscommon",3,1],[53.7235,-8.9537,"N60","Mayo",1,2],[53.8472,-9.2441,"N60","Mayo",2,2],[53.6536,-8.2564,"N60","Roscommon",1,2],[53.6925,-8.4324,"N60","Roscommon",1,2],[53.7725,-8.2496,"N61","Roscommon",2,2],[53.7084,-8.2068,"N61","Roscommon",2,2],[53.6319,-8.1838,"N61","Roscommon",1,2],[53.8398,-8.2209,"N61","Roscommon",2,2],[53.6068,-8.127,"N61","Roscommon",2,2],[53.9023,-8.2578,"N61","Roscommon",1,2],[53.7347,-8.2172,"N61","Roscommon",2,2],[53.7402,-8.2247,"N61","Roscommon",2,2],[53.8934,-8.2507,"N61","Roscommon",1,2],[53.4526,-7.99,"N61","Roscommon",1,2],[53.4461,-7.9811,"N61","Roscommon",2,2],[53.831,-8.2223,"N61","Roscommon",1,2],[53.9653,-8.3012,"N61","Roscommon",2,2],[52.699,-7.8203,"N62","Tipperary",1,2],[52.7386,-7.841,"N62","Tipperary",1,2],[52.9336,-7.7875,"N62","Tipperary",1,2],[53.3261,-7.8219,"N62","Offaly",1,2],[53.0247,-7.8897,"N62","Offaly",1,2],[53.2239,-7.8844,"N62","Offaly",3,1],[53.4023,-7.8788,"N62","Westmeath",2,2],[52.9492,-7.7924,"N62","Tipperary",1,2],[52.9693,-7.8214,"N62","Tipperary",1,2],[53.1546,-7.884,"N62","Offaly",1,2],[53.301,-7.8179,"N62","Offaly",1,2],[52.7737,-7.8397,"N62","Tipperary",1,2],[53.2746,-7.8266,"N62","Offaly",3,1],[52.692,-7.8113,"N62","Tipperary",1,2],[52.9015,-7.7975,"N62","Tipperary",1,2],[53.0158,-7.8926,"N62","Offaly",1,2],[53.2924,-7.8173,"N62","Offaly",1,2],[53.3337,-7.8223,"N62","Offaly",1,2],[53.1482,-7.8854,"N62","Offaly",1,2],[52.6811,-7.8153,"N62","Tipperary",3,1],[52.7231,-7.8335,"N62","Tipperary",1,2],[53.6519,-8.1127,"N63","Roscommon",1,2],[53.5039,-8.4611,"N63","Galway",2,2],[53.5721,-8.2474,"N63","Roscommon",1,2],[53.4785,-8.6107,"N63","Galway",1,2],[53.509,-8.3687,"N63","Galway",1,2],[53.4844,-8.4873,"N63","Galway",1,2],[53.7268,-7.8012,"N63","Longford",6,1],[53.4845,-8.5885,"N63","Galway",2,2],[53.5123,-8.4115,"N63","Galway",1,2],[53.5144,-8.352,"N63","Galway",1,2],[53.6656,-8.0595,"N63","Roscommon",2,2],[53.6485,-8.1255,"N63","Roscommon",4,1],[53.4731,-8.6307,"N63","Galway",1,2],[53.6728,-8.0313,"N63","Roscommon",1,2],[53.7275,-7.7938,"N63","Longford",1,2],[53.6633,-8.0685,"N63","Roscommon",2,2],[53.525,-8.2858,"N63","Galway",1,2],[53.6355,-8.1765,"N63","Roscommon",2,2],[53.1655,-8.2904,"N65","Galway",3,1],[53.2121,-8.4959,"N65","Galway",2,2],[53.1509,-8.261,"N65","Galway",1,2],[53.0316,-8.1366,"N65","Tipperary",1,2],[53.1703,-8.3187,"N65","Galway",2,2],[53.2086,-8.5188,"N65","Galway",1,2],[53.2002,-8.4542,"N65","Galway",2,2],[53.1232,-8.2434,"N65","Galway",1,2],[53.0041,-8.1252,"N65","Tipperary",1,2],[53.2016,-8.4656,"N65","Galway",1,2],[52.7214,-9.585,"N67","Clare",1,2],[52.8545,-9.4021,"N67","Clare",2,2],[53.1368,-9.1029,"N67","Clare",1,2],[53.1085,-9.155,"N67","Clare",1,2],[52.8352,-9.4305,"N67","Clare",1,2],[52.6727,-9.5652,"N67","Clare",1,2],[52.6493,-9.5079,"N67","Clare",1,2],[52.7949,-9.4447,"N67","Clare",1,2],[53.1404,-8.9638,"N67","Galway",1,2],[53.2805,-8.9742,"N67","Galway",2,2],[53.0579,-9.2076,"N67","Clare",1,2],[53.1203,-9.1391,"N67","Clare",1,2],[52.6735,-9.5912,"N67","Clare",2,2],[53.1416,-9.0047,"N67","Galway",1,2],[52.7164,-9.5889,"N67","Clare",1,2],[53.0995,-9.1659,"N67","Clare",1,2],[52.9385,-9.3179,"N67","Clare",3,1],[52.6744,-9.544,"N67","Clare",2,2],[52.8571,-9.4017,"N67","Clare",1,2],[53.2101,-8.8694,"N67","Galway",4,1],[53.0535,-9.2183,"N67","Clare",1,2],[52.676,-9.6232,"N67","Clare",1,2],[53.1919,-8.8951,"N67","Galway",2,2],[53.1315,-9.0966,"N67","Clare",1,2],[52.626,-9.4699,"N67","Clare",1,2],[52.8396,-9.4271,"N67","Clare",1,2],[52.6721,-9.5803,"N67","Clare",1,2],[52.6834,-9.6433,"N67","Clare",1,2],[52.7482,-9.4791,"N67","Clare",1,2],[52.9575,-9.2853,"N67","Clare",1,2],[53.2042,-8.8747,"N67","Galway",3,1],[53.1505,-9.0594,"N67","Clare",1,2],[52.6741,-9.6061,"N67","Clare",1,2],[52.6424,-9.4895,"N67","Clare",2,2],[52.7311,-9.5229,"N67","Clare",1,2],[52.7243,-9.5676,"N67","Clare",1,2],[52.7017,-9.3038,"N68","Clare",1,2],[52.6658,-9.4072,"N68","Clare",1,2],[52.794,-9.0642,"N68","Clare",2,2],[52.6542,-9.4445,"N68","Clare",1,2],[52.6604,-9.42,"N68","Clare",1,2],[52.6412,-9.482,"N68","Clare",2,2],[52.7337,-9.1873,"N68","Clare",2,2],[52.8144,-9.019,"N68","Clare",2,2],[52.7213,-9.2232,"N68","Clare",1,2],[52.698,-9.3345,"N68","Clare",3,1],[52.6725,-9.3925,"N68","Clare",1,2],[52.5094,-9.3945,"N69","Kerry",1,2],[52.6055,-8.971,"N69","Limerick",1,2],[52.596,-9.1914,"N69","Limerick",2,2],[52.6102,-9.1331,"N69","Limerick",1,2],[52.6104,-8.9034,"N69","Limerick",3,1],[52.6061,-9.014,"N69","Limerick",2,2],[52.4122,-9.5123,"N69","Kerry",2,2],[52.6038,-8.9473,"N69","Limerick",2,2],[52.5684,-9.3511,"N69","Limerick",2,2],[52.6212,-8.7788,"N69","Limerick",2,2],[52.4482,-9.4695,"N69","Kerry",1,2],[52.5982,-9.0911,"N69","Limerick",1,2],[52.5614,-9.3768,"N69","Kerry",1,2],[52.5701,-9.3161,"N69","Limerick",1,2],[52.4536,-9.4391,"N69","Kerry",4,1],[52.6239,-8.826,"N69","Limerick",2,2],[52.5383,-9.3837,"N69","Kerry",1,2],[52.4916,-9.4049,"N69","Kerry",1,2],[52.5942,-9.0647,"N69","Limerick",1,2],[52.3822,-9.5497,"N69","Kerry",2,2],[52.5904,-9.2248,"N69","Limerick",2,2],[52.4473,-9.4828,"N69","Kerry",2,2],[52.5717,-9.2861,"N69","Limerick",1,2],[52.6423,-8.6786,"N69","Limerick",4,1],[52.2296,-9.6586,"N70","Kerry",1,2],[52.1985,-9.675,"N70","Kerry",3,1],[51.9602,-10.185,"N70","Kerry",2,2],[51.831,-9.8234,"N70","Kerry",1,2],[52.0702,-9.892,"N70","Kerry",1,2],[52.0956,-9.8358,"N70","Kerry",1,2],[51.8226,-9.8779,"N70","Kerry",1,2],[51.8913,-10.2242,"N70","Kerry",1,2],[51.8762,-9.6376,"N70","Kerry",1,2],[51.9157,-10.2379,"N70","Kerry",1,2],[51.7726,-10.1286,"N70","Kerry",1,2],[51.8521,-9.7434,"N70","Kerry",1,2],[51.8806,-9.6115,"N70","Kerry",1,2],[51.8468,-10.1744,"N70","Kerry",1,2],[51.8668,-9.6809,"N70","Kerry",2,2],[52.038,-9.9702,"N70","Kerry",1,2],[51.8099,-10.1567,"N70","Kerry",1,2],[51.9405,-10.2371,"N70","Kerry",2,2],[52.2025,-9.6678,"N70","Kerry",1,2],[51.9664,-10.1717,"N70","Kerry",2,2],[51.771,-10.0637,"N70","Kerry",2,2],[52.0085,-10.097,"N70","Kerry",1,2],[52.1083,-9.7859,"N70","Kerry",4,1],[51.9829,-10.1496,"N70","Kerry",1,2],[51.7724,-10.1425,"N70","Kerry",1,2],[51.8183,-9.8714,"N70","Kerry",3,1],[52.2262,-9.6491,"N70","Kerry",1,2],[51.8524,-9.7471,"N70","Kerry",1,2],[52.0916,-9.8465,"N70","Kerry",1,2],[51.9279,-10.2413,"N70","Kerry",1,2],[52.1264,-9.7605,"N70","Kerry",2,2],[51.8378,-9.8991,"N70","Kerry",1,2],[51.855,-9.7316,"N70","Kerry",1,2],[51.9474,-10.2227,"N70","Kerry",2,2],[51.9099,-10.2322,"N70","Kerry",3,1],[52.0814,-9.8733,"N70","Kerry",1,2],[51.8768,-10.1977,"N70","Kerry",1,2],[52.0169,-10.0957,"N70","Kerry",1,2],[51.8693,-9.668,"N70","Kerry",1,2],[52.1762,-9.7,"N70","Kerry",1,2],[51.8831,-9.5923,"N70","Kerry",1,2],[51.6802,-9.4513,"N71","Cork",3,1],[51.8536,-9.522,"N71","Kerry",2,2],[51.5478,-9.3162,"N71","Cork",1,2],[52.0134,-9.4965,"N71","Kerry",1,2],[51.9226,-9.6305,"N71","Kerry",1,2],[51.5713,-9.0121,"N71","Cork",2,2],[51.5621,-9.2342,"N71","Cork",1,2],[51.7367,-9.5075,"N71","Cork",1,2],[51.6747,-9.4744,"N71","Cork",2,2],[51.9091,-9.6145,"N71","Kerry",1,2],[51.5719,-9.171,"N71","Cork",1,2],[52.057,-9.5128,"N71","Kerry",2,2],[52.0222,-9.4929,"N71","Kerry",1,2],[51.58,-9.1457,"N71","Cork",2,2],[51.5646,-9.2075,"N71","Cork",2,2],[51.5925,-9.0851,"N71","Cork",2,2],[51.6568,-9.4636,"N71","Cork",3,1],[51.6234,-8.8818,"N71","Cork",4,1],[51.5469,-9.3659,"N71","Cork",1,2],[52.0057,-9.5077,"N71","Kerry",1,2],[51.811,-9.5594,"N71","Kerry",2,2],[51.9162,-9.6214,"N71","Kerry",1,2],[51.6419,-8.8697,"N71","Cork",4,1],[51.9669,-9.5963,"N71","Kerry",1,2],[51.6184,-8.9166,"N71","Cork",2,2],[51.5593,-9.244,"N71","Cork",1,2],[51.6431,-9.4527,"N71","Cork",1,2],[51.9418,-9.6513,"N71","Kerry",1,2],[51.5637,-9.4548,"N71","Cork",1,2],[51.5786,-9.1564,"N71","Cork",1,2],[52.0526,-9.5068,"N71","Kerry",4,1],[51.7309,-8.8152,"N71","Cork",3,1],[51.6948,-9.4394,"N71","Cork",2,2],[51.8699,-9.5728,"N71","Kerry",1,2],[52.1101,-8.0594,"N72","Cork",1,2],[52.051,-9.4555,"N72","Kerry",1,2],[52.1382,-8.9064,"N72","Cork",4,1],[52.1255,-8.1604,"N72","Cork",1,2],[52.0503,-9.4345,"N72","Kerry",1,2],[52.1546,-8.5783,"N72","Cork",1,2],[52.1421,-8.3595,"N72","Cork",1,2],[52.1336,-8.6956,"N72","Cork",2,2],[52.1444,-8.8513,"N72","Cork",1,2],[52.1421,-8.277,"N72","Cork",6,1],[52.0501,-9.4172,"N72","Kerry",1,2],[52.1479,-8.6349,"N72","Cork",3,1],[52.1266,-8.987,"N72","Cork",2,2],[52.1086,-7.637,"N72","Waterford",3,1],[52.1415,-8.3012,"N72","Cork",1,2],[52.0869,-9.6828,"N72","Kerry",2,2],[52.1431,-8.3742,"N72","Cork",1,2],[52.1361,-8.9408,"N72","Cork",2,2],[52.084,-9.1986,"N72","Kerry",1,2],[52.1384,-8.2652,"N72","Cork",2,2],[52.1436,-8.8345,"N72","Cork",1,2],[52.1053,-9.7806,"N72","Kerry",1,2],[52.1169,-7.9936,"N72","Waterford",3,1],[52.0599,-9.3375,"N72","Kerry",2,2],[52.1501,-8.6234,"N72","Cork",2,2],[52.1109,-9.1037,"N72","Cork",1,2],[52.1335,-8.9337,"N72","Cork",3,1],[52.0754,-9.6316,"N72","Kerry",1,2],[52.1456,-7.9182,"N72","Waterford",3,1],[52.1128,-7.5955,"N72","Waterford",1,2],[52.1016,-9.7187,"N72","Kerry",3,1],[52.1422,-8.3461,"N72","Cork",1,2],[52.109,-9.1116,"N72","Cork",1,2],[52.132,-8.6776,"N72","Cork",1,2],[52.0751,-9.6228,"N72","Kerry",2,2],[52.1246,-7.7714,"N72","Waterford",1,2],[52.0661,-9.3094,"N72","Kerry",2,2],[52.1929,-8.5189,"N73","Cork",1,2],[52.2621,-8.3155,"N73","Cork",1,2],[52.2511,-8.3845,"N73","Cork",1,2],[52.2172,-8.5037,"N73","Cork",4,1],[52.2811,-8.2428,"N73","Cork",1,2],[52.1745,-8.5671,"N73","Cork",1,2],[52.2655,-8.2969,"N73","Cork",1,2],[52.2761,-8.2668,"N73","Cork",1,2],[52.2491,-8.4012,"N73","Cork",1,2],[52.2604,-8.3269,"N73","Cork",1,2],[52.285,-8.228,"N73","Cork",1,2],[52.2692,-8.2923,"N73","Cork",1,2],[52.4835,-8.0776,"N74","Tipperary",3,1],[52.5008,-7.9711,"N74","Tipperary",1,2],[52.4966,-7.9953,"N74","Tipperary",1,2],[52.6796,-7.8088,"N75","Tipperary",3,1],[52.6717,-7.7224,"N75","Tipperary",1,2],[52.3784,-7.5716,"N76","Tipperary",1,2],[52.4304,-7.4678,"N76","Tipperary",2,2],[52.3684,-7.6108,"N76","Tipperary",2,2],[52.6031,-7.3024,"N76","Kilkenny",2,2],[52.3732,-7.5814,"N76","Tipperary",6,1],[52.5949,-7.3064,"N76","Kilkenny",3,1],[52.3805,-7.5571,"N76","Tipperary",2,2],[52.547,-7.3951,"N76","Kilkenny",2,2],[52.4871,-7.4377,"N76","Kilkenny",2,2],[52.5247,-7.4165,"N76","Kilkenny",1,2],[52.8333,-7.3737,"N77","Laois",1,2],[52.8374,-7.3802,"N77","Laois",1,2],[52.7925,-7.3477,"N77","Kilkenny",1,2],[52.7156,-7.292,"N77","Kilkenny",4,1],[52.8157,-7.3647,"N77","Kilkenny",1,2],[52.6721,-7.2323,"N77","Kilkenny",1,2],[52.7784,-7.3317,"N77","Kilkenny",1,2],[52.9945,-6.8875,"N78","Kildare",1,2],[52.9219,-7.063,"N78","Laois",2,2],[52.9877,-6.943,"N78","Kildare",1,2],[52.9291,-7.061,"N78","Laois",2,2],[52.7695,-7.2201,"N78","Kilkenny",2,2],[52.8194,-7.1776,"N78","Kilkenny",1,2],[52.7627,-7.2237,"N78","Kilkenny",1,2],[52.8151,-7.1827,"N78","Kilkenny",3,1],[52.9502,-7.0351,"N78","Laois",1,2],[52.8447,-7.1283,"N78","Laois",1,2],[52.7282,-7.2682,"N78","Kilkenny",1,2],[52.7464,-7.2382,"N78","Kilkenny",1,2],[52.7535,-7.2321,"N78","Kilkenny",1,2],[52.8278,-6.8993,"N80","Carlow",6,1],[52.8479,-6.9656,"N80","Laois",1,2],[52.8126,-6.8973,"N80","Carlow",2,2],[53.2218,-7.4756,"N80","Offaly",2,2],[53.0328,-7.2993,"N80","Laois",2,2],[53.0262,-7.1997,"N80","Laois",2,2],[52.7522,-6.7941,"N80","Carlow",2,2],[52.7776,-6.8568,"N80","Carlow",6,1],[52.6388,-6.6306,"N80","Wexford",3,1],[52.8396,-6.909,"N80","Carlow",9,1],[52.7264,-6.7312,"N80","Carlow",2,2],[52.6943,-6.6923,"N80","Carlow",2,2],[52.759,-6.8485,"N80","Carlow",3,1],[52.5457,-6.5531,"N80","Wexford",1,2],[53.0298,-7.2441,"N80","Laois",2,2],[52.6548,-6.6505,"N80","Wexford",6,1],[52.8759,-6.7001,"N81","Carlow",1,2],[53.042,-6.636,"N81","Wicklow",1,2],[53.1004,-6.6069,"N81","Wicklow",3,1],[53.1162,-6.588,"N81","Wicklow",2,2],[52.7963,-6.7467,"N81","Carlow",1,2],[53.1638,-6.5437,"N81","Wicklow",2,2],[53.1974,-6.5066,"N81","Kildare",2,2],[52.9327,-6.71,"N81","Wicklow",1,2],[52.9846,-6.6575,"N81","Wicklow",1,2],[53.0751,-6.6145,"N81","Wicklow",1,2],[52.779,-6.7504,"N81","Carlow",1,2],[53.2041,-6.4976,"N81","Wicklow",2,2],[53.0637,-6.6214,"N81","Wicklow",2,2],[52.9772,-6.6844,"N81","Wicklow",2,2],[52.8249,-6.7232,"N81","Carlow",1,2],[52.7705,-6.7475,"N81","Carlow",1,2],[53.182,-6.5233,"N81","Wicklow",2,2],[52.8461,-6.7191,"N81","Carlow",1,2],[53.6279,-8.7444,"N83","Galway",1,2],[53.4911,-8.9086,"N83","Galway",3,1],[53.3147,-8.9854,"N83","Galway",3,1],[53.417,-8.9066,"N83","Galway",2,2],[53.3719,-8.9222,"N83","Galway",2,2],[53.435,-8.9043,"N83","Galway",2,2],[53.4926,-8.9022,"N83","Galway",3,1],[53.879,-8.7829,"N83","Mayo",1,2],[53.6575,-8.7463,"N83","Galway",1,2],[53.5845,-8.7792,"N83","Galway",2,2],[53.5997,-8.7633,"N83","Galway",1,2],[53.6881,-8.7526,"N83","Roscommon",3,1],[53.5495,-8.8089,"N83","Galway",1,2],[53.6182,-8.7437,"N83","Galway",2,2],[53.7561,-8.7507,"N83","Mayo",1,2],[53.766,-8.765,"N83","Mayo",1,2],[53.5907,-8.7748,"N83","Galway",1,2],[53.707,-8.7619,"N83","Mayo",1,2],[53.3073,-9.0308,"N84","Galway",3,1],[53.59,-9.1605,"N84","Mayo",2,2],[53.4036,-9.0171,"N84","Galway",3,1],[53.377,-9.016,"N84","Galway",3,1],[53.439,-9.072,"N84","Galway",2,2],[53.3684,-9.0169,"N84","Galway",2,2],[53.5982,-9.1817,"N84","Mayo",1,2],[53.7471,-9.2987,"N84","Mayo",1,2],[53.6326,-9.2349,"N84","Mayo",2,2],[52.2396,-9.823,"N86","Kerry",1,2],[52.2273,-9.8868,"N86","Kerry",1,2],[52.2638,-9.7056,"N86","Kerry",6,1],[52.2451,-9.7638,"N86","Kerry",1,2],[52.2001,-9.9289,"N86","Kerry",1,2],[52.2609,-9.6932,"N86","Kerry",1,2],[52.1809,-9.9704,"N86","Kerry",1,2],[52.244,-9.7777,"N86","Kerry",1,2],[52.2466,-9.7464,"N86","Kerry",3,1],[52.2394,-9.8353,"N86","Kerry",1,2],[54.0907,-7.4802,"N87","Cavan",2,2],[54.1857,-7.7064,"N87","Cavan",1,2],[54.1156,-7.6567,"N87","Cavan",1,2],[51.8983,-8.4738,"N22","Cork",12,1],[51.8945,-8.4955,"N22","Cork",10,1],[51.8928,-8.5032,"N22","Cork",3,1],[51.8524,-8.8194,"N22","Cork",8,1],[51.8971,-8.4822,"N22","Cork",9,1],[51.9816,-9.3191,"N22","Kerry",3,1],[52.016,-9.3765,"N22","Kerry",2,2],[52.249,-9.676,"N22","Kerry",2,2],[51.9112,-9.0274,"N22","Cork",1,2],[51.8841,-8.933,"N22","Cork",2,2],[54.0365,-6.5569,"N53","Louth",4,1],[54.0382,-6.5686,"N53","Louth",2,2],[54.1086,-6.7194,"N53","Monaghan",1,2],[54.0336,-6.5381,"N53","Louth",2,2],[54.0731,-6.6758,"N53","Monaghan",2,2],[54.0943,-6.7019,"N53","Monaghan",2,2],[53.7017,-6.3825,"N01","Meath",1,2],[53.8289,-6.4089,"N01","Louth",1,2],[53.9709,-6.4237,"N01","Louth",2,2],[54.1081,-6.3649,"N01","Louth",2,2],[53.9042,-6.4193,"N01","Louth",2,2],[53.4404,-6.2072,"N01","Dublin",2,2],[54.1275,-6.7696,"N02","Monaghan",1,2],[54.1104,-6.7509,"N02","Monaghan",3,1],[53.4543,-6.4829,"N03","Meath",1,2],[53.5992,-6.6122,"N03","Meath",1,2],[53.4464,-6.4734,"N03","Meath",1,2],[53.6178,-6.6798,"N03","Meath",1,2],[53.6401,-6.741,"N03","Meath",1,2],[53.3598,-6.5314,"N04","Kildare",4,1],[53.3671,-6.5906,"N04","Kildare",2,2],[53.4544,-7.1182,"N04","Westmeath",1,2],[53.4109,-6.7407,"N04","Kildare",2,2],[54.0762,-8.3711,"N04","Sligo",1,2],[53.2869,-9.0448,"N06","Galway",3,1],[53.4488,-7.1317,"N06","Westmeath",2,2],[53.2908,-9.0196,"N06","Galway",1,2],[53.2804,-9.0687,"N06","Galway",2,2],[53.265,-8.6125,"N06","Galway",1,2],[53.2823,-9.048,"N06","Galway",1,2],[53.2822,-9.0654,"N06","Galway",5,1],[53.2848,-9.0465,"N06","Galway",2,2],[53.4506,-7.1049,"N06","Westmeath",1,2],[53.387,-7.7376,"N06","Westmeath",3,1],[53.3584,-7.4946,"N06","Westmeath",1,2],[52.6453,-8.5663,"N07","Limerick",4,1],[52.6632,-8.5196,"N07","Limerick",1,2],[53.1622,-6.824,"N07","Kildare",2,2],[53.2355,-6.6376,"N07","Kildare",1,2],[52.6606,-8.5273,"N07","Limerick",1,2],[52.6386,-8.5957,"N07","Limerick",4,1],[53.0,-7.395,"N07","Laois",5,1],[52.9235,-7.6315,"N07","Laois",1,2],[52.0072,-8.3421,"N08","Cork",1,2],[52.2845,-8.2175,"N08","Cork",1,2],[52.4995,-7.887,"N08","Tipperary",1,2],[52.3846,-7.9414,"N08","Tipperary",2,2],[52.5737,-7.2316,"N09","Kilkenny",2,2],[53.1206,-6.7554,"N09","Kildare",1,2],[52.4078,-7.2061,"N09","Kilkenny",4,1],[52.2837,-7.1503,"N09","Kilkenny",1,2],[52.965,-6.0967,"N11","Wicklow",1,2],[52.7095,-6.2585,"N11","Wexford",1,2],[52.635,-6.3516,"N11","Wexford",2,2],[52.7705,-6.1865,"N11","Wicklow",1,2],[52.8214,-6.1451,"N11","Wicklow",1,2],[53.2894,-6.1957,"N11","Dublin",1,2],[53.5249,-8.8732,"N17","Galway",3,1],[53.2137,-8.83,"N18","Galway",2,2],[52.7925,-8.9209,"N18","Clare",1,2],[52.695,-8.8223,"N18","Clare",2,2],[51.9124,-8.4711,"N20","Cork",2,2],[52.5889,-8.7157,"N20","Limerick",1,2],[51.9234,-8.4904,"N20","Cork",2,2],[51.9066,-8.1785,"N25","Cork",3,1],[51.9062,-8.3664,"N25","Cork",4,1],[52.2839,-7.1429,"N25","Kilkenny",2,2],[52.2468,-7.1903,"N25","Waterford",1,2],[52.2962,-9.6512,"N69","Kerry",1,2],[51.889,-8.5685,"N22","Cork",1,2],[53.8625,-9.2579,"N05","Mayo",1,2],[53.8514,-9.2571,"N05","Mayo",1,2],[52.5265,-6.5399,"N30","Wexford",2,2],[53.2785,-6.1854,"N11","Dublin",1,2],[54.2791,-8.4735,"N15","Sligo",3,1],[52.14,-8.6538,"N20","Cork",1,2],[53.2839,-6.3827,"N81","Dublin",7,1],[53.8279,-6.4086,"N01","Louth",1,2],[53.5634,-6.214,"N01","Dublin",3,1],[53.8571,-6.428,"N01","Louth",2,2],[53.6628,-6.3312,"N01","Meath",4,1],[53.5497,-6.2157,"N01","Dublin",3,1],[53.4971,-6.4167,"N02","Meath",3,1],[54.135,-6.7749,"N02","Monaghan",3,1],[53.4535,-6.4828,"N03","Meath",1,2],[53.714,-6.8836,"N03","Meath",1,2],[53.436,-6.4681,"N03","Meath",1,2],[53.3908,-6.3796,"N03","Dublin",5,1],[53.41,-6.7402,"N04","Kildare",2,2],[53.4487,-7.0916,"N04","Meath",1,2],[53.4024,-6.6907,"N04","Kildare",1,2],[53.5492,-7.3319,"N04","Westmeath",2,2],[54.2222,-8.5004,"N04","Sligo",1,2],[53.3583,-6.4747,"N04","Dublin",3,1],[53.2822,-9.0479,"N06","Galway",1,2],[53.2887,-9.013,"N06","Galway",2,2],[53.2806,-9.0684,"N06","Galway",2,2],[53.2907,-9.02,"N06","Galway",1,2],[53.424,-7.9753,"N06","Roscommon",1,2],[53.3998,-7.8323,"N06","Westmeath",1,2],[53.288,-8.972,"N06","Galway",2,2],[53.2952,-8.9199,"N06","Galway",2,2],[53.0132,-7.3043,"N07","Laois",4,1],[52.6657,-8.5166,"N07","Limerick",1,2],[52.8863,-7.9448,"N07","Offaly",2,2],[53.1455,-7.0162,"N07","Kildare",2,2],[53.0164,-7.3231,"N07","Laois",1,2],[52.6448,-8.5666,"N07","Limerick",1,2],[52.6236,-7.7733,"N08","Tipperary",1,2],[52.5081,-7.872,"N08","Tipperary",1,2],[52.1167,-8.2722,"N08","Cork",1,2],[52.2387,-8.2786,"N08","Cork",1,2],[52.0262,-8.3285,"N08","Cork",1,2],[52.9986,-6.8418,"N09","Kildare",1,2],[52.4866,-7.2406,"N09","Kilkenny",1,2],[52.6584,-7.2251,"N10","Kilkenny",1,2],[53.1966,-6.1332,"N11","Wicklow",1,2],[52.8013,-6.1818,"N11","Wicklow",2,2],[53.076,-6.0919,"N11","Wicklow",1,2],[53.003,-6.0909,"N11","Wicklow",1,2],[52.6648,-6.2688,"N11","Wexford",1,2],[52.4919,-6.529,"N11","Wexford",2,2],[53.2894,-6.1953,"N11","Dublin",1,2],[53.2664,-6.1587,"N11","Dublin",3,1],[52.9375,-8.9058,"N18","Clare",1,2],[52.9578,-8.8904,"N18","Clare",2,2],[52.734,-8.8883,"N18","Clare",2,2],[52.727,-8.8773,"N18","Clare",1,2],[52.635,-8.6258,"N20","Limerick",2,2],[52.6296,-8.6349,"N20","Limerick",1,2],[51.9124,-8.4713,"N20","Cork",1,2],[51.9005,-8.4725,"N20","Cork",4,1],[52.3563,-7.3475,"N24","Kilkenny",3,1],[51.907,-8.3003,"N25","Cork",3,1],[51.8958,-8.463,"N27","Cork",5,1],[52.398,-6.8746,"N30","Wexford",2,2],[52.2563,-9.6834,"N70","Kerry",1,2],[51.8887,-8.5684,"N22","Cork",1,2],[51.8787,-8.6411,"N22","Cork",3,1],[53.8256,-9.3262,"N05","Mayo",1,2],[51.8957,-8.3937,"N40","Cork",7,1],[52.5849,-8.723,"N20","Limerick",1,2],[53.2786,-6.1852,"N11","Dublin",2,2],[53.2736,-6.1734,"N11","Dublin",2,2],[54.2761,-8.4772,"N04","Sligo",4,1],[52.1367,-8.6548,"N20","Cork",1,2],[53.4115,-6.225,"N01","Dublin",1,2],[53.4158,-6.2233,"N01","Dublin",1,2],[53.4065,-6.23,"N01","Dublin",1,2],[53.4029,-6.3109,"N02","Dublin",1,2],[53.408,-6.3131,"N02","Dublin",1,2],[53.4033,-6.3102,"N02","Dublin",2,2],[53.3811,-6.3637,"N03","Dublin",1,2],[53.3896,-6.3518,"N03","Dublin",1,2],[53.3852,-6.3681,"N03","Dublin",2,2],[53.3811,-6.3584,"N03","Dublin",1,2],[53.3859,-6.3701,"N03","Dublin",1,2],[53.3817,-6.3591,"N03","Dublin",1,2],[53.3571,-6.3817,"N04","Dublin",1,2],[53.356,-6.3918,"N04","Dublin",1,2],[53.3177,-6.3715,"N07","Dublin",1,2],[53.32,-6.368,"N07","Dublin",1,2],[53.3176,-6.371,"N07","Dublin",1,2],[53.3185,-6.3663,"N07","Dublin",1,2],[53.2418,-6.1536,"N50","Dublin",1,2],[53.3231,-6.3718,"N50","Dublin",1,2],[53.2705,-6.216,"N50","Dublin",1,2],[53.2695,-6.2476,"N50","Dublin",1,2],[53.3052,-6.3518,"N50","Dublin",1,2],[53.3067,-6.3562,"N50","Dublin",1,2],[53.3575,-6.3831,"N50","Dublin",1,2],[53.3146,-6.3652,"N50","Dublin",1,2],[53.2878,-6.329,"N50","Dublin",1,2],[53.2422,-6.1559,"N50","Dublin",1,2],[53.2886,-6.3302,"N50","Dublin",1,2],[53.4078,-6.229,"N50","Dublin",1,2],[53.3561,-6.3834,"N50","Dublin",1,2],[53.3589,-6.3833,"N50","Dublin",1,2],[53.2385,-6.1445,"N50","Dublin",1,2],[53.2702,-6.2122,"N50","Dublin",1,2],[53.335,-6.385,"N50","Dublin",2,2],[53.2686,-6.2658,"N50","Dublin",1,2],[53.2825,-6.3265,"N50","Dublin",1,2],[53.4096,-6.2558,"N50","Dublin",2,2],[53.3117,-6.3623,"N50","Dublin",2,2],[53.3855,-6.243,"N50","Dublin",1,2],[53.4087,-6.273,"N50","Dublin",2,2],[53.2842,-6.3275,"N50","Dublin",1,2],[53.268,-6.2501,"N50","Dublin",1,2],[53.3787,-6.3676,"N50","Dublin",2,2],[53.3869,-6.2429,"N50","Dublin",1,2],[53.4106,-6.2331,"N50","Dublin",1,2],[53.3042,-6.3482,"N50","Dublin",1,2],[53.2673,-6.2029,"N50","Dublin",1,2],[53.3581,-6.2317,"N50","Dublin",1,2],[53.3885,-6.2422,"N50","Dublin",1,2],[53.3825,-6.3628,"N50","Dublin",1,2],[53.2755,-6.316,"N50","Dublin",1,2],[53.3809,-6.365,"N50","Dublin",1,2],[53.2685,-6.2066,"N50","Dublin",1,2],[53.4027,-6.3154,"N50","Dublin",1,2],[53.4108,-6.2284,"N50","Dublin",2,2],[53.2424,-6.1566,"N50","Dublin",1,2],[53.2672,-6.2531,"N50","Dublin",1,2],[53.384,-6.2433,"N50","Dublin",2,2],[53.4092,-6.2603,"N50","Dublin",1,2],[53.4082,-6.2877,"N50","Dublin",3,1],[53.2434,-6.159,"N50","Dublin",1,2],[53.3871,-6.3574,"N50","Dublin",1,2],[53.4095,-6.2528,"N50","Dublin",1,2],[53.3492,-6.3861,"N50","Dublin",2,2],[53.2696,-6.2464,"N50","Dublin",1,2],[53.3735,-6.2429,"N50","Dublin",1,2],[53.2787,-6.3233,"N50","Dublin",1,2],[53.3074,-6.3567,"N50","Dublin",1,2],[53.2381,-6.1444,"N50","Dublin",1,2],[53.3188,-6.3684,"N50","Dublin",1,2],[53.4099,-6.2479,"N50","Dublin",2,2],[53.2716,-6.2382,"N50","Dublin",1,2],[53.2718,-6.2342,"N50","Dublin",1,2],[53.4042,-6.3114,"N50","Dublin",1,2],[53.2584,-6.1863,"N50","Dublin",1,2],[53.4026,-6.2334,"N50","Dublin",1,2],[53.2765,-6.3202,"N50","Dublin",1,2],[53.3567,-6.384,"N50","Dublin",1,2],[53.2425,-6.1578,"N50","Dublin",1,2],[53.3177,-6.3679,"N50","Dublin",2,2],[53.2402,-6.1485,"N50","Dublin",1,2],[53.269,-6.2703,"N50","Dublin",1,2],[53.3903,-6.2418,"N50","Dublin",1,2],[53.2636,-6.1961,"N50","Dublin",1,2],[53.3532,-6.3848,"N50","Dublin",1,2],[53.2354,-6.1377,"N50","Dublin",1,2],[53.3851,-6.2433,"N50","Dublin",1,2],[53.3637,-6.3824,"N50","Dublin",2,2],[53.2676,-6.2608,"N50","Dublin",1,2],[53.2689,-6.2962,"N50","Dublin",1,2],[53.4089,-6.2735,"N50","Dublin",2,2],[53.3822,-6.244,"N50","Dublin",1,2],[53.353,-6.3852,"N50","Dublin",2,2],[53.3899,-6.3503,"N50","Dublin",3,1],[53.2668,-6.2798,"N50","Dublin",1,2],[53.2527,-6.1753,"N50","Dublin",1,2],[53.2535,-6.1777,"N50","Dublin",2,2],[53.3977,-6.2381,"N50","Dublin",1,2],[53.3144,-6.3644,"N50","Dublin",1,2],[53.4111,-6.227,"N50","Dublin",2,2],[53.272,-6.2437,"N50","Dublin",1,2]];

// ===== CAMPAIGN TRACKER =====
// UPDATE THIS: date you sent emails to all TDs/MLAs
const CAMPAIGN_SENT_DATE = "2026-03-01";
// UPDATE THIS: bump as people report emailing their TDs
const ACTION_COUNT = 112;
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
  // Kathleen Funchion — now MEP, removed from TD tracker
  {n:"Matt Carthy",p:"SF",con:"Cavan–Monaghan",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Cathy Bennett",p:"SF",con:"Cavan–Monaghan",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF party-wide position. All five demands adopted as party policy."},
  {n:"Donna McGettigan",p:"SF",con:"Clare",j:"ROI",status:"meaningful",responded:"2026-04-18",summary:"SF party-wide. Consulted Pa Daly, then committed to tabling PQs on Commissioner + 500 cameras with campaign wording."},
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
  {n:"Conor D. McGuinness",p:"SF",con:"Waterford",j:"ROI",status:"meaningful",responded:"2026-03-12",summary:"Personal response confirming support for all five demands. Raised road deaths in Dáil. Working with local road safety groups and pushing N25 funding. SF party-wide position."},
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
  {n:"Pat the Cope Gallagher",p:"FF",con:"Donegal",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Two PQs answered 18 Mar: Commissioner + accountability. Minister's answer did not address Commissioner. Second PQ asked who oversees strategy — answer: a quarterly meeting."},
  {n:"Shane Moynihan",p:"FF",con:"Dublin Mid-West",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"FF Transport Spokesperson. Addressed all five demands. Tabled PQ on road safety governance coordination. Supports black spot redesign, enforcement. Hedged on Commissioner."},
  {n:"Ivana Bacik",p:"Lab",con:"Dublin Bay South",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour Party leader. Formally signed up Labour as party-wide position backing all five demands."},
  {n:"Cathal Crowe",p:"FF",con:"Clare",j:"ROI",status:"meaningful",responded:"2026-03-03",summary:"Transport Committee member. PQ 231 answered 18 Mar — asked who delivers 2030 target + Commissioner model. Minister gave copy-paste non-answer, did not mention Commissioner or international models."},
  {n:"Michael Murphy",p:"FG",con:"Tipperary South",j:"ROI",status:"meaningful",responded:"2026-03-03",summary:"Transport Committee Chair. Confirmed submission will be circulated to all members. Oral evidence request on agenda."},
  {n:"Brendan Smith",p:"FF",con:"Cavan–Monaghan",j:"ROI",status:"meaningful",responded:"2026-03-03",summary:"Substantive policy engagement. Supports enforcement, raised concerns on Commissioner model. Forwarded to Minister. Ref: TTAS-MO-01256-2026."},
  {n:"Alan Kelly",p:"Lab",con:"Tipperary North",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"Labour party-wide position. All five demands adopted as party policy."},
  {n:"Darragh O'Brien",p:"FF",con:"Dublin Fingal East",j:"ROI",status:"generic",responded:"2026-03-02",summary:"Minister for Transport. Constituency office referred to ministerial office, which referred to Minister of State Canney. Ref: TTAS-MO-01247-2026."},
  {n:"Carol Nolan",p:"Ind",con:"Offaly",j:"ROI",status:"generic",responded:"2026-03-02",summary:"PA asked detailed policy questions on Commissioner role and speed cameras. Indicated TD will engage constructively with some proposals."},
  {n:"Mark H. Durkan",p:"SDLP",con:"Foyle",j:"NI",status:"meaningful",responded:"2026-03-02",summary:"Tabled AQW 41757 on Commissioner + international models + cross-border coordination. Kimmins rejected Commissioner flat — 'not considering at this time.' First NI Assembly answer on road safety governance."},
  {n:"Hildegarde Naughton",p:"FG",con:"Galway West",j:"ROI",status:"generic",responded:"2026-03-03",summary:"Cabinet Minister. Former MoS at Transport 2020–2025. Redirected to Minister for Transport. Road deaths rose 32% during her tenure."},
  {n:"Mary Lou McDonald",p:"SF",con:"Dublin Central",j:"ROI",status:"meaningful",responded:"2026-03-06",summary:"SF leader. Office routed to Pa Daly (transport spokesperson). SF has adopted all five demands as party policy."},
  {n:"Jennifer Carroll MacNeill",p:"FG",con:"Dún Laoghaire",j:"ROI",status:"generic",responded:"2026-03-03",summary:"Minister for Health. Office sent Programme for Government copy-paste to constituent. No personal position on five demands."},
  {n:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",j:"ROI",status:"meaningful",responded:"2026-03-12",summary:"Govt-supporting Independent. 4 PQs answered 18 Mar: Commissioner (grouped non-answer), average speed cameras (5 in entire country), black spot redesign (€40m/year), road policing levels (Justice Minister: download a spreadsheet). Most PQs of any single TD on 18 Mar."},
  {n:"Tom Brabazon",p:"FF",con:"Dublin Bay North",j:"ROI",status:"meaningful",responded:"2026-03-18",summary:"PQ to Justice Minister on restoring road policing to 2014 levels. Minister did not commit — directed to Garda website."},
  {n:"James Geoghegan",p:"FG",con:"Dublin Bay South",j:"ROI",status:"generic",responded:"2026-03-12",summary:"Detailed response listing government actions. No personal position on five demands. No PQ commitment. Vague on parliamentary action."},
  {n:"Colin McGrath",p:"SDLP",con:"South Down",j:"NI",status:"meaningful",responded:"2026-03-06",summary:"Tabled Assembly Questions to Infrastructure Minister. SDLP council motion on roads emergency blocked by DUP and SF."},
  {n:"Justin McNulty",p:"SDLP",con:"Newry & Armagh",j:"NI",status:"meaningful",responded:"2026-03-23",summary:"AQW 42979 answered: 1 NSMC meeting in 14 months, no joint targets, Commissioner 'not an action' in either strategy. Proposed Infrastructure Committee hearing — committee agreed to invite campaign to present at Stormont."},
  {n:"Séamus McGrath",p:"FF",con:"Cork South-Central",j:"ROI",status:"meaningful",responded:"2026-03-11",summary:"Supports all five demands. Committed to tabling PQs."},
  {n:"Timmy Dooley",p:"FF",con:"Clare",j:"ROI",status:"meaningful",responded:"2026-03-19",summary:"Minister of State. Raised campaign with Canney directly. Tabled PQs on speed cameras and road policing. Engaged on 4/5 demands. Did not commit on Commissioner, citing collective cabinet responsibility."},
  {n:"Niall Collins",p:"FF",con:"Limerick County",j:"ROI",status:"generic",responded:"2026-03-18",summary:"Represents Dept of Justice on Road Safety Forum. Five one-line answers. Refused to table PQ. Described current system as adequate."},
  {n:"Patrick O'Donovan",p:"FG",con:"Limerick County",j:"ROI",status:"generic",responded:"2026-04-21",summary:"'Not my policy role.' Referred to Canney. Offered meeting but no commitment to PQ or demands."},
  {n:"Brian Brennan",p:"FG",con:"Wicklow\u2013Wexford",j:"ROI",status:"generic",responded:"2026-04-18",summary:"'Happy to bring initiatives to Minister.' No commitment to PQ, no position on five demands."},
  {n:"John Paul O'Shea",p:"FG",con:"Cork North-West",j:"ROI",status:"meaningful",responded:"2026-03-18",summary:"Tabled TWO PQs: one on Commissioner model, one on accountability mechanisms. First FG TD from Cork to engage. Minister gave copy-paste non-answer."},
  {n:"Seán Ó Fearghaíl",p:"FF",con:"Kildare South",j:"ROI",status:"meaningful",responded:"2026-03-18",summary:"Former Ceann Comhairle. Tabled PQ on statutory Road Safety Commissioner. Minister's answer did not address the Commissioner question."},
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
  {td:"Jen Cummins",p:"SD",con:"Dublin South-Central",date:"2026-03-18",type:"Written",
   q:"[Ref 19234/26] To ask the Minister for Transport if Dublin City Council and the other Dublin local authorities currently have access to collision location data from 2019 onwards; the reason the RSA ceased sharing this data with LAs in 2020; how LA road engineers are expected to identify and redesign dangerous junctions without access to this data; and to provide a specific date by which the NVDF Bill will be enacted.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Confirms collision data not shared with LAs since November 2023 due to GDPR legal advice. LAs have also identified issue with legal basis to PROCESS data once received. Interim measure: Dept does own analysis and sends 'locations of interest' to LAs. NVDF Bill at OPC, 'coming weeks' for publication, 'first half of 2026' for enactment.",
   assessment:"Third PQ to confirm data blackout since Nov 2023 (after Buckley Q309 and Heneghan Q317). Dublin councils are designing BusConnects junctions and cycling infrastructure blind. The processing obstacle is now a standard line — it appeared in Heneghan's 24 March answer and is repeated here. Even after the Bill passes, LAs may not be able to USE the data. The 'locations of interest' interim measure is not data access — it's the Department acting as middleman. Walsh claimed in the 25 March meeting that local engineers have access. The Minister's own PQ answers say they don't."},
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
   q:"Q273: To ask the Minister for Transport the total annual expenditure on road safety by the RSA and TII in each of the past five years; how this compares with equivalent expenditure in Finland, Norway, and Sweden on a per-capita basis; and whether the Government has assessed the cost-effectiveness of deploying a national network of automated speed cameras, given international evidence that such networks are net revenue-positive within two years. [Garda expenditure portion struck under Standing Order 45.]",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"RSA: €18m/year ringfenced for road safety campaigns. Self-funded since 2014; only ~€1m Exchequer for pensions/EU obligations. Detailed expenditure referred to RSA for direct reply. TII: ~€26m/year average via Road Safety Improvement Scheme, 210+ schemes in 2025. Detailed expenditure referred to TII. Cameras: 5 average speed + 9 static = 14 total. Camera strategy 'shortly.' 9,000 GoSafe hours/month. DID NOT ANSWER: (1) the per-capita international comparison with Finland, Norway, Sweden; (2) whether the Government has assessed cost-effectiveness of automated cameras.",
   assessment:"The Minister answered the easy parts and ignored the hard ones. Asked to compare Ireland's spending with Finland, Norway and Sweden — no comparison provided. Asked if the Government has assessed camera cost-effectiveness — not addressed. The Garda expenditure portion was struck under Standing Order 45 (matter for Garda Commissioner, not Transport Minister) — you literally cannot ask one Minister how much Ireland spends on road safety. Three separate deflections in one PQ: Garda spending → Justice, RSA detail → RSA, TII detail → TII. Nobody owns the full picture."},
  {td:"Pat the Cope Gallagher",p:"FF",con:"Donegal",date:"2026-03-06",type:"Written",
   q:"(1) To ask the Minister for Transport if he would support the establishment of a position of Road Safety Commissioner. (2) To ask the Minister for Transport what body is responsible for overseeing the implementation of the Road Safety Strategy.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Identical copy-paste to 5 TDs. Did not mention Commissioner, Sweden, Norway or Finland. Alternative: 'high-profile road safety ambassadors.' Accountability answer: RSLG quarterly meeting.",
   assessment:"Two PQs answered with grouped copy-paste. The word Commissioner does not appear in the answer. Accountability = a quarterly meeting Canney chairs."},
  {td:"Shane Moynihan",p:"FF",con:"Dublin Mid-West",date:"2026-03-06",type:"Written",
   q:"To ask the Minister for Transport for an update on any reforms being considered to the coordination structures for road safety governance to further strengthen implementation of the Road Safety Strategy 2021–2030; and if he will make a statement on the matter.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"Awaiting answer. FF Transport Spokesperson — asks about governance coordination reforms."},
  {td:"Cathal Crowe",p:"FF",con:"Clare",date:"2026-03-18",type:"Written",
   q:"To ask the Minister for Transport following the decision in December 2025 to abandon the planned restructuring of the Road Safety Authority, to state which body or individual is now responsible for delivering the Government's target of halving road deaths by 2030; whether the Government has examined the Road Safety Commissioner model or equivalent statutory accountability mechanisms used in Sweden, Norway, and Finland.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Grouped with 4 other TDs. Copy-paste non-answer. RSA reform proposals 'in coming weeks' including 'road safety ambassadors.' Did not address Commissioner or international models.",
   assessment:"The sharpest accountability question any TD has tabled. Minister's answer does not contain the words Commissioner, Sweden, Norway or Finland. Five TDs from three parties got the same copy-paste."},
  {td:"John Paul O'Shea",p:"FG",con:"Cork North-West",date:"2026-03-18",type:"Written",
   q:"(1) Governance reforms to ensure delivery of 2030 target + Commissioner with independent oversight. (2) Accountability mechanisms in place + whether performance reporting will be published.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Grouped copy-paste. Same non-answer as Crowe, Heneghan, Gallagher, Ó Fearghaíl.",
   assessment:"Two PQs — Commissioner + accountability. First FG TD from Cork to engage. Both answered with identical text that does not address either question."},
  {td:"John Paul O'Shea",p:"FG",con:"Cork North-West",date:"2026-03-18",type:"Written (Justice)",
   q:"Q1287: To ask the Minister for Justice the current number of Garda members assigned to Roads Policing Units and how this compares with 2014.",
   status:"answered",answered:"2026-03-18",minister:"Jim O'Callaghan",
   response:"Grouped with Heneghan, Brabazon, Currie. Directed to garda.ie spreadsheets. Did not state the number.",
   assessment:"Asked a direct question, told to download a spreadsheet."},
  {td:"Emer Currie",p:"FG",con:"Dublin West",date:"2026-03-18",type:"Written (Justice)",
   q:"Q1327: To ask the Minister for Justice the current number of Gardaí assigned to dedicated roads policing units and how this compares with 2014.",
   status:"answered",answered:"2026-03-18",minister:"Jim O'Callaghan",
   response:"Grouped with Heneghan, Brabazon, O'Shea. Directed to garda.ie spreadsheets. Did not state the number.",
   assessment:"Currie now has PQs to both Transport and Justice Ministers on road safety. Justice answer: download a spreadsheet."},
  {td:"Tom Brabazon",p:"FF",con:"Dublin Bay North",date:"2026-03-18",type:"Written (Justice)",
   q:"Q1232: To ask the Minister for Justice if his Department will restore road policing to 2014 levels.",
   status:"answered",answered:"2026-03-18",minister:"Jim O'Callaghan",
   response:"Grouped with Heneghan, O'Shea, Currie. Directed to garda.ie spreadsheets. Did not commit to restoring levels.",
   assessment:"Asked the sharpest version: will you restore? Minister's answer does not say yes."},
  {td:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",date:"2026-03-18",type:"Written",
   q:"To ask the Minister for Transport if he will examine the potential establishment of a statutory road safety commissioner with clear responsibility for overseeing and coordinating national road safety policy and for monitoring progress towards Ireland's 2030 road safety targets.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Grouped copy-paste with Crowe, O'Shea, Gallagher, Ó Fearghaíl. Commissioner not mentioned. RSA reform proposals 'in coming weeks' including 'road safety ambassadors.' RSLG quarterly meeting is the accountability mechanism.",
   assessment:"Govt-supporting Independent asking for Commissioner. Minister did not address the question. The word Commissioner does not appear in the answer."},
  {td:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",date:"2026-03-18",type:"Written",
   q:"Q264: To ask the Minister for Transport if his Department has assessed the potential benefits of deploying average speed camera technology on high risk routes within 12 months as part of efforts to reduce road fatalities and serious injuries.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"5 average speed cameras in operation: Dublin Port Tunnel, M7, N3 Cavan, N5 Mayo, N2 Meath. Since late 2024: 3 additional average speed zones + 9 static cameras installed. 9,000 hours/month GoSafe monitoring across 1,901 zones. National Safety Camera Strategy 'to be published shortly.'",
   assessment:"Put the actual camera count on the record: 5 average speed cameras in the entire country. 9,000 GoSafe hours across 1,901 zones = ~4.7 hours per zone per month. The 'shortly' for the camera strategy is another undefined timeline."},
  {td:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",date:"2026-03-18",type:"Written",
   q:"Q265: To ask the Minister for Transport if he will outline plans to introduce a funded national programme to identify and redesign the most dangerous sections of the road network, including the 50 road locations with the highest number of fatal or serious collisions.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"TII Reactive Road Safety Programme: ~€26m/year for national roads, identifies high-collision 1km sections, notifies local authorities, funds improvement schemes. Local/regional roads: €14m Safety Improvement Schemes Grant 2026 (8% increase on 2025), 330+ schemes funded. LA16 collision report forms completed jointly by local authority engineer and Garda at site of fatal collisions. Network-Wide Road Safety Assessment published by TII rating ~2,500km of national primary roads.",
   assessment:"Total identifiable black spot funding: ~€40m/year (~€26m TII national + €14m local/regional). Compare: €18m/year on RSA awareness campaigns. LA16 process confirmed — relevant to Gilvarry case. Key gap: no mention of whether LA16 forms are completed after serious injury collisions (not just fatal), and no accountability for whether recommendations are acted on."},
  {td:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",date:"2026-03-18",type:"Written (Justice)",
   q:"Q1331: To ask the Minister for Justice if he will provide details of current road policing levels compared with 2014.",
   status:"answered",answered:"2026-03-18",minister:"Jim O'Callaghan",
   response:"Did not provide the numbers. Directed TDs to download spreadsheets from garda.ie. Noted 65% of drink/drug driving checks done by regular Gardaí (not traffic corps). Budget 2026: €2.74bn. ~800 trainees entered Garda College in 2025. Garda Commissioner responsible for deployment under Policing, Security and Community Safety Act 2024.",
   assessment:"Four TDs from three parties asked a direct question: how many Gardaí in road policing now vs 2014? The Justice Minister refused to state the number in his answer and told them to look it up themselves. That is not accountability."},
  {td:"Seán Ó Fearghaíl",p:"FF",con:"Kildare South",date:"2026-03-18",type:"Written",
   q:"To ask the Minister for Transport if he has any plans to appoint a statutory road safety commissioner with the power to deliver safety targets set for 2030, in light of the increasing death rate on our roads.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Grouped copy-paste. Same non-answer as Crowe, O'Shea, Heneghan, Gallagher.",
   assessment:"Former Ceann Comhairle. Asked directly about Commissioner. Answer does not mention Commissioner."},
  {td:"Claire Kerrane",p:"SF",con:"Roscommon–Galway",date:"2026-03-18",type:"Written",
   q:"To ask the Minister for Transport the actions he is taking to reduce road deaths aside from the RSA Vision Zero Strategy.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Grouped with Ward. Listed Phase 2 Action Plan, NVDF Bill 'by summer' (4th deadline), camera strategy 'shortly', Grace's Law 'coming weeks', €18m RSA awareness spending, 'Be Safe Be Seen' high-vis campaign.",
   assessment:"NVDF Bill: 4th deadline ('summer'). Minister's answer to protecting vulnerable road users ends with distributing free high-vis armbands."},
  {td:"Barry Ward",p:"FG",con:"Dún Laoghaire",date:"2026-03-18",type:"Written",
   q:"To ask the Minister for Transport the actions he is taking to address road safety concerns for vulnerable road users including pedestrians and cyclists as set out in a report (details supplied).",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"Grouped with Kerrane. Same answer. Final paragraph on vulnerable road users: free high-vis vests and armbands via 'Be Safe, Be Seen' campaign.",
   assessment:"Asked about protecting pedestrians and cyclists. Minister's answer: wear a reflective armband. €18m on awareness campaigns while deaths rose 31%."},
  {td:"Timmy Dooley",p:"FF",con:"Clare",date:"2026-03-18",type:"Written",
   q:"Q367: To ask the Minister for Transport the position regarding the roll out of new automated speed cameras at road accident black spots across the country.",
   status:"answered",answered:"2026-03-18",minister:"Seán Canney",
   response:"5 average speed cameras: Dublin Port Tunnel, M7, N3 Cavan, N5 Mayo, N2 Meath. 9 static cameras: N17 Mayo, N59 Galway, N13 Donegal, N69 Limerick, R772 Wexford, N22 Cork, N80 Carlow, N25 Kilkenny, Dolphin's Barn Dublin 12. Total: 14 cameras nationwide. 9,000 GoSafe hours/month across 1,901 zones. National Safety Camera Strategy 'shortly.'",
   assessment:"The complete national camera inventory is now on the record: 14 automated cameras in the entire country. Five average speed, nine static. Finland: 1,164. Sweden: 2,487. Dooley's answer adds the static camera locations that Heneghan's didn't. The camera strategy is still 'shortly' — undefined. No deployment timeline."},
  {td:"Timmy Dooley",p:"FF",con:"Clare",date:"2026-03-18",type:"Written",
   q:"PQ on road policing unit resourcing.",
   status:"tabled",answered:null,minister:"Seán Canney",
   response:null,
   assessment:"Awaiting answer on road policing numbers."},
  // === 24 MARCH 2026 — HENEGHAN ROUND 2 ===
  {td:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",date:"2026-03-24",type:"Written",
   q:"Q315: To ask the Minister for Transport, further to the decision in December 2025 to abandon the planned restructuring of the RSA, the body or individual now responsible for delivering the Government's target of halving road deaths by 2030; whether the Government has examined the Road Safety Commissioner model used in Norway and Sweden.",
   status:"answered",answered:"2026-03-24",minister:"Seán Canney",
   response:"Word-for-word identical copy-paste to 18 March answer. Commissioner not mentioned. Norway and Sweden not mentioned. 'Ambassadors' and 'coming weeks' unchanged.",
   assessment:"Commissioner asked for the SEVENTH time across two jurisdictions. Answer has not changed by a single word since 18 March. As of the day before the Department meeting, this is still the government's position: ambassadors and a quarterly meeting."},
  {td:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",date:"2026-03-24",type:"Written",
   q:"Q316: To ask the Minister for Transport the current number of fixed automated speed cameras operational in Ireland; the timeline for deploying the 100 additional cameras announced in 2024, in tabular form.",
   status:"answered",answered:"2026-03-24",minister:"Seán Canney",
   response:"Same 14-camera inventory (5 avg speed + 9 static). Same locations. Same 'shortly' on camera strategy. Same 9,000 GoSafe hours, 1,901 zones. Did NOT provide the timeline for 100 cameras. Did NOT provide the requested table.",
   assessment:"Asked specifically for the deployment timeline in tabular form. The table was not provided. The 100 cameras were not referenced. The Minister simply repeated the same answer about the strategy being published 'shortly.' There is no deployment plan."},
  {td:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",date:"2026-03-24",type:"Written",
   q:"Q317: To ask the Minister for Transport the current status of the NVDF Bill 2025; when local authority road engineers will have statutory access to collision location data.",
   status:"answered",answered:"2026-03-24",minister:"Seán Canney",
   response:"Bill at OPC for drafting. 'Published in the coming weeks with enactment targeted for the first half of 2026.' NEW: local authorities have identified an issue with the legal basis to process the data once received — not just sharing but processing. Dept doing interim collision analysis centrally and notifying LAs of Locations of Interest.",
   assessment:"5th timeline iteration: 'coming weeks' for publication is new language. Previous: May 2025 → end 2025 → 'coming weeks' Mar 2026 → 'summer' → now 'coming weeks' again for publication + 'first half of 2026' for enactment. NEW OBSTACLE acknowledged: LAs have a problem not just receiving the data but having a legal basis to process it. Even when the Bill passes, there may be a further delay while processing arrangements are established."},
  // === NORTHERN IRELAND ASSEMBLY QUESTIONS ===
  {td:"Mark H. Durkan",p:"SDLP",con:"Foyle",date:"2026-03-02",type:"AQW (NI Assembly)",
   q:"AQW 41757/22-27: To ask the Minister for Infrastructure (i) whether she has considered appointing a dedicated Road Safety Commissioner with statutory authority and a mandate to deliver casualty reduction targets; (ii) whether her Department has assessed governance models in Norway and Sweden where designated lead agencies hold road safety targets; (iii) any engagement with the Department of Transport in the south on all-island coordination of road safety strategy.",
   status:"answered",answered:"2026-03-18",minister:"Liz Kimmins",
   response:"(i) 'I am not considering appointing a Road Safety Commissioner at this time.' Department chairs Road Safety Strategic Forum. (ii) 'Designating lead agencies to hold road safety targets is not part of the current Road Safety Strategy governance plan.' Officials 'keep abreast of road safety interventions in general.' (iii) Officials meet counterparts regularly. Road safety approved as official NSMC Transport sectoral workstream by predecessor John O'Dowd.",
   assessment:"First NI Assembly answer on the Commissioner. SF Minister for Infrastructure flatly rejects the model her own party's 65 TDs and MLAs have supported through this campaign. Norway and Sweden named in the question — neither mentioned in the answer. The cross-border NSMC workstream confirmation is useful but the substance is untested. Creates a major SF contradiction: supporting accountability in opposition, rejecting it in government."},
  {td:"Justin McNulty",p:"SDLP",con:"Newry & Armagh",date:"2026-03-23",type:"AQW (NI Assembly)",
   q:"AQW 42979/22-27: To ask the Minister for Infrastructure, pursuant to AQW 41757/22-27, to detail (i) the number of meetings held under the NSMC Transport sectoral workstream on road safety since its establishment; (ii) any joint actions or policy initiatives agreed at those meetings; (iii) whether any joint targets for casualty reduction have been set on a cross-border basis; (iv) whether she has discussed with her counterpart in the Department of Transport the Road Safety Commissioner model or equivalent statutory accountability mechanisms.",
   status:"answered",answered:"2026-04-03",minister:"Liz Kimmins",
   response:"(i) One meeting — 23 October 2025. Next meeting May 2026. (ii) Refers to Joint Communiqué. (iii) 'Joint targets have not been set on a cross-border basis.' Each jurisdiction has own strategy. (iv) 'A Road Safety Commissioner model or equivalent statutory accountability mechanism is not an action in either jurisdiction's current Road Safety Strategy.'",
   assessment:"Devastating. One NSMC meeting in 14 months. No joint targets. Commissioner explicitly rejected as 'not an action' in either strategy. Most definitive rejection yet. Deepens SF contradiction: party supports Commissioner, minister rejects it. McNulty then proposed Infrastructure Committee hearing — committee agreed to invite campaign to present at Stormont."},
  // === APRIL 2026 ===
  {td:"Ciarán Ahern",p:"Lab",con:"Dublin South-West",date:"2026-04-14",type:"Written",
   q:"To ask the Minister for Transport the number of local authorities that have commenced the statutory public consultation process required to implement 30km/h speed limits in built-up and urban areas, as directed by Departmental Circular of 16 October 2025; the deadline for completion; and if he will make a statement on the matter.",
   status:"answered",answered:"2026-04-14",minister:"Darragh O'Brien",
   response:"Circular issued 16 Oct 2025 directing LAs to complete bye-law process by 30 October 2026, with implementation by 31 March 2027. Each LA must run statutory public consultation. Making bye-laws is a reserved function — requires majority vote of elected members. 'Responsibility to commence and manage the statutory public consultation is a matter for the local authorities.'",
   assessment:"Extracted concrete deadline: 30 Oct 2026 for bye-laws, 31 Mar 2027 for implementation. Minister confirms everything rests on local councillors voting yes — Department cannot compel. Part asking whether Government would commence default provisions if bye-law route fails was ruled out of order (Standing Order 694, hypothetical)."},
  {td:"Jen Cummins",p:"SD",con:"Dublin South-Central",date:"2026-04-18",type:"Written",
   q:"To ask the Minister for Transport if Dublin City Council and the other Dublin local authorities currently have access to collision location data from 2019 onwards; the reason the RSA ceased sharing this data; how LA road engineers are expected to identify and redesign dangerous junctions without this data; and a specific date for the NVDF Bill enactment.",
   status:"answered",answered:"2026-04-18",minister:"Seán Canney",
   response:"Confirms data not shared since Nov 2023. LAs also identified issue with legal basis to PROCESS data. Interim: Dept does analysis centrally, notifies LAs of 'locations of interest.' NVDF Bill at OPC, 'coming weeks' for publication, 'first half of 2026' for enactment.",
   assessment:"Now in media coverage. Fifth NVDF Bill deadline iteration. New processing obstacle confirmed — even after Bill passes, LAs may lack legal basis to use the data. The 'locations of interest' middleman approach proves the system is broken."},
  {td:"Donna McGettigan",p:"SF",con:"Clare",date:"2026-04-21",type:"Written",
   q:"(1) To ask the Minister for Transport, following the decision in December 2025 to abandon the planned restructuring of the RSA, to state which body or individual is now responsible for delivering the Government's target of halving road deaths by 2030; and whether the Government has conducted any assessment of the Road Safety Commissioner model. (2) To ask the Minister for Transport to provide a timeline for the deployment of the 100 additional speed cameras announced in 2024; to state the current total number of fixed automated speed cameras; and whether the Government has assessed the feasibility of a 500-camera deployment.",
   status:"tabled",answered:null,minister:"Darragh O'Brien",
   response:null,
   assessment:"First PQ to put 500-camera figure on the Dáil record. Commissioner question is now the 8th time asked across both jurisdictions. Cleared with Pa Daly (SF transport spokesperson) before tabling."},
];

// ===== ORGANISATIONAL SUPPORTERS =====
// UPDATE THIS: add organisations as they confirm support
// cat: "medical" | "cycling" | "transport" | "legal" | "community" | "academic" | "union" | "other"
// logo: URL to org logo (use transparent PNG where possible)
// url: org website
const SUPPORTERS = [
  {name:"Irish Doctors for the Environment",cat:"medical",logo:"/ide-logo.png",url:"https://ide.ie"},
  {name:"DriverFocus",cat:"transport",logo:"/driverfocus-logo.png",url:"https://www.driverfocus.ie"},
  // Example entries — uncomment/add as organisations confirm:
  // {name:"Irish Association of Emergency Medicine",cat:"medical",logo:"https://iaem.ie/wp-content/uploads/iaem-logo.png",url:"https://iaem.ie"},
  // {name:"Cycling Ireland",cat:"cycling",logo:"https://www.cyclingireland.ie/logo.png",url:"https://www.cyclingireland.ie"},
  // {name:"Dublin Cycling Campaign",cat:"cycling",logo:"https://dublincycling.ie/logo.png",url:"https://dublincycling.ie"},
  // {name:"Cosáin",cat:"transport",logo:null,url:"https://cosain.ie"},
  // {name:"Love 30",cat:"transport",logo:null,url:null},
  // {name:"PARC Road Safety Group",cat:"community",logo:null,url:"https://parc.ie"},
  // {name:"Climate and Health Alliance",cat:"medical",logo:null,url:"https://climateandhealth.ie"},
];

const SUPPORTER_CATS = {
  medical:{label:"MEDICAL & HEALTH",color:"#ff4444"},
  cycling:{label:"CYCLING & ACTIVE TRAVEL",color:"#4ecdc4"},
  transport:{label:"TRANSPORT & SAFETY",color:"#ffd700"},
  legal:{label:"LEGAL & PROFESSIONAL",color:"#a78bfa"},
  community:{label:"COMMUNITY & FAMILIES",color:"#ff6b35"},
  academic:{label:"ACADEMIC & RESEARCH",color:"#60a5fa"},
  union:{label:"TRADE UNIONS",color:"#f472b6"},
  other:{label:"OTHER",color:"#e0e0e0"},
};

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

const EMAIL_OVERRIDES = {
  "Kevin 'Boxer' Moran":"kevinboxer.moran@oireachtas.ie",
  "Peter Cleere":"peterchap.cleere@oireachtas.ie",
  "Rose Conway-Walsh":"rose.conwaywalsh@oireachtas.ie",
  "Jennifer Carroll MacNeill":"jennifer.carrollmacneill@oireachtas.ie",
  "Richard Boyd Barrett":"richard.boydbarrett@oireachtas.ie",
  "Mary Lou McDonald":"marylou.mcdonald@oireachtas.ie",
  "John Paul Phelan":"johnpaul.phelan@oireachtas.ie",
  "John Paul O'Shea":"johnpaul.oshea@oireachtas.ie",
  "Pat the Cope Gallagher":"patthecope.gallagher@oireachtas.ie",
  "Jennifer Murnane O'Connor":"jennifer.murnane-oconnor@oireachtas.ie",
  "Conor D. McGuinness":"conor.mcguinness@oireachtas.ie",
};
function makeEmail(name, isNI) {
  if (!isNI && EMAIL_OVERRIDES[name]) return EMAIL_OVERRIDES[name];
  const clean = name.replace(/['']/g, "'").replace(/\s+/g, " ").trim();
  const parts = clean.split(" ");
  const first = parts[0].toLowerCase().replace(/[áàâä]/g,"a").replace(/[éèêë]/g,"e").replace(/[íìîï]/g,"i").replace(/[óòôö]/g,"o").replace(/[úùûü]/g,"u").replace(/[ñ]/g,"n").replace(/[^a-z]/g,"");
  const last = parts[parts.length-1].toLowerCase().replace(/[áàâä]/g,"a").replace(/[éèêë]/g,"e").replace(/[íìîï]/g,"i").replace(/[óòôö]/g,"o").replace(/[úùûü]/g,"u").replace(/[ñ]/g,"n").replace(/[^a-z'-]/g,"").replace(/'/g,"");
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
    <div style={{fontFamily:F.b,fontSize:15,color:X.t,marginTop:16,lineHeight:1.7,maxWidth:520,margin:"16px auto 0"}}>One person killed every 35 hours. 54 killed in 14 weeks of 2026.<br/>Roads don't recognise the border. Neither should the response.</div>
  </div>
)}

function ReportPage(){
  const[rCounty,setRCounty]=useState(null);
  const[rRoad,setRRoad]=useState("");
  const[rLocation,setRLocation]=useState("");
  const[rDesc,setRDesc]=useState("");
  const[rSent,setRSent]=useState(false);
  const[selSite,setSelSite]=useState(null);
  const[mapView,setMapView]=useState("all"); // all, county
  const sec={background:X.bg,border:`1px solid ${X.br}`,borderRadius:6,padding:"24px 28px",marginBottom:16};
  const isNI=rCounty&&COUNTIES[rCounty]?.j==="NI";
  const cons=rCounty?C2C[rCounty]||[]:[];

  // Project lat/lng to SVG coords (same as CMap)
  const proj=(lat,lng)=>[((lng+10.5)/5.2)*460+20,((55.5-lat)/4.1)*520+10];

  // County-filtered collision sites
  const countySites=rCounty?COLLISIONS.filter(s=>s[3]===rCounty):COLLISIONS;
  const l1Sites=countySites.filter(s=>s[5]===1);
  const l2Sites=countySites.filter(s=>s[5]===2);

  const roadEmailBody=`Dear [TD/MLA name],

I am writing about a dangerous road in your constituency that I believe poses a serious risk to road users.

ROAD: ${rRoad||"[Road name/number]"}
LOCATION: ${rLocation||"[Specific location/junction]"}, Co. ${rCounty||"[County]"}
CONCERN: ${rDesc||"[Description of danger]"}

I am asking you to:

1. Raise this specific road with your local authority's road design section and ask whether a safety review has been conducted.
2. Ask whether collision data for this location is available to the local authority. (Since November 2023, local authorities have been unable to access collision location data from the RSA.)
3. Table a Parliamentary Question asking the Minister for Transport what mechanism exists to ensure dangerous roads are reviewed and redesigned after crashes or public reports of danger.

This road is reported through stoproaddeaths.ie, which is tracking road safety governance across the island of Ireland. 247 people were killed on Irish roads in 2025. 94% of the road network is managed by local authorities with no national safety inspection regime. Known dangerous roads sit unchanged for years because no body can compel a local authority to act.

Your response will be published at stoproaddeaths.ie.

Yours sincerely,
[Your name]
[Your address]`;
  return(<div style={{maxWidth:900,margin:"0 auto"}}>
    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontFamily:F.h,fontSize:44,color:"#fff"}}>REPORT A DANGEROUS ROAD</div>
      <div style={{fontFamily:F.b,fontSize:15,color:X.t,lineHeight:1.6,maxWidth:580,margin:"8px auto 0"}}>The RSA stopped sharing collision data with local authorities in 2020. Road engineers cannot see where crashes happen on their roads. The State won't map the danger — so we will.</div>
    </div>

    {/* COLLISION MAP */}
    <div style={{...sec,padding:"16px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontFamily:F.h,fontSize:22,color:X.o}}>HIGH COLLISION LOCATIONS — NATIONAL ROADS</div>
          <div style={{fontFamily:F.m,fontSize:10,color:X.l}}>TII Network Safety Ranking 2022–2024 · CC BY 4.0 · {COLLISIONS.length} road sections with above-average collision rates</div>
        </div>
        {rCounty&&<button onClick={()=>{setRCounty(null);setSelSite(null)}} style={{background:"#222",border:"1px solid #444",color:"#ccc",padding:"4px 12px",borderRadius:3,cursor:"pointer",fontFamily:F.m,fontSize:10}}>← ALL IRELAND</button>}
      </div>
      <div className="report-map-grid">
        <div style={{background:"#0a0a0a",border:"1px solid #222",borderRadius:4,padding:"8px",position:"relative"}}>
          <svg viewBox="0 0 500 540" style={{width:"100%",height:"100%"}}>
            {/* Ireland outline */}
            <path d="M404.8,44.2 L419.8,51.9 L429.6,67.1 L434,92.4 L453.5,117.8 L466.7,136.8 L457.9,155.9 L457.9,174.9 L426.9,193.9 L422.5,206.6 L418.1,219.3 L419.8,235.8 L419.8,257.3 L413.7,276.3 L409.2,282.7 L422.5,308 L419.8,333.4 L409.2,352.4 L404.8,371.5 L402.2,390.5 L398.6,409.5 L387.1,431.1 L369.4,441.2 L338.5,447.6 L316.3,460.2 L285.4,472.9 L258.8,485.6 L232.3,492 L214.6,498.3 L196.9,500.8 L179.2,511 L152.7,517.3 L117.3,523.7 L104,517.3 L90.8,498.3 L68.7,485.6 L51,479.3 L37.7,460.2 L33.3,441.2 L51,428.5 L68.7,434.9 L81.9,422.2 L68.7,409.5 L73.1,390.5 L90.8,384.1 L73.1,377.8 L68.7,365.1 L81.9,346.1 L90.8,327.1 L95.2,314.4 L77.5,308 L59.8,295.4 L55.4,289 L51,276.3 L55.4,263.7 L46.5,257.3 L55.4,248.4 L64.2,238.3 L55.4,232 L59.8,219.3 L51,206.6 L59.8,193.9 L68.7,181.2 L77.5,168.5 L104,162.2 L135,162.2 L161.5,168.5 L192.5,162.2 L188.1,155.9 L201.3,149.5 L205.8,143.2 L201.3,136.8 L210.2,130.5 L223.5,124.1 L205.8,111.5 L201.3,98.8 L214.6,79.8 L232.3,67.1 L236.7,54.4 L254.4,41.7 L281,25.2 L298.7,25.2 L316.3,35.4 L334,41.7 L356.2,48 L373.8,41.7 L404.8,44.2Z" fill="#111" stroke="#888" strokeWidth="2" opacity="1"/>
            {/* County labels for context */}
            {rCounty&&Object.entries(COUNTIES).filter(([n])=>n===rCounty).map(([name,data])=>{
              const[cx,cy]=proj(data.lat,data.lng);
              return <text key={name} x={cx} y={cy-10} textAnchor="middle" fill={X.o} fontSize="11" fontFamily={F.h} opacity="0.7">{name.toUpperCase()}</text>;
            })}
            {/* Level 2 sites (orange, smaller) */}
            {l2Sites.map((s,i)=>{const[x,y]=proj(s[0],s[1]);if(x<0||x>500||y<0||y>540)return null;
              return <circle key={`l2-${i}`} cx={x} cy={y} r={rCounty?4:2.5} fill={X.o} opacity={0.5} style={{cursor:"pointer"}} onClick={()=>{setSelSite(s);setRCounty(s[3]);setRRoad(s[2])}}/>;
            })}
            {/* Level 1 sites (red, larger, pulsing) */}
            {l1Sites.map((s,i)=>{const[x,y]=proj(s[0],s[1]);if(x<0||x>500||y<0||y>540)return null;
              const isSel=selSite&&selSite[0]===s[0]&&selSite[1]===s[1];
              return <g key={`l1-${i}`} style={{cursor:"pointer"}} onClick={()=>{setSelSite(s);setRCounty(s[3]);setRRoad(s[2])}}>
                <circle cx={x} cy={y} r={rCounty?7:4} fill={X.r} opacity={0.7}>
                  {!rCounty&&<animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite"/>}
                </circle>
                {isSel&&<circle cx={x} cy={y} r={12} fill="none" stroke="#fff" strokeWidth="2"><animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite"/></circle>}
              </g>;
            })}
          </svg>
          {!rCounty&&<div style={{position:"absolute",bottom:8,left:8,fontFamily:F.m,fontSize:9,color:"#666"}}>CLICK A DOT TO SEE DETAILS</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,overflowY:"auto",maxHeight:460}}>
          {/* Legend */}
          <div style={{background:"#0d0d0d",border:"1px solid #222",borderRadius:4,padding:"10px 12px"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:X.l,marginBottom:6}}>MAP KEY{rCounty?` · ${rCounty.toUpperCase()}`:""}</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:X.r,flexShrink:0}}/>
              <div><div style={{fontFamily:F.b,fontSize:12,color:"#eee"}}>{l1Sites.length} sections — collision rate 2× above average</div>
              <div style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Injury collisions per km well above normal for this road type</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:X.o,flexShrink:0}}/>
              <div><div style={{fontFamily:F.b,fontSize:12,color:"#eee"}}>{l2Sites.length} sections — collision rate above average</div>
              <div style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Higher than expected for similar roads (speed, type, traffic)</div></div>
            </div>
            <div style={{fontFamily:F.m,fontSize:9,color:"#666",marginTop:8,lineHeight:1.4}}>Each dot = ~1km of national road. The collision rate compares injury collisions on that section against the average for its road type (motorway, dual carriageway, rural 2-lane, or urban). A section with 5 collisions on a quiet rural road is far more dangerous than 5 on a busy motorway.</div>
          </div>
          {/* Warning about coverage */}
          <div style={{background:"#1a0808",border:"1px solid #331111",borderRadius:4,padding:"8px 10px"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:X.r,marginBottom:2}}>⚠ NATIONAL ROADS ONLY — 6%</div>
            <div style={{fontFamily:F.b,fontSize:11,color:"#999",lineHeight:1.4}}>This map shows TII data for national roads. The 94% of roads managed by local authorities — where most deaths occur — has no publicly available collision data. The RSA removed it in 2023.</div>
          </div>
          {/* Selected site detail */}
          {selSite&&<div style={{background:"#1a1208",border:`1px solid ${X.o}`,borderRadius:4,padding:"10px 12px"}}>
            <div style={{fontFamily:F.h,fontSize:18,color:X.o}}>{selSite[2]} · Co. {selSite[3]}</div>
            <div style={{fontFamily:F.b,fontSize:12,color:X.t,marginTop:4}}><strong style={{color:"#fff",fontSize:16}}>{selSite[4]}</strong> injury collision{selSite[4]!==1?"s":""} on this ~1km section (2022–2024)</div>
            <div style={{fontFamily:F.b,fontSize:12,color:selSite[5]===1?X.r:X.o,marginTop:4}}>{selSite[5]===1?"Rate is 2× above average":"Rate is above average"} for this road type</div>
            <div style={{fontFamily:F.m,fontSize:10,color:"#777",marginTop:6,lineHeight:1.4}}>This is injury collisions, not deaths — but each one could have been fatal. TII ranks every ~1km section against comparable roads. This section stands out as significantly worse than similar roads elsewhere.</div>
          </div>}
          {/* County picker (compact) */}
          <div style={{background:"#0d0d0d",border:"1px solid #222",borderRadius:4,padding:"8px 10px"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:X.l,marginBottom:4}}>FILTER BY COUNTY</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
              {Object.entries(COUNTIES).filter(([_,d])=>d.j==="ROI").sort((a,b)=>a[0].localeCompare(b[0])).map(([name])=>{
                const count=COLLISIONS.filter(s=>s[3]===name).length;
                if(!count)return null;
                return <button key={name} onClick={()=>{setRCounty(name);setSelSite(null);setRSent(false)}} style={{
                  background:rCounty===name?X.o:"#1a1a1a",color:rCounty===name?"#000":"#aaa",
                  border:`1px solid ${rCounty===name?X.o:"#2a2a2a"}`,borderRadius:3,padding:"2px 6px",
                  cursor:"pointer",fontFamily:F.m,fontSize:9,
                }}>{name} <span style={{opacity:0.6}}>{count}</span></button>;
              })}
            </div>
          </div>
        </div>
      </div>
      <div style={{fontFamily:F.m,fontSize:9,color:"#555",marginTop:6}}>Source: Transport Infrastructure Ireland, Network Safety Ranking 2022–2024. Licensed under CC BY 4.0. National roads only (~6% of network).</div>
    </div>

    {/* Step 2: Road details */}
    {rCounty&&<div style={sec}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:32,height:32,borderRadius:"50%",background:X.o,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.h,fontSize:18,color:"#000"}}>{selSite?"✓":"2"}</div><div style={{fontFamily:F.h,fontSize:24,color:"#fff"}}>{selSite?`REPORT ${selSite[2]} IN ${rCounty.toUpperCase()}`:"DESCRIBE THE ROAD"}</div></div>
      <div style={{fontFamily:F.b,fontSize:13,color:X.t,marginBottom:6}}>County: <strong style={{color:"#fff"}}>{rCounty}</strong> — {COUNTIES[rCounty]?.d||0} deaths in 2025. {COLLISIONS.filter(s=>s[3]===rCounty&&s[5]===1).length} highest-risk sites on national roads alone.</div>
      <div style={{marginBottom:12}}>
        <label style={{fontFamily:F.m,fontSize:10,color:X.l,display:"block",marginBottom:4}}>ROAD NAME / NUMBER</label>
        <input value={rRoad} onChange={e=>setRRoad(e.target.value)} placeholder="e.g. R236, N25, Listowel Road" style={{
          width:"100%",background:"#0a0a0a",border:"1px solid #333",borderRadius:4,padding:"10px 14px",
          color:"#fff",fontFamily:F.b,fontSize:14,outline:"none",boxSizing:"border-box",
        }}/>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{fontFamily:F.m,fontSize:10,color:X.l,display:"block",marginBottom:4}}>SPECIFIC LOCATION (junction, townland, landmark)</label>
        <input value={rLocation} onChange={e=>setRLocation(e.target.value)} placeholder="e.g. junction at Trieneragh, near Moycullen church" style={{
          width:"100%",background:"#0a0a0a",border:"1px solid #333",borderRadius:4,padding:"10px 14px",
          color:"#fff",fontFamily:F.b,fontSize:14,outline:"none",boxSizing:"border-box",
        }}/>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{fontFamily:F.m,fontSize:10,color:X.l,display:"block",marginBottom:4}}>WHAT MAKES THIS ROAD DANGEROUS?</label>
        <textarea value={rDesc} onChange={e=>setRDesc(e.target.value)} rows={3} placeholder="e.g. No road markings, blind junction, narrow with no hard shoulder, history of crashes..." style={{
          width:"100%",background:"#0a0a0a",border:"1px solid #333",borderRadius:4,padding:"10px 14px",
          color:"#fff",fontFamily:F.b,fontSize:14,outline:"none",resize:"vertical",boxSizing:"border-box",
        }}/>
      </div>
    </div>}

    {/* Step 3: Email TDs */}
    {rCounty&&rRoad&&!isNI&&<div style={sec}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:32,height:32,borderRadius:"50%",background:X.o,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.h,fontSize:18,color:"#000"}}>3</div><div style={{fontFamily:F.h,fontSize:24,color:"#fff"}}>EMAIL YOUR TDs ABOUT THIS ROAD</div></div>
      {cons.map(con=>{
        const reps=TDS[con];
        if(!reps)return null;
        return(<div key={con} style={{marginBottom:8}}>
          <div style={{fontFamily:F.h,fontSize:14,color:X.o,marginBottom:4}}>{con.toUpperCase()}</div>
          {reps.map((rep,i)=>{
            const email=makeEmail(rep.n,false);
            const subject=`Dangerous Road Report: ${rRoad}, Co. ${rCounty}`;
            const body=roadEmailBody.replace("[TD/MLA name]",rep.n);
            const mailto=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            return(<a key={i} href={mailto} onClick={()=>setRSent(true)} style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"8px 12px",background:"#0a0a0a",border:"1px solid #222",borderRadius:3,
              textDecoration:"none",cursor:"pointer",marginBottom:4,
            }}>
              <div>
                <div style={{fontFamily:F.b,fontSize:14,color:"#fff",fontWeight:500}}>{rep.n}</div>
                <div style={{fontFamily:F.m,fontSize:10,color:X.l}}>{rep.p} · {email}</div>
              </div>
              <div style={{fontFamily:F.h,fontSize:14,color:X.o,whiteSpace:"nowrap"}}>EMAIL →</div>
            </a>);
          })}
        </div>);
      })}
      {rSent&&<div style={{background:"#0a2a1a",border:`1px solid ${X.c}`,borderRadius:4,padding:"12px 16px",marginTop:8}}>
        <div style={{fontFamily:F.h,fontSize:16,color:X.c}}>EMAIL SENT — THANK YOU</div>
        <div style={{fontFamily:F.b,fontSize:12,color:X.t}}>Your TD now has a specific road, a specific concern, and three specific asks.</div>
      </div>}
    </div>}

    {/* NI version */}
    {rCounty&&rRoad&&isNI&&<div style={sec}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:32,height:32,borderRadius:"50%",background:X.o,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.h,fontSize:18,color:"#000"}}>3</div><div style={{fontFamily:F.h,fontSize:24,color:"#fff"}}>EMAIL YOUR MLAs ABOUT THIS ROAD</div></div>
      {cons.map(con=>{
        const reps=MLAS[con];
        if(!reps)return null;
        return(<div key={con} style={{marginBottom:8}}>
          <div style={{fontFamily:F.h,fontSize:14,color:X.o,marginBottom:4}}>{con.toUpperCase()}</div>
          {reps.map((rep,i)=>{
            const email=makeEmail(rep.n,true);
            const subject=`Dangerous Road Report: ${rRoad}, Co. ${rCounty}`;
            const body=roadEmailBody.replace("[TD/MLA name]",rep.n);
            const mailto=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            return(<a key={i} href={mailto} onClick={()=>setRSent(true)} style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"8px 12px",background:"#0a0a0a",border:"1px solid #222",borderRadius:3,
              textDecoration:"none",cursor:"pointer",marginBottom:4,
            }}>
              <div>
                <div style={{fontFamily:F.b,fontSize:14,color:"#fff",fontWeight:500}}>{rep.n}</div>
                <div style={{fontFamily:F.m,fontSize:10,color:X.l}}>{rep.p} · {email}</div>
              </div>
              <div style={{fontFamily:F.h,fontSize:14,color:X.o,whiteSpace:"nowrap"}}>EMAIL →</div>
            </a>);
          })}
        </div>);
      })}
    </div>}

    {/* Data scandal */}
    <div style={{...sec,borderLeft:`3px solid ${X.r}`,background:"#1a0808"}}>
      <div style={{fontFamily:F.h,fontSize:20,color:X.r,marginBottom:8}}>THE 94% THAT'S MISSING</div>
      <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.6}}>
        The map above shows collision data for <strong style={{color:"#fff"}}>national roads only</strong> — roughly 6% of Ireland's road network. TII has always had access under the EU RISM Directive. The other 94% — regional and local roads managed by 31 local authorities — has <strong style={{color:X.r}}>no publicly available collision location data at all</strong>.<br/><br/>
        Until 2020, the RSA shared this data through an interactive mapping system. In November 2023, the LGMA removed all historical data. The Data Protection Commission confirmed GDPR does not prevent sharing. The NVDF Bill to restore access has missed three deadlines. Ireland independently investigates marine incidents (MAIU) and rail incidents (RAIU) with published reports. Roads has no equivalent.<br/><br/>
        <strong style={{color:"#fff"}}>If you know a dangerous road not shown on this map — that's the point.</strong> Report it above. Your TD should be asking why engineers can't see where people are dying.
      </div>
    </div>
  </div>);
}

function SupportersPage({onAct}){
  const hasSupporters = SUPPORTERS.length > 0;
  const cats = {};
  SUPPORTERS.forEach(s => {
    if (!cats[s.cat]) cats[s.cat] = [];
    cats[s.cat].push(s);
  });
  const sec={background:X.bg,border:`1px solid ${X.br}`,borderRadius:6,padding:"24px 28px",marginBottom:16};
  const txt={fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.7};
  const hdr=(text,color=X.c)=>(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{width:4,height:28,background:color,borderRadius:2}}/><div style={{fontFamily:F.h,fontSize:26,color:"#fff"}}>{text}</div></div>);

  return(<div style={{maxWidth:800,margin:"0 auto"}}>
    {/* Hero */}
    <div style={{textAlign:"center",marginBottom:28}}>
      <div style={{fontFamily:F.h,fontSize:48,color:"#fff",letterSpacing:"0.03em"}}>SUPPORTERS PROGRAMME</div>
      <div style={{...txt,fontSize:15,marginTop:8,maxWidth:600,margin:"8px auto 0"}}>
        247 people killed on Irish roads in 2025. The organisations listed here have publicly endorsed five structural demands for reform. This is not a petition — it is a professional coalition demanding accountability from Government.
      </div>
    </div>

    {/* Supporter logos — if any exist */}
    {hasSupporters && (<>
      <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <div style={{background:"#0a0a0a",border:`1px solid ${X.br}`,borderRadius:6,padding:"16px 28px",textAlign:"center",borderTop:`2px solid ${X.c}`}}>
          <div style={{fontFamily:F.h,fontSize:48,color:X.c}}>{SUPPORTERS.length}</div>
          <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:X.l}}>ORGANISATIONS</div>
        </div>
        <div style={{background:"#0a0a0a",border:`1px solid ${X.br}`,borderRadius:6,padding:"16px 28px",textAlign:"center",borderTop:`2px solid ${X.g}`}}>
          <div style={{fontFamily:F.h,fontSize:48,color:X.g}}>{Object.keys(cats).length}</div>
          <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:X.l}}>SECTORS</div>
        </div>
      </div>

      {Object.entries(cats).map(([catId, orgs]) => {
        const catInfo = SUPPORTER_CATS[catId] || SUPPORTER_CATS.other;
        return (
          <div key={catId} style={{...sec, borderLeft:`3px solid ${catInfo.color}`}}>
            <div style={{fontFamily:F.m,fontSize:10,letterSpacing:"0.15em",color:catInfo.color,marginBottom:14}}>{catInfo.label}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",gap:12}}>
              {orgs.map((org, i) => (
                <div key={i} style={{
                  background:"#0a0a0a",border:"1px solid #222",borderRadius:6,
                  padding:"16px 18px",display:"flex",flexDirection:"column",alignItems:"center",
                  gap:10,textAlign:"center",
                  cursor: org.url ? "pointer" : "default",
                }} onClick={() => org.url && window.open(org.url, '_blank')}>
                  {org.logo ? (
                    <div style={{width:80,height:50,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <img src={org.logo} alt={org.name} style={{maxWidth:80,maxHeight:50,objectFit:"contain",filter:"brightness(0.95)"}} onError={(e)=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
                      <div style={{display:"none",width:50,height:50,borderRadius:"50%",background:"#1a1a1a",border:`1px solid ${catInfo.color}`,alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontFamily:F.h,fontSize:22,color:catInfo.color}}>{org.name.charAt(0)}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{width:50,height:50,borderRadius:"50%",background:"#1a1a1a",border:`1px solid ${catInfo.color}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontFamily:F.h,fontSize:22,color:catInfo.color}}>{org.name.charAt(0)}</span>
                    </div>
                  )}
                  <div style={{fontFamily:F.b,fontSize:14,color:"#fff",fontWeight:600,lineHeight:1.3}}>{org.name}</div>
                  {org.url && <div style={{fontFamily:F.m,fontSize:9,color:catInfo.color}}>↗ WEBSITE</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{height:1,background:X.br,margin:"24px 0"}}/>
    </>)}

    {/* THE PROGRAMME — always visible */}
    <div style={{...sec,borderTop:`2px solid ${X.c}`}}>
      {hdr("WHAT YOUR ORGANISATION IS ENDORSING")}
      <div style={{...txt,marginBottom:16}}>
        By joining, your organisation publicly endorses our five structural demands. These are not aspirations — they are specific, binary asks directed at every TD and MLA. Yes or no. No wiggle room.
      </div>
      <div style={{display:"grid",gap:8}}>
        {DEMANDS.map(d=>(
          <div key={d.id} style={{display:"flex",gap:12,padding:"10px 14px",background:"#0a0a0a",border:"1px solid #222",borderRadius:4,alignItems:"baseline"}}>
            <div style={{fontFamily:F.h,fontSize:22,color:X.r,minWidth:20}}>{d.id}</div>
            <div>
              <div style={{fontFamily:F.b,fontSize:13,color:"#fff",fontWeight:600}}>{d.short}</div>
              <div style={{fontFamily:F.b,fontSize:12,color:"#999",marginTop:2,lineHeight:1.5}}>{d.detail.length > 120 ? d.detail.slice(0,120)+"…" : d.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:F.m,fontSize:10,color:X.c,marginTop:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{onAct&&onAct();window.scrollTo(0,0)}}>READ THE FULL DEMANDS →</div>
    </div>

    {/* What you get */}
    <div style={{...sec,borderTop:`2px solid ${X.g}`}}>
      {hdr("WHAT SUPPORTING ORGANISATIONS RECEIVE",X.g)}
      <div style={{display:"grid",gap:10}}>
        {[
          {icon:"◉",title:"PUBLIC LISTING",desc:"Your organisation's name and logo on this page — visible to every TD, MLA, journalist, and member of the public who visits the site. Politicians notice when professional bodies line up behind a campaign."},
          {icon:"◈",title:"EARLY ACCESS TO CAMPAIGN DATA",desc:"Parliamentary Question answers, enforcement data, crash statistics, and analysis — shared with supporting organisations before public release. You'll have the numbers before the media does."},
          {icon:"◇",title:"CO-SIGN JOINT STATEMENTS",desc:"When we write open letters to Ministers, publish responses to Government announcements, or issue public statements, supporting organisations are invited to co-sign. Collective weight amplifies every voice."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 18px",background:"#0a0a0a",border:"1px solid #222",borderRadius:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontFamily:F.h,fontSize:18,color:X.g}}>{item.icon}</span>
              <span style={{fontFamily:F.h,fontSize:16,color:"#fff"}}>{item.title}</span>
            </div>
            <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>

    {/* What it costs */}
    <div style={{...sec,borderLeft:`3px solid ${X.r}`}}>
      {hdr("WHAT IT COSTS",X.r)}
      <div style={{...txt}}>
        Nothing. There is no financial commitment, membership fee, or operational obligation. You are lending your organisation's name and credibility to five specific demands for structural reform. You can withdraw at any time by emailing us. That's it.
      </div>
    </div>

    {/* Who we're looking for */}
    <div style={{...sec,borderTop:`2px solid ${X.o}`}}>
      {hdr("WHO WE'RE LOOKING FOR",X.o)}
      <div style={{...txt,marginBottom:14}}>
        Any organisation that believes 247 deaths a year is a governance failure — not an inevitability — and is willing to say so publicly.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {Object.entries(SUPPORTER_CATS).map(([id,cat])=>(
          <div key={id} style={{padding:"10px 14px",background:"#0a0a0a",border:"1px solid #222",borderRadius:4,borderLeft:`3px solid ${cat.color}`}}>
            <div style={{fontFamily:F.m,fontSize:10,color:cat.color,letterSpacing:"0.1em"}}>{cat.label}</div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.6,marginTop:12}}>
        Emergency medicine · Trauma surgery · Public health · Cycling campaigns · Pedestrian safety · Urban planning · Road engineering · Insurance · Legal · Academic research · Trade unions · Community groups · Families of victims · Anyone with standing and something to say.
      </div>
    </div>

    {/* How to join */}
    <div style={{background:"#0a1a1a",border:`1px solid ${X.c}`,borderRadius:6,padding:"28px 32px",marginBottom:16,textAlign:"center"}}>
      <div style={{fontFamily:F.h,fontSize:32,color:X.c,marginBottom:10}}>JOIN THE COALITION</div>
      <div style={{...txt,marginBottom:6,maxWidth:520,margin:"0 auto 16px"}}>
        Email us with your organisation's name, logo, and website. We'll confirm and add you within 48 hours.
      </div>
      <a href="mailto:campaign@stoproaddeaths.ie?subject=Supporters%20Programme%20—%20stoproaddeaths.ie&body=Organisation%20name%3A%20%0AContact%20person%3A%20%0ARole%20%2F%20title%3A%20%0AWebsite%3A%20%0ALogo%20(attach%20or%20link)%3A%20%0A%0AWe%20endorse%20the%20five%20structural%20demands%20at%20stoproaddeaths.ie%20and%20wish%20to%20be%20listed%20as%20a%20supporting%20organisation.%0A%0ASigned%3A%20" style={{
        display:"inline-block",background:X.c,color:"#000",padding:"14px 28px",borderRadius:4,
        fontFamily:F.h,fontSize:18,textDecoration:"none",letterSpacing:"0.04em"
      }}>PLEDGE YOUR SUPPORT →</a>
      <div style={{fontFamily:F.m,fontSize:10,color:"#888",marginTop:12}}>campaign@stoproaddeaths.ie</div>
    </div>

    {/* FAQ */}
    <div style={{...sec}}>
      {hdr("COMMON QUESTIONS","#888")}
      {[
        {q:"Does endorsing mean we agree with everything on the site?",a:"No. You are endorsing the five structural demands only. The site contains data, analysis, and campaign materials — your endorsement covers the demands, not every data point or editorial choice."},
        {q:"Can we endorse some demands but not others?",a:"We'd prefer full endorsement of all five, since they form a coherent package. But if your organisation has a specific concern, email us and we'll discuss it. We'd rather have you partially in than fully out."},
        {q:"Will you use our logo in ways we haven't approved?",a:"Your logo appears on this page and nowhere else without your explicit consent. If we want to use it in a letter, press release, or any other material, we'll ask first."},
        {q:"What if our position changes?",a:"Email us and we'll remove you within 24 hours. No questions, no hard feelings."},
        {q:"We're a public body — can we still endorse?",a:"That depends on your governance rules. Some public bodies can endorse policy positions; others can't. If you can issue a statement of support rather than a formal endorsement, we can list you with that framing. Talk to us."},
      ].map((faq,i)=>(
        <div key={i} style={{padding:"12px 0",borderBottom:i<4?`1px solid ${X.br}`:"none"}}>
          <div style={{fontFamily:F.b,fontSize:14,color:"#fff",fontWeight:600,marginBottom:4}}>{faq.q}</div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.6}}>{faq.a}</div>
        </div>
      ))}
    </div>

    <div style={{textAlign:"center",margin:"24px 0"}}>
      <button onClick={()=>{onAct&&onAct();window.scrollTo(0,0)}} style={{background:X.r,color:"#fff",border:"none",padding:"12px 24px",borderRadius:4,fontFamily:F.h,fontSize:16,cursor:"pointer"}}>READ THE FIVE DEMANDS →</button>
    </div>
  </div>);
}

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
  const tabs=[{id:"map",l:"WHERE"},{id:"when",l:"WHEN"},{id:"trend",l:"TREND"},{id:"who",l:"WHO"},{id:"latest",l:"2026"},{id:"report",l:"⚠ REPORT A ROAD"},{id:"tracker",l:"TD TRACKER"},{id:"pqs",l:"PQ TRACKER"},{id:"demands",l:"DEMANDS"},{id:"supporters",l:"SUPPORTERS"},{id:"act",l:"TAKE ACTION"}];
  return(<div style={{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:F.b}}>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
    <style>{`
      .map-grid{display:grid;grid-template-columns:1fr 380px;gap:18px;min-height:520px}
      .map-sidebar{display:flex;flex-direction:column;gap:10px;overflow-y:auto;max-height:600px}
      .tracker-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px}
      .report-map-grid{display:grid;grid-template-columns:1fr 260px;gap:12px;min-height:460px}
      @media(max-width:800px){
        .map-grid{grid-template-columns:1fr;min-height:auto}
        .map-sidebar{max-height:none}
        .tracker-stats{grid-template-columns:1fr 1fr}
        .report-map-grid{grid-template-columns:1fr;min-height:auto}
      }
    `}</style>
    <div style={{borderBottom:"1px solid #282828",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:X.r,boxShadow:`0 0 8px ${X.r}`}}/><span style={{fontFamily:F.h,fontSize:20,letterSpacing:"0.1em"}}>#NotAStatistic</span></div>
      <div style={{fontFamily:F.m,fontSize:10,color:"#999"}}>ALL-ISLAND · RSA + PSNI · APR 2026</div>
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
        background:tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"||t.id==="pqs"||t.id==="supporters"?X.c:t.id==="report"?X.o:X.r):X.bg,border:`1px solid ${tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"||t.id==="pqs"||t.id==="supporters"?X.c:t.id==="report"?X.o:X.r):X.br}`,
        color:tab===t.id?(t.id==="act"||t.id==="tracker"||t.id==="demands"||t.id==="pqs"||t.id==="report"||t.id==="supporters"?"#000":"#fff"):"#aaa",padding:"9px 16px",borderRadius:4,cursor:"pointer",
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
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,lineHeight:1.7,marginTop:14}}>The yellow line shows where Ireland would be if it had matched the EU average decline in road deaths (~3% per year). By 2025, that would mean 164 deaths — not 247. That gap is <strong style={{color:X.r}}>83 extra people killed</strong> because Ireland went backwards while the rest of Europe improved. The teal line is the government's own 2030 target (~120 all-island). Ireland is more than double it. The hatched 2026 bar shows 54 people killed in 14 weeks — annualised, that's a pace of <strong style={{color:X.r}}>~200 deaths</strong>, on track for the worst years of the decade.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}><Stat label="VS GOVT TARGET" value="+127" sub="Above ~120 target" accent={X.c}/><Stat label="ACTUAL" value="247" sub="All-island 2025"/><Stat label="VS EU AVERAGE" value="+83" sub="Extra deaths" accent={X.g}/><Stat label="2026 PACE" value="~200" sub="54 killed in 14 weeks" accent={X.o}/></div>
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
          <div style={{fontFamily:F.h,fontSize:56,color:X.r}}>49+</div>
          <div style={{fontFamily:F.h,fontSize:20,color:"#fff"}}>KILLED ACROSS THE ISLAND · 2026</div>
          <div style={{display:"flex",justifyContent:"center",gap:28,marginTop:14}}>
            <div style={{textAlign:"center"}}><div style={{fontFamily:F.h,fontSize:36,color:X.r}}>30</div><div style={{fontFamily:F.m,fontSize:11,color:X.t}}>REPUBLIC</div></div>
            <div style={{width:1,background:"#444"}}/>
            <div style={{textAlign:"center"}}><div style={{fontFamily:F.h,fontSize:36,color:X.o}}>16</div><div style={{fontFamily:F.m,fontSize:11,color:X.t}}>NORTHERN IRELAND</div></div>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:X.t,marginTop:12}}>At this pace, 2026 will exceed 2025. The government's 2030 target requires 72 deaths. We are annualising above 150 in the Republic alone.</div>
        </div>
        {/* Deadliest weekend banner */}
        <div style={{background:"#1a0a0a",border:"1px solid rgba(255,26,26,0.3)",borderRadius:4,padding:"16px 20px",marginBottom:16}}>
          <div style={{fontFamily:F.h,fontSize:18,color:X.r,marginBottom:4}}>DEADLIEST WEEKEND — 22–25 APR 2026</div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.6}}>Man (20s) killed on the N4 in Westmeath, 15 March. Two killed in Co Meath on 12 March — a woman (40s) in a two-car collision on the N51, a man (40s) in a truck-van collision on the M3. A teenage girl airlifted to Temple Street. Earlier: Mia Lily Keogh O'Keeffe (16), hit-and-run, Navan. Brian and Grace Frisby (40s), parents of two, Waterford. Three parents killed in a single crash, Armagh. Daniel Cullen (18) and Caoimhín Porter-McLoone (18), St Johnston, Donegal.</div>
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
        const answered=PQS.filter(p=>p.status==="answered"||p.status==="repeat"||p.status==="partial");
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
            <div style={{fontFamily:F.h,fontSize:20,color:X.c}}>NVDF BILL — FOUR DEADLINES AND COUNTING</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Buckley · Whitmore · Currie · Kerrane</span>
          </div>
          <div style={{display:"flex",gap:0,marginBottom:12,position:"relative"}}>
            {[{date:"MAY 2025",promise:"'Enacted by year-end'",who:"Canney to JOC",missed:true},
              {date:"APR 2026",promise:"'Summer 2026'",who:"Canney to Whitmore",missed:true},
              {date:"MAR 2026",promise:"'Coming weeks'",who:"Canney to Buckley",missed:true},
              {date:"18 MAR 2026",promise:"'By the summer'",who:"Canney to Kerrane",missed:false},
            ].map((d,i)=>(<div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
              {i>0&&<div style={{position:"absolute",left:0,top:12,width:"50%",height:2,background:d.missed?X.r:"#444"}}/>}
              {i<3&&<div style={{position:"absolute",right:0,top:12,width:"50%",height:2,background:d.missed?X.r:"#444"}}/>}
              <div style={{width:24,height:24,borderRadius:"50%",background:d.missed?X.r:"#444",border:`2px solid ${d.missed?X.r:X.c}`,margin:"0 auto",position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {d.missed&&<span style={{color:"#fff",fontSize:12,fontFamily:F.h}}>✗</span>}
              </div>
              <div style={{fontFamily:F.m,fontSize:8,color:d.missed?X.r:X.c,marginTop:6}}>{d.date}</div>
              <div style={{fontFamily:F.b,fontSize:10,color:"#fff",marginTop:2}}>{d.promise}</div>
              <div style={{fontFamily:F.m,fontSize:8,color:"#666",marginTop:1}}>{d.who}</div>
            </div>))}
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5}}>
            Local authority road engineers have been unable to see where crashes are happening on their roads since November 2023. The Data Protection Commission said in April 2024 that GDPR should not prevent sharing this data. The Bill to fix it has missed every deadline. Each new promise is vaguer than the last.
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
        {/* Pattern 6: Commissioner asked 7 times across two jurisdictions — 18-24 March */}
        <div style={{background:"#1a0808",border:"1px solid rgba(255,26,26,0.4)",borderRadius:6,padding:"18px 22px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:20,color:X.r}}>COMMISSIONER — ASKED 7 TIMES, ANSWERED 0</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>18–24 Mar 2026</span>
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.5,marginBottom:10}}>
            Six elected representatives from four parties across both jurisdictions asked their governments about the Road Safety Commissioner model — and one TD asked a second time on 24 March. All seven received dismissive responses. The word "Commissioner" does not appear in any answer. Neither do Sweden, Norway, or Finland.
          </div>
          <div style={{fontFamily:F.m,fontSize:10,color:X.l,marginBottom:6}}>DÁIL ÉIREANN — 5 TDs, 18 MARCH</div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
            {[{n:"Cathal Crowe",p:"FF",con:"Clare",pq:"231"},{n:"John Paul O'Shea",p:"FG",con:"Cork North-West",pq:"250"},{n:"Barry Heneghan",p:"Ind",con:"Dublin Bay North",pq:"263"},{n:"Pat the Cope Gallagher",p:"FF",con:"Donegal",pq:"279"},{n:"Seán Ó Fearghaíl",p:"FF",con:"Kildare South",pq:"343"}].map((td,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#0a0a0a",border:"1px solid #222",borderRadius:3}}>
                <span style={{fontFamily:F.m,fontSize:10,color:"#666",minWidth:42}}>PQ {td.pq}</span>
                <span style={{fontFamily:F.b,fontSize:12,color:"#fff",flex:1}}>{td.n}</span>
                <span style={{fontFamily:F.m,fontSize:10,color:X.l}}>{td.p} · {td.con}</span>
              </div>
            ))}
          </div>
          <div style={{fontFamily:F.m,fontSize:10,color:X.o,marginBottom:6}}>NI ASSEMBLY — 1 MLA, 19 MARCH</div>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#0a0a0a",border:`1px solid ${X.o}40`,borderRadius:3}}>
              <span style={{fontFamily:F.m,fontSize:10,color:"#666",minWidth:42}}>AQW</span>
              <span style={{fontFamily:F.b,fontSize:12,color:"#fff",flex:1}}>Mark H. Durkan</span>
              <span style={{fontFamily:F.m,fontSize:10,color:X.l}}>SDLP · Foyle</span>
            </div>
          </div>
          <div style={{fontFamily:F.b,fontSize:14,color:"#fff",lineHeight:1.5,padding:"12px 16px",background:"rgba(255,26,26,0.08)",border:"1px solid rgba(255,26,26,0.2)",borderRadius:4,borderLeft:`3px solid ${X.r}`,marginBottom:8}}>
            Dublin: <strong style={{color:X.r}}>"high-profile road safety ambassadors"</strong><br/>
            Belfast: <strong style={{color:X.o}}>"I am not considering appointing a Road Safety Commissioner at this time."</strong>
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5}}>
            Both governments reject the Commissioner model. In Dublin, the Minister's alternative is ambassadors and a quarterly meeting. In Belfast, Minister Kimmins (SF) flatly rejected it — while her own party's 65 TDs and MLAs support it through this campaign. <strong style={{color:X.r}}>Nobody holds the 2030 target on either side of the border.</strong>
          </div>
        </div>
        {/* Pattern 7: Every structural question gets a comms answer */}
        <div style={{background:"#1a1008",border:"1px solid rgba(255,107,53,0.4)",borderRadius:6,padding:"18px 22px",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <div style={{fontFamily:F.h,fontSize:20,color:X.o}}>STRUCTURAL QUESTIONS → AWARENESS CAMPAIGNS</div>
            <span style={{fontFamily:F.m,fontSize:9,color:"#888"}}>Pattern across 18 Mar answers</span>
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:X.t,lineHeight:1.5,marginBottom:12}}>
            On 18 March, TDs asked about governance, accountability, and protecting vulnerable road users. Every structural question received a communications answer:
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
            {[{q:"5 TDs ask about a statutory Commissioner",a:"→ \"high-profile road safety ambassadors\""},
              {q:"2 TDs ask who holds the 2030 target",a:"→ \"a quarterly meeting I chair\""},
              {q:"Ward asks how to protect pedestrians & cyclists",a:"→ free high-vis vests and armbands"},
              {q:"Kerrane asks what actions beyond the strategy",a:"→ \"Be Safe, Be Seen\" campaign (€18m/year)"}
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#0a0a0a",border:"1px solid #222",borderRadius:4}}>
                <span style={{fontFamily:F.b,fontSize:12,color:"#ddd",flex:1}}>{r.q}</span>
                <span style={{fontFamily:F.b,fontSize:12,color:X.o,textAlign:"right",minWidth:180}}>{r.a}</span>
              </div>
            ))}
          </div>
          <div style={{fontFamily:F.b,fontSize:13,color:"#999",lineHeight:1.5}}>
            Ireland's institutional response to 247 deaths and a 31% increase in five years is publicity. Commissioner → ambassadors. Infrastructure → vests. Enforcement → campaigns. <strong style={{color:X.o}}>The pattern is now documented across the Dáil record.</strong>
          </div>
        </div>
        {/* === FULL PQ LIST (expandable) === */}
        <div style={{fontFamily:F.m,fontSize:11,letterSpacing:"0.15em",color:X.g,marginBottom:10}}>ALL {PQS.length} PARLIAMENTARY QUESTIONS — CLICK TO EXPAND</div>
        {PQS.map((pq,i)=>{
          const isOpen=expandedPQ===i;
          const sc=pq.status==="answered"?X.g:pq.status==="repeat"?"#888":pq.status==="partial"?X.r:X.o;
          const sl=pq.status==="answered"?"ANSWERED":pq.status==="repeat"?"REPEAT":pq.status==="partial"?"PARTIAL":"AWAITING";
          return(<div key={`pq${i}`} style={{marginBottom:4}}>
            <div onClick={()=>setExpandedPQ(isOpen?null:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:isOpen?"#1a1a1a":"#0d0d0d",border:`1px solid ${isOpen?"#444":"#222"}`,borderLeft:`3px solid ${sc}`,borderRadius:isOpen?"4px 4px 0 0":4,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
                <span style={{fontFamily:F.b,fontSize:13,color:"#fff",fontWeight:500}}>{pq.td}</span>
                <span style={{fontFamily:F.m,fontSize:10,color:X.l}}>{pq.p}</span>
                {(pq.status==="answered"||pq.status==="partial")&&pq.assessment&&<span style={{fontFamily:F.b,fontSize:11,color:"#888",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pq.assessment.split('.')[0]}</span>}
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
      {tab==="report"&&<ReportPage/>}
      {tab==="supporters"&&<SupportersPage onAct={()=>setTab("demands")}/>}
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
