var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv("data.csv", function(err, myData) {
  if (err) throw err;

  myData.forEach(function(data) {
    data.foreignborn = Number(data.foreignborn);
    data.hsdegree = Number(data.hsdegree);
    data.currentSmoker = Number(data.currentSmoker);
  });

  console.log(myData);

  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMax;

  function findMinAndMax(dataColumnX) {
    xMin = d3.min(myData, function(data) {
      return Number(data[dataColumnX]) * 0.8;
    });

    xMax = d3.max(myData, function(data) {
      return Number(data[dataColumnX]) * 1.1;
    });

    yMax = d3.max(myData, function(data) {
      return Number(data.hsdegree) * 1.1;
    });
  }

  var currentAxisLabelX = "foreignborn";

  var currentAxisLabelY = "hsdegree";

  writeAnalysis(currentAxisLabelX, currentAxisLabelY);

  findMinAndMax(currentAxisLabelX);

  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([0, yMax]);

  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var itemName = data.state;
      var itemEdu = Number(data.hsdegree);
      var itemInfo = Number(data[currentAxisLabelX]);
      var itemString;
      if (currentAxisLabelX === "foreignborn") {
        itemString = "foreignborn: ";
      }
      else {
        itemString = "Smoker: ";
      }
      if (currentAxisLabelY === "hsdegree") {
        eduString = "hsdegree: ";
      }
      else {
        eduString = "HS Grad: ";
      }
      return itemName +
        "<hr>" +
        eduString +
        itemEdu + "%<br>" +
        itemString +
        itemInfo + "%";
    });

  chart.call(toolTip);

  chart
    .selectAll("circle")
    .data(myData)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(Number(data[currentAxisLabelX]));
    })
    .attr("cy", function(data, index) {
      return yLinearScale(Number(data.hsdegree));
    })
    .attr("r", "12")
    .attr("fill", "lightblue")
    .on("mouseover", function(data) {
      toolTip.show(data)})
    .on("mouseout", function(data) {
      toolTip.hide(data)});

  chart
    .selectAll("text")
    .data(myData)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("class","stateText")
    .style("fill", "white")
    .style("font", "10px sans-serif")
    .style("font-weight", "bold")
    .text(function(data) {
      return data.abbr;})
    .on("mouseover", function(data) {
      toolTip.show(data)})
    .on("mouseout", function(data) {
      toolTip.hide(data)})
    .attr("x", function(data, index) {
      return xLinearScale(Number(data[currentAxisLabelX]));
    })
    .attr("y", function(data, index) {
      return yLinearScale(Number(data.hsdegree))+4;
    });

  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis")
    .call(bottomAxis);

  chart.append("g")
    .attr("class", "y-axis")
    .call(leftAxis);

  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "hsdegree")
    .text("High School Degree or Greater");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
    )
    .attr("class", "axis-text active")
    .attr("data-axis-name", "foreignborn")
    .text("Foreign-Born(%)");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
    )
    .attr("class", "axis-text inactive")
    .attr("data-axis-name", "currentSmoker")
    .text("Current Smoker (%)");

  function labelChange(clickedAxis) {
    d3
      .selectAll(".axis-text")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    clickedAxis.classed("inactive", false).classed("active", true);
    writeAnalysis(currentAxisLabelX, currentAxisLabelY);
  }

  d3.selectAll(".axis-text").on("click", function() {
    var clickedSelection = d3.select(this);
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    
    var clickedAxis = clickedSelection.attr("data-axis-name");


    if (isClickedSelectionInactive) {
      currentAxisLabelX = clickedAxis;
      findMinAndMax(currentAxisLabelX);
      xLinearScale.domain([xMin, xMax]);
      svg
        .select(".x-axis")
        .transition()
        .duration(1800)
        .call(bottomAxis);

      d3.selectAll("circle").each(function() {
        d3
          .select(this)
          .transition()
          .attr("cx", function(data, index) {
            return xLinearScale(Number(data[currentAxisLabelX]));
          })
          .duration(1800);
      });

      d3.selectAll(".stateText").each(function() {
        d3
          .select(this)
          .transition()
          .attr("x", function(data, index) {
            return xLinearScale(Number(data[currentAxisLabelX]));
          })
          .duration(1800);
      });

      labelChange(clickedSelection);
    }
  });
});

function writeAnalysis(xAxis, yAxis) {
  var analysisText = parent.document.getElementById('analysis');

  var responses = [""];

  var answer;

  if (xAxis === "foreignborn") {
    if (yAxis === "hsdegree") {
      answer = responses[0];
    }
    else {
      answer = responses[2];
    }
  }
  else {
    if (yAxis === "hsdegree") {
      answer = responses[1];
    }
    else {
      answer = responses[3];
    }
  }
  analysisText.innerHTML = answer;
};