export function getColor(value, breaks) {
  if (typeof value !== "number") return "#ccc";

  for (let i = 0; i < breaks.length; i++) {
    if (value <= breaks[i].threshold) return breaks[i].color;
  }

  return breaks[breaks.length - 1].color;
}

// get breaks from data array

export function generateBreaks(values) {
  const colors = [
    "#FFEDA0",
    "#FED976",
    "#FEB24C",
    "#FD8D3C",
    "#FC4E2A",
    "#E31A1C",
    "#BD0026",
    "#800026",
  ];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / colors.length;

  return colors.map((color, i) => ({
    color,
    threshold: min + step * (i + 1),
  }));
}

// style the function

export function style(
  feature,
  attribute = "Total_Population19",
  breaks = null
) {
  const value = feature.properties[attribute];

  if (!breaks) {
    breaks = [
      { threshold: 100000, color: "#FED976" },
      { threshold: 200000, color: "#FEB24C" },
      { threshold: 500000, color: "#FD9D3C" },
      { threshold: 1000000, color: "#FC4E2A" },
      { threshold: 2000000, color: "#E31A1C" },
      { threshold: 3000000, color: "#BD0026" },
      { threshold: 5000000, color: "#800026" },
    ];
  }

  return {
    fillColor: getColor(value, breaks),
    weight: 1,
    color: "white",
    fillOpacity: 0.7,
  };
}
