import {drawPaths, TRAVEL_TIME} from './viz1_map.js'
import {selector} from './viz1_selectors.js'
import {updateStats} from './viz1_stats.js'
// import {getChosenTeams} from './viz1_selectors.js'

// var formatDateIntoYear = d3.timeFormat("%Y");
// var formatDate = d3.timeFormat("%b %Y");
// var parseDate = d3.timeParse("%m/%d/%y");
//
// const startDate = new Date("2003-10-07"),
//     endDate = new Date("2004-05-18"),
//     NB_DAYS = Math.ceil((endDate-startDate) / (1000 * 60 * 60 * 24)); ;
const start =1, NB_MATCH = 82, end = NB_MATCH
var margin = {top:10, right:50, bottom:0, left:65},
    width = 750 - margin.left - margin.right,
    height = 65 - margin.top - margin.bottom;

var svg = d3.select("#viz1-timeline")
    .append("svg")
    .attr("width", width +  margin.left + margin.right)
    .attr("height", height+ margin.top + margin.bottom);
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

const button_size = 60
var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate("  +margin.left+" ," + height/2 + ")");


d3.csv("../data_web/seasons.csv",(data) => {
  var groupedData = d3.flatRollup(
    data,
    x => ({
      matches : x
    }),
    d => `${d["season"]} ${d["team"]}`
  ).map(([key, values]) => {
    const [season, team] = key.split(' ');
    return {season, team, ...values};
  });

  function getData(){
    var year = selector.getChosenYear()
    var teams = selector.getChosenTeams()
    data = []
    teams.forEach(team => data.push(getSeason(team.id, year)))
    return data
  }
  function getMoreData(){
    var year = selector.getChosenYear()
    var teams = selector.getChosenTeams()
    data = []
    teams.forEach(team => data.push(getTeamSeasonData(team.id, year)))
    return data
  }


  function getSeason(teamId, year){
    var that_season = groupedData.filter(function(d){
      if(d["season"]==""+year && d["team"]==""+teamId){
        return d
      }
    })[0]//[1].map(line => [line["game_loc_long"],line["game_loc_lat"]])
    //
    // console.log(that_season.matches)
    //Compute all the paths
    const locations = that_season.matches.map(line => [line["game_loc_long"],line["game_loc_lat"]])
    const start_loc = locations[0]
    var last_loc = start_loc
    var links =   []
    locations.forEach(function(row){
      var topush = {type: "LineString", coordinates: [last_loc, row]}
      links.push(topush)
      last_loc = row
    })
    return links
  }


  function getTeamSeasonData(teamId, year){
    var that_season = groupedData.filter(function(d){
      if(d["season"]===""+year && d["team"]==""+teamId){
        return d
      }
    })[0]
    const win_pcts = that_season.matches.map(line => [line["team"], line["w_pct"]])
    return win_pcts
  }

  //var groupedData = d3.group(data, d => d["year"])

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
            update(x.invert(currentValue),getData(), getMoreData());
          })
      );

  //Les textes qui sont sous le slider
  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
      .data(x.ticks(16))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 5)
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
      .text("Season Start")
      .attr("transform", "translate(0," + (-10) + ")")

  playButton
      .on("click", function() {
        var button = d3.select(this);
        if (button.text() == "Pause") {
          moving = false;
          clearInterval(timer);
          // timer = 0;
          button.text("Play");
        } else {
          data = getData()
          moving = true;
          timer = setInterval(() => step(getData(), getMoreData()), TRAVEL_TIME);
          button.text("Pause");
        }
      })

  function step(links, win_pcts) {
    update(x.invert(currentValue),links, win_pcts);
    currentValue = currentValue + (targetValue/NB_MATCH);
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      playButton.text("Play");
    }
  }


  function update(h,locations, win_pcts) {
    let n = Math.ceil(h)
    let teams = selector.getChosenTeams()
    locations.forEach((team_match, i) => {
      drawPaths(team_match.slice(0,Math.min(team_match.length,n)),teams[i].mainColor, i)
    });
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
      .attr("x", x(h))
      .text("Match #"+n);

    // filter data set and redraw plot
    updateStats(win_pcts.map((team_match) => team_match[n]))
  }
})
