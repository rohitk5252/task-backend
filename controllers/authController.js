const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// login user 
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        //  creating token
        const token = createToken(user._id)

        res.status(200).json({email, token, firstName: user.firstName, userAvatar: user.userAvatar})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// signup user 
const signupUser = async (req, res) => { 
    try {
        const user = await User.signup(req.body)
        //  creating token\
        const token = createToken(user._id)
        res.status(200).json({email: user.email, token, firstName: user.firstName,  userAvatar: user.userAvatar})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

// signup user 
const googleAuth = async (req, res) => { 
    const { code, redirect_uri, userAvatar } = req.body;
    try {
        const { tokens } = await client.getToken({
            code,
            redirect_uri: "https://task-frontend-bwbo.onrender.com"
        });
        client.setCredentials(tokens);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload;
        const [ firstName, lastName ] = name.split(" ");
        let user = await User.googleLogin({ googleId: sub, email, firstName, lastName, userAvatar: userAvatar });        
        const token = createToken(user._id)
        res.status(200).json({email, token, firstName, userAvatar: user.userAvatar})
    } catch (error) {
        console.error(error)
        res.status(400).json({error: error.message})
    }

}

module.exports = {
    loginUser, 
    signupUser,
    googleAuth
}