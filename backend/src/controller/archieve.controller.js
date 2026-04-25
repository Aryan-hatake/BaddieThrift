import Product from "../model/product.model.js";
import ArchivedProductModel from "../model/archieve.model.js";
import { findVariant } from "../dao/cart.dao.js";

export async function addToArchive(req,res){
    try {
        const {productId , variantId} = req.body;
        const product = await Product.findById(productId);
        const variant = product?.variants.find(item=>item._id.toString() === variantId.toString());
        if(!variant){
            return res.status(404).json({message:"Product not found"});
        }
        const alreadyarchived = await ArchivedProductModel.findOne({
            product:productId,
            user:req.userId,
            variant:variantId
        });
        if(alreadyarchived){
            return res.status(409).json({message:"Product already archived"});
        }
        const archivedProduct = await ArchivedProductModel.create({
            product,
            user:req.userId,
            variant:variantId
        });
        res.status(200).json({message:"Product archived successfully",archivedProduct});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

export async function getAllArchivedProducts(req,res){
    try {
      
        const archivedProducts = await ArchivedProductModel.find({user:req.userId}).populate("product");
        const newArchieve = await Promise.all(archivedProducts.map(async(item)=>{
            const variant = await findVariant(item.product._id,item.variant);    
            const plainProduct = item.toObject();
            plainProduct.variant = variant;
            return plainProduct;
        }))
        
        res.status(200).json({message:"Archived products fetched successfully",items:newArchieve});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
export  async function removeFromArchive(req,res){
    try {
        const {productId , variantId} = req.params;
        console.log(productId , variantId , req.userId)
        const archivedProduct = await ArchivedProductModel.findOneAndDelete({
            product:productId,
            user:req.userId,
            variant:variantId
        });
        console.log(archivedProduct)
        res.status(200).json({message:"Product removed from archive successfully",archivedProduct});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

export default {
    addToArchive,
    getAllArchivedProducts,
    removeFromArchive
}