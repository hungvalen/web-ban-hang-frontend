import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import axiosClient from "../../../utils/axiosClient";

// initialState
const initialState = {
    shippingUnits: [],
    loading: false,
    shippingUnit: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create shipping unit action
export const createShippingUnitAction = createAsyncThunk(
    "shipping-unit/create", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, file } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("file", file);

            const { data } = await axiosClient.post(`${baseURL}/shipping-unit`, formData, config)
            SweetAlert({ icon: "success", title: "Success", message: "Shipping created successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })
// update shipping unit action
export const updateShippingUnitAction = createAsyncThunk(
    "shipping-unit/update", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, file, id } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("file", file);

            const { data } = await axios.put(`${baseURL}/shipping-unit/${id}`, formData, config)
            SweetAlert({ icon: "success", title: "Success", message: "Shipping Unit updated successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })

// fetch shipping unit action
export const fetchShippingUnitAction = createAsyncThunk(
    "shipping-unit/fetch-all", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axiosClient.get(`${baseURL}/shipping-unit`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })
// delete shipping unit action
export const deleteShippingUnitAction = createAsyncThunk(
    "shipping-unit/delete", async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.delete(`${baseURL}/shipping-unit/${id}`)
            SweetAlert({ icon: "success", title: "Success", message: "Shipping unit deleted successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })
// slice
const shippingUnitSlice = createSlice({
    name: "shipping-unit",
    initialState,
    extraReducers: (builder) => {
        // create category
        builder.addCase(createShippingUnitAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createShippingUnitAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.shippingUnit = action.payload;
        })
        builder.addCase(createShippingUnitAction.rejected, (state, action) => {
            state.loading = false;
            state.shippingUnit = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // update shipping unit
        builder.addCase(updateShippingUnitAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateShippingUnitAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.shippingUnit = action.payload;
        })
        builder.addCase(updateShippingUnitAction.rejected, (state, action) => {
            state.loading = false;
            state.shippingUnit = null;
            state.error = action.payload;
            state.isUpdated = false;
        })
        // fetch all shipping unit
        builder.addCase(fetchShippingUnitAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchShippingUnitAction.fulfilled, (state, action) => {
            state.loading = false;
            state.shippingUnits = action.payload;
        })
        builder.addCase(fetchShippingUnitAction.rejected, (state, action) => {
            state.loading = false;
            state.shippingUnits = null;
            state.error = action.payload;
        })
        // delete shipping-unit
        builder.addCase(deleteShippingUnitAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(deleteShippingUnitAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isDeleted = true;
        })
        builder.addCase(deleteShippingUnitAction.rejected, (state, action) => {
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
export const shippingUnitReducer = shippingUnitSlice.reducer;