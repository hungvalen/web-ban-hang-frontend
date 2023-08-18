import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseURL from "../../../utils/baseURL";
import axios from "axios";
import { Swal } from "sweetalert2"
import { resetErrorAction, resetSuccessAction } from "../globalActions/globalAction";
import SweetAlert from "../../../components/Playground/SweetAlert";
import { useTransition } from "react";
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
// update product action
export const updateProductAction = createAsyncThunk(
    "product/update", async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, description, category, sizes, brand, colors, price, files, totalQty, id } = payload;
            console.log(payload)
            // const { t } = useTransition();

            // make request

            // token
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
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
            const { data } = await axios.put(`${baseURL}/products/${id}`,
                formData, config)
            SweetAlert({ icon: "success", title: "Success", message: "Chỉnh sửa sản phẩm thành công" });

            return data;
        } catch (error) {
            SweetAlert({ icon: "error", title: "Oops", message: error.response.data.message });
            return rejectWithValue(error.response.data);
        }
    })

// fetch all product action
export const fetchAllProductAction = createAsyncThunk("product/list", async ({ url, page, limit, name }, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        if (url === `${baseURL}/products`) {
            const { data } = await axios.get(`${url}?page=${page}&limit=${limit}&name=${name}`, config);
            return data;
        }
        else {
            const { data } = await axios.get(`${url}&page=${page}&limit=${limit}&name=${name}`, config);
            return data;
        }
    } catch (error) {
        console.log(error);
        SweetAlert({ icon: "error", title: "Oops", message: error?.response?.data?.message });
        return rejectWithValue(error?.response?.data);
    }
})

// fetch single product action
export const fetchSingleProductAction = createAsyncThunk("product/details", async (productId, { rejectWithValue, getState, dispatch }) => {
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

// fetch single product action
export const deleteProductAction = createAsyncThunk("product/delete", async (id, { rejectWithValue, getState, dispatch }) => {
    try {
        // make request
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const { data } = await axios.delete(`${baseURL}/products/${id}/delete`, config);
        SweetAlert({ icon: "success", title: "Success", message: "Xoá sản phẩm thành công" });
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

        // update product
        builder.addCase(updateProductAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(updateProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isUpdated = true;
            state.product = action.payload;
        })

        builder.addCase(updateProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.error = action.payload;
            state.isUpdated = false;
        })

        // delete product
        builder.addCase(deleteProductAction.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(deleteProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isDeleted = true;
        })

        builder.addCase(deleteProductAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isDeleted = false;
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
            state.isUpdated = false;
            state.isDeleted = false;
        })
        builder.addCase(resetErrorAction.pending, (state, action) => {
            state.error = null;
        })

    }
})

// generate reducer
export const productReducer = productSlice.reducer;