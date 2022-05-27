import Team from './Team.js';
var d3=d3v3;

const width = 930,
    height = 480;
const svg = d3.select("#viz1-map").append("svg")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geo.mercator().center([-100,43]).scale(800).translate([width/2.2, height/3.5])
const path = d3.geo.path()
  .projection(projection);


export async function drawMap(){
  return new Promise((resolve, reject) => {
    d3.json("../data/map/na.json", function(error, na) {
      if (error) return console.error(error);

        svg.selectAll(".subunit")
          .data(topojson.feature(na, na.objects.subunits).features)
        .enter().append("path")
          .attr("class", function(d) { return "subunit " + d.id; })
          .attr("d", path);

          //Add the boundaries on the map
        svg.append("path")
         .datum(topojson.mesh(na, na.objects.subunits, function(a, b) { return a !== b }))
         .attr("d", path)
         .attr("class", "subunit-boundary");
    });
    resolve()
  })
}
//Add label to places
export async function drawCities(){
  return new Promise((resolve, reject) => {
    d3.csv(Team.TEAM_FILE,(data) => {
    var teams = data.map(team => new Team(team));
    svg.selectAll("circle")
      .data(teams)
    .enter()
      .append("circle")
      .attr("transform", function(d) { return "translate(" + projection(d.coordinates()) + ")"; })
      .attr("dy", ".35em")
      .attr("r", "5px")
      .attr("fill", "red")

    svg.selectAll(".place-label")
      .data(teams)
    .enter().append("text")
      .attr("class", "place-label")
      .attr("transform", function(d) { return "translate(" + projection(d.coordinates()) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.name; })
      .attr("x", function(d) { return Team.TEAM_ABR_ON_LEFT.has(d.abbr) ? -6 : 6; })
    .style("text-anchor", function(d) { return Team.TEAM_ABR_ON_LEFT.has(d.abbr) ? "end" : "start"; });
    })
    resolve()
  })
}

const color = ["blue", "red", "yellow", "grey", "green"]
export async function drawPaths(new_path, i){
    return new Promise((resolve, reject) => {
    // Add the path
    var my_path = svg.append("path")
          .attr("d", path(new_path))
          .style("fill", "none")
          .style("stroke", color[i%color.length])
          .style("stroke-width", 3)
    // Get the length of the path, which we will use for the intial offset to "hide"
    // the graph
    const length = my_path.node().getTotalLength();
    function repeat() {
        // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
          my_path
            .attr("stroke-dasharray", length + " " + length)
            .attr("stroke-dashoffset", length)
              .transition()
              .ease("linear")
              .attr("stroke-dashoffset", 0)
              .duration(500)
              .transition()
              .ease("linear")
              // .style("stroke", "orange")
              .style("stroke-width", 1)
              .duration(1500)
              //.on("end", () => setTimeout(repeat, 1500)) // this will repeat the animation after waiting 1 second

      };

      // Animate the graph for the first time
      repeat();

      resolve()
    })
}
