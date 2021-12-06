window.onload = actOnWindow;
function actOnWindow(){
	console.log("Apple_Watch")
    productRequest("Apple_Watch")
    //document.getElementById("productName").innerHTML = "TOTO";
}


function productRequest(product){

	doProductSparql(product,"rdfs:label",true)
	doProductSparql(product,"dbp:name",true)
	doProductSparql(product,"dbp:logo",false)
	doProductSparql(product,"dbo:type",false)
	doProductSparql(product,"dbo:developer",false)
	doProductSparql(product,"dbo:releaseDate",false)
	doProductSparql(product,"dbp:os",false)
	doProductSparql(product,"dbp:operatingSystem",false)
	doProductSparql(product,"dbo:abstract",true)
	doProductSparql(product,"dbp:webSite",false)
	doProductSparql(product,"dbp:successor",false)
	doProductSparql(product,"dbp:license",false)
	doProductSparql(product,"dbp:supportedPlatforms",false)
	doProductSparql(product,"dbp:caption",false)//texte de remplacement pour l'image
	doProductSparql(product,"dct:subject",false)
	doProductSparql(product,"rdfs:comment",false)
	doProductSparql(product,"dbo:manufacturer",false)
	doProductSparql(product,"dbp:connectivity",false)
	doProductSparql(product,"dbp:input",false)
	doProductSparql(product,"dbp:price",false)
	doProductSparql(product,"foaf:homepage",false)
	doProductSparql(product,"dbo:cpu",false)
	doProductSparql(product,"dbp:display",false)
	doProductSparql(product,"dbp:memory",false)
	doProductSparql(product,"dbp:power",false)
	doProductSparql(product,"dbp:service",false)
	doProductSparql(product,"dbp:sound",false)
	doProductSparql(product,"dbp:storage",false)
	doProductSparql(product,"dbp:weight",false)
	doProductSparql(product,"dbp:dimensions",false)
	doProductSparql(product,"dbp:display",false)
	doProductSparql(product,"dbp:fuelSource",false)
	doProductSparql(product,"dbp:inventor",false)
	doProductSparql(product,"dbo:product",false)



}

function doProductSparql(product,predicat,filterOnLang){

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


function singleSelect(ressource,predicat,varName,filterOnLang){
	var contenu_requete;
	if(filterOnLang){
		contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+ressource+" "+predicat+" ?"+varName + " . FILTER(langMatches(lang(?"+varName+"), \"EN\"))}}\n"
	} else {
		contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+ressource+" "+predicat+" ?"+varName + "}}\n"
	}

	//console.log("Request : \n"+contenu_requete);

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


