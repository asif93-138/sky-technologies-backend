import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db('sky_technologies');
    const collection = db.collection('userRequest');

    app.get('/', (req, res) => {
      res.send('Sky Technologies backend connected!')
    })

    app.get("/requests", async (req, res) => {
      const data = await collection.find().toArray();
      res.send(data);
    });

    app.post('/request', async (req, res) => {
      const data = req.body;
      data.DTStamp = new Date(req.body.DTStamp);
      const result = await collection.insertOne(data);
      res.send(result);
    })

  } finally {
    // Close the database connection when finished or an error occurs
    // await client.close();
  }
}
run().catch(console.error);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
