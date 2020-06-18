  // Reference - 16.3 Activity 4


var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data.csv").then(function(Data) {


  var parseTime = d3.timeParse("%d-%b-%Y");



  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(Data, d => d.date))
    .range([0, width]);

  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(Data, d => d.dow_index)])
    .range([height, 0]);

  var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(Data, d => d._sightings)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xTimeScale)
    .tickFormat(d3.timeFormat("%d-%b-%Y"));
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .classed("green", true)
    .call(leftAxis);

  chartGroup.append("g")
    .classed("blue", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(rightAxis);

  var line1 = d3.line()
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale1(d.dow_index));

  var line2 = d3.line()
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale2(d._sightings));

  chartGroup.append("path")
    .data([Data])
    .attr("d", line1)
    .classed("line green", true);

  chartGroup.append("path")
    .data([Data])
    .attr("d", line2)
    .classed("line blue", true);

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("dow-text text", true)
    .text("In Poverty %");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("-text text", true)
    .text("Lacks Healthcare %");
}).catch(function(error) {
  console.log(error);
});
