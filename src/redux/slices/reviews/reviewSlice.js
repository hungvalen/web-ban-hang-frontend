import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import SweetAlert from "../../../components/Playground/SweetAlert";
// initialState
const initialState = {
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
    reviews: [],
    review: {}
}

// create review action
export const createReviewAction = createAsyncThunk(
    "review/create", async ({ rating, message, id }, { rejectWithValue, getState, dispatch }) => {
        try {
            // make request
            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await axios.post(`${baseURL}/reviews/${id}`,
                {
                    rating,
                    message
                }, config)

            SweetAlert({ icon: "success", title: "Success", message: "Add review successfully" });

            return data
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error.response.data.message });
            return rejectWithValue(error.response.data);
        }
    })



// fetch order detail action
export const fetchOrderAction = createAsyncThunk("orders/details", async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.get(`${baseURL}/orders/${productId}`, config);
        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})

// slice
const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    extraReducers: (builder) => {
        // create product
        builder.addCase(createReviewAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createReviewAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.review = action.payload;
        })

        builder.addCase(createReviewAction.rejected, (state, action) => {
            state.loading = false;
            state.review = null;
            state.error = action.payload;
            state.isAdded = false;
        })

        // reset success and error
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })

    }
})

// generate reducer
export const reviewReducer = reviewsSlice.reducer;