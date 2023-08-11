import { User } from "../../db.js";

async function Login(req, res) {
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
                req.session.isAdmin = isFinded.isAdmin;
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
}

export default Login