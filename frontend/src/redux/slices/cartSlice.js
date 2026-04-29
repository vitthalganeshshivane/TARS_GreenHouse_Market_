import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

function thunk(error, thunkAPI) {
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

// ADD TO CART
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, variantLabel, quantity }, thunkAPI) => {
    try {
      console.log("ADD TO CART PAYLOAD:", {
        productId,
        variantLabel,
        quantity,
      });
      const { data } = await API.post("/cart/add", {
        productId,
        variantLabel,
        quantity,
      });

      return data.cart;
    } catch (error) {
      console.log(
        "Error in Add in cart:",
        error.response?.data || error.message,
      );
      return thunk(error, thunkAPI);
    }
  },
);

// UPDATE CART
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
      return thunk(error, thunkAPI);
    }
  },
);

// REMOVE CART ITEM
export const removeCartAsync = createAsyncThunk(
  "cart/removeCartAsync",
  async ({ productId, variantLabel }, thunkAPI) => {
    try {
      const { data } = await API.delete("/cart/remove", {
        data: { productId, variantLabel },
      });

      return data.cart;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

// FETCH CART
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const { data } = await API.get("/cart");
  return data.cart;
});

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  prevState: null,
};

const calculateTotal = (items) => {
  return items.reduce(
    (total, item) => total + item.variant.priceAtTime * item.quantity,
    0,
  );
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

    // OPTIMISTIC ADD
    optimisticAdd: (state, action) => {
      const {
        productId,
        variantLabel,
        price,
        name,
        image,
        quantity = 1,
      } = action.payload;

      state.prevState = JSON.parse(JSON.stringify(state));

      const item = state.items.find(
        (i) =>
          (i.product?._id || i.product) === productId &&
          i.variant.label === variantLabel,
      );

      if (item) {
        item.quantity = quantity;
      } else {
        state.items.push({
          product: {
            _id: productId,
          },
          quantity,
          name,
          image,
          variant: {
            label: variantLabel,
            priceAtTime: price,
          },
        });
      }

      state.totalAmount = calculateTotal(state.items);
    },

    // OPTIMISTIC UPDATE
    optimisticUpdate: (state, action) => {
      const { productId, variantLabel, quantity } = action.payload;

      state.prevState = JSON.parse(JSON.stringify(state));

      const item = state.items.find(
        (i) =>
          (i.product?._id || i.product) === productId &&
          i.variant.label === variantLabel,
      );

      if (item) {
        item.quantity = quantity;
      }

      state.totalAmount = calculateTotal(state.items);
    },

    // OPTIMISTIC REMOVE
    optimisticRemove: (state, action) => {
      const { productId, variantLabel } = action.payload;

      state.prevState = JSON.parse(JSON.stringify(state));

      state.items = state.items.filter(
        (i) =>
          !(
            (i.product?._id || i.product) === productId &&
            i.variant.label === variantLabel
          ),
      );

      state.totalAmount = calculateTotal(state.items);
    },

    // ROLLBACK
    rollback: (state) => {
      if (state.prevState) {
        return state.prevState;
      }
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH SUCCESS
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
      })

      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })

      // ALL CART SUCCESS ACTIONS
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

      // ALL CART FAILURES → ROLLBACK
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
  optimisticUpdate,
  optimisticRemove,
  rollback,
  clearCartLocal,
} = cartSlice.actions;

export default cartSlice.reducer;
