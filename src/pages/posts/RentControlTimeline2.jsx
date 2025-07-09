import React, { useState } from "react";
import { Waypoint } from "react-waypoint";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const years = [1979, 1980, 1981, 1982, 1983];
const getDataForYearSection1 = (year) => {
    switch(year) {
        case (1979):
         return [
            { label: "A", value: Math.round(Math.random() * 100) },
        ];
        case (1980):
         return [
            { label: "A", value: Math.round(Math.random() * 100) },
            { label: "B", value: Math.round(Math.random() * 100) }
        ];
        case (1981):
         return [
            { label: "A", value: Math.round(Math.random() * 100) },
            { label: "B", value: Math.round(Math.random() * 100) },
            { label: "C", value: Math.round(Math.random() * 100) }
        ];
        case (1982):
         return [
            { label: "A", value: Math.round(Math.random() * 100) },
            { label: "B", value: Math.round(Math.random() * 100) },
            { label: "C", value: Math.round(Math.random() * 100) }
        ];
        case (1983):
         return [
            { label: "A", value: Math.round(Math.random() * 100) },
            { label: "B", value: Math.round(Math.random() * 100) },
            { label: "C", value: Math.round(Math.random() * 100) },
            { label: "D", value: Math.round(Math.random() * 100) }
        ];
    }
}

export default function ScrollyTimeline() {
  const [data, setData] = useState(getDataForYearSection1(years[0]));
  const [activeYear, setActiveYear] = useState(years[0]);

  return (
    <div className="container">
      <div className="left-column">
        {years.map((year) => (
          <section key={year} className="year-section">
            <Waypoint
              onEnter={() => {
                setActiveYear(year);
                setData(getDataForYearSection1(year));
              }}
              topOffset={"10%"}
              bottomOffset={"80%"}
            />
            <div className={`timeline-marker ${activeYear === year ? "active" : ""}`}>
              {year}
            </div>
            <p>
              Here's some text for <strong>{year}</strong> describing events, policies, or
              rent control changes. Scroll to update the chart.
            </p>
          </section>
        ))}
      </div>
      <div className="right-column">
        <div className="chart-title">Average cost of rent for a 2 bedroom apartment from 1979 to {activeYear}</div>
        <div className="chart-description">(Adjusted for inflation)</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }}/>
            <Tooltip
            contentStyle={{
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
            }}
            cursor={false}
            labelStyle={{ color: "white"}}
            itemStyle={{ color: "white" }}
            formatter={(value) => [value]}
            />

            <Bar dataKey="value" fill="#131140"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
