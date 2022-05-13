import Team from './Team.js'

function showYearSelection(){
  let years = [...Array(19).keys()].map(i => 2021-i)
  var dropdownButton = d3.select("#viz1-period-selector")
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
showTeams(Team.load_teams())

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
