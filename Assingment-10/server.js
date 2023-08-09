import express from "express"
import { db, Product, User } from "./db.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from "express-session";
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const upload = multer({ dest: "upload/" })

app.set("views", __dirname + "/public");
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("upload"));
app.use(
    session({
        secret: "iamasecret on a windows",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(upload.single("pic"))
app.use((req, res, next) => {
    console.log(req.url);
    next()
})

db();
var page = 0;


app.get("/addProduct",async(req,res)=>
{
    res.render("addProduct");
})

app.post("/addProduct",async(req,res)=>
{
    const {title,description,price} = req.body;
    const image = req.file.filename
    try {
        const isCreated = await Product.create({title,description,price,image});
        if (!isCreated)
            res.status(400).json({ msg: "Something went wrong" });
        else
            res.redirect("/addProduct")
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.get("/getProducts", async (req, res) => {
    console.log(page)
    let perPage = 5;
    let skip = (page * perPage);
    try {
        const data = await Product.find().skip(skip)
        .limit(perPage)
        .sort({updateAt:-1});
        page++;
        return res.status(200).json({data})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error});
    }
})


app.get("/dashboard", async (req, res) => {
    page = 0;
    if (req.session.isLoggedIn) {
        try {
                res.render("dashboard", { username: req.session.username})
        } catch (error) {
            res.redirect("/login")
        }
    }
    else
        res.redirect("/login")
})

app.get("/login", (req, res) => {
    if (req.session.isLoggedIn)
        res.redirect("/dashboard")
    else
        res.render("login");
})

app.post("/login", async function (req, res) {
    if (req.session.isLoggedIn)
        res.redirect("/dashboard")
    const { email, password } = req.body;
    try {
        const isFinded = await User.findOne({ email, password });
        if (isFinded) {
            req.session.isLoggedIn = true;
            req.session.username = isFinded.name;
            req.session.useremail = isFinded.email;
            res.redirect("/dashboard")
        }
        else
            res.status(400).json({ msg: "User or password are wrong" });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }


});

app.get("/register", (req, res) => {
    res.status(200).render("register");
})

app.post("/register", async function (req, res) {
    const { name, email, password } = req.body;
    try {
        const isFinded = await User.findOne({ email });
        if (isFinded) {
            res.status(400).json({ msg: "User already exists" });
            return;
        }

        const isCreated = await User.create({ name, email, password });
        if (!isCreated)
            res.status(400).json({ msg: "Something went wrong in Writefile module" });
        else
            res.status(200).json({ msg: "Succesfully created user" });
    } catch (error) {
        res.status(400).json(error)
    }

});


app.get("/logout", (req, res) => {
    if (req.session.isLoggedIn) {
        req.session.destroy((err) => {
            if (!err)
                res.redirect("/login")
        })
    }
})




app.listen(8000, () => {
    console.log("App listining on port 8000")
})