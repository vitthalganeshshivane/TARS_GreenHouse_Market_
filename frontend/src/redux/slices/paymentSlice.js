import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPaymentSessionApi,
  verifyPaymentStatusApi,
} from "../../api/paymentAPI";

export const createPaymentSessionAsync = createAsyncThunk(
  "payment/create",
  async (payload, thunkAPI) => {
    try {
      const { data } = await createPaymentSessionApi(payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to create payment session" },
      );
    }
  },
);

export const verifyPaymentStatusAsync = createAsyncThunk(
  "payment/verify",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await verifyPaymentStatusApi(orderId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to verify payment" },
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    session: null,
    verification: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.session = null;
      state.verification = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createPaymentSessionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentSessionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.data;
      })
      .addCase(createPaymentSessionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      .addCase(verifyPaymentStatusAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPaymentStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.verification = action.payload;
      })
      .addCase(verifyPaymentStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Verification failed";
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
