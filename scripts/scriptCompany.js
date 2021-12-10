window.onload = actOnWindow;
function actOnWindow(){
    /*var companyURI = sessionStorage.getItem('companyURI')
    companyRequest(companyURI)*/
    companyRequest("https://dbpedia.org/resource/Airport_Transport_Service")
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
    predicatListLogo = ["dbp:logo", "dbo:thumbnail"]
    predicatListImgFondateur = ["dbo:thumbnail"]

    var dbrCompanyName = getDbrCompanyName(companyName)

    doCompanySparqlAbstract(dbrCompanyName,predicatListAbstract)
    doCompanySparqlName(dbrCompanyName,predicatListName)
    doCompanySparqlFondateur(dbrCompanyName,predicatListFondateur)
    doCompanySparqlLocalisation(dbrCompanyName,predicatListLocalisation)
    doCompanySparqlAnneeCreation(dbrCompanyName,predicatListAnneeCreation)
    doCompanySparqlNombreEmployee(dbrCompanyName,predicatListNombreEmploye)
    doCompanySparqlLienWbesite(dbrCompanyName,predicatListLienWebsite)
    doCompanySparqlIndustrie(dbrCompanyName,predicatListIndustrie)
    doCompanySparqlRevenue(dbrCompanyName,predicatListRevenue)
    doCompanySparqlProduits(dbrCompanyName,predicatListProduits)
    doCompanySparqlLogo(dbrCompanyName,predicatListLogo)
    //doCompanySparqlImgFondateur(dbrCompanyName,predicatListImgFondateur)
}


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

function doCompanySparqlAbstract(dbrCompanyName,predicatListAbstract){
    //TODO dbr:Company
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

function doCompanySparqlName(dbrCompanyName,predicatListName){
    //TODO dbr:Company
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

function doCompanySparqlFondateur(dbrCompanyName,predicatListFondateur){
    //TODO dbr:Company

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
                    var imgFounder = document.createElement("img")
                    var nameFounder = document.createElement("div")

                    //linkFounder.href = results.results.bindings[i][fondateur].value;
                    var newContentHref = document.createTextNode(results.results.bindings[i][fondateurLabel].value);

                    nameFounder.appendChild(newContentHref);

                    nameFounder.className = "nameFounder"
                    imgFounder.className = "imgFounder"
                    imgFounder.src = results.results.bindings[i][fondateurImg].value
                    founder.className = "founder"
                nameFounder.className = "nameFounder"
                imgFounder.className = "imgFounder"
                imgFounder.style.background = "top / cover no-repeat url("+results.results.bindings[i][fondateurImg].value+")"
                founder.className = "founder"

                    //TODO idem image

                    founder.appendChild(imgFounder)
                    founder.appendChild(nameFounder)

                    /*var currentDiv = document.getElementsByClassName('listFounders')[0];*/
                    listFounders.appendChild(founder)

                    changePage(founder, fondateur, results, i)
                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function changePage(founder, fondateur, results, i){
    founder.onclick = function () {window.location.href = results.results.bindings[i][fondateur].value; }
}

function doCompanySparqlLocalisation(dbrCompanyName,predicatListLocalisation){
    //TODO dbr:Company
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

                /*
                <div class="textHeadquarters">
                    <b>Headquarters:</b> <span id="adressHeadquarters"></span>
                </div>
                 */

                var currentDiv = document.getElementsByClassName('cardContent')[0];

                var subtitleFounders = document.getElementsByClassName("subTitle")[0]
                subtitleFounders.innerHTML = "Founders"

                var listFounders = document.createElement("div")
                listFounders.className = "listFounders"
                subtitleFounders.appendChild(listFounders)
                for (var i = 0; i < results.results.bindings.length; i++) {
                    var founder = document.createElement("div")
                    var imgFounder = document.createElement("img")
                    var nameFounder = document.createElement("div")}

                var textHeadquarters = document.createElement("div")
                textHeadquarters.className = textHeadquarters

                var b = document.createElement("b")
                b.innerHTML = "Headquarters:"

                var span = document.createElement("span")
                span.innerHTML = "Headquarters:"


                var adresseCompany = document.getElementById("adressHeadquarters");
                adresseCompany.innerHTML = results.results.bindings[0][objet].value
                adresseCompany.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlAnneeCreation(dbrCompanyName,predicatListAnneeCreation){
    //TODO dbr:Company
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
                var dateCreation = document.getElementById("dateCreation");
                dateCreation.innerHTML = results.results.bindings[0][objet].value
                dateCreation.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlNombreEmployee(dbrCompanyName,predicatListNombreEmploye){
    //TODO dbr:Company
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
                var nbEmployee = document.getElementById("nbEmployee");
                nbEmployee.innerHTML = results.results.bindings[0][objet].value
                nbEmployee.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlLienWbesite(dbrCompanyName,predicatListLienWebsite){
    //TODO dbr:Company
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
                var lienWebsite = document.getElementById("lienWebsite");
                lienWebsite.innerHTML = results.results.bindings[0][objet].value
                lienWebsite.href = results.results.bindings[0][objet].value
                lienWebsite.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlIndustrie(dbrCompanyName,predicatListIndustrie){
    //TODO dbr:Company
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
                var industry = document.getElementById("industry");
                industry.innerHTML = results.results.bindings[0][objet].value
                industry.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlRevenue(dbrCompanyName,predicatListRevenue){
    //TODO dbr:Company
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
                var revenue = document.getElementById("netIncome");
                revenue.innerHTML = results.results.bindings[0][objet].value + "$"
                revenue.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlProduits(dbrCompanyName,predicatListProduits){
    //TODO dbr:Company

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
                    var imgProduct = document.createElement("img")
                    var nameProduct = document.createElement("div")

                    //linkFounder.href = results.results.bindings[i][fondateur].value;
                    var newContentHref = document.createTextNode(results.results.bindings[i][produitLabel].value);

                    nameProduct.appendChild(newContentHref);

                    nameProduct.className = "nameProduct"
                    imgProduct.className = "imgProduct"
                    imgProduct.src = results.results.bindings[i][produitImg].value
                    product.className = "product"

                    //TODO idem image

                    product.appendChild(imgProduct)
                    product.appendChild(nameProduct)

                    /*var currentDiv = document.getElementsByClassName('listProducts')[0];
                    currentDiv.appendChild(product)*/

                    listProducts.appendChild(product)

                    changePageProduit(product, produit, results, i)
                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function changePageProduit(product, produit, results, i){
    product.onclick = function () {window.location.href = results.results.bindings[i][produit].value; }
}

function doCompanySparqlLogo(dbrCompanyName,predicatListLogo){
    //TODO dbr:Company
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
            var objet = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][objet] && results.results.bindings[0][objet].value != null){
                var logo = document.getElementById("imageCompany");
                var uriLogo = results.results.bindings[0][objet].value.replace(/\s+/g,"_");
                var srcLogo = getImageProduct(uriLogo)
                logo.src = srcLogo
                //logo.innerHTML = results.results.bindings[0][objet].value
                logo.classList.remove('no-data');
            }
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
