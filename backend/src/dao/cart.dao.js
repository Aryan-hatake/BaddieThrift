import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { ObjectId } from "mongodb";
export async function createCart(userId) {
  try {
    const cart = await cartModel.create({ user: userId });
    return cart;
  } catch (error) {
    console.log(error);
  }
}

export async function findVariant(productId, variantId) {
  try {
    const product = await productModel.findOne({ _id: productId });

    const matchedVariant = product?.variants?.find(
      (v) => v._id.toString() === variantId.toString(),
    );

    return matchedVariant;
  } catch (err) {
    console.log(err);
  }
}

export async function userCart(userId) {
  try {
    let cart = await cartModel.aggregate([
      {
        $match: {
          user: new ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$items",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },
      {
        $unwind: {
          path: "$items.product",
        },
      },
      {
        $unwind: {
          path: "$items.product.variants",
        },
      },
      {
        $match: {
          $expr: {
            $eq: ["$items.variant", "$items.product.variants._id"],
          },
        },
      },
      {
        $addFields: {
          totalProductPrice: {
            $multiply: [
              "$items.quantity",
              "$items.product.variants.price.priceAmount",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalCartPrice: {
            $sum: "$totalProductPrice",
          },
          currency: {
            $first: "$items.product.variants.price.priceCurrency",
          },
          items: {
            $push: "$items",
          },
        },
      },
    ]);

    return cart[0];
  } catch (error) {
    throw error;
  }
}
