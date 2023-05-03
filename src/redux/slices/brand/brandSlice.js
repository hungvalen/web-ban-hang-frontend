import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
// initialState
const initialState = {
    brands: [],
    loading: false,
    brand: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create brand action
export const createBrandAction = createAsyncThunk(
    "brand/create", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${baseURL}/brands`, {
                name,
            }, config)
            SweetAlert({ icon: "success", title: "Success", message: "Brand created successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })

// create brand action
export const fetchBrandAction = createAsyncThunk(
    "brand/fetch-all", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${baseURL}/brands`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
// slice
const brandSlice = createSlice({
    name: "brands",
    initialState,
    extraReducers: (builder) => {
        // create category
        builder.addCase(createBrandAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createBrandAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.brand = action.payload;
        })
        builder.addCase(createBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brand = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // fetch all brand
        builder.addCase(fetchBrandAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchBrandAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brands = action.payload;
        })
        builder.addCase(fetchBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brands = null;
            state.error = action.payload;
        })
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })
    }
})

// generate reducer
export const brandReducer = brandSlice.reducer;