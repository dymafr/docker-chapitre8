const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
let count;

const client = new MongoClient(
  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}@db`
);
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("CONNEXION DB OK !");
    count = client.db("test").collection("count");
  } catch (err) {
    console.log(err.stack);
  }
}
run().catch(console.dir);

app.get("/err", (req, res) => {
  process.exit(0);
});

app.get("/", (req, res) => {
  count
    .findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { returnNewDocument: true, upsert: true }
    )
    .then((doc) => {
      res.status(200).json(doc ? doc.count : 0);
    });
});

app.listen(80);
