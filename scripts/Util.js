//Check if the image exists
//Return boolean sayong if the image was found
function imageExists(imageURI){

	return new Promise((imageExists)=>{
		if (imageURI != "") {
			//Test if the image exists
			var tester=new Image();
			tester.onload=function() {
				imageExists(true);
			};
			tester.onerror=function() {
				imageExists(false);
			};
			tester.src=imageURI;
		} else {
			imageExists(false);
		}
	});
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

//format a string ('_' -> ' ', and add ' ' before every upper case)
function formatString(stringToSplit){
    var character='';
    var stringResult = "";
    var prevCharUpper = true;

    for(var i=0 ; i < stringToSplit.length ; i++){
        character = stringToSplit.charAt(i);
		if(character.match(/[a-z]/i) && character == character.toUpperCase()){
			if(!prevCharUpper){
        		stringResult += " " + character;
        	} else {
        		stringResult += character;
        	}
        	prevCharUpper = true;
        } else if( i==0 && character == "_"  ) {
        } else if(i>0 && character == "_"){
        	stringResult += " ";
        	prevCharUpper = true;
        } else {
        	stringResult +=character;
        	prevCharUpper = false;
        }
    }

    return stringResult;
}