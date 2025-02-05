require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const usersCollection = client.db("visaDB").collection("usersVisa");

    // data post
    app.post("/addVisa", async (req, res) => {
      const visa = req.body;
      console.log("visa detains", visa);
      const result = await visaCollection.insertOne(visa);
      res.send(result);
    });

    // user Data
    app.post("/usersVisa", async (req, res) => {
      const users = req.body;
      console.log("users data", users);
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    // send to server side data
    app.get("/addVisa", async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // see single id
    app.get("/addVisa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.findOne(query);
      res.send(result);
    });

    // delete
    app.delete("/addVisa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/addVisa/:id", async (req, res) => {
      const id = req.params.id;
      const visa = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateOne = {
        $set: {
          country_name: visa.country_name,
          url: visa.url,
          visa_type: visa.visa_type,
          processing_time: visa.processing_time,
          validity: visa.validity,
          application_method: visa.application_method,
          required_documents: visa.required_documents,
          description: visa.description,
          processing_date: visa.processing_date,
          age_restriction: visa.age_restriction,
          fee: visa.fee,
        },
      };
      const result = await visaCollection.updateOne(filter, updateOne, options);
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
