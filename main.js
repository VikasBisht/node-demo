const open = require('opn');
const fs = require('fs');
const path = require('path');
const dirPath = __dirname + '/ConvertedJPEGFile';	//directory path
const fileType = '.'+'jpg'; //file extension
const express = require('express');
var images = require("images");
var q = require('q');
var app = express();
const PNGfileLocation  =  __dirname + '/PNGFileToConvert';

function convertPNG(){
	return new Promise(function (resolve, reject) {
		fs.readdir(PNGfileLocation, function(err,list){
			if(err) throw err;
			resolve(list);
		});
	});
}
function packageInfo() {  
return new Promise(function (resolve, reject) {
	var files = [];
	fs.readdir(dirPath, function(err,list){
		var def1 = q.defer();
		if(err) throw err;
		
		for(var i=0; i<list.length; i++)
		{  
			if(path.extname(list[i])=== fileType)
			{		
				files.push(list[i]); //store the file name into the array files
			}
			
		}
		resolve(files);
		
	});

 });
}
function createHTML(files){
	var text='<html> \n<body>\n';
	return new Promise(function(resolve,reject){
		for(var i=0;i<files.length;i++){
				
	  text = text + "\n<div style='display:block;width:100%;padding:20px'>\n<div style='padding:20px;text-align:center;height:100px ;float:left;width:20%;border:1px solid black'>"+files[i]+"</div>\n<div style='float:left;width:70%;border:1px solid black;padding:20px'> <img style='width:auto;height:100px' src='./ConvertedJPEGFile/"+files[i]+"'></div>\n</div>\n"
				
		}
		text = text + '\n</body> \n</html>';
		resolve(text);
	});
}
convertPNG().then(function(response){
	
	for(var i= 0 ;i< response.length;i++){
		if(path.extname(response[i])=== '.png'){
			var file = response[i].substring(0, response[i].lastIndexOf('.'));
			!(function(filepath,filename){
				images(PNGfileLocation+ '/'+ filepath).save(dirPath +"/"+ filename +".jpg",{quality:50,background : "black", alpha: "remove"}); 
			})(response[i],file)
		 
			
		}
	}
	
	packageInfo().then(function(response){
		createHTML(response).then(function(response){
			fs.writeFile('imageTest.html', response, (err) => {  
		
				if (err) throw err;
				
			 
			});
		  
		});
	});
	
});



app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, './ConvertedJPEGFile')));



app.get('/imageTest.html', function(req, res) {
   res.sendFile(__dirname + "/imageTest.html");
   res.end();
});

	
app.listen(8080, function() {
console.log('listening on port' + 8080);
});

setTimeout(function(){
	open('http://localhost:8080/imageTest.html',{app: ['chrome']});
	open('http://localhost:8080/imageTest.html',{app: ['firefox']})
	open('http://localhost:8080/imageTest.html',{app: ['iexplore']})
});
	












