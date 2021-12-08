window.onload = actOnWindow;
function actOnWindow(){
    companyRequest("http://dbpedia.org/resource/Microsoft")
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
}

function getDbrCompanyName(companyName){
    var splitCompanyName = companyName.split("/")
    var dbrCompanyName = "dbr:" + splitCompanyName[splitCompanyName.length - 1]
    return dbrCompanyName
}

function doCompanySparqlAbstract(dbrCompanyName,predicatListAbstract){
    //TODO dbr:Company
    var contenu_requete = "SELECT ?abstract WHERE {";

    predicatListAbstract.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?abstract. FILTER(langMatches(lang(?abstract), \"EN\"))}}"
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var description = document.getElementById("description");
                description.innerHTML = results.results.bindings[0][predicat].value
                description.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlName(dbrCompanyName,predicatListName){
    //TODO dbr:Company
    var contenu_requete = "SELECT ?name WHERE {";

    predicatListName.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?name.}"
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var companyName = document.getElementById("companyName");
                companyName.innerHTML = results.results.bindings[0][predicat].value
                companyName.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlFondateur(dbrCompanyName,predicatListFondateur){
    //TODO dbr:Company

    var contenu_requete = "SELECT ?fondateur ?fondateurLabel WHERE {";

    predicatListFondateur.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?fondateur." +
            "?fondateur rdfs:label ?fondateurLabel.\n" +
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
            console.log(results);
            for(var i = 0; i < results.results.bindings.length; i++){
                var founder = document.createElement("div")
                var imgFounder = document.createElement("div")
                var nameFounder = document.createElement("div")

                //linkFounder.href = results.results.bindings[i][fondateur].value;
                var newContentHref = document.createTextNode(results.results.bindings[i][fondateurLabel].value);

                nameFounder.appendChild(newContentHref);

                nameFounder.className = "nameFounder"
                imgFounder.className = "imgFounder"
                founder.className = "founder"

                //TODO idem image

                founder.appendChild(imgFounder)
                founder.appendChild(nameFounder)

                var currentDiv = document.getElementsByClassName('listFounders')[0];
                currentDiv.appendChild(founder)

                changePage(founder, fondateur, results, i)
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

    predicatListLocalisation.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?localisation. " +
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var adresseCompany = document.getElementById("adressHeadquarters");
                adresseCompany.innerHTML = results.results.bindings[0][predicat].value
                adresseCompany.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlAnneeCreation(dbrCompanyName,predicatListAnneeCreation){
    //TODO dbr:Company
    var contenu_requete = "SELECT str(?anneeCreation) WHERE {";

    predicatListAnneeCreation.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?anneeCreation. }"
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var dateCreation = document.getElementById("dateCreation");
                dateCreation.innerHTML = results.results.bindings[0][predicat].value
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

    predicatListNombreEmploye.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?nbEmployee. }"
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var nbEmployee = document.getElementById("nbEmployee");
                nbEmployee.innerHTML = results.results.bindings[0][predicat].value
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

    predicatListLienWebsite.forEach( predicate => {
        if(predicate == "dbo:wikiPageExternalLink"){
            contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?lienLabel." +
                "?lienLabel rdfs:label ?lienWebsite.}"
        }else {
            contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?lienWebsite. }"
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var nbEmployee = document.getElementById("lienWebsite");
                nbEmployee.innerHTML = results.results.bindings[0][predicat].value
                nbEmployee.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlIndustrie(dbrCompanyName,predicatListIndustrie){
    //TODO dbr:Company
    var contenu_requete = "SELECT str(?industrieLabel) WHERE {";

    predicatListIndustrie.forEach( predicate => {
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?industrie." +
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var industry = document.getElementById("industry");
                industry.innerHTML = results.results.bindings[0][predicat].value
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

    predicatListRevenue.forEach( predicate => {
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?revenue.}"
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
            var predicat = results.head.vars[0]
            console.log(results);
            if(results.results.bindings.length > 0 && results.results.bindings[0][predicat] && results.results.bindings[0][predicat].value != null){
                var revenue = document.getElementById("netIncome");
                revenue.innerHTML = results.results.bindings[0][predicat].value + "€ TODO quelle monnaie mettre ??"
                revenue.classList.remove('no-data');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlProduits(dbrCompanyName,predicatListProduits){
    //TODO dbr:Company

    var contenu_requete = "SELECT ?produit ?labelProduit WHERE {";

    predicatListProduits.forEach( predicate => {
        console.log(predicate)
        contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicate + " ?produit." +
            "?produit rdfs:label ?labelProduit.\n" +
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
            console.log(results);

            /*<div className="listProducts">
                <div className="product">
                    <div className="imgProduct"></div>
                    <div className="nameProduct">Iphone X</div>
                </div>*/

            for(var i = 0; i < results.results.bindings.length; i++){
                var product = document.createElement("div")
                var imgProduct = document.createElement("div")
                var nameProduct = document.createElement("div")

                //linkFounder.href = results.results.bindings[i][fondateur].value;
                var newContentHref = document.createTextNode(results.results.bindings[i][produitLabel].value);

                nameProduct.appendChild(newContentHref);

                nameProduct.className = "nameProduct"
                imgProduct.className = "imgProduct"
                product.className = "product"

                //TODO idem image

                product.appendChild(imgProduct)
                product.appendChild(nameProduct)

                var currentDiv = document.getElementsByClassName('listProducts')[0];
                currentDiv.appendChild(product)

                changePageProduit(product, produit, results, i)
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function changePageProduit(product, produit, results, i){
    product.onclick = function () {window.location.href = results.results.bindings[i][produit].value; }
}