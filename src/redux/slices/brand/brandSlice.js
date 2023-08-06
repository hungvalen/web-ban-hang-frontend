import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import axiosClient from "../../../utils/axiosClient";
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
            const { name,description, file } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("file", file);
            const { data } = await axiosClient.post(`${baseURL}/brands`, formData, config)
            SweetAlert({ icon: "success", title: "Success", message: "Tạo mới thương hiệu thành công" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
// edit brand action
export const editBrandAction = createAsyncThunk(
    "brand/edit", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name,description, file, id } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("file", file);
            const { data } = await axiosClient.put(`${baseURL}/brands/${id}`, formData, config)
            SweetAlert({ icon: "success", title: "Success", message: "Chỉnh sửa thương hiệu thành công" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
// delete brand action
export const deleteBrandAction = createAsyncThunk(
    "brand/delete", async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axiosClient.delete(`${baseURL}/brands/${id}`, config)
            SweetAlert({ icon: "success", title: "Success", message: "Xóa thương hiệu thành công" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })

// create brand action
export const fetchBrandAction = createAsyncThunk(
    "brand/fetch-all", async ({ page, limit, query }, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axiosClient.get(`${baseURL}/brands?page=${page}&limit=${limit}&query=${query}`)
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
        //  edit brand
        builder.addCase(editBrandAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(editBrandAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brand = action.payload;
            state.isUpdated = true;

        })
        builder.addCase(editBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brand = null;
            state.error = action.payload;
            state.isUpdated = false;

        })
        //  delete brand
        builder.addCase(deleteBrandAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(deleteBrandAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brand = action.payload;
            state.isDeleted = true;
        })
        builder.addCase(deleteBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brand = null;
            state.error = action.payload;
            state.isDeleted = false;
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
export const brandReducer = brandSlice.reducer;