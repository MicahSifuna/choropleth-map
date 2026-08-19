import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { style, generateBreaks } from "../utils/choropleth.js";

const CountiesLayer = ({ countiesData, attribute, breaks }) => {
  const map = useMap();

  const onEachFeature = (feature, layer) => {
    const props = feature.properties;

    layer.on("click", () => {
      // Zoom to the clicked polygon
      map.fitBounds(layer.getBounds(), {
        padding: [30, 30],
        maxZoom: 12,
      });

      layer.openPopup();
    });

    layer.bindPopup(`
      <strong>${props.NAME_1}</strong><br/>
      Total Population (2019): ${props.Total_Population19?.toLocaleString()}<br/>
      Male: ${props["Male populatio 2019"]?.toLocaleString()}<br/>
      Female: ${props["Female population 2019"]?.toLocaleString()}<br/>
      Households: ${props.Households?.toLocaleString()}<br/>
      Avg HH Size: ${props.Av_HH_Size?.toLocaleString()}<br/>
      Land Area (SqKm): ${props.LandArea?.toLocaleString()}<br/>
      Population Density: ${props["Population Density"]?.toLocaleString()}
    `);
  };

  return (
    <GeoJSON
      data={countiesData}
      style={(feature) => style(feature, attribute, breaks)}
      onEachFeature={onEachFeature}
    />
  );
};

const Legend = ({ breaks, attribute }) => {
  if (!breaks) return null;

  const sortedBreaks = [...breaks].sort((a, b) => b.threshold - a.threshold);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        right: 10,
        background: "#fff",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 10000,
        lineHeight: "1.5em",
      }}
    >
      <strong>{attribute}</strong>

      {sortedBreaks.map((b, i) => {
        const min =
          i === sortedBreaks.length - 1 ? 0 : sortedBreaks[i + 1].threshold;

        const max = b.threshold;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                backgroundColor: b.color,
                marginRight: "5px",
                border: "1px solid #999",
              }}
            />

            <span>
              {min.toLocaleString()} - {max.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const MapView = () => {
  const [countiesData, setCountiesData] = useState(null);
  const [attribute, setAttribute] = useState("Av_HH_Size");
  const [breaks, setBreaks] = useState(null);

  useEffect(() => {
    fetch("/data/counties_ready.geojson")
      .then((res) => res.json())
      .then((data) => {
        setCountiesData(data);
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  useEffect(() => {
    if (countiesData) {
      const values = countiesData.features
        .map((f) => f.properties[attribute])
        .filter((value) => value !== null && value !== undefined);

      setBreaks(generateBreaks(values));
    }
  }, [attribute, countiesData]);

  return (
    <>
      {/* Attribute selector */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <label htmlFor="attribute">Color by: </label>

        <select
          id="attribute"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
        >
          <option value="Total_Population19">Total Population 2019</option>

          <option value="Households">Households</option>

          <option value="Av_HH_Size">Avg HH Size</option>

          <option value="LandArea">LandArea</option>

          <option value="Population Density">Population Density</option>
        </select>
      </div>

      <MapContainer
        center={[-0.0236, 37.9062]}
        zoom={7}
        scrollWheelZoom={true}
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {countiesData && breaks && (
          <CountiesLayer
            countiesData={countiesData}
            attribute={attribute}
            breaks={breaks}
          />
        )}

        <Legend breaks={breaks} attribute={attribute} />
      </MapContainer>
    </>
  );
};

export default MapView;
