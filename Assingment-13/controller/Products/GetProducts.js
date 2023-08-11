import { Product } from "../../db.js";

async function GetProducts(req, res)  {
    const {page} = req.params;
    let perPage = 5;
    let skip = ( page * perPage);
    try {
        const data = await Product.find().skip(skip)
            .limit(perPage)
            .sort({ updateAt: -1 });
        return res.status(200).json({ data })

    } catch (error) {
        return res.status(500).json({ error });
    }
}
export default GetProducts