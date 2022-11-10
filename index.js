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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded
        next()
    })
}


async function run() {
    try {
        const serviceCollection = client.db('foodie').collection('foodServices');
        const reviewCollection = client.db('foodie').collection('review');

        app.post('/jwt', (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })

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

        app.post('/allservices', async (req, res) => {
            const newInfo = req.body;
            console.log(newInfo)
            const result = await serviceCollection.insertOne(newInfo);

            res.send(result);

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
        app.get('/reviews', verifyJWT, async (req, res) => {

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

        app.post('/reviews', verifyJWT, async (req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);

            res.send(result);

        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })


        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)

        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const status = req.body;
            const updatedDoc = {
                $set: {
                    message: message
                }
            }
            const result = await orderCollection.updateOne(query, updatedDoc);

            res.send(result)
        })
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