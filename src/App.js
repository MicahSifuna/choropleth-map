import { useRef } from "react";
import { MapContainer } from "react-leaflet";
import Legend from "./components/Legend";
import MapView from "./components/MapView";
import "./App.css";

function App() {
  const mapRef = useRef();
  return (
    <div className="App">
      {/* <h1>Choropleth Map</h1> */}
      <MapContainer
        whenCreated={(map) => (mapRef.current = map)}
        center={[-0.0236, 37.9062]}
        zoom={6}
        style={{ height: "100vh" }}
      >
        <MapView />
        <Legend map={mapRef.current} />
      </MapContainer>
    </div>
  );
}

export default App;
