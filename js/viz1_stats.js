import Team from './Team.js';

// using, among others
// https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
// https://d3-graph-gallery.com/graph/scatter_buttonXlim.html
// https://d3-graph-gallery.com/graph/barplot_button_data_hard.html 

// create svg
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#viz1-statistics")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 1])
    .range([ height, 0 ]);
svg.append("g")
    .call(d3.axisLeft(y));


// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  //.domain(data1.map(function(d) { return d.group; }))
  .domain([0,1])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

var team_id_to_abbrv = new Map();
d3.csv(Team.TEAM_FILE,
  (data) => data.forEach(team => 
    { var t = new Team(team);
      team_id_to_abbrv.set(t.id, t.abbr)
    })
)

// A function that create / update the plot for a given variable:
export function updateStats(data) {

  x.domain(data.map( (team_match) => team_id_to_abbrv.get(eval(team_match[0]))))
  xAxis.transition().duration(1000).call(d3.axisBottom(x))
  
  var u = svg.selectAll("rect")
    .data(data)

  u
    .enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x(team_id_to_abbrv.get(eval(d[0]))); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d[1]); })
      .attr("fill", "#69b3a2")
  
  // If less group in the new dataset, I delete the ones not in use anymore
  u
  .exit()
  .remove()
}
// Initialize the plot with the first dataset
updateStats([])