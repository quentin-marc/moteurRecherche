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

        // on met les premieres lettres en majuscule pour chaque recherche
        companyName = majFirstLetterOnly(companyName);      // TODO Uber eats ne marche pas
        founder = majFirstLetters(founder);
        industry = majFirstLetters(industry);

        //TODO lancer recherche dbpedia
        //alert("lancer recherche dbpedia");
        var filterValueList = [];
        if (companyName.length > 0) {
            filterValueList.push(["dbp:name", companyName]);
        }
        if (founder.length > 0) {
            filterValueList.push(["dbp:founders", founder, "dbp:name"]);
        }
        if (industry.length > 0) {
            filterValueList.push(["dbo:industry", industry, "rdfs:label"]);
        }
        sessionStorage.setItem('searchCompany', JSON.stringify(filterValueList));
        window.location = "./listResults.html";
    }
}

function majFirstLetters(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
}

//Put the first letter in uppercase
function majFirstLetterOnly(str) {
    return str.charAt(0).toUpperCase() + str.substring(1); 
}

function Undo(){

    var undo = JSON.parse(sessionStorage.getItem('undo'))

    undo.pop()
    
    var previousValue = undo.pop();

    sessionStorage.setItem("undo",JSON.stringify(undo))
    
    if(!previousValue){

        window.location.href = "index.html"
    }else{
        var type = previousValue.type;
        sessionStorage.setItem(type,previousValue.uri)
        switch (type){

            case("Founder"):
                window.location.href = "founder.html"

                break;

            case ("Company"):
                window.location.href = "company.html"

                break;

            case("Product"):
                window.location.href = "product.html"
                break;
        }

    }
}