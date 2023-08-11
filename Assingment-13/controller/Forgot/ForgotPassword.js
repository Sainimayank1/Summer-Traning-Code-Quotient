import sendForgotEmail from "../../utlis/sendForgotEmail.js";
import { User } from "../../db.js";

async function ForgotPassword (req, res)  {
    const { email } = req.body;

    try {
        const isFinded = await User.findOne({ email });
        if (isFinded) {
            const email_url = `http://localhost:8000/forgot/${isFinded._id}`;
            sendForgotEmail(email, email_url);
            res.status(200).json({ msg: "Email send succesfully" });
        }
        else {
            res.status(400).json({ msg: "Email Not Found" });
        }
    } catch (error) {
        res.render("404")
    }
}

export default ForgotPassword