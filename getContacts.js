//October 28, 2015
//This module is used to create an array of contacts from csv

var fs = require('fs');


//This will be the array that will eventually be returned from
//the csvParse function
var arrayOfContacts = [];

//This object will store the text from the headers row
var objectTemplate = {};


//This helper function will be used to map each 
//contact to its own object
var createContactObj = function(string){
	contactObj = {};
	var array = string.split(",")
	var k = 0;
	for (key in objectTemplate) {
		if (objectTemplate.hasOwnProperty(key)){
			contactObj[key] = array[k];
			k++;
		}		
	};
	arrayOfContacts.push(contactObj);
}



var csvParse = function(csvFile){

	//Split the string at new rows
	var arrayOfRows = csvFile.split(/\r|\r?\n/g);

	//Get the list of headers from row 0
	var headers = arrayOfRows[0].split(",")
	
	//create an object whose keys are the four header identifiers
	//and whose values are empty strings
	headers.forEach(function(item){
		objectTemplate[item]= "";
	});

	//Remove the first headers row from our array of rows
	arrayOfRows=arrayOfRows.slice(1);

	//Now create objects for each contact(friend) and add to
	//arrayOfContacts

	arrayOfRows.forEach(createContactObj);
	
	return arrayOfContacts;

};

module.exports.csvParse = csvParse;
