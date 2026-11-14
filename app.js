//
// YEAR WHEEL
//

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const centerX = 300;
const centerY = 300;
const radius = 200;

const months = [
"Jan","Feb","Mar","Apr",
"May","Jun","Jul","Aug",
"Sep","Oct","Nov","Dec"
];

ctx.strokeStyle = "#26374d";
ctx.lineWidth = 40;

ctx.beginPath();
ctx.arc(centerX,centerY,radius,0,Math.PI*2);
ctx.stroke();

for(let i=0;i<12;i++){

 const angle = (Math.PI*2/12)*i - Math.PI/2;

 const x = centerX + Math.cos(angle)*250;
 const y = centerY + Math.sin(angle)*250;

 ctx.fillStyle = "#ffffff";
 ctx.font = "18px Segoe UI";
 ctx.textAlign = "center";

 ctx.fillText(months[i],x,y);
}

const trips = [

{start:1,end:2,color:"#4cc9f0"},
{start:3,end:4,color:"#8b5cf6"},
{start:6,end:7,color:"#34d399"},
{start:9,end:10,color:"#f59e0b"}

];

trips.forEach(trip=>{

 ctx.beginPath();

 ctx.strokeStyle = trip.color;

 ctx.shadowBlur = 20;
 ctx.shadowColor = trip.color;

 ctx.lineWidth = 40;

 ctx.arc(
   centerX,
   centerY,
   radius,
   (trip.start/12)*Math.PI*2 - Math.PI/2,
   (trip.end/12)*Math.PI*2 - Math.PI/2
 );

 ctx.stroke();

});

ctx.shadowBlur = 0;

ctx.fillStyle = "#ffffff";
ctx.font = "bold 36px Segoe UI";
ctx.fillText("2027",300,315);

//
// WORLD MAP
//

const map = L.map('map').setView([35,15],2);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
attribution:'&copy; OpenStreetMap'
}
).addTo(map);

const locations = [

{
name:"Mallorca",
lat:39.6953,
lng:3.0176
},

{
name:"London",
lat:51.5072,
lng:-0.1276
},

{
name:"Tokyo",
lat:35.6764,
lng:139.65
},

{
name:"New York",
lat:40.7128,
lng:-74.0060
},

{
name:"Bishkek",
lat:42.8746,
lng:74.5698
}

];

locations.forEach(location => {

L.marker([
location.lat,
location.lng
])
.addTo(map)
.bindPopup(
`<b>${location.name}</b>`
);

});

//
// FLIGHT ROUTE
//

const route = locations.map(l => [
l.lat,
l.lng
]);

L.polyline(
route,
{
color:'#4cc9f0',
weight:3,
opacity:0.8
}
).addTo(map);