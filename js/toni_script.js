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
        upperDiv.style = "display :flex; flex-direction:column;justify-content:center; align-items:center"
        


        // the inner img
        var img = document.createElement('img');
        player = sampleFaces[i];
        img.src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`;
        img.className = 'player_faces';
        img.id = `player_face_${i}`;
        img.draggable = true;
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