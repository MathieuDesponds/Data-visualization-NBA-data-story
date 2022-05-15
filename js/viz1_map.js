import Team from './Team.js';

var width = 960,
    height = 450;
var svg = d3.select("#viz1-map").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json("https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data/map/na.json", function(error, na) {
  if (error) return console.error(error);
  var projection = d3.geo.albers().scale(800)
  //  .rotate([-99.659, 0])
  // svg.append("path")
  //     .datum(topojson.feature(na, na.objects.subunits))
  //     .attr("d", d3.geo.path().projection(projection));
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

       //Add points for the cities on the map
      // svg.append("path")
      //     .datum(topojson.feature(na, na.objects.places))
      //     .attr("d", path)
      //     .attr("class", "place");


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

});
