// affiche le champ entier associé au "see more"
function seeMore(){
    document.getElementById("description").style.maxHeight = "none";
    document.getElementById('seeMore').style.display = "none";
}

// verify if at list one field contains a string
function protectionSearchFields(){

    document.getElementById('msgUser').style.display = "none";
    
    var companyName = document.getElementById('name').value;
    var founder = document.getElementById('founder').value;
    var industry = document.getElementById('industry').value;

    if(companyName.length == 0 && founder.length == 0 && industry.length == 0){
        document.getElementById('msgUser').style.display = "block";
    }
    else{
        //TODO lancer recherche dbpedia
        alert("lancer recherche dbpedia");
    }
}