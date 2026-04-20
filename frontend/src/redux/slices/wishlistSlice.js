import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";

function rejectThunk(error, thunkAPI) {
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/wishlist");
      return data.wishlist;
    } catch (error) {
      return rejectThunk(error, thunkAPI);
    }
  },
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlistAsync",
  async (productId, thunkAPI) => {
    try {
      const { data } = await API.post(`/wishlist/${productId}`);
      return data.wishlist;
    } catch (error) {
      return rejectThunk(error, thunkAPI);
    }
  },
);

export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlistAsync",
  async (productId, thunkAPI) => {
    try {
      const { data } = await API.delete(`/wishlist/${productId}`);
      return data.wishlist;
    } catch (error) {
      return rejectThunk(error, thunkAPI);
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.products || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Failed to load wishlist";
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
