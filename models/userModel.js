const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
    },
    userAvatar: {
        type: Schema.Types.Mixed, // This allows storing JSON data
        required: false,
    }
})


// Static signup method 
userSchema.statics.signup = async function({ email, password, confirmPassword, firstName, lastName, userAvatar }) {
    // Validation 
    if (!email || !password || !firstName) {
        throw Error("All fields required !")
    }
    if(!validator.isEmail(email)) {
        throw Error(("Invalid emill type"))
    }

    if(!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    if(password != confirmPassword) {
        throw Error('Password and confirmPassword not same')
    }


    const exists = await this.findOne({ email })
console.log(exists)
    if(exists) {
        throw Error("Email already exists")
    }

    // Salt is a random string
    const salt = await bcrypt.genSalt(10)
    // hashing the password
    const hash = await bcrypt.hash(password, salt)
    // saving to database
    const user = await this.create({ email, password: hash, firstName, lastName, userAvatar })
     
    return user
}
// Static signup/login method for Google users
userSchema.statics.googleLogin = async function({ email, googleId, firstName, lastName, userAvatar }) {
    if (!email || !googleId) {
        throw Error("All fields required!");
    }

    let user = await this.findOne({ email });

    // If the user already exists with this email but has no Google ID, update the record
    if (user && !user.googleId) {
        user.googleId = googleId;
        await user.save();
    }

    // If no user exists, create a new user with the Google ID
    if (!user) {
        user = await this.create({ email, googleId, firstName, lastName, userAvatar });
    }

    return user;
};

// static login method 
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error("All fields required !")
    }
    
    const user = await this.findOne({ email })

    if(!user) {
        throw Error("User does not exists")
    }

    if(!user.password) {
        throw Error("Try signing with google")
    }
    console.log(password, user.password)
    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error("Incorrect password !")
    }

    return user
}

module.exports = mongoose.model('User', userSchema)
