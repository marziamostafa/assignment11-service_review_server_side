const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
// const jwt = require('jsonwebtoken')

const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json())



const uri = "mongodb+srv://<username>:<password>@cluster0.kkoxxt5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res) => {
    res.send('foodie server site running')
})

app.listen(port, () => {
    console.log(`foodie server running from ${port}`)
})