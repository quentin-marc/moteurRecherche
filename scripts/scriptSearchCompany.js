window.onload = actOnWindow;
function actOnWindow(){
	console.log("Apple")
    productRequest("Apple")
    //document.getElementById("productName").innerHTML = "TOTO";
}


function productRequest(product){
predicatList = ["dbo:abstract", "dbp:industry", "dbo:industry", "dbp:revenue", "dbo:revenue", "dbp:netIncome", "dbo:netIncome", "dbp:logo"]

	doCompanySparql(product,predicatList,true)	
}

//Create a variable name from a predicate
function createFunctionName(predicat) {
	return "?"+predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1]
}

//Create a filter for a request
function createFilterForRequest(predicat, varName) {
	predicateName = predicat.split(":")[1]
	shouldApplyFilter = false
	
	switch(predicateName) {
		case "revenue" || "netIncome":
			filterContent = "datatype("+varName+") = <http://dbpedia.org/datatype/usDollar>"
			shouldApplyFilter = true
			break
		case "abstract":
			filterContent = "langMatches(lang("+varName+"), \"EN\")"
			shouldApplyFilter = true
	}

	if (shouldApplyFilter)
		filter = "FILTER(" + filterContent + ") "
	else
		filter = ""
	
		return filter
}

function doCompanySparql(companyName, predicatList, filterOnLang){
	var varNameList = ""
	predicatList.forEach( predicate => {
		varNameList += ", " + createFunctionName(predicate)
	} )
	
	var contenu_requete = "SELECT DISTINCT ?company, ?name " + varNameList + " WHERE {\n?company a dbo:Company; dbp:name ?name.\nFILTER(regex(str(?name), \"" + companyName + "\"))\n";
	
	predicatList.forEach( predicate => {
		console.log(predicate)
		varName = createFunctionName(predicate)
		console.log( varName )
		contenu_requete += "OPTIONAL { ?company " + predicate + " " + varName + ". " + createFilterForRequest(predicate, varName) + "}\n"
		console.log(contenu_requete)
	} )

	contenu_requete += "}"	

	console.log("Request : \n"+contenu_requete);

	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            //console.log(results);
			resultList = results.results.bindings
			var predicatList = results.head.vars
			
			//Loop on every result object
			resultList.forEach( resultObject => {
				//Get the values of all attributs inside the request
				predicatList.forEach( attributs => {
					if (resultObject[attributs] !== undefined) {
						value = resultObject[attributs].value


						console.log("reeeeeeeeeeeeeees "+ attributs + " = "+value)
					}
				} )
			} )
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getImageProduct(url_wikipedia){

	console.log("url : "+url_wikipedia)

	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "https://commons.wikimedia.org/wiki/Special:FilePath/";
    var url = url_base + url_wikipedia;

    document.getElementById("productImage").src = url;
}