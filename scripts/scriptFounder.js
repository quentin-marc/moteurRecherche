window.onload = actOnWindow;
function actOnWindow(){
	
    productRequest("Bill_Gates")
    //document.getElementById("productName").innerHTML = "TOTO";
}

function productRequest(product){

    doProductSparql(product,"dbo:knownFor",false)
    doProductSparql(product,"dbo:education",false)
    doProductSparql(product,"dbo:activeYearsStartYear",false)
    doProductSparql(product,"dbo:activeYearsEndYear",false)
    doProductSparql(product,"dbo:deathPlace",false)
    doProductSparql(product,"dbo:deathCause",false)
    doProductSparql(product,"dbo:deathDate",false)
    doProductSparql(product,"dbo:birthPlace",false)
    doProductSparql(product,"dbo:birthName",false)
    doProductSparql(product,"dbo:birthDate",false)
    doProductSparql(product,"dbo:abstract",true)
    doProductSparql(product,"dbo:thumbnail",false)
    doProductSparql(product,"dbp:name",true)
    

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
        } else if(predicat.split("console.log(predicat):")[0] == "dbp"){
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
             console.log(results)
                
            if(predicat == "RDFS_label" || predicat == "DBO_name" || predicat == "DBP_name"){
                
                if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                    var productname = document.getElementById("founderName");
                    if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                        productname.innerHTML = results.results.bindings[0][predicat].value
                        document.title= results.results.bindings[0][predicat].value
                        productname.classList.remove('no-data');

                    }
                }
            } else if(predicat.includes("abstract")){
                if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                    var description = document.getElementById("description");
                    description.innerHTML = results.results.bindings[0][predicat].value
                    description.classList.remove('no-data');
                }
            } else if(predicat.includes("thumbnail") || predicat.includes("logo") || predicat.includes("image")){
               
                if(predicat.includes("thumbnail")){
                    if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                        document.getElementById("imageFounder").style.backgroundImage = "url("+results.results.bindings[0][predicat].value+")";
                    }
                }else{
                    if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                        getImageFounder(results.results.bindings[0][predicat].value.replaceAll(" ","_"))
                    }
                    
                }
                
            } else {
                if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                    var elementPredicat = document.getElementsByClassName(predicat)
                    if(elementPredicat.length == 0){
                        var value = results.results.bindings[0][predicat].value
                        if(results.results.bindings[0][predicat].type == "uri"){
                            if(value.includes("http://dbpedia.org")){
                                value = "<a href=\""+value+"\">"+value.split("/")[value.split("/").length-1]+"</a>"
                            } else {
                                value = "<a href=\""+value+"\">"+value+"</a>"
                            }
                        }
                        document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
                        <div class=\"attributName\">"+removePrefix(predicat)+"</div>\
                        <div class=\"valAttribut\">"+value+"</div>\
                        </div>"
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

function getImageFounder(url_wikipedia){

    console.log("url : "+url_wikipedia)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "https://commons.wikimedia.org/wiki/Special:FilePath/";
    var url = url_base + url_wikipedia;

    document.getElementById("imageFounder").src = url;
}