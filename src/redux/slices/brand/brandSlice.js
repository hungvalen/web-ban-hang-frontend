import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
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
            const { data } = await axios.post(`${baseURL}/api/brands`, {
                name,
            }, config)
            Swal.fire({
                icon: "success",
                title: "Brand created successfully",
                showConfirmButton: false,
                timer: 3500,
            });
            return data;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            })
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
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            })
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
            // state.products.push(action.payload);
        })
        builder.addCase(createBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brand = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // fetch all category
        builder.addCase(fetchBrandAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchBrandAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brands = action.payload;
            // state.products.push(action.payload);
        })
        builder.addCase(fetchBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brands = null;
            state.error = action.payload;
        })
    }
})

// generate reducer
export const brandReducer = brandSlice.reducer;