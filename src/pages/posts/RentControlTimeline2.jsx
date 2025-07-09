import React, { useEffect, useState } from "react";
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


function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default function ScrollyTimeline() {
  const [data, setData] = useState(getDataForYearSection1(years[0]));
  const [activeYear, setActiveYear] = useState(years[0]);
  const isMobile = useIsMobile();

  const tickColor = isMobile ? 'black' : 'white'
  const chartHeight = isMobile ? 200 : 300
  const topOffset = isMobile ? undefined : "10%"
  const bottomOffset = isMobile ? "100px" : "80%"
  return (
    <div className="container">
      <div className="right-column">
        <div className="chart-title">Average cost of rent for a 2 bedroom apartment from 1979 to {activeYear}</div>
        <div className="chart-description">(Adjusted for inflation)</div>
        <ResponsiveContainer width="100%" height={chartHeight} className="chartContainer">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fill: tickColor}} />
            <YAxis tick={{ fill: tickColor }}/>
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
      <div className="left-column">
        {years.map((year) => (
          <section key={year} className="year-section">
            <Waypoint
              onEnter={() => {
                setActiveYear(year);
                setData(getDataForYearSection1(year));
              }}
              topOffset={topOffset}
              bottomOffset={bottomOffset}
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
      
    </div>
  );
}
