import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
// initialState
const initialState = {
    colors: [],
    loading: false,
    color: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create color action
export const createColorAction = createAsyncThunk(
    "color/create", async (payload, { rejectWithValue, getState, dispatch }) => {
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
            const { data } = await axios.post(`${baseURL}/api/color`, {
                name,
            }, config)
            Swal.fire({
                icon: "success",
                title: "Color created successfully",
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
export const fetchColorAction = createAsyncThunk(
    "color/fetch-all", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${baseURL}/color`)
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
const colorSlice = createSlice({
    name: "colors",
    initialState,
    extraReducers: (builder) => {
        // create category
        builder.addCase(createColorAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createColorAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.color = action.payload;
            // state.products.push(action.payload);
        })
        builder.addCase(createColorAction.rejected, (state, action) => {
            state.loading = false;
            state.color = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // fetch all color
        builder.addCase(fetchColorAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchColorAction.fulfilled, (state, action) => {
            state.loading = false;
            state.colors = action.payload;
            // state.products.push(action.payload);
        })
        builder.addCase(fetchColorAction.rejected, (state, action) => {
            state.loading = false;
            state.colors = null;
            state.error = action.payload;
        })
    }
})

// generate reducer
export const colorReducer = colorSlice.reducer;