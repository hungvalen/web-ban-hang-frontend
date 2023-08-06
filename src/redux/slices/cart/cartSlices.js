import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
// initialState
const initialState = {
    cartItems: [],
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// add product to cart action
export const addOrderToCartAction = createAsyncThunk(
    "cart/add-to-cart", async (cartItem) => {
        const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
        // push to storage
        cartItems.push(cartItem);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

    })

export const cartItemsFromLocalStorageAction = createAsyncThunk(
    "cart/get-order-items", async () => {
        const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
        return cartItems;

    })

export const changeOrderItemQty = createAsyncThunk(
    "cart/change-item-qty", async ({ productID, qty, size, color }) => {
        const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
        const newCartItems = cartItems?.map(item => {
            if (item?._id?.toString() === productID?.toString() && item.size === size && item.color === color) {
                const newQty = +qty
                const newPrice = item?.price * newQty;
                item.qty = newQty;
                item.totalPrice = newPrice;
                // console.log("newPrice", newPrice)
            }
            return item;
        });
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    })

export const removeOrderItemQty = createAsyncThunk(
    "cart/removeOrderItem", async ({ productID,size,color }) => {
        const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];
        const newItems = cartItems?.filter(item => {
            if (
                (item._id.toString() === productID.toString() &&
                (item.size !== size || item.color !== color)) ||
                (item._id.toString() !== productID.toString() )
            ) {
                return true; // Keep the item in the cart
            }
            return false; // Remove the item from the cart
        });
        localStorage.setItem("cartItems", JSON.stringify(newItems));
    })


// slice
const cartSlice = createSlice({
    name: "cart",
    initialState,
    extraReducers: (builder) => {
        // add to cart
        builder.addCase(addOrderToCartAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(addOrderToCartAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.cartItems = action.payload;
        })
        builder.addCase(addOrderToCartAction.rejected, (state, action) => {
            state.loading = false;
            state.cartItems = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // fetch cart items from local storage
        builder.addCase(cartItemsFromLocalStorageAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(cartItemsFromLocalStorageAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.cartItems = action.payload;
        })
        builder.addCase(cartItemsFromLocalStorageAction.rejected, (state, action) => {
            state.loading = false;
            state.cartItems = null;
            state.error = action.payload;
            state.isAdded = false;
        })
    }
})

// generate reducer
export const cartReducer = cartSlice.reducer;