const express = require('express');
const app = express();
const port = 5000
const cors = require('cors')
const ObjectId= require('mongodb').ObjectId;
require('dotenv').config();


app.use(cors());
app.use(express.json());

// user: formBuilder
// password : fdxW2pjefEJHEldL

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lkoa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {

        await client.connect();
        console.log("Database Connected");
        const database = client.db("fromBuilder");

        const userCollection = database.collection("user");
        const entryCollection = database.collection("userEntry");

        // get api

        app.get('/users', async(req,res)=>{

            const cursor= userCollection.find({});
            const users= await cursor.toArray();
            res.send(users)
        })

        //   post api

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log('hitttinggggggg', req.body);
            res.json(result);
        })

        // user entry 

        app.post('/usersEntry', async (req, res) => {
            const newUser = req.body;
            const result = await entryCollection.insertOne(newUser);
           
            res.json(result);
        })

        



        // geting value from eid ..............
        app.get('/usersEntry/:id', async (req, res)=>{
            const id=req.params.id;
            const query={eid:id};
            const user= await entryCollection.findOne(query);

            res.send(user);
        })
       

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('From Builder is Running');
})

app.listen(port, () => {
    console.log('listing', port);
})