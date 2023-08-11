import { User } from "../../db.js";
import changeSuccesfully from "../../utlis/changeSuccesfully.js";

async function ResetPassword (req, res) {
    const { id } = req.params;

    try {

        const isFinded = await User.findOne({ _id: id });
        if (isFinded) {
            const isUpdated = await User.updateOne({ _id: id }, { password: req.body.password });
            if (isUpdated) {
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
}

export default ResetPassword