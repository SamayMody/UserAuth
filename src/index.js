const express = require('express');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');

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

    app.get("/api/login", async (req, res) => {
        res.render("login.ejs");
    });

    app.get("/api/signup", async (req, res) => {
        res.render("signup.ejs");
    });

    app.get("/api/user", async (req, res) => {
        res.render("home.ejs");
    });

    app.get("/api/user/delete", async (req,res) =>{
        res.render("delete.ejs");
    });
 
    app.post("/api/signup", async (req, res) => {

        const newUser = {
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            createdAt: new Date()
            
        };

        const emailRegex = /^[A-Za-z0-9._]+@[A-Za-z]{2,}\.[A-Za-z.]{2,10}$/;


        try {

            // checking for existing username
            const exsistingUser = await collection.findOne({ name: newUser.name });
            const exsistingEmail = await collection.findOne({email: newUser.email});
            if (exsistingUser && exsistingEmail) {
                res.send("Username already taken!🥲");

            }

            else if(!emailRegex.test(newUser.email)){
                return res.status(400).json({ "message": "Invalid email address" });
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

    app.post("/api/login", async (req, res) => {
        try {
            const checkingUsername = await collection.findOne({ email: req.body.email });
            if (!checkingUsername) {
                res.send("User does not exist.")
            };


            const checkingPassword = await bcrypt.compare(req.body.password, checkingUsername.password);
            if (checkingPassword) {
                res.json({"You are now LogedIN": checkingUsername.name})
                res.render("home");

            } else {
                res.send("Wrong password.");

            }
        } catch (error) {
            res.status(500).json(error);

        };
    });

    app.post("/api/user", async (req,res) => {
        const getUser = await collection.findOne({id: req.body.id});
        if (getUser) {
            res.status(200).json({"details": getUser});
            
        } else {
            res.status(404).json({"message": "No such user"});
            
        }
        
    });

    app.get("/api/users", async (req,res) => {
        const getAllUsers = await collection.find({}, { projection: { password: 0 } }).sort({ name: 1 }).toArray();
        if (getAllUsers) {
            res.status(200).json({"All users": getAllUsers});
        } else {
            res.status(404).json(error);
            
        }
    });

    app.get("/api/users/:hours", async (req, res) => {
        try {
            const hours = parseInt(req.params.hours);
            if (isNaN(hours)) {
                return res.status(400).json({ message: "Invalid hours parameter" });
            }
    
            const currentDate = new Date();
            const startTime = new Date(currentDate.getTime() - hours * 60 * 60 * 1000); // Calculating the start time based on the provided hours
            const users = await collection.find({ createdAt: { $gte: startTime, $lte: currentDate } }, { projection: { password: 0 } }).toArray();
            
            res.status(200).json({ "Users created in the last hours": users });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.post("/api/user/delete" , async(req, res)=> { 
        try {
            const result = await collection.deleteOne({id:req.body.id});
            if (result.deletedCount==1) {
                res.status(200).json({ "message": "User has been deleted"});
                
            } else {
                res.send("Some error");
                
            };
            
        } catch (error) {
            res.status(500).json({"message": error});
        }
    });
    

  
        
}).catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
});
