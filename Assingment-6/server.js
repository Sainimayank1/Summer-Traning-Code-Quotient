import express, { urlencoded } from "express"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from "express-session";
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        secret: "iamasecret on a windows",
        resave: true,
        saveUninitialized: true,
    })
);
app.use((req, res, next) => {
    console.log(req.url);
    next()
})

app.get("/dashboard", (req, res) => {
    if (req.session.isLoggedIn) {
        res.status(200).sendFile(__dirname + "/public/dashboard.html");
    }
    else
        res.redirect("/login")
})

app.get("/login", (req, res) => {
    if (req.session.isLoggedIn)
        res.redirect("/dashboard")
    else
        res.status(200).sendFile(__dirname + "/public/login.html");
})

app.post("/login", function (req, res) {
    const { email, password } = req.body;
    try {
        fs.readFile(__dirname + "/userDetail.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)
            let todos = JSON.parse(data);
            let isFinded = false;
            let userName = "";
            todos.map((val) => {
                if (val.email === email && val.password === password) {
                    isFinded = true;
                    userName = val.name;
                }
            })
            if (isFinded) {
                req.session.isLoggedIn = true;
                req.session.username = userName;
                res.redirect("/dashboard")
            }
            else
                res.status(400).json({ msg: "User or password are wrong" });


        });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }


});

app.get("/register", (req, res) => {
    res.status(200).sendFile(__dirname + "/public/register.html");
})

app.post("/register", function (req, res) {
    const { name, email, password } = req.body;
    try {
        fs.readFile(__dirname + "/userDetail.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)
            let todos = JSON.parse(data);
            let isFinded = false;
            todos.map((val) => {
                if (val.email === email)
                    isFinded = true;
            })

            if (isFinded) {
                res.status(400).json({ msg: "User already exists" });
                return;
            }
            else
                todos.push({ "name": name, "email": email, "password": password });


            fs.writeFile("./userDetail.mp4", JSON.stringify(todos), function (error) {
                if (error)
                    res.status(400).json({ msg: "Something went wrong in Writefile module" });
                else
                    res.status(200).json({ msg: "Succesfully created user" });
            });

        });
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