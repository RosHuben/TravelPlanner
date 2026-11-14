async function init() {

  const response = await fetch("trips.json");
  const trips = await response.json();

  buildDashboard(trips);

}

function buildDashboard(trips){

  buildStats(trips);
  buildTimeline(trips);
  buildInsights(trips);
  buildMap(trips);
  buildYearWheel(trips);

}

function daysBetween(start,end){

  const s = new Date(start);
  const e = new Date(end);

  const diff = e - s;

  return Math.round(
    diff / (1000 * 60 * 60 * 24)
  ) + 1;

}

function buildStats(trips){

  const countries = new Set();
  const continents = new Set();

  let totalDays = 0;

  trips.forEach(trip=>{

    countries.add(trip.country);
    continents.add(trip.continent);

    totalDays += daysBetween(
      trip.start,
      trip.end
    );

  });

  document.getElementById("tripCount").textContent =
    trips.length;

  document.getElementById("travelDays").textContent =
    totalDays;

  document.getElementById("countryCount").textContent =
    countries.size;

  document.getElementById("continentCount").textContent =
    continents.size;

}

function buildTimeline(trips){

  const timeline =
    document.getElementById("timeline");

  timeline.innerHTML = "";

  trips
  .sort(
    (a,b)=>
    new Date(a.start)-new Date(b.start)
  )
  .forEach(trip=>{

    timeline.innerHTML += `
      <div class="timeline-item">

        ${trip.emoji}
        ${trip.destination}

        <br>

        ${formatDate(trip.start)}
        -
        ${formatDate(trip.end)}

      </div>
    `;

  });

}

function buildInsights(trips){

  const insights =
    document.getElementById("insights");

  insights.innerHTML = "";

  let longestTrip = trips[0];
  let longestDays = 0;
  let totalDays = 0;

  trips.forEach(trip=>{

    const days =
      daysBetween(
        trip.start,
        trip.end
      );

    totalDays += days;

    if(days > longestDays){

      longestDays = days;
      longestTrip = trip;

    }

  });

  const avg =
    (
      totalDays /
      trips.length
    ).toFixed(1);

  insights.innerHTML = `

    <div class="insight">
      🏆 Longest Trip:
      ${longestTrip.destination}
      (${longestDays} days)
    </div>

    <div class="insight">
      ✈️ Average Trip Length:
      ${avg} days
    </div>

    <div class="insight">
      🌍 Countries:
      ${
        [...new Set(
          trips.map(t=>t.country)
        )].length
      }
    </div>

    <div class="insight">
      📅 Next Adventure:
      ${trips[0].destination}
    </div>

  `;

}

function buildMap(trips){

  const map =
    L.map("map")
      .setView([35,15],2);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
      "&copy; OpenStreetMap"
    }
  ).addTo(map);

  trips.forEach(trip=>{

    L.marker(
      [
        trip.lat,
        trip.lng
      ]
    )
    .addTo(map)
    .bindPopup(
      `
      <b>${trip.destination}</b>
      <br>
      ${trip.country}
      `
    );

  });

  const line = trips.map(
    t => [t.lat,t.lng]
  );

  L.polyline(
    line,
    {
      color:"#4cc9f0",
      weight:3,
      opacity:0.8
    }
  ).addTo(map);

}

function buildYearWheel(trips){

  const canvas =
    document.getElementById("wheel");

  const ctx =
    canvas.getContext("2d");

  const centerX = 300;
  const centerY = 300;
  const radius = 200;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY,
    radius,
    0,
    Math.PI*2
  );

  ctx.strokeStyle =
    "#26374d";

  ctx.lineWidth = 40;

  ctx.stroke();

  const months = [

    "Jan","Feb","Mar",
    "Apr","May","Jun",
    "Jul","Aug","Sep",
    "Oct","Nov","Dec"

  ];

  months.forEach((month,index)=>{

    const angle =
      (Math.PI*2/12)*index
      - Math.PI/2;

    const x =
      centerX +
      Math.cos(angle)*250;

    const y =
      centerY +
      Math.sin(angle)*250;

    ctx.fillStyle =
      "#ffffff";

    ctx.font =
      "18px Segoe UI";

    ctx.textAlign =
      "center";

    ctx.fillText(
      month,
      x,
      y
    );

  });

  const colors = [

    "#4cc9f0",
    "#8b5cf6",
    "#34d399",
    "#f59e0b",
    "#ef4444",
    "#14b8a6"

  ];

  trips.forEach(
    (trip,index)=>{

    const start =
      new Date(
        trip.start
      );

    const end =
      new Date(
        trip.end
      );

    const startDay =
      Math.floor(
        (start -
         new Date(
           start.getFullYear(),
           0,
           1
         )) /
         86400000
      );

    const endDay =
      Math.floor(
        (end -
         new Date(
           end.getFullYear(),
           0,
           1
         )) /
         86400000
      );

    const startAngle =
      (startDay/365)
      *
      Math.PI*2
      -
      Math.PI/2;

    const endAngle =
      (endDay/365)
      *
      Math.PI*2
      -
      Math.PI/2;

    ctx.beginPath();

    ctx.strokeStyle =
      colors[
        index %
        colors.length
      ];

    ctx.shadowBlur = 15;

    ctx.shadowColor =
      colors[
        index %
        colors.length
      ];

    ctx.lineWidth = 40;

    ctx.arc(
      centerX,
      centerY,
      radius,
      startAngle,
      endAngle
    );

    ctx.stroke();

  });

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 36px Segoe UI";

  ctx.fillText(
    "2027",
    centerX,
    centerY+15
  );

}

function formatDate(date){

  return new Date(date)
          .toLocaleDateString(
             "en-GB",
             {
               day:"numeric",
               month:"short"
             }
          );

}

init();