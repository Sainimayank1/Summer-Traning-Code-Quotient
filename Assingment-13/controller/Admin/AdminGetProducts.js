import { Product } from "../../db.js";

async function AdminGetProducts (req, res) {

    try {
        const data = await Product.find()
        return res.status(200).json({ data })

    } catch (error) {
        return res.status(500).json({ error });
    }
}

export default AdminGetProducts