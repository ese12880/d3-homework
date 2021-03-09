// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
    console.log(chosenXAxis)
  return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    
  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d[chosenYAxis])])
  .range([height, 0]);
  console.log(yLinearScale)
  return yLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  console.log(circlesGroup);
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
  return circlesGroup;
}
// function used for updating circles group with a transition to
// new circles
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  console.log(circlesGroup);
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
//return circlesGroup;

// function used for updating circles group with new tooltip
function updateXToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty(%)";
  }
  else if (chosenXAxis === "age"){
    label = "Age(Median)";
  }
  else{
    label = "Household Income(Median)";
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([10, -10])
    .html(function(d) {
      return (`${d.state}<br>${chosenXAxis} : ${d.povertyMoe}`);
    });
  console.log(toolTip);
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateYToolTip(chosenYAxis, circlesGroup) {
console.log(chosenYAxis)
console.log(circlesGroup)
  var label;

  if (chosenYAxis === "healthcare") {
    label = "Lacks Healthcare(%)";
  }
  else if (chosenYAxis === "obesity"){
    label = "Obese(%)";
  }
  else{
    label = "Smokes(%)";
  }
  console.log(label);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([10, -10])
    .html(function(d) {
    return (`${d.state}<br>`);
    
    });
    console.log(toolTip);
  circlesGroup.call(toolTip);
  // console.log(circlesGroup);
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(journalistData, err) {
  if (err) throw err;
  // parse data
  journalistData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.income = +data.income;
    data.obesity = +data.obesity;
    // data.abbr= +data.abbr;
    // console.log(data.abbr);
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(journalistData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(journalistData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis =chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(journalistData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".2")  ;
    
    console.log(circlesGroup);
    //Adding text labels to the groups

    // var abbrName= circlesGroup// Font size
    journalistData.forEach(function(data) {
      console.log(data.abbr)
    });
  var labelstagGroup = chartGroup.append("g")
    .classed("label-axis", true)
   
    var labelTag= labelstagGroup.selectAll("text")
    .data(journalistData)
    .enter()
    .append("text")
    .text(d =>d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .classed("active", true)
    .attr("font-size", "10px")
    .style('fill', 'white'); 

     // Create group for  3 x- axis labels
  var labelsXGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);


var povertyLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty(%)");

var ageLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age(Median)");

var householdLabel = labelsXGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income(Median)");
// Create group for  3 x- axis labels
var labelsYGroup = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);
// Create group for  3 y- axis labels
var labelsYGroup = chartGroup.append("g")
.classed("y-axis", true)

// append y axis
var healthcareLabel = labelsYGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("value", "healthcare")
  .attr("dy", "4em")
  .classed("active", true)
  .text("Lacks Healthcare(%)");

  var smokesLabel = labelsYGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("value", "smokes")
  .attr("dy", "3em")
  .classed("inactive", true)
  .text("Smokes(%)");

  var obesityLabel = labelsYGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("value", "obesity")
  .attr("dy", "2em")
  .classed("inactive", true)
  .text("Obese(%)");

  // x axis labels event listener
  labelsXGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
        labelTag.classed("label-axis", true)
        .classed("active", false)
   
        // var labelTag
        console.log(chosenXAxis)
        labelTag.classed("active", false);
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(journalistData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateXToolTip(chosenXAxis, circlesGroup);

              // updates tooltips with new info
              circlesGroup = updateXToolTip(chosenXAxis, circlesGroup);

              // changes classes to change bold text
              if (chosenXAxis === "age") {
                ageLabel
                  .classed("active", true)
                  .classed("inactive", false)
                povertyLabel
                  .classed("active", false)
                  .classed("inactive", true)
                  
                householdLabel
                  .classed("active", false)
                  .classed("inactive", true)
              }
              else if (chosenXAxis === "poverty"){
                ageLabel
                  .classed("active", false)
                  .classed("inactive", true)
                  .classed("label", false);
                  povertyLabel
                  .classed("active", true)
                  .classed("inactive", false)
                  .classed("label", false);
                  householdLabel
                  .classed("active", false)
                  .classed("inactive", true)
                  .classed("label", false);
              }
              else{
                ageLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("label", false);
                povertyLabel
                .classed("active", false)
                .classed("inactive", true)
                .classed("label", false);
                householdLabel
                .classed("active", true)
                .classed("inactive", false)
                .classed("label", false);
              }
      }
    });
        // });
  labelsYGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
          // replaces chosenXAxis with value
          chosenYAxis = value;
        }
  });
});

