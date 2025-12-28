import L from "leaflet";
import { useEffect } from "react";
import { getColor } from "../utils/choropleth";

const Legend = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottommright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [
        0, 100000, 200000, 500000, 1000000, 2000000, 3000000, 5000000,
      ];

      div.style.background = "white";
      div.style.padding = "10px";
      div.style.borderRadius = "5px";
      div.style.boxShadow = "0 0 15px rgba(0,0,0, 0.2)";

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          `<i style="background:${getColor(grades[i] + 1)}"></i> ` +
          `${grades[i].toLocaleString()}${
            grades[i + 1]
              ? "&ndash;" + grades[i + 1].toLocaleString() + "<br>"
              : "+"
          }`;
      }
      return div;
    };
    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

export default Legend;
