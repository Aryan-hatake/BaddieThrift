import { userCart, createCart } from "../dao/cart.dao.js";
import productModel from "../model/product.model.js";
import cartModel from "../model/cart.model.js";

async function getCart(req, res) {
  try {
    const cart = await userCart(req.userId);
    const userCartExist = await cartModel.findOne({user:req.userId})
    if (!userCartExist) {
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
        cart: cart||null,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function addToCart(req, res) {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    const query = { _id: productId, "variants._id": variantId } 
    
    const productExist = await productModel.findOne(query);
    
    const variantExist = productExist.variants.find(
      (v) => v._id.toString() === variantId.toString()
    )

   

    if (!variantExist) {
      return res.status(404).json({
        success: false,
        message: "variant of product does not exist",
      });
    }

    const cart = await userCart(req.userId);

  

    const itemAlreadyExist = cart?.items.some((e, i) => {
  
        return (
          productId === e.product._id.toString() &&
          variantId === e.variant._id.toString()
        );
  
    });

    let newCart = [];
 

    if (itemAlreadyExist) {
      newCart = cart.items.map((e, i) => {
        let newQty = e.quantity;

        if (
            productId === e.product._id.toString() &&
            variantId === e.variant._id.toString() 
        ) {

          newQty =
            e.quantity + quantity < variantExist.stock
              ? (e.quantity += quantity)
              : e.quantity;
        }
        cart.items[i].quantity = newQty;
     
        return { ...e, quantity: newQty };
      });

      await cartModel.updateOne(
        { user: req.userId },
        {
          $set: {
            items: newCart,
          },
        },
      );
    } else {

      newCart.push({
        product: productId,
        variant: variantId,
        quantity: quantity,
      })
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

    const updatedCart = await userCart(req.userId);

    const addedItem = updatedCart.items?.find((e) => {
      return (
        productId === e.product._id.toString() &&
        variantId === e.variant._id.toString()
      );
    });


    return res.status(200).json({
      success: true,
      message: "item added to cart successfully",
      cart:addedItem,
    });
  } catch (error) {
    console.log(error);
  }
}

async function removeFromCart(req,res) {
  try {
    const {productId,variantId} = req.body
    const cart = await userCart(req.userId);
    
    const query = { _id: productId, "variants._id": variantId } 

    const productExist = await productModel.findOne(query);

    if(!productExist) {
      return res.status(404).json({
        success:false,
        message:"product does not exist"
      })
    }
    const itemExist = cart?.items.some((e, i) => {

        return (
          productId === e.product._id.toString() &&
          variantId === e.variant._id.toString()
        );
      
    });

    if(!itemExist) {
      return res.status(404).json({
        success:false,
        message:"item does not exist in cart"
      })
    }

    const newCart = cart.items.filter((e, i) => {

  
        return (
          productId !== e.product._id.toString() &&
          variantId !== e.variant.toString()
        );
      
    });

    await cartModel.updateOne(
      { user: req.userId },
      {
        $set: {
          items: newCart,
        },
      },
    );
    res.status(200).json({
      success:true,
      message:"item removed successfully",
      cart:newCart,
    })
  } catch (error) {
     console.log(error)
  }
}

async function updateCartItem(req,res) {
  try {
    const {productId,variantId,quantity} = req.body
    const cart = await userCart(req.userId);
    
    
    const query =  { _id: productId, "variants._id": variantId }

    const itemExist = cart.items.some((e, i) => {
        return (
          productId === e.product._id.toString() &&
          variantId === e.variant.toString()
        );
    
    });

    if(!itemExist) {
      return res.status(404).json({
        success:false,
        message:"item does not exist in cart"
      })
    }
    
    const productExist = await productModel.findOne(query);
    const productVariant = productExist.variants?.find(
      (v) => v._id.toString() === variantId.toString(),
    );
    const newCart = cart.items.map((e, i) => {
      let newQty = e.quantity;

      if (
          productId === e.product._id.toString() &&
          variantId === e.variant.toString() 
      ) {

        newQty =
          e.quantity + quantity < productVariant.stock
            ? (e.quantity += quantity)
            : e.quantity;
      }
      cart.items[i].quantity = newQty;
      return { ...e, quantity: newQty };
    });

    await cartModel.updateOne(
      { user: req.userId },
      {
        $set: {
          items: newCart,
        },
      },
    );
    
    res.status(200).json({
      success:true,
      message:"item updated successfully",
      cart:newCart,
    })
  } catch (error) {
     console.log(error)
  }
}


export default { getCart, addToCart , removeFromCart , updateCartItem };
