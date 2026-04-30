import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteReviewApi,
  fetchMyReviewApi,
  fetchProductReviewsApi,
  upsertReviewApi,
} from "../../api/review";

function rejectWithMessage(error, thunkAPI) {
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

export const fetchProductReviewsAsync = createAsyncThunk(
  "review/fetchProductReviews",
  async (productId, thunkAPI) => {
    try {
      const { data } = await fetchProductReviewsApi(productId);
      return data;
    } catch (error) {
      return rejectWithMessage(error, thunkAPI);
    }
  },
);

export const fetchMyReviewAsync = createAsyncThunk(
  "review/fetchMyReview",
  async (productId, thunkAPI) => {
    try {
      const { data } = await fetchMyReviewApi(productId);
      return data.review;
    } catch (error) {
      return rejectWithMessage(error, thunkAPI);
    }
  },
);

export const submitReviewAsync = createAsyncThunk(
  "review/submitReview",
  async ({ productId, formData }, thunkAPI) => {
    try {
      const { data } = await upsertReviewApi(productId, formData);
      return data;
    } catch (error) {
      return rejectWithMessage(error, thunkAPI);
    }
  },
);

export const deleteReviewAsync = createAsyncThunk(
  "review/deleteReview",
  async ({ reviewId }, thunkAPI) => {
    try {
      const { data } = await deleteReviewApi(reviewId);
      return { reviewId, ...data };
    } catch (error) {
      return rejectWithMessage(error, thunkAPI);
    }
  },
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    items: [],
    ratings: { average: 0, count: 0 },
    myReview: null,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearReviewState: (state) => {
      state.items = [];
      state.ratings = { average: 0, count: 0 };
      state.myReview = null;
      state.loading = false;
      state.submitting = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviewsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviewsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.reviews || [];
        state.ratings = action.payload.ratings || { average: 0, count: 0 };
      })
      .addCase(fetchProductReviewsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload?.message ||
          "Failed to load reviews";
      })
      .addCase(fetchMyReviewAsync.fulfilled, (state, action) => {
        state.myReview = action.payload || null;
      })
      .addCase(submitReviewAsync.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitReviewAsync.fulfilled, (state, action) => {
        state.submitting = false;
        state.myReview = action.payload.review;
        const existingIndex = state.items.findIndex(
          (item) => item._id === action.payload.review._id,
        );

        if (existingIndex !== -1) {
          state.items[existingIndex] = action.payload.review;
        } else {
          state.items.unshift(action.payload.review);
        }

        state.ratings = action.payload.ratings || state.ratings;
      })
      .addCase(submitReviewAsync.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload?.message || action.payload || "Failed to save review";
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.reviewId,
        );
        state.myReview = null;
        if (action.payload.ratings) {
          state.ratings = action.payload.ratings;
        }
      });
  },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
