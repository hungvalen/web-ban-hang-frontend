import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
// initialState
const initialState = {
    categories: [],
    loading: false,
    category: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create category action
export const createCategoryAction = createAsyncThunk(
    "category/create", async (payload, { rejectWithValue, getState, dispatch }) => {
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
            const { data } = await axios.post(`${baseURL}/category`, {
                name,
            }, config)
            Swal.fire({
                icon: "success",
                title: "Category created successfully",
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

// create category action
export const fetchCategoriesAction = createAsyncThunk(
    "category/fetch-all", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${baseURL}/category`)
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
const categorySlice = createSlice({
    name: "categories",
    initialState,
    extraReducers: (builder) => {
        // create category
        builder.addCase(createCategoryAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createCategoryAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.category = action.payload;
            // state.products.push(action.payload);
        })
        builder.addCase(createCategoryAction.rejected, (state, action) => {
            state.loading = false;
            state.category = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // fetch all category
        builder.addCase(fetchCategoriesAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
            // state.products.push(action.payload);
        })
        builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
            state.loading = false;
            state.categories = null;
            state.error = action.payload;
        })
    }
})

// generate reducer
export const categoryReducer = categorySlice.reducer;