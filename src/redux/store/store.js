import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import { productReducer } from "../slices/products/productSlices";
import { categoryReducer } from "../slices/categories/categoriesSlice";
import { brandReducer } from "../slices/brand/brandSlice";
import { colorReducer } from "../slices/color/colorSlice";
import { cartReducer } from "../slices/cart/cartSlices";
import { couponReducer } from "../slices/coupons/couponSlice";
import { addressReducer } from "../slices/address/addressSlice";
import { orderReducer } from "../slices/orders/ordersSlice";
import { reviewReducer } from "../slices/reviews/reviewSlice";
import { shippingUnitReducer } from "../slices/shipping-unit/shippingUnitSlice";
import { PaymentMethodReducer } from "../slices/payment-method/paymentMethodSlice";

// store
const store = configureStore({
    reducer: {
        users: usersReducer,
        product: productReducer,
        category: categoryReducer,
        shippingUnit: shippingUnitReducer,
        paymentMethod: PaymentMethodReducer,
        brand: brandReducer,
        color: colorReducer,
        carts: cartReducer,
        coupons: couponReducer,
        address: addressReducer,
        orders: orderReducer,
        reviews: reviewReducer,
    }
});

export default store