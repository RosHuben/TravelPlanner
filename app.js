async function init() {
  const response = await fetch("trips.json");
  const trips = await response.json();

  trips.sort(
    (a, b) =>
      new Date(a.start) -
      new Date(b.start)
  );

  buildStats(trips);
  buildTimeline(trips);
  buildInsights(trips);
  buildMap(trips);
  buildYearWheel(trips);
}

function daysBetween(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diff =
    endDate - startDate;

  return (
    Math.round(
      diff / 86400000
    ) + 1
  );
}

function formatDate(date) {
  return new Date(date)
    .toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short"
      }
    );
}

function buildStats(trips) {

  const countries =
    new Set();

  const continents =
    new Set();

  let totalDays = 0;

  trips.forEach(trip => {

    countries.add(
      trip.country
    );

    continents.add(
      trip.continent
    );

    totalDays +=
      daysBetween(
        trip.start,
        trip.end
      );
  });

  document.getElementById(
    "tripCount"
  ).textContent =
    trips.length;

  document.getElementById(
    "travelDays"
  ).textContent =
    totalDays;

  document.getElementById(
    "countryCount"
  ).textContent =
    countries.size;

  document.getElementById(
    "continentCount"
  ).textContent =
    continents.size;
}

function buildTimeline(trips) {

  const timeline =
    document.getElementById(
      "timeline"
    );

  timeline.innerHTML = "";

  trips.forEach(trip => {

    const days =
      daysBetween(
        trip.start,
        trip.end
      );

    timeline.innerHTML += `
      <div class="timeline-item">

        <strong>
        ${trip.emoji}
        ${trip.destination}
        </strong>

        <br>

        ${formatDate(
          trip.start
        )}
        -
        ${formatDate(
          trip.end
        )}

        <br>

        ${days} days

      </div>
    `;
  });
}

function buildInsights(trips) {

  const insights =
    document.getElementById(
      "insights"
    );

  let longestTrip =
    trips[0];

  let longestDays = 0;
  let totalDays = 0;

  trips.forEach(trip => {

    const days =
      daysBetween(
        trip.start,
        trip.end
      );

    totalDays += days;

    if (
      days >
      longestDays
    ) {
      longestDays = days;
      longestTrip = trip;
    }
  });

  const average =
    (
      totalDays /
      trips.length
    ).toFixed(1);

  const countries = [
    ...new Set(
      trips.map(
        trip => trip.country
      )
    )
  ];

  const today =
    new Date();

  const nextTrip =
    trips.find(
      trip =>
        new Date(
          trip.start
        ) > today
    );

  const nextDestination =
    nextTrip
      ? nextTrip.destination
      : "No upcoming trips";

  insights.innerHTML = `

    <div class="insight">
      🏆 Longest Trip:
      ${longestTrip.destination}
      (${longestDays} days)
    </div>

    <div class="insight">
      ✈️ Average Trip:
      ${average} days
    </div>

    <div class="insight">
      📅 Next Adventure:
      ${nextDestination}
    </div>

    <div class="insight">
      🌎 Countries Visited:
      ${countries.length}
    </div>

    <div class="insight">
      🗺 Countries:
      ${countries
        .sort()
        .join(", ")}
    </div>

    <div class="insight">
      ✈️ Trips Recorded:
      ${trips.length}
    </div>
  `;
}

function buildMap(trips) {

  const map =
    L.map("map");

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        "&copy; OpenStreetMap"
    }
  ).addTo(map);

  const markers = [];

  trips.forEach(trip => {

    const marker =
      L.marker([
        trip.lat,
        trip.lng
      ])
      .addTo(map)
      .bindPopup(
        `
        <b>
        ${trip.emoji}
        ${trip.destination}
        </b>

        <br>

        ${trip.country}

        <br>

        ${formatDate(
          trip.start
        )}

        -

        ${formatDate(
          trip.end
        )}
        `
      );

    markers.push(
      marker
    );
  });

  const group =
    L.featureGroup(
      markers
    );

  map.fitBounds(
    group.getBounds(),
    {
      padding: [
        40,
        40
      ]
    }
  );

  const route =
    trips.map(
      trip => [
        trip.lat,
        trip.lng
      ]
    );

  L.polyline(
    route,
    {
      color: "#4cc9f0",
      weight: 4,
      opacity: 0.8
    }
  ).addTo(map);
}

function buildYearWheel(trips) {

  const canvas =
    document.getElementById(
      "wheel"
    );

  const ctx =
    canvas.getContext(
      "2d"
    );

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const centerX = 300;
  const centerY = 300;
  const radius = 200;

  ctx.beginPath();

  ctx.arc(
    centerX,
    centerY,
    radius,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    "#26374d";

  ctx.lineWidth =
    40;

  ctx.stroke();

  const months = [
    "Jan","Feb","Mar",
    "Apr","May","Jun",
    "Jul","Aug","Sep",
    "Oct","Nov","Dec"
  ];

  months.forEach(
    (
      month,
      index
    ) => {

      const angle =
        (
          Math.PI * 2 / 12
        ) *
        index -
        Math.PI / 2;

      const x =
        centerX +
        Math.cos(angle) *
        250;

      const y =
        centerY +
        Math.sin(angle) *
        250;

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

    }
  );

  const colors = [
    "#4cc9f0",
    "#8b5cf6",
    "#34d399",
    "#f59e0b",
    "#ef4444",
    "#14b8a6"
  ];

  trips.forEach(
    (
      trip,
      index
    ) => {

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
          (
            start -
            new Date(
              start.getFullYear(),
              0,
              1
            )
          ) / 86400000
        );

      const endDay =
        Math.floor(
          (
            end -
            new Date(
              end.getFullYear(),
              0,
              1
            )
          ) / 86400000
        );

      const startAngle =
        (
          startDay /
          365
        ) *
        Math.PI *
        2 -
        Math.PI / 2;

      const endAngle =
        (
          endDay /
          365
        ) *
        Math.PI *
        2 -
        Math.PI / 2;

      const color =
        colors[
          index %
          colors.length
        ];

      ctx.beginPath();

      ctx.lineWidth =
        40;

      ctx.strokeStyle =
        color;

      ctx.shadowColor =
        color;

      ctx.shadowBlur =
        15;

      ctx.arc(
        centerX,
        centerY,
        radius,
        startAngle,
        endAngle
      );

      ctx.stroke();
    }
  );

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 36px Segoe UI";

  ctx.textAlign =
    "center";

  ctx.fillText(
    "2027",
    centerX,
    centerY + 15
  );
}

init();