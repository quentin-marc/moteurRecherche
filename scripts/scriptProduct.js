window.onload = actOnWindow;
function actOnWindow(){
	console.log("Apple_Watch")
    productRequest("Microsoft_Windows")
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
	//doProductSparql(product,"rdfs:comment",true)
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

	console.log(contenu_requete)

	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var predicat = results.head.vars[0]
            if(predicat == "RDFS_label" || predicat == "DBO_name" || predicat == "DBP_name"){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		var productname = document.getElementById("productName");
            		productname.innerHTML = results.results.bindings[0][predicat].value
            		document.title = results.results.bindings[0][predicat].value
            		productname.classList.remove('no-data');
            	}
            } else if(predicat.includes("releaseDate") || predicat.includes("releasedate")){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		var liste =""
            		results.results.bindings.forEach((binding) => {
            			liste += "<div>"+binding[predicat].value+"</div>"
            		})
            		var releaseDate = document.getElementById("releaseDate");
            		releaseDate.innerHTML = liste
            		releaseDate.classList.remove('no-data');
            	}
            } else if(predicat.includes("abstract")){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		var description = document.getElementById("description");
            		description.innerHTML = results.results.bindings[0][predicat].value
            		description.classList.remove('no-data');
            	}
            } else if(predicat.includes("logo" || predicat.includes("image"))){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		setImageProduct(results.results.bindings[0][predicat].value.replaceAll(" ","_"))
            	}
            } else {
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
	            	var elementPredicat = document.getElementsByClassName(predicat)
	            	if(elementPredicat.length == 0){
	            		var value = results.results.bindings[0][predicat].value
	            		if(results.results.bindings[0][predicat].type == "uri"){
	            			if(value.includes("http://dbpedia.org")){
	            				if(value.includes("http://dbpedia.org/resource")){
	            					getTypeSparql(value.split("/")[value.split("/").length-1],predicat,value)
	            				} else {
	            					value = value.split("/")[value.split("/").length-1]
	            					document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
				                    <div class=\"attributName\">"+removePrefix(predicat)+"</div>\
				                    <div class=\"valAttribut\">"+value+"</div>\
				                	</div>"
	            				}
	            			} else {
	            				document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
			                    <div class=\"attributName\">"+removePrefix(predicat)+"</div>\
			                    <div class=\"valAttribut\"><a href=\""+value+"\">"+value+"</a></div>\
			                	</div>"
	            			}
	            		}
	            		
	            	}
	            }
            	
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function removePrefix(str){
	var strSplit = str.split("_");
	if(strSplit.length>0){
		str = str.substring(strSplit[0].length+1)
		return str.charAt(0).toUpperCase() + str.slice(1);
	} else {
		return ""
	}
}

function setImageProduct(url_wikipedia){

	console.log("url : "+url_wikipedia)

	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "https://commons.wikimedia.org/wiki/Special:FilePath/";
    var url = url_base + url_wikipedia;

    document.getElementById("productImage").src = url;
}

function getTypeSparql(resource,predicat,value){

	//GET TYPE
	var contenu_requete = "SELECT * WHERE {\
		dbr:"+resource+" rdf:type ?type\
	}"

	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var results = JSON.parse(this.responseText);
            var responsePredicat = results.head.vars[0]
			if (responsePredicat.includes("type")){
            	if(results.results.bindings.length > 0){

            		var isCompany = false
            		var isPerson = false

            		results.results.bindings.forEach((type) => {
            			if(type[responsePredicat].value.includes("http://dbpedia.org/ontology/Company")){
        					isCompany = true
        				} else if(type[responsePredicat].value.includes("http://dbpedia.org/ontology/Person")){
        					isPerson = true
        				}
        			})

        			if(isCompany){
        				document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
	                    <div class=\"attributName\">"+removePrefix(predicat)+"</div>\
	                    <div class=\"valAttribut\"><a href=\"company.html\">"+value.split("/")[value.split("/").length-1]+"</a></div>\
	                	</div>"
        			} else if(isPerson){
        				document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
	                    <div class=\"attributName\">"+removePrefix(predicat)+"</div>\
	                    <div class=\"valAttribut\"><a href=\"index.html\">"+value.split("/")[value.split("/").length-1]+"</a></div>\
	                	</div>"
        			} else {
        				//GET IS PRODUCT OF
						contenu_requete = "SELECT * WHERE {\
							?parent dbo:product dbr:"+resource+"\
						}"

						// Encodage de l'URL à transmettre à DBPedia
					    url_base = "http://dbpedia.org/sparql";
					    url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

					    xmlhttp = new XMLHttpRequest();
					    xmlhttp.onreadystatechange = function() {
					    	if (this.readyState == 4 && this.status == 200) {
					    		var results = JSON.parse(this.responseText);
					    		var responsePredicat = results.head.vars[0]

					    		if (responsePredicat.includes("parent")){
            						if(results.results.bindings.length > 0){
            							document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
					                    <div class=\"attributName\">"+removePrefix(predicat)+"</div>\
					                    <div class=\"valAttribut\"><a href=\"product.html\">"+value.split("/")[value.split("/").length-1]+"</a></div>\
					                	</div>"
            						} else {
            							document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
					                    <div class=\"attributName\">"+removePrefix(predicat)+"</div>\
					                    <div class=\"valAttribut\">"+value.split("/")[value.split("/").length-1]+"</div>\
					                	</div>"
            						}
            					}

					    		console.log(results)
					    	}
					    }

					    xmlhttp.open("GET", url, true);
					    xmlhttp.send();
        			}
            	}
            }
    	}
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();


    

}

