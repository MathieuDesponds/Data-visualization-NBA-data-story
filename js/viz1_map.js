import Team from './Team.js';

export const TRAVEL_TIME = 750
const width = 930,
    height = 480;
const svg = d3.select("#viz1-map").append("svg")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoMercator().center([-100,43]).scale(800).translate([width/2.2, height/3.5])
const path = d3.geoPath()
  .projection(projection);


export function drawMap(){
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

         drawCities()
    });
}
//Add label to places
export function drawCities(){
    d3.csv(Team.TEAM_FILE,(data) => {
    var teams = data.map(team => new Team(team));
    svg.selectAll("circle")
      .data(teams)
    .enter()
      .append("circle")
      .attr("transform", function(d) { return "translate(" + projection(d.coordinates()) + ")"; })
      .attr("dy", ".35em")
      .attr("r", "5px")
      .attr("fill", d=>d.mainColor)

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
}

export function drawPaths(paths,teamColor, i){
    // Add the path
    var my_path = svg.selectAll(".viz1_paths-"+i)
          .data(paths)

    const nb_new_comer = my_path.enter().size()
    const nb_path = paths.length
    my_path.enter()
          .append("path")
            .attr("class", "viz1_paths-"+i)
            .attr("d", d => path(d))
            .style("fill", "none")
            .style("stroke", d => teamColor)
            .style("stroke-width", 3)
            .attr("stroke-dasharray", function() {
                        var totalLength = this.getTotalLength();
                        return totalLength + " " + totalLength;
                    })
            .attr("stroke-dashoffset", function() {
                        var totalLength = this.getTotalLength();
                        return ""+totalLength;
                    })
            .transition()
              .ease(d3.easeLinear)
              .attr("stroke-dashoffset", 0)
              .duration(TRAVEL_TIME/nb_new_comer)
              .delay((d, i) => TRAVEL_TIME/nb_new_comer*(i-(nb_path-nb_new_comer)))
            .transition()
              .ease(d3.easeLinear)
              .style("stroke-opacity", 0.5)
              .style("stroke-width", 1)
              .duration(TRAVEL_TIME*2/5)
              .delay(TRAVEL_TIME/5)
    my_path.exit().remove()
}
