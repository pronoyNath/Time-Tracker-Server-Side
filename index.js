// user: taskManagement
// pass: $94gasA$$!32Vm2
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

// middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    // "https://task-management-c3da2.web.app",
    // "https://task-management-c3da2.firebaseapp.com"
  ],
  credentials: true
}));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxzfy8n.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("timeTrakerDB");
    const taskCollection = database.collection("taskCollection")


    app.post('/task-collection', async (req, res) => {
        const taskData = req.body;
        console.log(taskData);
        const result = await taskCollection.insertOne(taskData)
        res.send(result)
      })
    
    

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Running onnn....")
  })
  
  app.listen(port, () => {
    console.log(`Time Tracker server is running on port ${port}`);
  })