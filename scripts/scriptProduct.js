window.onload = actOnWindow;
function actOnWindow(){
	console.log("Apple_Watch")
    productRequest("Apple_Watch")
}


function productRequest(product){

	doSparql(product,"rdfs:label",true)
	doSparql(product,"dbp:name",true)
	doSparql(product,"dbp:logo",false)
	doSparql(product,"dbo:type",false)
	doSparql(product,"dbo:developer",false)
	doSparql(product,"dbo:releaseDate",false)
	doSparql(product,"dbp:os",false)
	doSparql(product,"dbp:operatingSystem",false)
	doSparql(product,"dbo:abstract",true)
	doSparql(product,"dbp:webSite",false)
	doSparql(product,"dbp:successor",false)
	doSparql(product,"dbp:license",false)
	doSparql(product,"dbp:supportedPlatforms",false)
	doSparql(product,"dbp:caption",false)//texte de remplacement pour l'image
	doSparql(product,"dct:subject",false)
	doSparql(product,"rdfs:comment",false)
	doSparql(product,"dbo:manufacturer",false)
	doSparql(product,"dbp:connectivity",false)
	doSparql(product,"dbp:input",false)
	doSparql(product,"dbp:price",false)
	doSparql(product,"foaf:homepage",false)
	doSparql(product,"dbo:cpu",false)
	doSparql(product,"dbp:display",false)
	doSparql(product,"dbp:memory",false)
	doSparql(product,"dbp:name",false)
	doSparql(product,"dbp:power",false)
	doSparql(product,"dbp:service",false)
	doSparql(product,"dbp:sound",false)
	doSparql(product,"dbp:storage",false)
	doSparql(product,"dbp:weight",false)
	doSparql(product,"dbp:dimensions",false)
	doSparql(product,"dbp:display",false)
	doSparql(product,"dbp:fuelSource",false)
	doSparql(product,"dbp:inventor",false)
	doSparql(product,"dbo:product",false)

}