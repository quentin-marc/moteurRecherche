window.onload = actOnWindow;
function actOnWindow(){
    companyRequest("http://dbpedia.org/resource/US_Cable")
    //document.getElementById("productName").innerHTML = "TOTO";
}

function companyRequest(companyName){
    predicatListAbstract = [" dbo:abstract"]
    predicatListName = ["dbo:name", "dbp:name", "foaf:name", "rdfs:label"]
    predicatListFondateur = ["dbo:foundedBy", "dbp:founders", "dbp:founder"]
    predicatListLocalisation = ["dbp:foundation", "dbo:location", "dbo:locationCity", "dbo:headquarter",
    "dbp:locationCountry"]
    predicatListAnneeCreation = ["dbo:foundingDate", "dbo:foundingYear", "dbp:foundation", "dbp:founded"]
    predicatListNombreEmploye = ["dbp:numEmployees"]
    predicatListLienWebsite = ["dbo:wikiPageExternalLink", "dbp:homepage", "dbp:website",
    "dbo:url", "foaf:homepage"]

    doCompanySparql(companyName,predicatListAbstract)
    // , predicatListName, predicatListFondateur, predicatListLocalisation,
    //    predicatListAnneeCreation, predicatListNombreEmploye, predicatListLienWebsite,true)
}

//Create a variable name from a predicate
function createFunctionName(predicat) {
    return predicat.split(":")[0].toUpperCase()+"_"+predicat.split(":")[1]
}

//Create a filter for a request
function createFilterForRequest(predicat, varName) {
    predicateName = predicat.split(":")[1]
    shouldApplyFilter = false

    switch(predicateName) {
        case "revenue" || "netIncome":
            filterContent = "datatype("+varName+") = <http://dbpedia.org/datatype/usDollar>)"
            shouldApplyFilter = true
    }

    if (shouldApplyFilter)
        filter = "FILTER(" + filterContent + ") "
    else
        filter = ""

    return filter
}

function doCompanySparql(companyName,predicatListAbstract){
    //TODO dbr:Company
    var contenu_requete = "SELECT ?abstract WHERE {";

    predicatListAbstract.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + companyName + " + predicate + ?abstract. FILTER(langMatches(lang(?abstract), \"EN\"))}"
        console.log(contenu_requete)
    } )

    /*if(filterOnLang){
        contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+ressource+" "+predicat+" ?"+varName + " . FILTER(langMatches(lang(?"+varName+"), \"EN\"))}}\n"
    } else {
        contenu_requete = "SELECT * WHERE {OPTIONAL {dbr:"+ressource+" "+predicat+" ?"+varName + "}}\n"
    }

    contenu_requete += "}"

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
    xmlhttp.send();*/
}

