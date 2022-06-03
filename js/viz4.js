// TONI's
// var sampleFaces = [ 203099, 1627832,    2544,  203935,  203648,  201186,  202693,
//     1627787,  202091,  201567,    2548,    2550,  201564,  202322,
//      201143,    1717,  202355,  201633,    2853,  202681, 1626161,
//        2748,    1112,  203944,    2427,    2550,  203955,  201568,
//      203121,  201572,    1737, 1628437,    2557, 1628382,  203552,
//        1733, 1627758,  203090,  202344,  201942,    2734, 1627826,
//      101126,  203138,    1716,  202323, 1629630,  203200,  202714,
//      101179].map(id => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`)
var players = []
class Player{
    constructor(name, id, pts, score){
        this.name = name;
        this.id = id;
        this.pts = pts
        this.score = score
    }
}


d3.csv(`../data_web/https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/player_selection.csv`, (data) => {
    sampleFaces = data.map(player => new Player(player["player_name"], parseInt(player["player_id"]), player["pts"], player["score"]))
    displayFaces()
})

d3.csv(`https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/player_selection.csv`, (data) => {
    players = data.map(player => new Player(player["player_name"], parseInt(player["player_id"]), player["pts"], player["score"]))
})

var current_page = 0

// initialization of the page
function displayFaces(){
    playerFacesRow1 = document.getElementById("player-faces-row1")
    playerFacesRow2 = document.getElementById("player-faces-row2")
    playerFacesRow1.innerHTML = ""
    playerFacesRow2.innerHTML = ""

    for (var i = current_page * 10; i < (current_page + 1) * 10; i ++){
        console.log("i = ", i)
        console.log("current_page = ", current_page)
        var upperDiv = document.createElement("div");
        upperDiv.className = "player_holder";
        upperDiv.id = `player_holder_${i}`;
        // upperDiv.style = "display :flex; flex-direction:column;justify-content:center; align-items:center; paddi"
        upperDiv.draggable = true;
        upperDiv.addEventListener('dragstart', dragStart);
        // the inner img
        var img = document.createElement('img');
        player = sampleFaces[i];
        img.src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`;
        img.className = 'player_faces';
        img.id = `player_face_${i}`;
        img.draggable=false;
        target = (i < (current_page * 10 + 5)) ? playerFacesRow1 : playerFacesRow2
        // name after
        var nameHolder = document.createTextNode(player.name)
        upperDiv.appendChild(img)
        upperDiv.appendChild(nameHolder)


        target.appendChild(upperDiv)
    }
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
	}
}

function pageSelection(pageIndex) {
    current_page = pageIndex - 1
    displayFaces()
}

// PAUL's

/* draggable element */

function dragStart(e) {
    // e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.setData('text/plain', e.target.id);
}

/* drop targets */
const boxes = document.querySelectorAll('.field-player');

boxes.forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});

var teamA = document.querySelector("#team-left").children
var teamB = document.querySelector("#team-right").children
teamA = [...teamA]
teamB = [...teamB]


// var teamADefense = document.querySelector("#defense-left").children
// var teamAMid = document.querySelector("#mid-left").children
// var teamAFront = document.querySelector("#front-left").children




// var teamBDefense = document.querySelector("#defense-right").children
// var teamBMid = document.querySelector("#mid-right").children
// var teamBFront = document.querySelector("#front-right").children
// // var teamB = document.querySelector("#team-right").children
// var teamA = teamADefense.concat(teamAMid.concat(teamAFront))
// var teamB = teamBDefense.concat(teamBMid.concat(teamBFront))

// teamA = [...teamA]
// teamB = [...teamB]


function getTeamA(){

  var names = teamA.map(holder=> {
      if(holder.children.length > 0){
        return holder.children[0].textContent
      }
      else{
        return ""
      }
    }
  )

  return names.map( name => 
    players.find( player => player.name == name)
  )
}

function getTeamB(){

  var names = teamB.map(holder=> {
      if(holder.children.length > 0){
        return holder.children[0].textContent
      }
      else{
        return ""
      }
    }
  )

  return names.map( name =>
    players.find( player => player.name == name)
  )
}


function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');

    // get the draggable element
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id).cloneNode(true);
    draggable.className = "player_holder_selected"

    //TODO replace if already there

    // add it to the drop target
    draggable.id = draggable + "_";
    e.target.appendChild(draggable);
    updateGraph()
}

/// TEAM STATS

var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var xrange = 120
var stats_categories = ["team points", "efficiency score"]


// TEAM A
// append the svg object to the body of the page
var svgA = d3.select("#teamA-stats")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var xa = d3.scaleLinear()
  .domain([xrange, 0])
  .range([ 0, width]);

var xA = svgA.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xa));
xA.selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var ya = d3.scaleBand()
    .range([ 0, height ])
    .domain(stats_categories)
    .padding(.1);

//only use team B's axis
var yA = svgA.append("g")
    .call(d3.axisRight(ya).tickFormat(""))
  yA.attr("transform", "translate(" + width + ",0)");

  //TEAM B
// append the svg object to the body of the page
var svgB = d3.select("#teamB-stats")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var xb = d3.scaleLinear()
       .domain([0, xrange])
       .range([ 0, width]);
var xB = svgB.append("g")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(xb))
xB.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

// Y axis
var yb = d3.scaleBand()
       .range([ 0, height ])
       .domain(stats_categories)
       .padding(.1);

var yB = svgB.append("g")
             .call(d3.axisLeft(yb))
yB.selectAll("text")
    .attr("transform", "translate(-50,0)")
    .style("text-anchor", "middle")
    


function stats(team){
  var points = 0
  var effscore = 0.0
  var cnt = 0
  team.forEach( player => {
    if(player){
    points = points + eval(player.pts)

     effscore += eval(player.score)
     cnt += 1
    }})
    //
  return [{key:"team points", value:points}, {key:"efficiency score", value:(effscore * 1000 / cnt)}]
}


// Parse the Data
function updateGraph(){

  var statsA = stats(getTeamA())
  var statsB = stats(getTeamB())


  //Bars
  uA = svgA.selectAll("myRect")
    .data(statsA)

  uA
    .enter()
    .append("rect")
    .merge(uA)
    .attr("x", function(d) { return xa(d.value); })
    .attr("y", function(d) {
      return ya(d.key);
    })
    .attr("width", function(d) { return xa(xrange - d.value); })
    .attr("height", ya.bandwidth() )
    .attr("fill", "#1d4289")

  uA.exit().remove()

  //Bars
  uB = svgB.selectAll("myRect")
    .data(statsB)
  uB
    .enter()
    .append("rect")
    .merge(uB)
    .attr("x", xb(0) )
    .attr("y", function(d) { return yb(d.key); })
    .attr("width", function(d) { return xb(d.value); })
    .attr("height", yb.bandwidth() )
    .attr("fill", "#c80f2e")

  uB
  .exit()
  .remove()

};

updateGraph()
