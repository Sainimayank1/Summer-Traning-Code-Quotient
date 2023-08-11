import { Product } from "../../db.js";

async function CartGetProduct(req,res)
{
    try {
        const isFind = await Product.findOne({_id:req.body.data});
        if(isFind)
            res.status(200).json({msg:isFind});
    } catch (error) {
        res.status(400)
    }
}

export default CartGetProduct