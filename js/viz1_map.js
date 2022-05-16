import Team from './Team.js';

var width = 960,
    height = 480;
var svg = d3.select("#viz1-map").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json("https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data/map/na.json", function(error, na) {
  if (error) return console.error(error);
  var projection = d3.geo.albers().scale(800)
  var path = d3.geo.path()
    .projection(projection);
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

      //Add label to places
      d3.csv(Team.TEAM_FILE,(data) => {
        var teams = data.map(team => new Team(team));
        svg.selectAll("circle")
    		  .data(teams)
        .enter()
      		.append("circle")
          .attr("transform", function(d) { return "translate(" + projection(d.coordinates()) + ")"; })
      		.attr("r", "8px")
      		.attr("fill", "red")

        svg.selectAll(".place-label")
          .data(teams)
        .enter().append("text")
          .attr("class", "place-label")
          .attr("transform", function(d) { return "translate(" + projection(d.coordinates()) + ")"; })
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });
        })

        ////////// PATHS /////////////
      var pathProj = d3.geoPath()
        .projection(projection)
      d3.csv("../data_web/season_heat_2003.csv",(data) => {
        const locations = data.map(line => [line["game_loc_long"],line["game_loc_lat"]])
        const start_loc = locations[0]
        var last_loc = start_loc
        var link =   []
        locations.forEach(function(row){
          var topush = {type: "LineString", coordinates: [last_loc, row]}
          link.push(topush)
          last_loc = row
        })
        console.log(locations[0])
        // Add the path
      svg.selectAll("myPath")
        .data(link)
        .enter()
        .append("path")
          .attr("d", function(d){ return pathProj(d)})
          .style("fill", "none")
          .style("stroke", "orange")
          .style("stroke-width", 4)
      })


});
