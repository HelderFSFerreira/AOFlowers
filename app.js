var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Clarifai = require('clarifai');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/',function (req, res) {
    res.send('Hello World!')
});

var appClarifai = new Clarifai.App(
  'XH9-BKSIzEO7Ympw8z7IpzvnILYUzgMoQl0ymbTq',
  'O6VgBPZA07w4dkhQKtgm8B7IoJiNypFfCmsrjZ8Z'
);

appClarifai.models.predict(Clarifai.GENERAL_MODEL, 'https://samples.clarifai.com/metro-north.jpg').then(
    function(response) {
        var arrayPreditions = [];
        
        var jsonReceived = response.outputs[0].data.concepts;
        var cenas =  jsonReceived.length;
        // console.log(cenas);

        for(i=0;i<jsonReceived.length;i++) {
            arrayPreditions.push(jsonReceived[i].name);
        }
        console.log(arrayPreditions);
        
        
        
    },
    function(err) {
        console.error(err);
    }
);


app.listen(3000);
console.log("Listening on port 3000");