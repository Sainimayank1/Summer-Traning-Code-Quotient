import { Product } from "../../db.js";

async function UpdateProduct (req, res)  {
    const { oldElement, newElement } = req.body;
    const { _id } = oldElement
    try {
        const isUpdate = await Product.updateOne({ _id }, { title: newElement.title, description: newElement.description, price: newElement.price, quantity: newElement.quantity });
        if (isUpdate)
            return res.status(200).json({ msg: "Successfully Update" })

    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}

export default UpdateProduct