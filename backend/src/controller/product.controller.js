import { uploadToImageKit } from "../services/imageKit.service.js";
import productModel from "../model/product.model.js";
import { findOneProduct , updateProduct , deleteProduct } from "../dao/product.dao.js";

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
  const filter = req.query;
  
  const query = {};

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
    variants: variants.map((e, i) => {
      const key = `variants[${i}]`;
      return {
        attribute:JSON.parse(JSON.stringify(e.attribute)),
        stock: e.stock || 0,
        price: e.price || {
          amount: product.price.amount,
          currency: product.price.currency,
        },
        images: variantImgs[key] || [],
      };
    }),
  });

    res.status(201).json({
      success:true,
      message: "product created successfully",
      product
    });
}

async function productDetails(req,res) {

  const {productId} = req.params
  if(!productId) return res.status(404).json({
    success:false,
    message:"product does not exist"
  })

  const product = await productModel.findById(productId)

    if(!product) return res.status(404).json({
    success:false,
    message:"product does not exist"
  })

  res.status(200).json({
    success:true,
    message:"product details fetched successfully",
    product
  })


}

async function updateOneProduct(req,res) {
    const {productId} = req.params
  
    const {title,description,price:{amount,currency},variants,stock,status,sku} = req.body

    
    const product = await findOneProduct(productId)

    if(!product || product.seller.toString() !== req.userId.toString()) return res.status(401).json({
        success:false,
        message:"unauthorized"
    })
    
    const variantImgs = {}
    for (const img of req.files) {
      if (!img.fieldname.startsWith("variant")) continue;

      const key = img.fieldname.split("[").slice(0, 2).join("[");

      if (!variantImgs[key]) {
        variantImgs[key] = [];
      }

      const uploaded = await uploadToImageKit(img.originalname, img.buffer);
      variantImgs[key].push(uploaded);
    }
    
    const productImages = req.files.filter((img, idx) =>
    img.fieldname.startsWith("images[]"),
  );
  let modifiedProductImages = []
    if(productImages.length>0){
    modifiedProductImages = await Promise.all(
    productImages.map((img, idx) => {
      return uploadToImageKit(img.originalname, img.buffer);
    }),
  );
  }
    const updated = await updateProduct(productId,{
      title:title || product.title,
      description:description || product.description,
      status:status || product.status,
      stock:stock || product.stock,
      sku:sku || product.sku,
      price: {
        amount: amount || product.price.amount,
        currency: currency || product.price.currency,
      },
      variants:variants.length !== 0 ? variants.map((e, i) => {
        const key = `variants[${i}]`;
        return {
          attribute:JSON.parse(JSON.stringify(e.attribute)),
          stock: e.stock || 0,
          price: e.price || {
            amount: e.price.amount || product.price.amount,
            currency: e.price.currency || product.price.currency,
          },
          images: variantImgs[key] || [],
        };
      }): product.variants,
      images:modifiedProductImages.length > 0 ? modifiedProductImages : product.images,
    })

    return res.status(200).json({
        success:true,
        message:"product updated successfully",
        updated
    })

    
    
}

async function deleteOneProduct(req,res) {
    const {productId} = req.params

    const product = await findOneProduct(productId)

    if(!product || product.seller.toString() !== req.userId.toString()) return res.status(401).json({
        success:false,
        message:"unauthorized"
    })

    const deleted = await deleteProduct(productId)
    return res.status(200).json({
        success:true,
        message:"product deleted successfully",
        deleted
    })
}

export default { getAllSellerProducts, getAllProducts, createProducts , productDetails , updateOneProduct , deleteOneProduct };
