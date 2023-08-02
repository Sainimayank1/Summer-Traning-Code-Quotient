import { timeStamp } from "console";
import mongoose from "mongoose";

function db() {
    mongoose.connect("mongodb+srv://mayanksaini4455:VYpJlnyBvM9jKc8u@cluster0.ubkbpyj.mongodb.net/?retryWrites=true&w=majority").then(() => {
        console.log("Connected to database")
    })
}



const TodoSchema = new mongoose.Schema({
    useremail:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true,
    },
    isDone:{
        type:Boolean,
        default:false,
    },
    image:{
        type:String,
        required:true
    }
},{timestamps: true});

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const Todo = mongoose.model("Todo", TodoSchema);
const User = mongoose.model("User", userSchema)


export { db, Todo , User }