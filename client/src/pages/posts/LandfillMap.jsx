import React from "react";
import AuthorFooter from "../../components/AuthorFooter";
import { authors } from "../../authors/authors";

const LandfillMap = () => {
  const headerImageUrl = "https://picsum.photos/300/200";
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
        <div class="embed-container">
          <small>
            <a
              href="//destinyjade.maps.arcgis.com/apps/Embed/index.html?webmap=f4e1855688434760a8f7e688f3aa72db&extent=-122.5477,37.3013,-121.6695,37.7722&zoom=true&scale=true&details=true&legendlayers=true&active_panel=details&disable_scroll=false&theme=light"
              target="_blank"
            >
              View larger map
            </a>
          </small>
          <br />
          <iframe
            width="500"
            height="400"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            title="Landfill_Test"
            src="//destinyjade.maps.arcgis.com/apps/Embed/index.html?webmap=f4e1855688434760a8f7e688f3aa72db&extent=-122.5477,37.3013,-121.6695,37.7722&zoom=true&previewImage=false&scale=true&details=true&legendlayers=true&active_panel=details&disable_scroll=false&theme=light"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
export default LandfillMap;
