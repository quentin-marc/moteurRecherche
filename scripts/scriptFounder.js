window.onload = actOnWindow;
function actOnWindow(){
    var undo = JSON.parse(sessionStorage.getItem('undo'))
  

	var founder = sessionStorage.getItem('Founder')
    if(!founder){
        window.location.href="index.html"
    }
    var uriUndo = {
        type : "Founder",
        uri : founder
    }

    

    if(!undo ){
        undo = new Array()
    }
    undo.push(uriUndo)
    sessionStorage.setItem('undo',JSON.stringify(undo))

    console.log(undo)

    //ATTENTION il y a dbr dedans si je copie getDbrCompanyName
    founderRequest(founder)
    
}
var tabPredicat = []
function founderRequest(founder){

    dofounderSparql(founder,"dbo:knownFor",false)
    dofounderSparql(founder,"dbo:education",false)
    dofounderSparql(founder,"dbo:activeYearsStartYear",false)
    dofounderSparql(founder,"dbo:activeYearsEndYear",false)
    dofounderSparql(founder,"dbo:deathPlace",false)
    dofounderSparql(founder,"dbo:deathCause",false)
    dofounderSparql(founder,"dbo:deathDate",false)
    dofounderSparql(founder,"dbo:birthPlace",false)
    dofounderSparql(founder,"dbo:birthName",false)
    dofounderSparql(founder,"dbo:birthDate",false)
    dofounderSparql(founder,"dbo:abstract",true)
    dofounderSparql(founder,"dbo:thumbnail",false)
    dofounderSparql(founder,"dbp:name",true)
    dofounderSparql(founder,"dbp:nationality",true)
    dofounderSparql(founder,"rdfs:label",true)
    

}

function dofounderSparql(founder,predicat,filterOnLang){
    
    singleSelect(founder,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
    if(predicat.split(":")[0] == "dbo"){
        singleSelect(founder,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)
    } else if(predicat.split(":")[0] == "dbp"){
        singleSelect(founder,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)
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
        singleSelect(founder,predicat,predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1],filterOnLang)
        if(predicat.split(":")[0] == "dbo"){
            singleSelect(founder,"dbp:"+predicat.split(":")[1],"DBP_"+predicat.split(":")[1],filterOnLang)
        } else if(predicat.split("console.log(predicat):")[0] == "dbp"){
            singleSelect(founder,"dbo:"+predicat.split(":")[1],"DBO_"+predicat.split(":")[1],filterOnLang)
        }
    }


}


function singleSelect(ressourceURI,predicat,varName,filterOnLang){


    //var ressource = ressourceURI.split("/")[ressourceURI.split("/").length-1]
    var ressource = getDbrCompanyName(ressourceURI);
    var contenu_requete;
    if(filterOnLang){
        contenu_requete = "SELECT * WHERE {OPTIONAL {"+ressource+" "+predicat+" ?"+varName + " . FILTER(langMatches(lang(?"+varName+"), \"EN\"))}}\n"
    } else {
        contenu_requete = "SELECT * WHERE {OPTIONAL {"+ressource+" "+predicat+" ?"+varName + "}}\n"
    }
    console.log(contenu_requete)
    // Encodage de l'URL ?? transmettre ?? DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";
    
    // Requ??te HTTP et affichage des r??sultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var predicat = results.head.vars[0]
                
            if(predicat == "RDFS_label" || predicat == "DBO_name" || predicat == "DBP_name"){
                
                if((tabPredicat.includes(removePrefix(predicat)) == false) && results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                    var foundername = document.getElementById("founderName");
                    if((tabPredicat.includes(removePrefix(predicat)) == false) && results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                        foundername.innerHTML = results.results.bindings[0][predicat].value
                        document.title= results.results.bindings[0][predicat].value
                        tabPredicat.push(removePrefix(predicat))
                        foundername.classList.remove('no-data');

                    }
                }
            } else if(predicat.includes("abstract")){
                if((tabPredicat.includes(removePrefix(predicat)) == false) && results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                    var description = document.getElementById("description");
                    description.innerHTML = results.results.bindings[0][predicat].value
                    tabPredicat.push(removePrefix(predicat))
                    description.classList.remove('no-data');

                    if(description.offsetHeight > 210){
                        document.getElementById('seeMore').style.display = "inline-block";
                        document.getElementById('description').style.maxHeight = "210px";
                    }
                }
            } else if(predicat.includes("thumbnail") || predicat.includes("logo") || predicat.includes("image")){
               
                if(predicat.includes("thumbnail")){
                    if((tabPredicat.includes(removePrefix(predicat)) == false) && results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                        document.getElementById("imageFounder").style.backgroundImage = "url("+results.results.bindings[0][predicat].value+")";
                        tabPredicat.push(removePrefix(predicat))
                    }
                }else{
                    if((tabPredicat.includes(removePrefix(predicat)) == false) && results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                        getImageFounder(results.results.bindings[0][predicat].value.replaceAll(" ","_"))
                        tabPredicat.push(removePrefix(predicat))
                    }
                    
                }
                
            } else {

                if( (tabPredicat.includes(removePrefix(predicat)) == false) && (results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null)){
                    var elementPredicat = document.getElementsByClassName(predicat)
                    if(elementPredicat.length == 0){
                        var value = results.results.bindings[0][predicat].value
                        if(value.length>0){
                        
                        
                            
                            if(results.results.bindings[0][predicat].type == "uri"){
                                if(value.includes("http://dbpedia.org")){
                                   
                                    value = value.split("/")[value.split("/").length-1]
                                    console.log(value)
                                    
                                        tabPredicat.push(removePrefix(predicat))
                                        document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
                                        <div class=\"attributName\">"+formatString(removePrefix(predicat))+"</div>\
                                        <div class=\"valAttribut\">"+formatString(value)+"</div>\
                                        </div>"
                                    
                                    
                                    
                                } else {
                                    tabPredicat.push(removePrefix(predicat))
                                    document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
                                    <div class=\"attributName\">"+formatString(removePrefix(predicat))+"</div>\
                                    <div class=\"valAttribut\"><a href=\""+value+"\">"+value+"</a></div>\
                                    </div>"
                                }
                            }else{
                                    tabPredicat.push(removePrefix(predicat))
                                    document.getElementsByClassName("listAttributs")[0].innerHTML+="<div class=\"attribut\">\
                                    <div class=\"attributName\">"+formatString(removePrefix(predicat))+"</div>\
                                    <div class=\"valAttribut\">"+formatString(value)+"</div>\
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

function getImageFounder(url_wikipedia){
    // Encodage de l'URL ?? transmettre ?? DBPedia
    var url_base = "https://commons.wikimedia.org/wiki/Special:FilePath/";
    var url = url_base + url_wikipedia;

    document.getElementById("imageFounder").src = url;
}


