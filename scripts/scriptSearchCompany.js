window.onload = actOnWindow;
function actOnWindow(){

	var undo = JSON.parse(sessionStorage.getItem('undo'))

	var searchCompany = sessionStorage.getItem('searchCompany');

	var uriUndo = {
        type : "searchCompany",
        uri : searchCompany
    } 

    if(!undo ){
        undo = new Array()
    }
    undo.push(uriUndo)
    sessionStorage.setItem('undo',JSON.stringify(undo))
	
	console.log("searchCompany")
    serchCompanyByName(searchCompany);
	document.getElementById("textResearch").innerHTML = searchCompany;
	//productRequest("Apple")
    //document.getElementById("productName").innerHTML = "TOTO";
}

//Store all information about a company
class Company {
	constructor(name) {
		this.name = name;
		this.logo = "";
		this.abstract = "";
		this.income = "";
		this.industryList = [];
		this.industryListLink = [];
		this.productList = [];
		this.productListLink = [];
		this.companyURI = "";
	}
}

//Search a company by its name. 
//Display all companies containing that name with some informations about them
function serchCompanyByName(companyName) {
	
	var companyMap = {};
	
	var contenu_requete = "SELECT DISTINCT ?company, STR(?name) as ?name WHERE {\n" +
	"?company a dbo:Company; dbp:name ?name.\n" +
	"FILTER(regex(str(?name), \"" + companyName + "\"))\n" +
	"OPTIONAL { ?company dbp:revenue ?income. FILTER(datatype(?income) = <http://dbpedia.org/datatype/usDollar>) }\n" +
	"OPTIONAL { ?company dbo:revenue ?income. FILTER(datatype(?income) = <http://dbpedia.org/datatype/usDollar>) }\n" +
	"OPTIONAL { ?company dbp:netIncome ?income. FILTER(datatype(?income) = <http://dbpedia.org/datatype/usDollar>) }\n" +
	"OPTIONAL { ?company dbo:netIncome ?income. FILTER(datatype(?income) = <http://dbpedia.org/datatype/usDollar>) }\n" +
	"OPTIONAL { ?company dbp:numEmployees ?numEmployee. }\n" +
	"}\n" +
	"ORDER BY DESC(<http://www.w3.org/2001/XMLSchema#integer>(?income)) DESC(?numEmployees)\n" +
	"LIMIT 20";

	/*
	// Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);*/
		doSparqlRequest(contenu_requete).then( results => {
            console.log(results);
			//Get the list of result
			resultList = results.results.bindings
			
			const promises = [];
			var companyNameOrderdList = [];

			//Loop on every result company to get more details about the company and to display the results
			resultList.forEach( resultObject => {
				//Get the uri of the ressource company
				var companyURI = resultObject["company"].value;
				var companyDBR = getDbrCompanyName(companyURI);
				var companyName = resultObject["name"].value;

				//Create a company object that will store the company's information
				companyMap[companyName] = new Company(companyName);
				companyMap[companyName].companyURI = companyURI;
				companyNameOrderdList.push(companyName);

				//getCompanyMainInformation(companyDBR, companyName, companyMap);
				promises.push( getCompanyMainInformationPromise(companyDBR, companyName, companyMap) );
			} )

			//Waits for all promises to return to display the results
			//This allows to display the answer in an orered way
			return Promise.all(promises).then(()=>{
				companyNameOrderdList.forEach( companyName => {
					console.log("********************");
					console.log("********************");
					addCompanyToHtml(companyMap[companyName]);
				});
			});
		});
        /*}
    };
	xmlhttp.open("GET", url, true);
    xmlhttp.send();*/
}

//From a company object create an HTML div to display 
function addCompanyToHtml(company) {
	console.log(`The function recieved with value companyMap[companyName] = `)
	console.log(company)

	//Get the element where the company will be added
	var listResultsElement = document.getElementById("listResults");

	//Parent div for this company
	var newDivCompany = document.createElement("div");
	newDivCompany.setAttribute("class", "result");
	newDivCompany.setAttribute("onclick", "changePage('company.html', '" + company.companyURI + "')");
		
	
	//Company logo
	console.log("company.logo")
	console.log("company.logo")
	console.log("company.logo")
	console.log(company.logo)
	if(company.logo != "") {
		console.log("IN")
		var divCompanyLogo = document.createElement("img");
		divCompanyLogo.setAttribute("id", "logo");
		divCompanyLogo.setAttribute("src", company.logo);
		newDivCompany.appendChild(divCompanyLogo);
		
	}

	//Company name
	var divCompanyName = document.createElement("h2");
	divCompanyName.setAttribute("id", "name");
	divCompanyName.innerHTML = company.name;
	newDivCompany.appendChild(divCompanyName);
	
	//Company abstract
	if (company.abstract !== "") {
		var divCompanyAbstract = document.createElement("div");
		divCompanyAbstract.setAttribute("id", "description");
		divCompanyAbstract.innerHTML = company.abstract;
		newDivCompany.appendChild(divCompanyAbstract);
	}

	//Company income
	if (company.income !== "") {
		var divCompanyIncome = document.createElement("div");
		divCompanyIncome.setAttribute("class", "divIncome");

		var spanCompanyIncomeText = document.createElement("span");
		spanCompanyIncomeText.setAttribute("class", "property");
		spanCompanyIncomeText.innerHTML = "Net Income:";
		divCompanyIncome.appendChild(spanCompanyIncomeText);

		var spanCompanyIcomeList = document.createElement("span");
		spanCompanyIcomeList.setAttribute("id", "netIncome");
		spanCompanyIcomeList.innerHTML = company.income + "$";
		divCompanyIncome.appendChild(spanCompanyIcomeList);
		
		newDivCompany.appendChild(divCompanyIncome);

	}

	//Company industries
	if (company.industryList.length > 0) {
		var allIndustries = "";
		for (i=0; i < company.industryList.length; i++) {
			allIndustries += company.industryList[i];
			if (i <company.industryList.length-1) {
				allIndustries += ", ";
			}
		}

		var divCompanyIndustry = document.createElement("div");
		divCompanyIndustry.setAttribute("class", "divIndustry");
		
		var spanCompanyIndusryText = document.createElement("span");
		spanCompanyIndusryText.setAttribute("class", "property");
		spanCompanyIndusryText.innerHTML = "Industry:";
		divCompanyIndustry.appendChild(spanCompanyIndusryText);

		var spanCompanyIndusryList = document.createElement("span");
		spanCompanyIndusryList.setAttribute("id", "listIndustries");
		spanCompanyIndusryList.innerHTML = allIndustries;
		divCompanyIndustry.appendChild(spanCompanyIndusryList);
		
		newDivCompany.appendChild(divCompanyIndustry);
	}

	//Company products
	if (company.productList.length > 0) {
		var allProducts = "";
		for (i=0; i < company.productList.length; i++) {
			allProducts += company.productList[i];
			if (i <company.productList.length-1) {
				allProducts += ", ";
			}
		}

		var divCompanyProcuct = document.createElement("div");
		divCompanyProcuct.setAttribute("class", "divProducts");
		
		var spanCompanyProductText = document.createElement("span");
		spanCompanyProductText.setAttribute("class", "property");
		spanCompanyProductText.innerHTML = "Products:";
		divCompanyProcuct.appendChild(spanCompanyProductText);

		var spanCompanyProcuctList = document.createElement("span");
		spanCompanyProcuctList.setAttribute("id", "listProducts");
		spanCompanyProcuctList.innerHTML = allProducts;
		divCompanyProcuct.appendChild(spanCompanyProcuctList);
		
		newDivCompany.appendChild(divCompanyProcuct);
	}
	
	console.log(newDivCompany);

	//Add the html content
	listResultsElement.appendChild(newDivCompany);
}

//Querry the databse to get more infotrmations about the company
function getCompanyMainInformationPromise(companyDBR, companyName, companyMap) {
	console.log(companyDBR);
	return new Promise((resolve)=>{

		//The list of all predicates that interset us. A list represents all the predicates for a same information orderd by increasing relevence (i.e. if the last predicate does not return a value, then we wil take the answer from the one before) 
		var predicateListAbstract = ["dbo:abstract"];
		var predicateListLogo = ["dbp:logo"];
		var predicatListIndusty = ["dbp:industry", "dbo:industry"];
		var predicateListIncome = ["dbp:revenue", "dbo:revenue", "dbp:netIncome", "dbo:netIncome"];
		var predicateListProduct = ["dbo:product", "dbp:products", "dbo:service", "dbp:services"];
				
		const promises = [];
		promises.push( doSparqlRequestForPredicatePromise(companyDBR, predicateListAbstract, "abstract", companyName, companyMap) );
		promises.push( doSparqlRequestForPredicatePromise(companyDBR, predicateListLogo, "logo", companyName, companyMap) );
		promises.push( doSparqlRequestForPredicatePromise(companyDBR, predicatListIndusty, "industry", companyName, companyMap, true) );
		promises.push( doSparqlRequestForPredicatePromise(companyDBR, predicateListIncome, "income", companyName, companyMap, false, "integer") );
		promises.push( doSparqlRequestForPredicatePromise(companyDBR, predicateListProduct, "product", companyName, companyMap, true) );
		
		//Waits for all promises to return
		return Promise.all(promises).then((res)=>{
			resolve(true);
		})
	});
}

//Perform a sparql request for one predicate (and the list of alternative predicates in case there is no value) and add the result to the html element with idElement 
//Note: predicateList represents all the predicates for a same information orderd by increasing relevence (i.e. if the last predicate does not return a value, then we wil take the answer from the one before)
//If get label is true, the request get the label of the returned value
function doSparqlRequestForPredicatePromise(companyDBR, predicateList, varName, companyName, companyMap, getLabel, convertResultType) {
	
	return new Promise((resolve)=>{

		var labelVarName = "";
		var querryLabel = "";
		if (getLabel) {
			labelName = "?label" + varName
			labelVarName = " STR(" + labelName + ")";
			querryLabel = "?" + varName + " rdfs:label " + labelName + ". FILTER(langMatches(lang(" + labelName + "), \"EN\"))";
		}

		varName = '?' + varName;

		var resultRequest = varName;
		if(convertResultType === "integer") {
			resultRequest = "<http://www.w3.org/2001/XMLSchema#integer>("+varName+")";
		} 
		else if (convertResultType === "integer") {
			resultRequest = "STR("+varName+")";
		}

		
		var requestContent = "SELECT DISTINCT " + resultRequest + labelVarName + " WHERE {";
		predicateList.forEach( predicate => {
			console.log(predicate);
			requestContent += "\nOPTIONAL { " + companyDBR + " " + predicate + " " + varName + ". " + querryLabel + createFilterForRequest(predicate, varName) + "}"
		} )
		requestContent += "\n}"
		
		/*
		// Encodage de l'URL à transmettre à DBPedia
		var url_base = "http://dbpedia.org/sparql";
		var url = url_base + "?query=" + encodeURIComponent(requestContent) + "&format=json";

		// Requête HTTP et affichage des résultats
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//Get the response from the querry
				var results = JSON.parse(this.responseText);*/
			//Performs the request
			doSparqlRequest(requestContent).then( results => {
				//Get the list of result
				resultList = results.results.bindings
				console.log("Request : \n"+requestContent);
				console.log(results)
				var predicat = results.head.vars[0];
				var label = results.head.vars[1];
				console.log(predicat)

				//Add the result to the html
				switch(varName){
					case "?abstract":
						//Update the abstract of the corresponding company
						companyMap[companyName].abstract = geLastResult(resultList, predicat);
						resolve(true);
						break;
					case "?logo":
						//Update the abstract of the corresponding company
						getImageProduct( geLastResult(resultList, predicat) ).then((imageFullURI)=>{
							console.log("####################################")
							console.log("####################################")
							console.log("####################################")
							console.log("####################################")
							console.log("####################################")
							console.log(imageFullURI)
							companyMap[companyName].logo = imageFullURI;
							resolve(true);
						});
						break;
					case "?industry":
						//Update the industry of the corresponding company
						companyMap[companyName].industryList = geAllResult(resultList, label);
						companyMap[companyName].industryListLink = geAllResult(resultList, predicat);
						resolve(true);
						break;
					case "?income":
						//Update the income of the corresponding company
						companyMap[companyName].income = geLastResult(resultList, predicat);;
						resolve(true);
						break;
					case "?product":
						//Update the product of the corresponding company
						companyMap[companyName].productList = geAllResult(resultList,label);
						companyMap[companyName].productListLink = geAllResult(resultList, predicat);
						resolve(true);
						break;
					default:
						resolve(false);
						break;
				}
			});
			/*
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();*/
	});
}

//Perform the input sparql request
//Return the answer of this query 
function doSparqlRequest(request) {
	
	return new Promise((answer)=>{
		// Encodage de l'URL à transmettre à DBPedia
		var url_base = "http://dbpedia.org/sparql";
		var url = url_base + "?query=" + encodeURIComponent(request) + "&format=json";

		// Requête HTTP et affichage des résultats
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var results = JSON.parse(this.responseText);
				console.log(results);
				//Get the list of result
				resultList = results.results.bindings
				answer(results);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	});
}

//Return the last result from the reustList after a querry
function geLastResult(resultList, predicat) {
	var value = "";
	resultList.forEach( attributs => {
		if (predicat in attributs) {
			value =  attributs[predicat].value;
		}
	} );
	return value;
}

//Return all results from the reustList after a querry
function geAllResult(resultList, predicat) {
	var valueList = [];
	resultList.forEach( attributs => {
		if (predicat in attributs) {
			valueList.push(attributs[predicat].value);
		}
	} );
	return valueList;
}

//Create a filter for a request
function createFilterForRequest(predicat, varName) {
	predicateName = predicat.split(":")[1]
	shouldApplyFilter = false
	
	switch(predicateName) {
		case "revenue" || "netIncome":
			filterContent = "datatype("+varName+") = <http://dbpedia.org/datatype/usDollar>"
			shouldApplyFilter = true
			break
		case "abstract":
			filterContent = "langMatches(lang("+varName+"), \"EN\")"
			shouldApplyFilter = true
	}

	if (shouldApplyFilter)
		filter = "FILTER(" + filterContent + ") "
	else
		filter = ""
	
		return filter
}

//Get the dbr company name from a uri
function getDbrCompanyName(companyURI){
    var splitCompanyName = companyURI.split("/");
	var comapanyName = splitCompanyName[splitCompanyName.length - 1];
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

//Get the full image url with only the end of the url
//Return the image url
//TODO : check if the link exists otherwise return null
function getImageProduct(imageURIend){

	return new Promise((resultFullURI)=>{
		if (imageURIend != "") {
			var fullURI = "https://commons.wikimedia.org/wiki/Special:FilePath/" + imageURIend;
			var tester=new Image();
			tester.onload=function() {
			console.log("++++++++++++++++++++++++++++++++++++")
			console.log("++++++++++++++++++++++++++++++++++++")
				console.log(fullURI)
				console.log("CORRECT "+fullURI)
				resultFullURI(fullURI);
			};
			tester.onerror=function() {
			console.log("------------------------------------")
			console.log("------------------------------------")
				console.log(fullURI)
				console.log("NOT CORRECT "+fullURI)
				resultFullURI("");
			};
			tester.src=fullURI;
		} else {
			resultFullURI("")
		}
	});
}

//Change to page name
function changePage( pageName, companyURI ) {
	console.log(companyURI);
	sessionStorage.setItem('companyURI',companyURI);
	window.location = "./"+pageName;
}