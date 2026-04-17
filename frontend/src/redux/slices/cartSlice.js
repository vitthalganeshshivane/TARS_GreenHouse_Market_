import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

function thunk(error, thunkAPI) {
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, variantLabel, quantity }, thunkAPI) => {
    try {
      const { data } = await API.post("/cart/add", {
        productId,
        variantLabel,
        quantity,
      });

      return data.cart;
    } catch (error) {
      return thunkAPI(error, thunkAPI);
    }
  },
);

export const updateCartAsync = createAsyncThunk(
  "cart/updateCartAsync",
  async ({ productId, variantLabel, quantity }, thunkAPI) => {
    try {
      const { data } = await API.put("/cart/update", {
        productId,
        variantLabel,
        quantity,
      });

      return data.cart;
    } catch (error) {
      return thunkAPI(error, thunkAPI);
    }
  },
);

export const removeCartAsync = createAsyncThunk(
  "cart/removeCartAsync",
  async ({ productId, variantLabel }, thunkAPI) => {
    try {
      const { data } = await API.delete("/cart/remove", {
        data: { productId, variantLabel },
      });

      return data.cart;
    } catch (error) {
      return thunkAPI(error, thunkAPI);
    }
  },
);

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const { data } = await API.get("/cart");
  return data.cart;
});

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,

  // 🔥 for rollback
  prevState: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.prevState = null;
    },
    optimisticAdd: (state, action) => {
      const { productId, variantLabel, price, name, image } = action.payload;

      state.prevState = JSON.parse(JSON.stringify(state));

      const item = state.items.find(
        (i) => i.product === productId && i.variant.label === variantLabel,
      );

      if (item) {
        item.quantity = action.payload.quantity || 1;
      } else {
        state.items.push({
          product: productId,
          quantity: 1,
          name,
          image,
          variant: {
            label: variantLabel,
            priceAtTime: price,
          },
        });
      }

      state.totalAmount += price;
    },

    optimisticUpdate: (state, action) => {
      const { productId, variantLabel, quantity } = action.payload;

      state.prevState = JSON.parse(JSON.stringify(state));

      const item = state.items.find(
        (i) => i.product === productId && i.variant.label === variantLabel,
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    optimisticRemove: (state, action) => {
      const { productId, variantLabel } = action.payload;

      state.prevState = JSON.parse(JSON.stringify(state));

      state.items = state.items.filter(
        (i) => !(i.product === productId && i.variant.label === variantLabel),
      );
    },

    rollback: (state) => {
      if (state.prevState) {
        return state.prevState;
      }
    },
  },

  extraReducers: (builder) => {
    builder

      // fetch
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })

      //   success - sync real data
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") && action.type.includes("cart/"),
        (state, action) => {
          if (action.payload?.items) {
            state.items = action.payload.items;
            state.totalAmount = action.payload.totalAmount;
          }
        },
      )

      // failure - rollback
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") && action.type.includes("cart/"),
        (state) => {
          if (state.prevState) {
            return state.prevState;
          }
        },
      );
  },
});

export const {
  optimisticAdd,
  optimisticRemove,
  optimisticUpdate,
  rollback,
  clearCartLocal,
} = cartSlice.actions;

export default cartSlice.reducer;
