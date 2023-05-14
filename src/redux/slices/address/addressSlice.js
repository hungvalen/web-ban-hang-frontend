import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
import SweetAlert from "../../../components/Playground/SweetAlert";

// initialState
const initialState = {
    provinces: [],
    districts: [],
    wards: [],
    loading: false,
    error: null,
}

const provinceURL = "https://vapi.vnappmob.com"
// create brand action
export const fetchProvinceAction = createAsyncThunk(
    "address/fetch-province", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { data } = await axios.get(`${provinceURL}/api/province/`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
export const fetchDistrictAction = createAsyncThunk(
    "address/fetch-district", async (payload, { rejectWithValue, getState, dispatch }) => {
        const { province_id } = payload;
        try {
            const { data } = await axios.get(`${provinceURL}/api/province/district/${province_id}`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })

export const fetchWardAction = createAsyncThunk(
    "address/fetch-ward", async (payload, { rejectWithValue, getState, dispatch }) => {
        const { district_id } = payload;
        try {
            const { data } = await axios.get(`${provinceURL}/api/province/ward/${district_id}`)
            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });

            return rejectWithValue(error.response.data);
        }
    })
// slice
const addressSlice = createSlice({
    name: "address",
    initialState,
    extraReducers: (builder) => {
        // fetch all color
        builder.addCase(fetchProvinceAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchProvinceAction.fulfilled, (state, action) => {
            state.loading = false;
            state.provinces = action.payload;
        })
        builder.addCase(fetchProvinceAction.rejected, (state, action) => {
            state.loading = false;
            state.provinces = null;
            state.error = action.payload;
        })
        builder.addCase(fetchDistrictAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchDistrictAction.fulfilled, (state, action) => {
            state.loading = false;
            state.districts = action.payload;
        })
        builder.addCase(fetchDistrictAction.rejected, (state, action) => {
            state.loading = false;
            state.districts = null;
            state.error = action.payload;
        })
        builder.addCase(fetchWardAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(fetchWardAction.fulfilled, (state, action) => {
            state.loading = false;
            state.wards = action.payload;
        })
        builder.addCase(fetchWardAction.rejected, (state, action) => {
            state.loading = false;
            state.wards = null;
            state.error = action.payload;
        })
    }
})

// generate reducer
export const addressReducer = addressSlice.reducer;