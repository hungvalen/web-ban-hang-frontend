import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction } from "../globalActions/globalAction";
import axiosClient from "../../../utils/axiosClient";
const initialState = {
    loading: false,
    error: null,
    users: [],
    user: null,
    profile: {},
    userAuth: {
        loading: false,
        error: null,
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    }
}

// login action
export const loginUserAction = createAsyncThunk(
    "users/login",
    async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
        try {
            // make the http request
            const { data } = await axios.post(`${baseURL}/users/login`, { email, password });
            // save the user info to local storage
            localStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

// register action
export const registerUserAction = createAsyncThunk(
    "users/register",
    async ({ fullName, email, password }, { rejectWithValue, getState, dispatch }) => {
        try {
            // make the http request
            const { data } = await axios.post(`${baseURL}/users/register`, { fullName, email, password });
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

// update user shipping address action
export const updateUserShippingAddressAction = createAsyncThunk(
    "users/update-shipping-address",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const { firstName, lastName, address, district, ward, postalCode, province, phone, country } = payload;
        console.log(payload)
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // make the http request
            const { data } = await axios.put(`${baseURL}/users/update/shipping`, { firstName, lastName, address, district, ward, postalCode, province, phone, country }, config);

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
            return rejectWithValue(error?.response?.data);
        }
    }
);

// user profile action
export const getUserProfileAction = createAsyncThunk(
    "users/profile-fetched",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // make the http request
            const { data } = await axiosClient.get(`/users/profile`, config);

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
            return rejectWithValue(error?.response?.data);
        }
    }
);
// users slice
const usersSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder) => {
        // handle login action
        // login
        builder.addCase(loginUserAction.pending, (state, action) => {
            state.userAuth.loading = true;
        });
        builder.addCase(loginUserAction.fulfilled, (state, action) => {
            state.userAuth.userInfo = action.payload;
            state.userAuth.loading = false;
            SweetAlert({ icon: "success", title: "Success", message: "Login successful" });
        });
        builder.addCase(loginUserAction.rejected, (state, action) => {
            state.userAuth.error = action.payload;
            state.userAuth.loading = false;
            SweetAlert({ icon: "error", title: "Error", message: action?.payload?.message });
        })

        // register
        builder.addCase(registerUserAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(registerUserAction.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
            SweetAlert({ icon: "success", title: "Success", message: "Register successful" });
        });
        builder.addCase(registerUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            SweetAlert({ icon: "error", title: "Error", message: action?.payload?.message });
        })
        // shipping address
        builder.addCase(updateUserShippingAddressAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(updateUserShippingAddressAction.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
            SweetAlert({ icon: "success", title: "Success", message: "Add shipping successfully" });
        });
        builder.addCase(updateUserShippingAddressAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            SweetAlert({ icon: "error", title: "Error", message: action?.payload?.message });
        })
        // get user profile
        builder.addCase(getUserProfileAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.loading = false;
        });
        builder.addCase(getUserProfileAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            SweetAlert({ icon: "error", title: "Error", message: action?.payload?.message });
        })
        // reset error action
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })
    }
})

// generate reducer
const usersReducer = usersSlice.reducer;
export default usersReducer;