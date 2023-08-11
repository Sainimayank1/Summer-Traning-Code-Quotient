import express from "express"
import { db, Product, User, Token } from "./db.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from "express-session";
import multer from "multer";

import Login from "./controller/Auth/Login.js";
import Register from "./controller/Auth/Register.js";
import AddProducts from "./controller/Admin/AddProducts.js";
import AdminGetProducts from "./controller/Admin/AdminGetProducts.js";
import DeleteProduct from "./controller/Admin/DeleteProduct.js";
import UpdateProduct from "./controller/Admin/UpdateProduct.js";
import CartGetProduct from "./controller/Cart/CartGetProduct.js";
import GetProducts from "./controller/Products/GetProducts.js";
import EmailVerification from "./controller/Email/EmailVerification.js";
import Logout from "./controller/Auth/Logout.js";
import GetLogin from "./controller/Auth/GetLogin.js";
import ForgotPassword from "./controller/Forgot/ForgotPassword.js";
import ResetPassword from "./controller/Forgot/ResetPassword.js";
import Dashboard from "./controller/Dashboard/Dashboard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const upload = multer({ dest: "upload/" })


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
app.get("/admin", async (req, res) => {
    if (req.session.isAdmin) {
        res.render("admin",{ username: req.session.username, isAdmin: req.session.isAdmin });
    }
    else
        res.redirect("/login")
})
app.post("/addProduct",AddProducts)
app.get("/adminGetProducts",AdminGetProducts)
app.post("/deleteProduct",DeleteProduct)
app.post("/updateProduct",UpdateProduct)


//      Cart
app.get("/cart", async (req, res) => {
    if (req.session.isLoggedIn) {
        res.render("cart",{ username: req.session.username, isAdmin: req.session.isAdmin });
    }
    else
    res.redirect("/login")
})
app.post("/cartGetProduct",CartGetProduct)


//      Dashboard
app.get("/dashboard", Dashboard)
app.get("/getProducts/:page",GetProducts)


//      Auth
app.get("/login",GetLogin)
app.post("/login",Login);

app.get("/register", (req, res) => {
    res.status(200).render("register");
})
app.post("/register",Register);
app.get("/logout",Logout)



//                      Email Verification
app.get("/users/:id/verify/:tid",EmailVerification)


//              Forgot 
app.get("/forgot", (req, res) => {
    res.render("forgotPassword")
})
app.post("/forgot",ForgotPassword)


//      Reset 
app.get("/forgot/:id", async (req, res) => {
    res.render("passwordReset")
})
app.post("/forgot/:id",ResetPassword)


app.listen(8000, () => {
    console.log("App listining on port 8000")
})