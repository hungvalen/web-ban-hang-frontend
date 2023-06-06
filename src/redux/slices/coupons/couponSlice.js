import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
// initialState
const initialState = {
    coupons: [],
    loading: false,
    coupon: null,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create coupon action
export const createCouponAction = createAsyncThunk(
    "coupon/create", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { code, discount, startDate, endDate } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${baseURL}/coupons`, {
                code, discount, startDate, endDate
            }, config)
            SweetAlert({ icon: "success", title: "Success", message: 'Coupon add successfully' });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })


export const updateCouponAction = createAsyncThunk(
    "coupon/update", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { code, discount, startDate, endDate, id } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`${baseURL}/coupons/update/${id}`, {
                code, discount, startDate, endDate
            }, config)
            SweetAlert({ icon: "success", title: "Success", message: 'Coupon update successfully' });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
export const deleteCouponAction = createAsyncThunk(
    "coupon/delete", async (id, { rejectWithValue, getState, dispatch }) => {
        try {

            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.delete(`${baseURL}/coupons/delete/${id}`, config)
            SweetAlert({ icon: "success", title: "Success", message: 'Coupon delete successfully' });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })

// fetch coupons action
export const fetchCouponsAction = createAsyncThunk(
    "coupons/fetch-all", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${baseURL}/coupons`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })

// fetch single coupon action
export const fetchSingleCouponAction = createAsyncThunk(
    "coupons/single", async (code, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${baseURL}/coupons/single?code=${code}`, { code })
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
// slice
const couponSlice = createSlice({
    name: "coupons",
    initialState,
    extraReducers: (builder) => {
        // create category
        builder.addCase(createCouponAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.coupons = action.payload;
        })
        builder.addCase(createCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.coupons = null;
            state.error = action.payload;
            state.isAdded = false;
        })

        // update coupon
        builder.addCase(updateCouponAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.coupon = action.payload;
        })
        builder.addCase(updateCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.coupon = null;
            state.error = action.payload;
            state.isUpdated = false;
        })

        // delete coupon
        builder.addCase(deleteCouponAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(deleteCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isDeleted = true;
        })
        builder.addCase(deleteCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isDeleted = false;
        })
        // fetch all coupons
        builder.addCase(fetchCouponsAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchCouponsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.coupons = action.payload;
            // state.products.push(action.payload);
        })
        builder.addCase(fetchCouponsAction.rejected, (state, action) => {
            state.loading = false;
            state.coupons = null;
            state.error = action.payload;
        })

        // fetch single coupon
        builder.addCase(fetchSingleCouponAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchSingleCouponAction.fulfilled, (state, action) => {
            state.loading = false;
            state.coupon = action.payload;
            // state.products.push(action.payload);
        })
        builder.addCase(fetchSingleCouponAction.rejected, (state, action) => {
            state.loading = false;
            state.coupon = null;
            state.error = action.payload;
        })
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
            state.isUpdated = false;
            state.isDeleted = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })
    }
})

// generate reducer
export const couponReducer = couponSlice.reducer;