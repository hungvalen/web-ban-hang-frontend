import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import {Swal} from "sweetalert2"
// initialState
const initialState = {
    products: [],
    loading: false,
    product: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create product action
export const createProductAction = createAsyncThunk(
    "product/create", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, description, category, sizes, brand, colors, price, } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${baseURL}/product/create`, {
                name,
                description,
                category,
                sizes,
                price,
                brand,
                colors,
            },config)
            Swal.fire({
                icon: "success",
                title: "Product created successfully",
                showConfirmButton: false,
                timer: 1500,
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
// slice
const productSlice = createSlice({
    name: "product",
    initialState,
    extraReducers:(builder) => {
        // create product
        builder.addCase(createProductAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.product = action.payload;
            state.products.push(action.payload);
        })
        builder.addCase(createProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.error = action.payload;
            state.isAdded = false;
        })
    }
})

// generate reducer
export const productReducer = productSlice.reducer;