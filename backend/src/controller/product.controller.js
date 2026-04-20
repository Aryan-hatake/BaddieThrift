import { uploadToImageKit } from "../services/imageKit.service.js";
import productModel from "../model/product.model.js";

async function getAllSellerProducts(req, res) {
  if (!req.isSeller)
    return res.status(403).json({
      success: false,
      message: "forbidden route",
    });

  const allProducts = await productModel.find({ seller: req.userId });

  res.status(200).json({
    success: true,
    message: "Hey seller! all your products fetched successfully",
    allProducts,
  });
}

async function getAllProducts(req, res) {
  const filter = req.body;

  const query = { status: "active" };

  if (filter?.search) {
    query.$or = [
      { title: { $regex: filter?.search, $options: "i" } },
      { description: { $regex: filter?.search, $options: "i" } },
    ];
  }

  if (filter?.category && filter?.category !== "all") {
    query.category = filter?.category;
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { "price.amount": 1 },
    price_desc: { "price.amount": -1 },
  };
  const sortOption = sortMap[filter?.sort] ?? { createdAt: -1 };

  const skip = (Number(filter?.page) - 1) * Number(filter?.limit);
  const [products, total] = await Promise.all([
    productModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(filter?.limit ?? 12)),
    productModel.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
    total,
    page: Number(filter?.page ?? 1),
    totalPages: Math.ceil(total / Number(filter?.limit ?? 12)),
  });
}

async function createProducts(req, res) {
  if (!req.isSeller)
    return res.status(403).json({
      success: false,
      message: "forbidden",
    });
  const {
    title,
    description,
    sku,
    stock,
    price: { price_Amount, price_Currency },
    status,
    variants,
  } = req.body;

  const productImages = req.files.filter((img, idx) =>
    img.fieldname.startsWith("images[]"),
  );

  let variantImgs = {};

  for (const img of req.files) {
    if (!img.fieldname.startsWith("variant")) continue;

    const key = img.fieldname.split("[").slice(0, 2).join("[");

    if (!variantImgs[key]) {
      variantImgs[key] = [];
    }

    const uploaded = await uploadToImageKit(img.originalname, img.buffer);
    variantImgs[key].push(uploaded);
  }

  const modifiedProductImages = await Promise.all(
    productImages.map((img, idx) => {
      return uploadToImageKit(img.originalname, img.buffer);
    }),
  );

  const modifiedVariants = variants.map((e, i) => {
    const key = `variants[${i}]`;
    return {
      type: e.type,
      options: e.options || [],
      images: variantImgs[key] || null,
    };
  });

  console.log("TYPE:", typeof modifiedVariants);
  console.log("IS ARRAY:", Array.isArray(modifiedVariants));
  console.log("FIRST ITEM TYPE:", typeof modifiedVariants[0]);


  const product = await productModel.create({
    seller: req.userId,
    title,
    status,
    description,
    stock,
    sku,
    images: [...modifiedProductImages],
    price: {
      amount: price_Amount,
      currency: price_Currency,
    },
    variants: modifiedVariants,
  });

  console.log(product);
  //   res.status(200).json({
  //     message: "test 123",
  //   });
}

export default { getAllSellerProducts, getAllProducts, createProducts };
