import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

function thunk(error, thunkAPI) {
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

export const createOrderAsync = createAsyncThunk(
  "order/create",
  async ({ items, shippingAddress, paymentMethod }, thunkAPI) => {
    try {
      const { data } = await API.post("/order", {
        items,
        shippingAddress,
        paymentMethod,
      });

      return data.order;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

export const fetchMyOrdersAsync = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/order/my");
      return data.orders;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

export const fetchSingleOrderAsync = createAsyncThunk(
  "order/fetchSingle",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await API.get(`/order/${orderId}`);
      // console.log("order data redux:", data.order);
      return data.order;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

const initialState = {
  currentOrder: null,
  myOrders: [],
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Order creation failed";
      })

      .addCase(fetchMyOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch my orders";
      })

      .addCase(fetchSingleOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchSingleOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch order";
      });
  },
});

export const { resetOrderState, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
