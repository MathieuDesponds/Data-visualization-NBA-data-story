import Team from './Team.js';

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


var chosenTeams = new Set()
//showTeams(Team.load_teams())
d3.csv(Team.TEAM_FILE,(data) => showTeams(data.map(team => new Team(team))))

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

// STATISTICS
// https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html 

var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#viz1-statistics")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.group)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

})
