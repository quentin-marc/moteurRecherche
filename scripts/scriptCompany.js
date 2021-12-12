window.onload = actOnWindow;
function actOnWindow(){

    //var undo = JSON.parse(sessionStorage.getItem('undo'))
    var companyURI = sessionStorage.getItem('companyURI')
    

    /*var uriUndo = {
        type : "companyURI",
        uri : companyURI
    }



    if(!undo ){
        undo = new Array()
    }
    undo.push(uriUndo)
    sessionStorage.setItem('undo',JSON.stringify(undo))
    console.log(undo)*/
    companyRequest(companyURI)
    //companyRequest("https://dbpedia.org/resource/Microsoft")

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
    predicatListIndustrie = ["dbp:industry", "dbo:industry"]
    predicatListRevenue = ["dbp:revenue", "dbo:revenue", "dbp:netIncome", "dbo:netIncome"]
    predicatListProduits = ["dbo:product", "dbp:products", "dbo:service", "dbp:services"]
    predicatListLogo = ["dbp:logo"]

    var dbrCompanyName = getDbrCompanyName(companyName)

    doCompanySparqlLogo(dbrCompanyName,predicatListLogo)
    doCompanySparqlName(dbrCompanyName,predicatListName)
    doCompanySparqlAnneeCreation(dbrCompanyName,predicatListAnneeCreation)
    doCompanySparqlAbstract(dbrCompanyName,predicatListAbstract)
    doCompanySparqlNombreEmployee(dbrCompanyName,predicatListNombreEmploye)
    doCompanySparqlIndustrie(dbrCompanyName,predicatListIndustrie)
    doCompanySparqlLienWbesite(dbrCompanyName,predicatListLienWebsite)
    doCompanySparqlRevenue(dbrCompanyName,predicatListRevenue)
    doCompanySparqlLocalisation(dbrCompanyName,predicatListLocalisation)
    doCompanySparqlFondateur(dbrCompanyName,predicatListFondateur)
    doCompanySparqlProduits(dbrCompanyName,predicatListProduits)
}

//Transforme l'uri en dbr:NomEntreprise
function getDbrCompanyName(companyURI){
    var splitCompanyName = companyURI.split("/");
    var comapanyName = splitCompanyName[splitCompanyName.length - 1];
    var title = document.getElementById("title");
    title.innerHTML = splitCompanyName[splitCompanyName.length - 1]
    title.classList.remove('no-data');
    const charToEscape = ["'", "\"", ".", "&","(",")","-","_","/",","]
    var comapanyNameWithEscape = "";
    for (var i = 0; i < comapanyName.length; i++) {
        var currChar = comapanyName.charAt(i);
        if (charToEscape.includes(currChar)) {
            currChar = "\\" + currChar;
        }
        comapanyNameWithEscape += currChar;
    }
    var dbrCompanyName = "dbr:" + comapanyNameWithEscape;
    return dbrCompanyName;
}

//Requete pour récuperer l'abstract
function doCompanySparqlAbstract(dbrCompanyName,predicatListAbstract){
    var contenu_requete = "SELECT ?abstract WHERE {";

    predicatListAbstract.forEach( predicat => {
        console.log(predicat)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?abstract. FILTER(langMatches(lang(?abstract), \"EN\"))}}"
        console.log(contenu_requete)
    } )

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){
                var description = document.getElementById("description");
                description.innerHTML = results.results.bindings[0][objet].value
                description.classList.remove('no-data');

                if(description.offsetHeight > 210){
                    document.getElementById('seeMore').style.display = "inline-block";
                    document.getElementById('description').style.maxHeight = "210px";
                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer le nom de l'entreprise
function doCompanySparqlName(dbrCompanyName,predicatListName){
    var contenu_requete = "SELECT ?name WHERE {";

    predicatListName.forEach( predicat => {
        console.log(predicat)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?name.}"
    } )

    contenu_requete += "FILTER(langMatches(lang(?name), \"EN\"))}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){
                var companyName = document.getElementById("companyName");
                companyName.innerHTML = results.results.bindings[0][objet].value
                companyName.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer les fondateurs de l'entreprise
function doCompanySparqlFondateur(dbrCompanyName,predicatListFondateur){
    var contenu_requete = "SELECT ?fondateur ?fondateurLabel ?imgFondateur WHERE {";

    predicatListFondateur.forEach( predicat => {
        console.log(predicat)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?fondateur." +
            "?fondateur rdfs:label ?fondateurLabel." +
            "?fondateur dbo:thumbnail ?imgFondateur." +
            "FILTER(langMatches(lang(?fondateurLabel), \"EN\"))\n }"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var fondateur = results.head.vars[0]
            var fondateurLabel = results.head.vars[1]
            var fondateurImg = results.head.vars[2]
            console.log(results);

            if (results.results.bindings.length > 1) {
                var currentDiv = document.getElementsByClassName('cardContent')[0];

                var subtitleFounders = document.getElementsByClassName("subTitle")[0]
                subtitleFounders.innerHTML = "Founders"

                var listFounders = document.createElement("div")
                listFounders.className = "listFounders"
                subtitleFounders.appendChild(listFounders)
                for (var i = 0; i < results.results.bindings.length; i++) {
                    var founder = document.createElement("div")
                    var imgFounder = "<img class='imgFounder' style='background: top / cover no-repeat url("+results.results.bindings[i][fondateurImg].value+");'></img>"
                    var nameFounder = document.createElement("div")

                    var newContentHref = document.createTextNode(results.results.bindings[i][fondateurLabel].value);

                    nameFounder.appendChild(newContentHref);

                    nameFounder.className = "nameFounder"                    
                    founder.className = "founder"
                    founder.setAttribute("onclick", "changePage('founder.html', '" + results.results.bindings[i][fondateur].value + "')");

                    founder.innerHTML = imgFounder
                    founder.appendChild(nameFounder)

                    listFounders.appendChild(founder)

                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer la localisation géographique de l'entreprise
function doCompanySparqlLocalisation(dbrCompanyName,predicatListLocalisation){
    var contenu_requete = "SELECT ?localisationLabel WHERE {";

    predicatListLocalisation.forEach( predicat => {
        console.log(predicat)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?localisation. " +
            "?localisation rdfs:label ?localisationLabel.\n" +
            "FILTER(langMatches(lang(?localisationLabel), \"EN\"))\n }"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){

                var adressHeadquarters = document.getElementsByClassName("adressHeadquarters")[0]

                var b = document.createElement("b")
                b.innerHTML = "Headquarters:"

                var span = document.createElement("span")
                span.id = "adressHeadquarters"
                span.innerHTML = results.results.bindings[0][objet].value

                adressHeadquarters.appendChild(b)
                adressHeadquarters.appendChild(span)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer l'année de création de l'entreprise
function doCompanySparqlAnneeCreation(dbrCompanyName,predicatListAnneeCreation){
    var contenu_requete = "SELECT YEAR(?anneeCreation) WHERE {";

    predicatListAnneeCreation.forEach( predicat => {
        console.log(predicat)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?anneeCreation. }"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){
                var textAnneeCreation = document.getElementsByClassName("textCreation")[0]

                var b = document.createElement("b")
                b.innerHTML = "Creation - "

                var span = document.createElement("span")
                span.id = "dateCreation"
                span.innerHTML = results.results.bindings[0][objet].value

                textAnneeCreation.appendChild(b)
                textAnneeCreation.appendChild(span)

            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer le nombre d'employés de l'entreprise
function doCompanySparqlNombreEmployee(dbrCompanyName,predicatListNombreEmploye){
    var contenu_requete = "SELECT str(?nbEmployee) WHERE {";

    predicatListNombreEmploye.forEach( predicat => {
        console.log(predicat)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?nbEmployee. }"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){
                var nbEmployes = document.getElementsByClassName("nbEmployes")[0]

                var b = document.createElement("b")
                b.innerHTML = "Workforce:"

                var span = document.createElement("span")
                span.id = "nbEmployee"
                span.innerHTML = results.results.bindings[0][objet].value

                nbEmployes.appendChild(b)
                nbEmployes.appendChild(span)
                nbEmployes.append(" employees")
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer le lien du siteweb de l'entreprise
function doCompanySparqlLienWbesite(dbrCompanyName,predicatListLienWebsite){
    var contenu_requete = "SELECT str(?lienWebsite) WHERE {";

    predicatListLienWebsite.forEach( predicat => {
        if(predicat == "dbo:wikiPageExternalLink"){
            contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?lienLabel." +
                "?lienLabel rdfs:label ?lienWebsite.}"
        }else {
            contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?lienWebsite. }"
        }
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){

                var lienWebsite = document.getElementsByClassName("lienWebsite")[0]

                var b = document.createElement("b")
                b.innerHTML = "Website:"

                var a = document.createElement("a")
                a.id = "lienWebsite"
                a.href = results.results.bindings[0][objet].value
                a.innerHTML = results.results.bindings[0][objet].value

                lienWebsite.appendChild(b)
                lienWebsite.appendChild(a)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer l'industrie de l'entreprise
function doCompanySparqlIndustrie(dbrCompanyName,predicatListIndustrie){
    var contenu_requete = "SELECT str(?industrieLabel) WHERE {";

    predicatListIndustrie.forEach( predicat => {
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?industrie." +
            "?industrie rdfs:label ?industrieLabel." +
            "FILTER(langMatches(lang(?industrieLabel), \"EN\"))}"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){

                var industry = document.getElementsByClassName("industry")[0]

                var b = document.createElement("b")
                b.innerHTML = "Industry:"

                var span = document.createElement("span")
                span.id = "industry"
                span.innerHTML = results.results.bindings[0][objet].value

                industry.appendChild(b)
                industry.appendChild(span)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer le Chiffre d'Affaire de l'entreprise
function doCompanySparqlRevenue(dbrCompanyName,predicatListRevenue){
    var contenu_requete = "SELECT str(?revenue) WHERE {";

    predicatListRevenue.forEach( predicat => {
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?revenue. FILTER(datatype(?revenue) = <http://dbpedia.org/datatype/usDollar>)}"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){

                var revenue = document.getElementsByClassName("netIncome")[0]

                var b = document.createElement("b")
                b.innerHTML = "Income:"

                var span = document.createElement("span")
                let dollarUSLocale = Intl.NumberFormat('en-US');
                span.id = "netIncome"
                span.innerHTML = dollarUSLocale.format(results.results.bindings[0][objet].value) + "$"

                revenue.appendChild(b)
                revenue.appendChild(span)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Requete pour récuperer les produits créés par l'entreprise
function doCompanySparqlProduits(dbrCompanyName,predicatListProduits){
    var contenu_requete = "SELECT ?produit ?labelProduit ?imgProduit WHERE {";

    predicatListProduits.forEach( predicat => {
        console.log(predicat)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?produit." +
            "?produit rdfs:label ?labelProduit." +
            "?produit dbo:thumbnail ?imgProduit." +
            "FILTER(langMatches(lang(?labelProduit), \"EN\"))\n }"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var produit = results.head.vars[0]
            var produitLabel = results.head.vars[1]
            var produitImg = results.head.vars[2]
            console.log(results);

            if (results.results.bindings.length > 1) {

                var currentDiv = document.getElementsByClassName('cardContent')[0];

                var subtitleProducts = document.getElementsByClassName("subTitle")[1]
                subtitleProducts.innerHTML = "Products"
                var listProducts = document.createElement("div")
                listProducts.className = "listProducts"
                subtitleProducts.appendChild(listProducts)

                for (var i = 0; i < results.results.bindings.length; i++) {
                    var product = document.createElement("div")
                    var imgProduct = "<img class='imgProduct' src='"+results.results.bindings[i][produitImg].value+"' onerror='this.onerror=null; this.src=\"../img/objetInconnu.png\"'></img>"
                    var nameProduct = document.createElement("div")

                    var newContentHref = document.createTextNode(results.results.bindings[i][produitLabel].value);

                    nameProduct.appendChild(newContentHref);

                    nameProduct.className = "nameProduct"
                    
                    product.className = "product"
                    product.setAttribute("onclick", "changePage('product.html', '" + results.results.bindings[i][produit].value + "')");

                    product.innerHTML = imgProduct
                    product.appendChild(nameProduct)

                    listProducts.appendChild(product)

                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function chargerImage(image, source){
    image.src = source;
}

//Requete pour récuperer le logo de l'entreprise
function doCompanySparqlLogo(dbrCompanyName,predicatListLogo){
    var contenu_requete = "SELECT ?logo WHERE {";

    predicatListLogo.forEach( predicat => {
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?logo.}"
    } )

    contenu_requete += "}"
    console.log(contenu_requete)

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            var logo = results.head.vars[0]
            var thumbnail = results.head.vars[1]

            var imageCompany = document.getElementById("imageCompany");

            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][logo] && results.results.bindings[0][logo].value != null) {
                    var uriLogo = results.results.bindings[0][logo].value.replace(/\s+/g, "_");
                    getImageProduct( uriLogo ).then((imageFullURI)=>{
                        if(imageFullURI != ""){
                            imageCompany.src = imageFullURI
                        }else {
                            imageCompany.src = '../img/DBpedia-Logo.png'
                        }
                    });
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Get the full image url with only the end of the url
//Return the image url if the image was found
function getImageProduct(imageURIend){

    return new Promise((resultFullURI)=>{
        if (imageURIend != "") {
            var fullURI = "https://commons.wikimedia.org/wiki/Special:FilePath/" + imageURIend;
            //Test if the image exists
            imageExists(fullURI).then( exists => {
                if(exists) {
                    resultFullURI(fullURI);
                } else {
                    resultFullURI("");
                }
            });
        } else {
            resultFullURI("")
        }
    });
}

//Change to page name
function changePage( pageName, URI ) {
    console.log(URI);

    if(pageName == "product.html"){
        sessionStorage.setItem('Product',URI);
    }else {
        sessionStorage.setItem('Founder',URI);
    }
    window.location = "./"+pageName;
}
