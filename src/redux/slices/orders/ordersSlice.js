import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import SweetAlert from "../../../components/Playground/SweetAlert";
// initialState
const initialState = {
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
    orders: [],
    order: null,
    stats: null
}

// create product order action
export const placeOrderAction = createAsyncThunk(
    "order/place-order", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { orderItems, shippingAddress, totalPrice, paymentMethod } = payload;
            // make request
            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await axios.post(`${baseURL}/orders`,
                {
                    orderItems,
                    shippingAddress,
                    totalPrice,
                    paymentMethod
                }, config)

            SweetAlert({ icon: "success", title: "Success", message: "Order created successfully" });
            return data;
            return window.open(data.url);
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error.response.data.message });
            return rejectWithValue(error.response.data);
        }
    })

// fetch all order action
export const fetchOrdersAction = createAsyncThunk("orders/list", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.get(`${baseURL}/orders`, config);
        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        // return rejectWithValue(error?.response?.data);
    }
})

// fetch order detail action
export const fetchOrderAction = createAsyncThunk("orders/details", async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.get(`${baseURL}/orders/${productId}`, config);
        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})

// fetch order stats action
export const orderStaticsAction = createAsyncThunk("orders/statics", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.get(`${baseURL}/orders/sales/stats`, config);
        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})


// update order action
export const updateOrderAction = createAsyncThunk("orders/update-order", async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        const { status, id } = payload;
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.put(`${baseURL}/orders/update/${id}`, {
            status
        }, config);
        SweetAlert({ icon: "success", title: "Success", message: "Order updated successfully" });
        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})

// slice
const ordersSlice = createSlice({
    name: "orders",
    initialState,
    extraReducers: (builder) => {
        // create product
        builder.addCase(placeOrderAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(placeOrderAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.order = action.payload;
        })

        builder.addCase(placeOrderAction.rejected, (state, action) => {
            state.loading = false;
            state.order = null;
            state.error = action.payload;
            state.isAdded = false;
        })


        // fetch orders
        builder.addCase(fetchOrdersAction.pending, (state, action) => {
            state.loading = true;
        }
        )
        builder.addCase(fetchOrdersAction.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        }
        )
        builder.addCase(fetchOrdersAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.orders = null;
        }
        )

        // fetch order detail
        builder.addCase(fetchOrderAction.pending, (state, action) => {
            state.loading = true;
        }
        )
        builder.addCase(fetchOrderAction.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
        }
        )
        builder.addCase(fetchOrderAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.order = null;
        }
        )

        // stats order
        builder.addCase(orderStaticsAction.pending, (state, action) => {
            state.loading = true;
        }
        )
        builder.addCase(orderStaticsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.stats = action.payload;
        }
        )
        builder.addCase(orderStaticsAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.stats = null;
        }
        )

        // update order status
        builder.addCase(updateOrderAction.pending, (state, action) => {
            state.loading = true;
        }
        )
        builder.addCase(updateOrderAction.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
            state.isUpdated = true;
        }
        )
        builder.addCase(updateOrderAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.order = null;
            state.isUpdated = false;
        }
        )

        // reset success and error
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
            state.isUpdated = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })

    }
})

// generate reducer
export const orderReducer = ordersSlice.reducer;