window.onload = actOnWindow;
function actOnWindow(){
	console.log("Apple")
    productRequest("Google")
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

			//Get the list of result
			resultList = results.results.bindings
			//Get the list of attributes
			var predicatList = results.head.vars
			listResults
			var listResults = document.getElementById("listResults");

			newDiv ="<div class=\"result\">\n" +
						"                        <img id=\"logo\" src=\"https://upload.wikimedia.org/wikipedia/commons/8/84/Apple_Computer_Logo_rainbow.svg\"></img>\n" +
						"                        <h2 id=\"name\">Apple</h2>\n" +
						"                        <div id=\"description\">Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services. Apple is the world's largest technology company by revenue (totaling $274.5 billion in 2020) and, since January 2021, the world's most valuable company. As of 2021, Apple is the world's fourth-largest PC vendor by unit sales, and fourth-largest smartphone manufacturer. It is one of the Big Five American information technology companies, along with Amazon, Google, Microsoft, and Facebook. Apple was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976 to develop and sell Wozniak's Apple I personal computer. It was incorporated by Jobs and Wozniak as Apple Computer, Inc. in 1977, and sales of its computers, including the Apple II, grew quickly.</div>\n" +
						"                        <div class=\"divIncome\">\n" +
						"                            <span class=\"property\">Net Income:</span>\n" +
						"                            <span id=\"netIncome\">1 200 000$</span>\n" +
						"                        </div>\n" +
						"                        <div class=\"divIndustry\">\n" +
						"                            <span class=\"property\">Industry:</span>\n" +
						"                            <span id=\"listIndustries\">IA, semiconductor, retail, IA, semiconductor, retail, IA, semiconductor, retail, IA, semiconductor, retail, IA, semiconductor, retail, IA, semiconductor, retail</span>\n" +
						"                        </div>\n" +
						"                        <div class=\"divProducts\">\n" +
						"                            <span class=\"property\">Products:</span>\n" +
						"                            <span id=\"listProducts\">Iphone, Mac, Ipad, Apple Watch, Airpods, Iphone, Mac, Ipad, Apple Watch, Airpods, Iphone, Mac, Ipad, Apple Watch, Airpods, Iphone, Mac, Ipad, Apple Watch, Airpods</span>\n" +
						"                        </div>\n" +
						"                    </div>";
						
						listResults.innerHTML += newDiv;

			//Loop on every result object
			resultList.forEach( resultObject => {
				//Get the values of all attributs inside the request
				var image;
				var name;
				var abstract;
				var industry;
				predicatList.forEach( attributs => {
					if (resultObject[attributs] !== undefined) {
						value = resultObject[attributs].value

						switch(attributs){
							//Get the logo
							case "DBP_logo":
								console.log(getImageProduct(value))
								image = "<img id=\"logo\" src=\""+getImageProduct(value)+"\"></img>"
								break
						 	//Get the name
							case "name": 
								name = "<h2 id=\"name\">" + value + "</h2>"
								break
							//Get the abstract
							case "DBO_abstract":
								abstract = "<div id=\"description\">" + value + "</div>"
								break
							//Get the industry
							//TODO : loop on all industry and get industry name
							case "DBP_industry":
								industry = "<div class=\"divIndustry\">\n" +
								"                            <span class=\"property\">Industry:</span>\n" +
								"                            <span id=\"listIndustries\">" + value + "</span>\n" +
								"                        </div>\n"
								break
							case "DBO_industry":
								if (industry !== undefined) {
									industry = "<div class=\"divIndustry\">\n" +
									"                            <span class=\"property\">Industry:</span>\n" +
									"                            <span id=\"listIndustries\">" + value + "</span>\n" +
									"                        </div>\n"
								}
								break
						}
				

						console.log("reeeeeeeeeeeeeees "+ attributs + " = "+value)
					}
				} )

				//Add the html content
				newDiv = "<div class=\"result\">"
				if (image !== undefined) {
					newDiv += image
				}
				if (name !== undefined) {
					newDiv += "\n" + name
				}
				if (abstract !== undefined) {
					newDiv += "\n" + abstract
				}
				if (industry !== undefined) {
					newDiv += "\n" + industry
				}
				newDiv += "\n</div>"
				console.log(newDiv)
				listResults.innerHTML += newDiv;

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
    return url_base + url_wikipedia;
}