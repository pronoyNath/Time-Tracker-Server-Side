// user: taskManagement
// pass: $94gasA$$!32Vm2
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        "https://time-traking-000.netlify.app"
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

        // getting task collection 
        app.get('/task-collection/:email', async (req, res) => {
            const userEmail = req.params.email;
            // console.log(userEmail);

            const result = await taskCollection.find({ userEmail: userEmail }).toArray();
            // console.log(result);
            res.send(result)
        })

        // posting task collection 
        app.post('/task-collection', async (req, res) => {
            const taskData = req.body;
            // console.log(taskData);
            const result = await taskCollection.insertOne(taskData)
            res.send(result)
        })
        //update time
        app.put('/update-time/:id', async (req, res) => {
            const taskID = req.params.id;
            // console.log(taskID);
            const time = req.body;
            // console.log("tt",time?.seconds);
            const filter = { _id: new ObjectId(taskID) };
            const options = { upsert: true };
            const updateUserRole = {
                $set: {
                    timer: time?.seconds
                }
            }
            const result = await taskCollection.updateOne(filter, updateUserRole, options)
            res.send(result);
        })

        // update task 
        app.put('/project-update/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            // console.log(id, body);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateAvailable = {
                $set: {

                    projectName :body?.projectName,
                    taskTitle: body?.taskTitle,
                    description: body?.description,
                    userEmail: body?.userEmail

                }
            }
            const result = await taskCollection.updateOne(filter, updateAvailable, options)
console.log(result);
            res.send(result);
        })

        // delete task 
        app.delete('/project-delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
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