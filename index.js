const express = require('express');
const cors = require('cors');
const app = express();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// const jwt = require('jsonwebtoken')

const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('foodie server site running')
})

app.listen(port, () => {
    console.log(`foodie server running from ${port}`)
})