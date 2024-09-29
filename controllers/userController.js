const User = require('../models/userModel')

const updateUser = async (req, res) => { 
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { ...req.body },
            { new: true } 
          );
        res.status(200).json({ userAvatar: user.userAvatar})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

module.exports = {
    updateUser
}