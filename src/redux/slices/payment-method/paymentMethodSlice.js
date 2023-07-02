import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import axiosClient from "../../../utils/axiosClient";

// initialState
const initialState = {
    paymentMethods: [],
    loading: false,
    paymentMethod: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create payment method action
export const createPaymentMethodAction = createAsyncThunk(
    "payment-method/create", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, description } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await axiosClient.post(`${baseURL}/payment-method`, {
                name, description
            }, config)
            SweetAlert({ icon: "success", title: "Success", message: "Payment created successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })
// update payment method action
export const updatePaymentMethodAction = createAsyncThunk(
    "payment-method/update", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, description, id } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            const { data } = await axios.put(`${baseURL}/payment-method/${id}`, { name, description }, config)
            SweetAlert({ icon: "success", title: "Success", message: "Payment method updated successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })

// fetch payment method action
export const fetchPaymentMethodAction = createAsyncThunk(
    "payment-method/fetch-all", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axiosClient.get(`${baseURL}/payment-method`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })
// delete payment method action
export const deletePaymentMethodAction = createAsyncThunk(
    "payment-method/delete", async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.delete(`${baseURL}/payment-method/${id}`)
            SweetAlert({ icon: "success", title: "Success", message: "Payment method deleted successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })
// slice
const PaymentMethodSlice = createSlice({
    name: "payment-method",
    initialState,
    extraReducers: (builder) => {
        // create category
        builder.addCase(createPaymentMethodAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createPaymentMethodAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.paymentMethods = action.payload;
        })
        builder.addCase(createPaymentMethodAction.rejected, (state, action) => {
            state.loading = false;
            state.paymentMethods = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // update payment method
        builder.addCase(updatePaymentMethodAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updatePaymentMethodAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.paymentMethod = action.payload;
        })
        builder.addCase(updatePaymentMethodAction.rejected, (state, action) => {
            state.loading = false;
            state.paymentMethod = null;
            state.error = action.payload;
            state.isUpdated = false;
        })
        // fetch all payment method
        builder.addCase(fetchPaymentMethodAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchPaymentMethodAction.fulfilled, (state, action) => {
            state.loading = false;
            state.paymentMethods = action.payload;
        })
        builder.addCase(fetchPaymentMethodAction.rejected, (state, action) => {
            state.loading = false;
            state.paymentMethods = null;
            state.error = action.payload;
        })
        // delete payment-method
        builder.addCase(deletePaymentMethodAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(deletePaymentMethodAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isDeleted = true;
        })
        builder.addCase(deletePaymentMethodAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isDeleted = false;

        })
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
            state.isUpdated = false;
            state.isDeleted = false
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })
    }
})

// generate reducer
export const PaymentMethodReducer = PaymentMethodSlice.reducer;