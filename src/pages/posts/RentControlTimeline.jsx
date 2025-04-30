import React, { PureComponent } from 'react';
import { Scrollama, Step } from 'react-scrollama';


class ParcelScroll extends PureComponent {
  state = {
    data: 0,
    steps: [1979, 1980, 1990],
    progress: 0,
    timeline: {
      1979: ["Built before 1900"],
      1980: ["Built before 1979", "Single family homes"],
      1990: ["Built before 1979", "Single family homes", "Special thing"],
    }
  };

  onStepEnter = e => {
    const { data, entry, direction} = e;
    this.setState({ data });
  };

  onStepExit = ({ direction, data }) => {
    if (direction === 'up' && data === this.state.steps[0]) {
      this.setState({ data: 0 });
    }
  };

  onStepProgress = ({ progress }) => {
    this.setState({ progress });
  };

  render() {
    const { data, steps, progress } = this.state;

    const currentStateOfRentControl = "At this point, housing is eligible for rent control if:"

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
                const isVisible = value === data;
                const background = isVisible
                  ? `rgba(44,127,184, ${progress})`
                  : 'white';
                const visibility = isVisible ? 'visible' : 'hidden';
                return (
                  <Step data={value} key={value}>
                    <div className="step" style={{ background }}>
                      <p style={{ visibility }}>
                        {data}
                      </p>
                    </div>
                  </Step>
                );
              })}
            </Scrollama>
          </div>
          <div className="graphic">
            <h1>{currentStateOfRentControl}</h1>
            <p>
            {this.state.timeline[data]?.map((list) => {
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