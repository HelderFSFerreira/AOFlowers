var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var vision = require('@google-cloud/vision')({
  keyFilename: './keys/My Project-5b474438de4d.json'
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    
    form.filePath = form.uploadDir+'\\'+file.name;
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function(field,file) {
    var finalArray = [];
    var numElements = 0;

    vision.detectLabels(form.filePath)
    .then((results) => {
        
        var usedArray = results[1].responses[0].labelAnnotations;
        numElements=usedArray.length;
        
        usedArray.forEach(function(element) {
          var auxObj = {};
          auxObj.name = element.description;
          auxObj.percentage = element.score;
          finalArray.push(auxObj);
          deCount();
        }, this);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
    // Assync method

    function deCount() {
       numElements--;
       if (numElements<1) {
         res.json(finalArray);
       }
    }
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
