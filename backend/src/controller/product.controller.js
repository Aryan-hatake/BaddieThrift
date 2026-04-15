import { uploadToImageKit } from "../services/imageKit.service.js";
import productModel from "../model/product.model.js";

async function createProduct(req, res) {
  if (!req.isSeller)
    return res.status(403).json({
      success: false,
      message: "forbidden route",
    });
  console.log(req.files)
  const { title, description, price: { price_Amount, price_Currency }, stock, sku, status } = req.body;

  const photos = req.files;

  const uploadedPhotos = await Promise.all(
    photos.map(async (e) => {
      return uploadToImageKit(e.originalname, e.buffer);
    }),
  );

  const product = await productModel.create({
    seller: req.userId,
    title,
    description,
    price: {
      amount: price_Amount,
      currency: price_Currency,
    },
    images: uploadedPhotos,
    stock,
    sku,
    status
  });

  res.status(201).json({
    success: true,
    message: "product created successfully",
    product
  })
}

async function getAllSellerProducts(req, res) {
  if (!req.isSeller)
    return res.status(403).json({
      success: false,
      message: "forbidden route",
    });

  const allProducts = await productModel.find({ seller: req.userId })

  res.status(200).json({
    success: false,
    message: "Hey seller! all your products fetched successfully",
    allProducts
  })
}

export default { createProduct, getAllSellerProducts };
