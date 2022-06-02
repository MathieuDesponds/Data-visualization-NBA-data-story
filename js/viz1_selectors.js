import Team from './Team.js';
import {DUMMY_TEAM} from './Team.js';

class Viz1Selector {
  constructor(){
    this.chosenTeams = new Array(Team.MAX_NUMBER_OF_TEAMS)
    this.chosenYear = 2021
  }
  getChosenTeams(){
    return this.chosenTeams
  }

  getChosenYear(){
    return this.chosenYear
  }
  showYearSelection(){
    let years = [...Array(19).keys()].map(i => 2021-i)
    var dropdownButton = d3.select("#viz1-header")
      .append('select')
    // add the options to the button
    dropdownButton // Add a button
      .attr("id", "ddButon") // corresponding value returned by the butto
      .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
     	.data(years)
      .style("float", "right")
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the butto

    dropdownButton.on("change", (d) => {
        this.updateYear(d3.select('#ddButon').property("value"))
    })
  }

  updateYear(year){
    this.chosenYear = year
    d3.select("#chosen-year")
      .text(`The year chosen is ${year}`)
  }

  // showPeriodForStatisticsSelection(teams){
  //   let nb_matches = [1,2,5,10,20,"Whole season"]
  //   var dropdownButton = d3.select("#viz1-period-selector")
  //     .append('select')
  //   // add the options to the button
  //   dropdownButton // Add a button
  //     .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
  //    	.data(nb_matches)
  //     .style("float", "right")
  //     .enter()
  //   	.append('option')
  //     .text(function (d) { return d; }) // text showed in the menu
  //     .attr("value", function (d) { return d; }) // corresponding value returned by the butto
  //
  //   dropdownButton.on("change", function(d) {
  //       updatePeriod(d3.select(this).property("value"))
  //   })
  //   function updatePeriod(nb_matches){
  //     // d3.select("#chosen-year")
  //     //   .text(`The year chosen is ${year}`)
  //   }
  // }

  addSelectorForTeam(teams){
    var dropdownButton = d3.select("#viz1-header")
      .append('select')
    
  }

  showSelectorForTeams(teams,i){
    var dropdownButton = d3.select("#viz1-header")
      .append('select')
    // add the options to the button
    dropdownButton // Add a button
      .attr("class", "team-selector")
      .attr("id", "team-selector-"+i)
      .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
     	.data(teams)
      .style("float", "right")
      .enter()
    	.append('option')
      .text(function (d) { return d.city+" "+d.name; }) // text showed in the menu
      .attr("value", function (d) { return d.id; }) // corresponding value returned by the butto

    dropdownButton.on("change", d => {
        const teamId = d3.select("#team-selector-"+i).property("value")
        const nb = parseInt(d3.select("#team-selector-"+i).property("id").substring(14))
        this.updateChosenTeams(teamId, nb,teams)
    })


    if(i < Team.MAX_NUMBER_OF_TEAMS){
      d3.select("#viz1-header")
          .append("button", "newTeamDisplay")
          .attr("id", "new-team-button")
          .text("+")
          .on("click", () => {
            d3.select("#new-team-button").remove()
            this.showSelectorForTeams(teams, i + 1)
          })
    }
  }
  updateChosenTeams(teamId, i,teams){
    this.chosenTeams[i] = teams.filter(function(d) {
      if(d.id == ""+teamId){
        return d
      }
    })[0]
  }
  // updateChosenTeams(d, add){
  //   if(add){
  //     this.chosenTeams.add(d)
  //   }else{
  //     this.chosenTeams.delete(d)
  //   }
  //   let text = ""
  //   if(this.chosenTeams.size == 0){
  //     text = "Chose teams to display !"
  //   }else{
  //     text = "The teams chosen are ";
  //     this.chosenTeams.forEach(value => text += value.name+ ", ")
  //     text = text.slice(0,-2)
  //   }
  //   d3.select("#chosen-teams")
  //     .text(`${text}`)
  // }

  // showTeamsCheckbox(data){
  //   var teamSelector = d3.select("#viz1-team-selector");
  //   var teamButton =
  //       teamSelector
  //           .selectAll(".checkbox")
  //           .data(data)
  //           .enter()
  //           .append("div")
  //           .attr("class", "checkbox");
  //   teamButton.append("input")
  //       .attr("type", "checkbox")
  //       .attr("id", function(d) { return "checkboxes"+d.id; })
  //       .attr("value", function(d) { return d.name; })
  //       .attr("class", "checkboxes")
  //   teamButton.append("label")
  //       .attr('for', function(d) { return d.abbr; })
  //       .text(function(d) { return d.name; })
  //       .attr("class", "checkboxes");
  //
  //   // teamButton.append('image')
  //   //     .attr('xlink:href', function(d) { return `https://cdn.nba.com/logos/nba/${d.id}/global/L/logo.svg`})
  //   //     .attr('height', 200)
  //   //     .attr('width', 200)
  //
  //   d3.selectAll(".checkboxes").on("click", (d) => {
  //       this.updateChosenTeams(d, d3.select("#checkboxes"+d.id).property("checked"))
  //   })
  // }


  getChosenTeams(){
    var out = []
    for (let i = 0; i < Team.MAX_NUMBER_OF_TEAMS; i++) {
      if (this.chosenTeams[i] != null && this.chosenTeams[i].id != 0){
        out.push(this.chosenTeams[i])
      }
    }
    return out
  }
}

export var selector = new Viz1Selector()
