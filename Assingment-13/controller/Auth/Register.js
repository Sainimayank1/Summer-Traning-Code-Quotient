import { User , Token } from "../../db.js";
import crypto from "crypto";
import sendMail from "../../utlis/sendEmial.js"

async function Register (req, res) {
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

}

export default Register