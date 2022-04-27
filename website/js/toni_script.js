const sampleFaces = [ 203099, 1627832,    2544,  203935,  203648,  201186,  202693,
    1627787,  202091,  201567,    2548,    2550,  201564,  202322,
     201143,    1717,  202355,  201633,    2853,  202681, 1626161,
       2748,    1112,  203944,    2427,    2550,  203955,  201568,
     203121,  201572,    1737, 1628437,    2557, 1628382,  203552,
       1733, 1627758,  203090,  202344,  201942,    2734, 1627826,
     101126,  203138,    1716,  202323, 1629630,  203200,  202714,
     101179].map(id => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`)


var current_page = 0

// initialization of the page
function displayFaces(){
    playerFacesRow1 = document.getElementById("player-faces-row1")
    
    playerFacesRow2 = document.getElementById("player-faces-row2")
    playerFacesRow1.innerHTML = ""
    playerFacesRow2.innerHTML = ""

    for (var i = current_page * 10; i < (current_page + 1) * 10; i ++){
        var img = document.createElement('img');
        img.src = sampleFaces[i];
        img.className = 'player_faces';
        img.id = `player_face_${i}`;
        img.draggable = true;
        target = (i < (current_page * 10 + 5)) ? playerFacesRow1 : playerFacesRow2

        // makes element draggable
        
        target.appendChild(img)
    }
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		displayFaces();
	}
}


displayFaces()

function pageSelection(pageIndex) {
    current_page = pageIndex - 1
    displayFaces()
}