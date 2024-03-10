const mongoose = require('mongoose');
const password = encodeURIComponent("Srmsam@33");
const connect = mongoose.connect(`mongodb+srv://modysamay:${password}@cluster1.mmkk8ne.mongodb.net/?retryWrites=true&w=majority`);

connect.then(()=> {
    console.log("Connected to db🚀");
})

.catch(() => {
    console.log("Failed connectionn to db");
})

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    }

});

const collection = mongoose.model('user_details', userSchema);
module.exports = collection;