window.onload = displaySeeMore;

function displaySeeMore(){
    alert("coucou");
}


// affiche le champ entier associé au "see more"
function seeMore(){
    document.getElementById("description").style.height = "auto";
    document.getElementById('seeMore').style.display = "none";
}
