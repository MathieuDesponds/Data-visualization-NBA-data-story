import Team from './Team.js';

// using, among others
// https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
// https://d3-graph-gallery.com/graph/scatter_buttonXlim.html
// https://d3-graph-gallery.com/graph/barplot_button_data_hard.html

var team_id_to_abbrv = new Map();
var team_id_to_color = new Map();
d3.csv(Team.TEAM_FILE,
  (data) => data.forEach(team =>
    { var t = new Team(team);
      team_id_to_abbrv.set(t.id, t.abbr)
      team_id_to_color.set(t.id, t.mainColor)
    })
)


// create svg
var margin = {top: 30, right: 30, bottom: 20, left: 50},
width = 300 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

// X axis for both graphs
var x = d3.scaleBand()
  .range([ 0, width ])
  //.domain(data1.map(function(d) { return d.group; }))
  .domain([0,1])
  .padding(0.2);

// STATS wpct

// append the svg object to the body of the page
var svpwp = d3.select("#viz1-statistics-wp")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//title
svpwp.append("text")
  .attr("x", (width / 2))             
  .attr("y", -10)
  .attr("text-anchor", "middle")  
  .style("font-size", "18px") 
  .text("win percentage")
  .attr("x", (width / 2))
  .attr("y", 0)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .text("Win Percentage");

// top chart holds the x axis
var xAxisWP = svpwp.append("g")
                  .call(d3.axisBottom(x))
                  .attr("transform", "translate(0," + (height + 2)  + ")")
// hide line and ticks
xAxisWP.selectAll("path")
    .style("fill", "none")
    .style("stroke", "none")
xAxisWP.selectAll(".tick").selectAll("line")
    .style("fill", "none")
    .style("stroke", "none")

// Add Y axis
var ywp = d3.scaleLinear()
    .domain([0, 1])
    .range([ height, 0 ]);
svpwp.append("g")
    .call(d3.axisLeft(ywp));


// STATS kilometers travelled
var svpkm = d3.select("#viz1-statistics-km")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.bottom + ")");

svpkm.append("text")
          .attr("x", (width / 2))
          .attr("y", height + 20)
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .text("KM Travelled");

// Add Y axis
var ykm = d3.scaleLinear()
    .domain([100000, 0])
    .range([ height, 0 ]);
var yAxisKM = svpkm.append("g")
    .call(d3.axisLeft(ykm));

// A function that create / update the plot for a given variable:
export function updateStats(data) {

  // STATS WP
  // update x axis if new teams
  x.domain(data.map( (team_match) => team_id_to_abbrv.get(eval(team_match[0]))))
  xAxisWP.transition().duration(1000).call(d3.axisBottom(x))

  //hide ticks
  xAxisWP.selectAll(".tick").selectAll("line")
    .style("fill", "none")
    .style("stroke", "none")

  var uwp = svpwp.selectAll("rect")
    .data(data)

  uwp
    .enter()
    .append("rect")
    .merge(uwp)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x(team_id_to_abbrv.get(eval(d[0]))); })
      .attr("y", function(d) { return ywp(d[1]); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - ywp(d[1]); })
      .attr("fill", function(d) { return team_id_to_color.get(eval(d[0]))})

  // If less group in the new dataset, I delete the ones not in use anymore
  uwp
  .exit()
  .remove()

  // STATS KM
  // update y axis
  var max_cum_dist = Math.max(...data.map(row => row[2]))

  ykm = d3.scaleLinear()
          .domain([max_cum_dist, 0])
          .range([ height, 0 ]);

  yAxisKM.transition().duration(1000).call(d3.axisLeft(ykm));

  //update values
  var ukm = svpkm.selectAll("rect")
    .data(data)
  ukm
    .enter()
    .append("rect")
    .merge(ukm)
    .transition()
    .duration(1000)
      .attr("x", function(d) { return x(team_id_to_abbrv.get(eval(d[0]))); })
      .attr("y", function(d) { return ykm(0); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return ykm(d[2]); })
      .attr("fill", function(d) { return team_id_to_color.get(eval(d[0]))})

  // If less group in the new dataset, I delete the ones not in use anymore
  ukm
    .exit()
    .remove()
}
// Initialize the plot with the first dataset
updateStats([])
