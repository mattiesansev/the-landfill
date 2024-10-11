import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { React } from "react";
import "leaflet/dist/leaflet.css";

const Map = ({ coordinatesPerLandfill }) => {
  return (
    <MapContainer
      key={Math.random().toString()}
      center={[37.77498, -122.434574]}
      zoom={12}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {coordinatesPerLandfill &&
        coordinatesPerLandfill.map((polyCoordinatePerLandfill) => {
          let lats = [];
          let lons = [];
          try {
            lats = JSON.parse(polyCoordinatePerLandfill.Latitude);
            lons = JSON.parse(polyCoordinatePerLandfill.Longitude);
          } catch (e) {
            console.log("invalid row ", polyCoordinatePerLandfill);
          }
          //console.log("lats and longs ", lats, lons)
          let polygonCoords = [];
          let text = polyCoordinatePerLandfill.LandfillName;
          for (let i = 0; i < lats.length; i++) {
            const lat = lats[i];
            const lon = 0 - lons[i];
            polygonCoords.push([lat, lon]);
            // const id = coordinatePerLandfill.SWIS
            //console.log("polygonCoords" ,polygonCoords)
          }
          return (
            <>
              <Polygon pathOptions={{ color: "red" }} positions={polygonCoords}>
                <Popup className="popup">
                  <p className="popUpTitle">{text}</p>
                  <p className="popUpText">
                    This landfill is located at {lats[0]}, {lons[0]}
                  </p>
                  <p className="popUpText">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aliquam posuere ante vestibulum, tristique leo malesuada,
                    maximus tellus. Curabitur iaculis sit amet nulla a
                    condimentum. Phasellus sit amet eros aliquet, consequat
                    lacus id, tristique tortor. Praesent euismod enim a gravida
                    convallis. Mauris non elit nec felis scelerisque fermentum.
                    Integer porttitor pulvinar dui non posuere. Praesent eu
                    risus sed massa tincidunt lacinia ac non mauris. Cras at
                    pellentesque massa. Donec facilisis, enim viverra gravida
                    ultrices, leo est viverra augue, in ultrices leo dolor sit
                    amet libero. In et libero ut quam scelerisque porta et et
                    ipsum. Suspendisse rhoncus tellus non leo imperdiet posuere.
                    Proin facilisis nisl sit amet ultrices venenatis. Ut sem
                    mauris, fermentum eget vestibulum vel, mollis eget quam. In
                    id elit dolor. Integer at eros vel sem imperdiet finibus.
                    Cras nec vestibulum lacus.
                    <br />
                    <br />
                    Vestibulum sit amet iaculis lorem, in sagittis mauris.
                    Vestibulum vitae massa magna. Proin vitae tellus porttitor,
                    finibus sem suscipit, luctus neque. Vivamus vitae libero
                    quis lectus malesuada hendrerit in in diam. Mauris egestas
                    rutrum mauris, vel luctus tortor rutrum vitae. Pellentesque
                    vestibulum turpis non condimentum malesuada. Quisque et
                    velit nisl. Cras non rutrum enim, at facilisis sem. Mauris
                    sed rutrum turpis. Pellentesque nec est sollicitudin,
                    iaculis magna id, tristique ante.
                  </p>
                </Popup>
              </Polygon>
            </>
          );
        })}
    </MapContainer>
  );
};
export default Map;
