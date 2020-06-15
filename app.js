
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;
var margin = 25;
var labelArea = 115;
var tPadBot = 45;
var tPadLeft = 45

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");
