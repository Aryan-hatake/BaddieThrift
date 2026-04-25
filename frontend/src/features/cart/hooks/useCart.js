import {
  setCartItems,
  setError,
  setLoading,
  removeItemFromCart,
  updateItemQuantity,
  setAddCart,
  setCartPrice,
  setCartCurrency,
  setAddCartPrice,
  setDeductCartPrice,
} from "../store/cart.slice";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../services/cart.api";

export const useCart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleGetCart = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getCart();
      console.log(data);
      dispatch(setCartPrice(data.cart?.totalCartPrice));
      dispatch(setCartCurrency(data.cart?.currency));
      dispatch(setCartItems(data.cart?.items || []));
    } catch (err) {
      dispatch(setError(err?.response?.data?.message ?? err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddToCart = async (productId, variantId, quantity) => {
    try {
      dispatch(setLoading(true));
      const data = await addToCart(productId, variantId, quantity);
      console.log(data);
      dispatch(setAddCart(data.cart));
    } catch (err) {
      dispatch(setError(err?.response?.data?.message ?? err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRemoveFromCart = async (productId, variantId) => {
    // Optimistic update — remove immediately in UI
    dispatch(removeItemFromCart({ productId, variantId }));
    try {
      const data = await removeFromCart(productId, variantId);

      // Sync with server response if provided
      dispatch(removeItemFromCart({ productId, variantId }));
    } catch (err) {
      dispatch(setError(err?.response?.data?.message ?? err.message));
      // Re-fetch to restore correct state on failure
      handleGetCart();
    }
  };

  const handleUpdateQuantity = async (
    productId,
    variantId,
    quantity,
    price,
  ) => {
    // Optimistic update
    const item = cartItems.find((i) => {
      const pId = i.product?._id ?? i.product;
      const vId = i.variant?._id ?? i.variant;
      return pId === productId && vId === variantId;
    });
    dispatch(updateItemQuantity({ productId, variantId, quantity }));

    try {
      const data = await updateCartItem(productId, variantId, quantity);

      if (item.quantity !== data?.cart[0]?.quantity) {
        quantity > 0
          ? dispatch(setAddCartPrice(price))
          : dispatch(setDeductCartPrice(price));
      }
    } catch (err) {
      dispatch(setError(err?.response?.data?.message ?? err.message));
      handleGetCart();
    }
  };

  return {
    handleGetCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
  };
};
