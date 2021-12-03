window.onload = actOnWindow;
function actOnWindow(){
	console.log("active")
    productRequest("Apple_Watch")
}


function productRequest(product){

	/*var contenu_requete = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\
		PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
		PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n\
		PREFIX dc: <http://purl.org/dc/elements/1.1/>\n\
		PREFIX : <http://dbpedia.org/resource/>\n\
		PREFIX dbpedia2: <http://dbpedia.org/property/>\n\
		PREFIX dbpedia: <http://dbpedia.org/>\n\
		PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
		SELECT * WHERE {\n"*/
	addPredicatToRequest(product,"rdfs:label",true)
	addPredicatToRequest(product,"dbp:name",true)
	addPredicatToRequest(product,"dbp:logo",false)
	addPredicatToRequest(product,"dbo:type",false)
	addPredicatToRequest(product,"dbo:developer",false)
	addPredicatToRequest(product,"dbo:releaseDate",false) //todo: prendre 1 valeur ou gerer tableau
	addPredicatToRequest(product,"dbp:os",false)
	addPredicatToRequest(product,"dbp:operatingSystem",false)
	addPredicatToRequest(product,"dbo:abstract",true)
	addPredicatToRequest(product,"dbp:webSite",false)
	addPredicatToRequest(product,"dbp:successor",false)
	addPredicatToRequest(product,"dbp:license",false)
	addPredicatToRequest(product,"dbp:supportedPlatforms",false)

	//texte de remplacement pour l'image
	addPredicatToRequest(product,"dbp:caption",false)
	addPredicatToRequest(product,"dct:subject",false)
	addPredicatToRequest(product,"rdfs:comment",false)
	addPredicatToRequest(product,"dbo:manufacturer",false)
	addPredicatToRequest(product,"dbp:connectivity",false)
	addPredicatToRequest(product,"dbp:input",false)
	addPredicatToRequest(product,"dbp:price",false)
	addPredicatToRequest(product,"foaf:homepage",false)
	addPredicatToRequest(product,"dbo:cpu",false)
	addPredicatToRequest(product,"dbp:display",false)
	addPredicatToRequest(product,"dbp:memory",false)
	addPredicatToRequest(product,"dbp:name",false)
	addPredicatToRequest(product,"dbp:power",false)
	addPredicatToRequest(product,"dbp:service",false)
	addPredicatToRequest(product,"dbp:sound",false)
	addPredicatToRequest(product,"dbp:storage",false)
	addPredicatToRequest(product,"dbp:weight",false)
	addPredicatToRequest(product,"dbp:dimensions",false)
	addPredicatToRequest(product,"dbp:display",false)
	addPredicatToRequest(product,"dbp:fuelSource",false)
	addPredicatToRequest(product,"dbp:inventor",false)
	addPredicatToRequest(product,"dbo:product",false)
	//contenu_requete +="} LIMIT 1"

/*
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
    xmlhttp.send();*/


}

function addPredicatToRequest(product,predicat,filterOnLang){

	singleOption(product,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
	if(predicat.split(":")[0] == "dbo"){
		singleOption(product,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)
	} else if(predicat.split(":")[0] == "dbp"){
		singleOption(product,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)
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
		singleOption(product,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
		if(predicat.split(":")[0] == "dbo"){
			singleOption(product,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)
		} else if(predicat.split(":")[0] == "dbp"){
			singleOption(product,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)
		}
	}
}

function singleOption(product,predicat,varName,filterOnLang){
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