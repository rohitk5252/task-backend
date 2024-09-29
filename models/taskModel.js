const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required : true
    },
    currentStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending', 
    },
    dueDate: {
        type: Date,
        required : true
    },
    dueTime: {
        type: String,
        required : true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
},{ timestamps: true})

const Task = mongoose.model('Task' ,taskSchema);
module.exports = Task;