const Task = require('../models/taskModel');
const mongoose = require('mongoose');


// get all tasks
const getTasks = async (req, res) => {
    const { orderBy, searchTerm } = req.query;
    const user_id = req.user._id;

    try {
        const tasks = await Task.find({
            $and: [
                { user_id },
                { 
                    $or: [ 
                        { title: { $regex: searchTerm, $options: 'i' } }, // Search in title
                        { note: { $regex: searchTerm, $options: 'i' } } // Search in description
                    ]
                }
            ]
        }).sort({ [orderBy]: -1 });

        res.status(200).json(tasks);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
}



// get a single task
const getTaskDetails = async (req, res) => {
    const {id} = req.params;
    // check if id is valid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such task found'});
    }
    const task = await Task.findById(id)

    if(!task){
        return res.status(404).json({error: 'No such task found'});
    }
    res.status(200).json(task);
}

const addTask = async (req, res) => {
    const {title, note, dueDate, dueTime, currentStatus} = req.body
    
    let emptyFields = []
    for (const [key, value] of Object.entries({title, note, dueDate, dueTime})) {
        if(!value){
            emptyFields.push(key)
        }
    }

    // if(!title){
    //     emptyFields.push("title")
    // }
    // if(!note){
    //     emptyFields.push("note")
    // } 
    if(emptyFields.length > 0){
      return res.status(400).json({error: "Fields required", emptyFields})
    }

    try {
        const user_id = req.user._id
        const task = await Task.create({title, note, dueDate, dueTime, user_id});
        res.status(200).json(task)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// delete a task
const deleteTask = async (req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
       return res.status(404).json({error: 'No such task found'});
   }
   
   const task = await Task.findOneAndDelete({_id:id});
   if(!task){
       return res.status(404).json({error: 'No such task found'});
   }
   res.status(200).json(task);
}

// update a task

const updateTask = async (req, res) => {
    const {id} = req.params;
     if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such task found'});
    }
    

    const task = await Task.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true } 
      );
    console.log("task", task)
    if(!task){
        return res.status(404).json({error: 'No such task found'});
    }
   res.status(200).json(task);
}

module.exports = {
    getTasks,
    getTaskDetails,
    addTask,
    deleteTask,
    updateTask
}