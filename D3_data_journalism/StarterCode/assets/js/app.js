// Set up chart
// ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function (stateData) {
  // Format the data
  stateData.forEach(function (data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

  // set x scale function
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d.obesity) * 0.85,
    d3.max(stateData, d => d.obesity) * 1.05])
    .range([0, width]);

  // set y scale function
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(stateData, d => d.income) * 0.85,
    d3.max(stateData, d => d.income) * 1.05])
      .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  // append x axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .style("font-size", "12px")
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .style("font-size", "12px")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", 12)
    .attr("fill", "blue")
    .attr("opacity", ".35");


  // text in circles
  chartGroup.selectAll("text.text-circles")
    .data(stateData)
    .enter()
    .append("text")
    .classed("text-circles", true)
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.obesity))
    .attr("y", d => yLinearScale(d.income))
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "8px");

  // Initalize Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr("font-size", "6px")
    .offset([80, -70])
    .style("position", "absolute")
    .style("background", "pink")
    .style("pointer-events", "none")
    .html(function (d) {
      return (`<strong>${d.state}</strong><br><i>Obesity (%):</i>  ${d.obesity}  <br><i>Income: </i>${d.income}`)
    });

  // tooltip in the chart
  chartGroup.call(toolTip);

  // Add an onmouseover event to display a tooltip   
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })

    // Add a mouseout    
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Income Levels");

  // x axis
  chartGroup.append("text")
    .attr("y", height + margin.bottom / 2 - 10)
    .attr("x", width / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .text("ObesityRate (%)");
});