// TONI's
var sampleFaces = [ 203099, 1627832,    2544,  203935,  203648,  201186,  202693,
    1627787,  202091,  201567,    2548,    2550,  201564,  202322,
     201143,    1717,  202355,  201633,    2853,  202681, 1626161,
       2748,    1112,  203944,    2427,    2550,  203955,  201568,
     203121,  201572,    1737, 1628437,    2557, 1628382,  203552,
       1733, 1627758,  203090,  202344,  201942,    2734, 1627826,
     101126,  203138,    1716,  202323, 1629630,  203200,  202714,
     101179].map(id => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`)

class Player{
    constructor(name, id, pts){
        this.name = name;
        this.id = id; 
        this.pts = pts
    }
}

d3.csv(`https://raw.githubusercontent.com/com-480-data-visualization/datavis-project-2022-lebron-jenkins/master/data_web/player_selection.csv`, (data) => {
    console.log("data :")
    console.log(data)
    sampleFaces = data.map(player => new Player(player["player_name"], parseInt(player["player_id"]), player["pts"]))
    console.log("sampleFaces :")
    console.log(sampleFaces)
    displayFaces()
})

var current_page = 0

// initialization of the page
function displayFaces(){
    playerFacesRow1 = document.getElementById("player-faces-row1")
    playerFacesRow2 = document.getElementById("player-faces-row2")
    playerFacesRow1.innerHTML = ""
    playerFacesRow2.innerHTML = ""

    for (var i = current_page * 10; i < (current_page + 1) * 10; i ++){
        var upperDiv = document.createElement("div");
        upperDiv.className = "player_holder";
        upperDiv.id = `player_holder_${i}`;
        upperDiv.style = "display :flex; flex-direction:column;justify-content:center; align-items:center"
        upperDiv.addEventListener('dragstart', dragStart);
        upperDiv.draggable = true;

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
        console.log(target)
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
    e.dataTransfer.setData('text/plain', e.target.id);
}

/* drop targets */
const boxes = document.querySelectorAll('.testbox');

boxes.forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});


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

    //TODO replace if already there

    // add it to the drop target
    draggable.id = draggable + "_";
    e.target.appendChild(draggable);
    console.log(e.target.children);
}

// dummy hist for winning team
var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#team-stats")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function(data) {


  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 13000])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Country); })
    .attr("width", function(d) { return x(d.Value); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#69b3a2")
});