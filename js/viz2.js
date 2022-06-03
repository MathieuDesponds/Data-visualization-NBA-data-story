import Team from './Team.js'
var margin = {top: 50, right: 100, bottom: 50, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".viz2plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

//NOTE the axes are updated dynamically through axisX, axisY
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([31,1])

// Build the X scale -> it find the best position for each Y axis
var x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain([0, 1]);

var axisX = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))


var axisY = svg.append("g")
    .call(d3.axisLeft().scale(y))
var axisY2= svg.append("g")
axisY.selectAll("text")
    .attr("transform", "translate(-10,-5)rotate(-45)")
    .style("text-anchor", "end");


// options for the select bar
d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/rankings.csv",
    (data) => {
    var allseasons = [...new Set(data
                             .filter( row => row["season_id"].charAt(0) == "1")
                             .map(row => row["season_id"]))]
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allseasons)
        .enter()
        .append('option')
        .text(function (d) { 
            
            return d.slice(1) == "2003" ? "" : d.slice(1); 
        }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton")
        .on("change", function(d) {
            var selectedOption = d3.select(this).property("value")
            updateRanking(selectedOption)
        })
});

function updateRanking(season){
    d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/rankings.csv",
    (data) => {
        d3.csv(Team.TEAM_FILE,(data2) => {
        var teams = data2.map(team => new Team(team));

        function filterSeason(season){
            return data.filter( standing => standing["season_id"] == season)
        }
        var rankings2003 = filterSeason(season)

        // Extract the list dates where ranking changes
        let dimensions = [...new Set(rankings2003.map( elem => elem["standingsdate"]))]

        var last_date = dimensions[dimensions.length-1]
        var last_ranking = data.filter( standing => standing["standingsdate"] == last_date)
            .map(row => [parseInt(row['next_rank']), row['team_id']])
            .sort( function( a , b){
                if(a[0] > b[0]) return 1;
                if(a[0] < b[0]) return -1;
                return 0;
            })
            .map(row => getNameFromTeamId(row[1]));


        // Build the X scale
        x = d3.scalePoint()
            .range([0, width])
            .domain(dimensions);

        axisX.transition().duration(500).call(d3.axisBottom(x))
        axisX.selectAll("text")
            .attr("transform", "translate(0,-5)rotate(-45)")
            .style("text-anchor", "end");

        var y2 = d3.scalePoint()
            .range([height/31*last_ranking.length, 0])
            .domain(last_ranking)

        axisY2.selectAll("text").remove()
        axisY2.append("g")
            .call(d3.axisRight().scale(y2))

        axisY2.selectAll("text")
            .attr("class", "viz2-team-name-text")
            .attr("id", d => "viz2-team-name-text-"+d['team_id'])
            .attr("transform", "translate("+width+",0)")
            //.style("stroke", function(d) {return getColorFromTeamId(d['team_id'])})
            .style("text-anchor", "start");

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this row.
        function path(row) {
            var date = row["standingsdate"]
            var next_date = row["next_standing"]
            var current_rank = row["rank"]
            var future_rank = row["next_rank"]

            return d3.line()(
                [[x(date), y(eval(current_rank))],
                [x(next_date), y(eval(future_rank))]]
            );
        }

        svg.selectAll(".ranking_line").remove()

        function getColorFromTeamId(team_id){
          var team = teams.filter(d => d.id == team_id)[0]
          return team.mainColor
        }
        var highlight = function(d){
          // // first every group turns grey
          // d3.selectAll(".viz2-team-name-text")
          // .transition().duration(200)
          // .style("stroke", "lightgrey")
          // .style("opacity", "0.3")

          d3.selectAll(".ranking_line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.3")
          // Second the hovered specie takes its color
          // d3.selectAll("#viz2-team-name-text-"+d['team_id'])
          //   .transition().duration(20)
          //   .style("stroke", "black")
          //   .style("opacity", "1")

          d3.selectAll("#ranking_line_" + d['team_id'])
            .transition().duration(20)
            .style("stroke", d => getColorFromTeamId(d['team_id']))
            .style("opacity", "1")
        }

        // Unhighlight
        var doNotHighlight = function(d){
          d3.selectAll(".ranking_line")
            .transition().duration(500).delay(100)
            .style("stroke", d => getColorFromTeamId(d['team_id']))
            .style("opacity", "1")

          // d3.selectAll(".viz2-team-name-text")
          //   .transition().duration(500).delay(100)
          //   .style("stroke", "black")
          //   .style("opacity", "1")
        }
        // Draw the lines
        svg.selectAll(".ranking_line")
            .data(rankings2003)
            .enter()
                .append("path")
                .attr("class", "ranking_line")
                .attr("id", d => "ranking_line_"+d['team_id'])
                .attr("d",  path)
                .style("fill", "none")
                .style("stroke", d => getColorFromTeamId(d['team_id']))
                .style("stroke-width", 2)
                .style("opacity", 0.5)
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight );

                // Highlight the specie that is hovered
        function getColorFromTeamId(team_id){
          var team = teams.filter(d => d.id == team_id)[0]
          return team.mainColor
        }
        function getNameFromTeamId(team_id){
          var team = teams.filter(d => d.id == team_id)[0]
          return team.name
        }
    })})
}

updateRanking("12003");
