import { Token , User} from "../../db.js";

async function EmailVerification (req, res)  {
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
}

export default EmailVerification


