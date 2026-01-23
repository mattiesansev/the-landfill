import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import AuthorFooter from "../../components/AuthorFooter";
import { authors } from "../../authors/authors";
import BracketContainer from "./parksBracket/BracketContainer";

ReactGA.initialize("G-NR2T70PVBG");

const ParksBracket = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <div className="single">
      <div className="content">
        <div className="title">
          SF Parks Bracket: Vote for the Best Park in San Francisco
        </div>

        <AuthorFooter
          authorImageUrl={authors.mattie.photo}
          authorName={authors.mattie.name}
          postDate="January 2025"
        />

        <p>
          San Francisco is home to over 220 parks, from sprawling urban oases to
          hidden neighborhood gems. But which one is the best? We've seeded 16
          of the city's most beloved parks into a tournament bracket, and now
          it's up to you to decide the champion.
        </p>

        <p>
          <strong>How it works:</strong> Click on any matchup to compare park
          stats side-by-side, including acreage, amenities, and fun facts. Then
          select your winner to advance them to the next round. Click on any
          park name to see more details about that park.
        </p>

        <div className="bracket-section">
          <h2 className="bracket-title">2025 SF Parks Championship</h2>
          <BracketContainer />
        </div>

        <h3>About the Seeding</h3>
        <p>
          Parks were seeded based on a combination of factors including size,
          historical significance, popularity, and amenities. Golden Gate Park,
          as the city's largest and most iconic park, earned the #1 seed, while
          newer parks like Sunset Dunes and smaller neighborhood parks received
          lower seeds.
        </p>

        <p>
          Of course, size isn't everything! Some of the best matchups pit large
          parks against smaller but equally beloved spaces. Will the historic
          charm of Buena Vista Park overcome the concert-famous Stern Grove?
          Can the Instagram-famous Alamo Square top the elegant Alta Plaza?
          That's for you to decide.
        </p>

        <h3>Methodology</h3>
        <p>
          Park data was compiled from SF Recreation & Parks, historical records,
          and community input. Stats shown are approximate and meant to give a
          general comparison between parks. We focused on amenities that matter
          most to park visitors: playgrounds, sports facilities, dog-friendliness,
          parking, and restroom availability.
        </p>
      </div>
    </div>
  );
};

export default ParksBracket;
