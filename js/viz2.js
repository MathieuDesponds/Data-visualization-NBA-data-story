
console.log("coucou")

var margin = {top: 30, right: 10, bottom: 10, left: 0},
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

y = d3.scalePoint()
    .range([height, 0])
    .domain([...Array(35).keys()])
    
// Build the X scale -> it find the best position for each Y axis
x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain([]);

var axisX = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

var axisY = svg.append("g")
    //.attr("transform", "translate(0," + height + ")")
    .call(d3.axisLeft().scale(y))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
      
d3.select(".selectButton")
    .selectAll('myOptions')
    .data(["22003", "22015"])
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

function updateRanking(season){
    d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/rankings.csv",
    (data) => {

        console.log("coucou")
        function filterSeason(season){
            return data.filter( standing => standing["season_id"] == season)
        }
        var rankings2003 = filterSeason(season)
        console.log(rankings2003)
    
        // Extract the list dates where ranking changes
        let dimensions = [...new Set(rankings2003.map( elem => elem["standingsdate"]))]
        console.log(dimensions)
    
        // Build the X scale -> it find the best position for each Y axis
        x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);
    
        axisX.transition().duration(1000).call(d3.axisBottom(x))
    
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
    
        svg.selectAll("#ranking_line").remove()
        
        // Draw the lines
        svg.selectAll("myPath")
            .data(rankings2003)
            .enter()
                .append("path")
                .attr("id", "ranking_line")
                .attr("d",  path)
                .style("fill", "none")
                .style("stroke", "#69b3a2")
                .style("opacity", 0.5)
    })
}

// Parse the Data
d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/rankings.csv",
    (data) => {
    allseasons = [...new Set(data.map(row => row["season_id"]))]
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allseasons)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

    d3.select("#selectButton")
        .on("change", function(d) {
            console.log("click")
            var selectedOption = d3.select(this).property("value")
            updateRanking(selectedOption)
        })
});

