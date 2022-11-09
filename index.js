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

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kkoxxt5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('foodie').collection('foodServices');

        //to show 3 services only
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })


        //to show all 6 services
        // app.get('/allservices', async (req, res) => {
        //     const query = {};
        //     const cursor = serviceCollection.find(query);
        //     const services = await cursor.toArray();
        //     res.send(services)
        // })

        //to show details
        // app.get('/allservices/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const service = await serviceCollection.findOne(query);
        //     res.send(service);
        // })
    }
    finally {

    }

}

run().catch(err => {
    console.error(err)
})


app.get('/', (req, res) => {
    res.send('foodie server site running')
})

app.listen(port, () => {
    console.log(`foodie server running from ${port}`)
})