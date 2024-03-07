const express = require('express');
const user = require('./model.js');
const config = require('./config.js');
const userSchema = require('./model.js');

const app = express();
app.use(express.json());

app.listen(5000, () => console.log("Listening on port 5000🔥"))

app.get("/", async (req , res) => {
    res.send("Hello i am working maybe");
})

app.post("/auth/signup", async(req , res) => { 
    try {
        const newUser = await user.create(req.body);
        res.status(200).json(newUser);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }



})



