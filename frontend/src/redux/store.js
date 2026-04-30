import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import AddressReducer from "./slices/addressSlice";
import orderReducer from "./slices/orderSlice";
import paymentReducer from "./slices/paymentSlice";
import wishlistReducer from "./slices/wishlistSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    address: AddressReducer,
    order: orderReducer,
    payment: paymentReducer,
    wishlist: wishlistReducer,
    review: reviewReducer,
  },
});
