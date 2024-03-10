const express = require('express');
const bcrypt = require('bcrypt');

const dotenv = require("dotenv");
dotenv.config({path: './.env'});

const { MongoClient } = require('mongodb');
const uri = process.env.MONGOURI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    console.log("Connected to MongoDB🚀");

    const db = client.db("Users");
    const collection = db.collection("user_details");

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.set('view engine', 'ejs');

    app.listen(5000, () => console.log("Listening on port 5000🔥"));

    app.get("/auth/login", async (req, res) => {
        res.render("login.ejs");
    });

    app.get("/auth/signup", async (req, res) => {
        res.render("signup.ejs");
    });

    app.get("/user", async (req, res) => {
        res.render("home.ejs");
    });
 
    app.post("/auth/signup", async (req, res) => {

        const newUser = {
            name: req.body.username,
            password: req.body.password,
            email: req.body.email
        };

        try {

            // checking for existing username
            const existingUser = await collection.findOne({ name: newUser.name });
            const exsistingEmail = await collection.findOne({email: newUser.email});
            if (existingUser && exsistingEmail) {
                res.send("Username already taken!🥲");

            }
            else {
                // Hashing the password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
                newUser.password = hashedPassword;

                await collection.insertOne(newUser);
                res.status(200).json({ "User Created👷‍♂️": newUser.name, "message": "You can now login" });

            }

        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    });

    app.post("/auth/login", async (req, res) => {
        try {
            const checkingUsername = await collection.findOne({ name: req.body.username });
            if (!checkingUsername) {
                res.send("User does not exist.")
            };


            const checkingPassword = await bcrypt.compare(req.body.password, checkingUsername.password);
            if (checkingPassword) {
                res.render("home");

            } else {
                res.send("Wrong password.");

            }
        } catch (error) {
            res.status(500).json(error);

        };
    });

    app.post("/user", async (req,res) => {
        const getUser = await collection.findOne({name: req.body.username});
        if (getUser) {
            res.status(200).json({"details": getUser});
            
        } else {
            res.status(404).json({"message": "No such user"});
            
        }
        
    });

}).catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
});
