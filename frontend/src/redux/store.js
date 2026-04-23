import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import AddressReducer from "./slices/addressSlice";
import orderReducer from "./slices/orderSlice";
<<<<<<< Updated upstream
import paymentReducer from "./slices/paymentSlice";
import wishlistReducer from "./slices/wishlistSlice";
=======
>>>>>>> Stashed changes

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    address: AddressReducer,
    order: orderReducer,
<<<<<<< Updated upstream
    payment: paymentReducer,
    wishlist: wishlistReducer,
=======
>>>>>>> Stashed changes
  },
});
