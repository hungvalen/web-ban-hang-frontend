import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import axiosClient from "../../../utils/axiosClient";
// initialState
const initialState = {
    chats: [],
    loading: false,
    chat: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create brand action
export const sendMessageAction = createAsyncThunk(
    "chat/send", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { message } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axiosClient.post(`${baseURL}/chat/send`, {
                message
            }, config)

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })

// fetch message
export const fetchBrandAction = createAsyncThunk(
    "chat/get-message", async ({ page, limit, query }, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axiosClient.get(`${baseURL}/chat`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
// slice
const chatSlice = createSlice({
    name: "chat",
    initialState,
    extraReducers: (builder) => {
        // send message
        builder.addCase(sendMessageAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(sendMessageAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.chats = action.payload;
        })
        builder.addCase(sendMessageAction.rejected, (state, action) => {
            state.loading = false;
            state.chats = null;
            state.error = action.payload;
            state.isAdded = false;
        })
        // get all message
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
            state.isUpdated = false;
            state.isDeleted = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })
    }
})

// generate reducer
export const chatReducer = chatSlice.reducer;