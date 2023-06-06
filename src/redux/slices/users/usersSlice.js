import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import SweetAlert from "../../../components/Playground/SweetAlert";
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
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
    },
    isUpdated: false,
    isAdded: false,
    isAddShippingAddress: false,
    isDeleted: false,
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

// user profile action
export const getListUsersAction = createAsyncThunk(
    "users/list-users",
    async ({ page, limit }, { rejectWithValue, getState, dispatch }) => {

        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // make the http request
            const { data } = await axiosClient.get(`/users/user-list?page=${page}&limit=${limit}`, config);

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
            return rejectWithValue(error?.response?.data);
        }
    }
);

// delete profile action
export const deleteUserAction = createAsyncThunk(
    "users/delete-user",
    async (id, { rejectWithValue, getState, dispatch }) => {

        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // make the http request
            const { data } = await axiosClient.delete(`/users/${id}/delete`, config);
            SweetAlert({ icon: "success", title: "Success", message: "User deleted successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
            return rejectWithValue(error?.response?.data);
        }
    }
);

// create user action
export const createUserAction = createAsyncThunk(
    "users/create-user",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const { fullName, email, address, phone, dateOfBirth, gender, password, role, } = payload;

        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // make the http request
            const { data } = await axiosClient.post(`users/create`, {
                fullName, email, address, phone, dateOfBirth, gender, password, role,
            }, config);
            SweetAlert({ icon: "success", title: "Success", message: "User created successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
            return rejectWithValue(error?.response?.data);
        }
    }
);

// update user  profile action
export const updateUserAction = createAsyncThunk(
    "users/update-user",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        const { id, fullName, email, phone, role } = payload;
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            // make the http request
            const { data } = await axiosClient.put(`/users/${id}/update`, {
                fullName,
                email,
                phone,
                role
            }, config);
            SweetAlert({ icon: "success", title: "Success", message: "User updated successfully" });

            return data;
        } catch (error) {
            console.log(error);
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
            state.isAddShippingAddress = true;
            SweetAlert({ icon: "success", title: "Success", message: "Add shipping successfully" });
        });
        builder.addCase(updateUserShippingAddressAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.isAddShippingAddress = false;
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

        // get user list
        builder.addCase(getListUsersAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(getListUsersAction.fulfilled, (state, action) => {
            state.users = action.payload;
            state.loading = false;
        });
        builder.addCase(getListUsersAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.users = null;
        })

        // delete user
        builder.addCase(deleteUserAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(deleteUserAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isDeleted = true;
        });
        builder.addCase(deleteUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.isDeleted = false;
        })

        // update user
        builder.addCase(updateUserAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(updateUserAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.user = action.payload;
        });
        builder.addCase(updateUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.isUpdated = false;
        })

        // create user
        builder.addCase(createUserAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(createUserAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.user = action.payload;
        });
        builder.addCase(createUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.isAdded = false;
        })

        // reset success action
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isDeleted = false;
            state.isUpdated = false;
            state.isAdded = false;
            state.isAddShippingAddress = false;
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