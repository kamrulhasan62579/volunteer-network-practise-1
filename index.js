var express = require('express')
var bodyParser = require('body-parser')
 
var cors = require('cors')
var app = express()
require('dotenv').config()
 
const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8jtul.mongodb.net/volunteers-work?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 


client.connect(err => {
  //login register list -------------------------------------------------------------
  const collection = client.db("volunteers-work").collection("entry");
  console.log("Database Connected");

  app.post('/logRegister', (req, res) => {
    collection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount < 0)
      console.log("Inserted Successfully");
    })
  })
  app.get('/logRegister', (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
// all event List-----------------------------------------------------------------
  const mainDataCollection = client.db("volunteers-work").collection("entryData");
  app.post('/mainData', (req, res) => {
      mainDataCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount < 0)
        console.log('Inserted Successfully');
      })
  })
  app.get('/main/:email', (req, res) => {
    mainDataCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })




  const eventListCollection = client.db("volunteers-work").collection("entries");
  app.post('/eventList', (req, res) => {
    eventListCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount < 0);
      console.log('Inserted Successfully');
    })
  })
  app.get('/eventList', (req, res)=> {
    eventListCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  app.get('/calledEvent/:id', (req, res) => {
    eventListCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0])
    })
  })

});


app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(4006 || process.env.PORT, ()=> console.log("Listening from port 4006"))