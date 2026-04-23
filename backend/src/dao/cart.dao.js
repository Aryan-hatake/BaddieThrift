import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";

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
    let cart =
      (await cartModel.findOne({ user: userId }).populate("items.product")) ||
      (await cartModel.create({ user: userId }));

    const newItems = await Promise.all(
      cart.items.map(async (product) => {
        const variant = await findVariant(
          product?.product._id,
          product.variant,
        );
        const plainProduct = product.toObject();
        plainProduct.variant = variant;
        return plainProduct;
      }),
    );
    const newCart = cart.toObject();

    newCart.items = newItems;

    return newCart;
  } catch (error) {
    throw error;
  }
}
