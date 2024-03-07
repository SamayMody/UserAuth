let users = [];

const userSchema = {
    username: {
        type: String,
        required: true
    },

    password: { 
        type: String,
        required: true
    },
    
};

function create(userData){
    users.push(userData);
    return userData;
}

function getusers(userData){
    return users;
}

module.exports = {create, getusers , userSchema};