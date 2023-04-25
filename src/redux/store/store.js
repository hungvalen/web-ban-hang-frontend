import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import { productReducer } from "../slices/products/productSlices";
import { categoryReducer } from "../slices/categories/categoriesSlice";
import { brandReducer } from "../slices/brand/brandSlice";
import { colorReducer } from "../slices/color/colorSlice";

// store
const store = configureStore({
    reducer: {
        users: usersReducer,
        product: productReducer,
        category: categoryReducer,
        brand: brandReducer,
        color: colorReducer,
    }
});

export default store