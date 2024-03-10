const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://modysamay:Srmsam%4033@cluster1.mmkk8ne.mongodb.net";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    console.log("Connected to MongoDB");

    const db = client.db("Users");
    const collection = db.collection("user_details");

    // Your other code using the collection goes here

}).catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
});

