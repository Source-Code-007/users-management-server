const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.port || 5000

app.use(cors())
app.use(express.json())


app.get(('/'), (req, res) => {
    res.send('user-management-server is running')
})


const uri = "mongodb+srv://utsho926:EvJi9iIQNjP8f6Ep@cluster0.iw4kl2c.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const usersDatabase = client.db("usersDB").collection("users")

        app.post(('/users'), async (req, res) => {
            const users = req.body
            const result = await usersDatabase.insertOne(users);
            console.log(users);
            res.send(result)
        })
        
        app.get('/users', async (req, res) => {
            const cursor = usersDatabase.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('server is running')
})