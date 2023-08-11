import { Product } from "../../db.js";

async function AddProducts (req, res){
    const { title, description, price, quantity } = req.body;
    const image = req.file.filename
    try {
        const isCreated = await Product.create({ title, description, price, quantity, image });
        if (!isCreated)
            res.status(400).json({ msg: "Something went wrong" });
        else
            res.redirect("/admin")
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

export default AddProducts