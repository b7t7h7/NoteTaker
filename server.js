

var express = require("express");
var path = require("path");
var fs = require("fs");


var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// routes

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.get("/api/notes", function(req, res) {
  var data = fs.readFileSync(__dirname + "/database/db.json");
  var noteDbArr = [];
  
  if(data.length > 0){
    noteDbArr = JSON.parse(data);
  }
  return res.json(noteDbArr);  
});


app.post("/api/notes", function(req, res) {
  console.log("API call.");
  var newNote = req.body;
  var data = fs.readFileSync(__dirname + "/database/db.json");
  console.log(data);
  console.log(newNote);
  var noteDbArr = [];

  var newId = 1;
  if(data.length > 0){
    noteDbArr = JSON.parse(data);
    if(noteDbArr.length > 0){
      newId = noteDbArr[noteDbArr.length - 1].id + 1;
    }
  }

    newNote.id = newId;
    noteDbArr.push(newNote);
    fs.writeFile(__dirname + "/database/db.json", JSON.stringify(noteDbArr), function(err){
      if (err) {
          return console.log(err);
      }
      console.log("Success!");
    });
    return res.json(noteDbArr);
  });


app.delete("/api/notes/:id", function(req, res) {
  var deleteNoteId = req.params.id;
  var data = fs.readFileSync(__dirname + "/database/db.json");
  var noteListArr = [];
  
  if(data.length > 0){
    noteListArr = JSON.parse(data);
    console.log(noteListArr);
    console.log(deleteNoteId);
    
    for(var i=0; i < noteListArr.length; i++){
      if (deleteNoteId == noteListArr[i].id){
        console.log(noteListArr[i]);
        noteListArr.splice(i,1);
        console.log(noteListArr);
        break;
      }
    }
    fs.writeFile(__dirname + "/database/db.json", JSON.stringify(noteListArr), function(err){
      if (err) {
          return console.log(err);
      }
      console.log("Success!");
    });
    return res.json(noteListArr);
  }
  else{
    return res.json([]);
  }
  });



app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});