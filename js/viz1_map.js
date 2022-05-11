var width = 960,
    height = 1160;
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

      svg.append("path")
       .datum(topojson.mesh(na, na.objects.subunits, function(a, b) { return a !== b }))
       .attr("d", path)
       .attr("class", "subunit-boundary");
});
