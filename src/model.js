const { MongoClient } = require('mongodb');
const dotenv = require("dotenv");
dotenv.config({path: './.env'});

const uri = process.env.MONGOURI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    console.log("Connected to MongoDB");

    const db = client.db("Users");
    const collection = db.collection("user_details");

    // Your other code using the collection goes here

}).catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
});

