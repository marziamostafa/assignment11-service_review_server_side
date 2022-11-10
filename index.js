const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const reviewCollection = client.db('foodie').collection('review');

        //to show 3 services only
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })


        //to show all 6 services
        app.get('/allservices', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        // to show details
        app.get('/allservices/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //adding reviews
        app.get('/reviews', async (req, res) => {

            const decoded = req.decoded;
            console.log('inside reviews api', decoded)


            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews)
        })

        app.post('/reviews', async (req, res) => {
            const order = req.body;
            const result = await reviewCollection.insertOne(order);

            res.send(result);

        })

        // app.patch('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const status = req.body.status;
        //     const updatedDoc = {
        //         $set: {
        //             status: status
        //         }
        //     }
        //     const result = await orderCollection.updateOne(query, updatedDoc);

        //     res.send(result)
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