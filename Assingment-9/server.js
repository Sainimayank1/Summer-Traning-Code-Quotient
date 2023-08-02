import express, { urlencoded } from "express"
import { db, Todo, User } from "./db.js"
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


app.get("/dashboard", async (req, res) => {
    if (req.session.isLoggedIn) {
        const { useremail } = req.session;
        try {
            const newdata = await Todo.find({ useremail })
            if (newdata)
                res.render("dashboard", { username: req.session.username, useremail: req.session.useremail, data: newdata })
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

app.post("/addTodo", async (req, res) => {
    if (!req.session.isLoggedIn)
        res.redirect("/login")
    try {
        const isCreated = await Todo.create({ title: req.body.title, isDone: "false", useremail: req.session.useremail, image: req.file.filename });
        if (!isCreated)
            res.status(400).json({ msg: "Something went wrong" });
        else
            res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.get("/todos", async (req, res) => {
    const { useremail } = req.query;

    try {
        const newdata = await Todo.find({ useremail })
        if (newdata)
            res.status(200).json({ data: newdata });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.delete("/", async (req, res) => {
    const { _id } = req.body;
    try {
        const isDeleted = await Todo.deleteOne({ _id });
        if (!isDeleted)
            res.status(400).json({ msg: "Something went wrong" });
        else
            res.status(200).json({
                msg: "Succesfully Delete"
            })
    } catch (error) {
        res.status(400).json({ msg: "Something went wrong" })
    }
})

app.post("/markTodo", async (req, res) => {
    const { _id, isDone } = req.body;
    console.log(isDone)
    try {
        const isUpdated = await Todo.findOneAndUpdate({ _id }, { isDone: !isDone })
        if (!isUpdated)
            res.status(400).json({ msg: "Something went wrong" });
        else
            res.status(200).json({
                msg: "Succesfully Update"
            })
    } catch (error) {
        res.status(400).json({ msg: "Something went wrong" })
    }
})




app.listen(8000, () => {
    console.log("App listining on port 8000")
})