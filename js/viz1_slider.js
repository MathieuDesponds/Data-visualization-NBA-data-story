import {drawPaths} from './viz1_map.js'
import {selector} from './viz1_selectors.js'
// import {getChosenTeams} from './viz1_selectors.js'

// var formatDateIntoYear = d3.timeFormat("%Y");
// var formatDate = d3.timeFormat("%b %Y");
// var parseDate = d3.timeParse("%m/%d/%y");
//
// const startDate = new Date("2003-10-07"),
//     endDate = new Date("2004-05-18"),
//     NB_DAYS = Math.ceil((endDate-startDate) / (1000 * 60 * 60 * 24)); ;
const start =1, NB_MATCH = 96, end = NB_MATCH
var margin = {top:50, right:50, bottom:0, left:50},
    width = 550 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var svg = d3.select("#viz1-timeline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
    ////////// slider //////////

var moving = false;
var currentValue = 0;
var targetValue = width;
var timer = 0;
var playButton = d3.select("#viz1-play-button");

var x = d3.scaleLinear() //.scaleTime()
    .domain([start, end])
    .range([0, targetValue])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height/5 + ")");
d3.csv("../data_web/seasons.csv",(data) => {
  console.log(selector.getChosenTeams())
  data.filter(function(d){
      if(d["team"] == selector.getChosenTeams().values().next().id && d["year"] == selector.getChosenYear){
      return d
    }
  })
  //Compute all the paths
  const locations = data.map(line => [line["game_loc_long"],line["game_loc_lat"]])
  const start_loc = locations[0]
  var last_loc = start_loc
  var links =   []
  locations.forEach(function(row){
    var topush = {type: "LineString", coordinates: [last_loc, row]}
    links.push(topush)
    last_loc = row
  })
  //Append the slider on the svg
  slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() {
            currentValue = d3.event.x;
            update(x.invert(currentValue),links);
          })
      );

  //Les textes qui sont sous le slider
  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(function(d) { return d; });

  // Le cerlce qui sert à slider
  var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9);

  // Le label du slider qui est sur le cercle
  var label = slider.append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .text(1)
      .attr("transform", "translate(0," + (-25) + ")")

  playButton
      .on("click", function() {
      console.log(links[0])
      var button = d3.select(this);
      if (button.text() == "Pause") {
        moving = false;
        clearInterval(timer);
        // timer = 0;
        button.text("Play");
      } else {
        moving = true;
        timer = setInterval(step, 1000);
        button.text("Pause");
      }
    })

  function step() {
    update(x.invert(currentValue),links);
    currentValue = currentValue + (targetValue/NB_MATCH);
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      playButton.text("Play");
    }
  }
  function update(h,links) {
    let n = Math.ceil(h)
    drawPaths(links[n])
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
      .attr("x", x(h))
      .text(h);

  // filter data set and redraw plot
  }
})
