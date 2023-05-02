import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
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

            const { data } = await axios.post(`${baseURL}/categories`, formData, config)
            SweetAlert({ icon: "success", title: "Success", message: "Category created successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

            return rejectWithValue(error.response.data);
        }
    })

// create category action
export const fetchCategoriesAction = createAsyncThunk(
    "category/fetch-all", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${baseURL}/categories`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oop", message: `${error.response.data.message}` });

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
            state.categories = action.payload;
        })
        builder.addCase(createCategoryAction.rejected, (state, action) => {
            state.loading = false;
            state.categories = null;
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
        })
        builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
            state.loading = false;
            state.categories = null;
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
export const categoryReducer = categorySlice.reducer;