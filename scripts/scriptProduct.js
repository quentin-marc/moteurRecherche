window.onload = actOnWindow;
function actOnWindow(){

	var undo = JSON.parse(sessionStorage.getItem('undo'))

	//On recupere les donnees de sessionsStorage. Si inexistant, on prend Windows pour les tests
	var product = sessionStorage.getItem('Product')
	if(!product){
		product = "https://dbpedia.org/page/Microsoft_Windows"
	}

	var uriUndo = {
        type : "Product",
        uri : product
    }

    if(!undo ){
        undo = new Array()
    }
    undo.push(uriUndo)
    sessionStorage.setItem('undo',JSON.stringify(undo))

    console.log(undo)
	//On recupere et affiche les donnees
    productRequest(product.split("/")[product.split("/").length-1])
}


function productRequest(product){

	//Une requete par attribut. La gestion des dbp dbo & des majuscules est faite automatiquement
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

    //On fait une requete avec le predicat donnee
	//singleSelect(product,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
	

	var tabPredicat = []
	var tabVarName = []
	tabPredicat.push(predicat);
	var varName = predicat.split(":")[1]
	//tabVarName.push(predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1]);


	//on refait une requete en inversant dbo/dbp
	if(predicat.split(":")[0] == "dbo"){
		//singleSelect(product,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)


		tabPredicat.push("dbp:"+predicat.split(":")[1])
		//tabVarName.push("DBP_"+predicat.split(":")[1])


	} else if(predicat.split(":")[0] == "dbp"){
		//singleSelect(product,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)


		tabPredicat.push("dbo:"+predicat.split(":")[1])
		//tabVarName.push("DBO_"+predicat.split(":")[1])


	}

	//On check si camelCase
	var isCamelCase = false;
	var i = predicat.length;
	while (i--) {
		if(predicat[i].match(/[a-z]/i) && predicat[i] == predicat[i].toUpperCase()){
			isCamelCase = true;
		} 
	}

	//Si c'est le cas on refait des requetes avec tout en minuscule
	if(isCamelCase){
		predicat = predicat.toLowerCase();
		//singleSelect(product,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
		
		tabPredicat.push(predicat)
		//tabVarName.push(predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1])

		if(predicat.split(":")[0] == "dbo"){
			//singleSelect(product,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)


			tabPredicat.push("dbp:"+predicat.split(":")[1])
			//tabVarName.push("DBP_"+predicat.split(":")[1])


		} else if(predicat.split(":")[0] == "dbp"){
			//singleSelect(product,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)


			tabPredicat.push("dbo:"+predicat.split(":")[1])
			//tabVarName.push("DBO_"+predicat.split(":")[1])


		}
	}

	singleSelect(product,tabPredicat,varName,filterOnLang)
}


function singleSelect(ressource,predicat,varName,filterOnLang){
	var contenu_requete = "SELECT * WHERE {";
	//contenu de la requete avec filtre sur la langue ou non
	if(filterOnLang){
		//contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+ressource+" "+predicat+" ?"+varName + " . FILTER(langMatches(lang(?"+varName+"), \"EN\"))}}\n"
		for(var i=0 ; i<predicat.length ; i++){
			contenu_requete += "OPTIONAL {dbr:"+ressource+" "+predicat[i]+" ?"+varName+" . FILTER(langMatches(lang(?"+varName+"), \"EN\"))}\n"
		}
	} else {
		//contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+ressource+" "+predicat+" ?"+varName + "}}\n"
		for(var i=0 ; i<predicat.length ; i++){
			contenu_requete += "OPTIONAL {dbr:"+ressource+" "+predicat[i]+" ?"+varName+"}\n"
		}
	}
	contenu_requete += "}"

	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    //fonction se realisant une fois la reponse obtenue
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

        	//reponse complette
            var results = JSON.parse(this.responseText);
            //predicat lie a la requete (on fait des requetes avec un seul predicat)
            var predicat = results.head.vars[0]
            //Si RDFS_label ou ... on modifie l'affichage
            if(predicat == "label" || predicat == "name"){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		var productname = document.getElementById("productName");
            		//class no-data indique qu'il n'y a rien d'affiche
            		if(productname.classList.contains('no-data')){
	            		productname.innerHTML = results.results.bindings[0][predicat].value
	            		document.title = results.results.bindings[0][predicat].value
	            		//on a deja affiche un contenu, inutile de le changer
	            		productname.classList.remove('no-data');
            		}
            	}
            } else if(predicat.includes("releaseDate")){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		//la reponse est souvent une liste
            		var liste =""
            		results.results.bindings.forEach((binding) => {
            			liste += "<div>"+binding[predicat].value+"</div>"
            		})
            		var releaseDate = document.getElementById("releaseDate");
            		if(releaseDate.classList.contains('no-data')){
            			releaseDate.innerHTML = liste
            			releaseDate.classList.remove('no-data');
            		}
            	}
            } else if(predicat.includes("abstract")){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		var description = document.getElementById("description");
            		if(description.classList.contains('no-data')){
            			description.innerHTML = results.results.bindings[0][predicat].value;
            			description.classList.remove('no-data');
						
						if(description.offsetHeight > 210){
							document.getElementById('seeMore').style.display = "inline-block";
							document.getElementById('description').style.maxHeight = "210px";
						}
            		}
            	}
            } else if(predicat.includes("logo" || predicat.includes("image"))){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		setImageProduct(results.results.bindings[0][predicat].value.replaceAll(" ","_"))
            	}

            } else { //s'il ne s'agit pas d'un attriobit "hardcode" dans le html


            	//gere listes !


            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){

            		var value = results.results.bindings[0][predicat].value

            		//Div ayant tous les attributs "dynamiques"
            		//liste attribut
        			var listAttributs = document.getElementsByClassName('listAttributs')[0]

        			//Attribut
        			var divAttribut
            		//Valeur de l'attribut
            		var divValAttribut

    				//Attribut
        			divAttribut = document.createElement('div')
        			divAttribut.setAttribute('class','attribut')

            		//Nom de l'attribut
            		var divAttributeName = document.createElement('div')
            		divAttributeName.setAttribute('class','attributName')
            		var textnode = document.createTextNode(firstCharUpperCase(predicat))
            		divAttributeName.appendChild(textnode)
            		divAttribut.appendChild(divAttributeName)

            		//Valeur de l'attribut
            		divValAttribut = document.createElement('div')
            		divValAttribut.setAttribute('class','valAttribut')
            		divAttribut.appendChild(divValAttribut)

            		if(results.results.bindings[0][predicat].type == "uri"){

            			if(value.includes("http://dbpedia.org")){
            				//Si il s'agit d'une resource dbpedia, on redirige potentiellement vers une autre page html de l'application
            				if(value.includes("http://dbpedia.org/resource")){
            					getTypeSparql(value.split("/")[value.split("/").length-1],predicat,value)
            				} else {
            					//dbpedia mais pas resource : on affiche le nom uniquement
            					value = value.split("/")[value.split("/").length-1]
			                	divValAttribut.setAttribute('class','valAttribut '+predicat)
								var valTextnode = document.createTextNode(value)
								divValAttribut.appendChild(valTextnode)
			                	listAttributs.appendChild(divAttribut)
            				}

            			} else {

            				//pas dbpedia : on met l'url dans une balise a
		                	divValAttribut.setAttribute('class','valAttribut '+predicat)
		                	var aVal = document.createElement('a')
		                	aVal.setAttribute('href',value)
							var valTextnode = document.createTextNode(value)
							aVal.appendChild(valTextnode)
							divValAttribut.appendChild(aVal)
		                	listAttributs.appendChild(divAttribut)

            			}
            		} else {

            			//pas une uri : on ecrit le contenu
			            divValAttribut.setAttribute('class','valAttribut '+predicat)
						var valTextnode = document.createTextNode(value)
						divValAttribut.appendChild(valTextnode)
	                	listAttributs.appendChild(divAttribut)

            		}
	            		
	            }
            	
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function firstCharUpperCase(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function setImageProduct(url_wikipedia){

	// Encodage de l'URL
    var url_base = "https://commons.wikimedia.org/wiki/Special:FilePath/";
    var url = url_base + url_wikipedia;

    //on met l'url sur le html
    document.getElementById("productImage").src = url;
}

function getTypeSparql(resource,predicat,value){

	//On recupere le type de la resource
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

            		//On check si l'un des types est une company ou une person
            		results.results.bindings.forEach((type) => {
            			if(type[responsePredicat].value.includes("http://dbpedia.org/ontology/Company")){
        					isCompany = true
        				} else if(type[responsePredicat].value.includes("http://dbpedia.org/ontology/Person")){
        					isPerson = true
        				}
        			})

        			//liste attribut
        			var listAttributs = document.getElementsByClassName('listAttributs')[0]

        			//Attribut
        			var divAttribut
            		//Valeur de l'attribut
            		var divValAttribut

    				//Attribut
        			divAttribut = document.createElement('div')
        			divAttribut.setAttribute('class','attribut')

            		//Nom de l'attribut
            		var divAttributeName = document.createElement('div')
            		divAttributeName.setAttribute('class','attributName')
            		var textnode = document.createTextNode(firstCharUpperCase(predicat))
            		divAttributeName.appendChild(textnode)
            		divAttribut.appendChild(divAttributeName)

            		//Valeur de l'attribut
            		divValAttribut = document.createElement('div')
            		divValAttribut.setAttribute('class','valAttribut')
            		divAttribut.appendChild(divValAttribut)

        			if(isCompany){

        				//Si company : href vers company.html
	                	divValAttribut.setAttribute('class','valAttribut redirect '+predicat)
	                	divValAttribut.setAttribute('onclick','sessionStorage.setItem("Company","'+value.split("/")[value.split("/").length-1]+'");window.location.href="company.html"')
						var valTextnode = document.createTextNode(value.split("/")[value.split("/").length-1])
						divValAttribut.appendChild(valTextnode)
	                	listAttributs.appendChild(divAttribut)

        			} else if(isPerson){

						//Si person : href vers founder.html
	                	divValAttribut.setAttribute('class','valAttribut redirect '+(predicat))
	                	divValAttribut.setAttribute('onclick','sessionStorage.setItem("Person","'+value.split("/")[value.split("/").length-1]+'");window.location.href="founder.html"')
						var valTextnode = document.createTextNode(value.split("/")[value.split("/").length-1])
						divValAttribut.appendChild(valTextnode)
	                	listAttributs.appendChild(divAttribut)

        			} else {        				

        				//On recupere les resources ayant notre produit dans l'attribut product
        				//On cherche a savoir si notre resource est un produit
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

            							//length non nulle, la ressource actuelle a un parent, c'est un product
					                	divValAttribut.setAttribute('class','valAttribut redirect '+(predicat))
                						divValAttribut.setAttribute('onclick','sessionStorage.setItem("Product","'+value.split("/")[value.split("/").length-1]+'");window.location.href="product.html"')
										var valTextnode = document.createTextNode(value.split("/")[value.split("/").length-1])
										divValAttribut.appendChild(valTextnode)
                						listAttributs.appendChild(divAttribut)

            						} else {

            							//pas de parent, type inconnu
					                	divValAttribut.setAttribute('class','valAttribut '+(predicat))
										var valTextnode = document.createTextNode(value.split("/")[value.split("/").length-1])
										divValAttribut.appendChild(valTextnode)
                						listAttributs.appendChild(divAttribut)

            						}
            					}
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

