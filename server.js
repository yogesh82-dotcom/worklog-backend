const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors({origin: https://yogesh82-dotcom.github.io/worklog/ }))


let logs = [];


// app.get('/',(req,res)=>{
//     res.send("Hello Worldd")
// })
mongoose.connect('mongodb+srv://yogesh:20EuGf8oDWC6KaOi@cluster1.1wm6t.mongodb.net/')
.then(()=>{
    console.log("Database Connected!")
})
.catch((err)=>{
    console.log(err)
})

const logSchema = new mongoose.Schema({
    title:{
        required:true,
        type: String
    },
    description:String,
    working_hours:String
})

const logModel = mongoose.model('worklog',logSchema);

app.post('/worklogs', async (req,res) => {
    res.status(200).send("landing");
    const {title, description,working_hours} = req.body;
    // const newlog = {
    //     id: logs.length + 1,
    //     title,
    //     description,
    //     working_hours
    // };
    // logs.push(newlog);
    // console.log(logs);
    try {
        const newLog = new logModel({title,description,working_hours});
        await newLog.save();
        res.status(201).json(newLog);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
    
})


app.get('/worklogs', async (req,res) => {
    try {
        const logs = await logModel.find();
        res.json(logs)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
    
})


app.put("/worklogs/:id", async (req,res)=>{
    try {
        const {title,description,working_hours} = req.body;
        const id = req.params.id;
        const updatedLog = await logModel.findByIdAndUpdate(
            id,
            {title,description,working_hours},
            {new:true}
        )
        if(!updatedLog){
            return res.status(404).json({message:"worklog not found"})
        }
        res.json(updatedLog)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
})

app.delete('/worklogs/:id', async(req,res)=>{
    try {
        const id = req.params.id;
        await logModel.findByIdAndDelete(id);
        res.json("deleted successfully");
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
})

const port = process.env.port || 8000;
app.listen(port,()=>{
    console.log("server initiated at " + port);
})
