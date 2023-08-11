import { Product } from "../../db.js";


async function DeleteProduct (req, res){
    try {
        const isDelete = await Product.deleteOne({ _id: req.body._id })
        if (isDelete)
            res.status(200).json({ msg: "Successfully Deleted" });
    } catch (error) {
        res.status(400).json({ mgs: error });
    }
}

export default DeleteProduct