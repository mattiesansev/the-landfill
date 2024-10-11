import { React, useEffect, useState } from "react";
import AuthorFooter from "../../components/AuthorFooter";
import { authors } from "../../authors/authors";
import Map from "./Map";
import Barchart from "./BarChart";
import OwnershipBarchart from "./OwnershipBarChart";

const LandfillMap = () => {
  const headerImageUrl = "https://picsum.photos/300/200";
  //let coordinatesPerLandfill = []
  const [coordinatesPerLandfill, setCoordinatesPerLandfill] = useState([]);
  // Define the polygon's coordinates
  useEffect(() => {
    async function getData() {
      await fetch("/grouped_xy_with_info.csv")
        .then((response) => response.text())
        .then((csvText) => {
          console.log("[mattie] data", csvText);
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
              setCoordinatesPerLandfill(results.data);
              console.log(coordinatesPerLandfill); // Parsed CSV data as an array of objects
            },
            error: function (error) {
              console.error(error.message); // Error handling
            },
          });
        });
    }
    getData();
  }, []);

  return (
    <div className="single">
      <div className="content">
        <img src={headerImageUrl}></img>
        <div className="title">
          Infrastructure across the Bay Area was built on top of landfills. What
          does that mean for you?
        </div>
        <AuthorFooter
          authorImageUrl={authors["mattie"]["photo"]}
          postDate="July 15, 2024"
          authorName={authors["mattie"]["name"]}
        />
        <AuthorFooter
          authorImageUrl={authors["destiny"]["photo"]}
          postDate="July 15, 2024"
          authorName={authors["destiny"]["name"]}
        />
        <p>content content content</p>
        <Barchart data={coordinatesPerLandfill} />
        <div></div>
        <OwnershipBarchart />
        <div class="embed-container" id="map-container">
          <Map coordinatesPerLandfill={coordinatesPerLandfill} />
        </div>
      </div>
    </div>
  );
};
export default LandfillMap;
