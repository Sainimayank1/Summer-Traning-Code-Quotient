import { timeStamp } from "console";
import mongoose from "mongoose";

function db() {
    mongoose.connect("mongodb+srv://mayanksaini4455:tjrIPnrgrtB52aKi@cluster0.tqiisca.mongodb.net/?retryWrites=true&w=majority").then(() => {
        console.log("Connected to database")
    })
}



const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price:{
        type:String,
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

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema)


export { db, Product , User }