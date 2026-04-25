import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

function thunk(error, thunkAPI) {
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
}

// fetch all
export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/address");
      return data.addresses;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

//create
export const createAddressAsync = createAsyncThunk(
  "address/create",
  async ({ data }, thunkAPI) => {
    try {
      const res = await API.post(`/address`, data);
      console.log("Creating Address:", res.data.address);
      return res.data.address;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

// update
export const updateAddressAsync = createAsyncThunk(
  "address/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await API.put(`/address/${id}`, data);
      return res.data.address;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

// delete
export const deleteAddressAsync = createAsyncThunk(
  "address/delete",
  async (id, thunkAPI) => {
    try {
      const { data } = await API.delete(`/address/${id}`);
      return id;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

// set default
export const setDefaultAddressAsync = createAsyncThunk(
  "address/setDefault",
  async (id, thunkAPI) => {
    try {
      const { data } = await API.patch(`/address/${id}/default`);
      return data.address;
    } catch (error) {
      return thunk(error, thunkAPI);
    }
  },
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createAddressAsync.fulfilled, (state, action) => {
        state.addresses.unshift(action.payload);
      })

      // update
      .addCase(updateAddressAsync.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(
          (a) => a._id === action.payload._id,
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })

      // delete
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (a) => a._id !== action.payload,
        );
      })

      // set default
      .addCase(setDefaultAddressAsync.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((a) => ({
          ...a,
          isDefault: a._id === action.payload._id,
        }));
      });
  },
});

export default addressSlice.reducer;
