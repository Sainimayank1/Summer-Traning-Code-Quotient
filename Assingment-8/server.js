import express, { urlencoded } from "express"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from "express-session";
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const upload = multer({dest:"upload/"})

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


app.get("/dashboard", (req, res) => {
    if (req.session.isLoggedIn) {
        const { useremail } = req.session;
        try {
            fs.readFile(__dirname + "/todoData.mp4", 'utf8', function (err, data) {
                if (err)
                    res.status(400).json(err)
                if (data.length === 0) {
                    data = "[]";
                }
                let todos = JSON.parse(data);

                const newdata = todos.filter((val) => {
                    return val.useremail === useremail;
                })
                if (newdata)
                    res.render("dashboard", { username: req.session.username, useremail: req.session.useremail , data: newdata})
            });
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

app.post("/login", function (req, res) {
    const { email, password } = req.body;
    try {
        fs.readFile(__dirname + "/userDetail.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)
            let todos = JSON.parse(data);
            let isFinded = false;
            let userName = "";
            let userEmail = "";
            todos.map((val) => {
                if (val.email === email && val.password === password) {
                    isFinded = true;
                    userName = val.name;
                    userEmail = val.email;
                }
            })
            if (isFinded) {
                req.session.isLoggedIn = true;
                req.session.username = userName;
                req.session.useremail = userEmail;
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
    res.status(200).render("register");
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

app.post("/register", function (req, res) {
    const { name, email, password } = req.body;
    try {
        fs.readFile(__dirname + "/userDetail.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)
            if (data.length === 0) {
                data = "[]";
            }
            let todos = JSON.parse(data);
            todos.map((val) => {
                if (val.email === email)
                    res.status(200).redirect('/login')
            })
            todos.push({ "name": name, "email": email, "password": password });
            fs.writeFile("./userDetail.mp4", JSON.stringify(todos), function (error) {
                if (error)
                    res.status(403);
                else
                    res.status(200).redirect('/login')
            });

        });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

});

app.post("/addTodo", async (req, res) => {
    if(!req.session.isLoggedIn)
        res.redirect("/login")
    const id = uuidv4();
    try {
        fs.readFile(__dirname + "/todoData.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)
            if (data.length === 0) {
                data = "[]";
            }
            let todos = JSON.parse(data);
            todos.push({ "name": req.session.username, "title": req.body.title, "isDone": false, "id": id, "useremail": req.session.useremail , "image":req.file.filename});
            fs.writeFile("./todoData.mp4", JSON.stringify(todos), function (error) {
                if (error)
                    res.status(400).json(err);
                else
                    res.redirect("/dashboard")
            });

        });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.get("/todos", (req, res) => {
    const { useremail } = req.query;

    try {
        fs.readFile(__dirname + "/todoData.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)
            if (data.length === 0) {
                data = "[]";
            }
            let todos = JSON.parse(data);

            const newdata = todos.filter((val) => {
                return val.useremail === useremail;
            })
            if (newdata)
                res.status(200).json({ data: newdata });
        });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.delete("/", async (req, res) => {
    const { id } = req.body;
    try {
        fs.readFile(__dirname + "/todoData.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)

            let todos = JSON.parse(data);

            const newdata = todos.filter((val) => {
                return val.id !== id;
            })
            fs.writeFile("./todoData.mp4", JSON.stringify(newdata), function (error) {
                if (error)
                    res.status(400).json(err);
                else
                    res.status(200).json({
                        msg: "Succesfully Delete"
                    })
            });
        });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

app.post("/markTodo", async (req, res) => {
    const { id, isDone } = req.body;

    try {
        fs.readFile(__dirname + "/todoData.mp4", 'utf8', function (err, data) {
            if (err)
                res.status(400).json(err)

            let todos = JSON.parse(data);
            const newdata = todos.map((val) => {
                if (val.id === id)
                    val.isDone = !val.isDone;

                return val;
            })

            fs.writeFile("./todoData.mp4", JSON.stringify(newdata), function (error) {
                if (error)
                    res.status(400).json(err);
                else
                    res.status(200).json({
                        msg: "Succesfully Update"
                    })
            });
        });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})




app.listen(8000, () => {
    console.log("App listining on port 8000")
})