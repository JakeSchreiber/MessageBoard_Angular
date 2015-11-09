var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
//var angular = require('angular');

//var connectionString = process.env.DATABASE_URL || 'postgres://veiistpfvugvhx:QBAvtJqDHRTvfxZzakBe06ATbU@ec2-54-204-6-113.compute-1.amazonaws.com:5432/dimrt7lf6rut9';
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/message_board';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));


app.get('/data', function(req,res){
    var results = [];

    //SQL Query > SELECT data from table
    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT name, message FROM messageboard");

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

app.post('/data', function(req,res){
    console.log(req);

    var addedMessage = {
        "name" : req.body.name,
        "message" : req.body.message
    };

    pg.connect(connectionString, function (err, client) {
        client.query("INSERT INTO messageboard (name, message) VALUES ($1, $2)", [addedMessage.name, addedMessage.message],
            function(err, result) {
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }

                res.send(true);
            });

    });

});

//app.use('/', index);


app.get("/*", function(req,res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "./public", file));
});

app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), function(){
    console.log("Listening on port: " + app.get("port"));
});