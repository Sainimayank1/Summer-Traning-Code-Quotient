import { timeStamp } from "console";
import mongoose from "mongoose";

function db() {
    mongoose.connect("mongodb+srv://mayanksaini4455:tjrIPnrgrtB52aKi@cluster0.tqiisca.mongodb.net/?retryWrites=true&w=majority").then(() => {
        console.log("Connected to database")
    }).catch((err)=>
    {
        console.log(err);
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
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

const tokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
		ref:"User"
	},
	token: { type: String, required: true },
},
{timestamps:true});

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema)
const Token = mongoose.model("Token", tokenSchema);


export { db, Product , User , Token }