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
//_-------------------------------------------------------//
class Team{
    constructor(name, id, abbreviation){
        this.name = name;
        this.id = id;
        this.abbr = abbreviation
    }
}
d3.csv('data/teams_summary.csv', (data) => {
  d3.select("#viz1-left-part")
    .append('text')
    .text("rrrrrr")
    console.log(data[0])
  //const teams = data.map(team => new Team(team["NICKNAME"], parseInt(team["TEAM_ID"]), team["ABBREVIATION"]))
  d3.select("#viz1-left-part")
    .append('text')
    .text("rrrrrr")

  })
var teams = [{id : 1610612737, abbr : 'ATL', name : 'Hawks'},{id : 1610612740, abbr : 'NOP', name : 'Pelicans'},{id : 1610612738, abbr : 'BOS', name : 'Celtics'}];
var chosenTeams = new Set()


var teamSelector = d3.select("#viz1-team-selector");
var teamButton =
    teamSelector
        .selectAll(".checkbox")
        .data(teams)
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

d3.selectAll(".checkboxes").on("click", function(d) {
    updateChosenTeams(d, d3.select(this).property("checked"))
})

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
