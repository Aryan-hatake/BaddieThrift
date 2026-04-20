import { userCart, createCart } from "../dao/cart.dao.js";
import productModel from "../model/product.model.js";
import cartModel from "../model/cart.model.js";
async function getCart(req, res) {
  try {
    const cart = await userCart(req.userId);
    if (!cart) {
      await createCart(req.userId);
      return res.status(201).json({
        success: true,
        message: "cart is empty",
        cart: null,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "cart fetched successfully",
        cart,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function addToCart(req, res) {
  try {
    const { productId, variantId, quantity=1 } = req.body;

    const productExist = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!productExist) {
      return res.status(404).json({
        success: false,
        message: "product does not exist",
      });
    }

    const cart = await userCart(req.userId);

    const itemAlreadyExist = cart.items.some((e, i) => {
      return (
        productId === e.product._id.toString() &&
        variantId === e.variant._id.toString()
      );
    });

    let newCart;
    console.log(productExist.stock);

    if (itemAlreadyExist) {
      newCart = cart.items.map((e, i) => {
        let newQty = e.quantity;
       
        if (
          productId === e.product._id.toString() &&
          variantId === e.variant.toString()
        ) {
          console.log( e.quantity , quantity , productExist.stock)
          newQty =
            e.quantity + quantity < productExist.stock
              ? (e.quantity += quantity)
              : e.quantity;
        }
        return { ...e.toObject(), quantity: newQty };
      });

      const temp = await cartModel.updateOne(
        { user: req.userId },
        {
          $set: {
            items: newCart,
          },
        },
      );
    } else {
       await cartModel.updateOne(
        { user: req.userId },
        {
          $push: {
            items: {
              product: productId,
              variant: variantId,
              quantity: quantity,
            },
          },
        },
        { upsert: true },
      );
    }

    return res.status(200).json({
      success: true,
      message: "item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
  }
}

export default { getCart, addToCart };
