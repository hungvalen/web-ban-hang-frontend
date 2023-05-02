import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import SweetAlert from "../../../components/Playground/SweetAlert";
// initialState
const initialState = {
    products: [],
    loading: false,
    product: {},
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
}

// create product action
export const createProductAction = createAsyncThunk(
    "product/create", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, description, category, sizes, brand, colors, price, totalQty, files } = payload;
            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
            // use formData
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("brand", brand);
            formData.append("price", price);
            formData.append("totalQty", totalQty);
            sizes.forEach((size) => {
                formData.append("sizes", size);
            })
            colors.forEach((color) => {
                formData.append("colors", color);
            })

            files.forEach((file) => {
                formData.append("files", file);
            })


            const { data } = await axios.post(`${baseURL}/products`,
                formData, config)

            SweetAlert({ icon: "success", title: "Success", message: "Product created successfully" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error.response.data.message });
            return rejectWithValue(error.response.data);
        }
    })

// fetch all product action
export const fetchAllProductAction = createAsyncThunk("product/list", async ({ url }, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.get(`${url}`, config);
        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})

// fetch single product action
export const fetchSingleProductAction = createAsyncThunk("product/details", async ( productId , { rejectWithValue, getState, dispatch }) => {
    console.log(productId)
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.get(`${baseURL}/products/${productId}`, config);
        return data;
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})
// slice
const productSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        // create product
        builder.addCase(createProductAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(createProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdded = true;
            state.product = action.payload;
        })

        builder.addCase(createProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.error = action.payload;
            state.isAdded = false;
        })


        // fetch all product
        builder.addCase(fetchAllProductAction.pending, (state, action) => {
            state.loading = true;
        }
        )
        builder.addCase(fetchAllProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        }
        )
        builder.addCase(fetchAllProductAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.products = null;
        }
        )
        // fetch single product
        builder.addCase(fetchSingleProductAction.pending, (state, action) => {
            state.loading = true;
        }
        )
        builder.addCase(fetchSingleProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
        }
        )
        builder.addCase(fetchSingleProductAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.product = null;
        }
        )
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })

    }
})

// generate reducer
export const productReducer = productSlice.reducer;