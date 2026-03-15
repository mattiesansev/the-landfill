import React from "react";
import AuthorFooter from "../../components/AuthorFooter";
import { authors } from "../../authors/authors";
import BracketContainer from "./parksBracket/BracketContainer";
import ParkStatsSection from "./parksBracket/ParkStatsSection";

const ParksBracket = () => {
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
        <AuthorFooter
          authorImageUrl={authors.maggie.photo}
          authorName={authors.maggie.name}
        />
        <AuthorFooter
          authorImageUrl={authors.nick.photo}
          authorName={authors.nick.name}
        />

        <p>
          San Francisco is home to over 230 parks, from multi-purpose giants like golden gate park
          to shiny hidden gems like balboa park. Everyone has their favorite, but which one is truly the best?
          In Park Madness, 16 parks battle it out for the championship title. 
        </p>

        <p>
          <strong>How it works:</strong> Create a bracket to represent how you think each round's voting will pan out.
          Then, each week a new round will open up for voting. Let your voice be heard as you vote for the parks that you think should win it all!
          Click on each matchup to see more details about the parks, and learn fun facts along the way!
        </p>

        <div className="bracket-callout">
          Follow our <a href="https://www.instagram.com/bayareadatadump/" target="_blank" rel="noopener noreferrer">Instagram</a> or <a href="https://docs.google.com/forms/d/e/1FAIpQLSfffPb045GrsatVJLg6jUN1nOprh2NlREhJgmIUfmxBFC_T_w/viewform?usp=dialog" target="_blank" rel="noopener noreferrer">sign up for our newsletter</a> to get updates per round.<br/>
          Don't agree with where a matchup is headed? See if you can sway the crowd with your pitch here: <a href="https://www.reddit.com/r/SFparkmadness/" target="_blank" rel="noopener noreferrer">SF Park Madness</a>
        </div>

        <div className="bracket-section">
          <h2 className="bracket-title">2025 SF Parks Championship</h2>
          <BracketContainer />
        </div>

        <ParkStatsSection />
      </div>
    </div>
  );
};

export default ParksBracket;
