import * as d3 from "d3";
import { React, useEffect, useState, useRef } from "react";
const ClassBar = () => {
  const ref = useRef();
  const [data, setData] = useState([]);
  const [chartWidth, setWidth] = useState(window.innerWidth * 0.6);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    details: "",
    x: 0,
    y: 0,
  });

  function handleResize() {
    const windowWidth = window.innerWidth
    const width = windowWidth * 0.6
    setWidth(width)
  }

  // Add event listener on component mount
  window.addEventListener("resize", handleResize);

  useEffect(() => {
    async function getData() {
      await fetch("/class_counts.csv")
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
              setData(results.data);
            },
            error: function (error) {
              console.error(error.message); // Error handling
            },
          });
        });
    }
    getData();
  }, []);
  useEffect(() => {
    // Clear the old chart
    d3.select(ref.current).select("svg").remove();

    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 100, left: 30 },
      width = chartWidth,
      height = 400;
    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.Class))
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .attr("class", "axis");
    // Add Y axis
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));
    // Bars
    svg
      .selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.Class))
      .attr("y", function (d) {
        return y(0);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(0);
      }) // start at 0
      .attr("fill", "#5f0f40")
      .on("mouseenter", (event, d) => {
        console.log("hover ", d);
        // Show the tooltip when hovering
        setTooltip({
          visible: true,
          content: `${d.Count} landfills with ${d.Class} waste`,
          details: d.Details,
          x: event.pageX - 75,
          y: event.pageY - 200,
        });
      })
      .on("mouseleave", () => {
        // Hide the tooltip when leaving
        setTooltip((prev) => ({ ...prev, visible: false }));
      });
    // Animation
    svg
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", function (d) {
        return y(d.Count);
      })
      .attr("height", function (d) {
        return height - y(d.Count);
      })
      .delay(function (d, i) {
        return i * 100;
      });
  }, [data, chartWidth]);
  return (
    <div >
      <div className='chartTitle'>
        Landfills by Class
      </div>
      Landfills are classified in three categories, with class III being the least dangerous and class I being the most. Click on each bar to learn more about the different classes.
      <svg height={550} width={chartWidth } id="barchart" className="bar" ref={ref} />
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            padding: "5px",
            pointerEvents: "none",
            borderRadius: 5,
            width: 180,
          }}
        >
          <b>{tooltip.content}</b>
          <br/><br/>
          {tooltip.details}
        </div>
      )}
    </div>
  );
};
export default ClassBar;
