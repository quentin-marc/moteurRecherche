heightColumn1 = 0;
heightColumn2 = 0;

window.onload = actOnWindow;
function actOnWindow(){

	var undo = JSON.parse(sessionStorage.getItem('undo'))

	//On recupere les donnees de sessionsStorage. Si inexistant, on prend Windows pour les tests
	var product = sessionStorage.getItem('Product')
	if(!product){
		window.location.href="index.html"
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

	//On recupere et affiche les donnees
    productRequest(getDbrCompanyName(product))
}


function productRequest(product){

	//Une requete par attribut. La gestion des dbp dbo & des majuscules est faite automatiquement
	//doProductSparql(product,"dbo:thumbnail",false)
	doProductSparql(product,"rdfs:label",true)
	doProductSparql(product,"dbp:name",true)
	doProductSparql(product,"dbp:thumbnail",false)
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
	//doProductSparql(product,"dbp:caption",false)//texte de remplacement pour l'image
	//doProductSparql(product,"dct:subject",false)
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
	doProductSparql(product,"dbp:logo",false)


	singleSelect("?is_product_of",["dbo:product"],product,false)

}

function doProductSparql(product,predicat,filterOnLang){

    //On fait une requete avec le predicat donnee
	//singleSelect(product,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
	

	var tabPredicat = []
	var tabVarName = []
	tabPredicat.push(predicat);
	var varName = "?"+predicat.split(":")[1]
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
			contenu_requete += "OPTIONAL {"+ressource+" "+predicat[i]+" "+varName+" . FILTER(langMatches(lang("+varName+"), \"EN\"))}\n"
		}
	} else {
		//contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+ressource+" "+predicat+" ?"+varName + "}}\n"
		for(var i=0 ; i<predicat.length ; i++){
			contenu_requete += "OPTIONAL {"+ressource+" "+predicat[i]+" "+varName+"}\n"
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
            } else if((predicat.includes("logo") || predicat.includes("image") || predicat.includes("thumbnail"))){
            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		var urlImage = results.results.bindings[0][predicat].value.replaceAll(" ","_")
            		urlImage = urlImage.replaceAll("__.",".");
            		urlImage = urlImage.replaceAll("_.",".");
     				if(predicat.includes("thumbnail")){
     					var reg = /FilePath\/(.+)/i
     					urlImage = reg.exec(urlImage)[1]
     				}
            		if((urlImage.includes(".png") || urlImage.includes(".svg") || urlImage.includes(".jpg") || urlImage.includes(".jpeg") || urlImage.includes(".PNG") || urlImage.includes(".SVG") || urlImage.includes(".JPG") || urlImage.includes(".JPEG"))){
            			setImageProduct(urlImage)
            		}
            	}

            } else { //s'il ne s'agit pas d'un attribut "hardcodé" dans le html

            	if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
            		
            		//Div ayant tous les attributs "dynamiques"
            		//liste attribut
        			var listAttributs = document.getElementsByClassName('listAttributs')[0]

    				//Attribut
        			var divAttribut = document.createElement('div')
        			divAttribut.setAttribute('class','attribut')

            		//Nom de l'attribut
            		var divAttributeName = document.createElement('div')
            		divAttributeName.setAttribute('class','attributName')
            		var textnode = document.createTextNode(firstCharUpperCase(formatString(predicat)))
            		divAttributeName.appendChild(textnode)
            		divAttribut.appendChild(divAttributeName)

            		//Valeur de l'attribut
            		var divValAttribut = document.createElement('div')
            		divValAttribut.setAttribute('class','valAttribut '+predicat)
            		divAttribut.appendChild(divValAttribut)

					if(heightColumn2 >= heightColumn1){
						document.getElementById('contentColumn1').appendChild(divAttribut);
						heightColumn1 += 25;
					}
					else{
						document.getElementById('contentColumn2').appendChild(divAttribut);
						heightColumn2 += 24;
					}

            		for(var i=0 ; i<results.results.bindings.length ; i++){

            			var value = results.results.bindings[i][predicat].value

            			if(results.results.bindings[i][predicat].type == "uri"){

	            			if(value.includes("http://dbpedia.org")){

	            				//Si il s'agit d'une resource dbpedia, on redirige potentiellement vers une autre page html de l'application
	            				if(value.includes("http://dbpedia.org/resource")){
	            					getTypeSparql(value.split("/")[value.split("/").length-1],predicat,value,divValAttribut)
	            				} else {
	            					//dbpedia mais pas resource : on affiche le nom uniquement
	            					value = value.split("/")[value.split("/").length-1]
	            					var divSingleValue = document.createElement('div')
				                	divSingleValue.setAttribute('class','singleValue')
									var valTextnode = document.createTextNode(formatString(value))
									divSingleValue.appendChild(valTextnode)
				                	divValAttribut.appendChild(divSingleValue)
	            				}

	            			} else {

	            				//pas dbpedia : on met l'url dans une balise a
			                	var divSingleValue = document.createElement('div')
				                divSingleValue.setAttribute('class','singleValue')
			                	var aVal = document.createElement('a')
			                	aVal.setAttribute('href',value)
								var valTextnode = document.createTextNode(value)
								aVal.appendChild(valTextnode)
								divSingleValue.appendChild(aVal)
				                divValAttribut.appendChild(divSingleValue)

	            			}
	            		} else {

	            			//pas une uri : on ecrit le contenu
				            var divSingleValue = document.createElement('div')
				            divSingleValue.setAttribute('class','singleValue')
							var valTextnode = document.createTextNode(formatString(value))
							divValAttribut.appendChild(valTextnode)
		                	divSingleValue.appendChild(valTextnode)
				            divValAttribut.appendChild(divSingleValue)

	            		}	
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


    imageExists(url).then((imageDoesExist)=>{
    	//on met l'url sur le html
    	if(imageDoesExist){
			document.getElementById("productImage").src = url;
		}
	})
}

function getTypeSparql(resource,predicat,value,divValAttribut){

	//On recupere le type de la resource
	var contenu_requete = "SELECT * WHERE {\
		"+getDbrCompanyName(resource)+" rdf:type ?type\
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

        			if(isCompany){

        				//Si company : href vers company.html
						var divSingleValue = document.createElement('div')
				        divSingleValue.setAttribute('class','singleValue redirect')
				        divSingleValue.setAttribute('onclick','sessionStorage.setItem("companyURI","'+encodeURI(value)+'");window.location.href="company.html"')
						var valTextnode = document.createTextNode(formatString(value.split("/")[value.split("/").length-1]))
				       	divSingleValue.appendChild(valTextnode)
				        divValAttribut.appendChild(divSingleValue)

        			} else if(isPerson){

						//Si person : href vers founder.html
						var divSingleValue = document.createElement('div')
	                	divSingleValue.setAttribute('class','singleValue redirect')
	                	divSingleValue.setAttribute('onclick','sessionStorage.setItem("Founder","'+encodeURI(value)+'");window.location.href="founder.html"')
						var valTextnode = document.createTextNode(formatString(value.split("/")[value.split("/").length-1]))
						divSingleValue.appendChild(valTextnode)
				        divValAttribut.appendChild(divSingleValue)

        			} else {        				

        				//On recupere les resources ayant notre produit dans l'attribut product
        				//On cherche a savoir si notre resource est un produit
						contenu_requete = "SELECT * WHERE {\
							?parent dbo:product "+getDbrCompanyName(resource)+"\
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
					               		var divSingleValue = document.createElement('div')
	                					divSingleValue.setAttribute('class','singleValue redirect')
                						divSingleValue.setAttribute('onclick','sessionStorage.setItem("Product","'+encodeURI(value)+'");window.location.href="product.html"')
										var valTextnode = document.createTextNode(formatString(value.split("/")[value.split("/").length-1]))
										divSingleValue.appendChild(valTextnode)
				        				divValAttribut.appendChild(divSingleValue)

            						} else {

            							//pas de parent, type inconnu
            							var divSingleValue = document.createElement('div')
	                					divSingleValue.setAttribute('class','singleValue')
										var valTextnode = document.createTextNode(formatString(value.split("/")[value.split("/").length-1]))
										divSingleValue.appendChild(valTextnode)
				        				divValAttribut.appendChild(divSingleValue)

            						}
            					}
					    	}
					    }

					    xmlhttp.open("GET", url, true);
					    xmlhttp.send();
        			}
            	} else {
            		//type inconnu
					var divSingleValue = document.createElement('div')
					divSingleValue.setAttribute('class','singleValue')
					var valTextnode = document.createTextNode(formatString(value.split("/")[value.split("/").length-1]))
					divSingleValue.appendChild(valTextnode)
    				divValAttribut.appendChild(divSingleValue)
            	}
            }
    	}
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}