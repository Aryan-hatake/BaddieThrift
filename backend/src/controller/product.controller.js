import { uploadToImageKit } from "../services/imageKit.service.js";
import productModel from "../model/product.model.js";

async function createProduct(req, res) {
  if (!req.isSeller)
    return res.status(403).json({
      success: false,
      message: "forbidden route",
    });

  const { title, description, price_Amount, price_Currency } = req.body;

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
  });

  res.status(201).json({
    success:true,
    message:"product created successfully",
    product
  })
}

export default { createProduct };
