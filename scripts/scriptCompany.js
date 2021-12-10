window.onload = actOnWindow;
function actOnWindow(){

    /*var undo = JSON.parse(sessionStorage.getItem('undo'))
    var founder = sessionStorage.getItem('Company')

    var uriUndo = {
        type : "Company",
        uri : company
    }



    if(!undo ){
        undo = new Array()
    }
    undo.push(uriUndo)
    sessionStorage.setItem('undo',JSON.stringify(undo))*/

    var companyURI = sessionStorage.getItem('companyURI')
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
    predicatListLogo = ["dbp:logo","dbo:thumbnail"]
    predicatListImgFondateur = ["dbo:thumbnail"]

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
                    imgFounder.style.background = "top / cover no-repeat url("+results.results.bindings[i][fondateurImg].value+")"
                    founder.className = "founder"
                    founder.setAttribute("onclick", "changePage('founder.html', '" + results.results.bindings[i][fondateur].value + "')");


                    //TODO idem image

                    founder.appendChild(imgFounder)
                    founder.appendChild(nameFounder)

                    /*var currentDiv = document.getElementsByClassName('listFounders')[0];*/
                    listFounders.appendChild(founder)

                    //changePageFounder(founder, fondateur, results, i)
                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
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
                //Creation - <span id="dateCreation"></span>
                var textAnneeCreation = document.getElementsByClassName("textCreation")[0]

                var b = document.createElement("b")
                b.innerHTML = "Creation - "

                var span = document.createElement("span")
                span.id = "dateCreation"
                span.innerHTML = results.results.bindings[0][objet].value

                textAnneeCreation.appendChild(b)
                textAnneeCreation.appendChild(span)

                /*var dateCreation = document.getElementById("dateCreation");
                dateCreation.innerHTML = results.results.bindings[0][objet].value
                dateCreation.classList.remove('no-data');*/
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

                /*<div className="nbEmployes">
                    <b>Workforce:</b>
                    <span id="nbEmployee"></span>
                    employees
                </div>*/

                var nbEmployes = document.getElementsByClassName("nbEmployes")[0]

                var b = document.createElement("b")
                b.innerHTML = "Workforce:"

                var span = document.createElement("span")
                span.id = "nbEmployee"
                span.innerHTML = results.results.bindings[0][objet].value

                nbEmployes.appendChild(b)
                nbEmployes.appendChild(span)
                nbEmployes.append(" employees")

                /*var nbEmployee = document.getElementById("nbEmployee");
                nbEmployee.innerHTML = results.results.bindings[0][objet].value
                nbEmployee.classList.remove('no-data');*/
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

                var lienWebsite = document.getElementsByClassName("lienWebsite")[0]

                var b = document.createElement("b")
                b.innerHTML = "Website:"

                var span = document.createElement("span")
                span.id = "lienWebsite"
                span.innerHTML = results.results.bindings[0][objet].value

                lienWebsite.appendChild(b)
                lienWebsite.appendChild(span)

                /*var lienWebsite = document.getElementById("lienWebsite");
                lienWebsite.innerHTML = results.results.bindings[0][objet].value
                lienWebsite.href = results.results.bindings[0][objet].value
                lienWebsite.classList.remove('no-data');*/
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

                var industry = document.getElementsByClassName("industry")[0]

                var b = document.createElement("b")
                b.innerHTML = "Industry:"

                var span = document.createElement("span")
                span.id = "industry"
                span.innerHTML = results.results.bindings[0][objet].value

                industry.appendChild(b)
                industry.appendChild(span)


                /*var industry = document.getElementById("industry");
                industry.innerHTML = results.results.bindings[0][objet].value
                industry.classList.remove('no-data');*/
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

                var revenue = document.getElementsByClassName("netIncome")[0]

                var b = document.createElement("b")
                b.innerHTML = "Industry:"

                var span = document.createElement("span")
                span.id = "netIncome"
                span.innerHTML = results.results.bindings[0][objet].value + "$"

                revenue.appendChild(b)
                revenue.appendChild(span)

                /*var revenue = document.getElementById("netIncome");
                revenue.innerHTML = results.results.bindings[0][objet].value + "$"
                revenue.classList.remove('no-data');*/
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
                    product.setAttribute("onclick", "changePage('product.html', '" + results.results.bindings[i][produit].value + "')");

                    product.appendChild(imgProduct)
                    product.appendChild(nameProduct)

                    /*var currentDiv = document.getElementsByClassName('listProducts')[0];
                    currentDiv.appendChild(product)*/

                    listProducts.appendChild(product)

                    //changePageProduit(product, produit, results, i)
                }
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function doCompanySparqlLogo(dbrCompanyName,predicatListLogo){
    //TODO dbr:Company
    var contenu_requete = "SELECT ?logo ?thumbnail WHERE {";

    predicatListLogo.forEach( predicat => {
        if(predicat == "dbp:logo"){
            contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?logo.}"
        }else if(predicat == "dbo:thumbnail") {
            contenu_requete += "OPTIONAL { " + dbrCompanyName + " " + predicat + " ?thumbnail.}"
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
            var logo = results.head.vars[0]
            var thumbnail = results.head.vars[1]
            console.log(results);
            if(results.results.bindings.length > 0) {
                if (results.results.bindings[0][logo] && results.results.bindings[0][logo].value != null) {

                    /*$.fn.checkPageExists = function(defaultUrl){

                        $.each(this, function(){

                            var $link = $(this);

                            $.ajax({
                                url: $link.attr("href"),
                                error: function(){
                                    $link.attr("href", defaultUrl);
                                }
                            });
                        });
                    };

                    $(document).ready(function(){
                        $("a").checkPageExists("default.html");
                    });

                    $.ajax({
                        url: "http://something/whatever.docx",
                        method: "HEAD",
                        statusCode: {
                            404: function () {
                                alert('not found');
                            },
                            200: function() {
                                alert("foundfile exists");
                            }
                        }
                    });*/

                    var imageCompany = document.getElementById("imageCompany");
                    var uriLogo = results.results.bindings[0][logo].value.replace(/\s+/g, "_");
                    var srcLogo = getImageProduct(uriLogo)

                    $.ajax({
                        type: 'HEAD',
                        url: srcLogo,
                        headers: {  'Access-Control-Allow-Origin': srcLogo },
                        success: function () {
                            console.log("logo found : " + srcLogo)
                            imageCompany.src = srcLogo
                        },
                        error: function () {
                            // page does not exist
                            if (results.results.bindings[0][thumbnail] && results.results.bindings[0][thumbnail].value != null) {
                                console.log("thumbnail found 1 : " + results.results.bindings[0][thumbnail].value)
                                imageCompany.src = results.results.bindings[0][thumbnail].value
                            } else {
                                console.log("nothing found 1")
                                imageCompany.src = '../img/DBpedia-Logo.png'
                            }
                        }
                    });
                } else {
                    if (results.results.bindings[0][thumbnail] && results.results.bindings[0][thumbnail].value != null) {
                        console.log("thumbnail found 2 : " + results.results.bindings[0][thumbnail].value)
                        imageCompany.src = results.results.bindings[0][thumbnail].value
                    } else {
                        console.log("nothing found 2")
                        imageCompany.src = '../img/DBpedia-Logo.png'
                    }
                }
            } else {
                console.log("nothing found 3")
                imageCompany.src = '../img/DBpedia-Logo.png'
            }
        }

               /* //if()

                var imageCompany = document.getElementById("imageCompany");
                var uriLogo = results.results.bindings[0][objet].value.replace(/\s+/g,"_");
                var srcLogo = getImageProduct(uriLogo)

                imageCompany.src = results.results.bindings[0][objet].value

            }else {
                var imageCompany = document.getElementById("imageCompany");
                imageCompany.src = '../img/DBpedia-Logo.png'
            }*/
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
