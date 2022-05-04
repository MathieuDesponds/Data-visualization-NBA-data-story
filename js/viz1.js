<<<<<<< HEAD:website/js/viz1.js
var width = 900,
        rotated = 90,
        height = 502;

    //countries which have states, needed to toggle visibility
    //for USA/ etc. either show countries or states, not both
    var usa, canada;
    var states; //track states
    //track where mouse was clicked
    var initX;
    //track scale only rotate when s === 1
    var s = 1;
    var mouseClicked = false;


    var projection = d3.geo.mercator()
        .scale(520)
        .translate([width*1.3/2,height*1.9])
        .rotate([rotated,20,0]); //center on USA because 'murica

    var zoom = d3.behavior.zoom()
         .scaleExtent([1, 20])
         .on("zoom", zoomed);

    var svg = d3.select("#viz1-map").append("svg")
        .attr("width", width)
        .attr("height", height)

    //for tooltip
    var offsetL = document.getElementById('viz1-map').offsetLeft+10;
    var offsetT = document.getElementById('viz1-map').offsetTop+10;

    var path = d3.geo.path()
        .projection(projection);

    var tooltip = d3.select("#viz1-map")
         .append("div")
         .attr("class", "tooltip hidden");

    //need this for correct panning
    var g = svg.append("g");

    //det json data and draw it
    d3.json("https://gist.githubusercontent.com/catc/302b2baf27fb7cc1be042b7f10a05849/raw/e788d646ce9bd3a4ddeb30f710d2734faa7672fc/combined2.json", function(error, world) {
      if(error) return console.error(error);

      //countries
      g.append("g")
          .attr("class", "boundary")
        .selectAll("boundary")
          .data(topojson.feature(world, world.objects.countries).features)
          .enter().append("path")
          .attr("name", function(d) {return d.properties.name;})
          .attr("id", function(d) { return d.id;})
          .on('click', selected)
          .on("mousemove", showTooltip)
          .on("mouseout",  function(d,i) {
              tooltip.classed("hidden", true);
           })
          .attr("d", path);

      //states
      g.append("g")
          .attr("class", "boundary state hidden")
        .selectAll("boundary")
          .data(topojson.feature(world, world.objects.states).features)
          .enter().append("path")
          .attr("name", function(d) { return d.properties.name;})
          .attr("id", function(d) { return d.id;})
          .attr("d", path);

      states = d3.selectAll('.state');

      d3.selectAll(".boundary")
        .style("stroke-width", 22);

      //toggle state/USA visability
      states
        .classed('hidden', true);
      usa
        .classed('hidden', false);
      canada
        .classed('hidden', true);
    });

    function showTooltip(d) {
      label = d.properties.name;
      var mouse = d3.mouse(svg.node())
        .map( function(d) { return parseInt(d); } );
      tooltip.classed("hidden", false)
        .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
        .html(label);
    }

    function selected() {
      d3.select('.selected').classed('selected', false);
      d3.select(this).classed('selected', true);
    }


    function zoomed() {


  }


function showYearSelection(){
  let years = [...Array(19).keys()].map(i => 2021-i)
  var dropdownButton = d3.select("#viz1-year-selector")
    .append('select')
  // add the options to the button
  dropdownButton // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
   	.data(years)
    .style("float", "right")
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the butto

  dropdownButton.on("change", function(d) {
      updateYear(d3.select(this).property("value"))
  })
  function updateYear(year){
    d3.select("#chosen-year")
      .text(`The year chosen is ${year}`)
    }
}
showYearSelection()


    // XXX:
//_-------------------------------------------------------//


function showPeriodForStatisticsSelection(){
  let nb_matches = [1,2,5,10,20,"Whole season"]
  var dropdownButton = d3.select("#viz1-period-selector")
    .append('select')
  // add the options to the button
  dropdownButton // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
   	.data(nb_matches)
    .style("float", "right")
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the butto

  dropdownButton.on("change", function(d) {
      updatePeriod(d3.select(this).property("value"))
  })
  function updatePeriod(nb_matches){
    // d3.select("#chosen-year")
    //   .text(`The year chosen is ${year}`)
  }
}
showPeriodForStatisticsSelection()


    // XXX:
//_-------------------------------------------------------//
class Team{
    constructor(name, id, abbreviation, lat, long){
        this.name = name;
        this.id = id;
        this.abbr = abbreviation;
        this.lat = lat;
        this.long = long;
    }
}

var chosenTeams = new Set()
d3.csv('https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/teams_summary.csv', (data) => {
  teams = data.map(team => new Team(team["NICKNAME"], parseInt(team["TEAM_ID"]), team["ABBREVIATION"],parseInt(team["LATITUDE"]),parseInt(team["LONGITUDE"])))
  showTeams(teams)
  })

function showTeams(data){
  var teamSelector = d3.select("#viz1-team-selector");
  var teamButton =
      teamSelector
          .selectAll(".checkbox")
          .data(data)
          .enter()
          .append("div")
          .attr("class", "checkbox");
  teamButton.append("input")
      .attr("type", "checkbox")
      .attr("id", function(d) { return d.id; })
      .attr("value", function(d) { return d.name; })
      .attr("class", "checkboxes");
  teamButton.append("label")
      .attr('for', function(d) { return d.abbr; })
      .text(function(d) { return d.name; })
      .attr("class", "checkboxes");

  // teamButton.append('image')
  //     .attr('xlink:href', function(d) { return `https://cdn.nba.com/logos/nba/${d.id}/global/L/logo.svg`})
  //     .attr('height', 200)
  //     .attr('width', 200)

  d3.selectAll(".checkboxes").on("click", function(d) {
      updateChosenTeams(d, d3.select(this).property("checked"))
  })
}


function updateChosenTeams(d, add){
  if(add){
    chosenTeams.add(d.name)
  }else{
    chosenTeams.delete(d.name)
  }
  let text = ""
  if(chosenTeams.size == 0){
    text = "Chose teams to display !"
  }else{
    text = "The teams chosen are ";
    chosenTeams.forEach (value => text += value+ ", ")
    text = text.slice(0,-2)
  }
  d3.select("#chosen-teams")
    .text(`${text}`)
}
=======
var width = 962,
        rotated = 90,
        height = 502;

    //countries which have states, needed to toggle visibility
    //for USA/ etc. either show countries or states, not both
    var usa, canada;
    var states; //track states
    //track where mouse was clicked
    var initX;
    //track scale only rotate when s === 1
    var s = 1;
    var mouseClicked = false;


    var projection = d3.geo.mercator()
        .scale(520)
        .translate([width*1.3/2,height*1.9])
        .rotate([rotated,20,0]); //center on USA because 'murica

    var zoom = d3.behavior.zoom()
         .scaleExtent([1, 20])
         .on("zoom", zoomed);

    var svg = d3.select("#viz1-map").append("svg")
        .attr("width", width)
        .attr("height", height)

    //for tooltip
    var offsetL = document.getElementById('viz1-map').offsetLeft+10;
    var offsetT = document.getElementById('viz1-map').offsetTop+10;

    var path = d3.geo.path()
        .projection(projection);

    var tooltip = d3.select("#viz1-map")
         .append("div")
         .attr("class", "tooltip hidden");

    //need this for correct panning
    var g = svg.append("g");

    //det json data and draw it
    d3.json("https://gist.githubusercontent.com/catc/302b2baf27fb7cc1be042b7f10a05849/raw/e788d646ce9bd3a4ddeb30f710d2734faa7672fc/combined2.json", function(error, world) {
      if(error) return console.error(error);

      //countries
      g.append("g")
          .attr("class", "boundary")
        .selectAll("boundary")
          .data(topojson.feature(world, world.objects.countries).features)
          .enter().append("path")
          .attr("name", function(d) {return d.properties.name;})
          .attr("id", function(d) { return d.id;})
          .on('click', selected)
          .on("mousemove", showTooltip)
          .on("mouseout",  function(d,i) {
              tooltip.classed("hidden", true);
           })
          .attr("d", path);

      //states
      g.append("g")
          .attr("class", "boundary state hidden")
        .selectAll("boundary")
          .data(topojson.feature(world, world.objects.states).features)
          .enter().append("path")
          .attr("name", function(d) { return d.properties.name;})
          .attr("id", function(d) { return d.id;})
          .attr("d", path);

      states = d3.selectAll('.state');

      d3.selectAll(".boundary")
        .style("stroke-width", 22);

      //toggle state/USA visability
      states
        .classed('hidden', true);
      usa
        .classed('hidden', false);
      canada
        .classed('hidden', true);
    });

    function showTooltip(d) {
      label = d.properties.name;
      var mouse = d3.mouse(svg.node())
        .map( function(d) { return parseInt(d); } );
      tooltip.classed("hidden", false)
        .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
        .html(label);
    }

    function selected() {
      d3.select('.selected').classed('selected', false);
      d3.select(this).classed('selected', true);
    }


    function zoomed() {


  }

  function drawLabels() {
        // white shadow
        map.svg.append("g").attr('class', 'zoom')
            .selectAll("text")
            .data(topojson.feature(map.geo, map.geo.objects.units).features)
            .enter().append("text")
            .attr("class", "place-label shadow")
            .style("font-size", "8px")
            .attr("x", function(d) { return map.path.centroid(d)[0]; })
            .attr("y", function(d) { return map.path.centroid(d)[1]+4; })
            .attr("text-anchor","middle")
            .text(function(d) { return csv[d.properties.name].num; })
            .on('click', map.clicked.bind(map));

        // black text
        map.svg.append("g").attr('class', 'zoom')
            .selectAll("text")
            .data(topojson.feature(map.geo, map.geo.objects.units).features)
            .enter().append("text")
            .attr("class", "place-label")
            .style("font-size", "8px")
            .attr("x", function(d) { return map.path.centroid(d)[0]; })
            .attr("y", function(d) { return map.path.centroid(d)[1]+4; })
            .attr("text-anchor","middle")
            .text(function(d) { return csv[d.properties.name].num; })
            .on('click', map.clicked.bind(map));
    }



function showYearSelection(){
  let years = [...Array(19).keys()].map(i => 2021-i)
  var dropdownButton = d3.select("#viz1-year-selection")
    .append('select')
  // add the options to the button
  dropdownButton // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
   	.data(years)
    .style("float", "right")
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the butto

  dropdownButton.on("change", function(d) {
      updateYear(d3.select(this).property("value"))
  })
  function updateYear(year){
    d3.select("#chosen-year")
      .text(`The year chosen is ${year}`)
    }
}
showYearSelection()


    // XXX:
//_-------------------------------------------------------//
class Team{
    constructor(name, id, abbreviation, lat, long){
        this.name = name;
        this.id = id;
        this.abbr = abbreviation;
        this.lat = lat;
        this.long = long;
    }
}

var chosenTeams = new Set()
d3.csv('https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/website/data/teams_summary.csv', (data) => {
  teams = data.map(team => new Team(team["NICKNAME"], parseInt(team["TEAM_ID"]), team["ABBREVIATION"],parseInt(team["LATITUDE"]),parseInt(team["LONGITUDE"])))
  showTeams(teams)
  })

function showTeams(data){
  var teamSelector = d3.select("#viz1-team-selector");
  var teamButton =
      teamSelector
          .selectAll(".checkbox")
          .data(data)
          .enter()
          .append("div")
          .attr("class", "checkbox");
  teamButton.append("input")
      .attr("type", "checkbox")
      .attr("id", function(d) { return d.id; })
      .attr("value", function(d) { return d.name; })
      .attr("class", "checkboxes");
  teamButton.append("label")
      .attr('for', function(d) { return d.abbr; })
      .text(function(d) { return d.name; })
      .attr("class", "checkboxes");

  // teamButton.append('image')
  //     .attr('xlink:href', function(d) { return `https://cdn.nba.com/logos/nba/${d.id}/global/L/logo.svg`})
  //     .attr('height', 200)
  //     .attr('width', 200)

  d3.selectAll(".checkboxes").on("click", function(d) {
      updateChosenTeams(d, d3.select(this).property("checked"))
  })
}


function updateChosenTeams(d, add){
  if(add){
    chosenTeams.add(d.name)
  }else{
    chosenTeams.delete(d.name)
  }
  let text = "The teams chosen are ";
  chosenTeams.forEach (value => text += value+ ", ")
  d3.select("#chosen-teams")
    .text(`${text.slice(0,-2)}`)
}
>>>>>>> c4d84b778f5752a25375b9810382cf00f011f50d:js/viz1.js
