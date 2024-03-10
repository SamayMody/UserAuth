const express = require('express');
const bcrypt = require('bcrypt');
const collection = require('./model.js');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine' , 'ejs');

app.listen(5000, () => console.log("Listening on port 5000🔥"))


app.get("/auth/login", async (req , res) => {
    res.render("login.ejs");
});

app.get("/auth/signup", async (req , res) => {
    res.render("signup.ejs");
});

app.post("/auth/signup", async(req , res) => { 

    const newUser = {
        name: req.body.username,
        password: req.body.password
    };

    try {

        // checking for exsisting username
        const exsistingUser = await collection.findOne({name: newUser.name});
        if (exsistingUser) {
            res.send("Username already taken!🥲");
            
        }
        else{
            // Hashing the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
            newUser.password = hashedPassword;
            
            const userData = await collection.create(newUser);
            res.status(200).json({"User Created👷‍♂️": newUser.name, "message": "You can now login" });
            
        }
        
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

app.post("/auth/login", async(req,res) => {
    try {
        const checkingUsername = await collection.findOne({name: req.body.username});
        if (!checkingUsername) {
            res.send("User does not exsist.")
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



