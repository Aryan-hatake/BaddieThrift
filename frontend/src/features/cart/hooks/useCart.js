import {
    setCartItems,
    setError,
    setLoading,
    removeItemFromCart,
    updateItemQuantity,
    setAddCart,
} from "../store/cart.slice";
import { useDispatch } from "react-redux";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
} from "../services/cart.api";

export const useCart = () => {
    const dispatch = useDispatch();

    const handleGetCart = async () => {
        try {
            dispatch(setLoading(true));
            const data = await getCart();
            dispatch(setCartItems(data.cart.items));
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
            dispatch(removeItemFromCart({productId,variantId}));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message ?? err.message));
            // Re-fetch to restore correct state on failure
            handleGetCart();
        }
    };

    const handleUpdateQuantity = async (productId, variantId, quantity) => {
        
        // Optimistic update
        dispatch(updateItemQuantity({ productId, variantId, quantity }));
        try {

            const data = await updateCartItem(productId, variantId, quantity);
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