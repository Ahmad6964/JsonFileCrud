const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

// Get data from json file
const getTaskData = () => {
    const jsonData = fs.readFileSync('task.json')
    return JSON.parse(jsonData)    
}

// Read data from json file
const saveTaskData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('task.json', stringifyData)
}

// Get Method
app.get('/task/list', (req, res) => {
    const tasks = getTaskData()
    res.send(tasks)
})


// Post Method
app.post('/task/add', (req, res) => {
    
    const existTask = getTaskData()
    
    
    const taskData = req.body
    //check if the userData fields are missing
    if (taskData.id == null || taskData.title == null || taskData.discription == null || taskData.date == null) {
        return res.status(401).send({error: true, msg: 'User data missing'})
    }
    
    //check if the username exist already
    const findExist = existTask.find( task => task.id === taskData.id )
    if (findExist) {
        return res.status(409).send({error: true, msg: 'task id already exist'})
    }
    
    existTask.push(taskData)

    saveTaskData(existTask);
    res.send({success: true, msg: 'User data added successfully'})
})

// Patch Method
app.patch('/task/update/:id', (req, res) => {
    
    const id = req.params.id

    const taskData = req.body
    
    const existTasks = getTaskData()
    //check if the username exist or not       
    const findExist = existTasks.find( task => task.id === id )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'id not exist'})
    }
    //filter the userdata
    const updateTask = existTasks.filter( task => task.id !== id )
    
    updateTask.push(taskData)
    
    saveTaskData(updateTask)
    res.send({success: true, msg: 'User data updated successfully'})
})
// Delete Method
app.delete('/task/delete/:id', (req, res) => {
    const id = req.params.id

    const existTasks = getTaskData()
    //filter the userdata to remove it
    const filterTask = existTasks.filter( task => task.id !== id )
    if ( existTasks.length === filterTask.length ) {
        return res.status(409).send({error: true, msg: 'id does not exist'})
    }
    
    saveTaskData(filterTask)
    res.send({success: true, msg: 'Task removed successfully'})
    
})


// Server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})