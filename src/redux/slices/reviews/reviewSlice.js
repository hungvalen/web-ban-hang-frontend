import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import SweetAlert from "../../../components/Playground/SweetAlert";
import { useTranslation } from "../../../hooks/useTranslation";
import axiosClient from "../../../utils/axiosClient";
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



// fetch reviews action
export const fetchReviewsAction = createAsyncThunk("review/fetch", async ({ page, limit, query }, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axiosClient.get(`${baseURL}/reviews?page=${page}&limit=${limit}&query=${query}`, config);
        return data;
    } catch (error) {
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})
// update reviews status action
export const updateStatusReviewsAction = createAsyncThunk("review/update", async ({id,status,t}, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axiosClient.put(`${baseURL}/reviews/${id}`,{status} ,config);
        SweetAlert({ icon: "success", title: "Success", message: t});

        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})
// delete review action
export const deleteReviewsAction = createAsyncThunk("review/delete", async ({id,t}, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axiosClient.delete(`${baseURL}/reviews/${id}` ,config);
        SweetAlert({ icon: "success", title: "Success", message: t});

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
        // get reviews
        builder.addCase(fetchReviewsAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchReviewsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.reviews = action.payload;
        })

        builder.addCase(fetchReviewsAction.rejected, (state, action) => {
            state.loading = false;
            state.reviews = null;
            state.error = action.payload;
        })
        // update reviews
        builder.addCase(updateStatusReviewsAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateStatusReviewsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.review = action.payload;
            state.isUpdated = true;
        })

        builder.addCase(updateStatusReviewsAction.rejected, (state, action) => {
            state.loading = false;
            state.review = null;
            state.error = action.payload;
            state.isUpdated = false;
        })
        // delete review
        builder.addCase(deleteReviewsAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(deleteReviewsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isDeleted = true;
        })

        builder.addCase(deleteReviewsAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isDeleted = false;
        })

        // reset success and error
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
            state.isDeleted = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })

    }
})

// generate reducer
export const reviewReducer = reviewsSlice.reducer;