/*   Appelé avant que le HTML soit chargé    */
console.log("js scripts here.");

/*   Appele une fois le HTML chargé    */
window.onload = actOnWindow;

function actOnWindow(){
    console.log('Lister dans cette fonction toute les fonctions qui peuvent agir sur la page HTML');
}

function doSparql(product,predicat,filterOnLang){

	singleSelect(product,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
	if(predicat.split(":")[0] == "dbo"){
		singleSelect(product,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)
	} else if(predicat.split(":")[0] == "dbp"){
		singleSelect(product,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)
	}

	var isCamelCase = false;
	var i = predicat.length;
	while (i--) {
		if(predicat[i].match(/[a-z]/i) && predicat[i] == predicat[i].toUpperCase()){
			isCamelCase = true;
		} 
	}
	if(isCamelCase){
		predicat = predicat.toLowerCase();
		singleSelect(product,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
		if(predicat.split(":")[0] == "dbo"){
			singleSelect(product,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)
		} else if(predicat.split(":")[0] == "dbp"){
			singleSelect(product,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)
		}
	}
}

function singleSelect(product,predicat,varName,filterOnLang){
	var contenu_requete;
	if(filterOnLang){
		contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+product+" "+predicat+" ?"+varName + " . FILTER(langMatches(lang(?"+varName+"), \"EN\"))}}\n"
	} else {
		contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+product+" "+predicat+" ?"+varName + "}}\n"
	}

	console.log("Request : \n"+contenu_requete);

	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            console.log(results);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}