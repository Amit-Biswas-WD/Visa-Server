require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.yit3t.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const visaCollection = client.db("visaDB").collection("addVisa");

    // data post
    app.post("/addVisa", async (req, res) => {
      const visa = req.body;
      console.log("visa detains", visa);
      const result = await visaCollection.insertOne(visa);
      res.send(result);
    });

    // send to server side data
    app.get("/addVisa", async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run();

app.get("/", (req, res) => {
  res.send("Visa Server is Running.");
});

app.listen(port, () => {
  console.log(`Visa Server is running on port ${port}`);
});
