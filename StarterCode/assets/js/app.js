// setting up svg 
var svgWidth = 880;
var svgHeight = 550;

// selecting d3 scatter and assigning attibutes
d3.select("#scatter") 
  .append("svg")
    .classed("char", true)
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var svg = d3.select("svg");

// creating variable for rendering data into the scatter/bubble chart
var renderData = data => {
    
    // denoting margins
    var margin = {
        top: 35,
        bottom: 70,
        left: 70,
        right: 30
    };

    // establishing width/height
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var title = "Healthcare vs Poverty Plot";

    // setting up x and y values: % in poverty vs % lacking healthcare
    var xValue = d => d.poverty;
    var bottomAxisLabel = "In Poverty (%)";
    
    var yValue = d => d.healthcare;
    var leftAxisLabel = "Lacks Healthcare (%)";
    
    // setting up xlinear and ylinear scales
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, width])
        .nice();

    var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([height, 0])
        .nice();

    // assigning xlinear and ylinear scales to d3 x and y axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    var circleRadius = 16;

    // appending svg with margin info
    var g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // setting up bottom (x) axis
    var bottomAxisG = g.append("g").call(bottomAxis)
        .attr("transform", `translate(0,${height})`);

    bottomAxisG.append("text")
        .classed("axis-label", true)
        .attr("y", 50) 
        .attr("x", width / 2)
        .attr("fill", "black")
        .text(bottomAxisLabel);

    // setting up left (y) axis
    var leftAxisG = g.append("g").call(leftAxis);

    leftAxisG.append("text")
        .classed("axis-label", true)
        .attr("y", -50) 
        .attr("x", -height / 2)
        .attr("fill", "black")
        .attr("transform", `rotate(-90)`)
        .attr("text-anchor", "middle")
        .text(leftAxisLabel);

    // defining the chart's circle/data point characteristics
    g.selectAll("circle").data(data)
      .enter().append("circle")
        .classed("stateCircle inactive", true)
        .attr("cy", d => yLinearScale(yValue(d)))
        .attr("cx", d => xLinearScale(xValue(d)))
        .attr("r", circleRadius);

    // defining state text attributes
    g.selectAll(".stateText").data(data)
        .enter().append("text")
        .classed("stateCircle", true)
        .attr("y", d => yLinearScale(yValue(d)) + 5)
        .attr("x", d => xLinearScale(xValue(d)) - 10)
        .text(d => d.abbr)
        .on("click", function(){
            d3.select(this).classed("active", true)
        })
    
    g.append("text")
        .attr("class", "title")
        .attr("y", 0)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .text(title);
};

// reading in data
d3.csv("assets/data/data.csv").then(povData => {
    povData.forEach(data => {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    })
    
    // logging data for reference
    console.log(povData);
    
    // rendering poverty data to the chart
    renderData(povData);
});