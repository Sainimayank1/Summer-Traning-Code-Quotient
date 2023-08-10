import express from "express"
import { db, Product, User, Token } from "./db.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from "express-session";
import multer from "multer";
import crypto from "crypto";
import sendMail from "./utlis/sendEmial.js"
import sendForgotEmail from "./utlis/sendForgotEmail.js"
import changeSuccesfully from "./utlis/changeSuccesfully.js"

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


//      Products 
app.get("/addProduct", async (req, res) => {
    res.render("addProduct");
})

app.post("/addProduct", async (req, res) => {
    const { title, description, price } = req.body;
    const image = req.file.filename
    try {
        const isCreated = await Product.create({ title, description, price, image });
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
    let perPage = 5;
    let skip = (page * perPage);
    try {
        const data = await Product.find().skip(skip)
            .limit(perPage)
            .sort({ updateAt: -1 });
        page++;
        return res.status(200).json({ data })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error });
    }
})

//      Cart

app.get("/cart",async(req,res)=>
{
    if (req.session.isLoggedIn) {
        res.render("cart");
    }
    else
        res.redirect("/login")
})


//      Dashboard
app.get("/dashboard", async (req, res) => {
    page = 0;
    if (req.session.isLoggedIn) {
        try {
            res.render("dashboard", { username: req.session.username })
        } catch (error) {
            res.redirect("/login")
        }
    }
    else
        res.redirect("/login")
})


//      Login
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
            if (isFinded.isVerified) {
                req.session.isLoggedIn = true;
                req.session.username = isFinded.name;
                req.session.useremail = isFinded.email;
                res.redirect("/dashboard")
            }
            else
                res.status(400).json({ msg: "Please verify yourself" });
        }
        else
            res.status(400).json({ msg: "User or password are wrong" });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }


});


//                          Register
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
        let TokenRes;
        try {
            TokenRes = await Token.create({
                userId: isCreated._id,
                token: crypto.randomBytes(32).toString("hex"),
            });
        } catch (error) {
            res.status(200).json({ error });
        }

        const email_url = `http://localhost:8000/users/${isCreated.id}/verify/${TokenRes.token}`;
        sendMail(email, email_url);


        if (!isCreated)
            res.status(400).json({ msg: "Something went wrong in Writefile module" });
        else
            res.status(200).json({ msg: "Succesfully created user" });
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }

});



//                      Email Verification
app.get("/users/:id/verify/:tid", async (req, res) => {
    const { id, tid } = req.params;
    try {
        const isFinded = await Token.findOne({ token: tid, userId: id });
        if (isFinded) {
            await Token.deleteOne({ token: tid })
            const isUpdated = await User.updateOne({ _id: id }, { isVerified: "true" });
            if (isUpdated)
                res.render("successfulyVerified")

        }
        else {
            console.log("yaha hue gadbad2")
            res.render("404")
        }
    } catch (error) {
        console.log(error)
        res.render("someThingWrong")
    }
})


app.get("/logout", (req, res) => {
    if (req.session.isLoggedIn) {
        req.session.destroy((err) => {
            if (!err)
                res.redirect("/login")
        })
    }
})


//              Forgot page

app.get("/forgot", (req, res) => {
    res.render("forgotPassword")
})

app.post("/forgot", async (req, res) => {
    const {email} = req.body;

    try {
        const isFinded = await User.findOne({email});
        if(isFinded)
        {
            const email_url = `http://localhost:8000/forgot/${isFinded._id}`;
            sendForgotEmail(email, email_url);
            res.status(200).json({ msg: "Email send succesfully" });
        }
        else
        {
            res.status(400).json({ msg: "Email Not Found" });
        }
    } catch (error) {
        res.render("404")
    }
})


//      Reset page 
app.get("/forgot/:id",async(req,res)=>
{
    res.render("passwordReset")
})

app.post("/forgot/:id",async(req,res)=>
{
    const {id} = req.params;
    
    try {

        const isFinded = await User.findOne({_id:id});
        if(isFinded)
        {
            const isUpdated = await User.updateOne({_id:id},{password:req.body.password});
            if(isUpdated)
            {
                changeSuccesfully(isFinded.email);
                res.status(200).json({ msg: "Password update successfully" });
            }
            else
                res.status(400).json({ msg: "Something went wrong" });
        }
        else    
            res.status(400).json({ msg: "User Not Found" });
        
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
})




app.listen(8000, () => {
    console.log("App listining on port 8000")
})