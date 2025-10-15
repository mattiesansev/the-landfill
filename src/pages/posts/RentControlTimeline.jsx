import React, { PureComponent } from 'react';
import { Scrollama, Step } from 'react-scrollama';


const steps = [
  {
    year: 1979,
    content: [
      "California Proposition 13 passes, which implements strict limitations on property taxes.",
      "Several Bay Area cities, including San Francisco, Berkeley, and Palo Alto, propose measures that would require a portion of savings from Proposition 13 to pass onto tenants. San Francisco’s Proposition U would require all tax savings be passed onto tenants for a year.",
      "Proposition U failed on the ballot, and landlords continued to raise rents. The largest rent increase reported through a hotline created by the mayor's office is 213%."
    ]
  }, {
    year: 1980,
    content: 
    [
      "California Proposition 13 passes, which implements strict limitations on property taxes.",
      "Several Bay Area cities, including San Francisco, Berkeley, and Palo Alto, propose measures that would require a portion of savings from Proposition 13 to pass onto tenants. San Francisco’s Proposition U would require all tax savings be passed onto tenants for a year.",
      "Proposition U failed on the ballot, and landlords continued to raise rents.",
      "The mayor’s office creates a hotline for rent increase complaints, which receives 987 complaints in just over two weeks with 47% of callers saying their rent was raised between 10% and 25%, and 12% of callers saying their rents were raised between 25% and 50%. The largest rent increase according to the hotline complaints is 213%."
    ]
  },
  {
    year: 1981,
    content: 
    [
      "California Proposition 13 passes, which implements strict limitations on property taxes.",
      "Several Bay Area cities, including San Francisco, Berkeley, and Palo Alto, propose measures that would require a portion of savings from Proposition 13 to pass onto tenants. San Francisco’s Proposition U would require all tax savings be passed onto tenants for a year.",
      "Proposition U failed on the ballot, and landlords continued to raise rents.",
      "The mayor’s office creates a hotline for rent increase complaints, which receives 987 complaints in just over two weeks with 47% of callers saying their rent was raised between 10% and 25%, and 12% of callers saying their rents were raised between 25% and 50%. The largest rent increase according to the hotline complaints is 213%."
    ]
  },
  {
    year: 1982,
    content: 
    [
      "California Proposition 13 passes, which implements strict limitations on property taxes.",
      "Several Bay Area cities, including San Francisco, Berkeley, and Palo Alto, propose measures that would require a portion of savings from Proposition 13 to pass onto tenants. San Francisco’s Proposition U would require all tax savings be passed onto tenants for a year.",
      "Proposition U failed on the ballot, and landlords continued to raise rents.",
      "The mayor’s office creates a hotline for rent increase complaints, which receives 987 complaints in just over two weeks with 47% of callers saying their rent was raised between 10% and 25%, and 12% of callers saying their rents were raised between 25% and 50%. The largest rent increase according to the hotline complaints is 213%."
    ]
  },
]

class ParcelScroll extends PureComponent {
  state = {
    data: {},
    steps: steps,
    progress: 0,
    timeline: {
      1979: ["Built before 1900"],
      1980: ["Built before 1979", "Single family homes"],
      1981: ["Built before 1979", "Single family homes", "Special thing"],
      1982: ["Built before 1979", "Single family homes", "Special thing"],
    }
  };

  onStepEnter = e => {
    const { data, entry, direction} = e;
    this.setState({ data });
  };

  onStepExit = ({ direction, data }) => {
    if (direction === 'up' && data.year === this.state.steps[0].year) {
      this.setState({ data: {} });
    }
  };

  onStepProgress = ({ progress }) => {
    this.setState({ progress });
  };

  render() {
    const { data, steps, progress } = this.state;

    return (
      <div className="parcelScroll">
        <div className="graphicContainer">
          <div className="scroller">
            <Scrollama
              onStepEnter={this.onStepEnter}
              onStepExit={this.onStepExit}
              progress
              onStepProgress={this.onStepProgress}
              offset="400px"
              debug
            >
              {steps.map(value => {
                const isVisible = value.year === data.year;
                const background = isVisible
                  ? `rgba(44,127,184)`//, ${progress})`
                  : '#1A7750';
                const visibility = isVisible ? 'visible' : 'hidden';
                return (
                  <Step data={value} key={value}>
                    <div className="step" style={{ background }}>
                      <div style={{ visibility }}>
                        <h2>{data.year}</h2>
                        {data.content?.map((c) => {
                          return (<p>{c}</p>)
                        })}
                      </div>
                    </div>
                  </Step>
                );
              })}
            </Scrollama>
          </div>
          <div className="graphic">
            <h1>hello</h1>
            <p>
            {this.state.timeline[data.year]?.map((list) => {
              return <li>{list}</li>
            })}
            </p>
          </div>
        </div>
       </div>
    );
  }
}

export default ParcelScroll;